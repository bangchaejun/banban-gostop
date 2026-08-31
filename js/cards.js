/**
 * BANBAN GO-STOP - 48 Cards + Bonus Cards Database
 * 반반이의 실제 사진과 3D 캐릭터가 결합된 프리미엄 화투패
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

// 12월 x 4장 + 보너스 2장
const CARDS_DATA = [
  // 1월 (송학 - 일출과 학 & 반반이)
  { id: 1, month: 1, type: CARD_TYPES.GWANG, name: '1월 송학 광', banbanText: '일출 반반이 광', img: 'assets/banban/char_happy.jpg', isGodori: false },
  { id: 2, month: 1, type: CARD_TYPES.RIBBON, ribbonType: RIBBON_TYPES.HONG_DAN, name: '1월 홍단', banbanText: '홍단', img: 'assets/banban/banban1.jpg' },
  { id: 3, month: 1, type: CARD_TYPES.JUNK, name: '1월 피1', img: 'assets/banban/banban2.jpg' },
  { id: 4, month: 1, type: CARD_TYPES.JUNK, name: '1월 피2', img: 'assets/banban/banban3.jpg' },

  // 2월 (매조 - 꾀꼬리와 반반이)
  { id: 5, month: 2, type: CARD_TYPES.ANIMAL, name: '2월 매조 고도리', banbanText: '고도리 꾀꼬리', img: 'assets/banban/char_idle.jpg', isGodori: true },
  { id: 6, month: 2, type: CARD_TYPES.RIBBON, ribbonType: RIBBON_TYPES.HONG_DAN, name: '2월 홍단', banbanText: '홍단', img: 'assets/banban/banban4.jpg' },
  { id: 7, month: 2, type: CARD_TYPES.JUNK, name: '2월 피1', img: 'assets/banban/banban5.jpg' },
  { id: 8, month: 2, type: CARD_TYPES.JUNK, name: '2월 피2', img: 'assets/banban/banban6.jpg' },

  // 3월 (벚꽃 - 벚꽃놀이 반반이)
  { id: 9, month: 3, type: CARD_TYPES.GWANG, name: '3월 벚꽃 광', banbanText: '벚꽃 반반이 광', img: 'assets/banban/char_happy.jpg', isGodori: false },
  { id: 10, month: 3, type: CARD_TYPES.RIBBON, ribbonType: RIBBON_TYPES.HONG_DAN, name: '3월 홍단', banbanText: '홍단', img: 'assets/banban/banban7.jpg' },
  { id: 11, month: 3, type: CARD_TYPES.JUNK, name: '3월 피1', img: 'assets/banban/banban8.jpg' },
  { id: 12, month: 3, type: CARD_TYPES.JUNK, name: '3월 피2', img: 'assets/banban/banban9.jpg' },

  // 4월 (흑싸리 - 두견새)
  { id: 13, month: 4, type: CARD_TYPES.ANIMAL, name: '4월 흑싸리 고도리', banbanText: '고도리 두견새', img: 'assets/banban/char_idle.jpg', isGodori: true },
  { id: 14, month: 4, type: CARD_TYPES.RIBBON, ribbonType: RIBBON_TYPES.CHO_DAN, name: '4월 초단', banbanText: '초단', img: 'assets/banban/banban1.jpg' },
  { id: 15, month: 4, type: CARD_TYPES.JUNK, name: '4월 피1', img: 'assets/banban/banban2.jpg' },
  { id: 16, month: 4, type: CARD_TYPES.JUNK, name: '4월 피2', img: 'assets/banban/banban3.jpg' },

  // 5월 (난초)
  { id: 17, month: 5, type: CARD_TYPES.ANIMAL, name: '5월 난초 열끗', banbanText: '다리 건너는 반반이', img: 'assets/banban/char_idle.jpg' },
  { id: 18, month: 5, type: CARD_TYPES.RIBBON, ribbonType: RIBBON_TYPES.CHO_DAN, name: '5월 초단', banbanText: '초단', img: 'assets/banban/banban4.jpg' },
  { id: 19, month: 5, type: CARD_TYPES.JUNK, name: '5월 피1', img: 'assets/banban/banban5.jpg' },
  { id: 20, month: 5, type: CARD_TYPES.JUNK, name: '5월 피2', img: 'assets/banban/banban6.jpg' },

  // 6월 (모란 - 나비)
  { id: 21, month: 6, type: CARD_TYPES.ANIMAL, name: '6월 모란 열끗', banbanText: '나비 잡는 반반이', img: 'assets/banban/char_happy.jpg' },
  { id: 22, month: 6, type: CARD_TYPES.RIBBON, ribbonType: RIBBON_TYPES.CHEONG_DAN, name: '6월 청단', banbanText: '청단', img: 'assets/banban/banban7.jpg' },
  { id: 23, month: 6, type: CARD_TYPES.JUNK, name: '6월 피1', img: 'assets/banban/banban8.jpg' },
  { id: 24, month: 6, type: CARD_TYPES.JUNK, name: '6월 피2', img: 'assets/banban/banban9.jpg' },

  // 7월 (홍싸리 - 멧돼지)
  { id: 25, month: 7, type: CARD_TYPES.ANIMAL, name: '7월 홍싸리 열끗', banbanText: '멧돼지 만난 반반이', img: 'assets/banban/char_panic.jpg' },
  { id: 26, month: 7, type: CARD_TYPES.RIBBON, ribbonType: RIBBON_TYPES.CHO_DAN, name: '7월 초단', banbanText: '초단', img: 'assets/banban/banban1.jpg' },
  { id: 27, month: 7, type: CARD_TYPES.JUNK, name: '7월 피1', img: 'assets/banban/banban2.jpg' },
  { id: 28, month: 7, type: CARD_TYPES.JUNK, name: '7월 피2', img: 'assets/banban/banban3.jpg' },

  // 8월 (공산 - 보름달과 기러기)
  { id: 29, month: 8, type: CARD_TYPES.GWANG, name: '8월 달밤 광', banbanText: '보름달 반반이 광', img: 'assets/banban/char_happy.jpg', isGodori: false },
  { id: 30, month: 8, type: CARD_TYPES.ANIMAL, name: '8월 공산 고도리', banbanText: '고도리 기러기', img: 'assets/banban/char_idle.jpg', isGodori: true },
  { id: 31, month: 8, type: CARD_TYPES.JUNK, name: '8월 피1', img: 'assets/banban/banban4.jpg' },
  { id: 32, month: 8, type: CARD_TYPES.JUNK, name: '8월 피2', img: 'assets/banban/banban5.jpg' },

  // 9월 (국화 - 국진 쌍피 활용 가능)
  { id: 33, month: 9, type: CARD_TYPES.ANIMAL, isGukjin: true, name: '9월 국진 열끗/쌍피', banbanText: '황금국화 반반이', img: 'assets/banban/char_happy.jpg' },
  { id: 34, month: 9, type: CARD_TYPES.RIBBON, ribbonType: RIBBON_TYPES.CHEONG_DAN, name: '9월 청단', banbanText: '청단', img: 'assets/banban/banban6.jpg' },
  { id: 35, month: 9, type: CARD_TYPES.JUNK, name: '9월 피1', img: 'assets/banban/banban7.jpg' },
  { id: 36, month: 9, type: CARD_TYPES.JUNK, name: '9월 피2', img: 'assets/banban/banban8.jpg' },

  // 10월 (단풍 - 사슴)
  { id: 37, month: 10, type: CARD_TYPES.ANIMAL, name: '10월 단풍 열끗', banbanText: '사슴 만난 반반이', img: 'assets/banban/char_idle.jpg' },
  { id: 38, month: 10, type: CARD_TYPES.RIBBON, ribbonType: RIBBON_TYPES.CHEONG_DAN, name: '10월 청단', banbanText: '청단', img: 'assets/banban/banban9.jpg' },
  { id: 39, month: 10, type: CARD_TYPES.JUNK, name: '10월 피1', img: 'assets/banban/banban1.jpg' },
  { id: 40, month: 10, type: CARD_TYPES.JUNK, name: '10월 피2', img: 'assets/banban/banban2.jpg' },

  // 11월 (오동 - 똥광)
  { id: 41, month: 11, type: CARD_TYPES.GWANG, name: '11월 오동 광', banbanText: '황금 오동광', img: 'assets/banban/char_happy.jpg', isGodori: false },
  { id: 42, month: 11, type: CARD_TYPES.DOUBLE_JUNK, name: '11월 오동 쌍피', banbanText: '쌍피', img: 'assets/banban/banban3.jpg' },
  { id: 43, month: 11, type: CARD_TYPES.JUNK, name: '11월 피1', img: 'assets/banban/banban4.jpg' },
  { id: 44, month: 11, type: CARD_TYPES.JUNK, name: '11월 피2', img: 'assets/banban/banban5.jpg' },

  // 12월 (비 - 비광)
  { id: 45, month: 12, type: CARD_TYPES.GWANG, isBiGwang: true, name: '12월 비광', banbanText: '우산 쓴 반반이 광', img: 'assets/banban/char_panic.jpg', isGodori: false },
  { id: 46, month: 12, type: CARD_TYPES.ANIMAL, name: '12월 비 열끗', banbanText: '비 제비', img: 'assets/banban/char_idle.jpg' },
  { id: 47, month: 12, type: CARD_TYPES.RIBBON, ribbonType: RIBBON_TYPES.PLAIN, name: '12월 비 띠', banbanText: '비 띠', img: 'assets/banban/banban6.jpg' },
  { id: 48, month: 12, type: CARD_TYPES.DOUBLE_JUNK, name: '12월 비 쌍피', banbanText: '쌍피', img: 'assets/banban/banban7.jpg' },

  // 보너스피 (간식 & 뼈다귀)
  { id: 49, month: 0, type: CARD_TYPES.DOUBLE_JUNK, isBonus: true, bonusCount: 2, name: '보너스 쌍피 (간식 캔)', banbanText: '간식 보너스 +2피', img: 'assets/banban/banban8.jpg' },
  { id: 50, month: 0, type: CARD_TYPES.DOUBLE_JUNK, isBonus: true, bonusCount: 3, name: '보너스 삼피 (황금 뼈다귀)', banbanText: '뼈다귀 보너스 +3피', img: 'assets/banban/banban9.jpg' }
];

window.CARDS_DATA = CARDS_DATA;
window.CARD_TYPES = CARD_TYPES;
window.RIBBON_TYPES = RIBBON_TYPES;
