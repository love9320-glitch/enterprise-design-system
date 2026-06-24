# Template — 상세 / 디테일 페이지

단일 항목의 정보를 보여주는 페이지 규칙. `foundation.md` + `components.md` 전제.
페이지 추가는 **'새 페이지 절차'** 규칙을 따른다.

## 레이아웃 규칙

- 페이지 컨테이너: `mx-auto max-w-* px-spacing-7 py-spacing-10 text-left`.
- 상단: 뒤로가기(`ArrowLeft`) + 타이틀 + 우측 액션(수정/삭제 버튼).
- 본문: 정보를 **섹션(카드)** 단위로 묶음.
- 섹션 카드: `rounded-round-4 border border-base-gray-100 p-spacing-7`, 섹션 간 `space-y-spacing-7`.
- 라벨-값 쌍: 라벨 `text-12 text-font-icon-3`, 값 `text-14 text-font-icon-5`.

## 규칙

- 정보 필드 정의는 **상수 배열로 추출** → 매핑 렌더 ('완전 옵션화' 정신).
- 액션 버튼은 공통 `Button`. 삭제 등 위험 동작은 확인 모달(`templates/modal.md`) 경유.
- 데이터 없음/로딩/에러 상태 처리.

## 모범 예제 (구조 골격)

```jsx
const FIELDS = [
  { key: 'name',   label: '이름' },
  { key: 'email',  label: '이메일' },
  { key: 'role',   label: '권한' },
  { key: 'joined', label: '가입일' },
];

export function MemberDetailPage({ data }) {
  return (
    <section className="mx-auto max-w-2xl px-spacing-7 py-spacing-10 text-left">
      <div className="mb-spacing-8 flex items-center justify-between">
        <button className="inline-flex items-center gap-spacing-3 text-14 text-font-icon-4 hover:text-font-icon-5">
          <ArrowLeft size={16} strokeWidth={1.8} /> 목록으로
        </button>
        <div className="flex gap-spacing-5">
          <Button variant="line" leftIcon={Pencil}>수정</Button>
          <Button variant="ghost" leftIcon={Trash2}>삭제</Button>
        </div>
      </div>

      <h2 className="mb-spacing-7 text-20 font-semibold text-font-icon-5">{data.name}</h2>

      <div className="space-y-spacing-7">
        <div className="rounded-round-4 border border-base-gray-100 p-spacing-7">
          <h3 className="mb-spacing-6 text-12 font-semibold uppercase tracking-wide text-font-icon-3">
            기본 정보
          </h3>
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
    </section>
  );
}
```

## 완료 체크리스트

- [ ] 페이지 추가 3단계('새 페이지 절차')를 수행했는가
- [ ] 필드 정의를 상수 배열로 분리했는가
- [ ] 색상/간격/보더/라운드가 토큰만 사용하는가
- [ ] 정보가 섹션(카드) 단위로 구조화됐는가
- [ ] 수정/삭제 등 액션이 공통 `Button`이고 위험 동작은 확인 모달을 거치는가
- [ ] 로딩 · 데이터 없음 · 에러 상태를 처리했는가
- [ ] 뒤로가기 동선이 있는가
- [ ] 반응형 · 다크모드(`dark:`) 대응했는가
