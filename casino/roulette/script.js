let spinning = false;
let credits = 1000;
const auth = firebase.auth();
const db = firebase.database();

function spinWheel() {
    if (spinning) return;
    spinning = true;

    const wheel = document.getElementById('wheel');
    const resultText = document.getElementById('result');
    const betType = document.getElementById('betType').value;
    const betValue = document.getElementById('betValue').value.trim();
    const tickSound = document.getElementById('tickSound');

    resultText.textContent = '';

    let rotation = 0;
    let totalSpins = 360 * 5 + Math.floor(Math.random() * 360);

    const interval = setInterval(() => {
        rotation += 30;
        wheel.style.transform = `rotate(${rotation}deg)`;
        tickSound.play();
    }, 100);

    setTimeout(() => {
        clearInterval(interval);
        const finalDegree = (rotation + totalSpins) % 360;
        wheel.style.transform = `rotate(${finalDegree}deg)`;

        let winningNumber = Math.floor(Math.random() * 37);

        let win = false;
        if (betType === 'number' && parseInt(betValue) === winningNumber) win = true;
        if (betType === 'red' && [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(winningNumber)) win = true;
        if (betType === 'black' && [2,4,6,8,10,11,13,15,17,20,22,24,26,28,29,31,33,35].includes(winningNumber)) win = true;
        if (betType === 'even' && winningNumber !== 0 && winningNumber % 2 === 0) win = true;
        if (betType === 'odd' && winningNumber % 2 === 1) win = true;

        if (win) {
            credits += 100;
            resultText.textContent = `Gagné ! Le numéro est ${winningNumber}`;
        } else {
            credits -= 50;
            resultText.textContent = `Perdu. Le numéro est ${winningNumber}`;
        }

        // ✅ Mise à jour des crédits dans Firebase après chaque partie
        updateCredits(credits);

        document.getElementById('credits').textContent = credits;
        spinning = false;
    }, 4000);
}

function resetGame() {
    document.getElementById('betValue').value = '';
    document.getElementById('result').textContent = '';
}

function updateCredits(newCredits) {
    const user = auth.currentUser;
    if (user) {
        db.ref('users/' + user.uid).update({
            credits: newCredits
        });
    }
}
