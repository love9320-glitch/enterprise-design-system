// NoticeWritingTemplate — 안내문 작성 템플릿 (Figma "Notice Writing Template", state=site/email/sms)
// 채널 탭(채용사이트/이메일/SMS 안내문) + 제목 입력 + 첨부파일 + 본문 에디터를 한 덩어리로 묶은
// 완전 옵션형 템플릿(규칙 4 — Tabs·Input·FileUploadButton·Editor 조립).
//   - site/email : 제목 Input + [첨부파일] FileUploadButton(업로드 메뉴 팝오버) + 풀 툴바 Editor(머지필드 포함)
//   - sms        : 바이트 안내 문구 + 축약 툴바 Editor(undo/redo·머지필드만, SMS 평문)
// 채널·제목·본문·첨부는 내부 상태로 동작하며(채널만 controlled 지원), 색·간격은 하위 컴포넌트 토큰을 따른다.
import { useState } from 'react';
import { Paperclip } from 'lucide-react';
import { Tabs } from './Tabs';
import { Input } from './Input';
import { FileUploadButton } from './FileUploadButton';
import { Editor } from './Editor';

// 채널 정의 — 탭 라벨과 제목 placeholder. sms는 제목 없이 안내 문구를 노출한다.
const CHANNELS = [
  { value: 'site',  label: '채용사이트 안내문', titlePlaceholder: '채용 사이트안내문 제목을 입력하세요' },
  { value: 'email', label: '이메일 안내문',   titlePlaceholder: '이메일 안내문 제목을 입력하세요' },
  { value: 'sms',   label: 'SMS 안내문' },
];

const SMS_INFO = '90byte를 초과(한글 45자)하면 멀티 문자로 전환되며, 발송 비용이 변경될 수 있습니다.';
// SMS는 평문이라 서식 없이 실행취소/다시실행 + 머지필드만 노출한다.
const SMS_TOOLBAR = ['undo', 'redo', 'mergefield'];

const emptyByChannel = () => ({ site: [], email: [], sms: [] });

export function NoticeWritingTemplate({
  channel: channelProp,      // controlled 채널값('site'|'email'|'sms')
  defaultChannel = 'site',   // uncontrolled 초기 채널
  onChannelChange,           // (channel) => void
  showTabs = true,           // 채널 탭 노출 여부(false면 단일 채널 모드)
  tabVariant = 'fill',       // 탭 너비 타입: 'fill'(균등 분할, 기본) | 'hug'(내용 폭)
  enabledChannels,           // 활성 채널 목록(['site','email','sms']) — 미지정 시 전체 활성. 밖의 탭은 disabled
  mergeFields = [],          // Editor 머지필드 목록
  defaultBodies,             // 채널별 초기 본문 HTML — { site?, email?, sms? }
  showAttach = true,         // 첨부파일 버튼 노출 여부(false면 제목 입력만 전체 폭)
  maxAttachments = 5,        // 첨부 최대 개수
  attachGuide = '파일을 첨부하세요 (파일당 최대 10MB).', // 업로드 메뉴 안내 문구
  attachAccept,              // <input accept> 필터(예: '.pdf,.doc') — guide와 직접 일치시킬 것
  editorMinHeight = 360,     // 본문 최소 높이(px)
  editorMaxHeight,           // 지정 시 본문 세로 스크롤(ScrollArea)
  editorReadOnly = false,    // 본문 편집 비활성(툴바 숨김·읽기 전용)
  editorPlaceholder,         // 본문 빈 안내 문구(Editor 기본값 사용 시 생략)
  className = '',
  ...props
}) {
  const controlled = channelProp !== undefined;
  const [internal, setInternal] = useState(defaultChannel);
  const isEnabled = (v) => !enabledChannels || enabledChannels.includes(v);
  const rawChannel = controlled ? channelProp : internal;
  // 현재 채널이 비활성이면 첫 활성 채널로 표시 폴백(파생값 — 다시 활성화되면 원래 채널로 복귀)
  const channel = isEnabled(rawChannel)
    ? rawChannel
    : (CHANNELS.find((c) => isEnabled(c.value))?.value ?? rawChannel);
  const setChannel = (v) => {
    if (!controlled) setInternal(v);
    onChannelChange?.(v);
  };

  // 채널별 제목·본문·첨부는 내부 상태로 유지(채널 전환 시 각자 보존)
  const [titles, setTitles] = useState({ site: '', email: '', sms: '' });
  const [bodies, setBodies] = useState(() => ({ site: '', email: '', sms: '', ...(defaultBodies || {}) }));
  const [files, setFiles] = useState(emptyByChannel);

  const current = CHANNELS.find((c) => c.value === channel) ?? CHANNELS[0];
  const isSms = channel === 'sms';

  const addFiles = (fileList) =>
    setFiles((p) => ({
      ...p,
      [channel]: [
        ...p[channel],
        ...Array.from(fileList).map((f) => ({
          name: f.name,
          size: Math.max(0.1, Math.round((f.size / 1048576) * 10) / 10), // MB(소수 1자리)
          id: `${f.name}-${f.size}-${Date.now()}`,
        })),
      ].slice(0, maxAttachments),
    }));
  const deleteFile = (_file, index) =>
    setFiles((p) => ({ ...p, [channel]: p[channel].filter((_, i) => i !== index) }));

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
              onChange={(e) => setTitles((p) => ({ ...p, [channel]: e.target.value }))}
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
        onChange={(html) => setBodies((p) => ({ ...p, [channel]: html }))}
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
