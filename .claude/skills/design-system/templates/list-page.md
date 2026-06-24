# Template — 목록 / 리스트 / 테이블 페이지

데이터 목록을 보여주는 페이지 규칙. `foundation.md` + `components.md` 전제.
페이지 추가는 **'새 페이지 절차'** 규칙을 따른다 (pages 생성 → index export → App.jsx NAV_GROUPS).

## 레이아웃 규칙

- 페이지 컨테이너: `mx-auto max-w-* px-spacing-7 py-spacing-10 text-left` (기존 페이지와 동일 톤).
- 상단: 타이틀(`text-18`/`text-20` semibold) + 설명(`text-14 text-font-icon-4`) + 우측 주요 액션 버튼.
- 툴바: 검색/필터 영역. 간격 `gap-spacing-*`.
- 테이블/리스트 본문.
- 하단: 페이지네이션 또는 더보기.

## 테이블 규칙

- 헤더 셀: `text-12 font-semibold text-font-icon-3`, 하단 보더 `border-1 border-base-gray-100`.
- 데이터 셀: `text-14 text-font-icon-5`, 행 구분 보더 `border-base-gray-100`.
- 행 hover: `hover:bg-base-gray-25`.
- 셀 패딩: `px-spacing-6 py-spacing-5` 등 토큰만.
- 컬럼 정의는 **상수 배열로 추출**('완전 옵션화' 정신) → 렌더 매핑.

## 상태 처리 (필수)

- **로딩**: 스켈레톤 또는 스피너(`LoaderCircle`, lucide-react).
- **빈 상태**: 안내 문구 + (선택) 생성 유도 버튼. `text-font-icon-3` 톤.
- **에러 상태**: 재시도 버튼 포함.

## 모범 예제 (구조 골격)

```jsx
const COLUMNS = [
  { key: 'name',   label: '이름' },
  { key: 'email',  label: '이메일' },
  { key: 'status', label: '상태' },
];

export function MembersPage() {
  const rows = [/* ... */];

  return (
    <section className="mx-auto max-w-4xl px-spacing-7 py-spacing-10 text-left">
      <div className="mb-spacing-8 flex items-center justify-between">
        <div>
          <h2 className="text-18 font-semibold text-font-icon-5">멤버</h2>
          <p className="mt-spacing-3 text-14 text-font-icon-4">전체 멤버 목록</p>
        </div>
        <Button variant="fill" leftIcon={Plus}>멤버 추가</Button>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-round-4 border border-base-gray-100 py-spacing-12 text-center text-14 text-font-icon-3">
          아직 멤버가 없습니다.
        </div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-base-gray-100">
              {COLUMNS.map((c) => (
                <th key={c.key} className="px-spacing-6 py-spacing-5 text-left text-12 font-semibold text-font-icon-3">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-base-gray-100 hover:bg-base-gray-25">
                {COLUMNS.map((c) => (
                  <td key={c.key} className="px-spacing-6 py-spacing-5 text-14 text-font-icon-5">
                    {row[c.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
```

## 완료 체크리스트

- [ ] 페이지 추가 3단계('새 페이지 절차')를 수행했는가
- [ ] 컬럼 정의를 상수 배열로 분리했는가
- [ ] 색상/간격/보더가 토큰만 사용하는가
- [ ] 로딩 · 빈 상태 · 에러 상태를 모두 처리했는가
- [ ] 주요 액션 버튼이 공통 `Button`인가
- [ ] 행 hover 등 인터랙션 피드백이 있는가
- [ ] 반응형(가로 스크롤 또는 컬럼 축소) 대응했는가
- [ ] 다크모드(`dark:`) 대응했는가
