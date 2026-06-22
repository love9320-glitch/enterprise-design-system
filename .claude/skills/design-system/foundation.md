# Foundation — 디자인 토큰

모든 시각 값은 `src/tokens/`에 등록된 토큰만 사용한다. 토큰은 `tailwind.config.js`를 통해 유틸리티 클래스로 노출된다.

## 규칙 1 — 컬러는 반드시 시멘틱 토큰 경유

참조 순서: **Base 컬러 토큰 → Semantic 컬러 토큰 → 컴포넌트**

- 하드코딩 HEX/rgba 절대 금지.
- 시멘틱 토큰이 없으면 먼저 정의한 뒤 사용.
- **Why:** 토큰 값이 바뀌면 컴포넌트에 자동 반영되어야 한다. 하드코딩 시 누락이 생긴다.

### Base 컬러 (`colors.js` → `baseColors.base`)
모노톤 그레이 스케일 + black/white + 알파 시리즈. **컴포넌트에서 직접 쓰지 말고 시멘틱을 경유**한다.

- 그레이: `gray.25 ~ gray.900` (25, 50, 100, 150, 200, 250, 300, 400, 500, 600, 700, 800, 900)
- gray-900 알파: `gray-900-00 ~ gray-900-300` (투명도 단계)
- white 알파: `white-00 ~ white-300`
- `black`(#000000), `white`(#ffffff)

### Semantic — 폰트/아이콘 컬러 (`semanticColors.js` → `fontIconColors`)
Tailwind 클래스: `text-font-icon-{1~5}` / `bg-font-icon-{1~5}`

| 토큰 | 값 | 용도 |
|------|-----|------|
| `font-icon-5` | gray.900 (#0d0d0d) | 메인, 폰트/아이콘 디폴트 |
| `font-icon-4` | gray.600 (#3f3f3f) | 보조 텍스트 |
| `font-icon-3` | gray.300 (#878787) | 캡션/플레이스홀더 |
| `font-icon-2` | gray.150 (#c9c9c9) | 비활성 |
| `font-icon-1` | white (#ffffff) | 반전(어두운 배경 위) |

### Semantic — 버튼 컬러 (`buttonColors.js` → `buttonColors`)
Tailwind 클래스: `bg-btn-{variant}-{state}-{bg|fg|line}`
variant = `fill` | `ghost` | `line`, state = `default` | `hover` | `disabled`

예: `bg-btn-fill-default-bg`, `text-btn-fill-default-fg`, `ring-btn-line-default-line`

> 새 컴포넌트에 컬러가 필요하면 `semanticColors.js` 또는 별도 `xxxColors.js`에 **시멘틱 토큰을 먼저 추가**한 뒤 사용한다.

## 규칙 2 — 간격·라운드·스트로크는 등록 토큰만

Tailwind 기본 spacing(`p-4`, `gap-2`)·임의값(`p-[12px]`) **금지**.

### Spacing (`spacing.js`) — `p-spacing-N`, `m-spacing-N`, `gap-spacing-N`, `space-y-spacing-N`
| 토큰 | px |  | 토큰 | px |
|------|----|----|------|----|
| spacing-none | 0 |  | spacing-7 | 16 |
| spacing-1 | 1 |  | spacing-8 | 20 |
| spacing-2 | 2 |  | spacing-9 | 24 |
| spacing-3 | 4 |  | spacing-10 | 28 |
| spacing-4 | 6 |  | spacing-11 | 32 |
| spacing-5 | 8 |  | spacing-12 | 36 |
| spacing-6 | 12 |  | | |

### Radius (`radius.js`) — `rounded-round-N`
`round-2`(2px), `round-3`(4px), `round-4`(6px), `round-5`(8px), `round-6`(10px), `round-7`(12px), `round-8`(16px), `round-9`(20px), `round-10`(24px), `round-11`(28px), `round-12`(32px), `round-00`(999px, 완전 둥근/필).

### Border width (`border.js`) — `border-N`
`border-1`(1px), `border-2`(2px), `border-3`(3px), `border-4`(4px).

> 필요한 값이 없으면 `p-[12px]` 같은 임의값을 쓰지 말고 **토큰 파일에 먼저 추가**한다.

## 타이포그래피 (`typography.js`)

- 폰트: **Pretendard** — `font-pretendard`. 두께는 `font-normal`(400) / `font-semibold`(600)만.
- 사이즈 클래스: `text-12`, `text-13`, `text-14`, `text-16`, `text-18`, `text-20` (각 lineHeight·letterSpacing 자동 포함)

| 클래스 | size / line-height |
|--------|--------------------|
| text-12 | 12 / 20 |
| text-13 | 13 / 22 |
| text-14 | 14 / 24 |
| text-16 | 16 / 28 |
| text-18 | 18 / 30 |
| text-20 | 20 / 32 |

## 날짜·시간 표기 규칙 (`src/utils/datetime.js`)

날짜·시간 표기는 형식을 항상 통일한다. 화면마다 제각각 포맷하지 말 것. 연·월·일·시·분 모두 **2자리 0 패딩**(연도는 뒤 2자리).

| 상황 | 형식 | 예 |
|------|------|-----|
| 날짜+시간 1건 | `YY.MM.DD (HH:MM)` | `25.05.20 (12:00)` |
| 날짜만 | `YY.MM.DD` | `25.05.20` |
| 범위(둘 다) | `YY.MM.DD (HH:MM)~YY.MM.DD (HH:MM)` (틸드 양옆 공백 없음) | `25.05.20 (12:00)~25.05.20 (12:00)` |
| 범위(시작만) | `YY.MM.DD (HH:MM) ~ 마감일 없음` | `25.05.20 (12:00) ~ 마감일 없음` |
| 범위(마감만) | `시작일 없음 ~ YY.MM.DD (HH:MM)` | `시작일 없음 ~ 25.05.20 (12:00)` |

- **Why:** 같은 의미의 값이 화면마다 다르게 보이면 일관성이 깨진다. 표기는 한 곳에서 통일한다.
- **How to apply:** 직접 문자열을 조립하지 말고 `import { formatDate, formatDateTime, formatDateTimeRange } from '../utils/datetime'`를 사용한다. (`formatDateTime(date, time)` — 시간 생략 시 날짜만 / `formatDateTimeRange(start, sTime, end, eTime)` — 한쪽만 있으면 "마감일 없음/시작일 없음" 자동, 라벨은 옵션으로 변경 가능)

## 아이콘 (`icon.js` → `iconTokens`)

- 라이브러리: **lucide-react** (stroke 기반, fill 미사용)
- 기본값: `size: 16`, `strokeWidth: 1.8`, `color: font-icon-5`
- 사용: `import { iconTokens } from '../tokens'` 후 `<Icon size={iconTokens.size} strokeWidth={iconTokens.strokeWidth} />`, 색상은 `text-font-icon-*` 클래스로.

## 토큰 작업 완료 체크리스트

- [ ] 새 값을 임의값으로 쓰지 않고 토큰 파일(`src/tokens/`)에 등록했는가
- [ ] 컬러는 base → semantic 경유 구조를 지켰는가 (컴포넌트가 base 직접 참조 안 함)
- [ ] `tokens/index.js`에 export를 추가했는가
- [ ] `tailwind.config.js`에 클래스로 노출되도록 매핑했는가
- [ ] 다크모드 대응이 필요한 값인가 확인했는가
