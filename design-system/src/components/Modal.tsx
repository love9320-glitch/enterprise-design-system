// Modal — 오버레이 다이얼로그 (base + 변형 + 조립형 API)
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
// 두 가지 API (2026-08-11 — prop 비대화 대응, 소비자 개발자 제안 채택):
//   ① Easy API(기본, 90% 케이스): <Modal title confirmText onConfirm>본문</Modal>
//      — 정해진 UX를 props로 빠르게. 기존 API 그대로(하위 호환).
//   ② 조립형(Composition, 고급): <Modal.Root><Modal.Header/><Modal.Body/><Modal.Footer/></Modal.Root>
//      — 헤더에 뱃지, 푸터 커스텀 등 props에 없는 배치가 필요할 때. Easy API가 이 조립형
//      위에서 구현되므로(원본 하나) 두 API의 비주얼·동작은 항상 동일하다.
//      가드레일: Header/Body/Footer는 맨살 div가 아니라 패딩·배경·타이포가 구워진
//      "스타일 슬롯" — 무엇을 배치할지는 자유, 스킨은 시스템이 소유한다(일관성 유지).
//      dim·ESC 스택·스크롤 잠금·포커스 트랩·레이아웃 측정(푸터 안 가림 보장)은 Root가 소유.
//
// 변형(아래 export):
//   - FormModal(취소/저장 + form) — 기본 Modal 구조(헤더 + 자유 본문 + 푸터) 그대로.
//   - AlertModal(확인 1개) · ConfirmModal(취소/확인) — 헤더 없이 본문에 고정 슬롯
//       [타이틀 → 설명 → 2뎁스 상세(회색 박스) → 체크박스(Confirm 전용)]만 둔다.
//       슬롯 종류는 고정(텍스트만 자유 수정), 푸터 버튼은 전체 폭 균등 분할.
//       체크박스는 삭제 등 위험 액션의 재확인 요소(ConfirmModal에서만 사용).
import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type {
  ChangeEvent,
  ComponentPropsWithoutRef,
  FormEvent,
  ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { useFocusTrap } from './useFocusTrap';
import { X } from 'lucide-react';
import { Button } from './Button';
import { ButtonGroup } from './ButtonGroup';
import { LoadingIndicator } from './LoadingIndicator';
import { ScrollArea } from './ScrollArea';
import { ModalBodyMaxContext, ModalFooterStartContext } from './modalContext';
import { Checkbox } from './Checkbox';
import { usePortalContainer } from './portalContext';

// 중첩 모달 전역 관리(2026-07-07 감사) —
//  openModalStack: ESC는 '맨 위' 모달만 닫는다(없으면 ESC 한 번에 중첩 모달이 전부 닫혀 폼 유실).
//    closeOnEsc=false 모달도 스택에는 올라 아래 모달의 ESC를 막는다(맨 위가 안 닫히는 게 맞는 동작).
//  scrollLock: body 스크롤 잠금 참조 카운트 — 인스턴스별 prev 저장/복원은 A→B 순서로 열고 A를
//    먼저 닫으면 B가 떠 있는데 잠금이 풀리므로, 첫 잠금의 원래 값을 마지막 해제 때만 복원한다.
const openModalStack: object[] = [];
let scrollLockCount = 0;
let scrollLockPrev = '';

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

// ── Root 컨텍스트 (모듈 내부 전용) ──────────────────────────────────────────
// Header/Body/Footer 슬롯이 Root와 통신하는 통로:
//  - set*El: 슬롯이 자기 DOM을 Root의 레이아웃 측정 엔진에 등록(높이 실측 → top 여백·bodyMax 계산)
//  - bodyMax/bodyInner: 측정 결과(본문 상한·내용 가용 높이) — Body가 소비
//  - injectedFooterStart: 본문 자식이 ModalFooterStartContext로 주입한 푸터 좌측 콘텐츠
interface ModalRootContextValue {
  onClose: () => void;
  setHeaderEl: (el: HTMLElement | null) => void;
  setFooterEl: (el: HTMLElement | null) => void;
  setContentEl: (el: HTMLElement | null) => void;
  bodyMax: number | string;
  bodyInner: number | null;
  hasSubmit: boolean;
  injectedFooterStart: ReactNode;
  setInjectedFooterStart: (node: ReactNode) => void;
}

const ModalRootContext = createContext<ModalRootContextValue | null>(null);

function useModalRootContext(caller: string): ModalRootContextValue {
  const ctx = useContext(ModalRootContext);
  if (!ctx) throw new Error(`${caller}은(는) Modal.Root 안에서만 사용할 수 있습니다.`);
  return ctx;
}

// ── Modal.Root — 조립형의 뼈대 ─────────────────────────────────────────────
// dim·패널 셸·portal·ESC 스택·스크롤 잠금·포커스 트랩·레이아웃 측정을 소유한다.
// children으로 Modal.Header / Modal.Body / Modal.Footer(또는 임의 조합)를 배치한다.
export interface ModalRootProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'title' | 'onSubmit'> {
  open: boolean;
  onClose: () => void;
  /** 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'fill'(좌우 16씩 제외) */
  size?: keyof typeof SIZE_WIDTH;
  /** 'center'(브라우저 중앙) | 'top'(상단 정렬, 여백 16 ~ 화면높이/2−150 가변) */
  placement?: 'center' | 'top';
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  /** 본문 최대 높이(초과 시 내부 스크롤) — center 정렬의 디자인 캡 */
  bodyMaxHeight?: number | string;
  /** 주면 헤더~푸터를 <form>으로 감싸고, Easy API 주동작 버튼이 type=submit이 된다 */
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
}

export function ModalRoot({
  open,
  onClose,
  children,
  size = 'md',
  placement = 'top',
  closeOnOverlayClick = true,
  closeOnEsc = true,
  bodyMaxHeight = '70vh',
  onSubmit,
  className = '',
  ...props
}: ModalRootProps) {
  const portalContainer = usePortalContainer();
  const boxRef = useRef<HTMLDivElement | null>(null);
  // 슬롯 등록 — Header/Footer/Body(content)가 callback ref로 자기 DOM을 등록한다.
  // ref 객체 대신 state를 쓰는 이유: 등록 시점에 측정 effect가 다시 돌아야 하기 때문.
  const [headerEl, setHeaderEl] = useState<HTMLElement | null>(null);
  const [footerEl, setFooterEl] = useState<HTMLElement | null>(null);
  const [contentEl, setContentEl] = useState<HTMLElement | null>(null);
  // top 정렬 상단 여백은 '열릴 때 한 번' 계산해 닫을 때까지 고정한다(내용 변화로 흔들리지 않게).
  const lockedTopRef = useRef<number | null>(null);
  // 레이아웃 측정값:
  //  - top: top 정렬 시 상단 여백(px). 팝업 자연 높이에 반비례 — 내용 적으면 크게(최대 120),
  //    내용 많으면 작게(최소 = 하단 여백 16). center 정렬이면 null.
  //  - bodyMax: ModalBody 실제 maxHeight(px). header·footer·여백을 빼 화면에 맞춘 값이라
  //    footer가 절대 가려지지 않는다(flex 높이 전파에 의존하지 않음).
  const [layout, setLayout] = useState<{
    top: number | null;
    bodyMax: number | null;
    bodyInner: number | null;
  }>({ top: null, bodyMax: null, bodyInner: null });

  // 푸터 좌측 슬롯 주입(2026-07-23) — 본문 자식이 ModalFooterStartContext로 버튼 등을 넣는다.
  const [injectedFooterStart, setInjectedFooterStart] = useState<ReactNode>(null);

  // ESC 닫기 — 열린 모달 스택의 '맨 위'일 때만 닫는다(중첩 모달 동시 닫힘 방지).
  // closeOnEsc/onClose는 ref로 읽어 effect 재실행(스택 순서 뒤틀림)을 피한다.
  const closeOnEscRef = useRef(closeOnEsc);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    closeOnEscRef.current = closeOnEsc;
    onCloseRef.current = onClose;
  }); // 매 렌더 후 최신값 유지(latest-ref) — 렌더 중 ref 쓰기 금지 규칙 준수
  useEffect(() => {
    if (!open) return;
    const token = {};
    openModalStack.push(token);
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (openModalStack[openModalStack.length - 1] !== token) return; // 맨 위 모달만
      if (closeOnEscRef.current) onCloseRef.current?.();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      const i = openModalStack.indexOf(token);
      if (i !== -1) openModalStack.splice(i, 1);
    };
  }, [open]);

  // 열렸을 때 body 스크롤 잠금 — 참조 카운트(중첩 모달에서 먼저 닫힌 쪽이 잠금을 풀지 않게)
  useEffect(() => {
    if (!open) return;
    scrollLockCount += 1;
    if (scrollLockCount === 1) {
      scrollLockPrev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    return () => {
      scrollLockCount -= 1;
      if (scrollLockCount === 0) document.body.style.overflow = scrollLockPrev;
    };
  }, [open]);

  // 포커스 트랩 + 복원(접근성) — 열릴 때 박스로 진입, Tab을 박스 안에 가두고, 닫힐 때 원래 포커스 복원.
  // 중첩 모달은 각자 자기 박스에 트랩(스택 조율 불필요), 내부 위젯이 처리한 Tab은 존중한다.
  useFocusTrap(open, boxRef);

  // 레이아웃 계산 — header/footer/본문 자연 높이를 측정해 top 여백과 ModalBody maxHeight를 정한다.
  // 슬롯 등록(headerEl 등)이 바뀌면 다시 돈다 — 조립형에서 Header/Footer 유무가 자유이기 때문.
  useLayoutEffect(() => {
    if (!open) return;
    const BOTTOM = 16;   // 하단 여백(spacing-7) — 고정
    const toPx = (v: number | string | null | undefined) => {
      if (v == null) return Infinity;
      if (typeof v === 'number') return v;
      const s = String(v).trim();
      if (s.endsWith('vh')) return (window.innerHeight * parseFloat(s)) / 100;
      if (s.endsWith('px')) return parseFloat(s);
      return Infinity;
    };
    const compute = () => {
      const vh = window.innerHeight;
      const hh = headerEl?.offsetHeight ?? 0;
      const fh = footerEl?.offsetHeight ?? 0;
      const ch = contentEl?.offsetHeight ?? 0; // 본문 natural(미캡) 높이
      const designCap = toPx(bodyMaxHeight);            // 디자인 캡(기본 70vh)
      // 본문 '내용' 가용 높이용 — 본문 패딩(py)을 실측해 빼준다(height='fill' 자식 소비, ModalBodyMaxContext)
      const padY = () => {
        if (!contentEl) return 0;
        const cs = getComputedStyle(contentEl);
        return parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
      };

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
        // -2: header↔body, body↔footer 사이 gap-spacing-1(각 1px 구분선) 공간 확보
        const bodyMax = Math.max(0, vh - top - BOTTOM - hh - fh - 2);
        setLayout({ top, bodyMax, bodyInner: Math.max(0, bodyMax - padY()) });
      } else {
        const bodyMax = Math.max(0, Math.min(designCap, vh - 32 - hh - fh));
        setLayout({ top: null, bodyMax, bodyInner: Math.max(0, bodyMax - padY()) });
      }
    };
    compute();
    const ro = new ResizeObserver(compute);
    [headerEl, footerEl, contentEl].forEach((el) => el && ro.observe(el));
    window.addEventListener('resize', compute);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', compute);
      lockedTopRef.current = null; // 닫히면(또는 placement 변경) 고정 해제 → 다음 열림에 재계산
    };
  }, [open, placement, bodyMaxHeight, headerEl, footerEl, contentEl]);

  const ctxValue = useMemo<ModalRootContextValue>(
    () => ({
      onClose,
      setHeaderEl,
      setFooterEl,
      setContentEl,
      bodyMax: layout.bodyMax ?? bodyMaxHeight,
      bodyInner: layout.bodyInner ?? null,
      hasSubmit: onSubmit != null,
      injectedFooterStart,
      setInjectedFooterStart,
    }),
    [onClose, layout, bodyMaxHeight, onSubmit, injectedFooterStart],
  );

  if (!open) return null;

  // 헤더/바디/푸터 묶음 — onSubmit이 있으면 <form>으로 감싼다
  // (타입은 'form'으로 고정 — 'form'|'div' 유니언은 JSX props가 두 요소의 교집합으로 검사돼
  //  onSubmit 핸들러 타입이 충돌한다. 런타임 동작은 동일.)
  const Inner = (onSubmit ? 'form' : 'div') as 'form';
  const innerProps = onSubmit
    ? {
        onSubmit: (e: FormEvent<HTMLFormElement>) => {
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
    <ModalRootContext.Provider value={ctxValue}>
      <div
        className={`fixed inset-0 z-[1000] flex bg-modal-overlay ${overlayLayout}`}
        style={overlayStyle}
        // dim(오버레이) 영역을 '직접' 클릭했을 때만 닫는다. 박스에 stopPropagation을 걸지 않으므로
        // (걸면 네이티브 mousedown 전파가 막혀 모달 안 Popover의 document 외부클릭 감지가 안 됨)
        // 박스 클릭은 target≠overlay라 여기서 닫히지 않는다.
        onMouseDown={closeOnOverlayClick ? (e) => { if (e.target === e.currentTarget) onClose(); } : undefined}
      >
        <div
          ref={boxRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          className={`flex ${minWClass} max-w-[calc(100vw-32px)] flex-col gap-spacing-1 overflow-hidden rounded-round-6 bg-modal-inline shadow-[0px_4px_6px_0px_rgba(0,0,0,0.08)] outline-none ring-1 ring-modal-outline ${SIZE_WIDTH[size]} ${className}`}
          style={boxMaxHStyle}
          {...props}
        >
          <Inner className="flex min-h-0 flex-1 flex-col gap-spacing-1" {...innerProps}>
            {children}
          </Inner>
        </div>
      </div>
    </ModalRootContext.Provider>,
    portalContainer,
  );
}

// ── Modal.Header — 스타일 슬롯(패딩·배경·타이포 고정, 내용 배치 자유) ──────────
// title은 표준 h2로, children은 그 옆(좌측 영역)에 이어 배치된다(뱃지·설명 등).
// title 없이 children만 주면 좌측 영역 전체를 자유 구성.
export interface ModalHeaderProps
  extends Omit<ComponentPropsWithoutRef<'header'>, 'title'> {
  title?: ReactNode;
  /** 우측 닫기(X) 버튼 — onClose는 Root가 공급 */
  showClose?: boolean;
}

export function ModalHeader({
  title,
  showClose = true,
  children,
  className = '',
  ...props
}: ModalHeaderProps) {
  const { setHeaderEl, onClose } = useModalRootContext('Modal.Header');
  return (
    <header
      ref={setHeaderEl}
      className={`flex shrink-0 items-center justify-between bg-modal-panel-bg py-spacing-6 pl-spacing-7 pr-spacing-6 ${className}`}
      {...props}
    >
      <div className="flex min-w-0 flex-1 items-center gap-spacing-5">
        {title != null && <h2 className="text-15 font-semibold text-font-icon-5">{title}</h2>}
        {children}
      </div>
      {showClose && (
        <Button variant="ghost" size="32" icon={X} onClick={onClose} aria-label="닫기" showTooltip={false} />
      )}
    </header>
  );
}

// ── Modal.Body — 내부 스크롤·가용 높이·로딩 정책을 내장한 본문 슬롯 ─────────────
// maxHeight는 Root의 측정값(bodyMax)으로, header·footer·화면 여백을 뺀 값이라
// footer를 절대 가리지 않는다. 초과 시 ScrollArea 내부 스크롤.
// ModalBodyMaxContext(height='fill' 자식)·푸터 주입·bodyLoading(규칙 22)도 여기서 제공.
export interface ModalBodyProps extends ComponentPropsWithoutRef<'div'> {
  /** 본문 패딩(토큰 클래스). Alert/Confirm은 p-spacing-8 */
  padding?: string;
  /** 모달 최초 로딩(규칙 22) — 바디를 중앙 로딩으로 대체, 모든 데이터 준비 후 일괄 표시 */
  loading?: boolean;
  loadingMessage?: ReactNode;
}

export function ModalBody({
  padding = 'p-spacing-7',
  loading = false,
  loadingMessage,
  className = '',
  children,
  ...props
}: ModalBodyProps) {
  const { bodyMax, bodyInner, setContentEl, setInjectedFooterStart } = useModalRootContext('Modal.Body');
  return (
    <div className="min-h-0 bg-modal-panel-bg">
      <ScrollArea maxHeight={bodyMax}>
        <div ref={setContentEl} className={`${padding} text-14 text-font-icon-4 ${className}`} {...props}>
          <ModalBodyMaxContext.Provider value={bodyInner}>
            <ModalFooterStartContext.Provider value={setInjectedFooterStart}>
              {/* 최초 로딩(규칙 22): 바디 중앙 로딩으로 대체 — 모든 데이터 준비 후 일괄 표시 */}
              {loading ? <LoadingIndicator message={loadingMessage} /> : children}
            </ModalFooterStartContext.Provider>
          </ModalBodyMaxContext.Provider>
        </div>
      </ScrollArea>
    </div>
  );
}

// ── Modal.Footer — 스타일 슬롯(패딩·배경 고정, 내용 배치 자유) ─────────────────
// children을 자유 배치한다(예: <div className="flex-1">좌측</div> + <ButtonGroup>…).
// Easy API의 표준 푸터(좌 텍스트/버튼 + 우 취소/확인)는 내부 ClassicModalFooter가 이 위에 조립.
export interface ModalFooterProps extends ComponentPropsWithoutRef<'footer'> {
  /** 푸터 패딩 직접 지정(토큰 클래스) — 미지정 시 좌 16·우 12·상하 12 */
  padding?: string | null;
}

export function ModalFooter({
  padding = null,
  className = '',
  children,
  ...props
}: ModalFooterProps) {
  const { setFooterEl } = useModalRootContext('Modal.Footer');
  return (
    <footer
      ref={setFooterEl}
      className={`flex shrink-0 items-center bg-modal-panel-bg ${padding ?? 'pl-spacing-7 pr-spacing-6 py-spacing-6'} ${className}`}
      {...props}
    >
      {children}
    </footer>
  );
}

// ── Easy API 표준 푸터(내부용) — Root 컨텍스트에서 주입분·submit 여부를 읽는다 ──
interface ClassicModalFooterProps {
  footer?: ReactNode;
  footerStart?: ReactNode;
  footerStartType?: 'text' | 'button';
  confirmText?: ReactNode;
  cancelText?: ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmVariant?: 'fill' | 'line' | 'ghost' | 'underline';
  confirmDisabled?: boolean;
  confirmLoading?: boolean;
  showCancel?: boolean;
  footerFullWidth?: boolean;
  footerPadding?: string | null;
}

function ClassicModalFooter({
  footer,
  footerStart = null,
  footerStartType = 'text',
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onCancel,
  confirmVariant = 'fill',
  confirmDisabled = false,
  confirmLoading = false,
  showCancel = true,
  footerFullWidth = false,
  footerPadding = null,
}: ClassicModalFooterProps) {
  const { onClose, hasSubmit, injectedFooterStart } = useModalRootContext('Modal footer');
  // footerStart prop이 있으면 prop 우선. 주입분은 버튼 용도이므로 footerStartType='button' 취급.
  const effFooterStart = footerStart ?? injectedFooterStart;
  const effFooterStartType =
    footerStart != null ? footerStartType : injectedFooterStart != null ? 'button' : footerStartType;

  if (!(footer || effFooterStart || confirmText)) return null;

  // 푸터 버튼 그룹(footer 미지정 시) — footerFullWidth면 전체 폭 균등 분할
  const defaultFooterEnd = (
    <ButtonGroup width={footerFullWidth ? 'fill' : 'hug'}>
      {showCancel && (
        <Button variant="line" onClick={onCancel ?? onClose}>
          {cancelText}
        </Button>
      )}
      <Button
        variant={confirmVariant}
        type={hasSubmit ? 'submit' : 'button'}
        disabled={confirmDisabled}
        loading={confirmLoading}
        onClick={hasSubmit ? undefined : onConfirm}
      >
        {confirmText}
      </Button>
    </ButtonGroup>
  );

  // 좌측 여백은 footerStart 내용 유형(footerStartType)에 따라 text=16/button=12
  return (
    <ModalFooter
      padding={
        footerPadding ??
        `${effFooterStartType === 'button' ? 'pl-spacing-6' : 'pl-spacing-7'} pr-spacing-6 py-spacing-6`
      }
      className={footerFullWidth ? '' : 'justify-between'}
    >
      {!footerFullWidth && <div className="min-w-0 flex-1 text-14 text-font-icon-5">{effFooterStart}</div>}
      {footer ?? defaultFooterEnd}
    </ModalFooter>
  );
}

export interface ModalProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'title' | 'onSubmit'> {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  /** 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'fill'(좌우 16씩 제외) */
  size?: keyof typeof SIZE_WIDTH;
  /** 'center'(브라우저 중앙) | 'top'(상단 정렬, 여백 16 ~ 화면높이/2−150 가변). 일반 팝업·FormModal 기본=top, Alert/Confirm은 center */
  placement?: 'center' | 'top';
  showHeader?: boolean;
  /** 헤더 우측 닫기(X) 버튼 */
  showClose?: boolean;
  showFooter?: boolean;
  /** 푸터 전체 커스텀 노드(주면 아래 버튼 props 무시) */
  footer?: ReactNode;
  /** 푸터 좌측 영역 — 새로고침/불러오기 버튼, 안내글, 유효성 메시지 등(텍스트/컴포넌트) */
  footerStart?: ReactNode;
  /** 'text' | 'button' — footerStart 내용 유형. 좌측 여백 결정: text=16(spacing-7) / button=12(spacing-6, 버튼 자체 여백 감안) — 2026-07-06 지시 */
  footerStartType?: 'text' | 'button';
  // 푸터 기본 버튼 — footer 미지정 시 사용
  confirmText?: ReactNode;
  cancelText?: ReactNode;
  onConfirm?: () => void;
  /** 미지정 시 onClose */
  onCancel?: () => void;
  /** 주동작 버튼 variant */
  confirmVariant?: 'fill' | 'line' | 'ghost' | 'underline';
  confirmDisabled?: boolean;
  confirmLoading?: boolean;
  /** 취소(보조) 버튼 노출 여부 */
  showCancel?: boolean;
  /** 푸터 버튼을 전체 폭으로 균등 분할(footerStart 없는 단순 액션용 — Alert/Confirm) */
  footerFullWidth?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  /** 본문 최대 높이(초과 시 내부 스크롤) */
  bodyMaxHeight?: number | string;
  /** 본문 패딩(토큰 클래스). Alert/Confirm은 p-spacing-8 */
  bodyPadding?: string;
  /** 푸터 패딩 직접 지정(토큰 클래스) — 미지정 시 footerStartType 기반 기본값(좌 16/12·우 12·상하 12). Alert/Confirm은 px-spacing-8 py-spacing-7 */
  footerPadding?: string | null;
  bodyClassName?: string;
  /** 모달 최초 로딩(규칙 22) — 바디를 중앙 로딩(스피너+불러오는 중…)으로 대체, 모든 데이터 준비 후 일괄 표시.
      이름이 bodyLoading인 이유: loading(FormModal)·confirmLoading은 푸터 확인 버튼용이라 구분 */
  bodyLoading?: boolean;
  bodyLoadingMessage?: ReactNode;
  /** 주면 본문+푸터를 <form>으로 감싸고 주동작 버튼 type=submit */
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
}

// Easy API — 정해진 UX를 props로 빠르게 조립(90% 케이스). 내부는 조립형(Root/Header/Body/Footer)
// 위에서 구현되므로 두 API의 비주얼·동작은 항상 동일하다.
function ModalBase({
  open,
  onClose,
  title,
  children,                       // ModalContent — 본문에 주입할 내용
  size = 'md',
  placement = 'top',
  showHeader = true,
  showClose = true,
  showFooter = true,
  footer,
  footerStart = null,
  footerStartType = 'text',
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onCancel,
  confirmVariant = 'fill',
  confirmDisabled = false,
  confirmLoading = false,
  showCancel = true,
  footerFullWidth = false,
  closeOnOverlayClick = true,
  closeOnEsc = true,
  bodyMaxHeight = '70vh',
  bodyPadding = 'p-spacing-7',
  footerPadding = null,
  bodyClassName = '',
  bodyLoading = false,
  bodyLoadingMessage,
  onSubmit,
  className = '',
  ...props
}: ModalProps) {
  return (
    <ModalRoot
      open={open}
      onClose={onClose}
      size={size}
      placement={placement}
      closeOnOverlayClick={closeOnOverlayClick}
      closeOnEsc={closeOnEsc}
      bodyMaxHeight={bodyMaxHeight}
      onSubmit={onSubmit}
      aria-label={typeof title === 'string' ? title : undefined}
      className={className}
      {...props}
    >
      {showHeader && <ModalHeader title={title} showClose={showClose} />}
      <ModalBody
        padding={bodyPadding}
        className={bodyClassName}
        loading={bodyLoading}
        loadingMessage={bodyLoadingMessage}
      >
        {children}
      </ModalBody>
      {showFooter && (
        <ClassicModalFooter
          footer={footer}
          footerStart={footerStart}
          footerStartType={footerStartType}
          confirmText={confirmText}
          cancelText={cancelText}
          onConfirm={onConfirm}
          onCancel={onCancel}
          confirmVariant={confirmVariant}
          confirmDisabled={confirmDisabled}
          confirmLoading={confirmLoading}
          showCancel={showCancel}
          footerFullWidth={footerFullWidth}
          footerPadding={footerPadding}
        />
      )}
    </ModalRoot>
  );
}

// Modal = Easy API + dot 표기 조립형(Advanced API).
//   <Modal …props/>                                — 기존 방식 그대로(하위 호환)
//   <Modal.Root><Modal.Header/><Modal.Body/><Modal.Footer/></Modal.Root> — 자유 배치
// (Object.assign 대신 as+속성 대입 — react-refresh 규칙이 컴포넌트 export로 인식하게)
type ModalComponent = typeof ModalBase & {
  Root: typeof ModalRoot;
  Header: typeof ModalHeader;
  Body: typeof ModalBody;
  Footer: typeof ModalFooter;
};
export const Modal = ModalBase as ModalComponent;
Modal.Root = ModalRoot;
Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

// ConfirmAlertBody — Alert/Confirm 전용 고정 본문 슬롯.
// 헤더 없이 본문 안에 [타이틀 → 설명 → 2뎁스 상세(회색 박스) → 체크박스(Confirm 전용)] 순으로 배치한다.
// 슬롯 종류는 고정이며 텍스트만 자유롭게 바꾼다. 비워둔 슬롯은 렌더하지 않는다.
function ConfirmAlertBody({
  title,
  description,
  descriptionDetail,
  checkbox,
}: {
  title?: ReactNode;
  description?: ReactNode;
  descriptionDetail?: ReactNode;
  checkbox?: ReactNode;
}) {
  const hasContent = description != null || descriptionDetail != null || checkbox != null;
  return (
    <div className="flex flex-col gap-spacing-6">
      {title != null && (
        <h2 className="text-20 font-semibold text-font-icon-5">{title}</h2>
      )}
      {hasContent && (
        <div className="flex flex-col gap-spacing-5">
          {description != null && (
            <div className="whitespace-pre-line text-14 text-font-icon-5">{description}</div>
          )}
          {descriptionDetail != null && (
            <div className="whitespace-pre-line rounded-round-4 bg-modal-description-bg p-spacing-6 text-14 text-font-icon-5">
              {descriptionDetail}
            </div>
          )}
          {checkbox}
        </div>
      )}
    </div>
  );
}

// AlertModal — 확인 버튼 하나, 단순 알림. 헤더 없이 본문 고정 슬롯(타이틀/설명/2뎁스 상세).
export interface AlertModalProps extends ModalProps {
  /** 설명글(여러 줄은 \n) */
  description?: ReactNode;
  /** 2뎁스 상세 설명(회색 박스) */
  descriptionDetail?: ReactNode;
}

export function AlertModal({
  title,
  description,
  descriptionDetail,
  confirmText = '확인',
  onConfirm,
  onClose,
  size = 'sm',                     // Alert/Confirm 기본 360px
  placement = 'center',           // 알럿은 중앙 기본(필요 시 override)
  ...props
}: AlertModalProps) {
  return (
    <Modal
      {...props}
      title={title}
      size={size}
      placement={placement}
      onClose={onClose}
      showHeader={false}
      showCancel={false}
      footerFullWidth
      bodyPadding="p-spacing-8"
      footerPadding="px-spacing-8 py-spacing-7"
      confirmText={confirmText}
      onConfirm={onConfirm ?? onClose}
    >
      <ConfirmAlertBody title={title} description={description} descriptionDetail={descriptionDetail} />
    </Modal>
  );
}

// ConfirmModal — 취소/확인, 의사결정 요구. 헤더 없이 본문 고정 슬롯(타이틀/설명/2뎁스 상세/체크박스).
// 체크박스는 삭제 등 위험 액션의 재확인 요소 — checkboxLabel을 주면 본문에 노출되고,
// requireCheck(기본 true)면 체크해야 확인 버튼이 활성화된다.
export interface ConfirmModalProps extends ModalProps {
  /** 설명글(여러 줄은 \n) */
  description?: ReactNode;
  /** 2뎁스 상세 설명(회색 박스) */
  descriptionDetail?: ReactNode;
  /** 주면 본문에 재확인 체크박스 노출 */
  checkboxLabel?: ReactNode;
  /** controlled 체크 상태(미지정 시 내부 상태로 동작) */
  checked?: boolean;
  /** (checked, event) — 체크 변경 콜백 */
  onCheckChange?: (checked: boolean, e: ChangeEvent<HTMLInputElement>) => void;
  /** checkboxLabel 있을 때 체크해야 확인 활성화 */
  requireCheck?: boolean;
}

export function ConfirmModal({
  title,
  description,
  descriptionDetail,
  checkboxLabel,
  checked,
  onCheckChange,
  requireCheck = true,
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onCancel,
  onClose,
  confirmVariant = 'fill',
  confirmDisabled = false,
  open,
  size = 'sm',                     // Alert/Confirm 기본 360px
  placement = 'center',           // 컨펌은 중앙 기본(필요 시 override)
  ...props
}: ConfirmModalProps) {
  const hasCheck = checkboxLabel != null;
  const isControlled = checked !== undefined;
  const [internalChecked, setInternalChecked] = useState(false);
  const isChecked = isControlled ? checked : internalChecked;

  // 열림 상태가 바뀌는 순간(렌더 중) 내부 체크 상태 초기화 — 닫았다 다시 열면 해제된 상태로 시작.
  // effect 대신 prop 변화 감지 패턴을 써서 cascading render를 피한다.
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open && !isControlled) setInternalChecked(false);
  }

  const handleCheck = (e: ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setInternalChecked(e.target.checked);
    onCheckChange?.(e.target.checked, e);
  };

  const gated = hasCheck && requireCheck && !isChecked;

  return (
    <Modal
      {...props}
      title={title}
      open={open}
      size={size}
      placement={placement}
      onClose={onClose}
      showHeader={false}
      showCancel
      footerFullWidth
      bodyPadding="p-spacing-8"
      footerPadding="px-spacing-8 py-spacing-7"
      confirmText={confirmText}
      cancelText={cancelText}
      onConfirm={onConfirm}
      onCancel={onCancel ?? onClose}
      confirmVariant={confirmVariant}
      confirmDisabled={confirmDisabled || gated}
    >
      <ConfirmAlertBody
        title={title}
        description={description}
        descriptionDetail={descriptionDetail}
        checkbox={
          hasCheck ? (
            <Checkbox checked={isChecked} onChange={handleCheck} label={checkboxLabel} />
          ) : null
        }
      />
    </Modal>
  );
}

// FormModal — 취소/저장(또는 등록), form + 유효성 검사 연동
export interface FormModalProps extends ModalProps {
  /** 저장/등록 등 목적별 라벨 */
  submitText?: ReactNode;
  submitDisabled?: boolean;
  loading?: boolean;
}

export function FormModal({
  submitText = '저장',
  cancelText = '취소',
  onSubmit,
  onCancel,
  onClose,
  submitDisabled = false,
  loading = false,
  ...props
}: FormModalProps) {
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
