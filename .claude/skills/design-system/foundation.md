# Foundation — 디자인 토큰

모든 시각 값은 `src/tokens/`에 등록된 토큰만 사용한다. 토큰은 `tailwind.config.js`를 통해 유틸리티 클래스로 노출된다.

> **⚠️ 토큰 값 변경은 dev 서버 재시작 필요(2026-07-07 확인)** — 토큰 파일은 `tailwind.config.js`가 import하므로 HMR이 변경을 감시하지 못한다. 토큰 추가/수정 후 화면에 반영이 안 되면 빌드 문제 진단 전에 먼저 dev 서버를 재시작할 것(프로덕션 빌드는 무관).

> **다크모드: 현재 미고려(보류).** 다크 테마는 도입하지 않으며 `darkMode` 설정·`dark:` 클래스를 쓰지 않는다(코드에 `dark:` 0개). 추후 도입하게 되면 토큰의 다크 변형 정의부터 다시 검토한다. — 그래서 작업 체크리스트에 다크모드 항목은 두지 않는다.

## 컬러는 반드시 시멘틱 토큰 경유 (공통 원칙 '컬러 시멘틱 토큰 경유' 상세)

참조 순서: **Base 컬러 토큰 → Semantic 컬러 토큰 → 컴포넌트**

- 하드코딩 HEX/rgba 절대 금지.
- **시멘틱 컬러 토큰이 없으면 임의로 정의·추측하지 말고, 멈추고 사용자에게 "이 시멘틱 토큰이 빠졌으니 추가해 달라"고 알린 뒤(빠진 토큰명·용도·예상 base 값 제시), 사용자가 추가하면 그 다음 스텝을 진행한다.** (2026-06-26 사용자 지시 — 토큰 체계는 사용자가 관리/Figma가 출처. base 컬러를 직접 끌어다 쓰거나 다른 시멘틱으로 우회하지 말 것.)
- **Why:** 토큰 값이 바뀌면 컴포넌트에 자동 반영되어야 한다. 하드코딩/임의 정의 시 디자인 출처(Figma 변수)와 어긋난다.

### Base 컬러 (`colors.js` → `baseColors.base`)
모노톤 그레이 스케일 + black/white + 피드백 유채색(red/blue) + 알파 시리즈. **컴포넌트에서 직접 쓰지 말고 시멘틱을 경유**한다.

- 그레이: `gray.25 ~ gray.900` (25, 50, 100, **125**, 150, 200, 250, 300, 400, 500, 600, 700, 800, 900) — `125`(#d6d6d6)는 100↔150 중간색(2026-07-03 신설, 테이블 헤더 구분선용). 스케일에 없는 중간값이 필요하면 임의값 대신 이렇게 **중간 키를 base에 신설**하고 시멘틱이 참조한다
- gray-900 알파: `gray-900-00 ~ gray-900-300` (투명도 단계)
- white 알파: `white-00 ~ white-300`
- `black`(#000000), `white`(#ffffff)
- 피드백 red: `red.25 ~ red.900` — **`red.400`(#e74a4a)이 error/danger 메인** (텍스트필드 에러 툴팁 등). red-400 알파: `red-400-00 ~ red-400-300`
- 피드백 blue: `blue.25 ~ blue.900` — **`blue.400`(#0f85f2)이 info/링크 메인**. blue-400 알파: `blue-400-00 ~ blue-400-300`

### Semantic — 폰트/아이콘 컬러 (`fontIconColors.js` → `fontIconColors`)
Tailwind 클래스: `text-font-icon-{1~5}` / `bg-font-icon-{1~5}`

| 토큰 | 값 | 용도 |
|------|-----|------|
| `font-icon-5` | gray.900 (#0d0d0d) | 메인, 폰트/아이콘 디폴트 |
| `font-icon-4` | gray.600 (#3f3f3f) | 보조 텍스트 |
| `font-icon-3` | gray.300 (#878787) | 캡션/플레이스홀더 |
| `font-icon-2` | gray.150 (#c9c9c9) | 비활성 |
| `font-icon-1` | white (#ffffff) | 반전(어두운 배경 위) |

### Semantic — 버튼 컬러 (`colors/buttonColors.js` → `buttonColors`)
Tailwind 클래스: `bg-button-{variant}-{state}-{bg|fg|line}`
variant = `fill` | `ghost` | `line`, state = `default` | `hover` | `disabled` (+ ghost 전용: `selected`(selected-bg·selected-text), `pagination-fg`)

예: `bg-button-fill-default-bg`, `text-button-fill-default-fg`, `ring-button-line-default-line`, `bg-button-ghost-selected-bg`

> **컴포넌트별 시멘틱 컬러 파일은 `tokens/colors/` 폴더에 모은다**(`buttonColors.js`·`tableColors.js`·`switchColors.js` 등). base `colors.js`·`fontIconColors.js`(폰트/아이콘)는 기반 토큰이라 `tokens/` 루트에 둔다.
> 새 컴포넌트에 컬러가 필요하면 `fontIconColors.js` 또는 `colors/xxxColors.js`에 **시멘틱 토큰을 먼저 추가**한 뒤 `tokens/index.js`에 export하고 사용한다. (컴포넌트 컬러 파일은 base를 `'../colors.js'`로 참조)

## 간격·라운드·스트로크는 등록 토큰만 (공통 원칙 '등록 토큰만 사용' 상세)

Tailwind 기본 spacing(`p-4`, `gap-2`)·임의값(`p-[12px]`) **금지**.

> **적용 범위 = 간격·패딩·갭·마진·라운드·스트로크.** '임의값 금지'는 이들(spacing/round/border)에만 적용된다. **고정 요소 치수**(아이콘·점·트랙·컨트롤의 width/height·`min-h` 등)는 별개다 — 매칭되는 spacing 토큰이 있으면 그것(`w-spacing-*`/`h-spacing-*`)을 **우선** 쓰고(예: 6px 점 = `spacing-4` = `h-spacing-4 w-spacing-4`), 토큰 스케일로 못 맞추는 경우(예: `min-h-[32px]` — minHeight는 spacing 토큰이 안 붙음)는 **임의 px 허용**. 따라서 컴포넌트 예제의 `min-h-[24px]`·`min-h-[32px]`(Button/SegmentControl 등)는 규칙 위반이 아니다.

### Spacing (`spacing.js`) — `p-spacing-N`, `m-spacing-N`, `gap-spacing-N`, `space-y-spacing-N`
| 토큰 | px |  | 토큰 | px |
|------|----|----|------|----|
| spacing-none | 0 |  | spacing-7 | 16 |
| spacing-1 | 1 |  | spacing-8 | 20 |
| spacing-2 | 2 |  | spacing-9 | 24 |
| spacing-3 | 4 |  | spacing-10 | 28 |
| spacing-4 | 6 |  | spacing-11 | 32 |
| spacing-5 | 8 |  | spacing-12 | 36 |
| spacing-5-5 | 10 |  | | |
| spacing-6 | 12 |  | | |

> `spacing-5-5`(10px)는 8↔12 사이 중간 스텝(2026-07-02 신설 — 테이블 셀 좌우 패딩). 기존 키 순번 보존을 위해 중간 키를 쓴다 — 없는 간격 값은 임의값 대신 사용자 확인 후 이렇게 추가.

### Radius (`radius.js`) — `rounded-round-N`
`round-2`(2px), `round-3`(4px), `round-4`(6px), `round-5`(8px), `round-6`(10px), `round-7`(12px), `round-8`(16px), `round-9`(20px), `round-10`(24px), `round-11`(28px), `round-12`(32px), `round-00`(999px, 완전 둥근/필).

### Border width (`border.js`) — `border-N`
`border-1`(1px), `border-2`(2px), `border-3`(3px), `border-4`(4px).

> 필요한 값이 없으면 `p-[12px]` 같은 임의값을 쓰지 말고 **토큰 파일에 먼저 추가**한다.

## 타이포그래피 (`typography.js`)

- 폰트: **Pretendard** — `font-pretendard`. 두께는 `font-normal`(400) / `font-semibold`(600)만.
- 사이즈 클래스: `text-12`, `text-13`, `text-14`, `text-15`, `text-16`, `text-18`, `text-20` (각 lineHeight·letterSpacing 자동 포함)

| 클래스 | size / line-height |
|--------|--------------------|
| text-12 | 12 / 20 |
| text-13 | 13 / 22 |
| text-14 | 14 / 24 |
| text-15 | 15 / 26 |
| text-16 | 16 / 28 |
| text-18 | 18 / 30 |
| text-20 | 20 / 32 |

### 행간(lineHeight) 독립 토큰 (`lineHeight.js`) — `leading-N` (2026-07-01 신설)
`leading-16`(16px)·`leading-18`(18px)·`leading-20`~`leading-32`(2px 단위) — fontSize 토큰이 기본 행간으로 이 값을 참조하므로(위 표의 line-height = leading 토큰) 값은 한 곳에서만 정의된다. **사이즈는 그대로 두고 행간만 바꿀 때**(예: 에디터 본문 `leading-30`) 조합해 쓴다. `leading-[1.7]` 같은 임의 행간 금지 — 기본 행간이 의도값과 같으면 leading 클래스 자체를 생략한다.

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
