// script.js

// Constantes pour les sélecteurs et les URLs
const SELECTORS = {
    ANCHORS: 'a[href^="#"]',
    JOIN_BUTTON: 'a.btn[href="#contact"]',
    HEADER: 'header',
};

const URLS = {
    SLOWTALKS: 'https://slowtalks.derickexm.be/',
};

// Animation de défilement fluide pour les ancres
function smoothScrollAnchors() {
    const anchors = document.querySelectorAll(SELECTORS.ANCHORS);

    anchors.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });

                // Gestion de l'accessibilité : focus sur l'élément cible après le défilement
                setTimeout(() => {
                    targetElement.setAttribute('tabindex', '-1');
                    targetElement.focus();
                }, 1000); // Délai pour permettre au défilement de se terminer
            }
        });

        // Gestion des événements clavier pour l'accessibilité
        anchor.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                anchor.click();
            }
        });
    });
}

// Redirection du bouton "Rejoignez l'aventure"
function redirectJoinButton() {
    const joinButton = document.querySelector(SELECTORS.JOIN_BUTTON);

    if (joinButton) {
        joinButton.addEventListener('click', (e) => {
            e.preventDefault(); // Empêche le comportement par défaut
            window.location.href = URLS.SLOWTALKS; // Redirection
        });
    }
}

// Ajout d'un effet de parallaxe pour le header
function parallaxHeader() {
    const header = document.querySelector(SELECTORS.HEADER);

    if (!header) return;

    const parallax = () => {
        const scrollPosition = window.scrollY;
        header.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
    };

    // Utilisation de IntersectionObserver pour optimiser les performances
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                window.addEventListener('scroll', parallax);
            } else {
                window.removeEventListener('scroll', parallax);
            }
        });
    });

    observer.observe(header);
}

// Fonction debounce pour limiter le nombre d'appels
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Initialisation des fonctionnalités
function init() {
    try {
        smoothScrollAnchors();
        redirectJoinButton();
        parallaxHeader();
    } catch (error) {
        console.error('Erreur lors de l\'initialisation des fonctionnalités :', error);
    }
}

// Attendre que le DOM soit chargé avant d'exécuter les scripts
document.addEventListener('DOMContentLoaded', init);
