import { useState } from 'react';
import { Editor } from '../../src/components/Editor';
import { UsageExample } from '../components/UsageExample';
import { Divider } from '../../src/components/Divider';

const USAGE = `import { Editor } from '../../src/components/Editor';

// 제어 컴포넌트 — 값은 HTML 문자열
const [html, setHtml] = useState('<p>안녕하세요.</p>');
<Editor value={html} onChange={setHtml} />

// 비제어 · 노출 툴바 제한 · 본문 높이
<Editor
  defaultValue="<p>초기 내용</p>"
  toolbar={['bold', 'italic', 'link']}
  minHeight={200}
  maxHeight={360}
/>

// 읽기 전용 (편집 툴바 숨김, 소스·미리보기 모드는 유지)
<Editor value={html} readOnly />`;

const USAGE_PROPS = [
  { name: 'value', type: 'string(HTML)', default: '—', desc: '본문 HTML (제어 컴포넌트)' },
  { name: 'defaultValue', type: 'string', default: "''", desc: '초기 HTML (비제어)' },
  { name: 'onChange', type: '(html) => void', default: '—', desc: '본문 변경 콜백' },
  { name: 'mode', type: "'edit'|'source'|'preview'", default: '—', desc: '모드 (제어). 미지정 시 내부 상태' },
  { name: 'onModeChange', type: '(mode) => void', default: '—', desc: '모드 변경 콜백' },
  { name: 'toolbar', type: 'string[]', default: '전체', desc: "노출할 서식 키 (예: ['bold','link','table'])" },
  { name: 'readOnly', type: 'boolean', default: 'false', desc: '편집 비활성 (툴바 숨김, 본문 read-only)' },
  { name: 'allowSourceEdit', type: 'boolean', default: 'true', desc: 'HTML 소스 직접 편집 허용 (false=읽기 전용 보기)' },
  { name: 'placeholder', type: 'string', default: "'내용을 입력하세요.'", desc: '빈 본문 안내 문구' },
  { name: 'minHeight', type: 'number', default: '240', desc: '본문 최소 높이(px)' },
  { name: 'maxHeight', type: 'number', default: '—', desc: '지정 시 본문 세로 스크롤(ScrollArea)' },
  { name: 'width', type: "'fill' | number | string", default: "'fill'", desc: "에디터 폭 — fill=부모 전체 폭, 숫자=px, CSS 길이 문자열('60%' 등)" },
  { name: 'className', type: 'string', default: "''", desc: '추가 클래스' },
];

const SAMPLE = `<h2>공지사항 템플릿</h2>
<p>안녕하세요. <strong>홍길동</strong>님, 아래 내용을 확인해 주세요.</p>
<p>신청 기간: <span style="color: #0f85f2">6월 18일까지</span></p>
<p>문의: <a href="https://example.com">고객센터</a></p>
<table><tbody><tr><th>항목</th><th>내용</th></tr><tr><td>플랜</td><td>프리미엄</td></tr><tr><td>금액</td><td>월 9,900원</td></tr></tbody></table>`;

// 머지필드 목록 예시 — 툴바 '머지필드' 드롭다운(search list)에서 클릭 시 커서 위치에 삽입
const MERGE_FIELDS = [
  '{지원자명}', '{회사명}', '{일정조율 시작시간}', '{일정조율 마감시간}',
  '{면접장소}', '{면접시간}', '{평가자명}', '{지원직무}',
];

function MainDemo() {
  const [html, setHtml] = useState(SAMPLE);
  return (
    <Editor value={html} onChange={setHtml} mergeFields={MERGE_FIELDS} minHeight={260} maxHeight={420} />
  );
}

export function EditorPage() {
  return (
    <section className="mx-auto max-w-5xl px-spacing-7 py-spacing-10 text-left">
      <div className="mb-spacing-8">
        <h2 className="text-20 font-semibold text-font-icon-5">Editor</h2>
        <p className="mt-spacing-3 text-14 text-font-icon-4">
          Tiptap 기반 리치 텍스트 에디터. 편집(WYSIWYG) · HTML 소스 · 미리보기 3가지 모드를 제공하며,
          이메일 템플릿·공고·약관 작성과 개발자·운영자의 HTML 구조 확인을 함께 대응한다.
        </p>
      </div>

      <UsageExample
        code={USAGE}
        note="데이터 단위는 HTML 문자열 하나(value/onChange). 엔진(Tiptap)은 컴포넌트 내부에만 격리된다."
        props={USAGE_PROPS}
      />

      {/* 기본 — 풀 툴바 + 3모드 + 제어 컴포넌트 */}
      <div className="mb-spacing-10">
        <h3 className="mb-spacing-5 text-16 font-semibold text-font-icon-5">기본 (풀 툴바 · 3모드)</h3>
        <p className="mb-spacing-5 text-13 text-font-icon-4">
          상단 우측 탭으로 편집/HTML/미리보기를 전환한다. 블록(본문·제목)·강조·색상/형광·정렬·링크·표·이미지·구분선 지원.
        </p>
        <MainDemo />
      </div>

      {/* 툴바 제한 */}
      <Divider className="mt-spacing-9 mb-spacing-8" />
      <div className="mb-spacing-10">
        <h3 className="mb-spacing-5 text-16 font-semibold text-font-icon-5">툴바 제한 (toolbar)</h3>
        <p className="mb-spacing-5 text-13 text-font-icon-4">
          {`toolbar={['block','bold','italic','underline','link']} — 필요한 기능만 노출.`}
        </p>
        <Editor
          defaultValue="<p>강조와 링크만 쓰는 간단 입력 영역입니다.</p>"
          toolbar={['block', 'bold', 'italic', 'underline', 'link']}
          minHeight={160}
        />
      </div>

      {/* 읽기 전용 */}
      <Divider className="mt-spacing-9 mb-spacing-8" />
      <div className="mb-spacing-10">
        <h3 className="mb-spacing-5 text-16 font-semibold text-font-icon-5">읽기 전용 (readOnly)</h3>
        <p className="mb-spacing-5 text-13 text-font-icon-4">
          편집 탭은 빠지고 <strong className="font-semibold text-font-icon-5">미리보기</strong>가 기본이며, HTML 소스·미리보기 전환만 노출해 구조 확인이 가능하다.
        </p>
        <Editor value={SAMPLE} readOnly minHeight={160} maxHeight={320} />
      </div>
    </section>
  );
}
