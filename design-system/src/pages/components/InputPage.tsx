import { useState } from 'react';
import { Input } from '@gusun/design-system';
import { UsageExample } from '../../components/UsageExample';
import { Divider } from '@gusun/design-system';

const USAGE = `import { Input } from '@gusun/design-system';

// 제어 컴포넌트
const [name, setName] = useState('');
<Input value={name} onChange={(e) => setName(e.target.value)} placeholder="이름" />

// readOnly / disabled
<Input value="고정값" readOnly />
<Input disabled />

// 에러 — 테두리 대신 하단 툴팁으로 표시(레이아웃 공간 차지 X)
<Input error errorMessage="필수 입력사항입니다." width={320} />

// transparent — 박스·배경·링 없이 텍스트만(가로 패딩 0). 플레이스홀더도 filled와 같은 진한색,
// 포커스에도 링이 없다. 셀·구획 안에 인풋을 플러시하게 얹을 때 사용(에러 툴팁은 동일).
<Input variant="transparent" placeholder="텍스트를 입력하세요" />

// 입력 타입(type) — 필터·자동 포맷·형식 검증
<Input type="number" comma unit="원" placeholder="희망 연봉" />   // 숫자만+천단위 콤마+단위
<Input type="password" placeholder="비밀번호" />                  // 마스킹+눈 토글
<Input type="email" placeholder="이메일" />                       // blur 시 형식 검증(잘못된 양식입니다.)
<Input type="tel" placeholder="전화번호" />                       // 하이픈 자동(010-9358-9320)
<Input type="url" placeholder="포트폴리오 링크" />                 // blur 시 형식 검증
<Input type="korean" placeholder="이름(한글)" />                  // 한글만 입력`;

const USAGE_PROPS = [
  { name: 'value', type: 'string', default: '—', desc: '입력값 (제어 컴포넌트로 쓸 때)' },
  { name: 'defaultValue', type: 'string', default: '—', desc: '초기값 (비제어로 쓸 때)' },
  { name: 'onChange', type: '(e) => void', default: '—', desc: '입력 변경 핸들러 (e.target.value)' },
  { name: 'placeholder', type: 'string', default: "'텍스트를 입력하세요'", desc: '플레이스홀더 문구' },
  { name: 'size', type: "'32' | '22'", default: "'32'", desc: "높이 — 32(text-14) / 22(작게, text-12·leading-18 핏, 좁은 셀·인라인용)" },
  { name: 'variant', type: "'solid' | 'transparent'", default: "'solid'", desc: "'transparent'=박스·배경·링 없이 텍스트만(가로 패딩 0, 플레이스홀더도 진한색, hover·포커스 시 플레이스홀더만 gray 300, 포커스 링 없음)" },
  { name: 'type', type: "'text'|'number'|'password'|'email'|'tel'|'url'|'korean'|'english'", default: "'text'", desc: '입력 타입 — number=숫자만 / password=마스킹+눈 토글 / email·url=blur 시 형식 검증(표준 카피 툴팁) / tel=하이픈 자동 / korean·english=허용 문자 필터(IME 조합 안전)' },
  { name: 'decimal / comma', type: 'boolean', default: 'true / false', desc: 'number 전용 — 소수점 1개 허용 / 천 단위 콤마 자동(값도 콤마 포함 문자열)' },
  { name: 'unit', type: 'string', default: '—', desc: '우측 단위 suffix("원"·"점"·"년") — 값과 무관하게 회색(default-text) 고정, disabled 시 비활성 색' },
  { name: 'showPasswordToggle', type: 'boolean', default: 'true', desc: 'password 전용 — 우측 눈(보기/숨김) 토글 표시' },
  { name: 'formatErrorMessage', type: 'string', default: "'잘못된 양식입니다.'", desc: 'email/url 형식 검증 실패 툴팁 문구(표준 카피 자동 적용, 필요 시만 덮어쓰기)' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '비활성 — 입력 차단(회색)' },
  { name: 'readOnly', type: 'boolean', default: 'false', desc: '읽기 전용 — 값은 보이되 편집 불가' },
  { name: 'error', type: 'boolean', default: 'false', desc: '에러 상태 — errorMessage 툴팁 표시 + 텍스트 red 400' },
  { name: 'errorMessage', type: 'string', default: "'필수 입력사항입니다.'", desc: '에러 툴팁 문구 (error=true일 때 하단 오버레이) — 표준 카피 자동 적용, 필요 시만 덮어쓰기' },
  { name: 'width', type: 'number | string', default: '200', desc: '너비 — 숫자=px, 문자열=CSS 길이' },
  { name: 'inputProps', type: 'object', default: '{}', desc: '내부 <input>에 전달할 속성' },
  { name: 'className', type: 'string', default: "''", desc: '컨테이너 추가 클래스' },
  { name: '(DOM 상태 꼬리표)', type: 'data-state · data-variant · data-size · data-type', default: '자동', desc: '래퍼에 자동 부착(규칙 23) — data-state는 배타 상태 하나(error > disabled > readonly > default 우선순위). 테스트 셀렉터([data-state=error])·DevTools 상태 확인용, prop 아님' },
];

const ROWS = [
  { label: 'Default',   props: {} },
  { label: 'Filled',    props: { defaultValue: '텍스트 입력 완료' } },
  { label: 'Read only', props: { readOnly: true, defaultValue: '읽기 전용 값' } },
  { label: 'Disabled',  props: { disabled: true, defaultValue: '비활성 값' } },
];

// 필수 입력 검증 데모 — 비어 있으면 에러 툴팁, 입력하면 사라진다.
function ValidationDemo() {
  const [value, setValue] = useState('');
  const isEmpty = value.trim() === '';

  return (
    <Input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      error={isEmpty}
      errorMessage="필수 입력사항입니다."
    />
  );
}

export function InputPage() {
  return (
    <section className="py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-20 font-semibold text-font-icon-5">Input</h2>
      <p className="mb-spacing-8 text-14 text-font-icon-4">
        텍스트 입력 필드 (solid 타입). <span className="text-font-icon-5">Hover</span>·
        <span className="text-font-icon-5">Focus</span>는 직접 확인하세요.<br />에러는 테두리를 바꾸지 않고
        <span className="text-font-icon-5"> 툴팁 오버레이</span>로 표시하며, 인풋 아래 공간을 차지하지 않아
        다른 컴포넌트 영역에 영향을 주지 않습니다.
      </p>

      <UsageExample code={USAGE} props={USAGE_PROPS} />

      <div className="space-y-spacing-7">
        {ROWS.map(({ label, props }) => (
          <div key={label} className="grid grid-cols-[100px_1fr] items-center gap-x-spacing-6">
            <p className="text-12 text-font-icon-3">{label}</p>
            <Input {...props} />
          </div>
        ))}

        {/* Error — 툴팁이 아래로 오버레이되므로 행 하단에 여백을 둔다 */}
        <div className="grid grid-cols-[100px_1fr] items-start gap-x-spacing-6 pb-spacing-9">
          <p className="pt-spacing-4 text-12 text-font-icon-3">Error</p>
          <Input error errorMessage="필수 입력사항입니다." />
        </div>
      </div>

      {/* Transparent — 박스·배경·링 없이 텍스트만(Figma input transparent 8616:41229) */}
      <Divider className="mt-spacing-9 mb-spacing-8" />
      <div>
        <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">Transparent — 투명 타입</h3>
        <p className="mb-spacing-7 text-12 text-font-icon-4">
          <code className="text-font-icon-5">variant="transparent"</code> — 박스·배경·링 없이 텍스트만
          보입니다(가로 패딩 0). 플레이스홀더도 filled와 같은 진한색이고, hover와 입력 중(포커스)에는 플레이스홀더만 회색(gray 300)으로 바뀌고, 입력된 값 텍스트는 항상 진한색을 유지합니다. 포커스에도 링이 없습니다. 셀·구획 안에
          인풋을 플러시하게 얹을 때 사용하며 에러 툴팁은 solid와 동일합니다.
        </p>
        <div className="space-y-spacing-7">
          {[
            { label: 'Default', props: {} },
            { label: 'Filled', props: { defaultValue: '텍스트 입력 완료' } },
            { label: 'Read only', props: { readOnly: true, defaultValue: '읽기 전용 값' } },
            { label: 'Disabled', props: { disabled: true } },
          ].map(({ label, props }) => (
            <div key={label} className="grid grid-cols-[100px_1fr] items-center gap-x-spacing-6">
              <p className="text-12 text-font-icon-3">{label}</p>
              <Input variant="transparent" {...props} />
            </div>
          ))}
          <div className="grid grid-cols-[100px_1fr] items-start gap-x-spacing-6 pb-spacing-9">
            <p className="pt-spacing-4 text-12 text-font-icon-3">Error</p>
            <Input variant="transparent" error errorMessage="필수 입력사항입니다." />
          </div>
        </div>
      </div>

      {/* Size 옵션 — 32(기본) / 22(작게) */}
      <Divider className="mt-spacing-9 mb-spacing-8" />
      <div>
        <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">Size 옵션</h3>
        <p className="mb-spacing-7 text-12 text-font-icon-4">
          <code className="text-font-icon-5">size="32"</code>(기본, 높이 32·text-14) /{' '}
          <code className="text-font-icon-5">size="22"</code>(작게, 높이 22·text-12·leading-18 — 좁은 셀·인라인용).
        </p>
        <div className="space-y-spacing-7">
          <div className="grid grid-cols-[120px_1fr] items-center gap-x-spacing-6">
            <p className="text-12 text-font-icon-3">size="32" (기본)</p>
            <Input width={160} defaultValue="기본 32" />
          </div>
          <div className="grid grid-cols-[120px_1fr] items-center gap-x-spacing-6">
            <p className="text-12 text-font-icon-3">size="22" (작게)</p>
            <Input size="22" width={160} defaultValue="작게 22" />
          </div>
          <div className="grid grid-cols-[120px_1fr] items-center gap-x-spacing-6">
            <p className="text-12 text-font-icon-3">size="22" placeholder</p>
            <Input size="22" width={160} placeholder="텍스트를 입력하세요" />
          </div>
        </div>
      </div>

      {/* Width 옵션 — 미지정 시 200px, 숫자(px)나 '100%' 등 지정 가능 */}
      <Divider className="mt-spacing-9 mb-spacing-8" />
      <div>
        <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">Width 옵션</h3>
        <p className="mb-spacing-7 text-12 text-font-icon-4">
          <code className="text-font-icon-5">width</code> 미지정 시 기본 200px. 숫자는 px,
          문자열은 CSS 길이(<code className="text-font-icon-5">'100%'</code>,{' '}
          <code className="text-font-icon-5">'24rem'</code> 등)로 적용됩니다.
        </p>
        <div className="space-y-spacing-7">
          <div className="grid grid-cols-[120px_1fr] items-center gap-x-spacing-6">
            <p className="text-12 text-font-icon-3">기본 (200px)</p>
            <Input />
          </div>
          <div className="grid grid-cols-[120px_1fr] items-center gap-x-spacing-6">
            <p className="text-12 text-font-icon-3">width=320</p>
            <Input width={320} defaultValue="320px 너비" />
          </div>
          <div className="grid grid-cols-[120px_1fr] items-center gap-x-spacing-6">
            <p className="text-12 text-font-icon-3">width="100%"</p>
            <Input width="100%" defaultValue="가로 100%" />
          </div>
        </div>
      </div>

      {/* 입력 타입·단위 — Figma input unit 9275:316 / input password 9275:519 */}
      <Divider className="mt-spacing-9 mb-spacing-8" />
      <div>
        <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">입력 타입 (type) · 단위 (unit)</h3>
        <p className="mb-spacing-7 text-12 text-font-icon-4">
          한 축의 <code className="text-font-icon-5">type</code> 옵션으로 허용 문자 필터·자동 포맷·형식
          검증을 제공합니다. 직접 타이핑해 보세요 — 숫자는 콤마가 자동으로 찍히고, 전화번호는 하이픈이
          붙고, 이메일·URL은 <span className="text-font-icon-5">포커스를 벗어날 때</span> 형식을 검사해
          표준 카피(잘못된 양식입니다.) 툴팁을 띄웁니다.
        </p>
        <div className="space-y-spacing-7">
          <div className="grid grid-cols-[100px_1fr] items-center gap-x-spacing-6">
            <p className="text-12 text-font-icon-3">number+unit</p>
            <Input type="number" comma unit="원" placeholder="희망 연봉" width={240} />
          </div>
          <div className="grid grid-cols-[100px_1fr] items-center gap-x-spacing-6">
            <p className="text-12 text-font-icon-3">number(점수)</p>
            <Input type="number" decimal={false} unit="점" placeholder="점수" width={160} />
          </div>
          <div className="grid grid-cols-[100px_1fr] items-center gap-x-spacing-6">
            <p className="text-12 text-font-icon-3">password</p>
            <Input type="password" placeholder="비밀번호를 입력하세요" width={240} />
          </div>
          <div className="grid grid-cols-[100px_1fr] items-start gap-x-spacing-6 pb-spacing-8">
            <p className="pt-spacing-4 text-12 text-font-icon-3">email</p>
            <Input type="email" placeholder="이메일 주소" width={240} />
          </div>
          <div className="grid grid-cols-[100px_1fr] items-center gap-x-spacing-6">
            <p className="text-12 text-font-icon-3">tel</p>
            <Input type="tel" placeholder="전화번호" width={240} />
          </div>
          <div className="grid grid-cols-[100px_1fr] items-start gap-x-spacing-6 pb-spacing-8">
            <p className="pt-spacing-4 text-12 text-font-icon-3">url</p>
            <Input type="url" placeholder="포트폴리오 링크" width={280} />
          </div>
          <div className="grid grid-cols-[100px_1fr] items-center gap-x-spacing-6">
            <p className="text-12 text-font-icon-3">korean</p>
            <Input type="korean" placeholder="이름(한글만)" width={200} />
          </div>
          <div className="grid grid-cols-[100px_1fr] items-center gap-x-spacing-6">
            <p className="text-12 text-font-icon-3">english</p>
            <Input type="english" placeholder="Name (English only)" width={200} />
          </div>
        </div>
      </div>

      {/* 인터랙티브 — 필수 입력 검증 + 오버레이가 아래 인풋에 영향 없음 시연 */}
      <Divider className="mt-spacing-9 mb-spacing-8" />
      <div>
        <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">
          인터랙티브 — 필수 입력 검증
        </h3>
        <p className="mb-spacing-7 text-12 text-font-icon-4">
          위 인풋이 비어 있으면 에러 툴팁이 뜨고, 입력하면 사라집니다. 에러 툴팁은 absolute 오버레이라
          <span className="text-font-icon-5"> 아래 인풋의 위치·영역을 전혀 밀지 않습니다</span> —
          위 인풋에 타이핑하며 툴팁이 나타났다 사라져도 아래 인풋이 고정인지 확인하세요.
        </p>
        <div className="space-y-spacing-7">
          <div className="grid grid-cols-[100px_1fr] items-center gap-x-spacing-6">
            <p className="text-12 text-font-icon-3">Validation</p>
            <ValidationDemo />
          </div>
          <div className="grid grid-cols-[100px_1fr] items-center gap-x-spacing-6">
            <p className="text-12 text-font-icon-3">다음 인풋</p>
            <Input defaultValue="고정된 다음 인풋" />
          </div>
        </div>
      </div>
    </section>
  );
}
