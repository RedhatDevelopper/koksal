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

let credits = 0;

// Charger les crédits au démarrage
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

function spinWheel() {
  const betType = document.getElementById('betType').value;
  const betValue = document.getElementById('betValue').value.trim();

  if (!betType || (!betValue && betType === 'number')) {
    alert('Veuillez entrer une valeur.');
    return;
  }

  let winningNumber = Math.floor(Math.random() * 37);
  let win = false;

  if (betType === 'number' && parseInt(betValue) === winningNumber) win = true;
  if (betType === 'red' && [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(winningNumber)) win = true;
  if (betType === 'black' && [2,4,6,8,10,11,13,15,17,20,22,24,26,28,29,31,33,35].includes(winningNumber)) win = true;
  if (betType === 'even' && winningNumber !== 0 && winningNumber % 2 === 0) win = true;
  if (betType === 'odd' && winningNumber % 2 === 1) win = true;

  if (win) {
    credits += 100;
    document.getElementById('result').textContent = `Gagné 🎉 Numéro: ${winningNumber}`;
  } else {
    credits -= 50;
    document.getElementById('result').textContent = `Perdu 😢 Numéro: ${winningNumber}`;
  }

  document.getElementById('credits').textContent = `Crédits : ${credits}`;
  updateCredits(credits);
}

function updateCredits(newCredits) {
  const user = auth.currentUser;
  if (user) {
    db.ref('users/' + user.uid).update({
      credits: newCredits
    });
  }
}
