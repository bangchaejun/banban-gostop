/**
 * BANBAN GO-STOP - 48 Authentic Traditional Hwatu Cards + Bonus Cards
 * 100% 실물 정통 화투패 원본 일러스트 그래픽 완벽 탑재
 */

const CARD_TYPES = {
  GWANG: 'gwang',       // 광
  ANIMAL: 'animal',     // 열끗 (고도리 등)
  RIBBON: 'ribbon',     // 띠 (홍단, 청단, 초단)
  JUNK: 'junk',         // 피
  DOUBLE_JUNK: 'double' // 쌍피
};

const RIBBON_TYPES = {
  HONG_DAN: 'hong', // 1, 2, 3
  CHEONG_DAN: 'cheong', // 6, 9, 10
  CHO_DAN: 'cho',   // 4, 5, 7
  PLAIN: 'plain'    // 12 비
};

// 12월 x 4장 = 48장 정통 화투 + 보너스피 2장
const CARDS_DATA = [
  // 1월 (송학)
  { id: 1, month: 1, type: CARD_TYPES.GWANG, name: '1월 송학 광', img: 'assets/cards/0.webp', isGodori: false },
  { id: 2, month: 1, type: CARD_TYPES.RIBBON, ribbonType: RIBBON_TYPES.HONG_DAN, name: '1월 홍단', img: 'assets/cards/1.webp' },
  { id: 3, month: 1, type: CARD_TYPES.JUNK, name: '1월 피1', img: 'assets/cards/2.webp' },
  { id: 4, month: 1, type: CARD_TYPES.JUNK, name: '1월 피2', img: 'assets/cards/3.webp' },

  // 2월 (매조)
  { id: 5, month: 2, type: CARD_TYPES.ANIMAL, name: '2월 매조 고도리', img: 'assets/cards/4.webp', isGodori: true },
  { id: 6, month: 2, type: CARD_TYPES.RIBBON, ribbonType: RIBBON_TYPES.HONG_DAN, name: '2월 홍단', img: 'assets/cards/5.webp' },
  { id: 7, month: 2, type: CARD_TYPES.JUNK, name: '2월 피1', img: 'assets/cards/6.webp' },
  { id: 8, month: 2, type: CARD_TYPES.JUNK, name: '2월 피2', img: 'assets/cards/7.webp' },

  // 3월 (벚꽃)
  { id: 9, month: 3, type: CARD_TYPES.GWANG, name: '3월 벚꽃 광', img: 'assets/cards/8.webp', isGodori: false },
  { id: 10, month: 3, type: CARD_TYPES.RIBBON, ribbonType: RIBBON_TYPES.HONG_DAN, name: '3월 홍단', img: 'assets/cards/9.webp' },
  { id: 11, month: 3, type: CARD_TYPES.JUNK, name: '3월 피1', img: 'assets/cards/10.webp' },
  { id: 12, month: 3, type: CARD_TYPES.JUNK, name: '3월 피2', img: 'assets/cards/11.webp' },

  // 4월 (흑싸리)
  { id: 13, month: 4, type: CARD_TYPES.ANIMAL, name: '4월 흑싸리 고도리', img: 'assets/cards/12.webp', isGodori: true },
  { id: 14, month: 4, type: CARD_TYPES.RIBBON, ribbonType: RIBBON_TYPES.CHO_DAN, name: '4월 초단', img: 'assets/cards/13.webp' },
  { id: 15, month: 4, type: CARD_TYPES.JUNK, name: '4월 피1', img: 'assets/cards/14.webp' },
  { id: 16, month: 4, type: CARD_TYPES.JUNK, name: '4월 피2', img: 'assets/cards/15.webp' },

  // 5월 (난초)
  { id: 17, month: 5, type: CARD_TYPES.ANIMAL, name: '5월 난초 열끗', img: 'assets/cards/16.webp' },
  { id: 18, month: 5, type: CARD_TYPES.RIBBON, ribbonType: RIBBON_TYPES.CHO_DAN, name: '5월 초단', img: 'assets/cards/17.webp' },
  { id: 19, month: 5, type: CARD_TYPES.JUNK, name: '5월 피1', img: 'assets/cards/18.webp' },
  { id: 20, month: 5, type: CARD_TYPES.JUNK, name: '5월 피2', img: 'assets/cards/19.webp' },

  // 6월 (모란)
  { id: 21, month: 6, type: CARD_TYPES.ANIMAL, name: '6월 모란 열끗', img: 'assets/cards/20.webp' },
  { id: 22, month: 6, type: CARD_TYPES.RIBBON, ribbonType: RIBBON_TYPES.CHEONG_DAN, name: '6월 청단', img: 'assets/cards/21.webp' },
  { id: 23, month: 6, type: CARD_TYPES.JUNK, name: '6월 피1', img: 'assets/cards/22.webp' },
  { id: 24, month: 6, type: CARD_TYPES.JUNK, name: '6월 피2', img: 'assets/cards/23.webp' },

  // 7월 (홍싸리)
  { id: 25, month: 7, type: CARD_TYPES.ANIMAL, name: '7월 홍싸리 열끗', img: 'assets/cards/24.webp' },
  { id: 26, month: 7, type: CARD_TYPES.RIBBON, ribbonType: RIBBON_TYPES.CHO_DAN, name: '7월 초단', img: 'assets/cards/25.webp' },
  { id: 27, month: 7, type: CARD_TYPES.JUNK, name: '7월 피1', img: 'assets/cards/26.webp' },
  { id: 28, month: 7, type: CARD_TYPES.JUNK, name: '7월 피2', img: 'assets/cards/27.webp' },

  // 8월 (공산)
  { id: 29, month: 8, type: CARD_TYPES.GWANG, name: '8월 공산 광', img: 'assets/cards/28.webp', isGodori: false },
  { id: 30, month: 8, type: CARD_TYPES.ANIMAL, name: '8월 공산 고도리', img: 'assets/cards/29.webp', isGodori: true },
  { id: 31, month: 8, type: CARD_TYPES.JUNK, name: '8월 피1', img: 'assets/cards/30.webp' },
  { id: 32, month: 8, type: CARD_TYPES.JUNK, name: '8월 피2', img: 'assets/cards/31.webp' },

  // 9월 (국화)
  { id: 33, month: 9, type: CARD_TYPES.ANIMAL, isGukjin: true, name: '9월 국진 열끗/쌍피', img: 'assets/cards/32.webp' },
  { id: 34, month: 9, type: CARD_TYPES.RIBBON, ribbonType: RIBBON_TYPES.CHEONG_DAN, name: '9월 청단', img: 'assets/cards/33.webp' },
  { id: 35, month: 9, type: CARD_TYPES.JUNK, name: '9월 피1', img: 'assets/cards/34.webp' },
  { id: 36, month: 9, type: CARD_TYPES.JUNK, name: '9월 피2', img: 'assets/cards/35.webp' },

  // 10월 (단풍)
  { id: 37, month: 10, type: CARD_TYPES.ANIMAL, name: '10월 단풍 열끗', img: 'assets/cards/36.webp' },
  { id: 38, month: 10, type: CARD_TYPES.RIBBON, ribbonType: RIBBON_TYPES.CHEONG_DAN, name: '10월 청단', img: 'assets/cards/37.webp' },
  { id: 39, month: 10, type: CARD_TYPES.JUNK, name: '10월 피1', img: 'assets/cards/38.webp' },
  { id: 40, month: 10, type: CARD_TYPES.JUNK, name: '10월 피2', img: 'assets/cards/39.webp' },

  // 11월 (오동)
  { id: 41, month: 11, type: CARD_TYPES.GWANG, name: '11월 오동 광', img: 'assets/cards/40.webp', isGodori: false },
  { id: 42, month: 11, type: CARD_TYPES.DOUBLE_JUNK, name: '11월 오동 쌍피', img: 'assets/cards/41.webp' },
  { id: 43, month: 11, type: CARD_TYPES.JUNK, name: '11월 피1', img: 'assets/cards/42.webp' },
  { id: 44, month: 11, type: CARD_TYPES.JUNK, name: '11월 피2', img: 'assets/cards/43.webp' },

  // 12월 (비)
  { id: 45, month: 12, type: CARD_TYPES.GWANG, isBiGwang: true, name: '12월 비광', img: 'assets/cards/44.webp', isGodori: false },
  { id: 46, month: 12, type: CARD_TYPES.ANIMAL, name: '12월 비 열끗', img: 'assets/cards/45.webp' },
  { id: 47, month: 12, type: CARD_TYPES.RIBBON, ribbonType: RIBBON_TYPES.PLAIN, name: '12월 비 띠', img: 'assets/cards/46.webp' },
  { id: 48, month: 12, type: CARD_TYPES.DOUBLE_JUNK, name: '12월 비 쌍피', img: 'assets/cards/47.webp' },

  // 보너스피 (간식 & 뼈다귀)
  { id: 49, month: 0, type: CARD_TYPES.DOUBLE_JUNK, isBonus: true, bonusCount: 2, name: '보너스 쌍피 (간식 캔)', img: 'assets/banban/banban8.jpg' },
  { id: 50, month: 0, type: CARD_TYPES.DOUBLE_JUNK, isBonus: true, bonusCount: 3, name: '보너스 삼피 (황금 뼈다귀)', img: 'assets/banban/banban9.jpg' }
];

window.CARDS_DATA = CARDS_DATA;
window.CARD_TYPES = CARD_TYPES;
window.RIBBON_TYPES = RIBBON_TYPES;
