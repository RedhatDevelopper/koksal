let deck = [];
let playerCards = [];
let dealerCards = [];
let gameOver = false;

function createDeck() {
  const types = ['♠️', '♥️', '♣️', '♦️'];
  const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  deck = [];
  for (let type of types) {
    for (let value of values) {
      deck.push({ value, type });
    }
  }
}

function shuffleDeck() {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function startGame() {
  createDeck();
  shuffleDeck();
  playerCards = [drawCard(), drawCard()];
  dealerCards = [drawCard(), drawCard()];
  gameOver = false;
  updateDisplay();
}

function drawCard() {
  return deck.pop();
}

function getScore(cards) {
  let sum = 0;
  let aces = 0;
  for (let card of cards) {
    if (['J', 'Q', 'K'].includes(card.value)) {
      sum += 10;
    } else if (card.value === 'A') {
      sum += 11;
      aces++;
    } else {
      sum += parseInt(card.value);
    }
  }
  while (sum > 21 && aces > 0) {
    sum -= 10;
    aces--;
  }
  return sum;
}

function updateDisplay() {
  const playerDiv = document.getElementById('playerCards');
  const dealerDiv = document.getElementById('dealerCards');
  playerDiv.innerHTML = '';
  dealerDiv.innerHTML = '';

  for (let card of playerCards) {
    playerDiv.innerHTML += `<div class="card">${card.value}<br>${card.type}</div>`;
  }
  for (let card of dealerCards) {
    dealerDiv.innerHTML += `<div class="card">${card.value}<br>${card.type}</div>`;
  }

  document.getElementById('playerScore').innerText = `Score : ${getScore(playerCards)}`;
  document.getElementById('dealerScore').innerText = gameOver ? `Score : ${getScore(dealerCards)}` : 'Score : ?';
}

function hit() {
  if (gameOver) return;
  playerCards.push(drawCard());
  if (getScore(playerCards) > 21) {
    endGame();
  }
  updateDisplay();
}

function stand() {
  if (gameOver) return;
  while (getScore(dealerCards) < 17) {
    dealerCards.push(drawCard());
  }
  endGame();
}

function endGame() {
  gameOver = true;
  const playerScore = getScore(playerCards);
  const dealerScore = getScore(dealerCards);
  let message = '';

  if (playerScore > 21) {
    message = "Vous avez perdu 😢";
  } else if (dealerScore > 21 || playerScore > dealerScore) {
    message = "Vous avez gagné 🎉";
  } else if (playerScore < dealerScore) {
    message = "Vous avez perdu 😢";
  } else {
    message = "Égalité 🤝";
  }

  document.getElementById('message').innerText = message;
  updateDisplay();
}

function restartGame() {
  startGame();
  document.getElementById('message').innerText = '';
}

startGame();
