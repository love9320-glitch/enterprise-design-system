// Modal — 오버레이 다이얼로그 (base + 변형)
// Figma: h9jZFkEHfcHUGok1TZjjlP — modal (node 7349:1758474)
//
// 구조 (모달 설계 가이드):
//   ModalOverlay (딤)
//   └── ModalBox (size로 width 고정, 내부 요소는 width:100%)
//       ├── ModalHeader  (타이틀 + 닫기 버튼)
//       ├── ModalBody    (ScrollArea — maxHeight 70vh, 내부 스크롤)
//       │   └── children (ModalContent — 외부 주입)
//       └── ModalFooter  (좌측 텍스트/컴포넌트 + 버튼 그룹)
//
//   ModalBox 배경은 modal-inline(gray-100) + gap 1px → 헤더/바디/푸터(white) 사이가
//   1px 구분선으로 비친다. 외곽선은 modal-outline 1px ring, round-6(10px), 그림자.
//
// 변형(아래 export): AlertModal(확인 1개) · ConfirmModal(취소/확인) · FormModal(취소/저장 + form).
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Button } from './Button';
import { ButtonGroup } from './ButtonGroup';
import { ScrollArea } from './ScrollArea';

// ModalBox width 규격 — sm:360 md:480 lg:600 xl:720 2xl:840 3xl:960 4xl:1260
//  fill = 브라우저 너비에서 좌우 16px씩 뺀 값(calc(100vw-32px)), 단 최소 너비 1260px
const SIZE_WIDTH = {
  sm: 'w-[360px]',
  md: 'w-[480px]',
  lg: 'w-[600px]',
  xl: 'w-[720px]',
  '2xl': 'w-[840px]',
  '3xl': 'w-[960px]',
  '4xl': 'w-[1260px]',
  fill: 'w-[calc(100vw-32px)]',
};

export function Modal({
  open,
  onClose,
  title,
  children,                       // ModalContent — 본문에 주입할 내용
  size = 'md',                    // 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'fill'(좌우 16씩 제외)
  placement = 'top',              // 'center'(브라우저 중앙) | 'top'(상단 정렬, 여백 16 ~ 화면높이/2−150 가변). 일반 팝업·FormModal 기본=top, Alert/Confirm은 center
  showHeader = true,
  showClose = true,               // 헤더 우측 닫기(X) 버튼
  showFooter = true,
  footer,                         // 푸터 전체 커스텀 노드(주면 아래 버튼 props 무시)
  footerStart = null,             // 푸터 좌측 영역 — 새로고침/불러오기 버튼, 안내글, 유효성 메시지 등(텍스트/컴포넌트)
  // 푸터 기본 버튼 — footer 미지정 시 사용
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onCancel,                       // 미지정 시 onClose
  confirmVariant = 'fill',        // 주동작 버튼 variant
  confirmDisabled = false,
  confirmLoading = false,
  showCancel = true,              // 취소(보조) 버튼 노출 여부
  closeOnOverlayClick = true,
  closeOnEsc = true,
  bodyMaxHeight = '70vh',         // 본문 최대 높이(초과 시 내부 스크롤)
  bodyClassName = '',
  onSubmit,                       // 주면 본문+푸터를 <form>으로 감싸고 주동작 버튼 type=submit
  className = '',
  ...props
}) {
  const boxRef = useRef(null);
  const headerRef = useRef(null);
  const footerRef = useRef(null);
  const contentRef = useRef(null);
  // top 정렬 상단 여백은 '열릴 때 한 번' 계산해 닫을 때까지 고정한다(내용 변화로 흔들리지 않게).
  const lockedTopRef = useRef(null);
  // 레이아웃 측정값:
  //  - top: top 정렬 시 상단 여백(px). 팝업 자연 높이에 반비례 — 내용 적으면 크게(최대 120),
  //    내용 많으면 작게(최소 = 하단 여백 16). center 정렬이면 null.
  //  - bodyMax: ModalBody 실제 maxHeight(px). header·footer·여백을 빼 화면에 맞춘 값이라
  //    footer가 절대 가려지지 않는다(flex 높이 전파에 의존하지 않음).
  const [layout, setLayout] = useState({ top: null, bodyMax: null });

  // ESC 닫기
  useEffect(() => {
    if (!open || !closeOnEsc) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, closeOnEsc, onClose]);

  // 열렸을 때 body 스크롤 잠금
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // 열릴 때 패널로 포커스 이동(포커스 트랩 진입점)
  useEffect(() => {
    if (open) boxRef.current?.focus();
  }, [open]);

  // 레이아웃 계산 — header/footer/본문 자연 높이를 측정해 top 여백과 ModalBody maxHeight를 정한다.
  useLayoutEffect(() => {
    if (!open) return;
    const BOTTOM = 16;   // 하단 여백(spacing-7) — 고정
    const toPx = (v) => {
      if (v == null) return Infinity;
      if (typeof v === 'number') return v;
      const s = String(v).trim();
      if (s.endsWith('vh')) return (window.innerHeight * parseFloat(s)) / 100;
      if (s.endsWith('px')) return parseFloat(s);
      return Infinity;
    };
    const compute = () => {
      const vh = window.innerHeight;
      const hh = headerRef.current?.offsetHeight ?? 0;
      const fh = footerRef.current?.offsetHeight ?? 0;
      const ch = contentRef.current?.offsetHeight ?? 0; // 본문 natural(미캡) 높이
      const designCap = toPx(bodyMaxHeight);            // 디자인 캡(기본 70vh)

      if (placement === 'top') {
        // 상단 정렬은 % 높이 캡(bodyMaxHeight, 70vh)을 적용하지 않는다 — top 여백 + 화면 가용
        // 높이로만 본문 높이를 정한다. 상단 여백 top은 '열릴 때 한 번'만 계산해 고정(lockedTopRef)
        // → 이후 내용이 바뀌어도 위치가 흔들리지 않는다. bodyMax만 화면 크기에 맞춰 갱신.
        //  - 팝업 자연 높이에 반비례: 내용 많음 → top 작게(최소 BOTTOM), 적음 → 크게(최대 MAX_TOP).
        if (lockedTopRef.current == null) {
          // 상단 여백 범위: BOTTOM(16) ~ MAX_TOP(화면높이/2 − 150). 작은 화면에선 BOTTOM로 수렴.
          // 팝업 자연 높이가 화면을 채우는 비율(0~1)에 선형 비례해 top을 MAX_TOP→BOTTOM로 보간.
          // 내용 적음 → top 큼(최대 MAX_TOP), 내용 많음 → top 작음(최소 BOTTOM).
          const MAX_TOP = Math.max(BOTTOM, vh / 2 - 150);
          const effModalH = hh + fh + ch;
          const fill = Math.min(1, Math.max(0, effModalH / vh));
          const top = MAX_TOP - (MAX_TOP - BOTTOM) * fill;
          lockedTopRef.current = Math.round(Math.min(MAX_TOP, Math.max(BOTTOM, top)));
        }
        const top = lockedTopRef.current;
        const bodyMax = Math.max(0, vh - top - BOTTOM - hh - fh);
        setLayout({ top, bodyMax });
      } else {
        const bodyMax = Math.max(0, Math.min(designCap, vh - 32 - hh - fh));
        setLayout({ top: null, bodyMax });
      }
    };
    compute();
    const ro = new ResizeObserver(compute);
    [headerRef, footerRef, contentRef].forEach((r) => r.current && ro.observe(r.current));
    window.addEventListener('resize', compute);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', compute);
      lockedTopRef.current = null; // 닫히면(또는 placement 변경) 고정 해제 → 다음 열림에 재계산
    };
  }, [open, placement, bodyMaxHeight]);

  if (!open) return null;

  // 푸터 버튼 그룹(footer 미지정 시)
  const defaultFooterEnd = (
    <ButtonGroup>
      {showCancel && (
        <Button variant="line" onClick={onCancel ?? onClose}>
          {cancelText}
        </Button>
      )}
      <Button
        variant={confirmVariant}
        type={onSubmit ? 'submit' : 'button'}
        disabled={confirmDisabled}
        loading={confirmLoading}
        onClick={onSubmit ? undefined : onConfirm}
      >
        {confirmText}
      </Button>
    </ButtonGroup>
  );

  // 헤더/바디/푸터 묶음 — onSubmit이 있으면 <form>으로 감싼다
  const Inner = onSubmit ? 'form' : 'div';
  const innerProps = onSubmit
    ? {
        onSubmit: (e) => {
          e.preventDefault();
          onSubmit(e);
        },
      }
    : {};

  // 정렬: center=중앙, top=상단 가변(measure로 layout.top 계산). 첫 페인트 전 fallback=화면높이/2−150.
  const isTop = placement === 'top';
  const topPad = layout.top ?? Math.round(Math.max(16, (typeof window !== 'undefined' ? window.innerHeight : 800) / 2 - 150));
  const overlayLayout = isTop
    ? 'items-start justify-center px-spacing-7'
    : 'items-center justify-center p-spacing-7';
  const overlayStyle = isTop ? { paddingTop: topPad, paddingBottom: 16 } : undefined;
  const boxMaxHStyle = isTop
    ? { maxHeight: `calc(100vh - ${topPad + 16}px)` }
    : { maxHeight: 'calc(100vh - 32px)' };
  // 최소 너비 — fill은 1260px, 그 외는 360px
  const minWClass = size === 'fill' ? 'min-w-[1260px]' : 'min-w-[360px]';

  return createPortal(
    <div
      className={`fixed inset-0 z-[1000] flex bg-modal-overlay ${overlayLayout}`}
      style={overlayStyle}
      onMouseDown={closeOnOverlayClick ? onClose : undefined}
    >
      <div
        ref={boxRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : undefined}
        onMouseDown={(e) => e.stopPropagation()}
        className={`flex ${minWClass} max-w-[calc(100vw-32px)] flex-col gap-spacing-1 overflow-hidden rounded-round-6 bg-modal-inline shadow-[0px_4px_6px_0px_rgba(0,0,0,0.08)] outline-none ring-1 ring-modal-outline ${SIZE_WIDTH[size]} ${className}`}
        style={boxMaxHStyle}
        {...props}
      >
        <Inner className="flex min-h-0 flex-1 flex-col gap-spacing-1" {...innerProps}>
          {/* Header */}
          {showHeader && (
            <header ref={headerRef} className="flex shrink-0 items-center justify-between bg-modal-panel-bg px-spacing-7 py-spacing-6">
              <h2 className="text-15 font-semibold text-font-icon-5">{title}</h2>
              {showClose && (
                <Button variant="ghost" size="32" icon={X} onClick={onClose} aria-label="닫기" />
              )}
            </header>
          )}

          {/* Body — maxHeight는 측정값(bodyMax)으로, header·footer·화면 여백을 뺀 값이라
              footer를 절대 가리지 않는다. 초과 시 ScrollArea 내부 스크롤. */}
          <div className="min-h-0 bg-modal-panel-bg">
            <ScrollArea maxHeight={layout.bodyMax ?? bodyMaxHeight}>
              <div ref={contentRef} className={`p-spacing-7 text-14 text-font-icon-4 ${bodyClassName}`}>
                {children}
              </div>
            </ScrollArea>
          </div>

          {/* Footer */}
          {showFooter && (footer || footerStart || confirmText) && (
            <footer ref={footerRef} className="flex shrink-0 items-center justify-between bg-modal-panel-bg px-spacing-7 py-spacing-6">
              <div className="min-w-0 flex-1 text-14 text-font-icon-5">{footerStart}</div>
              {footer ?? defaultFooterEnd}
            </footer>
          )}
        </Inner>
      </div>
    </div>,
    document.body,
  );
}

// AlertModal — 확인 버튼 하나, 단순 알림
export function AlertModal({
  confirmText = '확인',
  onConfirm,
  onClose,
  placement = 'center',           // 알럿은 중앙 기본(필요 시 override)
  ...props
}) {
  return (
    <Modal
      {...props}
      placement={placement}
      onClose={onClose}
      showCancel={false}
      confirmText={confirmText}
      onConfirm={onConfirm ?? onClose}
    />
  );
}

// ConfirmModal — 취소/확인, 의사결정 요구
export function ConfirmModal({
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onCancel,
  onClose,
  confirmVariant = 'fill',
  placement = 'center',           // 컨펌은 중앙 기본(필요 시 override)
  ...props
}) {
  return (
    <Modal
      {...props}
      placement={placement}
      onClose={onClose}
      showCancel
      confirmText={confirmText}
      cancelText={cancelText}
      onConfirm={onConfirm}
      onCancel={onCancel ?? onClose}
      confirmVariant={confirmVariant}
    />
  );
}

// FormModal — 취소/저장(또는 등록), form + 유효성 검사 연동
export function FormModal({
  submitText = '저장',          // 저장/등록 등 목적별 라벨
  cancelText = '취소',
  onSubmit,
  onCancel,
  onClose,
  submitDisabled = false,
  loading = false,
  ...props
}) {
  return (
    <Modal
      {...props}
      onClose={onClose}
      onSubmit={onSubmit}
      showCancel
      confirmText={submitText}
      cancelText={cancelText}
      onCancel={onCancel ?? onClose}
      confirmDisabled={submitDisabled}
      confirmLoading={loading}
    />
  );
}
