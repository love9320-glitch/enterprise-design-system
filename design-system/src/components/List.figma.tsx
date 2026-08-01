// 팝오버 리스트 계열 Code Connect 매핑(2026-08-01) — list SET(7206:9327) + list group(7206:9848) +
// list empty SET(7206:10280) + popover menu SET(7206:10078, type 13종).
//   - list: state Selected/Disabled만 prop(Hover/Pressed는 CSS).
//   - popover menu: type이 조립 구성(검색·라디오·탭 등)이라 대표 3형(List/Search list/Radio list)만
//     variant 스코프로 예시하고 나머지 type은 기본 예시로 폴백(조립 상세는 데모 페이지 참조).
//   - 변형 값은 첫 글자 대문자 규칙 — 코드 prop은 소문자 API 그대로.
// 발행: main 머지 시 자동(.github/workflows/figma-code-connect.yml)
// 파서 제약 — URL·props는 리터럴만(변수·스프레드·as const 금지).
import figma from '@figma/code-connect';
import { List } from './List';
import { ListEmpty } from './ListEmpty';
import { ListGroup } from './ListGroup';
import { PopoverMenu } from './PopoverMenu';

// list — 옵션 행 하나
figma.connect(
  List,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7206-9327',
  {
    props: {
      selected: figma.enum('state', { Selected: true }),
      disabled: figma.enum('state', { Disabled: true }),
    },
    example: ({ selected, disabled }) => (
      <List title="옵션 이름" selected={selected} disabled={disabled} />
    ),
  },
);

// list group — 행 묶음(6행 초과 시 내부 스크롤)
figma.connect(
  ListGroup,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7206-9848',
  {
    example: () => (
      <ListGroup maxVisible={6}>
        <List title="옵션 이름" />
        <List title="옵션 이름" selected />
        <List title="옵션 이름" />
      </ListGroup>
    ),
  },
);

// list empty — 결과 없음 안내
figma.connect(
  ListEmpty,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7206-10280',
  {
    example: () => <ListEmpty message="검색 결과가 없습니다." />,
  },
);

// popover menu — 기본(List형): 리스트 그룹만 담는 팝오버
figma.connect(
  PopoverMenu,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7206-10078',
  {
    example: () => (
      <PopoverMenu>
        <ListGroup>
          <List title="옵션 이름" />
          <List title="옵션 이름" selected />
        </ListGroup>
      </PopoverMenu>
    ),
  },
);

// popover menu — Search list: 상단 검색바
figma.connect(
  PopoverMenu,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7206-10078',
  {
    variant: { type: 'Search list' },
    example: () => (
      <PopoverMenu topArea="search" searchPlaceholder="검색어를 입력하세요">
        <ListGroup>
          <List title="옵션 이름" />
          <List title="옵션 이름" />
        </ListGroup>
      </PopoverMenu>
    ),
  },
);

// popover menu — Radio list: 라디오 단일 선택
figma.connect(
  PopoverMenu,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7206-10078',
  {
    variant: { type: 'Radio list' },
    example: () => (
      <PopoverMenu>
        <ListGroup gap="2">
          <List title="옵션 이름" radio checked />
          <List title="옵션 이름" radio />
        </ListGroup>
      </PopoverMenu>
    ),
  },
);
