/**
 * BANBAN MATGO - Realistic 3D Card Flip, Smooth Choreography & Overlap Physics Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  const engine = new window.GoStopEngine();

  // DOM Elements
  const appContainer = document.querySelector('.gostop-app');
  const groundGrid = document.getElementById('groundGrid');
  const userHandRow = document.getElementById('userHandRow');
  const aiHandRow = document.getElementById('aiHandRow');
  const aiAvatar = document.getElementById('aiAvatar');
  const centerDeck = document.getElementById('centerDeck');
  const deckCount = document.getElementById('deckCount');
  const actionBanner = document.getElementById('actionBanner');
  const flyLayer = document.getElementById('flyLayer');

  const selectBet = document.getElementById('selectBet');
  const userMoney = document.getElementById('userMoney');
  const aiMoney = document.getElementById('aiMoney');
  const userScore = document.getElementById('userScore');
  const aiScore = document.getElementById('aiScore');
  const userSpeech = document.getElementById('userSpeech');
  const aiSpeech = document.getElementById('aiSpeech');

  const userGwang = document.getElementById('userGwang');
  const userAnimal = document.getElementById('userAnimal');
  const userRibbon = document.getElementById('userRibbon');
  const userJunk = document.getElementById('userJunk');

  const aiGwang = document.getElementById('aiGwang');
  const aiAnimal = document.getElementById('aiAnimal');
  const aiRibbon = document.getElementById('aiRibbon');
  const aiJunk = document.getElementById('aiJunk');

  const userTurnBadge = document.getElementById('userTurnBadge');
  const aiTurnBadge = document.getElementById('aiTurnBadge');

  const goStopModal = document.getElementById('goStopModal');
  const goStopDesc = document.getElementById('goStopDesc');
  const btnDeclareGo = document.getElementById('btnDeclareGo');
  const btnDeclareStop = document.getElementById('btnDeclareStop');

  const choiceModal = document.getElementById('choiceModal');
  const choiceCardsRow = document.getElementById('choiceCardsRow');

  const resultModal = document.getElementById('resultModal');
  const resultTitle = document.getElementById('resultTitle');
  const resultDetails = document.getElementById('resultDetails');
  const btnRestartResult = document.getElementById('btnRestartResult');

  const btnNewGame = document.getElementById('btnNewGame');
  const btnSound = document.getElementById('btnSound');
  const btnRules = document.getElementById('btnRules');
  const rulesModal = document.getElementById('rulesModal');
  const btnCloseRules = document.getElementById('btnCloseRules');

  let pendingPlayCardId = null;

  // 🎴 화투패 DOM 생성
  function createCardElement(card, isBack = false) {
    const cardEl = document.createElement('div');
    cardEl.className = `hwatu-card ${isBack ? 'card-back' : ''}`;
    cardEl.dataset.id = card.id;
    cardEl.dataset.month = card.month;

    if (isBack) {
      cardEl.innerHTML = `<div class="card-back-pattern">🎴</div>`;
      return cardEl;
    }

    let badgeHtml = '';
    if (card.type === 'gwang') {
      badgeHtml = `<div class="card-badge-gwang">光</div>`;
    } else if (card.type === 'ribbon') {
      const cls = card.ribbonType === 'hong' ? 'badge-hong' : (card.ribbonType === 'cheong' ? 'badge-cheong' : 'badge-cho');
      const text = card.ribbonType === 'hong' ? '홍단' : (card.ribbonType === 'cheong' ? '청단' : '초단');
      badgeHtml = `<div class="card-badge-dan ${cls}">${text}</div>`;
    } else if (card.isGodori) {
      badgeHtml = `<div class="card-badge-dan badge-godori">고도리</div>`;
    } else if (card.type === 'double') {
      badgeHtml = `<div class="card-badge-dan badge-double">쌍피</div>`;
    }

    const monthLabel = card.month === 0 ? '보너스' : `${card.month}월`;

    cardEl.innerHTML = `
      ${badgeHtml}
      <img src="${card.img}" alt="${card.name}" class="hwatu-real-img">
      <span class="card-month-tag">${monthLabel}</span>
    `;

    return cardEl;
  }

  // ✨ 바닥 매칭 하이라이트
  function highlightMatchesOnGround(month) {
    clearGroundHighlights();
    if (!month || month === 0) return;

    const matchedCards = groundGrid.querySelectorAll(`.hwatu-card[data-month="${month}"]`);
    matchedCards.forEach(cardEl => {
      cardEl.classList.add('match-highlight');
    });
  }

  function clearGroundHighlights() {
    const highlighted = groundGrid.querySelectorAll('.match-highlight');
    highlighted.forEach(el => el.classList.remove('match-highlight'));
  }

  // 💥 바닥 슬램 충격파 링 생성
  function createSlamShockwave(x, y) {
    const wave = document.createElement('div');
    wave.className = 'slam-shockwave';
    wave.style.left = `${x}px`;
    wave.style.top = `${y}px`;
    document.body.appendChild(wave);
    setTimeout(() => wave.remove(), 400);
  }

  // 🌟 거대 붓글씨 임팩트 배너
  function triggerGrandEffect(text) {
    const banner = document.createElement('div');
    banner.className = 'grand-effect-banner';
    banner.textContent = text;
    document.body.appendChild(banner);
    setTimeout(() => banner.remove(), 1300);
  }

  // 🚀 1. 손패 비행 (손목 스냅 3D 아크 & 포개짐 슬램)
  async function performHandCardFlight(originType, targetMonth, card, customOriginRect = null) {
    const slotEl = groundGrid.querySelector(`.ground-slot[data-month="${targetMonth}"]`) || groundGrid;
    const existingCards = slotEl.querySelectorAll('.hwatu-card');
    const destRect = slotEl.getBoundingClientRect();

    let originRect;
    let isBack = false;

    if (originType === 'player') {
      originRect = customOriginRect || userHandRow.getBoundingClientRect();
    } else {
      const aiCards = aiHandRow.querySelectorAll('.hwatu-card');
      if (aiCards.length > 0) {
        originRect = aiCards[Math.floor(aiCards.length / 2)].getBoundingClientRect();
      } else {
        originRect = aiAvatar.getBoundingClientRect();
      }
      isBack = true;
    }

    const flyingCard = createCardElement(card, isBack);
    flyingCard.classList.add('flying-card-anim');

    // 출발 위치에서 손을 높이 들어 올린 3D 붕 뜸
    flyingCard.style.position = 'fixed';
    flyingCard.style.left = `${originRect.left}px`;
    flyingCard.style.top = `${originRect.top}px`;
    flyingCard.style.width = `${originRect.width || 68}px`;
    flyingCard.style.height = `${originRect.height || 108}px`;
    flyingCard.style.transform = isBack ? 'scale(1.2) rotate(16deg) translateY(-25px)' : 'scale(1.35) rotate(-14deg) translateY(-35px)';
    flyingCard.style.zIndex = '10002';
    flyingCard.style.transition = 'none';
    document.body.appendChild(flyingCard);

    // 포개짐 오프셋 계산
    const overlapCount = existingCards.length;
    const offsetX = overlapCount > 0 ? (overlapCount * 10) : 0;
    const offsetY = overlapCount > 0 ? (overlapCount * 12) : 0;
    const targetRotate = overlapCount > 0 ? (overlapCount % 2 === 0 ? 6 : -6) : 0;

    const targetX = destRect.left + 2 + offsetX;
    const targetY = destRect.top + 2 + offsetY;

    await new Promise(r => requestAnimationFrame(r));
    flyingCard.style.transition = 'all 0.45s cubic-bezier(0.12, 0.88, 0.28, 1.05)';
    flyingCard.style.left = `${targetX}px`;
    flyingCard.style.top = `${targetY}px`;
    flyingCard.style.width = '64px';
    flyingCard.style.height = '100px';
    flyingCard.style.transform = `scale(1.0) rotate(${targetRotate}deg) translateY(0px)`;

    await new Promise(r => setTimeout(r, 450));

    // 착지 순간 바닥 카드 반동 + 슬램 사운드 + 충격파
    if (existingCards.length > 0) {
      existingCards.forEach(c => {
        c.classList.remove('card-impact-jolt');
        void c.offsetWidth;
        c.classList.add('card-impact-jolt');
      });
    }

    const centerX = targetX + 32;
    const centerY = targetY + 50;
    createSlamShockwave(centerX, centerY);

    if (window.goStopAudio) window.goStopAudio.playCardSlap(1.35);
    appContainer.classList.add('screen-shake');
    setTimeout(() => appContainer.classList.remove('screen-shake'), 150);

    flyingCard.remove();
  }

  // 🎴 2. 중앙 덱 3D 뒤집기(Card Flip) 비행 연출
  async function performDeckFlipFlight(targetMonth, card) {
    const originRect = centerDeck.getBoundingClientRect();
    const slotEl = groundGrid.querySelector(`.ground-slot[data-month="${targetMonth}"]`) || groundGrid;
    const existingCards = slotEl.querySelectorAll('.hwatu-card');
    const destRect = slotEl.getBoundingClientRect();

    // 3D Flip 컨테이너 생성
    const flipWrap = document.createElement('div');
    flipWrap.className = 'flip-card-3d-wrap';
    flipWrap.style.left = `${originRect.left}px`;
    flipWrap.style.top = `${originRect.top}px`;
    flipWrap.style.transform = 'scale(1.3) translateY(-30px)';

    const flipInner = document.createElement('div');
    flipInner.className = 'flip-card-inner';
    flipInner.style.transform = 'rotateY(180deg)'; // 시작은 뒷면!

    const cardBack = document.createElement('div');
    cardBack.className = 'flip-card-back';
    cardBack.innerHTML = '🎴';

    const cardFront = document.createElement('div');
    cardFront.className = 'flip-card-front';
    const realCardEl = createCardElement(card, false);
    cardFront.appendChild(realCardEl);

    flipInner.appendChild(cardBack);
    flipInner.appendChild(cardFront);
    flipWrap.appendChild(flipInner);
    document.body.appendChild(flipWrap);

    // 포개짐 오프셋 계산
    const overlapCount = existingCards.length;
    const offsetX = overlapCount > 0 ? (overlapCount * 10) : 0;
    const offsetY = overlapCount > 0 ? (overlapCount * 12) : 0;
    const targetRotate = overlapCount > 0 ? (overlapCount % 2 === 0 ? 6 : -6) : 0;

    const targetX = destRect.left + 2 + offsetX;
    const targetY = destRect.top + 2 + offsetY;

    await new Promise(r => requestAnimationFrame(r));
    // 공중으로 떠오르며 3D 뒤집어지기 실행!
    flipWrap.style.transition = 'all 0.52s cubic-bezier(0.15, 0.85, 0.35, 1.1)';
    flipWrap.style.left = `${targetX}px`;
    flipWrap.style.top = `${targetY}px`;
    flipWrap.style.transform = `scale(1.0) rotate(${targetRotate}deg) translateY(0px)`;
    flipInner.style.transform = 'rotateY(0deg)'; // 앞면으로 촤르륵 까짐!

    await new Promise(r => setTimeout(r, 520));

    // 착지 순간
    if (existingCards.length > 0) {
      existingCards.forEach(c => {
        c.classList.remove('card-impact-jolt');
        void c.offsetWidth;
        c.classList.add('card-impact-jolt');
      });
    }

    const centerX = targetX + 32;
    const centerY = targetY + 50;
    createSlamShockwave(centerX, centerY);

    if (window.goStopAudio) window.goStopAudio.playCardSlap(1.4);
    appContainer.classList.add('screen-shake');
    setTimeout(() => appContainer.classList.remove('screen-shake'), 150);

    flipWrap.remove();
  }

  // 📥 3. 매칭된 패 수거(먹기) 애니메이션
  async function performCaptureAnimation(actor, month, cards) {
    if (!cards || cards.length === 0) return;

    const slotEl = groundGrid.querySelector(`.ground-slot[data-month="${month}"]`);
    if (!slotEl) return;
    const fromRect = slotEl.getBoundingClientRect();

    const targetRow = actor === 'player' ? document.getElementById('userCapturedRow') : document.getElementById('aiCapturedRow');
    const toRect = targetRow.getBoundingClientRect();

    const animCard = createCardElement(cards[0], false);
    animCard.className = 'hwatu-card absorbing-card-anim';
    animCard.style.left = `${fromRect.left}px`;
    animCard.style.top = `${fromRect.top}px`;
    animCard.style.transform = 'scale(1.0)';
    document.body.appendChild(animCard);

    await new Promise(r => requestAnimationFrame(r));
    animCard.style.left = `${toRect.left + 20}px`;
    animCard.style.top = `${toRect.top + 10}px`;
    animCard.style.transform = 'scale(0.65) rotate(15deg)';
    animCard.style.opacity = '0.3';

    await new Promise(r => setTimeout(r, 360));
    animCard.remove();
  }

  // 전체 화면 렌더링
  function renderAll() {
    renderUserHand();
    renderAiHand();
    renderGround();
    renderCaptured();
    updateMoneyAndScores();
    updateTurnBadges();
    deckCount.textContent = engine.deck.length;
  }

  // 내 손패 렌더링
  function renderUserHand() {
    userHandRow.innerHTML = '';
    engine.playerHand.forEach(card => {
      const el = createCardElement(card);
      el.addEventListener('mouseenter', () => highlightMatchesOnGround(card.month));
      el.addEventListener('mouseleave', clearGroundHighlights);
      el.addEventListener('click', () => onUserCardClick(card, el));
      userHandRow.appendChild(el);
    });
  }

  // AI 손패 렌더링
  function renderAiHand() {
    aiHandRow.innerHTML = '';
    engine.aiHand.forEach(card => {
      const el = createCardElement(card, true);
      aiHandRow.appendChild(el);
    });
  }

  // 바닥패 렌더링
  function renderGround() {
    groundGrid.innerHTML = '';
    for (let m = 1; m <= 12; m++) {
      const slot = document.createElement('div');
      slot.className = 'ground-slot';
      slot.dataset.month = m;

      const cardsInMonth = engine.groundCards[m] || [];
      cardsInMonth.forEach((card, idx) => {
        const cardEl = createCardElement(card);
        if (idx > 0) {
          cardEl.style.transform = `translate(${idx * 8}px, ${idx * 8}px) rotate(${idx % 2 === 0 ? 4 : -4}deg)`;
        }
        slot.appendChild(cardEl);
      });

      groundGrid.appendChild(slot);
    }
  }

  // 획득패 렌더링
  function renderCaptured() {
    const renderGroup = (container, cards) => {
      container.innerHTML = '';
      cards.forEach((card) => {
        container.appendChild(createCardElement(card));
      });
    };

    renderGroup(userGwang, engine.playerCaptured.gwang);
    renderGroup(userAnimal, engine.playerCaptured.animal);
    renderGroup(userRibbon, engine.playerCaptured.ribbon);
    renderGroup(userJunk, engine.playerCaptured.junk);

    renderGroup(aiGwang, engine.aiCaptured.gwang);
    renderGroup(aiAnimal, engine.aiCaptured.animal);
    renderGroup(aiRibbon, engine.aiCaptured.ribbon);
    renderGroup(aiJunk, engine.aiCaptured.junk);
  }

  // 머니 & 점수 갱신
  function updateMoneyAndScores() {
    userMoney.textContent = `${engine.playerMoney.toLocaleString()}원`;
    aiMoney.textContent = `${engine.aiMoney.toLocaleString()}원`;
    userScore.textContent = `${engine.playerScore} 점`;
    aiScore.textContent = `${engine.aiScore} 점`;
  }

  // 턴 표시기
  function updateTurnBadges() {
    if (engine.currentTurn === 'player') {
      userTurnBadge.classList.add('active');
      aiTurnBadge.classList.remove('active');
      userSpeech.textContent = `칠 화투패를 터치하세요! (판돈: 점당 ${engine.pointBet.toLocaleString()}원) 🎴`;
    } else {
      userTurnBadge.classList.remove('active');
      aiTurnBadge.classList.add('active');
    }
  }

  // 액션 배너 알림
  function showBanner(text) {
    actionBanner.textContent = text;
    actionBanner.classList.add('show');
    setTimeout(() => {
      actionBanner.classList.remove('show');
    }, 1500);
  }

  // 유저 카드 클릭 핸들러
  async function onUserCardClick(card, cardEl) {
    if (engine.currentTurn !== 'player' || engine.isGameOver || engine.isProcessing) return;
    if (window.goStopAudio) window.goStopAudio.init();

    clearGroundHighlights();
    const groundMatches = engine.groundCards[card.month] || [];

    if (groundMatches.length === 2) {
      pendingPlayCardId = card.id;
      showChoiceModal(groundMatches);
    } else {
      const originRect = cardEl.getBoundingClientRect();
      cardEl.style.opacity = '0';
      await performHandCardFlight('player', card.month, card, originRect);
      await engine.playCard(card.id);
      renderAll();
    }
  }

  function showChoiceModal(choices) {
    choiceCardsRow.innerHTML = '';
    choices.forEach(c => {
      const el = createCardElement(c);
      el.addEventListener('click', async () => {
        choiceModal.classList.add('hidden');
        
        const userCardEl = userHandRow.querySelector(`.hwatu-card[data-id="${pendingPlayCardId}"]`);
        const originRect = userCardEl ? userCardEl.getBoundingClientRect() : userHandRow.getBoundingClientRect();
        if (userCardEl) userCardEl.style.opacity = '0';
        
        const cardObj = engine.playerHand.find(cd => cd.id === pendingPlayCardId);
        if (cardObj) {
          await performHandCardFlight('player', cardObj.month, cardObj, originRect);
        }

        await engine.playCard(pendingPlayCardId, c.id);
        pendingPlayCardId = null;
        renderAll();
      });
      choiceCardsRow.appendChild(el);
    });
    choiceModal.classList.remove('hidden');
  }

  // 엔진 비동기 이벤트 핸들러
  engine.onEvent = async (type, data) => {
    if (type === 'deal') {
      showBanner(data.message);
      renderAll();
    } else if (type === 'aiThinking') {
      aiSpeech.textContent = data.message;
      aiTurnBadge.classList.add('active');
    } else if (type === 'cardPlayed') {
      if (data.actor === 'ai') {
        aiSpeech.textContent = `${data.card.name} 낸다 멍멍! 🐾`;
        await performHandCardFlight('ai', data.card.month, data.card);
        renderAll();
      }
    } else if (type === 'deckFlipped') {
      // 🌟 중앙 덱 3D 뒤집기(Card Flip) 비행 실행!
      await performDeckFlipFlight(data.card.month, data.card);
      renderAll();
    } else if (type === 'cardsCaptured') {
      // 🌟 매칭된 패 수거(먹기) 비행 실행!
      await performCaptureAnimation(data.actor, data.month, data.cards);
      renderAll();
    } else if (type === 'turnResult') {
      if (data.logs.length > 0) {
        data.logs.forEach(log => {
          if (log.includes('쪽')) triggerGrandEffect('쪽!! 🐾');
          else if (log.includes('따닥')) triggerGrandEffect('따닥!! 💥');
          else if (log.includes('뻑')) triggerGrandEffect('뻑!! 😱');
          else if (log.includes('쓸')) triggerGrandEffect('싹쓸이!! 🧹');
        });
        showBanner(data.logs.join(' | '));
      }
      renderAll();

      if (data.canDeclareGoStop && data.actor === 'player') {
        const estWon = data.playerScore * engine.pointBet;
        goStopDesc.innerHTML = `현재 점수: <strong>${data.playerScore}점</strong><br>예상 획득 머니: <span style="color:#ffd700; font-weight:900;">${estWon.toLocaleString()}원</span>`;
        goStopModal.classList.remove('hidden');
      }
    } else if (type === 'goDeclared') {
      triggerGrandEffect(`${data.count}고!! 🔥`);
      showBanner(data.message);
      renderAll();
    } else if (type === 'gameEnd') {
      renderAll();
      showResultModal(data);
    } else if (type === 'draw') {
      triggerGrandEffect('나가리!!');
      showBanner(data.message);
      renderAll();
    }
  };

  btnDeclareGo.addEventListener('click', () => {
    goStopModal.classList.add('hidden');
    engine.declareGo('player');
  });

  btnDeclareStop.addEventListener('click', () => {
    goStopModal.classList.add('hidden');
    triggerGrandEffect('스톱!! 🛑');
    engine.declareStop('player');
  });

  // 머니 정산 모달
  function showResultModal(data) {
    const isPlayerWin = data.winner === 'player';
    resultTitle.textContent = isPlayerWin ? '마스터님 완승!! 🏆' : '반반이 승리! 🐶';
    const bonusText = data.bonuses.length > 0 ? `<p style="color:#cbd5e1; font-size:0.85rem;">적용 배수: ${data.bonuses.join(', ')}</p>` : '';
    
    const wonSign = isPlayerWin ? '+' : '-';
    const wonColor = isPlayerWin ? '#ffd700' : '#ff8080';

    let chargeBtnHtml = '';
    if (data.isBankrupt && !isPlayerWin) {
      chargeBtnHtml = `<p style="color:#ff4d6d; font-weight:900; margin:6px 0;">올인(파산)! 1,000,000원 무료 충전 지원!</p>`;
      engine.resetMoney();
    }

    resultDetails.innerHTML = `
      <p style="font-size:1.1rem; font-weight:700;">기본 점수: ${data.baseScore}점 × ${data.multiplier}배 = <strong>${data.finalScore}점</strong></p>
      ${bonusText}
      <h3 style="font-size:1.6rem; color:${wonColor}; margin:10px 0; text-shadow:0 0 15px ${wonColor};">
        ${wonSign}${data.wonMoney.toLocaleString()}원
      </h3>
      <p style="font-size:0.9rem; color:#94a3b8;">내 소지금: ${data.playerMoney.toLocaleString()}원 | 반반이: ${data.aiMoney.toLocaleString()}원</p>
      ${chargeBtnHtml}
    `;

    resultModal.classList.remove('hidden');
  }

  btnRestartResult.addEventListener('click', () => {
    resultModal.classList.add('hidden');
    engine.startNewGame();
    renderAll();
  });

  btnNewGame.addEventListener('click', () => {
    if (window.goStopAudio) window.goStopAudio.init();
    engine.startNewGame();
    renderAll();
  });

  selectBet.addEventListener('change', (e) => {
    const betVal = parseInt(e.target.value, 10);
    engine.setPointBet(betVal);
    showBanner(`판돈이 점당 ${betVal.toLocaleString()}원으로 변경되었습니다! 💰`);
  });

  btnSound.addEventListener('click', () => {
    const isMuted = window.goStopAudio.toggleMute();
    btnSound.textContent = isMuted ? '🔇' : '🔊';
  });

  btnRules.addEventListener('click', () => rulesModal.classList.remove('hidden'));
  btnCloseRules.addEventListener('click', () => rulesModal.classList.add('hidden'));

  // 최초 게임 시작
  engine.startNewGame();
  renderAll();
});
