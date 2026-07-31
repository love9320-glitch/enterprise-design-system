import { useState } from 'react';
import { Avatar } from '../components/Avatar';
import DEMO_IMG from '../assets/avatar-sample.png'; // Figma 시안 샘플 이미지(8942:19689)
import { Checkbox } from '../components/Checkbox';
import { Divider } from '../components/Divider';
import { UsageExample } from '../components/UsageExample';

const USAGE = `import { Avatar } from '../components/Avatar';
import DEMO_IMG from '../assets/avatar-sample.png'; // Figma 시안 샘플 이미지(8942:19689)

// text 타입 — 이니셜 + 파란 배경(hover 시 진한 파랑)
<Avatar initial="G" onClick={openProfile} />

// image 타입 — src가 있으면 사진(안쪽 링 + hover 오버레이)
<Avatar src="/user.jpg" alt="홍길동" size="40" onClick={openProfile} />

// 정적 표시용 — hover/클릭/포커스 전부 차단(span 렌더)
<Avatar initial="G" interactive={false} />

// 사이즈 6단
<Avatar initial="G" size="24" /> … <Avatar initial="G" size="56" />`;

const USAGE_PROPS = [
  { name: 'src', type: 'string | null', default: 'null', desc: '이미지 URL — 있으면 image 타입(사진), 없으면 text 타입(이니셜)' },
  { name: 'initial', type: 'ReactNode', default: "''", desc: 'text 타입 이니셜(보통 1글자) — image 타입에선 alt 대체값으로도 사용' },
  { name: 'alt', type: 'string', default: '—', desc: '이미지 대체 텍스트(image 타입)' },
  { name: 'size', type: "'24' | '32' | '40' | '48' | '56'", default: "'32'", desc: '지름(px) 5단' },
  { name: 'interactive', type: 'boolean', default: 'true', desc: 'false면 hover 효과·클릭·포커스 차단(정적 표시용, span 렌더). true면 button 시맨틱+포커스 링' },
  { name: 'onClick', type: '(e) => void', default: '—', desc: '클릭 콜백(interactive일 때만 동작)' },
];

const SIZES = ['24', '32', '40', '48', '56'];

export function AvatarPage() {
  const [interactive, setInteractive] = useState(true);

  return (
    <section className="py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-20 font-semibold text-font-icon-5">Avatar</h2>
      <p className="mb-spacing-8 text-14 text-font-icon-4">
        사용자 아바타입니다. <span className="text-font-icon-5">src</span>가 있으면 사진(image 타입 —
        경계 안쪽 링 + hover 오버레이), 없으면 이니셜(text 타입 — 파란 배경, hover 시 진한 파랑)로
        표시됩니다. Pressed 색은 Figma 스펙대로 Default를 재사용하며,{' '}
        <span className="text-font-icon-5">interactive=false</span>로 hover·클릭·포커스를 전부 막아
        정적 표시용으로 쓸 수 있습니다.
      </p>

      <UsageExample
        code={USAGE}
        props={USAGE_PROPS}
        note="색은 avatar-* 시멘틱 토큰(Figma avatar/* 변수 1:1)만 사용합니다. 이니셜 글자 크기는 사이즈별 등록 텍스트 토큰으로 근사(32=14px는 Figma 스펙)."
      />

      {/* 사이즈 × 타입 */}
      <div className="mb-spacing-6 flex items-center gap-spacing-7">
        <p className="text-12 text-font-icon-3">공통 옵션</p>
        <Checkbox label="interactive (hover/클릭)" checked={interactive} onChange={() => setInteractive((v) => !v)} />
      </div>
      <div className="space-y-spacing-7">
        <div className="grid grid-cols-[120px_1fr] items-center gap-x-spacing-6">
          <p className="text-12 text-font-icon-3">image · 사이즈 5단</p>
          <div className="flex flex-wrap items-end gap-spacing-6">
            {SIZES.map((s) => (
              <Avatar key={s} src={DEMO_IMG} alt={`${s}px 아바타`} size={s} interactive={interactive} />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-[120px_1fr] items-center gap-x-spacing-6">
          <p className="text-12 text-font-icon-3">text · 사이즈 5단</p>
          <div className="flex flex-wrap items-end gap-spacing-6">
            {SIZES.map((s) => (
              <Avatar key={s} initial="G" size={s} interactive={interactive} />
            ))}
          </div>
        </div>
      </div>

      <Divider className="mt-spacing-9 mb-spacing-8" />

      {/* 상태 */}
      <h3 className="mb-spacing-5 text-16 font-semibold text-font-icon-5">상태</h3>
      <ul className="list-disc space-y-spacing-3 pl-spacing-8 text-14 text-font-icon-4">
        <li><span className="text-font-icon-5">Default → Hover</span> — text는 배경 blue 400→500, image는 어두운 오버레이(7%). CSS로 자동</li>
        <li><span className="text-font-icon-5">Pressed</span> — Figma 스펙이 Default 색 재사용이라 별도 스타일 없음</li>
        <li><span className="text-font-icon-5">interactive=false</span> — hover 효과 없음 + 클릭/포커스 불가(span 렌더, 커서 기본). 목록 셀 등 정적 표기에 사용</li>
      </ul>
    </section>
  );
}
