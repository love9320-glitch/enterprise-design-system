// HomePage — LNB 최상단 '홈'. 디자인 시스템의 목적/방향을 소개하는 랜딩 페이지.
// 내용은 프로젝트 목적(코드↔Figma 동기화 + 규칙 기반 UI 생산·진화)을 요약한다.

import { Divider } from '../../src/components/Divider';

const PURPOSE = [
  {
    no: '01',
    title: '디자인 시스템 자산 (코드)',
    desc: '토큰(컬러·간격·타이포) → 컴포넌트 → 템플릿의 단일 출처. 시멘틱 토큰 경유, 완전 옵션화된 재사용 컴포넌트.',
  },
  {
    no: '02',
    title: '코드 ↔ Figma 동기화',
    desc: 'Code Connect로 코드와 Figma 컴포넌트를 1:1 매핑 — 모든 컴포넌트·템플릿(Editor 포함)이 연결돼 있다. Figma 작도는 연결된 로컬 컴포넌트를 인스턴스로 조립해, 코드와 같은 구조·토큰으로 그린다.',
  },
  {
    no: '03',
    title: '규칙대로 UI 생성',
    desc: '이미지·요구를 분석 → 페이지 > 템플릿 > 컴포넌트 순으로 매핑 → 배치 → 정리. 사람의 판단을 규칙화해 재현 가능하게.',
  },
  {
    no: '04',
    title: '규칙의 통제·진화 루프',
    desc: '규칙서를 공통/코드/Figma로 구조화하고, 사용 원장으로 빈도·마찰을 기록 → 검증 → 보완. 반복 작업은 재현 레시피·컴포넌트 레지스트리로 축적해 갈수록 빨라진다(같은 모달 재작도 호출 21→8회).',
  },
];

// 현황 요약 — 소개 하단이 아닌 히어로 바로 아래에서 시스템 규모를 보여준다.
const STATS = [
  { value: '40+', label: '컴포넌트' },
  { value: '3종', label: '템플릿 (Table · Form · Notice)' },
  { value: '4축', label: '토큰 (컬러 · 간격 · 라운드 · 행간)' },
];

export function HomePage() {
  return (
    <section className="mx-auto max-w-5xl px-spacing-7 py-spacing-10 text-left">
      {/* Hero */}
      <p className="mb-spacing-4 text-13 font-semibold uppercase tracking-wide text-font-icon-3">
        Design System
      </p>
      <h1 className="mb-spacing-6 text-20 font-semibold text-font-icon-5">
        코드와 Figma가 하나로 동기화된 디자인 시스템
      </h1>
      <p className="mb-spacing-8 max-w-3xl text-16 text-font-icon-4">
        코드와 Figma가 동기화된 단일 디자인 시스템을 만들어, 어디서든 같은 컴포넌트로
        일관된 UI를 만들고, 그 작업을 규칙으로 통제·진화시키는 것이 목표입니다.
      </p>

      {/* 현황 요약 */}
      <div className="mb-spacing-9 grid grid-cols-2 gap-spacing-5 sm:grid-cols-3">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-round-4 border border-base-gray-100 px-spacing-6 py-spacing-5">
            <p className="mb-spacing-2 text-15 font-semibold text-font-icon-5">{s.value}</p>
            <p className="text-12 text-font-icon-3">{s.label}</p>
          </div>
        ))}
      </div>

      {/* 목적 4 */}
      <Divider className="mt-spacing-9 mb-spacing-8" />
      <div className="mb-spacing-9">
        <h2 className="mb-spacing-4 text-16 font-semibold text-font-icon-5">목적</h2>
        <p className="mb-spacing-7 max-w-3xl text-14 text-font-icon-4">
          “디자인과 코드의 경계를 없애고, 그 사이를 잇는 규칙까지 살아있는 시스템으로 만들어, AI가
          일관되게 UI를 생산·확장할 수 있는 기반을 만드는 것”이 목적입니다.
        </p>
        <div className="grid grid-cols-1 gap-spacing-6 sm:grid-cols-2">
          {PURPOSE.map((p) => (
            <div
              key={p.no}
              className="rounded-round-4 border border-base-gray-100 bg-base-gray-25 p-spacing-7"
            >
              <p className="mb-spacing-3 text-12 font-semibold text-font-icon-3">{p.no}</p>
              <h3 className="mb-spacing-4 text-15 font-semibold text-font-icon-5">{p.title}</h3>
              <p className="text-14 text-font-icon-4">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 안내 */}
      <Divider className="mt-spacing-9 mb-spacing-8" />
      <div>
        <h2 className="mb-spacing-4 text-16 font-semibold text-font-icon-5">둘러보기</h2>
        <p className="text-14 text-font-icon-4">
          좌측 메뉴에서 <strong className="font-semibold text-font-icon-5">파운데이션</strong>(토큰),{' '}
          <strong className="font-semibold text-font-icon-5">컴포넌트</strong>,{' '}
          <strong className="font-semibold text-font-icon-5">템플릿</strong>을 확인하고,{' '}
          <strong className="font-semibold text-font-icon-5">디자인시스템 규칙</strong>에서 규칙서와
          사용 원장(규칙 튜닝 기록)을 볼 수 있습니다. 각 데모 페이지는 빌드·린트를 통과하는{' '}
          <strong className="font-semibold text-font-icon-5">실행 예제</strong>이며, 모든 변경은 실제
          브라우저 실측(E2E)으로 검증한 뒤 반영합니다.
        </p>
      </div>
    </section>
  );
}
