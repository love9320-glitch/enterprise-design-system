// Figma "베이직 칼라 토큰" (node 7012:2)에서 추출한 베이스(프리미티브) 컬러
// 모노톤 그레이 스케일 + black/white. 시멘틱 컬러는 이 베이스 컬러를
// 참조하는 형태로 추후 별도 등록합니다.

export const baseColors = {
  base: {
    gray: {
      25: '#fafafa',
      50: '#f2f2f2',
      100: '#e3e3e3',
      150: '#c9c9c9',
      200: '#b0b0b0',
      250: '#999999',
      300: '#878787',
      400: '#6a6a6a',
      500: '#505050',
      600: '#3f3f3f',
      700: '#353535',
      800: '#272727',
      900: '#0d0d0d',
    },
    // gray 900 알파 시리즈 (Figma "color/gray/900 *" 변수)
    // 8자리 HEX: #0d0d0d + 알파 채널 (00=투명 → cf=81% 불투명)
    'gray-900-00': '#0d0d0d00',
    'gray-900-10': '#0d0d0d08',
    'gray-900-25': '#0d0d0d12',
    'gray-900-50': '#0d0d0d29',
    'gray-900-75': '#0d0d0d54',
    'gray-900-100': '#0d0d0d7a',
    'gray-900-200': '#0d0d0da6',
    'gray-900-300': '#0d0d0dcf',
    // white 알파 시리즈 (Figma "color/gray/white *" 변수)
    'white-00': '#ffffff00',
    'white-10': '#ffffff08',
    'white-25': '#ffffff12',
    'white-50': '#ffffff29',
    'white-75': '#ffffff54',
    'white-100': '#ffffff7a',
    'white-200': '#ffffffa6',
    'white-300': '#ffffffcf',
    black: '#000000', // Figma "color/black" 변수 값 기준 (#0d0d0d → #000000 수정)
    white: '#ffffff',
  },
};
