// Avatar — 아바타 (Figma avater SET 8942:19658 — Figma 세트명은 오타(avater), 코드는 Avatar)
//   - src가 있으면 image 타입(사진 + 안쪽 링 + hover 오버레이), 없으면 text 타입(이니셜 + 파란 배경).
//   - state: Default/Hover는 CSS로 자동, Pressed는 Figma가 Default 색을 재사용하므로 별도 스타일 없음.
//   - interactive=false면 hover 효과·클릭·포커스를 전부 차단(정적 표시용, 2026-07-31 지시).
//     interactive(기본)일 때는 button 시맨틱(키보드 접근 가능), 아닐 때는 span으로 렌더한다.
//   - size: 24~56 5단(Figma의 16은 2026-07-31 지시로 코드에서 제외). 이니셜 글자 크기는 등록 텍스트 토큰으로 근사(32=14px는 Figma 스펙).
// 색은 avatar-* 시멘틱 토큰(avatar/* Figma 변수 1:1), 라운드는 round-00(완전 원형)만 사용.
import type { ComponentPropsWithoutRef, MouseEvent, ReactNode } from 'react';

// 사이즈별 지름(px)과 이니셜 텍스트 토큰 — 32(14px)만 Figma 스펙, 나머지는 비례 근사(등록 토큰만)
const SIZE_STYLE = {
  '24': { box: 'h-[24px] w-[24px]', text: 'text-12' },
  '32': { box: 'h-[32px] w-[32px]', text: 'text-14' }, // Figma: semibold 14/24
  '40': { box: 'h-[40px] w-[40px]', text: 'text-14' },
  '48': { box: 'h-[48px] w-[48px]', text: 'text-16' },
  '56': { box: 'h-[56px] w-[56px]', text: 'text-18' },
};

interface AvatarProps extends Omit<ComponentPropsWithoutRef<'button'>, 'children' | 'type'> {
  src?: string | null; // 이미지 URL — 있으면 image 타입, 없으면 text 타입(이니셜)
  alt?: string; // 이미지 대체 텍스트(image 타입) — 미지정 시 initial 사용
  initial?: ReactNode; // 이니셜(text 타입 표시 문자, 보통 1글자)
  size?: keyof typeof SIZE_STYLE; // '24' | '32'(기본) | '40' | '48' | '56' (16은 2026-07-31 지시로 제외)
  interactive?: boolean; // false면 hover 효과·클릭·포커스 차단(정적 표시용). 기본 true
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

export function Avatar({
  src = null, // 이미지 URL — 있으면 image 타입
  alt,
  initial = '', // 이니셜(text 타입 표시 문자)
  size = '32', // '24' | '32' | '40' | '48' | '56'
  interactive = true, // false면 hover 효과·클릭·포커스 차단(정적 표시용)
  onClick,
  className = '',
  ...props
}: AvatarProps) {
  const sizeStyle = SIZE_STYLE[size] ?? SIZE_STYLE['32'];
  const isImage = src != null && src !== '';

  const base = `relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-round-00 ${sizeStyle.box}`;
  const visual = isImage
    ? '' // image: 배경 없이 사진 + 링 + (hover) 오버레이
    : `bg-avatar-text-default-bg ${interactive ? 'transition-colors hover:bg-avatar-text-hover-bg' : ''}`;

  const content = (
    <>
      {isImage ? (
        <img src={src} alt={alt ?? (typeof initial === 'string' ? initial : '')} className="h-full w-full object-cover" />
      ) : (
        <span className={`font-semibold text-avatar-text ${sizeStyle.text}`}>{initial}</span>
      )}
      {/* 사진 경계 안쪽 링 — 밝은 이미지에서 원 경계 확보(Figma avatar/photo inline) */}
      {isImage && (
        <span aria-hidden className="pointer-events-none absolute inset-0 rounded-round-00 border border-avatar-photo-inline" />
      )}
      {/* 사진 hover 오버레이 — interactive일 때만(Figma avatar/photo overly) */}
      {isImage && interactive && (
        <span aria-hidden className="pointer-events-none absolute inset-0 rounded-round-00 bg-avatar-photo-overlay opacity-0 transition-opacity group-hover/avatar:opacity-100" />
      )}
    </>
  );

  // 정적 표시용 — hover·클릭·포커스 없음(span)
  if (!interactive) {
    return (
      <span className={`${base} ${visual} cursor-default ${className}`} {...(props as ComponentPropsWithoutRef<'span'>)}>
        {content}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group/avatar ${base} ${visual} cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-text-field-hover-line ${className}`}
      {...props}
    >
      {content}
    </button>
  );
}
