import { useState } from 'react';
import { NoticeWritingTemplate } from '../components/NoticeWritingTemplate';
import { UsageExample } from '../components/UsageExample';
import { Checkbox } from '../components/Checkbox';
import { Select } from '../components/Select';
import { Input } from '../components/Input';
import { Divider } from '../components/Divider';
import { NOTICE_SAMPLE_BODIES } from './noticeSampleBodies';

// Playground 숫자 입력 한 줄 (editorMinHeight / editorMaxHeight) — DS Input 사용
function NumField({ label, value, onChange, disabled }) {
  return (
    <div className="flex items-center gap-spacing-4 text-12">
      <span className={`text-font-icon-3 ${disabled ? 'opacity-40' : ''}`}>{label}</span>
      <Input
        value={value}
        onChange={onChange}
        disabled={disabled}
        width={100}
        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
      />
    </div>
  );
}

const USAGE = `import { NoticeWritingTemplate } from '../components/NoticeWritingTemplate';

// 채널 탭 + 제목 + 첨부파일(업로드 메뉴) + 본문 에디터 조립
<NoticeWritingTemplate
  defaultChannel="site"          // 'site' | 'email' | 'sms'
  showTabs                       // 채널 탭 노출(false면 단일 채널)
  tabVariant="fill"              // 'fill'(균등 분할, 기본) | 'hug'(내용 폭)
  mergeFields={['{지원자명}', '{회사명}', '{면접일시}']}
  maxAttachments={5}             // 첨부파일 최대 개수(버튼 클릭 → 업로드 메뉴)
  editorMinHeight={360}
  editorMaxHeight={520}
/>

// 채널을 외부에서 제어하려면 channel/onChannelChange 사용
<NoticeWritingTemplate channel={ch} onChannelChange={setCh} />`;

const USAGE_PROPS = [
  { name: 'channel', type: "'site' | 'email' | 'sms'", default: '—', desc: '현재 채널(제어). 미지정 시 내부 상태' },
  { name: 'defaultChannel', type: "'site' | 'email' | 'sms'", default: "'site'", desc: '초기 채널(비제어)' },
  { name: 'onChannelChange', type: '(channel) => void', default: '—', desc: '채널 변경 콜백' },
  { name: 'showTabs', type: 'boolean', default: 'true', desc: '채널 탭 노출 여부(false=단일 채널 모드)' },
  { name: 'tabVariant', type: "'fill' | 'hug'", default: "'fill'", desc: '탭 너비 타입 — fill=균등 분할(기본), hug=내용 폭' },
  { name: 'mergeFields', type: 'string[] | {label,value}[]', default: '[]', desc: 'Editor 머지필드 목록(툴바 머지필드 드롭다운)' },
  { name: 'defaultBodies', type: '{ site?, email?, sms? }', default: '—', desc: '채널별 초기 본문 HTML(비제어). 데모는 site·email에 합격 안내문 기본 삽입' },
  { name: 'maxAttachments', type: 'number', default: '5', desc: '첨부 최대 개수([첨부파일] 버튼→업로드 메뉴)' },
  { name: 'attachGuide', type: 'string', default: "'파일을 첨부하세요 …'", desc: '업로드 메뉴 안내 문구' },
  { name: 'attachAccept', type: 'string', default: '—', desc: "<input accept> 필터(예: '.pdf,.doc') — guide와 일치시킬 것" },
  { name: 'editorMinHeight', type: 'number', default: '360', desc: '본문 최소 높이(px)' },
  { name: 'editorMaxHeight', type: 'number', default: '—', desc: '지정 시 본문 세로 스크롤(ScrollArea)' },
  { name: 'editorReadOnly', type: 'boolean', default: 'false', desc: '본문 편집 비활성(툴바 숨김·읽기 전용)' },
  { name: 'editorPlaceholder', type: 'string', default: '—', desc: '본문 빈 안내 문구(미지정 시 Editor 기본값)' },
  { name: 'className', type: 'string', default: "''", desc: '추가 클래스' },
];

// 머지필드 예시 — 안내문에 삽입할 동적 값
const MERGE_FIELDS = [
  '{지원자명}', '{회사명}', '{지원직무}', '{면접일시}', '{면접장소}', '{담당자명}',
];

// 채널별 기본 본문(최종 합격 안내 샘플) — 공용 모듈에서 가져온다(모달과 공유)
const DEFAULT_BODIES = NOTICE_SAMPLE_BODIES;

// Playground — 탭 · 에디터 옵션을 끄고 켜며 동작 확인
function Playground() {
  const [showTabs, setShowTabs] = useState(true);
  const [tabVariant, setTabVariant] = useState('fill');
  // 에디터 옵션
  const [useMerge, setUseMerge] = useState(true);
  const [readOnly, setReadOnly] = useState(false);
  const [capMax, setCapMax] = useState(true); // editorMaxHeight 제한 on/off
  const [minHeight, setMinHeight] = useState(320);
  const [maxHeight, setMaxHeight] = useState(480);
  const num = (setter) => (e) => setter(Math.max(0, Number(e.target.value) || 0));

  return (
    <div className="flex flex-col gap-spacing-7">
      {/* 컨트롤 */}
      <div className="flex flex-col gap-spacing-6 rounded-round-4 border border-base-gray-100 p-spacing-7">
        {/* 위줄 — 체크박스(on/off 옵션) */}
        <div className="flex flex-wrap items-center gap-x-spacing-9 gap-y-spacing-5">
          <Checkbox
            label="showTabs (채널 탭 노출)"
            checked={showTabs}
            onChange={(e) => setShowTabs(e.target.checked)}
          />
          <Checkbox
            label="mergeFields (머지필드 툴바)"
            checked={useMerge}
            onChange={(e) => setUseMerge(e.target.checked)}
          />
          <Checkbox
            label="editorReadOnly (읽기 전용)"
            checked={readOnly}
            onChange={(e) => setReadOnly(e.target.checked)}
          />
          <Checkbox
            label="editorMaxHeight 제한 (끄면 무제한)"
            checked={capMax}
            onChange={(e) => setCapMax(e.target.checked)}
          />
        </div>

        <Divider className="mt-spacing-3 mb-spacing-3" />

        {/* 아래줄 — 값 선택(Select) · 숫자 입력 */}
        <div className="flex flex-wrap items-center gap-x-spacing-9 gap-y-spacing-5">
          <div className="flex items-center gap-spacing-5">
            <span className={`text-12 ${showTabs ? 'text-font-icon-3' : 'text-font-icon-2'}`}>tabVariant</span>
            <Select
              value={tabVariant}
              onChange={(e) => setTabVariant(e.target.value)}
              options={[
                { value: 'hug', label: 'hug' },
                { value: 'fill', label: 'fill' },
              ]}
              width={100}
              disabled={!showTabs}
            />
          </div>
          <NumField label="editorMinHeight" value={minHeight} onChange={num(setMinHeight)} />
          <NumField
            label="editorMaxHeight"
            value={maxHeight}
            onChange={num(setMaxHeight)}
            disabled={!capMax}
          />
        </div>
      </div>

      {/* 라이브 미리보기 */}
      <NoticeWritingTemplate
        showTabs={showTabs}
        tabVariant={tabVariant}
        defaultBodies={DEFAULT_BODIES}
        mergeFields={useMerge ? MERGE_FIELDS : []}
        editorReadOnly={readOnly}
        editorMinHeight={minHeight}
        editorMaxHeight={capMax ? maxHeight : undefined}
      />
    </div>
  );
}

export function NoticeTemplatePage() {
  return (
    <section className="mx-auto max-w-4xl px-spacing-7 py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-20 font-semibold text-font-icon-5">Notice Writing Template</h2>
      <p className="mb-spacing-9 text-14 text-font-icon-4">
        안내문 작성 템플릿. 채널 탭(<span className="text-font-icon-5">채용사이트 · 이메일 · SMS 안내문</span>)으로
        전환하며, site·email은 제목 입력 + 첨부파일(업로드 메뉴) + 풀 에디터, SMS는 바이트 안내 문구 + 축약 툴바(머지필드)
        에디터를 보여줍니다. Tabs · Input · FileUploadButton · Editor를 조립한 템플릿입니다(규칙 4).
      </p>

      <UsageExample code={USAGE} props={USAGE_PROPS} />

      <h3 className="mb-spacing-5 text-15 font-semibold text-font-icon-5">Playground — 옵션 끄고 켜기</h3>
      <Playground />
    </section>
  );
}
