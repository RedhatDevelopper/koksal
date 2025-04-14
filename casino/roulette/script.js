let credits = 500;

function updateCredits() {
  document.getElementById('credits').innerText = `Crédits : ${credits}`;
}

function spinRoulette() {
  const betColor = document.getElementById('betColor').value;
  const betAmount = parseInt(document.getElementById('betAmount').value);

  if (isNaN(betAmount) || betAmount <= 0 || betAmount > credits) {
    alert('Mise invalide.');
    return;
  }

  const number = Math.floor(Math.random() * 37); // 0-36
  let color = '';

  if (number === 0) {
    color = 'vert';
  } else if (number % 2 === 0) {
    color = 'noir';
  } else {
    color = 'rouge';
  }

  let message = `La bille est tombée sur ${number} (${color.toUpperCase()}) ! `;

  if (color === betColor) {
    let gain = 0;
    if (color === 'vert') {
      gain = betAmount * 14;
    } else {
      gain = betAmount * 2;
    }
    credits += gain;
    message += `🎉 Vous avez gagné ${gain} crédits !`;
  } else {
    credits -= betAmount;
    message += "💥 Vous avez perdu votre mise.";
  }

  document.getElementById('result').innerText = message;
  updateCredits();
}
