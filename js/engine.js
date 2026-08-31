/**
 * BANBAN GO-STOP - Full Korean Matgo (2-Player Go-Stop) Rules & Engine
 */

class GoStopEngine {
  constructor() {
    this.deck = [];
    this.groundCards = {}; // { 1: [card1, card2], 2: [...], ... 12: [...] }
    this.playerHand = [];
    this.aiHand = [];
    
    this.playerCaptured = { gwang: [], animal: [], ribbon: [], junk: [] };
    this.aiCaptured = { gwang: [], animal: [], ribbon: [], junk: [] };

    this.currentTurn = 'player'; // 'player' or 'ai'
    this.turnPhase = 'play'; // 'play' -> 'flip' -> 'resolve'
    this.isGameOver = false;

    this.playerGoCount = 0;
    this.aiGoCount = 0;

    this.playerScore = 0;
    this.aiScore = 0;

    this.lastAction = '';
    this.onEvent = null; // UI 이벤트 콜백
  }

  // 🎴 새 게임 딜링 (바닥 8장, 플레이어 10장, AI 10장, 덱 22장)
  startNewGame() {
    // 덱 셔플
    this.deck = [...window.CARDS_DATA];
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }

    this.groundCards = {};
    for (let m = 1; m <= 12; m++) {
      this.groundCards[m] = [];
    }

    this.playerHand = [];
    this.aiHand = [];
    this.playerCaptured = { gwang: [], animal: [], ribbon: [], junk: [] };
    this.aiCaptured = { gwang: [], animal: [], ribbon: [], junk: [] };
    this.playerGoCount = 0;
    this.aiGoCount = 0;
    this.playerScore = 0;
    this.aiScore = 0;
    this.currentTurn = 'player';
    this.isGameOver = false;

    // 바닥패 8장 깔기
    for (let i = 0; i < 8; i++) {
      const card = this.deck.pop();
      if (card.month === 0) { // 보너스피가 바닥에 깔리면 덱에서 추가
        this.groundCards[1].push(card);
      } else {
        this.groundCards[card.month].push(card);
      }
    }

    // 각 10장씩 배분
    for (let i = 0; i < 10; i++) {
      this.playerHand.push(this.deck.pop());
      this.aiHand.push(this.deck.pop());
    }

    this.sortHand(this.playerHand);
    this.sortHand(this.aiHand);

    if (this.onEvent) {
      this.onEvent('deal', { message: '반반이와의 맞고 한판 시작! 선은 마스터님입니다 🐾' });
    }
  }

  sortHand(hand) {
    hand.sort((a, b) => a.month - b.month);
  }

  // 플레이어가 패를 낼 때
  playCard(cardId, targetMatchId = null) {
    if (this.currentTurn !== 'player' || this.isGameOver) return;

    const handIdx = this.playerHand.findIndex(c => c.id === cardId);
    if (handIdx === -1) return;

    const playedCard = this.playerHand.splice(handIdx, 1)[0];
    this.executeTurn('player', playedCard, targetMatchId);
  }

  // AI 턴 자동 실행
  executeAiTurn() {
    if (this.currentTurn !== 'ai' || this.isGameOver) return;

    // AI 전략 판단
    const choice = this.decideAiCard();
    const playedCard = this.aiHand.splice(choice.handIdx, 1)[0];
    this.executeTurn('ai', playedCard, choice.targetMatchId);
  }

  // AI 판단 로직 (광/열/단/피 우선순위 계산)
  decideAiCard() {
    let bestChoice = { handIdx: 0, targetMatchId: null, score: -999 };

    this.aiHand.forEach((card, idx) => {
      const groundMatches = (card.month > 0 && this.groundCards[card.month]) ? this.groundCards[card.month] : [];
      let val = 0;

      if (groundMatches.length > 0) {
        val += 10; // 바닥에 먹을 게 있음
        groundMatches.forEach(gc => {
          if (gc.type === 'gwang') val += 20;
          if (gc.isGodori) val += 15;
          if (gc.type === 'ribbon') val += 8;
          if (gc.type === 'double') val += 12;
          if (gc.type === 'junk') val += 5;
        });
      } else {
        // 먹을 게 없을 땐 단순 피부터 버림
        if (card.type === 'junk') val += 2;
        if (card.type === 'ribbon') val -= 5;
        if (card.type === 'animal') val -= 10;
        if (card.type === 'gwang') val -= 20;
      }

      if (val > bestChoice.score) {
        bestChoice = {
          handIdx: idx,
          targetMatchId: groundMatches.length > 0 ? groundMatches[0].id : null,
          score: val
        };
      }
    });

    return bestChoice;
  }

  // 공통 턴 실행 로직 (손패 내기 -> 바닥 매칭 -> 덱 뒤집기 -> 획득/특수 룰)
  executeTurn(actor, playedCard, targetMatchId) {
    if (window.goStopAudio) window.goStopAudio.playCardSlap();

    const targetCaptured = actor === 'player' ? this.playerCaptured : this.aiCaptured;
    const opponentCaptured = actor === 'player' ? this.aiCaptured : this.playerCaptured;

    let turnLogs = [];
    let capturedThisTurn = [];

    // 1. 손패 매칭
    const month = playedCard.month;
    let handMatches = (month > 0 && this.groundCards[month]) ? this.groundCards[month] : [];

    let matchedFromHand = null;
    if (handMatches.length === 1) {
      matchedFromHand = handMatches.pop();
    } else if (handMatches.length === 2) {
      // 선택된 타겟 또는 첫 번째
      const tIdx = targetMatchId ? handMatches.findIndex(c => c.id === targetMatchId) : 0;
      matchedFromHand = handMatches.splice(tIdx >= 0 ? tIdx : 0, 1)[0];
    } else if (handMatches.length === 3) {
      // 3장 다 먹기
      turnLogs.push('바닥에 3장 묶음 모두 획득!');
    }

    // 2. 덱에서 1장 뒤집기
    const deckCard = this.deck.length > 0 ? this.deck.pop() : null;
    let matchedFromDeck = null;
    let isBbuck = false;
    let isJjok = false;
    let isTtadak = false;

    if (deckCard) {
      const deckMonth = deckCard.month;
      let deckMatches = (deckMonth > 0 && this.groundCards[deckMonth]) ? this.groundCards[deckMonth] : [];

      // 뻑 판정 (손패로 1장 매칭했는데 덱에서 같은 월이 또 나와서 3장이 묶임)
      if (deckMonth === month && matchedFromHand && deckMatches.length === 0) {
        isBbuck = true;
        this.groundCards[month].push(playedCard, matchedFromHand, deckCard);
        turnLogs.push(`${actor === 'player' ? '마스터님' : '반반이'} 뻑!! 😱`);
        if (window.goStopAudio) window.goStopAudio.playSpecial('bbuck');
      } 
      // 쪽 판정 (바닥에 낼 게 없어서 그냥 버렸는데 덱에서 같은 월이 나와서 붙임)
      else if (handMatches.length === 0 && deckMonth === month) {
        isJjok = true;
        capturedThisTurn.push(playedCard, deckCard);
        turnLogs.push(`쪽!! 상대 피 1장 뺏기! 🐾✨`);
        this.stealJunk(opponentCaptured, targetCaptured);
        if (window.goStopAudio) window.goStopAudio.playSpecial('jjok');
      }
      else {
        // 일반 덱 매칭
        if (deckMatches.length === 1) {
          matchedFromDeck = deckMatches.pop();
          capturedThisTurn.push(deckCard, matchedFromDeck);
        } else if (deckMatches.length === 2) {
          matchedFromDeck = deckMatches.pop();
          capturedThisTurn.push(deckCard, matchedFromDeck);
        } else if (deckMatches.length === 3) {
          capturedThisTurn.push(deckCard, ...deckMatches);
          this.groundCards[deckMonth] = [];
        } else {
          // 덱 카드 바닥에 깔림
          if (deckMonth > 0) this.groundCards[deckMonth].push(deckCard);
        }
      }
    }

    // 뻑이 아니면 손패 매칭물 획득
    if (!isBbuck) {
      if (matchedFromHand) {
        capturedThisTurn.push(playedCard, matchedFromHand);
      } else if (!isJjok && month > 0) {
        this.groundCards[month].push(playedCard);
      }

      // 따닥 판정 (손패로 2장 먹고, 덱에서도 2장 먹어서 총 4장 싹쓸이)
      if (matchedFromHand && matchedFromDeck && month === deckCard.month) {
        isTtadak = true;
        turnLogs.push(`따닥!! 상대 피 1장 뺏기! 💥`);
        this.stealJunk(opponentCaptured, targetCaptured);
        if (window.goStopAudio) window.goStopAudio.playSpecial('ttadak');
      }
    }

    // 쓸(싹쓸이) 판정: 바닥에 카드가 하나도 안 남았을 때
    const remainingGroundCount = Object.values(this.groundCards).reduce((sum, arr) => sum + arr.length, 0);
    if (remainingGroundCount === 0 && capturedThisTurn.length > 0) {
      turnLogs.push(`쓸 (싹쓸이)!! 상대 피 1장 뺏기! 🧹`);
      this.stealJunk(opponentCaptured, targetCaptured);
      if (window.goStopAudio) window.goStopAudio.playSpecial('sseul');
    }

    // 획득한 카드 분류 저장
    capturedThisTurn.forEach(card => {
      if (card.type === 'gwang') targetCaptured.gwang.push(card);
      else if (card.type === 'animal') targetCaptured.animal.push(card);
      else if (card.type === 'ribbon') targetCaptured.ribbon.push(card);
      else if (card.type === 'double') {
        targetCaptured.junk.push(card, { ...card, isDoubleSub: true }); // 쌍피는 2장으로
      } else {
        targetCaptured.junk.push(card);
      }
    });

    if (capturedThisTurn.length > 0 && window.goStopAudio) {
      window.goStopAudio.playCardCollect();
    }

    // 점수 재계산
    this.calculateScore('player');
    this.calculateScore('ai');

    // 턴 교대 또는 고/스톱 판정
    const currentScore = actor === 'player' ? this.playerScore : this.aiScore;
    const canDeclareGoStop = currentScore >= 7;

    if (this.onEvent) {
      this.onEvent('turnResult', {
        actor,
        playedCard,
        deckCard,
        capturedCount: capturedThisTurn.length,
        logs: turnLogs,
        canDeclareGoStop,
        playerScore: this.playerScore,
        aiScore: this.aiScore
      });
    }

    // 게임 종료 판정 (손패가 모두 소진된 경우)
    if (this.playerHand.length === 0 && this.aiHand.length === 0) {
      this.endGame();
      return;
    }

    if (!canDeclareGoStop || actor === 'ai') {
      if (actor === 'ai' && canDeclareGoStop) {
        // AI 고/스톱 판단 (점수가 높으면 고, 위험하면 스톱)
        if (this.aiScore >= 10 || Math.random() > 0.4) {
          this.declareStop('ai');
        } else {
          this.declareGo('ai');
        }
      } else {
        this.currentTurn = actor === 'player' ? 'ai' : 'player';
        if (this.currentTurn === 'ai') {
          setTimeout(() => this.executeAiTurn(), 900);
        }
      }
    }
  }

  // 상대 피 뺏기
  stealJunk(from, to) {
    if (from.junk.length > 0) {
      const stolen = from.junk.pop();
      to.junk.push(stolen);
    }
  }

  // 🏆 한국 정통 맞고 점수 계산 엔진
  calculateScore(target) {
    const cap = target === 'player' ? this.playerCaptured : this.aiCaptured;
    let score = 0;

    // 1. 광 계산 (3광=3점 / 비3광=2점 / 4광=4점 / 5광=15점)
    const gwangCount = cap.gwang.length;
    const hasBiGwang = cap.gwang.some(c => c.isBiGwang);
    if (gwangCount === 5) score += 15;
    else if (gwangCount === 4) score += 4;
    else if (gwangCount === 3) score += hasBiGwang ? 2 : 3;

    // 2. 열끗 계산 (5장부터 1점, 이후 +1점 / 고도리 5점)
    const animalCount = cap.animal.length;
    if (animalCount >= 5) score += (animalCount - 4);
    const godoriCount = cap.animal.filter(c => c.isGodori).length;
    if (godoriCount === 3) score += 5; // 고도리 (2, 4, 8월 열끗)

    // 3. 띠 계산 (5장부터 1점, 이후 +1점 / 홍단, 청단, 초단 각 3점)
    const ribbonCount = cap.ribbon.length;
    if (ribbonCount >= 5) score += (ribbonCount - 4);
    const hongCount = cap.ribbon.filter(c => c.ribbonType === 'hong').length;
    const cheongCount = cap.ribbon.filter(c => c.ribbonType === 'cheong').length;
    const choCount = cap.ribbon.filter(c => c.ribbonType === 'cho').length;
    if (hongCount === 3) score += 3;
    if (cheongCount === 3) score += 3;
    if (choCount === 3) score += 3;

    // 4. 피 계산 (10장부터 1점, 이후 1장당 +1점)
    const junkCount = cap.junk.length;
    if (junkCount >= 10) score += (junkCount - 9);

    if (target === 'player') this.playerScore = score;
    else this.aiScore = score;

    return score;
  }

  // 고(Go) 선언
  declareGo(actor) {
    if (window.goStopAudio) window.goStopAudio.playGo();
    if (actor === 'player') {
      this.playerGoCount++;
      if (this.onEvent) this.onEvent('goDeclared', { actor, count: this.playerGoCount, message: `${this.playerGoCount}고!! 멍멍! 계속 갑니다! 🚀` });
      this.currentTurn = 'ai';
      setTimeout(() => this.executeAiTurn(), 900);
    } else {
      this.aiGoCount++;
      if (this.onEvent) this.onEvent('goDeclared', { actor, count: this.aiGoCount, message: `반반이: ${this.aiGoCount}고 멍멍!! 🐾` });
      this.currentTurn = 'player';
    }
  }

  // 스톱(Stop) 선언 및 게임 종료
  declareStop(actor) {
    if (window.goStopAudio) window.goStopAudio.playStop();
    this.isGameOver = true;
    
    // 최종 박 배수 계산 (피박, 광박, 멍텅구리, 고 배수)
    const winnerScore = actor === 'player' ? this.playerScore : this.aiScore;
    const loserCap = actor === 'player' ? this.aiCaptured : this.playerCaptured;
    const goCount = actor === 'player' ? this.playerGoCount : this.aiGoCount;

    let multiplier = 1;
    let bonuses = [];

    // 고 배수
    if (goCount === 1) bonuses.push('1고 (+1점)');
    if (goCount === 2) bonuses.push('2고 (+2점)');
    if (goCount >= 3) {
      const m = Math.pow(2, goCount - 2);
      multiplier *= m;
      bonuses.push(`${goCount}고 (${m}배)`);
    }

    // 피박 판정 (승자가 피로 점수를 냈고, 패자 피가 1~7장일 때)
    const winnerCap = actor === 'player' ? this.playerCaptured : this.aiCaptured;
    if (winnerCap.junk.length >= 10 && loserCap.junk.length >= 1 && loserCap.junk.length <= 7) {
      multiplier *= 2;
      bonuses.push('피박 (2배)');
    }

    // 광박 판정 (승자가 광으로 점수를 냈고, 패자 광이 0장일 때)
    if (winnerCap.gwang.length >= 3 && loserCap.gwang.length === 0) {
      multiplier *= 2;
      bonuses.push('광박 (2배)');
    }

    const finalCalculatedScore = Math.max(7, winnerScore) * multiplier;

    if (this.onEvent) {
      this.onEvent('gameEnd', {
        winner: actor,
        baseScore: winnerScore,
        multiplier,
        bonuses,
        finalScore: finalCalculatedScore
      });
    }
  }

  endGame() {
    this.isGameOver = true;
    // 패가 다 떨어졌을 때 점수 높은 쪽 승리 또는 무승부(나가리)
    if (this.playerScore > this.aiScore && this.playerScore >= 7) {
      this.declareStop('player');
    } else if (this.aiScore > this.playerScore && this.aiScore >= 7) {
      this.declareStop('ai');
    } else {
      if (this.onEvent) this.onEvent('draw', { message: '나가리 (무승부)! 다음 판 2배!' });
    }
  }
}

window.GoStopEngine = GoStopEngine;
