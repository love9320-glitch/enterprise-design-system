import {
  baseColors,
  buttonColors, textFieldColors, labelFieldColors, listColors, tagColors,
  checkboxColors, radioColors, switchColors, tabColors,
  tableColors, modalColors, editorColors, calendarColors,
} from '../tokens/index';

// hex → base 토큰 명칭 역매핑. 컴포넌트 시멘틱 컬러는 모두 baseColors를 경유하므로
// 값(hex)으로 원본 베이스 토큰명을 되찾아 스와치에 함께 표기한다.
//   - 스케일(객체): gray/red/blue → 'gray.900' 형태
//   - 단일/알파(문자열): 'gray-900-25' · 'white' · 'black' 등 키 그대로
// 스케일을 먼저 등록해(객체가 colors.js에서 앞순서) 알파보다 우선 매칭한다(first-wins).
const HEX_TO_BASE = (() => {
  const map = {};
  const add = (hex, name) => {
    if (typeof hex === 'string' && !(hex.toLowerCase() in map)) map[hex.toLowerCase()] = name;
  };
  for (const [key, val] of Object.entries(baseColors.base)) {
    if (val && typeof val === 'object') {
      for (const [shade, hex] of Object.entries(val)) add(hex, `${key}.${shade}`);
    } else {
      add(val, key);
    }
  }
  return map;
})();

const baseNameOf = (hex) => HEX_TO_BASE[String(hex).toLowerCase()];

// 컴포넌트별 시멘틱 컬러 토큰을 한 페이지에 모아 보여준다.
// 각 토큰 객체의 prefix는 tailwind.config.js의 colors 등록명과 일치한다(클래스: bg-/text-/ring-{prefix}-{key}).
const COMPONENTS = [
  { title: 'Button',                prefix: 'button',     tokens: buttonColors },
  { title: 'Text Field (Input·Search)', prefix: 'text-field', tokens: textFieldColors },
  { title: 'Label (Field)',         prefix: 'label-field', tokens: labelFieldColors },
  { title: 'List · Option',         prefix: 'list',       tokens: listColors },
  { title: 'Tag',                   prefix: 'tag',        tokens: tagColors },
  { title: 'Checkbox',              prefix: 'checkbox',   tokens: checkboxColors },
  { title: 'Radio',                 prefix: 'radio',      tokens: radioColors },
  { title: 'Switch',                prefix: 'switch',     tokens: switchColors },
  { title: 'Tabs',                  prefix: 'tab',        tokens: tabColors },
  { title: 'Table',                 prefix: 'table',      tokens: tableColors },
  { title: 'Modal',                 prefix: 'modal',      tokens: modalColors },
  { title: 'Editor',                prefix: 'editor',     tokens: editorColors },
  { title: 'Calendar (Date Picker)', prefix: 'calendar',  tokens: calendarColors },
];

// 토큰 객체를 leaf(hex 문자열)까지 평탄화 — Button처럼 1단계 중첩(fill/ghost/line)도
// 키 경로를 하이픈으로 이어 'fill-default-bg' 형태의 단일 키로 만든다.
function flatten(obj, parentKey = '') {
  const out = [];
  for (const [k, v] of Object.entries(obj)) {
    const key = parentKey ? `${parentKey}-${k}` : k;
    if (v && typeof v === 'object') out.push(...flatten(v, key));
    else out.push({ key, hex: v });
  }
  return out;
}

function Swatch({ prefix, name, hex }) {
  const baseName = baseNameOf(hex);
  return (
    <div className="flex items-center gap-spacing-6 rounded-round-4 border border-gray-200 p-spacing-5">
      {/* 알파 토큰의 투명도가 드러나도록 체커보드 배경 위에 색을 올린다 */}
      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-round-4 border border-gray-200 bg-checker">
        <div className="h-full w-full" style={{ backgroundColor: hex }} />
      </div>
      <div className="min-w-0">
        <p className="break-all font-mono text-13 text-font-icon-5">{`${prefix}-${name}`}</p>
        <p className="mt-spacing-1 font-mono text-12 text-font-icon-3">
          {hex}
          {baseName && <span className="text-font-icon-4"> ({baseName})</span>}
        </p>
      </div>
    </div>
  );
}

export function ComponentColorsPage() {
  return (
    <section className="mx-auto max-w-5xl px-spacing-7 py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-20 font-semibold">Component Colors</h2>
      <p className="mb-spacing-9 text-14 text-font-icon-4">
        컴포넌트별 시멘틱 컬러 토큰(<span className="font-mono text-13">tokens/colors/*</span>).
        모두 베이스 컬러를 경유해 정의되며, 클래스는{' '}
        <span className="font-mono text-13">bg-/text-/ring-{'{prefix}-{key}'}</span> 형태로 사용한다.
        체커보드 위 스와치는 알파(투명도) 토큰을 식별하기 위한 것이다.
      </p>

      {/* 구분선은 컴포넌트 섹션 '사이'에만(컴포넌트명+칩이 한 덩어리로 보이도록) — divide-y가 마지막 뒤에는 선을 넣지 않는다. */}
      <div className="divide-y divide-gray-200">
        {COMPONENTS.map(({ title, prefix, tokens }) => {
          const leaves = flatten(tokens);
          return (
            <div key={prefix} className="py-spacing-9 first:pt-0 last:pb-0">
              <div className="mb-spacing-5 flex items-baseline gap-spacing-4">
                <h3 className="text-16 font-semibold text-font-icon-5">{title}</h3>
                <span className="font-mono text-13 text-font-icon-3">
                  {prefix}-* · {leaves.length}개
                </span>
              </div>
              <div className="grid grid-cols-1 gap-spacing-5 sm:grid-cols-2 lg:grid-cols-3">
                {leaves.map(({ key, hex }) => (
                  <Swatch key={key} prefix={prefix} name={key} hex={hex} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
