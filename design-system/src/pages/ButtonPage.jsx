import { Users } from 'lucide-react';
import { Button } from '../components/Button';

const BUTTON_ROWS = [
  { rowLabel: 'Text only',  btnProps: {},                   text: '다음 단계' },
  { rowLabel: 'Left icon',  btnProps: { leftIcon: Users },  text: '다음 단계' },
  { rowLabel: 'Right icon', btnProps: { rightIcon: Users }, text: '다음 단계' },
  { rowLabel: 'Icon only',  btnProps: { icon: Users } },
];

const BUTTON_STATES = [
  { label: 'Default',  extra: {} },
  { label: 'Disabled', extra: { disabled: true } },
  { label: 'Loading',  extra: { loading: true } },
];

function VariantBlock({ variant, label, tinted = false }) {
  return (
    <div className="mb-spacing-7 overflow-hidden rounded-round-4 border border-base-gray-100">
      <div className="border-b border-base-gray-100 bg-white px-spacing-7 py-spacing-5">
        <p className="text-sm font-semibold text-base-gray-900">{label}</p>
      </div>

      <div className={`px-spacing-7 py-spacing-7 ${tinted ? 'bg-base-gray-50' : 'bg-white'}`}>
        {['32', '24'].map((size, idx) => (
          <div
            key={size}
            className={idx > 0 ? 'mt-spacing-8 border-t border-base-gray-100 pt-spacing-8' : ''}
          >
            <p className="mb-spacing-5 text-xs font-semibold uppercase tracking-wide text-font-icon-3">
              Size {size}
            </p>

            <div className="mb-spacing-3 grid grid-cols-[80px_1fr_1fr_1fr] items-center gap-x-spacing-5">
              <div />
              {BUTTON_STATES.map(({ label: s }) => (
                <p key={s} className="text-center text-xs text-font-icon-3">{s}</p>
              ))}
            </div>

            <div className="space-y-spacing-4">
              {BUTTON_ROWS.map(({ rowLabel, btnProps, text }) => (
                <div
                  key={rowLabel}
                  className="grid grid-cols-[80px_1fr_1fr_1fr] items-center gap-x-spacing-5"
                >
                  <p className="text-xs text-font-icon-3">{rowLabel}</p>
                  {BUTTON_STATES.map(({ label: s, extra }) => (
                    <div key={s} className="flex justify-center">
                      <Button variant={variant} size={size} {...btnProps} {...extra}>
                        {text}
                      </Button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ButtonPage() {
  return (
    <section className="mx-auto max-w-3xl px-spacing-7 py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-lg font-semibold">Button</h2>
      <p className="mb-spacing-8 text-sm text-font-icon-4">
        Fill · Ghost · Line — 3가지 variant × 2가지 사이즈 × 4가지 레이아웃 × 3가지 상태
      </p>

      <VariantBlock variant="fill" label="Fill (Primary Button)" />
      <VariantBlock variant="line" label="Line (Secondary Button)" />
      <VariantBlock variant="ghost" label="Ghost (Third Button)" tinted />
    </section>
  );
}
