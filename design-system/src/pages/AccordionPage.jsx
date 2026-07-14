import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Accordion, AccordionItem } from '../components/Accordion';
import { Button } from '../components/Button';
import { UsageExample } from '../components/UsageExample';
import { Divider } from '../components/Divider';

const USAGE = `import { Accordion, AccordionItem } from '../components/Accordion';

<Accordion>
  {items.map((it) => (
    <AccordionItem
      key={it.id}
      title={it.title}
      nameEditable onTitleChange={(t) => rename(it.id, t)} // 이름 편집(저장 시에만)
      deletable onDelete={() => remove(it.id)}             // 내부 삭제 버튼
    >
      {it.content}
    </AccordionItem>
  ))}
</Accordion>
// 항목 추가는 외부 버튼에서 items 배열에 push — 컴포넌트는 배열만 따라 그린다`;

const USAGE_PROPS = [
  { name: 'title / children', type: 'string / ReactNode', default: '—', desc: '리스트 네임 / 본문(볼륨 콘텐츠 가능)' },
  { name: 'defaultOpen / open / onOpenChange', type: 'boolean / boolean / (open)=>void', default: 'false / — / —', desc: '펼침 — uncontrolled/controlled' },
  { name: 'nameEditable / onTitleChange', type: 'boolean / (title)=>void', default: 'false / —', desc: '이름 편집 옵션 — 헤더가 Input+취소/저장으로 전환, 저장 시에만 반영(Esc/취소 폐기)' },
  { name: 'deletable / onDelete', type: 'boolean / ()=>void', default: 'false / —', desc: '내부 삭제 버튼 옵션' },
  { name: 'keepMounted', type: 'boolean', default: 'false', desc: '접힘 상태에서도 본문 마운트 — 기본은 첫 펼침 때 마운트 후 유지(lazy)' },
  { name: 'maxHeight', type: 'number', default: '—', desc: '본문 내부 스크롤 상한(px, ScrollArea) — 미지정 시 자연 확장' },
];

const LONG = '내용이 들어갑니다.'.repeat(40);

let addSeq = 0;

export function AccordionPage() {
  const [items, setItems] = useState([
    { id: 'a', title: '아코디언 리스트 네임', content: LONG },
    { id: 'b', title: '아코디언 리스트 네임', content: '두 번째 항목 내용입니다.' },
    { id: 'c', title: '아코디언 리스트 네임', content: '세 번째 항목 내용입니다.' },
  ]);
  const rename = (id, title) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, title } : it)));
  const remove = (id) => setItems((prev) => prev.filter((it) => it.id !== id));
  const add = () =>
    setItems((prev) => [
      ...prev,
      { id: `new-${Date.now().toString(36)}-${++addSeq}`, title: '새 리스트', content: '새 항목 내용입니다.' },
    ]);

  return (
    <section className="mx-auto max-w-5xl px-spacing-7 py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-20 font-semibold text-font-icon-5">Accordion</h2>
      <p className="mb-spacing-8 text-13 text-font-icon-4">
        콘텐츠를 접고 펼치는 아코디언 — 항목 위·아래·사이는 Divider(default)로 구분합니다. 이름
        편집(Input+취소/저장 전환)·내부 삭제 버튼은 옵션이고, 항목 추가는 외부 버튼에서 배열로
        관리합니다. 본문은 첫 펼침 때 마운트(lazy)해 볼륨 콘텐츠에도 안전합니다.
      </p>

      <UsageExample code={USAGE} props={USAGE_PROPS} />

      <Divider className="mt-spacing-9 mb-spacing-8" />
      <div>
        <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">
          데모 — 외부 추가 + 이름 편집 + 삭제
        </h3>
        <p className="mb-spacing-7 text-12 text-font-icon-4">
          리스트 추가 버튼으로 항목을 늘리고, ✎로 이름을 바꾸고(저장/취소), 휴지통으로 삭제합니다. 첫
          항목은 긴 본문(볼륨 콘텐츠) 예시입니다.
        </p>
        <Button variant="fill" size="32" leftIcon={Plus} onClick={add} className="mb-spacing-7">
          리스트 추가
        </Button>
        <Accordion>
          {items.map((it, i) => (
            <AccordionItem
              key={it.id}
              title={it.title}
              defaultOpen={i === 0}
              nameEditable
              onTitleChange={(t) => rename(it.id, t)}
              deletable
              onDelete={() => remove(it.id)}
            >
              <p className="text-14 text-font-icon-5">{it.content}</p>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <Divider className="mt-spacing-9 mb-spacing-8" />
      <div>
        <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">기본형 (옵션 없음)</h3>
        <p className="mb-spacing-7 text-12 text-font-icon-4">
          편집·삭제 버튼 없이 제목+본문만. <code className="text-font-icon-5">maxHeight</code>를 주면 본문이
          내부 스크롤됩니다.
        </p>
        <Accordion>
          <AccordionItem title="기본 항목" defaultOpen>
            <p className="text-14 text-font-icon-5">본문 내용입니다.</p>
          </AccordionItem>
          <AccordionItem title="내부 스크롤 (maxHeight=120)" maxHeight={120}>
            <p className="text-14 text-font-icon-5">{LONG}</p>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
