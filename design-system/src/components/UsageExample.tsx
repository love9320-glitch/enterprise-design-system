// UsageExample — 데모 페이지 상단 "사용 예시 코드" 블록 (문서용 헬퍼)
// 각 컴포넌트를 어떤 코드로 쓰는지·옵션(props)을 어떻게 적용하는지 한눈에 보여준다.
//   - code: 보여줄 예시 코드 문자열(필수)
//   - title: 헤더 라벨 (기본 '사용 예시')
//   - note: 코드 위 한 줄 설명 (옵션)
//   - props: 전체 옵션 설명 표 데이터 (옵션) — [{ name, type, default, desc }]
// 우상단 복사 버튼으로 코드를 클립보드에 복사한다. 색·간격은 토큰만 사용.
import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Check, Copy } from 'lucide-react';

// 전체 옵션 설명 표 한 행 — [{ name, type, default, desc }]
interface UsagePropRow {
  name: string;
  type?: string;
  default?: string;
  desc?: ReactNode;
}

interface UsageExampleProps {
  code: string; // 보여줄 예시 코드 문자열(필수)
  title?: string; // 헤더 라벨 (기본 '사용 예시')
  note?: ReactNode; // 코드 위 한 줄 설명 (옵션)
  props?: UsagePropRow[]; // 전체 옵션 설명 표 데이터 (옵션)
  className?: string;
}

export function UsageExample({ code, title = '사용 예시', note, props, className = '' }: UsageExampleProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timerRef.current), []); // 언마운트 후 setState 방지

  function handleCopy() {
    navigator.clipboard
      ?.writeText(code)
      .then(() => {
        setCopied(true);
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => {}); // 비HTTPS/권한 거부 — 복사 실패는 상태 변경 없이 무시
  }

  return (
    <div className={`mb-spacing-9 overflow-hidden rounded-round-4 border border-base-gray-100 ${className}`}>
      {/* 헤더 — 라벨 + 복사 버튼 */}
      <div className="flex items-center justify-between border-b border-base-gray-100 bg-base-gray-50 px-spacing-6 py-spacing-4">
        <p className="text-12 font-semibold uppercase tracking-wide text-font-icon-3">{title}</p>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex cursor-pointer items-center gap-spacing-3 rounded-round-3 px-spacing-4 py-spacing-2 text-12 text-font-icon-4 transition-colors hover:bg-base-gray-100 hover:text-font-icon-5"
        >
          {copied ? <Check size={14} strokeWidth={1.8} /> : <Copy size={14} strokeWidth={1.8} />}
          {copied ? '복사됨' : '복사'}
        </button>
      </div>

      {/* 설명 (옵션) */}
      {note && (
        <p className="border-b border-base-gray-100 bg-white px-spacing-6 py-spacing-4 text-12 text-font-icon-4">
          {note}
        </p>
      )}

      {/* 코드 — 어두운 배경(base-gray-900) + 반전 텍스트(font-icon-1) */}
      <pre className="overflow-x-auto bg-base-gray-900 px-spacing-6 py-spacing-6">
        <code className="whitespace-pre font-mono text-13 text-font-icon-1">{code}</code>
      </pre>

      {/* 전체 옵션 표 (옵션) */}
      {props && props.length > 0 && <PropsTable rows={props} />}
    </div>
  );
}

// 전체 옵션(props) 설명 표 — 옵션 / 타입·값 / 기본값 / 설명
function PropsTable({ rows }: { rows: UsagePropRow[] }) {
  return (
    <div className="border-t border-base-gray-100 bg-white">
      <p className="px-spacing-6 pt-spacing-5 text-12 font-semibold uppercase tracking-wide text-font-icon-3">
        Props (전체 옵션)
      </p>
      <div className="overflow-x-auto px-spacing-6 pb-spacing-6 pt-spacing-4">
        {/* 컬럼 비율 옵션:타입:기본값:설명 = 1:1:1:2, min-w-[500px]로 각 컬럼 최소 100px 보장 */}
        <table className="w-full min-w-[500px] table-fixed border-collapse text-left text-12">
          <colgroup>
            <col className="w-[20%]" />
            <col className="w-[20%]" />
            <col className="w-[20%]" />
            <col className="w-[40%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-base-gray-100 text-font-icon-3">
              <th className="py-spacing-3 pr-spacing-6 font-semibold">옵션</th>
              <th className="py-spacing-3 pr-spacing-6 font-semibold">타입 / 값</th>
              <th className="py-spacing-3 pr-spacing-6 font-semibold">기본값</th>
              <th className="py-spacing-3 font-semibold">설명</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name} className="border-b border-base-gray-50 align-top last:border-b-0">
                <td className="break-words py-spacing-3 pr-spacing-6 font-mono text-font-icon-5">
                  {r.name}
                </td>
                <td className="whitespace-pre-wrap break-words py-spacing-3 pr-spacing-6 font-mono text-font-icon-4">
                  {r.type ?? '—'}
                </td>
                <td className="break-words py-spacing-3 pr-spacing-6 font-mono text-font-icon-4">
                  {r.default ?? '—'}
                </td>
                <td className="py-spacing-3 text-font-icon-4">{r.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
