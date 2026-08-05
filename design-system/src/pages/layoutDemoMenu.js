// 레이아웃 데모용 LNB 메뉴 데이터 — 현재 데모 사이트 사이드바(App.jsx NAV_GROUPS)와 동일 구성.
// App.jsx를 직접 import하면 순환 참조(App → pages → 여기)라 라벨만 복사해 둔다.
// ※ NAV_GROUPS 메뉴가 바뀌면 이 파일도 함께 갱신할 것(데모 표시용이라 라벨·계층만 유지).
export const LAYOUT_DEMO_MENU = [
  {
    key: 'root',
    items: [{ value: 'home', label: '디자인 시스템 소개', iconArea: false }],
  },
  {
    key: '파운데이션',
    title: '파운데이션',
    items: [
      { value: 'typography', label: 'Typography', iconArea: false },
      { value: 'colors', label: 'Base Colors', iconArea: false },
      { value: 'font-icon-colors', label: 'Font/Icon Colors', iconArea: false },
      { value: 'component-colors', label: 'Component Colors', iconArea: false },
      { value: 'spacing', label: 'Spacing/Round/Border', iconArea: false },
      { value: 'icons', label: 'Icons', iconArea: false },
    ],
  },
  {
    key: '컴포넌트',
    title: '컴포넌트',
    items: [
      {
        value: 'sub:액션',
        label: '액션',
        children: [
          { value: 'button', label: 'Button' },
          { value: 'segment-control', label: 'Segment Control' },
          { value: 'tool-bar', label: 'Tool Bar' },
        ],
      },
      {
        value: 'sub:입력',
        label: '입력',
        children: [
          { value: 'search-bar', label: 'Search Bar' },
          { value: 'input', label: 'Input' },
          { value: 'textarea', label: 'TextArea' },
          { value: 'editor', label: 'Editor' },
          { value: 'select', label: 'Select' },
          { value: 'checkbox', label: 'Checkbox' },
          { value: 'radio', label: 'Radio' },
          { value: 'switch', label: 'Switch' },
          { value: 'date-picker', label: 'Date Picker' },
          { value: 'condition-order-slot', label: 'Condition Order Slot' },
        ],
      },
      {
        value: 'sub:폼 구성',
        label: '폼 구성',
        children: [
          { value: 'label', label: 'Label' },
          { value: 'field', label: 'Field' },
        ],
      },
      {
        value: 'sub:내비게이션',
        label: '내비게이션',
        children: [
          { value: 'tabs', label: 'Tabs' },
          { value: 'segmented-tabs', label: 'Segmented Tabs' },
          { value: 'pagination', label: 'Pagination' },
          { value: 'side-navigation', label: 'Side Navigation' },
          { value: 'lnb', label: 'LNB Menu' },
          { value: 'gnb', label: 'GNB' },
          { value: 'stepper', label: 'Stepper' },
        ],
      },
      {
        value: 'sub:데이터 표시',
        label: '데이터 표시',
        children: [
          { value: 'table', label: 'Table' },
          { value: 'tag', label: 'Tag' },
          { value: 'chip', label: 'Chip' },
          { value: 'avatar', label: 'Avatar' },
          { value: 'tooltip-scrollbar', label: 'Tooltip / Scrollbar / Divider' },
          { value: 'accordion', label: 'Accordion' },
        ],
      },
      {
        value: 'sub:오버레이·메뉴',
        label: '오버레이·메뉴',
        children: [
          { value: 'modal', label: 'Modal' },
          { value: 'option-list', label: 'Option List' },
          { value: 'upload-menu', label: 'Upload Menu' },
        ],
      },
    ],
  },
  {
    key: '레이아웃',
    title: '레이아웃',
    items: [
      { value: 'layout', label: 'Layout', iconArea: false },
      { value: 'page', label: 'Page', iconArea: false },
      { value: 'right-panel', label: 'Right Panel', iconArea: false },
    ],
  },
  {
    key: '템플릿',
    title: '템플릿',
    items: [
      { value: 'table-template', label: 'Table Template', iconArea: false },
      { value: 'form-template', label: 'Form Template', iconArea: false },
      { value: 'side-nav-template', label: 'Side Navigation Template', iconArea: false },
      { value: 'notice-template', label: 'Notice Writing Template', iconArea: false },
      { value: 'job-position-template', label: 'Job Position Template', iconArea: false },
      { value: 'job-posting-template', label: 'Job Posting Template', iconArea: false },
      { value: 'screening-builder-template', label: 'Screening Builder Template', iconArea: false },
    ],
  },
  {
    key: '디자인시스템 규칙',
    title: '디자인시스템 규칙',
    items: [
      { value: 'getting-started', label: '시작 가이드', iconArea: false },
      { value: 'rule-overview', label: '규칙 개요', iconArea: false },
      { value: 'rule-foundation', label: 'Foundation 규칙', iconArea: false },
      { value: 'rule-components', label: '컴포넌트 규칙', iconArea: false },
      { value: 'rule-templates', label: '템플릿 규칙', iconArea: false },
      { value: 'rule-usage', label: '규칙 사용 원장', iconArea: false },
      { value: 'customization', label: '커스텀 가이드', iconArea: false },
    ],
  },
  {
    key: 'test',
    title: 'test',
    items: [{ value: 'modal-test', label: '모달 테스트 구현', iconArea: false }],
  },
];
