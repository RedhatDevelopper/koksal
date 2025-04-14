let deck, playerCards, dealerCards, playerSum, dealerSum, credits = 1000, currentBet = 0;
const auth = firebase.auth();
const db = firebase.database();
const flipSound = document.getElementById('flipSound');

function createDeck() {
    const types = ['H', 'D', 'C', 'S'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    let newDeck = [];
    types.forEach(type => {
        values.forEach(value => {
            newDeck.push(value + type);
        });
    });
    return newDeck;
}

function shuffle(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function getValue(card) {
    const value = card.slice(0, -1);
    if (['J', 'Q', 'K'].includes(value)) return 10;
    if (value === 'A') return 11;
    return parseInt(value);
}

function startGame() {
    let bet = parseInt(document.getElementById('bet').value);
    if (bet <= 0 || bet > credits) {
        alert('Mise invalide.');
        return;
    }
    currentBet = bet;
    credits -= bet;
    updateCredits(credits); // 🔥 Update Firebase après la mise
    document.getElementById('credits').textContent = credits;

    deck = createDeck();
    shuffle(deck);
    playerCards = [deck.pop(), deck.pop()];
    dealerCards = [deck.pop(), deck.pop()];

    flipSound.play();
    flipSound.play();

    render();
}

function render() {
    playerSum = calculateSum(playerCards);
    dealerSum = calculateSum([dealerCards[0]]);

    document.getElementById('playerCards').textContent = playerCards.join(' ');
    document.getElementById('dealerCards').textContent = dealerCards[0] + ' ?';
    document.getElementById('playerSum').textContent = playerSum;
    document.getElementById('dealerSum').textContent = '?';
}

function hit() {
    playerCards.push(deck.pop());
    flipSound.play();
    playerSum = calculateSum(playerCards);
    document.getElementById('playerCards').textContent = playerCards.join(' ');
    document.getElementById('playerSum').textContent = playerSum;

    if (playerSum > 21) {
        endGame('Perdu');
    }
}

function stand() {
    while (calculateSum(dealerCards) < 17) {
        dealerCards.push(deck.pop());
        flipSound.play();
    }

    dealerSum = calculateSum(dealerCards);
    document.getElementById('dealerCards').textContent = dealerCards.join(' ');
    document.getElementById('dealerSum').textContent = dealerSum;

    if (dealerSum > 21 || playerSum > dealerSum) {
        endGame('Gagné');
    } else if (playerSum < dealerSum) {
        endGame('Perdu');
    } else {
        endGame('Égalité');
    }
}

function calculateSum(cards) {
    let sum = 0, aces = 0;
    cards.forEach(card => {
        let val = getValue(card);
        if (val === 11) aces++;
        sum += val;
    });
    while (sum > 21 && aces > 0) {
        sum -= 10;
        aces--;
    }
    return sum;
}

function endGame(result) {
    document.getElementById('result').textContent = result;
    if (result === 'Gagné') {
        credits += currentBet * 2;
    } else if (result === 'Égalité') {
        credits += currentBet;
    }
    // 🔥 Mettre à jour les crédits après la partie
    updateCredits(credits);
    document.getElementById('credits').textContent = credits;
}

function updateCredits(newCredits) {
    const user = auth.currentUser;
    if (user) {
        db.ref('users/' + user.uid).update({
            credits: newCredits
        });
    }
}
