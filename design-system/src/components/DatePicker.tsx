// DatePicker — 캘린더 날짜 선택 팝오버 (Figma date picker, node 7594:4368)
// 구성(위→아래, 각 영역은 gap-spacing-1(1px) 틈으로 구분):
//   1) date area  — 상단 네비게이션(캘린더 아이콘 + 연.월 선택 / 이전·오늘·다음 버튼) + 요일 헤더
//   2) calender area — 날짜 그리드(CalendarDayButton). scrollNavigate면 ScrollArea로 주 단위
//      무한 세로 스크롤(페이지처럼 연속 이동, 스크롤 따라 헤더 연.월 갱신), 아니면 정적 6주 그리드.
//   3) time area  — (showTime) 시작/마감 시간 선택(시:분 2depth 목록)
// 연.월 선택과 시간 선택은 TwoDepthList(2depth 목록)를 Popover로 띄워 고른다.
//
// 선택 모드:
//   - mode='single' : value=Date|null
//   - mode='range'  : value={ start: Date|null, end: Date|null }
// controlled(value/onChange) · uncontrolled(defaultValue) 모두 지원. 표시 월은 month/defaultMonth.
// 색은 cal-* / list-* / font-icon-* 시멘틱 토큰만 사용.
import { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';
import { ButtonGroup } from './ButtonGroup';
import { Popover } from './Popover';
import { InlineFieldTrigger } from './InlineFieldTrigger';
import { TwoDepthList } from './TwoDepthList';
import { CalendarDayButton } from './CalendarDayButton';
import { ScrollArea } from './ScrollArea';
import { Tooltip } from './Tooltip';

// ── 날짜 헬퍼 (외부 라이브러리 없이 native Date) ─────────────────────────
const pad2 = (n) => String(n).padStart(2, '0');
const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const isSameDay = (a, b) =>
  !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const addMonths = (d, n) => new Date(d.getFullYear(), d.getMonth() + n, 1);
const fmtYearMonth = (d) => `${d.getFullYear()}.${pad2(d.getMonth() + 1)}`;

// 직접 입력 파싱 — 연.월. 구분자 있으면 연도 2/4자리·월 1~2자리(예: "2025.05" · "25.3"),
//   구분자 없으면 YYMM(4자리, 예 "2505") 또는 YYYYMM(6자리, 예 "202505"). 2자리 연도는 20xx로 보정.
const DEFAULT_WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

// 표시 월의 6주 × 7일 그리드(앞뒤 달 채움)
function buildWeeks(viewDate, weekStartsOn) {
  const y = viewDate.getFullYear();
  const m = viewDate.getMonth();
  const firstDow = (new Date(y, m, 1).getDay() - weekStartsOn + 7) % 7;
  const gridStart = new Date(y, m, 1 - firstDow);
  return Array.from({ length: 6 }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + w * 7 + d)),
  );
}

// 날짜 셀 라벨 — 매월 1일은 "M.1"로 표기해 달 경계를 구분(Figma "7.1"·"8.1").
const dayLabel = (date) => (date.getDate() === 1 ? `${date.getMonth() + 1}.1` : date.getDate());

// ── 주(week) 헬퍼 — 무한 스크롤 캘린더용 ─────────────────────────────────
const monthKey = (d) => d.getFullYear() * 12 + d.getMonth();
const addWeeks = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n * 7);
const startOfWeek = (d, weekStartsOn) => {
  const x = startOfDay(d);
  const diff = (x.getDay() - weekStartsOn + 7) % 7;
  return new Date(x.getFullYear(), x.getMonth(), x.getDate() - diff);
};
const firstWeekOfMonth = (monthDate, weekStartsOn) =>
  startOfWeek(new Date(monthDate.getFullYear(), monthDate.getMonth(), 1), weekStartsOn);

// 스크롤 메트릭(셀 24 + 행 간격 12 = 한 주 36px) — idx ↔ scrollTop 환산에 사용
const ROW_UNIT = 36;
const GRID_PAD = 12; // 날짜 영역 상하 패딩(spacing-6) — 정적 그리드(p-spacing-6)와 동일
const VISIBLE_HEIGHT = 6 * 24 + 5 * 12 + 2 * GRID_PAD; // 6주+상하 패딩 = 228px (정적 그리드와 동일 높이)
const WIN_BEFORE = 20; // 앵커 달 첫 주 기준 위로 채울 주
const WIN_AFTER = 26;  // 아래로 채울 주
const BATCH = 10;      // 끝 근처에서 한 번에 덧붙일 주
const MAX_WEEKS = 160; // DOM 상한(반대편을 잘라 유지)

// 앵커 달의 첫 주를 index WIN_BEFORE에 두는 주(week-start) 배열
function buildWindow(monthDate, weekStartsOn) {
  const fw = firstWeekOfMonth(monthDate, weekStartsOn);
  return Array.from({ length: WIN_BEFORE + WIN_AFTER }, (_, i) => addWeeks(fw, i - WIN_BEFORE));
}

// CalendarScroller — 주 단위 무한 세로 스크롤 캘린더(페이지 스크롤처럼 연속 이동).
// ScrollArea(오버레이 스크롤바)로 감싸고, 끝에 가까워지면 주를 prepend/append해 끝없이 이어 붙인다.
// 보이는 중앙 주의 달을 헤더로 보고(onVisibleMonthChange), 외부에서 달이 바뀌면(anchorKey) 그 달로 스크롤한다.
function CalendarScroller({ anchorMonth, anchorKey, weekStartsOn, onVisibleMonthChange, renderDay }: any) {
  const vpRef = useRef<HTMLDivElement | null>(null);
  const setVp = useCallback((el) => {
    vpRef.current = el;
  }, []);
  const [weeks, setWeeks] = useState(() => buildWindow(anchorMonth, weekStartsOn));
  const lastKeyRef = useRef(anchorKey); // 마지막으로 헤더에 보고/반영한 달
  const adjustRef = useRef<'anchor' | number>('anchor'); // 다음 레이아웃에서 scrollTop 보정
  const busyRef = useRef(false);        // prepend/append 진행 중 중복 방지

  // 외부에서 달이 바뀌면(버튼·연월 선택) 그 달 기준으로 윈도우 재구성 + 상단 정렬
  useEffect(() => {
    if (anchorKey === lastKeyRef.current) return; // 스크롤로 인한 변경이면 이미 동기화됨
    lastKeyRef.current = anchorKey;
    adjustRef.current = 'anchor';
    setWeeks(buildWindow(anchorMonth, weekStartsOn));
  }, [anchorKey, anchorMonth, weekStartsOn]);

  // weeks가 바뀐 직후 scrollTop 보정(앵커 정렬 / prepend·trim 위치 유지)
  useLayoutEffect(() => {
    const el = vpRef.current;
    if (!el) return;
    if (adjustRef.current === 'anchor') el.scrollTop = WIN_BEFORE * ROW_UNIT; // 콘텐츠 py 패딩 덕에 첫 주 위 12px 여백(정적과 동일)
    else if (adjustRef.current) el.scrollTop += adjustRef.current;
    adjustRef.current = 0;
    busyRef.current = false;
  }, [weeks]);

  const handleScroll = () => {
    const el = vpRef.current;
    if (!el) return;
    // 보이는 중앙 주의 목요일이 속한 달을 현재 달로 본다
    const idx = Math.min(Math.max(Math.floor((el.scrollTop - GRID_PAD + el.clientHeight / 2) / ROW_UNIT), 0), weeks.length - 1);
    const wk = weeks[idx];
    const mid = new Date(wk.getFullYear(), wk.getMonth(), wk.getDate() + 3);
    const key = monthKey(mid);
    if (key !== lastKeyRef.current) {
      lastKeyRef.current = key;
      onVisibleMonthChange(new Date(mid.getFullYear(), mid.getMonth(), 1));
    }
    // 끝 근처면 무한 확장(+ 반대편 trim)
    if (busyRef.current) return;
    const NEAR = ROW_UNIT * 4;
    if (el.scrollTop < NEAR) {
      busyRef.current = true;
      setWeeks((prev) => {
        const fw = prev[0];
        let next = [...Array.from({ length: BATCH }, (_, i) => addWeeks(fw, i - BATCH)), ...prev];
        adjustRef.current = BATCH * ROW_UNIT; // 위에 끼운 만큼 아래로 보정
        if (next.length > MAX_WEEKS) next = next.slice(0, MAX_WEEKS); // 아래쪽 잘라냄(스크롤 영향 없음)
        return next;
      });
    } else if (el.scrollTop + el.clientHeight > el.scrollHeight - NEAR) {
      busyRef.current = true;
      setWeeks((prev) => {
        const last = prev[prev.length - 1];
        let next = [...prev, ...Array.from({ length: BATCH }, (_, i) => addWeeks(last, i + 1))];
        if (next.length > MAX_WEEKS) {
          const drop = next.length - MAX_WEEKS;
          next = next.slice(drop);
          adjustRef.current = -drop * ROW_UNIT; // 앞쪽 잘라낸 만큼 위로 보정
        }
        return next;
      });
    }
  };

  return (
    <ScrollArea
      maxHeight={VISIBLE_HEIGHT}
      onViewport={setVp}
      onScroll={handleScroll}
      className="w-full bg-list-group-bg"
      contentClassName="flex select-none flex-col gap-spacing-6 overscroll-contain p-spacing-6"
    >
      {weeks.map((wkStart) => (
        <div key={wkStart.getTime()} className="flex items-center">
          {Array.from({ length: 7 }, (_, d) =>
            renderDay(new Date(wkStart.getFullYear(), wkStart.getMonth(), wkStart.getDate() + d)),
          )}
        </div>
      ))}
    </ScrollArea>
  );
}

// ── 연.월 / 시간 선택을 띄우는 셀렉트형 트리거 (텍스트 + chevron, hover 밑줄) ──────
function DualSelectField({ icon: Icon, display, panelWidth = 160, placement = 'auto-left', disabled = false, ...panelProps }: any) {
  // 트리거 비주얼은 공유 프리미티브 InlineFieldTrigger 사용(Select 인라인 텍스트형과 동일).
  // 열림 상태(텍스트 회색·chevron 회전)를 반영하려고 Popover를 controlled로 둔다.
  const [open, setOpen] = useState(false);
  return (
    <Popover
      placement={placement}
      menuWidth={panelWidth}
      disabled={disabled}
      open={open}
      onOpenChange={setOpen}
      trigger={
        <InlineFieldTrigger icon={Icon} open={open} disabled={disabled}>
          {display}
        </InlineFieldTrigger>
      }
    >
      <TwoDepthList width={panelWidth} {...panelProps} />
    </Popover>
  );
}

// 시간 영역 한 칸(시작/마감) — 라벨 + 시:분 셀렉트. disabled면 비활성(해당 날짜 미선택 시).
// justify: 'center'(범위 2칸, 기본) | 'between'(단일 1칸 — 라벨 왼쪽·셀렉터 오른쪽 정렬)
function TimeField({ label, value, onChange, hourOptions, minuteOptions, placement = 'auto-right', disabled = false, justify = 'center' }: any) {
  const [hh = '00', mm = '00'] = (value || '').split(':');
  const set = (h, m) => onChange?.(`${h}:${m}`);
  return (
    <div
      className={`flex h-[44px] flex-1 items-center gap-spacing-6 bg-list-group-bg px-spacing-6 py-spacing-5 ${
        justify === 'between' ? 'justify-between' : 'justify-center'
      }`}
    >
      <span className={`whitespace-nowrap text-12 ${disabled ? 'text-font-icon-2' : 'text-font-icon-5'}`}>{label}</span>
      <DualSelectField
        disabled={disabled}
        placement={placement}
        panelWidth={140}
        separator=":"
        display={`${hh}:${mm}`}
        inputValue={`${hh}:${mm}`}
        inputPlaceholder="HH:MM"
        onInputApply={(t) => {
          const [hs, ms] = t.split(':');
          const hh = Number(hs);
          const mm = Number(ms);
          if (hs.trim() === '' || Number.isNaN(hh) || hh > 23) return { error: 'left', message: '시는 0~23으로 입력하세요' };
          if (ms.trim() === '' || Number.isNaN(mm) || mm > 59) return { error: 'right', message: '분은 0~59로 입력하세요' };
          const v = `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
          onChange?.(v);
          return v;
        }}
        leftOptions={hourOptions}
        leftValue={hh}
        onLeftChange={(h) => set(h, mm)}
        rightOptions={minuteOptions}
        rightValue={mm}
        onRightChange={(m) => set(hh, m)}
        maxVisible={5}
      />
    </div>
  );
}

export function DatePicker({
  mode = 'single', // 'single' | 'range'
  value,
  defaultValue,
  onChange,
  // 선택 제한 — 지나간 날짜/미래 날짜/범위 밖 날짜를 선택 불가(비활성)로
  disablePast = false, // 오늘 이전 날짜 선택 불가(오늘은 선택 가능)
  disableFuture = false, // 오늘 이후 날짜 선택 불가(오늘은 선택 가능)
  minDate,             // 이 날짜 이전은 비활성 (Date)
  maxDate,             // 이 날짜 이후는 비활성 (Date)
  disabledDate,        // (date) => boolean — 커스텀 비활성 판정
  month,            // 표시 월(controlled) — Date
  defaultMonth,
  onMonthChange,
  showTime = false, // 하단 시간 영역 표시 — 범위=시작/마감 2칸 · 단일=시간 1칸(startTime 사용, 마감 없음)
  startTime = '00:00',
  endTime = '23:59',
  onStartTimeChange,
  onEndTimeChange,
  timeLabel = '시간 입력', // 단일 모드 시간 칸 라벨
  weekStartsOn = 0, // 0=일요일 시작
  weekdayLabels = DEFAULT_WEEKDAYS,
  todayLabel = '오늘',
  scrollNavigate = true, // 날짜 영역에서 휠 세로 스크롤로 이전/다음 달 이동
  // 범위 모드에서 날짜 hover 시 "시작일/마감일" 안내 툴팁(찍는 날짜가 무엇인지 인지용)
  rangeTooltip = true,
  rangeStartLabel = '시작일',
  rangeEndLabel = '마감일',
  minYear,          // 연도 선택 범위(미지정 시 표시 연도 ±12)
  maxYear,
  width = 276,
  className = '',
  ...props
}: any) {
  const today = startOfDay(new Date());

  // ── 선택값 (controlled/uncontrolled) ─────────────────────────
  const isRange = mode === 'range';
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(
    defaultValue ?? (isRange ? { start: null, end: null } : null),
  );
  const current = isControlled ? value : internalValue;
  const range = isRange ? current ?? { start: null, end: null } : null;
  const single = !isRange ? current ?? null : null;

  // 범위 모드 hover 안내 툴팁 — 호버한 셀 위에 "시작일/마감일"을 띄운다(포털, 클리핑 방지).
  const [hover, setHover] = useState(null); // { rect, label } | null
  const showRangeTooltip = isRange && rangeTooltip;

  const commit = (next) => {
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  };

  // ── 표시 월 (controlled/uncontrolled) ────────────────────────
  const initialMonth =
    defaultMonth ?? (isRange ? range?.start : single) ?? today;
  const [internalMonth, setInternalMonth] = useState(() => startOfDay(initialMonth));
  const viewDate = month ?? internalMonth;
  const setView = (next) => {
    if (month === undefined) setInternalMonth(next);
    onMonthChange?.(next);
  };

  // ── 선택 제한(비활성) 판정 ───────────────────────────────────
  const isDayDisabled = (date) => {
    const d = startOfDay(date);
    if (disablePast && d < today) return true;
    if (disableFuture && d > today) return true;
    if (minDate && d < startOfDay(minDate)) return true;
    if (maxDate && d > startOfDay(maxDate)) return true;
    return !!disabledDate && !!disabledDate(d);
  };

  // ── 날짜 클릭 ────────────────────────────────────────────────
  // 범위 클릭 규칙 — 완성된 범위는 풀리지 않고 한쪽만 이동한다:
  //   시작일 앞을 찍으면 시작일만 이동(마감 유지), 마감일 뒤를 찍으면 마감일만 이동(시작 유지),
  //   범위 안(시작~마감, 경계 포함)은 첫 클릭=시작일 이동, 두 번째 클릭=마감일 이동(교대).
  // 미완성(시작만) 상태는 기존대로 — 시작 앞을 찍으면 시작 재지정, 뒤를 찍으면 마감 확정.
  const insideNextRef = useRef('start'); // 범위 안 클릭이 다음에 잡을 쪽(교대 상태)
  const nextRange = (d) => {
    const { start, end } = range;
    if (!start) return { start: d, end: null };
    if (end) {
      if (d < start) return { start: d, end };
      if (d > end) return { start, end: d };
      return insideNextRef.current === 'start' ? { start: d, end } : { start, end: d };
    }
    if (d < start) return { start: d, end: null };
    return { start, end: d };
  };

  const handleDayClick = (date) => {
    if (isDayDisabled(date)) return; // 비활성 날짜는 무시
    const d = startOfDay(date);
    if (!isRange) {
      commit(d);
      return;
    }
    const { start, end } = range;
    const inside = !!(start && end) && d >= start && d <= end;
    commit(nextRange(d));
    // 교대 상태 갱신 — 범위 안 클릭이면 다음 쪽으로 토글, 그 외 클릭은 처음(시작)으로 리셋
    insideNextRef.current = inside && insideNextRef.current === 'start' ? 'end' : 'start';
  };

  // 이 날짜를 클릭하면 시작일을 잡는지 마감일을 잡는지 — nextRange와 동일한 분기.
  // r을 넘기면 그 범위 기준으로 판정(클릭 직후 다음 역할 계산용 — state 반영 전).
  const dayRole = (date, r = range) => {
    const d = startOfDay(date);
    const { start, end } = r;
    if (!start) return 'start';
    if (end) {
      if (d < start) return 'start';
      if (d > end) return 'end';
      return insideNextRef.current;
    }
    return d < start ? 'start' : 'end';
  };

  // ── 날짜 셀 상태 계산 ────────────────────────────────────────
  // 우선순위: 비활성(muted) → 선택/범위 → today → 이전·다음 달(muted) → default.
  //  - 비활성(disablePast 등) 날짜는 muted(선택 불가).
  //  - 선택 가능한 상태에서는 현재(표시) 달은 default, 이전/다음 달은 muted로 구분한다.
  //  → 차이: "이번 달 지난 날짜"가 선택 가능하면 default, disablePast면 muted가 된다.
  const dayState = (date) => {
    if (isDayDisabled(date)) return 'muted';
    if (isRange) {
      const { start, end } = range;
      const isStart = isSameDay(date, start);
      const isEnd = isSameDay(date, end);
      if (isStart && isEnd) return 'selected';
      if (isStart) return end ? 'range-start' : 'selected';
      if (isEnd) return 'range-end';
      if (start && end && date > start && date < end) return 'in-range';
    } else if (isSameDay(date, single)) {
      return 'selected';
    }
    if (isSameDay(date, today)) return 'today';
    if (monthKey(date) !== monthKey(viewDate)) return 'muted'; // 이전/다음 달
    return 'default';
  };

  // ── 연/월 옵션 ───────────────────────────────────────────────
  const viewYear = viewDate.getFullYear();
  const lo = Math.min(minYear ?? viewYear - 12, viewYear);
  const hi = Math.max(maxYear ?? viewYear + 12, viewYear);
  const yearOptions = Array.from({ length: hi - lo + 1 }, (_, i) => ({
    value: String(lo + i),
    label: `${lo + i}년`,
  }));
  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1),
    label: `${i + 1}월`,
  }));

  // ── 시/분 옵션 ── 값은 'HH'/'MM', 라벨은 "00시"/"00분"
  const hourOptions = Array.from({ length: 24 }, (_, i) => ({ value: pad2(i), label: `${pad2(i)}시` }));
  const minuteOptions = Array.from({ length: 60 }, (_, i) => ({ value: pad2(i), label: `${pad2(i)}분` }));

  // 정렬용 요일 라벨(weekStartsOn 반영)
  const weekdays = weekdayLabels.map((_, i) => weekdayLabels[(i + weekStartsOn) % 7]);
  const widthStyle = typeof width === 'number' ? `${width}px` : width;

  // 날짜 셀 1칸 — 정적 그리드/무한 스크롤이 공유한다.
  const renderDay = (date) => {
    const disabled = isDayDisabled(date);
    // 비활성 날짜는 안내 툴팁도 띄우지 않는다(선택 불가이므로 시작일/마감일 안내가 무의미).
    const tip = showRangeTooltip && !disabled;
    // 행 가장자리 칸(주 시작=왼쪽 끝·주 끝=오른쪽 끝) — 범위 띠가 줄에서 끊길 때 바깥 모서리를 둥글게
    const col = (date.getDay() - weekStartsOn + 7) % 7;
    const edge = col === 0 ? 'left' : col === 6 ? 'right' : undefined;
    return (
      <CalendarDayButton
        key={date.toISOString()}
        state={dayState(date)}
        edge={edge}
        disabled={disabled}
        onClick={(e) => {
          // dayRole은 range(범위)에서만 의미 있고 단일 모드에선 range가 null이라 호출 금지.
          // 클릭 직후의 다음 역할은 커밋될 범위(nextRange) 기준으로 계산한다(state 반영 전).
          const nr = tip && !disabled ? nextRange(startOfDay(date)) : null;
          handleDayClick(date);
          if (nr) {
            setHover({
              rect: e.currentTarget.getBoundingClientRect(),
              label: dayRole(date, nr) === 'start' ? rangeStartLabel : rangeEndLabel,
            });
          }
        }}
        onMouseEnter={
          tip
            ? (e) =>
                setHover({
                  rect: e.currentTarget.getBoundingClientRect(),
                  label: dayRole(date) === 'start' ? rangeStartLabel : rangeEndLabel,
                })
            : undefined
        }
        onMouseLeave={tip ? () => setHover(null) : undefined}
      >
        {dayLabel(date)}
      </CalendarDayButton>
    );
  };

  return (
    <div
      style={{ width: widthStyle }}
      className={`flex flex-col gap-spacing-1 overflow-hidden rounded-round-4 outline outline-1 outline-list-popover-outline bg-list-popover-bg shadow-[0px_2px_4px_0px_rgba(13,13,13,0.12)] ${className}`}
      {...props}
    >
      {/* 1) date area — 네비게이션 + 요일 헤더 */}
      <div className="flex w-full flex-col gap-spacing-5 bg-list-group-bg p-spacing-6">
        {/* navigation */}
        <div className="flex h-[32px] items-center justify-between pl-spacing-5">
          {/* 연.월 선택 (캘린더 아이콘 + selected-text → 연/월 2depth 목록) */}
          <DualSelectField
            icon={CalendarIcon}
            separator="."
            display={fmtYearMonth(viewDate)}
            inputValue={fmtYearMonth(viewDate)}
            inputPlaceholder="YYYY.MM"
            onInputApply={(t) => {
              const [ys, ms] = t.split('.');
              if (!/^(\d{2}|\d{4})$/.test(ys.trim()))
                return { error: 'left', message: '연도는 YYYY 형식으로 입력하세요 (예: 2026 · 26)' };
              const mo = Number(ms);
              if (ms.trim() === '' || Number.isNaN(mo) || mo < 1 || mo > 12)
                return { error: 'right', message: '월은 1~12로 입력하세요' };
              const yr = ys.trim().length === 2 ? 2000 + Number(ys) : Number(ys);
              const next = new Date(yr, mo - 1, 1);
              setView(next);
              return fmtYearMonth(next); // 정규화된 'YYYY.MM'
            }}
            leftOptions={yearOptions}
            leftValue={String(viewYear)}
            onLeftChange={(y) => setView(new Date(Number(y), viewDate.getMonth(), 1))}
            rightOptions={monthOptions}
            rightValue={String(viewDate.getMonth() + 1)}
            onRightChange={(m) => setView(new Date(viewYear, Number(m) - 1, 1))}
            maxVisible={5}
          />
          {/* 이전 / 오늘 / 다음 */}
          <ButtonGroup gap="3" className="shrink-0">
            <Button
              variant="ghost"
              size="24"
              icon={ChevronLeft}
              aria-label="이전 달"
              onClick={() => setView(addMonths(viewDate, -1))}
            />
            <Button variant="ghost" size="24" onClick={() => setView(startOfDay(new Date()))}>
              {todayLabel}
            </Button>
            <Button
              variant="ghost"
              size="24"
              icon={ChevronRight}
              aria-label="다음 달"
              onClick={() => setView(addMonths(viewDate, 1))}
            />
          </ButtonGroup>
        </div>
        {/* 요일 헤더 */}
        <div className="flex items-center">
          {weekdays.map((w) => (
            <div key={w} className="flex h-[24px] w-[36px] items-center justify-center">
              <span className="text-12 text-font-icon-5">{w}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2) calender area — scrollNavigate면 주 단위 무한 세로 스크롤(스크롤바·페이지처럼 연속 이동),
          아니면 표시 월의 정적 6주 그리드. */}
      {scrollNavigate ? (
        <CalendarScroller
          anchorMonth={viewDate}
          anchorKey={monthKey(viewDate)}
          weekStartsOn={weekStartsOn}
          onVisibleMonthChange={setView}
          renderDay={renderDay}
        />
      ) : (
        <div className="flex w-full flex-col gap-spacing-6 bg-list-group-bg p-spacing-6">
          {buildWeeks(viewDate, weekStartsOn).map((week, wi) => (
            <div key={wi} className="flex items-center">
              {week.map((date) => renderDay(date))}
            </div>
          ))}
        </div>
      )}

      {/* 3) time area — 시간 선택. 해당 날짜를 고르기 전엔 비활성.
          범위 모드=시작/마감 2칸, 단일 모드=시간 1칸(마감 시간 없음 — 값은 startTime 그대로 사용,
          DateField 단일 표기 "YY.MM.DD (HH:MM)"와 일치). */}
      {showTime &&
        (isRange ? (
          <div className="flex w-full gap-spacing-1">
            <TimeField
              label="시작 시간"
              value={startTime}
              onChange={onStartTimeChange}
              hourOptions={hourOptions}
              minuteOptions={minuteOptions}
              disabled={!range?.start}
            />
            <TimeField
              label="마감 시간"
              value={endTime}
              onChange={onEndTimeChange}
              hourOptions={hourOptions}
              minuteOptions={minuteOptions}
              disabled={!range?.end}
            />
          </div>
        ) : (
          <div className="flex w-full gap-spacing-1">
            <TimeField
              label={timeLabel}
              justify="between"
              value={startTime}
              onChange={onStartTimeChange}
              hourOptions={hourOptions}
              minuteOptions={minuteOptions}
              disabled={!single}
            />
          </div>
        ))}

      {/* 범위 hover 안내 툴팁 — 말줄임(TruncatingText)과 동일한 디자인(normal·beak 없음).
          포털(fixed)로 띄워 컨테이너 overflow-hidden에 잘리지 않게 하고, 셀 위 가운데 정렬한다. */}
      {showRangeTooltip &&
        hover &&
        createPortal(
          <div
            className="pointer-events-none z-[1000]"
            style={{
              position: 'fixed',
              left: hover.rect.left + hover.rect.width / 2,
              top: hover.rect.top - 6,
              transform: 'translate(-50%, -100%)',
            }}
          >
            <Tooltip variant="normal" beak="none">
              {hover.label}
            </Tooltip>
          </div>,
          document.body,
        )}
    </div>
  );
}
