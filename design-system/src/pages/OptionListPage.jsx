import { useState } from 'react';
import { List } from '../components/List';
import { ListGroup } from '../components/ListGroup';
import { ListEmpty } from '../components/ListEmpty';
import { PopoverMenu } from '../components/PopoverMenu';

const SAMPLE = Array.from({ length: 12 }, (_, i) => `옵션 ${i + 1}`);

// 검색 가능한 팝오버 — 검색어로 필터, 결과 없으면 ListEmpty
function SearchablePopover() {
  const [q, setQ] = useState('');
  const filtered = SAMPLE.filter((s) => s.includes(q.trim()));
  return (
    <PopoverMenu searchable searchValue={q} onSearchChange={(e) => setQ(e.target.value)}>
      {filtered.length > 0 ? (
        <ListGroup>
          {filtered.map((s) => (
            <List key={s} title={s} tag endIcon rightButton />
          ))}
        </ListGroup>
      ) : (
        <ListEmpty />
      )}
    </PopoverMenu>
  );
}

function SectionTitle({ children }) {
  return (
    <h3 className="mb-spacing-5 text-xs font-semibold uppercase tracking-wide text-font-icon-3">
      {children}
    </h3>
  );
}

export function OptionListPage() {
  return (
    <section className="mx-auto max-w-3xl px-spacing-7 py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-18 font-semibold text-font-icon-5">Option List</h2>
      <p className="mb-spacing-8 text-14 text-font-icon-4">
        드롭다운 옵션 목록 시스템 — List · ListGroup · ListEmpty · PopoverMenu.
        색상은 모두 list 시멘틱 토큰(base 경유)을 사용합니다. 현재는 컴포넌트 단위이며,
        Select와의 연결은 다음 단계입니다. (Tag는 별도 페이지)
      </p>

      {/* List 상태 & 요소 */}
      <div className="mb-spacing-9">
        <SectionTitle>List — 상태 &amp; 요소</SectionTitle>
        <p className="mb-spacing-5 text-12 text-font-icon-4">
          <span className="text-font-icon-5">Hover·Pressed</span>는 마우스로 직접 확인하세요.
          Selected는 chevron이 파란색, Disabled는 회색 처리됩니다. 요소(tag·고스트버튼·chevron)는
          props로 켜고 끌 수 있습니다.
        </p>
        <div className="w-[304px] overflow-hidden rounded-round-4 border border-list-popover-outline">
          <List title="default (전체 요소)" tag rightButton endIcon />
          <List title="selected" tag rightButton endIcon selected />
          <List title="disabled" tag rightButton endIcon disabled />
          <List title="텍스트만" />
          <List title="태그 + 텍스트" tag />
        </div>
      </div>

      {/* ListGroup */}
      <div className="mb-spacing-9">
        <SectionTitle>ListGroup (최대 6개, 초과 시 내부 스크롤)</SectionTitle>
        <div className="w-[304px] overflow-hidden rounded-round-4 border border-list-popover-outline">
          <ListGroup>
            {SAMPLE.map((s) => (
              <List key={s} title={s} tag rightButton endIcon />
            ))}
          </ListGroup>
        </div>
      </div>

      {/* ListEmpty */}
      <div className="mb-spacing-9">
        <SectionTitle>List Empty</SectionTitle>
        <div className="w-[304px] overflow-hidden rounded-round-4 border border-list-popover-outline">
          <ListEmpty />
        </div>
      </div>

      {/* PopoverMenu — 검색바 없음 / 있음 */}
      <div className="mb-spacing-9">
        <SectionTitle>PopoverMenu — 검색바 없음 / 있음</SectionTitle>
        <p className="mb-spacing-7 text-12 text-font-icon-4">
          <code className="text-font-icon-5">searchable</code> 옵션으로 상단 검색바를 켜고 끕니다.
          검색바가 있으면 입력으로 목록을 필터링하고, 결과가 없으면 List Empty가 표시됩니다.
        </p>
        <div className="flex flex-wrap items-start gap-spacing-9">
          <div>
            <p className="mb-spacing-4 text-12 text-font-icon-3">검색바 없음</p>
            <PopoverMenu>
              <ListGroup>
                {SAMPLE.slice(0, 5).map((s) => (
                  <List key={s} title={s} tag rightButton endIcon />
                ))}
              </ListGroup>
            </PopoverMenu>
          </div>
          <div>
            <p className="mb-spacing-4 text-12 text-font-icon-3">검색바 있음 (입력 시 필터)</p>
            <SearchablePopover />
          </div>
          <div>
            <p className="mb-spacing-4 text-12 text-font-icon-3">검색바 있음 — 결과 없음</p>
            <PopoverMenu searchable searchValue="없는 옵션" onSearchChange={() => {}}>
              <ListEmpty />
            </PopoverMenu>
          </div>
        </div>
      </div>
    </section>
  );
}
