# Template — 폼 / 입력 / 등록·수정 페이지

데이터를 입력·생성·수정하는 폼 페이지 규칙. `foundation.md` + `components.md` 전제.
페이지 추가는 **'새 페이지 절차'** 규칙을 따른다.

## 레이아웃 규칙

- 페이지 컨테이너: `mx-auto max-w-xl px-spacing-7 py-spacing-10 text-left` (폼은 너비를 좁게).
- 상단: 타이틀(등록/수정) + 설명.
- 필드들: 세로 스택 `space-y-spacing-7`.
- 하단: 우측 정렬 액션(`취소` line/ghost + `저장` fill).

## 필드 규칙

- 필드 = 라벨 + 인풋 + (보조설명/에러) 묶음.
- 라벨: `text-13 font-semibold text-font-icon-5`, 필수 표시 `*`는 강조 색 토큰.
- 인풋 공통: `rounded-round-4 border-1 border-base-gray-150 px-spacing-6 py-spacing-4 text-14 text-font-icon-5`, `placeholder:text-font-icon-3`, focus `focus:border-base-gray-400`.
- 에러: `text-12 text-font-icon-...`(에러 시멘틱 토큰 없으면 먼저 정의), 인풋 보더도 에러색.
- 인풋은 가능하면 공통 컴포넌트(`Input`)로 추출해 완전 옵션화('완전 옵션화' 규칙).
- 필드 정의를 **상수 배열로 추출**해 매핑 렌더 권장.

## 동작 규칙

- 제출 중(`submitting`) 시 저장 버튼 `loading`, 중복 제출 차단.
- 클라이언트 검증 → 에러 메시지 인라인 표시.
- 수정 모드는 초기값 주입, 등록 모드는 빈 값. `mode` props로 분기.

## 모범 예제 (구조 골격)

```jsx
const FIELDS = [
  { key: 'name',  label: '이름',   type: 'text',  required: true,  placeholder: '이름 입력' },
  { key: 'email', label: '이메일', type: 'email', required: true,  placeholder: 'name@example.com' },
  { key: 'memo',  label: '메모',   type: 'text',  required: false, placeholder: '선택 입력' },
];

export function MemberFormPage({ mode = 'create', initial = {} }) {
  const [values, setValues] = useState(initial);
  const [submitting, setSubmitting] = useState(false);

  return (
    <section className="mx-auto max-w-xl px-spacing-7 py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-18 font-semibold text-font-icon-5">
        {mode === 'edit' ? '멤버 수정' : '멤버 등록'}
      </h2>
      <p className="mb-spacing-8 text-14 text-font-icon-4">정보를 입력하세요.</p>

      <form className="space-y-spacing-7">
        {FIELDS.map((f) => (
          <div key={f.key}>
            <label className="mb-spacing-4 block text-13 font-semibold text-font-icon-5">
              {f.label}{f.required && <span className="text-font-icon-4"> *</span>}
            </label>
            <input
              type={f.type}
              value={values[f.key] ?? ''}
              placeholder={f.placeholder}
              onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
              className="w-full rounded-round-4 border-1 border-base-gray-150 px-spacing-6 py-spacing-4 text-14 text-font-icon-5 placeholder:text-font-icon-3 focus:border-base-gray-400 focus:outline-none"
            />
          </div>
        ))}

        <div className="flex justify-end gap-spacing-5 pt-spacing-5">
          <Button variant="line" type="button">취소</Button>
          <Button variant="fill" type="submit" loading={submitting}>저장</Button>
        </div>
      </form>
    </section>
  );
}
```

## 완료 체크리스트

- [ ] 페이지 추가 3단계('새 페이지 절차')를 수행했는가
- [ ] 필드 정의를 상수 배열로 분리했는가
- [ ] 인풋/라벨/에러 색상·간격·보더가 토큰만 사용하는가 (필요한 시멘틱 토큰 먼저 정의)
- [ ] 인풋을 공통 컴포넌트로 옵션화했는가 (또는 그럴 계획이 명확한가)
- [ ] 필수/검증/에러 인라인 표시를 처리했는가
- [ ] 제출 중 `loading` + 중복 제출 차단을 처리했는가
- [ ] 등록/수정 모드 분기(`mode`)를 처리했는가
- [ ] 취소 동선 + 반응형 + 다크모드(`dark:`) 대응했는가
