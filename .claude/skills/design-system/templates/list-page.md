# Template — 목록 / 리스트 / 테이블 페이지

데이터 목록을 보여주는 페이지 규칙. `foundation.md` + `components.md` 전제.
페이지 추가는 **'새 페이지 절차'** 규칙을 따른다 (pages 생성 → index export → App.jsx NAV_GROUPS).

## 레이아웃 규칙

- 페이지 컨테이너: `mx-auto max-w-* px-spacing-7 py-spacing-10 text-left` (기존 페이지와 동일 톤).
- 상단: 타이틀(`text-18`/`text-20` semibold) + 설명(`text-14 text-font-icon-4`) + 우측 주요 액션 버튼.
- 툴바: 검색/필터 영역. 간격 `gap-spacing-*`.
- 테이블/리스트 본문.
- 하단: 페이지네이션 또는 더보기.

## 테이블은 손으로 짜지 말 것 (규칙 4)

`<table>`/`<thead>`/`<tr>`을 직접 쓰지 않는다. 목록은 이미 컴포넌트가 있다.

- 검색·페이지네이션·툴바까지 한 번에 → **`TableTemplate`** (버튼그룹+검색바+Table+Pagination 묶음)
- 표 본문만 필요 → **`Table`** (헤더 고정·정렬·필터·가로/세로 스크롤·로딩/빈 상태 내장)

컬럼은 **상수 배열**로 정의해 props로 넘긴다('완전 옵션화' 정신). 헤더/셀 색·간격·보더·hover·구분선은 컴포넌트가 토큰으로 처리하므로 다시 칠하지 않는다. 로딩(`loading`)·빈 상태(`emptyMessage`)도 props로 제어된다. 전체 옵션은 `components.md`의 Table·TableTemplate 카탈로그 행과 코드가 진실이다.

## 좌측 버튼그룹(actions) 버튼 순서 규칙 (2026-07-02 지시)

체크박스 선택과 연관된 액션 버튼(삭제·추가·복사·붙여넣기)은 **항상 같은 순서**로 배치한다:

> **삭제 → 추가 → 복사 → 붙여넣기**

- 없는 버튼은 건너뛰고 **상대 순서를 유지**한다 (예: 삭제가 없으면 `추가 → 복사 → 붙여넣기`, 추가가 없으면 `삭제 → 복사 → 붙여넣기`).
- 이 네 가지 외의 버튼(가져오기·내보내기·불러오기 등)은 규칙 대상이 아니며, 네 버튼 **뒤에** 이어 배치한다.
- `rightActions`(우측 버튼그룹)에는 적용하지 않는다 — 좌측 actions 전용 규칙.

## 테이블 셀 width 규칙 — 아이콘 전용 셀은 계산으로 (2026-07-03 지시)

**고스트 아이콘 버튼만 단독으로 들어가는 셀**(연필/휴지통 액션 컬럼 등)의 `width`는 임의 숫자로 잡지 않고, `components/tableView.js`의 **`iconCellWidth(개수, {buttonSize, gap})`** 로 계산해 넣는다:

> width = 셀 좌우 패딩(spacing-5-5 × 2) + 버튼 폭 × 개수 + 버튼 간격(spacing-5) × (개수−1)

```jsx
import { iconCellWidth } from '../components/tableView';

{ key: 'actions', label: '', width: iconCellWidth(2),   // ghost 24 버튼 2개 = 76px
  render: (row) => (
    <div className="flex items-center justify-end gap-spacing-5">
      <Button variant="ghost" size="24" icon={Pencil} />
      <Button variant="ghost" size="24" icon={Trash2} />
    </div>
  ) }
```

- 패딩·간격을 **토큰에서 읽으므로** 토큰이 바뀌면 셀 폭도 자동 추종 — 셀 폭·패딩·간격이 어긋날 수 없다.
- 버튼 크기(`size="32"` 등)나 셀 안 간격이 기본과 다르면 `iconCellWidth(n, { buttonSize, gap })`로 실제 값을 넘긴다(render의 gap 클래스와 일치시킬 것).
- 대상은 "아이콘 버튼만 있는 셀"이다 — 텍스트·태그가 섞인 셀은 기존대로 지정 폭 또는 fill.

## 모범 예제 — `TableTemplate` 조립 (목록 페이지 표준)

> ▶ **실행되는 전체 예제 = 데모 페이지 `pages/TableTemplatePage.jsx`·`pages/TablePage.jsx`** (빌드·lint 검증). 아래 스니펫은 **조립 '패턴' 견본**일 뿐 복붙용 정답이 아니다 — prop 이름·값의 진실은 항상 **`TableTemplate.jsx`/`Table.jsx` + components.md 카탈로그**다(의심되면 코드 확인).

```jsx
import { TableTemplate } from '../components/TableTemplate';
import { Button } from '../components/Button';
import { Tag } from '../components/Tag';
import { Plus } from 'lucide-react';

// 컬럼 정의는 상수 배열로 — width 없으면 가변(fill), render로 셀 커스텀
const COLUMNS = [
  { key: 'name',   label: '이름' },
  { key: 'email',  label: '이메일' },
  { key: 'status', label: '상태', width: 100,
    render: (row) => <Tag color={row.status === '활성' ? 'blue' : 'gray'}>{row.status}</Tag> },
];

export function MembersPage() {
  const rows = [/* { id, name, email, status } ... */];

  return (
    <section className="mx-auto max-w-4xl px-spacing-7 py-spacing-10 text-left">
      <div className="mb-spacing-8 flex items-center justify-between">
        <div>
          <h2 className="text-18 font-semibold text-font-icon-5">멤버</h2>
          <p className="mt-spacing-3 text-14 text-font-icon-4">전체 멤버 목록</p>
        </div>
      </div>

      {/* 검색·페이지네이션·툴바 버튼이 내장 — 표를 손으로 짜지 않는다 */}
      <TableTemplate
        columns={COLUMNS}
        rows={rows}
        rowKey="id"
        actions={<Button variant="fill" leftIcon={Plus}>멤버 추가</Button>}
        searchable
        pagination
        emptyMessage="아직 멤버가 없습니다."
      />
    </section>
  );
}
```

### 표 본문만 필요할 때 — `Table`

```jsx
import { Table } from '../components/Table';

<Table
  columns={COLUMNS}
  rows={rows}
  rowKey="id"
  loading={loading}
  emptyMessage="데이터가 없습니다."
  maxHeight={480}          // 세로 스크롤 + 헤더 고정
  onRowClick={(row) => /* ... */}
/>
```

> 검색·필터·정렬·선택(체크박스)·페이지네이션 세부 제어 props는 `components.md`의 TableTemplate/Table 행을 참고. 컴포넌트로 안 덮는 고유 레이아웃만 좁게 커스텀한다(규칙 4).

## 완료 체크리스트

- [ ] `<table>`을 손으로 짜지 않고 `TableTemplate`(또는 `Table`)을 **조립**했는가 (규칙 4)
- [ ] 페이지 추가 3단계('새 페이지 절차')를 수행했는가
- [ ] 컬럼 정의를 상수 배열로 분리해 props로 넘겼는가
- [ ] 로딩(`loading`)·빈 상태(`emptyMessage`)를 props로 처리했는가
- [ ] 주요 액션 버튼이 공통 `Button`이고 `actions` slot으로 들어갔는가
- [ ] 좌측 버튼그룹의 선택 연관 버튼이 **삭제 → 추가 → 복사 → 붙여넣기** 순인가(없는 건 건너뜀, 그 외 버튼은 뒤에)
- [ ] 아이콘 버튼만 단독으로 들어가는 셀의 width를 임의 숫자 대신 **`iconCellWidth(n)`** 계산으로 잡았는가
- [ ] 셀 색·간격·hover·구분선을 직접 칠하지 않고 컴포넌트에 맡겼는가 (토큰)
- [ ] 컴포넌트로 안 덮는 부분만 좁게 커스텀했는가
