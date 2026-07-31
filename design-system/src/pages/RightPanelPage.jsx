import { useState } from 'react';
import { RightPanel } from '../components/RightPanel';
import { Button } from '../components/Button';
import { ButtonGroup } from '../components/ButtonGroup';
import { Checkbox } from '../components/Checkbox';
import { Select } from '../components/Select';
import { Divider } from '../components/Divider';
import { UsageExample } from '../components/UsageExample';

const USAGE = `import { RightPanel } from '../components/RightPanel';

// 헤더(타이틀+닫기) / 바디(내부 스크롤) / 푸터 3단 — 사이 1px 헤어라인
<RightPanel
  title="라이트 패널 타이틀"
  onClose={() => setOpen(false)}
  footer={
    <div className="flex w-full items-center justify-between">
      <p className="text-14 text-font-icon-5">컴포넌트 영역</p>
      <ButtonGroup gap="5">
        <Button variant="line">취소</Button>
        <Button variant="fill">저장</Button>
      </ButtonGroup>
    </div>
  }
>
  바디 콘텐츠(자유 슬롯, 내부 스크롤)
</RightPanel>

// 헤더·푸터는 슬롯이 null이면 영역째 빠진다(Figma top/bottom 토글과 동일)
<RightPanel width="480">바디만</RightPanel>

// AppLayout rightPanel 슬롯에 조립 — 폭은 AppLayout rightPanelWidth가 결정하므로 fill
<AppLayout
  rightPanel={open ? <RightPanel width="fill" title="…" onClose={close}>…</RightPanel> : null}
  onPanelClose={close} // ESC 닫기
>…</AppLayout>`;

const USAGE_PROPS = [
  { name: 'title', type: 'ReactNode', default: 'null', desc: '헤더 타이틀(semibold 15) — null이면 헤더 영역 미표시(Figma top 토글)' },
  { name: 'onClose', type: '() => void', default: '—', desc: '헤더 우측 닫기(X) 고스트 버튼 — 미지정 시 버튼 미표시(Figma close button 토글)' },
  { name: 'children', type: 'ReactNode', default: '—', desc: '바디 슬롯 — 내부 스크롤(ScrollArea). 루트가 h-full이라 부모가 높이를 제공해야 한다' },
  { name: 'footer', type: 'ReactNode', default: 'null', desc: '푸터 슬롯 — null이면 영역 미표시(Figma bottom 토글). 좌우 배치는 슬롯 안에서 자유' },
  { name: 'width', type: "'360' | '480' | 'fill'", default: "'360'", desc: '패널 폭 — 360(기본)/480(상세 작업 밀도)/fill(Figma Fullscreen, 부모 폭 채움). AppLayout 안에서는 fill 권장' },
  { name: 'bodyPadding', type: 'boolean', default: 'false', desc: '바디 기본 패딩(p-spacing-7) — Figma 바디는 무패딩 슬롯이라 기본 꺼짐' },
];

const WIDTH_OPTIONS = [
  { value: '360', label: '360 (기본)' },
  { value: '480', label: '480 (상세 작업)' },
  { value: 'fill', label: 'fill (Fullscreen)' },
];

export function RightPanelPage() {
  const [width, setWidth] = useState('360');
  const [showHeader, setShowHeader] = useState(true);
  const [showClose, setShowClose] = useState(true);
  const [showFooter, setShowFooter] = useState(true);

  return (
    <section className="py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-20 font-semibold text-font-icon-5">Right Panel</h2>
      <p className="mb-spacing-8 text-14 text-font-icon-4">
        보조 작업 영역(Secondary Workspace)의 표준 콘텐츠 구조입니다. 헤더(타이틀+닫기)·바디(내부
        스크롤)·푸터 3단이 1px 헤어라인으로 나뉘며, 각 영역은 슬롯이 null이면 통째로 빠집니다.
        레이아웃(AppLayout)의 rightPanel 슬롯에 조립하는 것이 기본 사용처이고, 표시 방식(Push·
        Overlay·Fullscreen)은 AppLayout panelMode가 결정합니다.
      </p>

      <UsageExample
        code={USAGE}
        props={USAGE_PROPS}
        note="색은 right-panel-* 시멘틱 토큰(Figma 변수 1:1)만 사용합니다. 헤더 규격: min-h 56px·좌 16px/우 12px 패딩. AppLayout 조립 시 ESC 닫기는 onPanelClose, 닫기 버튼은 RightPanel onClose가 담당합니다."
      />

      {/* 플레이그라운드 */}
      <div className="mb-spacing-6 flex flex-wrap items-center gap-spacing-6">
        <p className="text-12 text-font-icon-3">옵션</p>
        <Select width="hug" options={WIDTH_OPTIONS} value={width} onChange={(e) => setWidth(e.target.value)} />
        <Checkbox label="헤더" checked={showHeader} onChange={() => setShowHeader((v) => !v)} />
        <Checkbox label="닫기 버튼" checked={showClose} onChange={() => setShowClose((v) => !v)} />
        <Checkbox label="푸터" checked={showFooter} onChange={() => setShowFooter((v) => !v)} />
      </div>
      <div className="h-[520px] overflow-hidden rounded-round-6 ring-1 ring-modal-outline">
        <RightPanel
          width={width}
          title={showHeader ? '라이트 패널 타이틀' : null}
          onClose={showClose ? () => {} : undefined}
          bodyPadding
          footer={
            showFooter ? (
              <div className="flex w-full items-center justify-between">
                <p className="text-14 text-font-icon-5">컴포넌트 영역</p>
                <ButtonGroup gap="5">
                  <Button variant="line">취소</Button>
                  <Button variant="fill">저장</Button>
                </ButtonGroup>
              </div>
            ) : null
          }
        >
          <div className="space-y-spacing-6">
            {Array.from({ length: 14 }, (_, i) => (
              <div key={i} className="rounded-round-4 bg-builder-area-bg p-spacing-6 text-14 text-font-icon-3">
                바디 콘텐츠 블록 {i + 1}
              </div>
            ))}
          </div>
        </RightPanel>
      </div>

      <Divider className="mt-spacing-9 mb-spacing-8" />

      {/* 구성 규격 */}
      <h3 className="mb-spacing-5 text-16 font-semibold text-font-icon-5">구성 규격</h3>
      <ul className="list-disc space-y-spacing-3 pl-spacing-8 text-14 text-font-icon-4">
        <li><span className="text-font-icon-5">3단 구조</span> — 헤더/바디/푸터가 1px 갭(spacing-1)으로 나뉘고, 갭 사이로 헤어라인(right-panel/line, gray 100)이 비친다</li>
        <li><span className="text-font-icon-5">헤더</span> — min-h 56px, 패딩 좌 16px(spacing-7)/우 12px(spacing-6)/상하 12px, 타이틀 semibold 15 + 닫기(X) 고스트 버튼</li>
        <li><span className="text-font-icon-5">바디</span> — 남는 높이 전체, 내부 스크롤(ScrollArea). 기본 무패딩 슬롯(bodyPadding으로 p-spacing-7)</li>
        <li><span className="text-font-icon-5">푸터</span> — 헤더와 같은 패딩, 자유 슬롯(예: 좌 상태 텍스트 + 우 취소/저장 버튼 그룹)</li>
        <li><span className="text-font-icon-5">폭</span> — 360/480/fill(Fullscreen). 반응형 표시 방식(Push·Overlay·Fullscreen)은 AppLayout panelMode 몫</li>
      </ul>
    </section>
  );
}
