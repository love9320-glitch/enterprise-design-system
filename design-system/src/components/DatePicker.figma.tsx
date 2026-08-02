// DatePicker 계열 Code Connect 매핑(2026-08-02) — date picker(7594:4368, 단일) +
// calendar day button SET(7592:3061, 구 'calender' 오타 수정) + 2depth list SET(7959:5979).
//   - day button: state 8종 → CalendarDayButton state('Start end day'=단일 시작=마감 → selected,
//     Hover는 CSS). muted(이전/다음 달)는 코드 전용 상태.
//   - 2depth list: time 변형(year_month/time) → TwoDepthList separator·옵션 구성.
// 발행: main 머지 시 자동(.github/workflows/figma-code-connect.yml)
// 파서 제약 — URL·props는 리터럴만(변수·스프레드·as const 금지).
import figma from '@figma/code-connect';
import { CalendarDayButton } from './CalendarDayButton';
import { DatePicker } from './DatePicker';
import { TwoDepthList } from './TwoDepthList';

// date picker — 달력 본체(연/월 이동·요일·날짜 그리드·시간 영역)
figma.connect(
  DatePicker,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7594-4368',
  {
    example: () => <DatePicker mode="range" showTime />,
  },
);

// calendar day button — 날짜 셀(상태 8종)
figma.connect(
  CalendarDayButton,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7592-3061',
  {
    props: {
      state: figma.enum('state', {
        'Unselected day': 'default',
        Today: 'today',
        'Select day': 'selected',
        'Start end day': 'selected',
        'Range start day': 'range-start',
        'Range end day': 'range-end',
        'In range day': 'in-range',
      }),
    },
    example: ({ state }) => <CalendarDayButton state={state}>15</CalendarDayButton>,
  },
);

// 2depth list — 연.월 선택형
figma.connect(
  TwoDepthList,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7959-5979',
  {
    variant: { time: '2depth list (year_month)' },
    example: () => (
      <TwoDepthList
        showInput={false}
        separator="."
        leftOptions={[
          { value: '2025', label: '2025년' },
          { value: '2026', label: '2026년' },
        ]}
        rightOptions={[
          { value: '07', label: '7월' },
          { value: '08', label: '8월' },
        ]}
        leftValue="2026"
        rightValue="08"
      />
    ),
  },
);

// 2depth list — 시:분 선택형
figma.connect(
  TwoDepthList,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7959-5979',
  {
    variant: { time: '2depth list (time)' },
    example: () => (
      <TwoDepthList
        showInput={false}
        separator=":"
        leftOptions={[
          { value: '09', label: '09시' },
          { value: '10', label: '10시' },
        ]}
        rightOptions={[
          { value: '00', label: '00분' },
          { value: '30', label: '30분' },
        ]}
        leftValue="09"
        rightValue="30"
      />
    ),
  },
);
