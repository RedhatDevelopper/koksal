const db = firebase.database();
const form = document.getElementById('login-form');
const pseudoInput = document.getElementById('pseudo');
const passwordInput = document.getElementById('password');
const errorDisplay = document.getElementById('login-error');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const pseudo = pseudoInput.value.trim().toLowerCase().replace(/\./g, '_');
  const password = passwordInput.value;

  try {
    const babySnap = await db.ref(`babysitters/${pseudo}`).get();
    if (babySnap.exists() && babySnap.val().mot_de_passe === password) {
      localStorage.setItem("role", "babysitter");
      localStorage.setItem("pseudo", pseudo);
      window.location.href = "dashboard_babysitter.html";
      return;
    }

    const parentSnap = await db.ref(`parents/${pseudo}`).get();
    if (parentSnap.exists() && parentSnap.val().mot_de_passe === password) {
      localStorage.setItem("role", "parent");
      localStorage.setItem("pseudo", pseudo);
      window.location.href = "dashboard_parent.html";
      return;
    }

    errorDisplay.textContent = "Identifiants incorrects.";
  } catch (err) {
    console.error(err);
    errorDisplay.textContent = "Erreur de connexion.";
  }
});
