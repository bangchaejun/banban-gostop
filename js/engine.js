/**
 * BANBAN GO-STOP - Money Betting System & Step-by-Step Game Engine
 */

class GoStopEngine {
  constructor() {
    this.deck = [];
    this.groundCards = {};
    this.playerHand = [];
    this.aiHand = [];
    
    this.playerCaptured = { gwang: [], animal: [], ribbon: [], junk: [] };
    this.aiCaptured = { gwang: [], animal: [], ribbon: [], junk: [] };

    this.currentTurn = 'player';
    this.isGameOver = false;
    this.isProcessing = false;

    this.playerGoCount = 0;
    this.aiGoCount = 0;

    this.playerScore = 0;
    this.aiScore = 0;

    // 💰 실제 머니 베팅 시스템
    this.pointBet = 100; // 점당 100원 (기본), 500원, 1,000원
    this.playerMoney = parseInt(localStorage.getItem('banban_player_money') || '1000000', 10);
    this.aiMoney = parseInt(localStorage.getItem('banban_ai_money') || '1000000', 10);

    this.onEvent = null;
  }

  setPointBet(amount) {
    this.pointBet = amount;
  }

  saveMoney() {
    localStorage.setItem('banban_player_money', this.playerMoney);
    localStorage.setItem('banban_ai_money', this.aiMoney);
  }

  resetMoney() {
    this.playerMoney = 1000000;
    this.aiMoney = 1000000;
    this.saveMoney();
  }

  startNewGame() {
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
    this.isProcessing = false;

    // 바닥 8장 깔기
    for (let i = 0; i < 8; i++) {
      const card = this.deck.pop();
      if (card.month === 0) {
        this.groundCards[1].push(card);
      } else {
        this.groundCards[card.month].push(card);
      }
    }

    // 각 10장 배분
    for (let i = 0; i < 10; i++) {
      this.playerHand.push(this.deck.pop());
      this.aiHand.push(this.deck.pop());
    }

    this.sortHand(this.playerHand);
    this.sortHand(this.aiHand);

    if (this.onEvent) {
      this.onEvent('deal', { message: `반반이 맞고 판돈(점당 ${this.pointBet.toLocaleString()}원) 세팅 완료! 🎴` });
    }
  }

  sortHand(hand) {
    hand.sort((a, b) => a.month - b.month);
  }

  async playCard(cardId, targetMatchId = null) {
    if (this.currentTurn !== 'player' || this.isGameOver || this.isProcessing) return;

    const handIdx = this.playerHand.findIndex(c => c.id === cardId);
    if (handIdx === -1) return;

    this.isProcessing = true;
    const playedCard = this.playerHand.splice(handIdx, 1)[0];
    await this.executeTurnStepByStep('player', playedCard, targetMatchId);
    this.isProcessing = false;
  }

  async executeAiTurn() {
    if (this.currentTurn !== 'ai' || this.isGameOver || this.isProcessing) return;

    this.isProcessing = true;
    const choice = this.decideAiCard();
    const playedCard = this.aiHand.splice(choice.handIdx, 1)[0];
    await this.executeTurnStepByStep('ai', playedCard, choice.targetMatchId);
    this.isProcessing = false;
  }

  decideAiCard() {
    let bestChoice = { handIdx: 0, targetMatchId: null, score: -999 };

    this.aiHand.forEach((card, idx) => {
      const groundMatches = (card.month > 0 && this.groundCards[card.month]) ? this.groundCards[card.month] : [];
      let val = 0;

      if (groundMatches.length > 0) {
        val += 10;
        groundMatches.forEach(gc => {
          if (gc.type === 'gwang') val += 20;
          if (gc.isGodori) val += 15;
          if (gc.type === 'ribbon') val += 8;
          if (gc.type === 'double') val += 12;
          if (gc.type === 'junk') val += 5;
        });
      } else {
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

  // 🚀 역동적 비행과 타격이 적용된 단계별 턴 실행
  async executeTurnStepByStep(actor, playedCard, targetMatchId) {
    const targetCaptured = actor === 'player' ? this.playerCaptured : this.aiCaptured;
    const opponentCaptured = actor === 'player' ? this.aiCaptured : this.playerCaptured;

    let turnLogs = [];
    let capturedThisTurn = [];

    // 1단계: 손패 내리기 애니메이션 이벤트
    if (this.onEvent) {
      await this.onEvent('cardPlayed', { actor, card: playedCard });
    }

    const month = playedCard.month;
    let handMatches = (month > 0 && this.groundCards[month]) ? this.groundCards[month] : [];

    let matchedFromHand = null;
    if (handMatches.length === 1) {
      matchedFromHand = handMatches.pop();
    } else if (handMatches.length === 2) {
      const tIdx = targetMatchId ? handMatches.findIndex(c => c.id === targetMatchId) : 0;
      matchedFromHand = handMatches.splice(tIdx >= 0 ? tIdx : 0, 1)[0];
    } else if (handMatches.length === 3) {
      turnLogs.push('바닥 3장 묶음 모두 획득!');
    }

    // 2단계: 덱에서 1장 뒤집기
    await new Promise(r => setTimeout(r, 300));
    const deckCard = this.deck.length > 0 ? this.deck.pop() : null;
    let matchedFromDeck = null;
    let isBbuck = false;
    let isJjok = false;
    let isTtadak = false;

    if (deckCard) {
      if (this.onEvent) {
        await this.onEvent('deckFlipped', { actor, card: deckCard });
      }

      const deckMonth = deckCard.month;
      let deckMatches = (deckMonth > 0 && this.groundCards[deckMonth]) ? this.groundCards[deckMonth] : [];

      // 뻑 판정
      if (deckMonth === month && matchedFromHand && deckMatches.length === 0) {
        isBbuck = true;
        this.groundCards[month].push(playedCard, matchedFromHand, deckCard);
        turnLogs.push(`${actor === 'player' ? '마스터님' : '반반이'} 뻑!! 😱`);
        if (window.goStopAudio) window.goStopAudio.playSpecial('bbuck');
      } 
      // 쪽 판정
      else if (handMatches.length === 0 && deckMonth === month) {
        isJjok = true;
        capturedThisTurn.push(playedCard, deckCard);
        turnLogs.push(`쪽!! 상대 피 1장 뺏기! 🐾✨`);
        this.stealJunk(opponentCaptured, targetCaptured);
        if (window.goStopAudio) window.goStopAudio.playSpecial('jjok');
      }
      else {
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
          if (deckMonth > 0) this.groundCards[deckMonth].push(deckCard);
        }
      }
    }

    if (!isBbuck) {
      if (matchedFromHand) {
        capturedThisTurn.push(playedCard, matchedFromHand);
      } else if (!isJjok && month > 0) {
        this.groundCards[month].push(playedCard);
      }

      if (matchedFromHand && matchedFromDeck && month === deckCard.month) {
        isTtadak = true;
        turnLogs.push(`따닥!! 상대 피 1장 뺏기! 💥`);
        this.stealJunk(opponentCaptured, targetCaptured);
        if (window.goStopAudio) window.goStopAudio.playSpecial('ttadak');
      }
    }

    const remainingGroundCount = Object.values(this.groundCards).reduce((sum, arr) => sum + arr.length, 0);
    if (remainingGroundCount === 0 && capturedThisTurn.length > 0) {
      turnLogs.push(`쓸 (싹쓸이)!! 상대 피 1장 뺏기! 🧹`);
      this.stealJunk(opponentCaptured, targetCaptured);
      if (window.goStopAudio) window.goStopAudio.playSpecial('sseul');
    }

    capturedThisTurn.forEach(card => {
      if (card.type === 'gwang') targetCaptured.gwang.push(card);
      else if (card.type === 'animal') targetCaptured.animal.push(card);
      else if (card.type === 'ribbon') targetCaptured.ribbon.push(card);
      else if (card.type === 'double') {
        targetCaptured.junk.push(card, { ...card, isDoubleSub: true });
      } else {
        targetCaptured.junk.push(card);
      }
    });

    if (capturedThisTurn.length > 0 && window.goStopAudio) {
      window.goStopAudio.playCardCollect();
    }

    this.calculateScore('player');
    this.calculateScore('ai');

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

    if (this.playerHand.length === 0 && this.aiHand.length === 0) {
      this.endGame();
      return;
    }

    if (!canDeclareGoStop || actor === 'ai') {
      if (actor === 'ai' && canDeclareGoStop) {
        if (this.aiScore >= 10 || Math.random() > 0.4) {
          this.declareStop('ai');
        } else {
          this.declareGo('ai');
        }
      } else {
        this.currentTurn = actor === 'player' ? 'ai' : 'player';
        if (this.currentTurn === 'ai') {
          setTimeout(() => this.executeAiTurn(), 800);
        }
      }
    }
  }

  stealJunk(from, to) {
    if (from.junk.length > 0) {
      const stolen = from.junk.pop();
      to.junk.push(stolen);
    }
  }

  calculateScore(target) {
    const cap = target === 'player' ? this.playerCaptured : this.aiCaptured;
    let score = 0;

    const gwangCount = cap.gwang.length;
    const hasBiGwang = cap.gwang.some(c => c.isBiGwang);
    if (gwangCount === 5) score += 15;
    else if (gwangCount === 4) score += 4;
    else if (gwangCount === 3) score += hasBiGwang ? 2 : 3;

    const animalCount = cap.animal.length;
    if (animalCount >= 5) score += (animalCount - 4);
    const godoriCount = cap.animal.filter(c => c.isGodori).length;
    if (godoriCount === 3) score += 5;

    const ribbonCount = cap.ribbon.length;
    if (ribbonCount >= 5) score += (ribbonCount - 4);
    const hongCount = cap.ribbon.filter(c => c.ribbonType === 'hong').length;
    const cheongCount = cap.ribbon.filter(c => c.ribbonType === 'cheong').length;
    const choCount = cap.ribbon.filter(c => c.ribbonType === 'cho').length;
    if (hongCount === 3) score += 3;
    if (cheongCount === 3) score += 3;
    if (choCount === 3) score += 3;

    const junkCount = cap.junk.length;
    if (junkCount >= 10) score += (junkCount - 9);

    if (target === 'player') this.playerScore = score;
    else this.aiScore = score;

    return score;
  }

  declareGo(actor) {
    if (window.goStopAudio) window.goStopAudio.playGo();
    if (actor === 'player') {
      this.playerGoCount++;
      if (this.onEvent) this.onEvent('goDeclared', { actor, count: this.playerGoCount, message: `${this.playerGoCount}고!! 멍멍! 계속 갑니다! 🚀` });
      this.currentTurn = 'ai';
      setTimeout(() => this.executeAiTurn(), 800);
    } else {
      this.aiGoCount++;
      if (this.onEvent) this.onEvent('goDeclared', { actor, count: this.aiGoCount, message: `반반이: ${this.aiGoCount}고 멍멍!! 🐾` });
      this.currentTurn = 'player';
    }
  }

  // 💰 스톱 선언 및 머니 정산
  declareStop(actor) {
    if (window.goStopAudio) window.goStopAudio.playStop();
    this.isGameOver = true;
    
    const winnerScore = actor === 'player' ? this.playerScore : this.aiScore;
    const loserCap = actor === 'player' ? this.aiCaptured : this.playerCaptured;
    const goCount = actor === 'player' ? this.playerGoCount : this.aiGoCount;

    let multiplier = 1;
    let bonuses = [];

    if (goCount === 1) bonuses.push('1고 (+1점)');
    if (goCount === 2) bonuses.push('2고 (+2점)');
    if (goCount >= 3) {
      const m = Math.pow(2, goCount - 2);
      multiplier *= m;
      bonuses.push(`${goCount}고 (${m}배)`);
    }

    const winnerCap = actor === 'player' ? this.playerCaptured : this.aiCaptured;
    if (winnerCap.junk.length >= 10 && loserCap.junk.length >= 1 && loserCap.junk.length <= 7) {
      multiplier *= 2;
      bonuses.push('피박 (2배)');
    }

    if (winnerCap.gwang.length >= 3 && loserCap.gwang.length === 0) {
      multiplier *= 2;
      bonuses.push('광박 (2배)');
    }

    const finalCalculatedScore = Math.max(7, winnerScore) * multiplier;
    const totalWonMoney = finalCalculatedScore * this.pointBet;

    // 머니 이동
    if (actor === 'player') {
      const takeMoney = Math.min(this.aiMoney, totalWonMoney);
      this.playerMoney += takeMoney;
      this.aiMoney -= takeMoney;
    } else {
      const takeMoney = Math.min(this.playerMoney, totalWonMoney);
      this.aiMoney += takeMoney;
      this.playerMoney -= takeMoney;
    }
    this.saveMoney();

    if (this.onEvent) {
      this.onEvent('gameEnd', {
        winner: actor,
        baseScore: winnerScore,
        multiplier,
        bonuses,
        finalScore: finalCalculatedScore,
        wonMoney: totalWonMoney,
        pointBet: this.pointBet,
        playerMoney: this.playerMoney,
        aiMoney: this.aiMoney,
        isBankrupt: (actor === 'player' ? this.aiMoney : this.playerMoney) <= 0
      });
    }
  }

  endGame() {
    this.isGameOver = true;
    if (this.playerScore > this.aiScore && this.playerScore >= 7) {
      this.declareStop('player');
    } else if (this.aiScore > this.playerScore && this.aiScore >= 7) {
      this.declareStop('ai');
    } else {
      if (this.onEvent) this.onEvent('draw', { message: '나가리 (무승부)! 판돈이 이월됩니다!' });
    }
  }
}

window.GoStopEngine = GoStopEngine;
