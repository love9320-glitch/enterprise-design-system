// NoticeWritingTemplate — 안내문 작성 템플릿 (Figma "Notice Writing Template", state=site/email/sms)
// 채널 탭(채용사이트/이메일/SMS 안내문) + 제목 입력 + 첨부파일 + 본문 에디터를 한 덩어리로 묶은
// 완전 옵션형 템플릿(규칙 4 — Tabs·Input·FileUploadButton·Editor 조립).
//   - site/email : 제목 Input + [첨부파일] FileUploadButton(업로드 메뉴 팝오버) + 풀 툴바 Editor(머지필드 포함)
//   - sms        : 바이트 안내 문구 + 축약 툴바 Editor(undo/redo·머지필드만, SMS 평문)
// 채널·제목·본문·첨부는 내부 상태로 동작하며(채널만 controlled 지원), 색·간격은 하위 컴포넌트 토큰을 따른다.
// 작성 내용은 onChange 스냅샷으로 반출한다(2026-07-07 감사 — 값 반출 계약 없이는 저장/발송이 불가능했음).
import { useState } from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import { Paperclip } from 'lucide-react';
import { Tabs } from './Tabs';
import { Input } from './Input';
import { FileUploadButton } from './FileUploadButton';
import { Editor } from './Editor';

// 채널 값 — 'site' | 'email' | 'sms'
type NoticeChannel = 'site' | 'email' | 'sms';

// 채널 정의 — 탭 라벨과 제목 placeholder. sms는 제목 없이 안내 문구를 노출한다.
const CHANNELS: { value: NoticeChannel; label: string; titlePlaceholder?: string }[] = [
  { value: 'site',  label: '채용사이트 안내문', titlePlaceholder: '채용 사이트안내문 제목을 입력하세요' },
  { value: 'email', label: '이메일 안내문',   titlePlaceholder: '이메일 안내문 제목을 입력하세요' },
  { value: 'sms',   label: 'SMS 안내문' },
];

const SMS_INFO = '90byte를 초과(한글 45자)하면 멀티 문자로 전환되며, 발송 비용이 변경될 수 있습니다.';
// SMS는 평문이라 서식 없이 실행취소/다시실행 + 머지필드만 노출한다.
const SMS_TOOLBAR = ['undo', 'redo', 'mergefield'];

// 첨부 항목 — 표시용 name/size + 원본 File(.file — 소비자가 실제 업로드에 사용)
interface NoticeAttachment {
  name: string;
  size: number; // MB(소수 1자리)
  id: string;
  file: File;
}

// onChange 반출 스냅샷 — { channel, titles: {site,email,sms}, bodies: {site,email,sms},
//   attachments: {site,email,sms} } (attachments 항목에 원본 File은 .file)
interface NoticeWritingValues {
  channel: NoticeChannel;
  titles: Record<NoticeChannel, string>;
  bodies: Record<NoticeChannel, string>;
  attachments: Record<NoticeChannel, NoticeAttachment[]>;
}

interface NoticeWritingTemplateProps extends Omit<ComponentPropsWithoutRef<'div'>, 'onChange'> {
  channel?: NoticeChannel; // controlled 채널값('site'|'email'|'sms')
  defaultChannel?: NoticeChannel; // uncontrolled 초기 채널
  onChannelChange?: (channel: NoticeChannel) => void;
  onChange?: (values: NoticeWritingValues) => void; // 작성 내용이 바뀔 때마다 전체 스냅샷 반출
  showTabs?: boolean; // 채널 탭 노출 여부(false면 단일 채널 모드)
  tabVariant?: 'fill' | 'hug'; // 탭 너비 타입: 'fill'(균등 분할, 기본) | 'hug'(내용 폭)
  enabledChannels?: NoticeChannel[]; // 활성 채널 목록(['site','email','sms']) — 미지정 시 전체 활성. 밖의 탭은 disabled
  mergeFields?: (string | { label: string; value: string })[]; // Editor 머지필드 목록
  defaultBodies?: Partial<Record<NoticeChannel, string>>; // 채널별 초기 본문 HTML — { site?, email?, sms? }
  showAttach?: boolean; // 첨부파일 버튼 노출 여부(false면 제목 입력만 전체 폭)
  maxAttachments?: number; // 첨부 최대 개수
  attachGuide?: string; // 업로드 메뉴 안내 문구
  attachAccept?: string; // <input accept> 필터(예: '.pdf,.doc') — guide와 직접 일치시킬 것
  editorMinHeight?: number | string; // 본문 최소 높이(px)
  editorMaxHeight?: number | string; // 지정 시 본문 세로 스크롤(ScrollArea)
  editorReadOnly?: boolean; // 본문 편집 비활성(툴바 숨김·읽기 전용)
  editorPlaceholder?: string; // 본문 빈 안내 문구(Editor 기본값 사용 시 생략)
}

const emptyByChannel = (): Record<NoticeChannel, NoticeAttachment[]> => ({ site: [], email: [], sms: [] });

export function NoticeWritingTemplate({
  channel: channelProp,
  defaultChannel = 'site',
  onChannelChange,
  onChange,
  showTabs = true,
  tabVariant = 'fill',
  enabledChannels,
  mergeFields = [],
  defaultBodies,
  showAttach = true,
  maxAttachments = 5,
  attachGuide = '파일을 첨부하세요 (파일당 최대 10MB).',
  attachAccept,
  editorMinHeight = 360,
  editorMaxHeight,
  editorReadOnly = false,
  editorPlaceholder,
  className = '',
  ...props
}: NoticeWritingTemplateProps) {
  const controlled = channelProp !== undefined;
  const [internal, setInternal] = useState<NoticeChannel>(defaultChannel);
  const isEnabled = (v: NoticeChannel) => !enabledChannels || enabledChannels.includes(v);
  const rawChannel = controlled ? channelProp : internal;
  // 현재 채널이 비활성이면 첫 활성 채널로 표시 폴백(파생값 — 다시 활성화되면 원래 채널로 복귀)
  const channel = isEnabled(rawChannel)
    ? rawChannel
    : (CHANNELS.find((c) => isEnabled(c.value))?.value ?? rawChannel);
  const setChannel = (v: NoticeChannel) => {
    if (!controlled) setInternal(v);
    onChannelChange?.(v);
  };

  // 채널별 제목·본문·첨부는 내부 상태로 유지(채널 전환 시 각자 보존).
  // 변경 시마다 onChange로 전체 스냅샷을 반출한다 — 소비자는 이 값으로 저장/발송한다.
  const [titles, setTitles] = useState<Record<NoticeChannel, string>>({ site: '', email: '', sms: '' });
  const [bodies, setBodies] = useState<Record<NoticeChannel, string>>(() => ({ site: '', email: '', sms: '', ...(defaultBodies || {}) }));
  const [files, setFiles] = useState<Record<NoticeChannel, NoticeAttachment[]>>(emptyByChannel);

  const emitChange = (patch: Partial<NoticeWritingValues>) =>
    onChange?.({ channel, titles, bodies, attachments: files, ...patch });

  const current = CHANNELS.find((c) => c.value === channel) ?? CHANNELS[0];
  const isSms = channel === 'sms';

  const setTitle = (value: string) => {
    const next = { ...titles, [channel]: value };
    setTitles(next);
    emitChange({ titles: next });
  };
  const setBody = (html: string) => {
    const next = { ...bodies, [channel]: html };
    setBodies(next);
    emitChange({ bodies: next });
  };
  const addFiles = (fileList: FileList | File[]) => {
    const next = {
      ...files,
      [channel]: [
        ...files[channel],
        ...Array.from(fileList).map((f) => ({
          name: f.name,
          size: Math.max(0.1, Math.round((f.size / 1048576) * 10) / 10), // MB(소수 1자리)
          id: `${f.name}-${f.size}-${Date.now()}`,
          file: f, // 원본 File — 소비자가 실제 업로드에 사용(표시용 name/size만 남기면 발송 불가)
        })),
      ].slice(0, maxAttachments),
    };
    setFiles(next);
    emitChange({ attachments: next });
  };
  const deleteFile = (_file: unknown, index: number) => {
    const next = { ...files, [channel]: files[channel].filter((_, i) => i !== index) };
    setFiles(next);
    emitChange({ attachments: next });
  };

  return (
    <div className={`flex w-full flex-col gap-spacing-6 ${className}`} {...props}>
      {showTabs && (
        <Tabs
          items={CHANNELS.map(({ value, label }) => ({ value, label, disabled: !isEnabled(value) }))}
          value={channel}
          onChange={setChannel}
          variant={tabVariant}
        />
      )}

      {isSms ? (
        <p className="text-12 text-font-icon-4">{SMS_INFO}</p>
      ) : (
        <div className="flex items-start gap-spacing-6">
          <div className="min-w-0 flex-1">
            <Input
              width="100%"
              placeholder={current.titlePlaceholder}
              value={titles[channel]}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          {showAttach && (
            <FileUploadButton
              triggerText="첨부파일"
              buttonProps={{ leftIcon: Paperclip }}
              placement="auto-right"
              menuWidth={320}
              files={files[channel]}
              guide={attachGuide}
              accept={attachAccept}
              maxCount={maxAttachments}
              onAdd={addFiles}
              onDelete={deleteFile}
            />
          )}
        </div>
      )}

      <Editor
        value={bodies[channel]}
        onChange={setBody}
        mergeFields={mergeFields}
        toolbar={isSms ? SMS_TOOLBAR : undefined}
        showSource={!isSms}
        minHeight={editorMinHeight}
        maxHeight={editorMaxHeight}
        readOnly={editorReadOnly}
        {...(editorPlaceholder ? { placeholder: editorPlaceholder } : {})}
      />
    </div>
  );
}
