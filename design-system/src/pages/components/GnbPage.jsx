import { useState } from 'react';
import { Search, FolderOpen, History, Bell, Settings } from 'lucide-react';
import { Gnb, GnbGroup, GnbLogo } from '../../layouts/Gnb';
import { Avatar } from '../../components/Avatar';
import { Button } from '../../components/Button';
import { ButtonGroup } from '../../components/ButtonGroup';
import { SearchBar } from '../../components/SearchBar';
import { Checkbox } from '../../components/Checkbox';
import { Divider } from '../../components/Divider';
import { UsageExample } from '../../components/UsageExample';
import DEMO_IMG from '../../assets/avatar-sample.png';

const USAGE = `import { Gnb, GnbGroup, GnbLogo } from '../../layouts/Gnb';

// 그룹 조립 구조 — GnbGroup(흰 배경)을 필요에 따라 자유롭게 추가/삭제한다.
// 그룹 사이는 1px 갭으로 배경(gnb/inline)이 비쳐 자연스럽게 구분된다.
<Gnb bar>
  <GnbGroup fill justify="between">
    <GnbLogo>LOGO</GnbLogo>
    <div className="flex items-center gap-spacing-6">
      <ButtonGroup gap="6">
        <Button variant="ghost" icon={Search} aria-label="검색" />
        <Button variant="ghost" icon={Bell} aria-label="알림" />
      </ButtonGroup>
      <SearchBar />
    </div>
  </GnbGroup>
  <GnbGroup>
    <Avatar src="/user.jpg" alt="사용자" />
  </GnbGroup>
</Gnb>

// 구분선은 그룹 '안'에서 필요한 위치에 자유롭게 추가한다(예: 종(알림) 버튼 왼쪽)
<ButtonGroup gap="6">
  <Button variant="ghost" icon={History} aria-label="히스토리" />
  <Divider direction="vertical" className="h-[16px] my-auto" />
  <Button variant="ghost" icon={Bell} aria-label="알림" />
</ButtonGroup>

// AppLayout gnb 슬롯에 조립 — 영역 높이(54px)와 하단 구분선은 AppLayout이 제공하므로 bar 없이
<AppLayout gnb={<Gnb><GnbGroup fill>…</GnbGroup></Gnb>}>…</AppLayout>`;

const USAGE_PROPS = [
  { name: 'Gnb · children', type: 'ReactNode', default: '—', desc: 'GnbGroup들 — 필요에 따라 자유롭게 추가/삭제. 그룹 사이 1px 갭(spacing-1)으로 배경(layout/gnb-inline)이 비쳐 구분' },
  { name: 'Gnb · bar', type: 'boolean', default: 'false', desc: 'true면 자체 바 크롬(높이 54px+하단 구분선 1px=점유 55) — 단독 배치용. AppLayout gnb 슬롯에서는 false(기본)' },
  { name: 'GnbGroup · fill', type: 'boolean', default: 'false', desc: 'true면 남는 폭 채움(flex-1) — 기본은 콘텐츠 폭(hug)' },
  { name: 'GnbGroup · justify', type: "'start' | 'between' | 'end' | 'center'", default: "'start'", desc: '그룹 내부 정렬 — fill 그룹에서 양끝 배치(between) 등' },
  { name: 'GnbGroup · gap', type: "'4' | '5' | '6' | '7'", default: "'6'", desc: '그룹 내부 간격 토큰 키(6/8/12/16px) — ButtonGroup과 동일 규칙' },
  { name: 'GnbLogo', type: '컴포넌트', default: '—', desc: '로고 텍스트 스타일 헬퍼(semibold 20, Figma 스펙) — 이미지/커스텀 로고는 노드 그대로 배치' },
];

export function GnbPage() {
  // 그룹 자유 조립 데모 — 그룹과 그룹 안 항목을 켜고 끄며 추가/삭제 구조를 체험
  const [items, setItems] = useState({
    searchBar: true,
    iconButtons: true,
    group2: true,
    inGroupDivider: true,
    group3: false,
  });
  const toggle = (k) => setItems((s) => ({ ...s, [k]: !s[k] }));

  return (
    <section className="py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-20 font-semibold text-font-icon-5">GNB</h2>
      <p className="mb-spacing-8 text-14 text-font-icon-4">
        글로벌 내비게이션 바입니다. <span className="text-font-icon-5">GnbGroup</span>(흰 배경 영역)을
        조립하는 구조로, <span className="text-font-icon-5">필요에 따라 그룹을 자유롭게 추가/삭제</span>할
        수 있습니다. 그룹 사이는 1px 갭으로 배경이 비쳐 구분되고, 구분선(Divider)은 그룹 안에서
        사용합니다. 데모 사이트 상단 바도 이 컴포넌트로 조립되어 있습니다.
      </p>

      <UsageExample
        code={USAGE}
        props={USAGE_PROPS}
        note="바 크롬(높이 54px+하단 구분선)은 bar=true일 때만 렌더합니다. AppLayout gnb 슬롯에 꽂을 때는 bar 없이 그룹 행만 렌더되어 이중 크롬이 생기지 않습니다."
      />

      {/* 그룹 자유 조립 플레이그라운드 */}
      <div className="mb-spacing-6 flex flex-wrap items-center gap-spacing-6">
        <p className="text-12 text-font-icon-3">그룹1 항목</p>
        <Checkbox label="아이콘 버튼" checked={items.iconButtons} onChange={() => toggle('iconButtons')} />
        <Checkbox label="검색바" checked={items.searchBar} onChange={() => toggle('searchBar')} />
        <p className="text-12 text-font-icon-3">그룹</p>
        <Checkbox label="그룹 안 구분선" checked={items.inGroupDivider} onChange={() => toggle('inGroupDivider')} />
        <Checkbox label="그룹2 (아바타)" checked={items.group2} onChange={() => toggle('group2')} />
        <Checkbox label="그룹3 (취소/저장)" checked={items.group3} onChange={() => toggle('group3')} />
      </div>
      <div className="overflow-hidden rounded-round-6 ring-1 ring-modal-outline">
        <Gnb bar>
          <GnbGroup fill justify="between">
            <GnbLogo>LOGO</GnbLogo>
            <div className="flex items-center gap-spacing-6">
              {items.iconButtons && (
                <ButtonGroup gap="6">
                  <Button variant="ghost" icon={Search} aria-label="검색" />
                  <Button variant="ghost" icon={FolderOpen} aria-label="보관함" />
                  <Button variant="ghost" icon={History} aria-label="히스토리" />
                  {/* 그룹 안 구분선 — 종(알림) 버튼 왼쪽(2026-07-31 지시) */}
                  {items.inGroupDivider && <Divider direction="vertical" className="h-[16px] my-auto" />}
                  <Button variant="ghost" icon={Bell} aria-label="알림" />
                  <Button variant="ghost" icon={Settings} aria-label="설정" />
                </ButtonGroup>
              )}
              {items.searchBar && <SearchBar width={240} />}
            </div>
          </GnbGroup>
          {items.group2 && (
            <GnbGroup>
              <Avatar src={DEMO_IMG} alt="사용자" />
            </GnbGroup>
          )}
          {items.group3 && (
            <GnbGroup>
              <ButtonGroup gap="6">
                <Button variant="line">취소</Button>
                <Button variant="fill">저장</Button>
              </ButtonGroup>
            </GnbGroup>
          )}
        </Gnb>
      </div>

      <Divider className="mt-spacing-9 mb-spacing-8" />

      {/* 구성 규격 */}
      <h3 className="mb-spacing-5 text-16 font-semibold text-font-icon-5">구성 규격</h3>
      <ul className="list-disc space-y-spacing-3 pl-spacing-8 text-14 text-font-icon-4">
        <li><span className="text-font-icon-5">Gnb(루트)</span> — 그룹들을 담는 행. 배경 layout/gnb-inline(gray 50)이 그룹 사이 1px 갭(spacing-1)으로 비쳐 그룹을 구분한다(bar 여부와 무관한 공통 구조)</li>
        <li><span className="text-font-icon-5">bar=true</span> — 단독 배치용 크롬: 높이 54px + 하단 구분선 1px(점유 55). AppLayout gnb 슬롯에서는 bar 없이 쓴다(높이·하단 구분선을 AppLayout이 제공)</li>
        <li><span className="text-font-icon-5">GnbGroup</span> — 흰 배경(layout/gnb-bg)·높이 100%, 좌우 패딩 spacing-7(16px), 내부 간격 gap 옵션(기본 spacing-6=12px), fill=남는 폭 채움 + justify로 내부 정렬(start/between/end/center)</li>
        <li><span className="text-font-icon-5">그룹 안 구분선</span> — Divider를 그룹 children의 원하는 위치·개수만큼 자유 배치: {'<Divider direction="vertical" className="h-[16px] my-auto" />'}</li>
        <li><span className="text-font-icon-5">역할</span>(레이아웃 가이드라인) — 전역 탐색, 제품 전환, 계정 및 공통 액션</li>
      </ul>
    </section>
  );
}
