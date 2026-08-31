/**
 * BANBAN MATGO - Authentic Hwatu Card Renderer (한게임/피망 맞고 스타일 정통 화투 그래픽)
 * 정통 48장 화투 문양을 100% 한눈에 알아볼 수 있도록 완벽 구현
 */

const HWATU_COLORS = {
  SUN_RED: '#d90429',
  SKY_BLUE: '#0077b6',
  PINE_GREEN: '#2d6a4f',
  CHERRY_PINK: '#ff758f',
  MOON_WHITE: '#ffffff',
  AUTUMN_ORANGE: '#f77f00',
  CHRYS_YELLOW: '#ffb703',
  DEEP_BLACK: '#111111',
  CARD_BORDER_RED: '#b7094c',
  CARD_CREAM: '#fffdf7',
  GOLD_ACCENT: '#ffd700'
};

// 48장 정통 화투패 SVG 렌더러
function getHwatuSvg(card) {
  const m = card.month;
  const t = card.type;

  // 광(光) 마크 뱃지
  const gwangMark = t === 'gwang' ? `
    <circle cx="16" cy="16" r="13" fill="#d90429" stroke="#ffd700" stroke-width="1.5" />
    <text x="16" y="21" font-family="'Noto Sans KR', sans-serif" font-size="14" font-weight="900" fill="#ffd700" text-anchor="middle">光</text>
  ` : '';

  // 띠(홍단/청단/초단/비띠) 뱃지
  let ribbonSvg = '';
  if (t === 'ribbon') {
    let rColor = '#d90429';
    let rText = '홍단';
    if (card.ribbonType === 'cheong') {
      rColor = '#0077b6';
      rText = '청단';
    } else if (card.ribbonType === 'cho') {
      rColor = '#2d6a4f';
      rText = '초단';
    } else if (card.ribbonType === 'plain') {
      rColor = '#d90429';
      rText = '';
    }

    ribbonSvg = `
      <path d="M 12 18 Q 45 10 78 18 L 76 34 Q 45 26 14 34 Z" fill="${rColor}" stroke="#ffffff" stroke-width="1" />
      ${rText ? `<text x="45" y="27" font-family="'Noto Sans KR', sans-serif" font-size="9" font-weight="900" fill="#ffffff" text-anchor="middle">${rText}</text>` : ''}
    `;
  }

  // 월별 고유 정통 그래픽 드로잉
  let artSvg = '';
  switch (m) {
    case 1: // 송학 (소나무 + 학 + 붉은 일출)
      artSvg = `
        <circle cx="45" cy="50" r="32" fill="#d90429" />
        <path d="M 0 110 Q 45 40 90 110 Z" fill="#2d6a4f" />
        <path d="M 15 120 L 45 75 L 75 120 Z" fill="#1b4332" />
        ${t === 'gwang' ? `
          <!-- 학 (Crane) & 반반이 -->
          <ellipse cx="45" cy="48" rx="14" ry="24" fill="#ffffff" />
          <polygon points="45,20 42,34 48,34" fill="#ffffff" />
          <circle cx="45" cy="18" r="4" fill="#d90429" />
          <line x1="45" y1="18" x2="62" y2="15" stroke="#ffb703" stroke-width="2" />
        ` : ''}
      `;
      break;

    case 2: // 매조 (매화나무 + 꾀꼬리)
      artSvg = `
        <path d="M 10 130 Q 30 60 70 30" stroke="#6f4e37" stroke-width="8" fill="none" />
        <circle cx="35" cy="70" r="10" fill="#d90429" />
        <circle cx="65" cy="40" r="9" fill="#d90429" />
        <circle cx="20" cy="100" r="8" fill="#d90429" />
        ${card.isGodori ? `
          <!-- 고도리 꾀꼬리 -->
          <ellipse cx="50" cy="45" rx="12" ry="8" fill="#ffb703" transform="rotate(-20 50 45)" />
          <circle cx="40" cy="40" r="6" fill="#ffb703" />
          <polygon points="34,40 26,42 34,44" fill="#d90429" />
          <text x="75" y="115" font-size="8" font-weight="900" fill="#d90429">고도리</text>
        ` : ''}
      `;
      break;

    case 3: // 벚꽃 (만개한 사쿠라)
      artSvg = `
        <circle cx="25" cy="35" r="14" fill="#ff758f" opacity="0.9" />
        <circle cx="65" cy="45" r="16" fill="#ff758f" opacity="0.9" />
        <circle cx="45" cy="75" r="18" fill="#ff4d6d" />
        <circle cx="25" cy="105" r="14" fill="#ff758f" opacity="0.9" />
        <circle cx="65" cy="100" r="15" fill="#ff758f" opacity="0.9" />
        ${t === 'gwang' ? `
          <!-- 3월 광 막 (Tent curtain) -->
          <path d="M 0 85 L 90 85 L 90 130 L 0 130 Z" fill="#780000" />
          <path d="M 15 85 L 30 130 L 45 85 L 60 130 L 75 85" stroke="#ffffff" stroke-width="4" fill="none" />
        ` : ''}
      `;
      break;

    case 4: // 흑싸리 (두견새)
      artSvg = `
        <path d="M 20 0 Q 30 60 15 120" stroke="#111111" stroke-width="6" fill="none" />
        <path d="M 50 0 Q 40 70 65 120" stroke="#111111" stroke-width="6" fill="none" />
        <path d="M 75 0 Q 65 50 80 120" stroke="#111111" stroke-width="5" fill="none" />
        ${card.isGodori ? `
          <!-- 고도리 두견새 -->
          <ellipse cx="45" cy="65" rx="14" ry="9" fill="#c1121f" />
          <circle cx="34" cy="60" r="6" fill="#c1121f" />
          <polygon points="28,60 20,62 28,64" fill="#ffb703" />
          <text x="75" y="115" font-size="8" font-weight="900" fill="#d90429">고도리</text>
        ` : ''}
      `;
      break;

    case 5: // 난초 (징검다리)
      artSvg = `
        <path d="M 45 130 Q 20 60 45 10" stroke="#2d6a4f" stroke-width="7" fill="none" />
        <path d="M 45 130 Q 70 70 80 20" stroke="#2d6a4f" stroke-width="6" fill="none" />
        <path d="M 45 130 Q 10 90 10 40" stroke="#2d6a4f" stroke-width="5" fill="none" />
        ${t === 'animal' ? `
          <!-- 난초 다리 -->
          <rect x="15" y="80" width="60" height="12" fill="#6f4e37" rx="3" />
          <rect x="25" y="70" width="40" height="8" fill="#8d5b4c" rx="2" />
        ` : ''}
      `;
      break;

    case 6: // 모란 (나비)
      artSvg = `
        <circle cx="45" cy="70" r="24" fill="#d90429" />
        <circle cx="45" cy="70" r="16" fill="#ff4d6d" />
        <circle cx="45" cy="70" r="8" fill="#ffb703" />
        <path d="M 45 94 Q 25 120 15 130" stroke="#2d6a4f" stroke-width="6" fill="none" />
        <path d="M 45 94 Q 65 120 75 130" stroke="#2d6a4f" stroke-width="6" fill="none" />
        ${t === 'animal' ? `
          <!-- 나비 -->
          <path d="M 30 30 Q 20 15 35 20 Q 45 25 40 35 Z" fill="#ffb703" />
          <path d="M 50 30 Q 60 15 45 20 Q 35 25 40 35 Z" fill="#ffb703" />
          <ellipse cx="40" cy="30" rx="3" ry="8" fill="#111111" />
        ` : ''}
      `;
      break;

    case 7: // 홍싸리 (멧돼지)
      artSvg = `
        <path d="M 25 130 Q 35 60 15 10" stroke="#d90429" stroke-width="6" fill="none" />
        <path d="M 50 130 Q 65 70 75 20" stroke="#d90429" stroke-width="6" fill="none" />
        <circle cx="20" cy="30" r="5" fill="#d90429" />
        <circle cx="70" cy="40" r="5" fill="#d90429" />
        ${t === 'animal' ? `
          <!-- 멧돼지 -->
          <ellipse cx="45" cy="75" rx="20" ry="14" fill="#6f4e37" />
          <circle cx="30" cy="72" r="8" fill="#6f4e37" />
          <polygon points="22,72 15,74 22,76" fill="#ffb703" />
          <ellipse cx="40" cy="88" rx="4" ry="8" fill="#4a2810" />
          <ellipse cx="55" cy="88" rx="4" ry="8" fill="#4a2810" />
        ` : ''}
      `;
      break;

    case 8: // 공산 (억새풀 + 보름달 + 기러기)
      artSvg = `
        <path d="M 0 130 Q 45 60 90 130 Z" fill="#111111" />
        ${t === 'gwang' ? `
          <!-- 보름달 광 -->
          <circle cx="45" cy="45" r="26" fill="#ffffff" stroke="#ffd700" stroke-width="2" />
        ` : `
          <!-- 붉은 노을 하늘 -->
          <rect x="0" y="0" width="90" height="75" fill="#d90429" />
        `}
        ${card.isGodori ? `
          <!-- 기러기 3마리 -->
          <path d="M 25 35 Q 32 30 38 35 Q 44 30 50 35" stroke="#111111" stroke-width="3" fill="none" />
          <path d="M 50 25 Q 57 20 63 25 Q 69 20 75 25" stroke="#111111" stroke-width="3" fill="none" />
          <path d="M 35 50 Q 42 45 48 50 Q 54 45 60 50" stroke="#111111" stroke-width="3" fill="none" />
          <text x="75" y="115" font-size="8" font-weight="900" fill="#ffffff">고도리</text>
        ` : ''}
      `;
      break;

    case 9: // 국화 (국진 - 쌍피/열끗)
      artSvg = `
        <circle cx="45" cy="70" r="22" fill="#ffb703" />
        <circle cx="45" cy="70" r="14" fill="#fb8500" />
        <circle cx="45" cy="70" r="6" fill="#d90429" />
        <path d="M 45 92 L 45 130" stroke="#2d6a4f" stroke-width="6" />
        ${t === 'animal' ? `
          <!-- 국진 술잔 -->
          <path d="M 28 40 L 62 40 L 54 58 L 36 58 Z" fill="#d90429" stroke="#ffd700" stroke-width="1.5" />
          <text x="45" y="52" font-size="9" font-weight="900" fill="#ffd700" text-anchor="middle">壽</text>
          <text x="70" y="118" font-size="7" font-weight="900" fill="#d90429">쌍피겸용</text>
        ` : ''}
      `;
      break;

    case 10: // 단풍 (사슴)
      artSvg = `
        <path d="M 20 130 L 70 20" stroke="#6f4e37" stroke-width="6" />
        <circle cx="30" cy="40" r="14" fill="#d90429" />
        <circle cx="65" cy="65" r="15" fill="#d90429" />
        <circle cx="25" cy="90" r="16" fill="#f77f00" />
        ${t === 'animal' ? `
          <!-- 사슴 -->
          <ellipse cx="50" cy="75" rx="18" ry="12" fill="#8d5b4c" />
          <circle cx="65" cy="65" r="8" fill="#8d5b4c" />
          <!-- 뿔 -->
          <path d="M 68 58 L 74 46 M 70 52 L 76 52" stroke="#ffb703" stroke-width="2" />
        ` : ''}
      `;
      break;

    case 11: // 오동 (똥광 & 쌍피)
      artSvg = `
        <!-- 오동 3잎 -->
        <circle cx="25" cy="90" r="16" fill="#111111" />
        <circle cx="65" cy="90" r="16" fill="#111111" />
        <circle cx="45" cy="65" r="18" fill="#111111" />
        <path d="M 45 80 L 45 130" stroke="#d90429" stroke-width="6" />
        ${t === 'gwang' ? `
          <!-- 봉황 머리 -->
          <circle cx="45" cy="30" r="12" fill="#d90429" />
          <polygon points="45,15 38,28 52,28" fill="#ffb703" />
        ` : ''}
        ${t === 'double' ? `
          <text x="72" y="118" font-size="8" font-weight="900" fill="#d90429">쌍피</text>
        ` : ''}
      `;
      break;

    case 12: // 비 (비광 & 제비)
      artSvg = `
        <rect x="0" y="0" width="90" height="130" fill="#1b4332" />
        <path d="M 0 0 L 90 130 M 30 0 L 90 90 M 0 40 L 70 130" stroke="#0077b6" stroke-width="2" opacity="0.6" />
        ${t === 'gwang' ? `
          <!-- 비광 선비와 우산 -->
          <ellipse cx="45" cy="45" rx="24" ry="12" fill="#d90429" />
          <circle cx="45" cy="70" r="10" fill="#111111" />
          <rect x="35" y="80" width="20" height="40" fill="#0077b6" rx="4" />
          <circle cx="70" cy="105" r="7" fill="#55a630" /> <!-- 개구리 -->
        ` : ''}
        ${t === 'animal' ? `
          <!-- 비 제비 -->
          <polygon points="45,50 30,70 60,70" fill="#d90429" />
          <polygon points="30,70 15,90 35,80" fill="#111111" />
          <polygon points="60,70 75,90 55,80" fill="#111111" />
        ` : ''}
        ${t === 'double' ? `
          <text x="72" y="118" font-size="8" font-weight="900" fill="#ffd700">쌍피</text>
        ` : ''}
      `;
      break;

    case 0: // 보너스피
      artSvg = `
        <rect x="0" y="0" width="90" height="130" fill="#ffd700" />
        <circle cx="45" cy="65" r="26" fill="#d90429" />
        <text x="45" y="72" font-size="14" font-weight="900" fill="#ffffff" text-anchor="middle">+${card.bonusCount || 2}피</text>
        <text x="45" y="110" font-size="9" font-weight="900" fill="#111111" text-anchor="middle">보너스</text>
      `;
      break;
  }

  // 반반이 미니 실사 워터마크 뱃지 (하단 중앙에 앙증맞게 배치)
  const banbanBadge = `
    <g transform="translate(30, 88)">
      <circle cx="15" cy="15" r="14" fill="#ffffff" stroke="#ffd700" stroke-width="1.5" />
      <clipPath id="clip-banban-${card.id}">
        <circle cx="15" cy="15" r="13" />
      </clipPath>
      <image href="${card.img}" x="2" y="2" width="26" height="26" clip-path="url(#clip-banban-${card.id})" preserveAspectRatio="xMidYMid slice" />
    </g>
  `;

  return `
    <svg viewBox="0 0 90 130" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <!-- 카드 바탕 -->
      <rect x="0" y="0" width="90" height="130" rx="6" fill="#fffdf7" stroke="#b7094c" stroke-width="3" />
      <!-- 정통 화투 아트 -->
      ${artSvg}
      <!-- 띠 -->
      ${ribbonSvg}
      <!-- 광 -->
      ${gwangMark}
      <!-- 반반이 실사 워터마크 -->
      ${banbanBadge}
      <!-- 월 뱃지 (좌하단) -->
      ${m > 0 ? `<rect x="3" y="112" width="22" height="14" rx="3" fill="rgba(0,0,0,0.7)" /><text x="14" y="123" font-size="9" font-weight="900" fill="#ffd700" text-anchor="middle">${m}월</text>` : ''}
    </svg>
  `;
}

window.getHwatuSvg = getHwatuSvg;
