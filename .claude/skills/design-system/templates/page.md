# Template — 페이지 (목록 · 상세 · 폼 통합, 2026-08-06)

앱 화면(페이지) 규칙. `foundation.md` + `components.md` 전제.
구 `list-page.md`/`detail-page.md`/`form-page.md` 3파일을 통합했다 — 실제 페이지는 유형이 섞이기 때문(발송 이력=목록+상세, 대량 발송=멀티 스텝 폼+테이블). **화면에 포함된 영역(§목록/§상세/§폼)만 골라 적용하고, 공통 규칙과 해당 영역의 체크리스트를 검증한다.**

## 공통 — 페이지 셸 (모든 페이지)

- 페이지 추가는 **'새 페이지 절차'** 규칙을 따른다 (pages 생성 → index export → App.jsx NAV_GROUPS).
- 폭·패딩은 **AppLayout Page Container(셸)가 일괄 관리** — 페이지 코드에서 `mx-auto max-w-*`를 직접 쓰지 않는다.
- 페이지는 **`Page`(헤더+바디 슬롯)** 로 조립하고, 상단은 **`PageHeader`**(title/description/actions 슬롯, `stickyHeader`로 고정 가능)가 담당 — 타이틀 텍스트를 손으로 그리지 않는다. 긴 타이틀은 `TruncatingText`.
- 참고 구현(실전 조립 페이지): `pages/pages/SendHistoryPage.tsx`(목록↔상세) · `pages/pages/BulkSendPage.tsx`(멀티 스텝 폼+테이블).

### 템플릿 선택 가이드 — 화면 요구 → 집어올 템플릿 (규칙 4: 큰 단위 먼저)

페이지 바디는 아래 템플릿을 먼저 조립하고, 템플릿이 안 덮는 부분만 컴포넌트/마크업으로 채운다. **props 진실은 `components.md` 템플릿 카탈로그 행 + 코드** — 이 표는 선택용 색인일 뿐이다.

| 화면 요구 | 템플릿 |
|-----------|--------|
| 데이터 목록(검색·버튼그룹·페이지네이션 포함) | `TableTemplate` (표만 필요하면 `Table`) |
| 여백 그리드형 폼(라벨+컨트롤 배치) | `FormTemplateA` |
| 테이블형 폼 박스(헤어라인 셀 그리드 — 정보 표시/입력 겸용) | `FormTemplateB` (title/subtitle·셀 패딩 옵션) |
| 여러 단계로 나뉜 폼(스텝 진행) | `MultiStepFormTemplate` (Stepper+content 주입·keepMounted) |
| 좌 내비 + 우 콘텐츠 전환 | `SideNavigationTemplate` |
| 리치 텍스트 안내문 작성(채널 탭+에디터) | `NoticeWritingTemplate` (`/editor` 서브패스) |
| 채용 분야/공고 설정(도메인 특화) | `JobPositionTemplate` · `JobPostingTemplate` |
| 조건 카드+수식 빌더(도메인 특화) | `ScreeningBuilderTemplate` |
| 모달(확인/폼/커스텀) | `templates/modal.md` 라우팅 (ConfirmModal·FormModal·Modal) |

### 공통 체크리스트

- [ ] 페이지 추가 3단계('새 페이지 절차')를 수행했는가
- [ ] `mx-auto max-w-*` 없이 `Page` + `PageHeader`로 조립했는가 (폭은 셸이 관리)
- [ ] 색상/간격/보더/라운드가 토큰만 사용하는가
- [ ] 컴포넌트로 안 덮는 부분만 좁게 커스텀했는가

---

## §목록 — 테이블/리스트 영역

- 구성: 툴바(검색/필터, `gap-spacing-*`) → 테이블/리스트 본문 → 페이지네이션.

### 테이블은 손으로 짜지 말 것 (규칙 4)

`<table>`/`<thead>`/`<tr>`을 직접 쓰지 않는다. 목록은 이미 컴포넌트가 있다.

- 검색·페이지네이션·툴바까지 한 번에 → **`TableTemplate`** (버튼그룹+검색바+Table+Pagination 묶음)
- 표 본문만 필요 → **`Table`** (헤더 고정·정렬·필터·가로/세로 스크롤·로딩/빈 상태 내장)

컬럼은 **상수 배열**로 정의해 props로 넘긴다('완전 옵션화' 정신). 헤더/셀 색·간격·보더·hover·구분선은 컴포넌트가 토큰으로 처리하므로 다시 칠하지 않는다. 로딩(`loading`)·빈 상태(`emptyMessage`)도 props로 제어된다. 전체 옵션은 `components.md`의 Table·TableTemplate 카탈로그 행과 코드가 진실이다.

### 규칙 16 — 좌측 버튼그룹(actions) 버튼 순서 (2026-07-02 지시)

체크박스 선택과 연관된 액션 버튼(삭제·추가·복사·붙여넣기)은 **항상 같은 순서**로 배치한다:

> **삭제 → 추가 → 복사 → 붙여넣기**

- 없는 버튼은 건너뛰고 **상대 순서를 유지**한다 (예: 삭제가 없으면 `추가 → 복사 → 붙여넣기`, 추가가 없으면 `삭제 → 복사 → 붙여넣기`).
- 이 네 가지 외의 버튼(가져오기·내보내기·불러오기 등)은 규칙 대상이 아니며, 네 버튼 **뒤에** 이어 배치한다.
- `rightActions`(우측 버튼그룹)에는 적용하지 않는다 — 좌측 actions 전용 규칙.

### 규칙 17 — 테이블 셀 width: 아이콘 전용 셀은 계산으로 (2026-07-03 지시)

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

### 모범 예제 — `TableTemplate` 조립 (목록 페이지 표준)

> ▶ **실행되는 전체 예제 = 데모 페이지 `pages/pages/SendHistoryPage.tsx`·`pages/TableTemplatePage`** (빌드·lint 검증). 아래 스니펫은 **조립 '패턴' 견본**일 뿐 복붙용 정답이 아니다 — prop 이름·값의 진실은 항상 **`TableTemplate`/`Table` 코드 + components.md 카탈로그**다(의심되면 코드 확인).

```jsx
import { Page, PageHeader, TableTemplate, Button, Tag } from '@gusun/design-system';
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
    <Page title="멤버" description="전체 멤버 목록">
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
    </Page>
  );
}
```

표 본문만 필요할 때는 `Table`(columns/rows/rowKey + `loading`/`emptyMessage`/`maxHeight`/`onRowClick`). 검색·필터·정렬·선택(체크박스)·페이지네이션 세부 제어 props는 `components.md`의 TableTemplate/Table 행을 참고.

### §목록 체크리스트

- [ ] `<table>`을 손으로 짜지 않고 `TableTemplate`(또는 `Table`)을 **조립**했는가 (규칙 4)
- [ ] 컬럼 정의를 상수 배열로 분리해 props로 넘겼는가
- [ ] 로딩(`loading`)·빈 상태(`emptyMessage`)를 props로 처리했는가 (발송 계열은 엠티 가이드 필수 — 개발 정책)
- [ ] 주요 액션 버튼이 공통 `Button`이고 `actions` slot으로 들어갔는가
- [ ] 좌측 버튼그룹의 선택 연관 버튼이 **삭제 → 추가 → 복사 → 붙여넣기** 순인가(없는 건 건너뜀, 그 외 버튼은 뒤에)
- [ ] 아이콘 버튼만 단독으로 들어가는 셀의 width를 임의 숫자 대신 **`iconCellWidth(n)`** 계산으로 잡았는가
- [ ] 셀 색·간격·hover·구분선을 직접 칠하지 않고 컴포넌트에 맡겼는가 (토큰)

---

## §상세 — 단일 항목 정보 영역

> **규칙 4 적용 범위:** 상세 영역은 전용 DS 컴포넌트가 없어 **섹션 카드·라벨/값 그리드는 구조 마크업으로 직접 구성**한다(이 한정에서만 손 조립 허용). 단 그 안의 **버튼·태그·확인 모달 등은 반드시 기존 컴포넌트를 조립**한다 — `Button`(수정/삭제), `Tag`(상태), 삭제 확인은 `ConfirmModal`(`templates/modal.md`). 표가 들어가면 `Table`, 폼형 정보 박스는 `FormTemplateB`를 쓴다. 즉 "컴포넌트가 있으면 손으로 짜지 않는다"는 동일하게 적용된다.

- 상단: 뒤로가기(`ArrowLeft`) + 타이틀 + 우측 액션(수정/삭제 버튼) — PageHeader actions 슬롯 활용.
- 본문: 정보를 **섹션(카드)** 단위로 묶음. 폼형 정보 박스(라벨:값 셀 그리드)는 `FormTemplateB`(title 옵션)가 표준 — 참고: SendHistoryPage 상세의 '발송 정보'/'발송 내용'.
- 손 조립 카드일 때: `rounded-round-4 border border-base-gray-100 p-spacing-7`, 섹션 간 `space-y-spacing-7`, 라벨 `text-12 text-font-icon-3`, 값 `text-14 text-font-icon-5`.
- 정보 필드 정의는 **상수 배열로 추출** → 매핑 렌더 ('완전 옵션화' 정신).
- 데이터 없음/로딩/에러 상태 처리.

### 구조 골격 (손 조립 카드일 때)

> ▶ 아래는 **구조 골격**일 뿐 복붙용 정답이 아니며, 안에서 쓰는 컴포넌트(Button/ConfirmModal 등)의 prop 진실은 **코드 + components.md 카탈로그**다. 실전 참고: `pages/pages/SendHistoryPage.tsx`(상세 view).

```jsx
const FIELDS = [
  { key: 'name',   label: '이름' },
  { key: 'email',  label: '이메일' },
  { key: 'role',   label: '권한' },
];

<div className="space-y-spacing-7">
  <div className="rounded-round-4 border border-base-gray-100 p-spacing-7">
    <h3 className="mb-spacing-6 text-12 font-semibold uppercase tracking-wide text-font-icon-3">기본 정보</h3>
    <dl className="grid grid-cols-[120px_1fr] gap-y-spacing-5">
      {FIELDS.map((f) => (
        <Fragment key={f.key}>
          <dt className="text-12 text-font-icon-3">{f.label}</dt>
          <dd className="text-14 text-font-icon-5">{data[f.key]}</dd>
        </Fragment>
      ))}
    </dl>
  </div>
</div>
```

### §상세 체크리스트

- [ ] 섹션 카드·라벨/값 그리드는 구조 마크업으로 구성하되, 버튼·태그·모달·표는 기존 컴포넌트를 **조립**했는가 (규칙 4 — 폼형 정보 박스는 `FormTemplateB`)
- [ ] 필드 정의를 상수 배열로 분리했는가
- [ ] 정보가 섹션(카드) 단위로 구조화됐는가
- [ ] 수정/삭제 액션이 공통 `Button`이고, 삭제는 `ConfirmModal`을 거치는가
- [ ] 로딩 · 데이터 없음 · 에러 상태를 처리했는가
- [ ] 뒤로가기 동선이 있는가

---

## §폼 — 입력/등록/수정 영역

- 필드들: 세로 스택 `space-y-spacing-7`. 폼형 셀 그리드는 `FormTemplateB`(투명 계열 컨트롤 주입)가 표준.
- 하단: 우측 정렬 액션(`취소` line/ghost + `저장` fill).
- **멀티 스텝 폼은 `MultiStepFormTemplate`**(Stepper + 스텝별 content 주입, `keepMounted`로 입력 보존) — 참고: `pages/pages/BulkSendPage.tsx`(스텝 벨리데이션 게이트 포함).

### 입력은 손으로 짜지 말 것 (규칙 4)

`<input>`에 보더·패딩·focus·에러 스타일을 직접 칠하지 않는다. 입력은 이미 컴포넌트가 있다.

- 텍스트 입력 → **`Input`** (default/hover/focused/filled/disabled/readOnly/error 상태·에러 툴팁 내장)
- 셀렉트 → **`Select`** · 날짜 → **`DateField`** · 시간 → **`TimeField`** · 리치 텍스트 → **`Editor`**
- 폼 모달이면 본문을 **`FormModal`**(취소/저장 + form 래핑)에 넣는다(`templates/modal.md`).

필드는 **상수 배열**로 정의해 매핑 렌더하고, 각 필드는 **`Field`(라벨+컨트롤+헬퍼 조립)** 로 감싼다. 라벨은 `Field`가 내부 `Label`로 렌더한다 — **`<label>`·필수 표시 `*`를 손으로 만들지 말 것**(필수는 빨강 점, 색은 `label-field` 시멘틱 토큰을 `Label`이 처리). 컨트롤은 `Input`/`Select`/`DateField`를 children으로 넣고, 에러는 컨트롤의 `error`/`errorMessage` 툴팁을 쓴다(카피는 규칙 21 표준 3종이 기본값 — error=true만 켜면 자동). 전체 옵션은 `components.md`의 Field/Label/Input/Select/DateField 카탈로그 행과 코드가 진실이다.

### 동작 규칙

- 제출 중(`submitting`) 시 저장 버튼 `loading`, 중복 제출 차단.
- 클라이언트 검증 → 컨트롤의 `error`+`errorMessage`로 인라인 표시(멀티 스텝이면 스텝 이동 차단 게이트 — BulkSendPage `tryGoTo` 패턴).
- 수정 모드는 초기값 주입, 등록 모드는 빈 값. `mode` props로 분기.

### 모범 예제 — 공통 `Field`·`Input` 조립

> ▶ **데모 페이지: 컨트롤·필드는 `pages/FieldPage`·`InputPage`, 실전 폼은 `pages/pages/BulkSendPage.tsx`** (빌드·lint 검증). 아래는 **조립 '패턴' 견본**일 뿐 복붙용 정답이 아니다 — prop 진실은 **코드 + components.md 카탈로그**. (예: 전체폭은 `Input`이 `'fill'` 미지원이라 `width="100%"`, `'fill'`은 DateField/Select/Button/Tag 전용.)

```jsx
import { Page, Field, Input, Button } from '@gusun/design-system';
import { useState } from 'react';

// 필드 정의는 상수 배열로
const FIELDS = [
  { key: 'name',  label: '이름',   required: true,  placeholder: '이름 입력' },
  { key: 'email', label: '이메일', required: true,  placeholder: 'name@example.com' },
];

export function MemberFormPage({ mode = 'create', initial = {} }) {
  const [values, setValues] = useState(initial);
  const [submitting, setSubmitting] = useState(false);
  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }));

  return (
    <Page title={mode === 'edit' ? '멤버 수정' : '멤버 등록'} description="정보를 입력하세요.">
      <form className="space-y-spacing-7">
        {FIELDS.map((f) => (
          // 라벨/필수표시/헬퍼는 Field가 담당(라벨=내부 Label, 필수=빨강 점·label-field 토큰).
          // <label>·* 를 손으로 만들지 않는다. 보더·focus·에러는 Input이 처리.
          <Field key={f.key} label={f.label} required={f.required}>
            <Input value={values[f.key] ?? ''} placeholder={f.placeholder} onChange={set(f.key)} width="100%" />
          </Field>
        ))}

        <div className="flex justify-end gap-spacing-5 pt-spacing-5">
          <Button variant="line" type="button">취소</Button>
          <Button variant="fill" type="submit" loading={submitting}>저장</Button>
        </div>
      </form>
    </Page>
  );
}
```

> 모달 안 폼이면 위 본문을 `FormModal`에 그대로 넣는다(`onSubmit`/`loading` 위임). 셀렉트·날짜·리치텍스트는 각각 `Select`/`DateField`/`Editor`로 — 직접 만들지 않는다.

### §폼 체크리스트

- [ ] `<input>`을 손으로 짜지 않고 공통 `Input`(셀렉트=`Select`·날짜=`DateField` 등)을 **조립**했는가 (규칙 4)
- [ ] 라벨/필수표시를 `<label>`·`*`로 손수 만들지 않고 **`Field`(내부 `Label`)** 로 처리했는가 (필수=빨강 점, label-field 토큰)
- [ ] 필드 정의를 상수 배열로 분리해 매핑 렌더했는가
- [ ] 검증·에러를 컨트롤의 `error`/`errorMessage`로 표시했는가 (카피=규칙 21 표준, 멀티 스텝은 이동 차단 게이트)
- [ ] 제출 중 `loading` + 중복 제출 차단을 처리했는가
- [ ] 등록/수정 모드 분기(`mode`)를 처리했는가
- [ ] 모달 폼이면 `FormModal`에 넣어 form 래핑·유효성을 위임했는가
- [ ] 취소 동선이 공통 `Button`인가
