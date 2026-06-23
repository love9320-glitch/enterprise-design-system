// 스위치 토글(Switch) 시멘틱 컬러 토큰
// Figma "check/*" 변수 — 상태별 track 채움(bg) · thumb(손잡이) · outline(hover ring) · text.
//   off: 회색 track + 흰 thumb(좌측) / on: blue track + 흰 thumb(우측)
//   hover: 바깥 ring 색 표시
//   disabled: off=연한 회색 track + 진회색 thumb / on=연한 blue track + blue thumb (둘 다 그림자 없음)
// 값은 Radio/Checkbox와 동일한 check/* 토큰을 공유하지만, 컴포넌트별 컬러 파일 관례를 따라 별도 정의한다.

import { baseColors } from '../colors.js';

const b = baseColors.base;

export const switchColors = {
  // off(unselected) — track 채움(bg)
  'unselected-bg':   b['gray-900-75'],   // #0d0d0d54 (렌더 ≈ #afafaf)
  'hover-outline':   b['gray-900-100'],  // #0d0d0d7a (hover ring)
  'disabled-bg':     b['gray-900-25'],   // #0d0d0d12 (렌더 ≈ #eeeeee)
  // on(selected) — track 채움(bg)
  'selected-bg':            b.blue[400],        // #0f85f2
  'selected-hover-outline': b['blue-400-200'],  // #0f85f2a6 (hover ring)
  'selected-disabled-bg':   b['blue-400-50'],   // #0f85f229 (렌더 ≈ #d8ebfc)
  // thumb(손잡이)
  'thumb':              b.white,       // #ffffff (off/on default·hover)
  'disabled-thumb':     b.blue[400],   // #0f85f2 (on + disabled)
  'disabled-thumb-off': b.gray[300],   // #878787 (off + disabled, 진회색)
  // 라벨
  'text':          b.gray[900], // #0d0d0d
  'disabled-text': b.gray[300], // #878787
};
