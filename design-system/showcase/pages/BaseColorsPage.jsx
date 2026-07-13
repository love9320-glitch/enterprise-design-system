import { baseColors } from '../../src/tokens/index';
import { Divider } from '../../src/components/Divider';

const grayScale = Object.entries(baseColors.base.gray);
const monoColors = [
  ['black', baseColors.base.black],
  ['white', baseColors.base.white],
];
const gray900AlphaColors = Object.entries(baseColors.base).filter(([k]) => k.startsWith('gray-900-'));
const whiteAlphaColors = Object.entries(baseColors.base).filter(([k]) => k.startsWith('white-'));
const redScale = Object.entries(baseColors.base.red);
const red400AlphaColors = Object.entries(baseColors.base).filter(([k]) => k.startsWith('red-400-'));
const blueScale = Object.entries(baseColors.base.blue);
const blue400AlphaColors = Object.entries(baseColors.base).filter(([k]) => k.startsWith('blue-400-'));
const greenScale = Object.entries(baseColors.base.green);
const green400AlphaColors = Object.entries(baseColors.base).filter(([k]) => k.startsWith('green-400-'));
const orangeScale = Object.entries(baseColors.base.orange);
const orange400AlphaColors = Object.entries(baseColors.base).filter(([k]) => k.startsWith('orange-400-'));
const violetScale = Object.entries(baseColors.base.violet);
const violet400AlphaColors = Object.entries(baseColors.base).filter(([k]) => k.startsWith('violet-400-'));
const pinkScale = Object.entries(baseColors.base.pink);
const pink400AlphaColors = Object.entries(baseColors.base).filter(([k]) => k.startsWith('pink-400-'));

function ColorSwatch({ label, hex }) {
  return (
    <div>
      <div
        className="h-16 w-full rounded-round-4 border border-gray-200"
        style={{ backgroundColor: hex }}
      />
      <p className="mt-spacing-4 text-xs font-medium">{label}</p>
      <p className="text-xs text-font-icon-3">{hex}</p>
    </div>
  );
}

function AlphaColorSwatch({ label, hex }) {
  return (
    <div>
      <div
        className="relative h-16 w-full overflow-hidden rounded-round-4 border border-gray-200"
        style={{
          backgroundImage:
            'linear-gradient(45deg,#ccc 25%,transparent 25%),' +
            'linear-gradient(-45deg,#ccc 25%,transparent 25%),' +
            'linear-gradient(45deg,transparent 75%,#ccc 75%),' +
            'linear-gradient(-45deg,transparent 75%,#ccc 75%)',
          backgroundSize: '8px 8px',
          backgroundPosition: '0 0,0 4px,4px -4px,-4px 0',
        }}
      >
        <div className="absolute inset-0" style={{ backgroundColor: hex }} />
      </div>
      <p className="mt-spacing-4 text-xs font-medium">{label}</p>
      <p className="text-xs text-font-icon-3">{hex}</p>
    </div>
  );
}

export function BaseColorsPage() {
  return (
    <section className="mx-auto max-w-5xl px-spacing-7 py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-20 font-semibold">Base Colors</h2>
      <p className="mb-spacing-8 text-14 text-font-icon-4">
        베이스(프리미티브) 컬러 — Figma "베이직 칼라 토큰". 모노톤 그레이 스케일과
        피드백용 red·blue 계열, 각 알파 시리즈로 구성됩니다.<br />시멘틱 컬러는 이 값을
        참조해 등록합니다.
      </p>

      <h3 className="mb-spacing-5 text-15 font-semibold text-font-icon-5">
        Gray
      </h3>
      <div className="mb-spacing-9 grid grid-cols-2 gap-spacing-6 sm:grid-cols-4 lg:grid-cols-5">
        {grayScale.map(([key, hex]) => (
          <ColorSwatch key={key} label={`gray / ${key}`} hex={hex} />
        ))}
      </div>

      <Divider className="mt-spacing-9 mb-spacing-8" />
      <h3 className="mb-spacing-5 text-15 font-semibold text-font-icon-5">
        Black & White
      </h3>
      <div className="mb-spacing-9 grid grid-cols-2 gap-spacing-6 sm:grid-cols-4 lg:grid-cols-5">
        {monoColors.map(([key, hex]) => (
          <ColorSwatch key={key} label={key} hex={hex} />
        ))}
      </div>

      <Divider className="mt-spacing-9 mb-spacing-8" />
      <h3 className="mb-spacing-5 text-15 font-semibold text-font-icon-5">
        Red
      </h3>
      <div className="mb-spacing-9 grid grid-cols-2 gap-spacing-6 sm:grid-cols-4 lg:grid-cols-5">
        {redScale.map(([key, hex]) => (
          <ColorSwatch key={key} label={`red / ${key}`} hex={hex} />
        ))}
      </div>

      <Divider className="mt-spacing-9 mb-spacing-8" />
      <h3 className="mb-spacing-5 text-15 font-semibold text-font-icon-5">
        Blue
      </h3>
      <div className="mb-spacing-9 grid grid-cols-2 gap-spacing-6 sm:grid-cols-4 lg:grid-cols-5">
        {blueScale.map(([key, hex]) => (
          <ColorSwatch key={key} label={`blue / ${key}`} hex={hex} />
        ))}
      </div>

      <Divider className="mt-spacing-9 mb-spacing-8" />
      <h3 className="mb-spacing-5 text-15 font-semibold text-font-icon-5">
        Green
      </h3>
      <div className="mb-spacing-9 grid grid-cols-2 gap-spacing-6 sm:grid-cols-4 lg:grid-cols-5">
        {greenScale.map(([key, hex]) => (
          <ColorSwatch key={key} label={`green / ${key}`} hex={hex} />
        ))}
      </div>

      <Divider className="mt-spacing-9 mb-spacing-8" />
      <h3 className="mb-spacing-5 text-15 font-semibold text-font-icon-5">
        Orange
      </h3>
      <div className="mb-spacing-9 grid grid-cols-2 gap-spacing-6 sm:grid-cols-4 lg:grid-cols-5">
        {orangeScale.map(([key, hex]) => (
          <ColorSwatch key={key} label={`orange / ${key}`} hex={hex} />
        ))}
      </div>

      <Divider className="mt-spacing-9 mb-spacing-8" />
      <h3 className="mb-spacing-5 text-15 font-semibold text-font-icon-5">
        Violet
      </h3>
      <div className="mb-spacing-9 grid grid-cols-2 gap-spacing-6 sm:grid-cols-4 lg:grid-cols-5">
        {violetScale.map(([key, hex]) => (
          <ColorSwatch key={key} label={`violet / ${key}`} hex={hex} />
        ))}
      </div>

      <Divider className="mt-spacing-9 mb-spacing-8" />
      <h3 className="mb-spacing-5 text-15 font-semibold text-font-icon-5">
        Pink
      </h3>
      <div className="mb-spacing-9 grid grid-cols-2 gap-spacing-6 sm:grid-cols-4 lg:grid-cols-5">
        {pinkScale.map(([key, hex]) => (
          <ColorSwatch key={key} label={`pink / ${key}`} hex={hex} />
        ))}
      </div>

      <Divider className="mt-spacing-9 mb-spacing-8" />
      <h3 className="mb-spacing-5 text-15 font-semibold text-font-icon-5">
        Gray 900 Alpha
      </h3>
      <div className="mb-spacing-9 grid grid-cols-2 gap-spacing-6 sm:grid-cols-4 lg:grid-cols-5">
        {gray900AlphaColors.map(([key, hex]) => (
          <AlphaColorSwatch key={key} label={key.replace('gray-900-', '900 / ')} hex={hex} />
        ))}
      </div>

      <Divider className="mt-spacing-9 mb-spacing-8" />
      <h3 className="mb-spacing-5 text-15 font-semibold text-font-icon-5">
        White Alpha
      </h3>
      <div className="mb-spacing-9 grid grid-cols-2 gap-spacing-6 sm:grid-cols-4 lg:grid-cols-5">
        {whiteAlphaColors.map(([key, hex]) => (
          <AlphaColorSwatch key={key} label={key.replace('white-', 'white / ')} hex={hex} />
        ))}
      </div>

      <Divider className="mt-spacing-9 mb-spacing-8" />
      <h3 className="mb-spacing-5 text-15 font-semibold text-font-icon-5">
        Red 400 Alpha
      </h3>
      <div className="mb-spacing-9 grid grid-cols-2 gap-spacing-6 sm:grid-cols-4 lg:grid-cols-5">
        {red400AlphaColors.map(([key, hex]) => (
          <AlphaColorSwatch key={key} label={key.replace('red-400-', '400 / ')} hex={hex} />
        ))}
      </div>

      <Divider className="mt-spacing-9 mb-spacing-8" />
      <h3 className="mb-spacing-5 text-15 font-semibold text-font-icon-5">
        Blue 400 Alpha
      </h3>
      <div className="mb-spacing-9 grid grid-cols-2 gap-spacing-6 sm:grid-cols-4 lg:grid-cols-5">
        {blue400AlphaColors.map(([key, hex]) => (
          <AlphaColorSwatch key={key} label={key.replace('blue-400-', '400 / ')} hex={hex} />
        ))}
      </div>

      <Divider className="mt-spacing-9 mb-spacing-8" />
      <h3 className="mb-spacing-5 text-15 font-semibold text-font-icon-5">Green 400 Alpha</h3>
      <div className="mb-spacing-9 grid grid-cols-2 gap-spacing-6 sm:grid-cols-4 lg:grid-cols-5">
        {green400AlphaColors.map(([key, hex]) => (
          <AlphaColorSwatch key={key} label={key.replace('green-400-', '400 / ')} hex={hex} />
        ))}
      </div>

      <Divider className="mt-spacing-9 mb-spacing-8" />
      <h3 className="mb-spacing-5 text-15 font-semibold text-font-icon-5">Orange 400 Alpha</h3>
      <div className="mb-spacing-9 grid grid-cols-2 gap-spacing-6 sm:grid-cols-4 lg:grid-cols-5">
        {orange400AlphaColors.map(([key, hex]) => (
          <AlphaColorSwatch key={key} label={key.replace('orange-400-', '400 / ')} hex={hex} />
        ))}
      </div>

      <Divider className="mt-spacing-9 mb-spacing-8" />
      <h3 className="mb-spacing-5 text-15 font-semibold text-font-icon-5">Violet 400 Alpha</h3>
      <div className="mb-spacing-9 grid grid-cols-2 gap-spacing-6 sm:grid-cols-4 lg:grid-cols-5">
        {violet400AlphaColors.map(([key, hex]) => (
          <AlphaColorSwatch key={key} label={key.replace('violet-400-', '400 / ')} hex={hex} />
        ))}
      </div>

      <Divider className="mt-spacing-9 mb-spacing-8" />
      <h3 className="mb-spacing-5 text-15 font-semibold text-font-icon-5">Pink 400 Alpha</h3>
      <div className="grid grid-cols-2 gap-spacing-6 sm:grid-cols-4 lg:grid-cols-5">
        {pink400AlphaColors.map(([key, hex]) => (
          <AlphaColorSwatch key={key} label={key.replace('pink-400-', '400 / ')} hex={hex} />
        ))}
      </div>
    </section>
  );
}
