// script.js

// Animation de défilement fluide pour les ancres
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Redirection du bouton "Rejoignez l'aventure"
const joinButton = document.querySelector('a.btn[href="#contact"]');
if (joinButton) {
    joinButton.addEventListener('click', (e) => {
        e.preventDefault(); // Empêche le comportement par défaut
        window.location.href = 'https://slowtalks.derickexm.be/'; // Redirection
    });
}

// Ajout d'un effet de parallaxe pour le header
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    const scrollPosition = window.scrollY;
    header.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
});
