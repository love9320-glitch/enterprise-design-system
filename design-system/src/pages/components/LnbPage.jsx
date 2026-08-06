// LnbPage — LNB 메뉴 데모
// Figma menu(8843:8836)·menu group·site title·LNB(8844:9329) — 1/2/sub depth 메뉴 트리.
import { useState } from 'react';
import { Users, FileText, Settings, LayoutGrid } from 'lucide-react';
import { Lnb, LnbMenu, LnbMenuGroup } from '../../layouts/Lnb';
import { UsageExample } from '../../components/UsageExample';
import { Divider } from '../../components/Divider';

const USAGE = `import { Lnb, LnbMenu, LnbMenuGroup } from '../../layouts/Lnb';

// 데이터 모드 — groups 트리로 렌더. children이 있는 항목은 2depth 펼침 부모가 된다.
<Lnb
  siteTitle={<>DESIGN<br />SYSTEM</>}
  groups={[
    { title: '메뉴 카테고리', items: [
      { value: 'members', label: '멤버 관리', icon: Users },
      { value: 'docs', label: '문서', icon: FileText },
    ]},
    { title: '메뉴 카테고리', items: [
      { value: 'screening', label: '스크리닝', children: [
        { value: 'screening-list', label: '목록' },
        { value: 'screening-new', label: '새 스크리닝' },
      ]},
    ]},
  ]}
  value={current}
  onChange={setCurrent}          // 메뉴(1depth·sub) 선택
  defaultExpanded={['screening']} // 처음부터 펼칠 부모
/>

// 조립 모드 — 그룹/메뉴를 직접 배치
<Lnb siteTitle="ATS">
  <LnbMenuGroup title="메뉴 카테고리">
    <LnbMenu label="멤버 관리" icon={Users} selected />
    <LnbMenu label="설정" icon={Settings} />
  </LnbMenuGroup>
</Lnb>`;

const USAGE_PROPS = [
  { name: 'Lnb · siteTitle', type: 'ReactNode', default: 'null', desc: '상단 사이트 타이틀(20px semibold) — null이면 숨김' },
  { name: 'Lnb · groups', type: '{ title?, items: LnbItem[] }[]', default: '—', desc: '데이터 모드 트리. LnbItem={ value, label, icon?, disabled?, children? } — children 있으면 2depth 펼침 부모' },
  { name: 'Lnb · value / defaultValue / onChange', type: 'string / string / (value)=>void', default: '—', desc: '선택 메뉴(1depth·sub) — 부모(2depth)는 선택이 아니라 펼침 토글' },
  { name: 'Lnb · defaultExpanded / onToggleExpand', type: 'string[] / (value, open)=>void', default: '[] / —', desc: '2depth 초기 펼침 목록 / 펼침·접힘 알림(상태는 내부 소유)' },
  { name: 'Lnb · width', type: 'number | string', default: '138', desc: '컨테이너 폭(px/CSS 길이)' },
  { name: 'Lnb · height', type: 'number | string', default: '—', desc: "지정 시 LNB 높이 고정 + 내부 스크롤(타이틀 포함 전체, 오버레이 스크롤바) — 레이아웃에선 '100%'로 화면 높이에 맞춤. 미지정 시 자연 높이" },
  { name: 'LnbMenu · depth', type: "'1' | '2' | 'sub'", default: "'1'", desc: "1=아이콘 메뉴 · 2=펼침 부모(chevron ▸/▾) · sub=들여쓴 하위(좌 32px)" },
  { name: 'LnbMenu · label / icon / open', type: 'ReactNode / LucideIcon / boolean', default: '— / null / false', desc: '메뉴명(잘리면 hover 툴팁) / 1depth 아이콘 / 2depth 펼침 여부' },
  { name: 'LnbMenu · iconArea', type: 'boolean', default: 'true', desc: 'false면 1depth 아이콘 영역(24px) 생략 — 아이콘 없는 플레인 메뉴(LnbItem.iconArea로 데이터 모드 지정)' },
  { name: 'LnbMenu · selected / disabled', type: 'boolean', default: 'false', desc: '선택(1·sub=파란 배경+텍스트, 2=펼침 표현) / 비활성' },
  { name: 'LnbMenu · wrap / Lnb · menuWrap', type: 'boolean', default: 'false', desc: '긴 메뉴명 — false=말줄임+hover 툴팁 / true=줄바꿈으로 전체 표시(Table wrap과 동일 규약)' },
  { name: 'LnbMenuGroup · title', type: 'ReactNode', default: 'null', desc: '카테고리 텍스트(12px 회색) — null이면 숨김' },
];

// 전체 LNB 데모 — 선택·펼침이 실제로 동작
function LnbLiveDemo() {
  const [current, setCurrent] = useState('members');
  return (
    <div className="flex items-start gap-spacing-9">
      <div className="rounded-round-4 border border-base-gray-100">
        <Lnb
          siteTitle={
            <>
              DESIGN
              <br />
              SYSTEM
            </>
          }
          groups={[
            {
              title: '메뉴 카테고리',
              items: [
                { value: 'members', label: '멤버 관리', icon: Users },
                { value: 'docs', label: '문서', icon: FileText },
                { value: 'disabled', label: '비활성 메뉴', icon: Settings, disabled: true },
              ],
            },
            {
              title: '메뉴 카테고리',
              items: [
                {
                  value: 'screening',
                  label: '스크리닝',
                  children: [
                    { value: 'screening-list', label: '목록' },
                    { value: 'screening-new', label: '새 스크리닝' },
                  ],
                },
                { value: 'layout', label: '레이아웃', icon: LayoutGrid },
              ],
            },
          ]}
          value={current}
          onChange={setCurrent}
          defaultExpanded={['screening']}
        />
      </div>
      <p className="pt-spacing-6 font-mono text-12 text-font-icon-3">selected: {current}</p>
    </div>
  );
}

export function LnbPage() {
  return (
    <section className="py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-20 font-semibold text-font-icon-5">LNB Menu</h2>
      <p className="mb-spacing-9 text-14 text-font-icon-4">
        좌측 내비게이션 메뉴 — 사이트 타이틀 + 카테고리 그룹 + 메뉴 트리(1depth 아이콘 메뉴 ·
        2depth 펼침 부모 · sub depth 하위)로 구성됩니다. 선택은 파란 배경(1depth·sub), 부모는
        chevron 펼침으로 표현하며, 색은 lnb 시멘틱 토큰만 사용합니다. 레이아웃(GNB/LNB/Body)
        카테고리의 LNB 영역에 들어갈 빌딩 블록입니다.
      </p>

      <UsageExample code={USAGE} props={USAGE_PROPS} note="children이 있는 항목은 자동으로 2depth 펼침 부모가 되고, 선택(value)은 1depth·sub 메뉴에만 적용됩니다." />

      <h3 className="mb-spacing-5 text-15 font-semibold text-font-icon-5">Live — 선택·펼침 동작</h3>
      <LnbLiveDemo />

      {/* 단독 상태 — LnbMenu depth × 상태 */}
      <Divider className="mt-spacing-9 mb-spacing-8" />
      <div>
        <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">LnbMenu — depth × 상태</h3>
        <p className="mb-spacing-7 text-12 text-font-icon-4">
          hover·click은 직접 확인하세요(click: 1depth·sub=선택색, 2depth=회색). disabled는 클릭이 차단됩니다.
        </p>
        <div className="flex flex-wrap items-start gap-spacing-10">
          <div className="w-[140px] space-y-spacing-3">
            <p className="mb-spacing-4 text-12 text-font-icon-3">1depth</p>
            <LnbMenu label="메뉴명입니다" icon={Users} />
            <LnbMenu label="메뉴명입니다" icon={Users} selected />
            <LnbMenu label="메뉴명입니다" icon={Users} disabled />
          </div>
          <div className="w-[140px] space-y-spacing-3">
            <p className="mb-spacing-4 text-12 text-font-icon-3">2depth (펼침 부모)</p>
            <LnbMenu label="메뉴명입니다" depth="2" />
            <LnbMenu label="메뉴명입니다" depth="2" open selected />
            <LnbMenu label="메뉴명입니다" depth="2" disabled />
          </div>
          <div className="w-[140px] space-y-spacing-3">
            <p className="mb-spacing-4 text-12 text-font-icon-3">sub depth</p>
            <LnbMenu label="메뉴명입니다" depth="sub" />
            <LnbMenu label="메뉴명입니다" depth="sub" selected />
            <LnbMenu label="메뉴명입니다" depth="sub" disabled />
          </div>
        </div>
      </div>

      {/* 내부 스크롤 — height 지정 시 메뉴 목록만 스크롤 */}
      <Divider className="mt-spacing-9 mb-spacing-8" />
      <div>
        <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">내부 스크롤 — height</h3>
        <p className="mb-spacing-7 text-12 text-font-icon-4">
          <code className="text-font-icon-5">height</code>를 지정하면 브라우저 전체 스크롤 대신{' '}
          <strong className="font-semibold text-font-icon-5">LNB 안에서만</strong> 내용이
          스크롤됩니다(사이트 타이틀 포함 LNB 전체가 함께 스크롤, 오버레이 스크롤바). 레이아웃에 넣을 때는{' '}
          <code className="text-font-icon-5">height="100%"</code>로 화면 높이를 따라갑니다.
        </p>
        <div className="inline-block rounded-round-4 border border-base-gray-100">
          <Lnb
            siteTitle={
              <>
                DESIGN
                <br />
                SYSTEM
              </>
            }
            height={320}
            groups={[
              {
                title: '메뉴 카테고리',
                items: Array.from({ length: 6 }, (_, i) => ({
                  value: `a-${i + 1}`,
                  label: `메뉴 ${i + 1}`,
                  icon: Users,
                })),
              },
              {
                title: '메뉴 카테고리',
                items: Array.from({ length: 6 }, (_, i) => ({
                  value: `b-${i + 1}`,
                  label: `메뉴 ${i + 7}`,
                  icon: FileText,
                })),
              },
            ]}
            defaultValue="a-1"
          />
        </div>
      </div>

      {/* 긴 메뉴명 — 말줄임 vs 2줄 클램프 */}
      <Divider className="mt-spacing-9 mb-spacing-8" />
      <div>
        <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">긴 메뉴명 — wrap</h3>
        <p className="mb-spacing-7 text-12 text-font-icon-4">
          <code className="text-font-icon-5">wrap=false</code>(기본)는 한 줄 말줄임 — 잘리면 hover 시
          전체 이름 툴팁이 뜹니다. <code className="text-font-icon-5">true</code>는 줄바꿈으로 전체를
          표시합니다(툴팁 불필요).
        </p>
        <div className="flex items-start gap-spacing-10">
          <div className="w-[140px]">
            <p className="mb-spacing-4 text-12 text-font-icon-3">wrap=false (말줄임+툴팁)</p>
            <LnbMenu label="아주 길어서 잘리는 메뉴 이름입니다" icon={Users} />
          </div>
          <div className="w-[140px]">
            <p className="mb-spacing-4 text-12 text-font-icon-3">wrap=true (전체 표시)</p>
            <LnbMenu label="아주 길어서 여러 줄로 내려가는 메뉴 이름입니다" icon={Users} wrap />
          </div>
        </div>
      </div>

      {/* 그룹 — 카테고리 타이틀 on/off */}
      <Divider className="mt-spacing-9 mb-spacing-8" />
      <div>
        <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">LnbMenuGroup — 카테고리</h3>
        <p className="mb-spacing-7 text-12 text-font-icon-4">
          <code className="text-font-icon-5">title</code>이 있으면 12px 회색 카테고리가 붙고, null이면 메뉴만 쌓입니다.
        </p>
        <div className="flex items-start gap-spacing-10">
          <div className="w-[140px]">
            <LnbMenuGroup title="메뉴 카테고리">
              <LnbMenu label="멤버 관리" icon={Users} />
              <LnbMenu label="문서" icon={FileText} selected />
            </LnbMenuGroup>
          </div>
          <div className="w-[140px]">
            <LnbMenuGroup>
              <LnbMenu label="멤버 관리" icon={Users} />
              <LnbMenu label="문서" icon={FileText} />
            </LnbMenuGroup>
          </div>
        </div>
      </div>
    </section>
  );
}
