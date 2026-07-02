import { useState } from 'react';
import { DatePicker } from '../components/DatePicker';
import { CalendarDayButton } from '../components/CalendarDayButton';
import { TwoDepthList } from '../components/TwoDepthList';
import { DateField } from '../components/DateField';
import { TimeField } from '../components/TimeField';
import { Checkbox } from '../components/Checkbox';
import { UsageExample } from '../components/UsageExample';
import { formatDateTimeRange } from '../utils/datetime';
import { Divider } from '../components/Divider';

const USAGE = `import { DateField } from '../components/DateField';
import { DatePicker } from '../components/DatePicker';

// DateField — 트리거 필드(클릭 시 DatePicker 팝오버). 값 표기는 utils/datetime 규칙으로 통일.
<DateField value={date} onChange={setDate} />                       // 단일
<DateField mode="range" value={range} onChange={setRange} />        // 범위
<DateField mode="range" showTime value={range} onChange={setRange}  // 범위+시간
  startTime={s} onStartTimeChange={setS} endTime={e} onEndTimeChange={setE} />
<DateField disabled /> · <DateField readOnly defaultValue={today} />
<DateField error errorMessage="날짜를 선택하세요" />

// DatePicker — 패널 단독(트리거에 직접 붙이려면 Popover로 감싸거나 DateField 사용)
// 단일 날짜 — value=Date | null
const [date, setDate] = useState(null);
<DatePicker value={date} onChange={setDate} />

// 범위 선택 — value={ start, end }
const [range, setRange] = useState({ start: null, end: null });
<DatePicker mode="range" value={range} onChange={setRange} />

// 지나간 날짜 선택 불가 (오늘은 가능) — minDate/maxDate/disabledDate도 지원
<DatePicker value={date} onChange={setDate} disablePast />

// 시간 포함 — 하단 시작/마감 시간(시:분 2depth 목록)
const [s, setS] = useState('00:00');
const [e, setE] = useState('23:59');
<DatePicker mode="range" showTime
  startTime={s} onStartTimeChange={setS}
  endTime={e} onEndTimeChange={setE} />

// 트리거(버튼 등)에 붙이려면 Popover로 감싼다
<Popover placement="bottom-left"
  trigger={<Button variant="line" rightIcon={ChevronDown}>날짜 선택</Button>}>
  <DatePicker value={date} onChange={setDate} />
</Popover>

// 빌딩 블록 — 날짜 셀(7가지 상태)
<CalendarDayButton state="selected">13</CalendarDayButton>

// TwoDepthList — 입력 영역 + 좌/우 2컬럼(연/월·시/분 등). 상단 input은 직접 입력 가능.
// onInputApply: 타이핑 텍스트를 파싱해 좌/우 값에 라이브 반영하고, 정규화 문자열을 반환(틀리면 null)
//   → 반환 문자열로 blur 시 표시값 보정 · null이면 errorMessage 툴팁 표시
<TwoDepthList separator="." inputValue="2025.07"  // 좌/우 분리 인풋 + '.' 구분자(아래 정렬)
  onInputApply={(t) => {                            // 합성 문자열('2026.7') 파싱은 호출부가
    const [ys, ms] = t.split('.');
    if (!/^(\\d{2}|\\d{4})$/.test(ys)) return { error: 'left', message: '연도는 YYYY 형식으로 입력하세요' };
    if (+ms < 1 || +ms > 12) return { error: 'right', message: '월은 1~12로 입력하세요' };
    const yyyy = ys.length === 2 ? String(2000 + +ys) : ys;
    setY(yyyy); setMo(ms);
    return yyyy + '.' + ms.padStart(2, '0');        // 정규화 성공 / 실패 시 {error:파트, message}
  }}
  leftOptions={years}  leftValue={y}  onLeftChange={setY}
  rightOptions={months} rightValue={m} onRightChange={setMo} />`;

const USAGE_PROPS = [
  // DateField
  { name: 'DateField · mode', type: "'single' | 'range'", default: "'single'", desc: '단일 / 범위' },
  { name: 'DateField · value / defaultValue / onChange', type: 'Date | {start,end}', default: '—', desc: '선택값(DatePicker와 동일 형태)' },
  { name: 'DateField · showTime', type: 'boolean', default: 'false', desc: '시간 포함(표시 + 팝오버 시간 영역)' },
  { name: 'DateField · startTime / endTime (+onChange)', type: "'HH:MM'", default: "'00:00' / '23:59'", desc: '시간 값(controlled/uncontrolled)' },
  { name: 'DateField · placeholder', type: 'string', default: "'날짜를 선택하세요'", desc: '값 없을 때 표시' },
  { name: 'DateField · disabled / readOnly', type: 'boolean', default: 'false', desc: '비활성 / 읽기전용(클릭으로 안 열림)' },
  { name: 'DateField · error / errorMessage', type: 'boolean / string', default: 'false / —', desc: '에러 상태 + 필드 아래 툴팁' },
  { name: 'DateField · (직접 입력)', type: '—', default: '—', desc: '타이핑 후 Enter/blur로 파싱·정규화. 날짜: 250520·20250520·0520(올해)·25.05.20 / 시간(공백 뒤): 00:10·0010·011. 숫자·구분자·괄호만 입력 가능. 범위 시작만 입력 시 "마감일 없음"' },
  { name: 'DateField · formatErrorMessage', type: 'string', default: "'날짜 형식이 올바르지 않습니다.'", desc: '직접 입력 형식 오류 툴팁' },
  { name: 'DateField · closeOnSelect', type: 'boolean', default: 'true', desc: '선택 완료 시 자동 닫기(showTime이면 유지)' },
  { name: 'DateField · width', type: "'hug' | 'fill' | number | string", default: 'showTime?260:180', desc: "콘텐츠 폭(hug)/부모 100%(fill)/고정. 미지정 시 시간 포함=260·아니면 180. 좁으면 말줄임(…)" },
  { name: 'DateField · (disablePast/minDate/maxDate/disabledDate/weekStartsOn/minYear/maxYear)', type: '—', default: '—', desc: 'DatePicker로 패스스루' },
  // DatePicker
  { name: 'DatePicker · mode', type: "'single' | 'range'", default: "'single'", desc: '단일 날짜 / 시작~끝 범위 선택' },
  { name: 'DatePicker · value', type: 'Date | {start,end}', default: '—', desc: 'controlled 선택값(mode에 따라 형태)' },
  { name: 'DatePicker · defaultValue', type: 'Date | {start,end}', default: '—', desc: 'uncontrolled 초기 선택값' },
  { name: 'DatePicker · onChange', type: '(next) => void', default: '—', desc: '선택 변경(next=Date 또는 {start,end})' },
  { name: 'DatePicker · disablePast', type: 'boolean', default: 'false', desc: '오늘 이전(지나간) 날짜 선택 불가(오늘은 선택 가능)' },
  { name: 'DatePicker · disableFuture', type: 'boolean', default: 'false', desc: '오늘 이후(미래) 날짜 선택 불가(오늘은 선택 가능)' },
  { name: 'DatePicker · minDate / maxDate', type: 'Date', default: '—', desc: '이 날짜 이전/이후 비활성' },
  { name: 'DatePicker · disabledDate', type: '(date) => boolean', default: '—', desc: '커스텀 비활성 판정(주말 차단 등)' },
  { name: 'DatePicker · month', type: 'Date', default: '—', desc: '표시 월(controlled)' },
  { name: 'DatePicker · defaultMonth', type: 'Date', default: '선택값/오늘', desc: 'uncontrolled 초기 표시 월' },
  { name: 'DatePicker · onMonthChange', type: '(date) => void', default: '—', desc: '표시 월 변경(이전/다음/오늘·연월 선택)' },
  { name: 'DatePicker · showTime', type: 'boolean', default: 'false', desc: '하단 시간 영역 — 범위=시작/마감 2칸 · 단일=시간 1칸(startTime 사용, 마감 없음)' },
  { name: 'DatePicker · startTime / endTime', type: "'HH:MM'", default: "'00:00' / '23:59'", desc: '시간 값' },
  { name: 'DatePicker · onStartTimeChange / onEndTimeChange', type: '(hhmm) => void', default: '—', desc: '시간 변경' },
  { name: 'DatePicker · rangeTooltip', type: 'boolean', default: 'true', desc: '범위 모드에서 날짜 hover 시 "시작일/마감일" 안내 툴팁' },
  { name: 'DatePicker · rangeStartLabel / rangeEndLabel', type: 'string', default: "'시작일' / '마감일'", desc: '안내 툴팁 문구' },
  { name: 'DatePicker · scrollNavigate', type: 'boolean', default: 'true', desc: '날짜 영역을 스크롤바로 주 단위 무한 세로 스크롤(페이지처럼 연속 이동) — false면 정적 6주 그리드' },
  { name: 'DatePicker · weekStartsOn', type: '0~6', default: '0', desc: '주 시작 요일(0=일요일)' },
  { name: 'DatePicker · minYear / maxYear', type: 'number', default: '표시 연도 ±12', desc: '연도 선택 범위' },
  { name: 'DatePicker · width', type: 'number | string', default: '276', desc: '팝오버 너비' },
  // CalendarDayButton
  { name: 'CalendarDayButton · state', type: "'default'|'muted'|'today'|'selected'|'range-start'|'range-end'|'in-range'", default: "'default'", desc: '날짜 셀 상태' },
  { name: 'CalendarDayButton · disabled', type: 'boolean', default: 'false', desc: '비활성(클릭 차단)' },
  { name: 'CalendarDayButton · onClick', type: '() => void', default: '—', desc: '셀 클릭' },
  // TwoDepthList
  { name: 'TwoDepthList · inputValue', type: 'string', default: "''", desc: '상단 입력 영역 현재 값(합성 문자열: 2026.7·01:23) — 구분자로 쪼개 좌/우 인풋에 표시' },
  { name: 'TwoDepthList · separator', type: 'string', default: "':'", desc: "좌/우 분리 인풋 사이 구분자 표시·합성 기준 — 연/월 '.' · 시/분 ':'(아래 정렬)" },
  { name: 'TwoDepthList · editable', type: 'boolean', default: 'true', desc: '상단 input 직접 입력 허용(false면 readOnly로 값만 표시)' },
  { name: 'TwoDepthList · onInputApply', type: "(text) => string | null | {error:'left'|'right', message?}", default: '—', desc: '합성 텍스트로 좌/우 값 적용(파싱은 호출부). 성공=정규화 문자열, 실패={error:파트, message} — 해당 인풋 아래에 그 문구로 툴팁' },
  { name: 'TwoDepthList · errorMessage', type: 'string', default: "'형식이 올바르지 않습니다.'", desc: '직접 입력 형식 오류 시 툴팁 메시지' },
  { name: 'TwoDepthList · allowedChars', type: 'RegExp | null', default: '/\\d/', desc: '파트 입력 허용 문자(문자 1개씩 test) — 기본 숫자만(구분자는 UI가 표시), null이면 제한 없음' },
  { name: 'TwoDepthList · onInputChange', type: '(e) => void', default: '—', desc: '입력 변경 raw 이벤트(선택)' },
  { name: 'TwoDepthList · leftOptions / rightOptions', type: '{value,label,disabled?}[]', default: '[]', desc: '좌/우 컬럼 옵션' },
  { name: 'TwoDepthList · leftValue / rightValue', type: 'string', default: '—', desc: '좌/우 선택값' },
  { name: 'TwoDepthList · onLeftChange / onRightChange', type: '(value) => void', default: '—', desc: '좌/우 선택 변경' },
  { name: 'TwoDepthList · maxVisible', type: 'number', default: '5', desc: '각 컬럼 표시 행 수(초과 시 내부 스크롤)' },
  { name: 'TwoDepthList · width', type: 'number | string', default: '201', desc: '팝오버 너비' },
];

const DAY_STATES = [
  { state: 'default', label: 'default — 이번 달 날짜', text: '3' },
  { state: 'muted', label: 'muted — 이전/다음 달·선택 불가', text: '30' },
  { state: 'today', label: 'today — 오늘', text: '2' },
  { state: 'selected', label: 'selected — 단일 선택', text: '13' },
  { state: 'range-start', label: 'range-start — 범위 시작', text: '13' },
  { state: 'in-range', label: 'in-range — 범위 안', text: '14' },
  { state: 'range-end', label: 'range-end — 범위 끝', text: '18' },
];

const YEARS = Array.from({ length: 9 }, (_, i) => ({ value: String(2024 + i), label: `${2024 + i}년` }));
const MONTHS = Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: `${i + 1}월` }));
const HOURS = Array.from({ length: 24 }, (_, i) => ({ value: String(i).padStart(2, '0'), label: `${String(i).padStart(2, '0')}시` }));
const MINUTES = Array.from({ length: 60 }, (_, i) => ({ value: String(i).padStart(2, '0'), label: `${String(i).padStart(2, '0')}분` }));

function SectionTitle({ children }) {
  return <h3 className="mb-spacing-5 text-15 font-semibold text-font-icon-5">{children}</h3>;
}

function DateFieldDemo() {
  const [date, setDate] = useState(null);
  const [range, setRange] = useState({ start: null, end: null });
  const [rangeT, setRangeT] = useState({ start: null, end: null });
  const [s, setS] = useState('00:00');
  const [e, setE] = useState('23:59');
  const [dateT, setDateT] = useState(null); // 단일 + 시간
  const [st, setSt] = useState('09:00');
  const [pastRange, setPastRange] = useState({ start: null, end: null });
  const [errDate, setErrDate] = useState(null); // 값 없을 때만 에러 → 선택 시 툴팁 사라짐
  return (
    <div className="flex flex-col gap-spacing-8">
      <div className="flex flex-wrap items-start gap-spacing-9">
        <div>
          <p className="mb-spacing-4 text-12 text-font-icon-3">단일 (single)</p>
          <DateField value={date} onChange={setDate} />
        </div>
        <div>
          <p className="mb-spacing-4 text-12 text-font-icon-3">범위 (range)</p>
          <DateField mode="range" value={range} onChange={setRange} />
        </div>
        <div>
          <p className="mb-spacing-4 text-12 text-font-icon-3">단일 + 시간 (showTime — 시간 1칸)</p>
          <DateField
            showTime
            value={dateT}
            onChange={setDateT}
            startTime={st}
            onStartTimeChange={setSt}
          />
        </div>
        <div>
          <p className="mb-spacing-4 text-12 text-font-icon-3">범위 + 시간 (showTime)</p>
          <DateField
            mode="range"
            showTime
            value={rangeT}
            onChange={setRangeT}
            startTime={s}
            onStartTimeChange={setS}
            endTime={e}
            onEndTimeChange={setE}
          />
        </div>
        <div>
          <p className="mb-spacing-4 text-12 text-font-icon-3">지난날 선택 불가 (disablePast)</p>
          <DateField mode="range" disablePast value={pastRange} onChange={setPastRange} />
        </div>
      </div>
      <div className="flex flex-wrap items-start gap-spacing-9">
        <div>
          <p className="mb-spacing-4 text-12 text-font-icon-3">disabled</p>
          <DateField disabled />
        </div>
        <div>
          <p className="mb-spacing-4 text-12 text-font-icon-3">readOnly (값 표시)</p>
          <DateField readOnly defaultValue={new Date()} />
        </div>
        <div>
          <p className="mb-spacing-4 text-12 text-font-icon-3">error (선택 시 사라짐)</p>
          <DateField
            value={errDate}
            onChange={setErrDate}
            error={!errDate}
            errorMessage="날짜를 선택하세요"
          />
        </div>
      </div>
      <div className="flex flex-wrap items-start gap-spacing-9">
        <div>
          <p className="mb-spacing-4 text-12 text-font-icon-3">width="hug" (콘텐츠 폭)</p>
          <DateField
            mode="range"
            width="hug"
            defaultValue={{ start: new Date(2025, 4, 20), end: new Date(2025, 4, 25) }}
          />
        </div>
        <div className="w-[320px]">
          <p className="mb-spacing-4 text-12 text-font-icon-3">width="fill" (부모 320px 전체)</p>
          <DateField mode="range" width="fill" />
        </div>
        <div>
          <p className="mb-spacing-4 text-12 text-font-icon-3">작은 폭 140px (말줄임)</p>
          <DateField
            mode="range"
            showTime
            width={140}
            defaultValue={{ start: new Date(2025, 4, 20), end: new Date(2025, 4, 25) }}
          />
        </div>
      </div>
    </div>
  );
}

function TimeFieldDemo() {
  const [t1, setT1] = useState(null);
  const [t2, setT2] = useState('09:00');
  const [errTime, setErrTime] = useState(null); // 값 없을 때만 에러 → 선택 시 사라짐
  return (
    <div className="flex flex-wrap items-start gap-spacing-9">
      <div>
        <p className="mb-spacing-4 text-12 text-font-icon-3">기본 (비어있음)</p>
        <TimeField value={t1} onChange={setT1} />
        <p className="mt-spacing-4 text-13 text-font-icon-4">값: <span className="text-font-icon-5">{t1 || '—'}</span></p>
      </div>
      <div>
        <p className="mb-spacing-4 text-12 text-font-icon-3">값 있음</p>
        <TimeField value={t2} onChange={setT2} />
      </div>
      <div>
        <p className="mb-spacing-4 text-12 text-font-icon-3">disabled</p>
        <TimeField disabled />
      </div>
      <div>
        <p className="mb-spacing-4 text-12 text-font-icon-3">readOnly</p>
        <TimeField readOnly defaultValue="14:30" />
      </div>
      <div>
        <p className="mb-spacing-4 text-12 text-font-icon-3">error (선택 시 사라짐)</p>
        <TimeField value={errTime} onChange={setErrTime} error={!errTime} errorMessage="시간을 선택하세요" />
      </div>
    </div>
  );
}

// DatePicker Playground — 체크박스로 팝오버 옵션(요소)을 끄고 켜며 실시간 확인.
function DatePickerPlayground() {
  const [opts, setOpts] = useState({
    range: true, // 범위 선택(off면 단일)
    showTime: true, // 하단 시간 영역
    disablePast: false, // 지난날 비활성
    disableFuture: false, // 미래일 비활성
    scrollNavigate: true, // 무한 스크롤
    rangeTooltip: true, // 시작/마감 hover 툴팁(range 전용)
  });
  const toggle = (k) => setOpts((o) => ({ ...o, [k]: !o[k] }));

  const [date, setDate] = useState(null);
  const [range, setRange] = useState({ start: null, end: null });
  const [s, setS] = useState('00:00');
  const [e, setE] = useState('23:59');

  const result = opts.range
    ? range.start
      ? formatDateTimeRange(range.start, opts.showTime ? s : undefined, range.end, opts.showTime ? e : undefined)
      : '—'
    : date
      ? `${String(date.getFullYear() % 100).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}${opts.showTime ? ` (${s})` : ''}`
      : '—';

  return (
    <div>
      <div className="mb-spacing-7 rounded-round-4 border border-base-gray-100 px-spacing-7 py-spacing-6">
        <div className="flex min-h-[32px] flex-wrap items-center gap-x-spacing-7 gap-y-spacing-4 whitespace-nowrap">
          <Checkbox checked={opts.range} onChange={() => toggle('range')} label="범위 선택(range)" />
          <Checkbox checked={opts.showTime} onChange={() => toggle('showTime')} label="시간 포함(showTime)" />
          <Checkbox checked={opts.disablePast} onChange={() => toggle('disablePast')} label="과거 비활성(disablePast)" />
          <Checkbox checked={opts.disableFuture} onChange={() => toggle('disableFuture')} label="미래 비활성(disableFuture)" />
          <Checkbox checked={opts.scrollNavigate} onChange={() => toggle('scrollNavigate')} label="무한 스크롤(scrollNavigate)" />
          <Checkbox
            checked={opts.rangeTooltip}
            onChange={() => toggle('rangeTooltip')}
            disabled={!opts.range}
            label="시작/마감 툴팁(rangeTooltip)"
          />
        </div>
      </div>
      <div className="flex flex-wrap items-start gap-spacing-9">
        <DatePicker
          mode={opts.range ? 'range' : 'single'}
          value={opts.range ? range : date}
          onChange={opts.range ? setRange : setDate}
          showTime={opts.showTime}
          startTime={s}
          onStartTimeChange={setS}
          endTime={e}
          onEndTimeChange={setE}
          disablePast={opts.disablePast}
          disableFuture={opts.disableFuture}
          scrollNavigate={opts.scrollNavigate}
          rangeTooltip={opts.rangeTooltip}
        />
        <p className="text-13 text-font-icon-4">
          선택: <span className="text-font-icon-5">{result}</span>
        </p>
      </div>
    </div>
  );
}

function YearMonthDemo({ showInput = true }) {
  const [y, setY] = useState('2026');
  const [m, setM] = useState('7');
  return (
    <TwoDepthList
      showInput={showInput}
      separator="."
      inputValue={`${y}.${String(m).padStart(2, '0')}`}
      inputPlaceholder="YYYY.MM"
      onInputApply={(t) => {
        const [ys, ms] = t.split('.');
        if (!/^(\d{2}|\d{4})$/.test(ys.trim()))
          return { error: 'left', message: '연도는 YYYY 형식으로 입력하세요 (예: 2026 · 26)' };
        const mo = Number(ms);
        if (ms.trim() === '' || Number.isNaN(mo) || mo < 1 || mo > 12)
          return { error: 'right', message: '월은 1~12로 입력하세요' };
        const yyyy = ys.trim().length === 2 ? String(2000 + Number(ys)) : ys.trim();
        setY(yyyy);
        setM(String(mo));
        return `${yyyy}.${String(mo).padStart(2, '0')}`;
      }}
      leftOptions={YEARS}
      leftValue={y}
      onLeftChange={setY}
      rightOptions={MONTHS}
      rightValue={m}
      onRightChange={setM}
    />
  );
}

function TimeListDemo({ showInput = true }) {
  const [h, setH] = useState('01');
  const [min, setMin] = useState('23');
  return (
    <TwoDepthList
      showInput={showInput}
      inputValue={`${h}:${min}`}
      inputPlaceholder="HH:MM"
      onInputApply={(t) => {
        const [hs, ms] = t.split(':');
        const hh = Number(hs);
        const mm = Number(ms);
        if (hs.trim() === '' || Number.isNaN(hh) || hh > 23)
          return { error: 'left', message: '시는 0~23으로 입력하세요' };
        if (ms.trim() === '' || Number.isNaN(mm) || mm > 59)
          return { error: 'right', message: '분은 0~59로 입력하세요' };
        const HH = String(hh).padStart(2, '0');
        const MM = String(mm).padStart(2, '0');
        setH(HH);
        setMin(MM);
        return `${HH}:${MM}`;
      }}
      leftOptions={HOURS}
      leftValue={h}
      onLeftChange={setH}
      rightOptions={MINUTES}
      rightValue={min}
      onRightChange={setMin}
    />
  );
}

export function DatePickerPage() {
  return (
    <section className="mx-auto max-w-5xl px-spacing-7 py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-20 font-semibold text-font-icon-5">Date Picker</h2>
      <p className="mb-spacing-8 text-14 text-font-icon-4">
        캘린더 날짜 선택 시스템 — DateField(트리거 필드) · DatePicker(단일/범위 · 시간 포함) ·
        CalendarDayButton(날짜 셀) · TwoDepthList(연/월·시/분 2depth 목록). 연.월과 시간은 TwoDepthList를 Popover로 띄워 고릅니다.<br />
        색상은 모두 cal · list 시멘틱 토큰(base 경유)을 사용합니다.
      </p>

      <UsageExample code={USAGE} props={USAGE_PROPS} note="DateField · DatePicker · CalendarDayButton · TwoDepthList의 주요 옵션을 한 표에 모았습니다." />

      {/* DateField — 트리거 필드 */}
      <div className="mb-spacing-9">
        <SectionTitle>DateField — DatePicker 트리거 필드</SectionTitle>
        <p className="mb-spacing-5 text-12 text-font-icon-4">
          캘린더 아이콘 + 선택값(또는 플레이스홀더)을 보여주는 필드로, 클릭하면 DatePicker 팝오버가 열립니다.
          입력칸에 <code className="text-font-icon-5">직접 타이핑</code>도 가능합니다 — <code className="text-font-icon-5">Enter</code> 또는 포커스 아웃 시 파싱해 반영합니다.
          값 표기/입력은 규칙(<code className="text-font-icon-5">YY.MM.DD (HH:MM)~…</code>)을 따르고,
          <strong>범위에서 마감일을 안 적고 확정하면</strong>(시작만 입력) <code className="text-font-icon-5">마감일 없음</code>으로 표시됩니다.
          <code className="text-font-icon-5">disabled·readOnly·error</code> 상태 지원(에러는 필드 아래 툴팁).
        </p>
        <DateFieldDemo />
      </div>

      {/* TimeField — 시간 트리거 필드 */}
      <Divider className="mt-spacing-9 mb-spacing-8" />
      <div>
        <SectionTitle>TimeField — 시간 트리거 필드</SectionTitle>
        <p className="mb-spacing-5 text-12 text-font-icon-4">
          DateField와 같은 형식의 시간 버전. 누르면 <strong>인풋 영역 없는</strong> 시/분 2depth 목록이 열립니다.
          입력칸에 <code className="text-font-icon-5">12:34</code>·<code className="text-font-icon-5">1230</code>·<code className="text-font-icon-5">011</code>처럼
          직접 타이핑 후 Enter/포커스 아웃하면 <code className="text-font-icon-5">HH:MM</code>으로 정규화됩니다(숫자·콜론만 입력).
        </p>
        <TimeFieldDemo />
      </div>

      {/* DatePicker — Playground */}
      <Divider className="mt-spacing-9 mb-spacing-8" />
      <div>
        <SectionTitle>DatePicker — Playground (요소 끄고 켜기)</SectionTitle>
        <p className="mb-spacing-5 text-12 text-font-icon-4">
          체크박스로 DatePicker 팝오버의 옵션(<code className="text-font-icon-5">range·showTime·disablePast·scrollNavigate·rangeTooltip</code>)을
          실시간으로 켜고 끄며 동작을 확인하세요. 모두 개별 props라 자유롭게 조합됩니다(시작/마감 툴팁은 범위 모드 전용).
        </p>
        <DatePickerPlayground />
      </div>

      {/* CalendarDayButton 상태 */}
      <Divider className="mt-spacing-9 mb-spacing-8" />
      <div>
        <SectionTitle>CalendarDayButton — 7가지 상태</SectionTitle>
        <p className="mb-spacing-7 text-12 text-font-icon-4">
          날짜 한 칸의 상태별 모습. 범위 상태(range-start/in-range/range-end)는 좌/우 반쪽 배경으로 끊김 없이 이어집니다.
        </p>
        <div className="flex flex-wrap items-start gap-spacing-8">
          {DAY_STATES.map((d) => (
            <div key={d.state} className="flex flex-col items-center gap-spacing-4">
              <CalendarDayButton state={d.state}>{d.text}</CalendarDayButton>
              <span className="text-12 text-font-icon-3">{d.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* TwoDepthList */}
      <Divider className="mt-spacing-9 mb-spacing-8" />
      <div>
        <SectionTitle>TwoDepthList — 연/월 · 시/분</SectionTitle>
        <p className="mb-spacing-7 text-12 text-font-icon-4">
          상단 입력 영역 + 좌/우 2개 컬럼 목록. 같은 구조로 연/월(year_month, 폭 160)·시/분(time, 폭 140)에 공용으로 씁니다.
          상단 입력은 <code className="text-font-icon-5">좌/우 분리 인풋</code>이고 사이에 구분자
          (<code className="text-font-icon-5">separator</code> — 연/월 <code className="text-font-icon-5">.</code> · 시/분 <code className="text-font-icon-5">:</code>, 아래 정렬)를 둡니다.
          선택 행은 파란 텍스트로 표시되고, 열릴 때 선택값으로 자동 스크롤됩니다.
          <code className="text-font-icon-5">showInput={'{false}'}</code>로 상단 입력 영역을 빼고 컬럼만 둘 수도 있습니다(트리거가 따로 입력을 가질 때).
          각 인풋에 <code className="text-font-icon-5">직접 입력</code>도 가능합니다 — 연도 <code className="text-font-icon-5">2026</code>·<code className="text-font-icon-5">26</code>, 월 <code className="text-font-icon-5">1~12</code>,
          시 <code className="text-font-icon-5">0~23</code>, 분 <code className="text-font-icon-5">0~59</code>. 입력은 <code className="text-font-icon-5">숫자만</code> 받습니다(구분자는 UI가 표시).
          타이핑하는 즉시 적용(라이브)되고, 표시값 정규화는 <code className="text-font-icon-5">Enter</code>·포커스 아웃 시점에 합니다(포커스 시 전체 선택돼 덮어쓰기 쉬움).
          형식이 틀리면 <code className="text-font-icon-5">틀린 인풋 아래에</code> 그 파트에 맞는 문구로 에러 툴팁이 뜹니다.
        </p>
        <div className="flex flex-wrap items-start gap-spacing-9">
          <div>
            <p className="mb-spacing-4 text-12 text-font-icon-3">year_month — 연/월</p>
            <YearMonthDemo />
          </div>
          <div>
            <p className="mb-spacing-4 text-12 text-font-icon-3">year_month — 입력 영역 없음</p>
            <YearMonthDemo showInput={false} />
          </div>
          <div>
            <p className="mb-spacing-4 text-12 text-font-icon-3">time — 시/분</p>
            <TimeListDemo />
          </div>
          <div>
            <p className="mb-spacing-4 text-12 text-font-icon-3">time — 입력 영역 없음</p>
            <TimeListDemo showInput={false} />
          </div>
        </div>
      </div>
    </section>
  );
}
