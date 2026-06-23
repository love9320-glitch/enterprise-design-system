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
const parseYearMonth = (t) => {
  const s = String(t).trim();
  const sep = s.match(/^(\d{2}|\d{4})\D+(\d{1,2})$/); // 구분자 있음
  const ym6 = s.match(/^(\d{4})(\d{2})$/);            // YYYYMM
  const ym4 = s.match(/^(\d{2})(\d{2})$/);            // YYMM
  let year;
  let mo;
  if (sep) {
    year = sep[1].length === 2 ? 2000 + Number(sep[1]) : Number(sep[1]);
    mo = Number(sep[2]);
  } else if (ym6) {
    year = Number(ym6[1]);
    mo = Number(ym6[2]);
  } else if (ym4) {
    year = 2000 + Number(ym4[1]);
    mo = Number(ym4[2]);
  } else {
    return null;
  }
  if (mo < 1 || mo > 12) return null;
  return { year, month: mo - 1 };
};
// 직접 입력 파싱 — 시:분. 구분자 있으면 시/분 1~2자리(예: "12:34" · "1:1"),
//   구분자 없으면 HMM(3자리)·HHMM(4자리)로 보고 끝 2자리를 분으로(예: "0105"→01:05, "1250"→12:50).
const parseTime = (t) => {
  const s = String(t).trim();
  const m = s.match(/^(\d{1,2}):(\d{1,2})$/) || s.match(/^(\d{1,2})(\d{2})$/);
  if (!m) return null;
  const h = Number(m[1]);
  const mn = Number(m[2]);
  if (h > 23 || mn > 59) return null;
  return `${pad2(h)}:${pad2(mn)}`;
};

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
const VISIBLE_HEIGHT = 6 * 24 + 5 * 12; // 6주 = 204px
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
function CalendarScroller({ anchorMonth, anchorKey, weekStartsOn, onVisibleMonthChange, renderDay }) {
  const vpRef = useRef(null);
  const setVp = useCallback((el) => {
    vpRef.current = el;
  }, []);
  const [weeks, setWeeks] = useState(() => buildWindow(anchorMonth, weekStartsOn));
  const lastKeyRef = useRef(anchorKey); // 마지막으로 헤더에 보고/반영한 달
  const adjustRef = useRef('anchor');   // 다음 레이아웃에서 scrollTop 보정: 'anchor' | px(number) | 0
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
    if (adjustRef.current === 'anchor') el.scrollTop = WIN_BEFORE * ROW_UNIT;
    else if (adjustRef.current) el.scrollTop += adjustRef.current;
    adjustRef.current = 0;
    busyRef.current = false;
  }, [weeks]);

  const handleScroll = () => {
    const el = vpRef.current;
    if (!el) return;
    // 보이는 중앙 주의 목요일이 속한 달을 현재 달로 본다
    const idx = Math.min(Math.max(Math.floor((el.scrollTop + el.clientHeight / 2) / ROW_UNIT), 0), weeks.length - 1);
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
      contentClassName="flex select-none flex-col gap-spacing-6 overscroll-contain px-spacing-6"
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
function DualSelectField({ icon: Icon, display, panelWidth = 201, placement = 'bottom-left', disabled = false, ...panelProps }) {
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
function TimeField({ label, value, onChange, hourOptions, minuteOptions, placement = 'top-right', disabled = false }) {
  const [hh = '00', mm = '00'] = (value || '').split(':');
  const set = (h, m) => onChange?.(`${h}:${m}`);
  return (
    <div className="flex h-[44px] flex-1 items-center justify-center gap-spacing-6 bg-list-group-bg px-spacing-6 py-spacing-5">
      <span className={`whitespace-nowrap text-12 ${disabled ? 'text-font-icon-2' : 'text-font-icon-5'}`}>{label}</span>
      <DualSelectField
        disabled={disabled}
        placement={placement}
        display={`${hh}:${mm}`}
        inputValue={`${hh}:${mm}`}
        inputPlaceholder="HH:MM"
        errorMessage="HH:MM 형식으로 입력하세요 (예: 1:1 · 0105)"
        allowedChars={/[\d:]/}
        onInputApply={(t) => {
          const v = parseTime(t); // 정규화된 'HH:MM' 또는 null
          if (!v) return null;
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
  showTime = false, // 하단 시작/마감 시간 영역 표시
  startTime = '00:00',
  endTime = '23:59',
  onStartTimeChange,
  onEndTimeChange,
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
}) {
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
  const handleDayClick = (date) => {
    if (isDayDisabled(date)) return; // 비활성 날짜는 무시
    const d = startOfDay(date);
    if (!isRange) {
      commit(d);
      return;
    }
    const { start, end } = range;
    // 시작 없음 또는 이미 범위 완성 → 새 범위 시작
    if (!start || (start && end)) {
      commit({ start: d, end: null });
    } else if (d < start) {
      // 시작보다 앞을 누르면 시작을 다시 잡는다
      commit({ start: d, end: null });
    } else {
      commit({ start, end: d });
    }
  };

  // 이 날짜를 클릭하면 시작일을 잡는지(end) 마감일을 잡는지 — handleDayClick과 동일한 분기.
  const dayRole = (date) => {
    const d = startOfDay(date);
    const { start, end } = range;
    if (!start || (start && end) || d < start) return 'start';
    return 'end';
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
    return (
      <CalendarDayButton
        key={date.toISOString()}
        state={dayState(date)}
        disabled={disabled}
        onClick={(e) => {
          // dayRole은 range(범위)에서만 의미 있고 단일 모드에선 range가 null이라 호출 금지.
          const wasStart = tip && dayRole(date) === 'start';
          handleDayClick(date);
          // 클릭 후 같은 셀의 다음 역할로 라벨 갱신(시작 찍으면 곧장 "마감일"로)
          if (tip) {
            setHover({
              rect: e.currentTarget.getBoundingClientRect(),
              label: wasStart ? rangeEndLabel : rangeStartLabel,
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
            placement="bottom-left"
            display={fmtYearMonth(viewDate)}
            inputValue={fmtYearMonth(viewDate)}
            inputPlaceholder="YYYY.MM"
            errorMessage="YYYY.MM 형식으로 입력하세요 (예: 25.3 · 2505)"
            allowedChars={/[\d.]/}
            onInputApply={(t) => {
              const p = parseYearMonth(t);
              if (!p) return null;
              const next = new Date(p.year, p.month, 1);
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

      {/* 3) time area — 시작/마감 시간. 해당 날짜(시작일/마감일)를 고르기 전엔 비활성. */}
      {showTime && (
        <div className="flex w-full gap-spacing-1">
          <TimeField
            label="시작 시간"
            placement="top-left"
            value={startTime}
            onChange={onStartTimeChange}
            hourOptions={hourOptions}
            minuteOptions={minuteOptions}
            disabled={!(isRange ? range?.start : single)}
          />
          <TimeField
            label="마감 시간"
            placement="top-right"
            value={endTime}
            onChange={onEndTimeChange}
            hourOptions={hourOptions}
            minuteOptions={minuteOptions}
            disabled={!(isRange ? range?.end : single)}
          />
        </div>
      )}

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
