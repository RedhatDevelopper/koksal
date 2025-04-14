const firebaseConfig = {
  apiKey: "AIzaSyDJdkm0NY3Qs3aFawlMz-wjHjdBR_gxnLs",
  authDomain: "slowfire-2f833.firebaseapp.com",
  databaseURL: "https://slowfire-2f833-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "slowfire-2f833",
  storageBucket: "slowfire-2f833.appspot.com",
  messagingSenderId: "1024871744404",
  appId: "1:1024871744404:web:c5d1435e840042ed8c8581",
  measurementId: "G-3D35DNT431"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

let deck, playerCards, dealerCards, playerSum, dealerSum, credits = 0, currentBet = 0;

// Charger les crédits Firebase au démarrage
auth.onAuthStateChanged(user => {
  if (user) {
    db.ref('users/' + user.uid + '/credits').once('value').then(snapshot => {
      if (snapshot.exists()) {
        credits = snapshot.val();
        document.getElementById('credits').textContent = `Crédits : ${credits}`;
      }
    });
  }
});

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
  if (isNaN(bet) || bet <= 0 || bet > credits) {
    alert('Mise invalide.');
    return;
  }
  currentBet = bet;
  credits -= bet;
  updateCredits(credits);
  document.getElementById('credits').textContent = `
