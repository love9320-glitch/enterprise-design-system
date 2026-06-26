# Template — 폼 / 입력 / 등록·수정 페이지

데이터를 입력·생성·수정하는 폼 페이지 규칙. `foundation.md` + `components.md` 전제.
페이지 추가는 **'새 페이지 절차'** 규칙을 따른다.

## 레이아웃 규칙

- 페이지 컨테이너: `mx-auto max-w-xl px-spacing-7 py-spacing-10 text-left` (폼은 너비를 좁게).
- 상단: 타이틀(등록/수정) + 설명.
- 필드들: 세로 스택 `space-y-spacing-7`.
- 하단: 우측 정렬 액션(`취소` line/ghost + `저장` fill).

## 입력은 손으로 짜지 말 것 (규칙 4)

`<input>`에 보더·패딩·focus·에러 스타일을 직접 칠하지 않는다. 입력은 이미 컴포넌트가 있다.

- 텍스트 입력 → **`Input`** (default/hover/focused/filled/disabled/readOnly/error 상태·에러 툴팁 내장)
- 셀렉트 → **`Select`** · 날짜 → **`DateField`** · 시간 → **`TimeField`** · 리치 텍스트 → **`Editor`**
- 폼 모달이면 본문을 **`FormModal`**(취소/저장 + form 래핑)에 넣는다(`templates/modal.md`).

필드(라벨+입력+에러)는 **상수 배열**로 정의해 매핑 렌더한다. 라벨 `text-13 font-semibold text-font-icon-5`, 필수 표시 `*`는 강조 토큰. 에러 메시지는 `Input`의 `error`/`errorMessage` 툴팁을 쓰고, 보더색·간격은 컴포넌트가 토큰으로 처리한다. 전체 옵션은 `components.md`의 Input/Select/DateField 카탈로그 행과 코드가 진실이다.

## 동작 규칙

- 제출 중(`submitting`) 시 저장 버튼 `loading`, 중복 제출 차단.
- 클라이언트 검증 → `Input`의 `error`+`errorMessage`로 인라인 표시.
- 수정 모드는 초기값 주입, 등록 모드는 빈 값. `mode` props로 분기.

## 모범 예제 — 공통 `Input`·`Button` 조립

```jsx
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useState } from 'react';

// 필드 정의는 상수 배열로
const FIELDS = [
  { key: 'name',  label: '이름',   required: true,  placeholder: '이름 입력' },
  { key: 'email', label: '이메일', required: true,  placeholder: 'name@example.com' },
  { key: 'memo',  label: '메모',   required: false, placeholder: '선택 입력' },
];

export function MemberFormPage({ mode = 'create', initial = {} }) {
  const [values, setValues] = useState(initial);
  const [submitting, setSubmitting] = useState(false);
  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }));

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
            {/* 보더·focus·에러 스타일은 Input이 처리 — 손으로 칠하지 않는다 */}
            <Input
              value={values[f.key] ?? ''}
              placeholder={f.placeholder}
              onChange={set(f.key)}
              width="fill"
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

> 모달 안 폼이면 위 본문을 `FormModal`에 그대로 넣는다(`onSubmit`/`loading` 위임). 셀렉트·날짜·리치텍스트는 각각 `Select`/`DateField`/`Editor`로 — 직접 만들지 않는다.

## 완료 체크리스트

- [ ] `<input>`을 손으로 짜지 않고 공통 `Input`(셀렉트=`Select`·날짜=`DateField` 등)을 **조립**했는가 (규칙 4)
- [ ] 페이지 추가 3단계('새 페이지 절차')를 수행했는가
- [ ] 필드 정의를 상수 배열로 분리해 매핑 렌더했는가
- [ ] 검증·에러를 `Input`의 `error`/`errorMessage`로 인라인 표시했는가
- [ ] 제출 중 `loading` + 중복 제출 차단을 처리했는가
- [ ] 등록/수정 모드 분기(`mode`)를 처리했는가
- [ ] 모달 폼이면 `FormModal`에 넣어 form 래핑·유효성을 위임했는가
- [ ] 취소 동선이 공통 `Button`인가
