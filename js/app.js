/**
 * BANBAN GO-STOP - Main Application Controller & DOM Binder
 */

document.addEventListener('DOMContentLoaded', () => {
  const engine = new window.GoStopEngine();

  // DOM Elements
  const groundGrid = document.getElementById('groundGrid');
  const userHandRow = document.getElementById('userHandRow');
  const aiHandRow = document.getElementById('aiHandRow');
  const deckCount = document.getElementById('deckCount');
  const actionBanner = document.getElementById('actionBanner');

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

  // 🎴 화투패 DOM 요소 생성 함수
  function createCardElement(card, isBack = false, isSmall = false) {
    const cardEl = document.createElement('div');
    cardEl.className = `hwatu-card ${isBack ? 'card-back' : ''}`;
    cardEl.dataset.id = card.id;
    cardEl.dataset.month = card.month;

    if (isBack) {
      cardEl.innerHTML = `<div class="card-back-pattern">🎴</div>`;
      return cardEl;
    }

    // 뱃지 판정
    let badgeHtml = '';
    if (card.type === 'gwang') {
      badgeHtml = `<div class="card-badge-gwang">光</div>`;
    } else if (card.type === 'ribbon') {
      const cls = card.ribbonType === 'hong' ? 'badge-hong' : (card.ribbonType === 'cheong' ? 'badge-cheong' : 'badge-cho');
      const text = card.ribbonType === 'hong' ? '홍단' : (card.ribbonType === 'cheong' ? '청단' : '초단');
      badgeHtml = `<div class="card-badge-dan ${cls}">${text}</div>`;
    }

    const monthLabel = card.month === 0 ? '보너스' : `${card.month}월`;

    cardEl.innerHTML = `
      ${badgeHtml}
      <div class="card-img-wrap">
        <img src="${card.img}" alt="${card.name}">
      </div>
      <div class="card-meta-bar">
        <span>${monthLabel}</span>
        <span>${card.banbanText || (card.type === 'junk' ? '피' : '열')}</span>
      </div>
    `;

    return cardEl;
  }

  // 전체 화면 렌더링
  function renderAll() {
    renderUserHand();
    renderAiHand();
    renderGround();
    renderCaptured();
    updateScores();
    updateTurnBadges();
    deckCount.textContent = engine.deck.length;
  }

  // 내 손패 렌더링
  function renderUserHand() {
    userHandRow.innerHTML = '';
    engine.playerHand.forEach(card => {
      const el = createCardElement(card);
      el.addEventListener('click', () => onUserCardClick(card));
      userHandRow.appendChild(el);
    });
  }

  // AI 손패 렌더링 (뒷면)
  function renderAiHand() {
    aiHandRow.innerHTML = '';
    engine.aiHand.forEach(card => {
      const el = createCardElement(card, true);
      aiHandRow.appendChild(el);
    });
  }

  // 바닥패 렌더링 (12개 월 슬롯)
  function renderGround() {
    groundGrid.innerHTML = '';
    for (let m = 1; m <= 12; m++) {
      const slot = document.createElement('div');
      slot.className = 'ground-slot';
      slot.dataset.month = m;

      const cardsInMonth = engine.groundCards[m] || [];
      cardsInMonth.forEach(card => {
        const cardEl = createCardElement(card);
        slot.appendChild(cardEl);
      });

      groundGrid.appendChild(slot);
    }
  }

  // 획득패 렌더링
  function renderCaptured() {
    const renderGroup = (container, cards) => {
      container.innerHTML = '';
      cards.forEach(card => {
        container.appendChild(createCardElement(card, false, true));
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

  // 점수 갱신
  function updateScores() {
    userScore.textContent = `${engine.playerScore} 점`;
    aiScore.textContent = `${engine.aiScore} 점`;
  }

  // 턴 표시기
  function updateTurnBadges() {
    if (engine.currentTurn === 'player') {
      userTurnBadge.classList.add('active');
      aiTurnBadge.classList.remove('active');
      userSpeech.textContent = '손패에서 칠 화투패를 선택하세요! 🎴';
    } else {
      userTurnBadge.classList.remove('active');
      aiTurnBadge.classList.add('active');
      aiSpeech.textContent = '어떤 걸 먹을까 멍멍... 🐾';
    }
  }

  // 액션 배너 알림
  function showBanner(text) {
    actionBanner.textContent = text;
    actionBanner.classList.add('show');
    setTimeout(() => {
      actionBanner.classList.remove('show');
    }, 1400);
  }

  // 플레이어 카드 클릭 이벤트
  function onUserCardClick(card) {
    if (engine.currentTurn !== 'player' || engine.isGameOver) return;
    if (window.goStopAudio) window.goStopAudio.init();

    const groundMatches = engine.groundCards[card.month] || [];

    // 바닥에 같은 월이 2장 있으면 유저가 선택하도록 팝업
    if (groundMatches.length === 2) {
      pendingPlayCardId = card.id;
      showChoiceModal(groundMatches);
    } else {
      engine.playCard(card.id);
      renderAll();
    }
  }

  // 선택 모달
  function showChoiceModal(choices) {
    choiceCardsRow.innerHTML = '';
    choices.forEach(c => {
      const el = createCardElement(c);
      el.addEventListener('click', () => {
        choiceModal.classList.add('hidden');
        engine.playCard(pendingPlayCardId, c.id);
        pendingPlayCardId = null;
        renderAll();
      });
      choiceCardsRow.appendChild(el);
    });
    choiceModal.classList.remove('hidden');
  }

  // 엔진 이벤트 핸들러
  engine.onEvent = (type, data) => {
    if (type === 'deal') {
      showBanner('화투패 분배 완료! 게임 시작 🎴');
    } else if (type === 'turnResult') {
      if (data.logs.length > 0) {
        showBanner(data.logs.join(' | '));
      }
      renderAll();

      if (data.canDeclareGoStop && data.actor === 'player') {
        goStopDesc.textContent = `현재 점수: ${data.playerScore}점 달성!`;
        goStopModal.classList.remove('hidden');
      }
    } else if (type === 'goDeclared') {
      showBanner(data.message);
      renderAll();
    } else if (type === 'gameEnd') {
      renderAll();
      showResultModal(data);
    } else if (type === 'draw') {
      showBanner(data.message);
      renderAll();
    }
  };

  // 고/스톱 선언 버튼
  btnDeclareGo.addEventListener('click', () => {
    goStopModal.classList.add('hidden');
    engine.declareGo('player');
  });

  btnDeclareStop.addEventListener('click', () => {
    goStopModal.classList.add('hidden');
    engine.declareStop('player');
  });

  // 결과 모달
  function showResultModal(data) {
    resultTitle.textContent = data.winner === 'player' ? '마스터님 완승!! 🏆' : '반반이 승리! 🐶';
    const bonusText = data.bonuses.length > 0 ? `<p>적용 배수: ${data.bonuses.join(', ')}</p>` : '';
    resultDetails.innerHTML = `
      <p style="font-size:1.1rem; font-weight:700; color:var(--gold-accent);">기본 점수: ${data.baseScore}점 × ${data.multiplier}배</p>
      ${bonusText}
      <h3 style="font-size:1.4rem; color:#ff8080; margin-top:8px;">최종 점수: ${data.finalScore}점</h3>
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
