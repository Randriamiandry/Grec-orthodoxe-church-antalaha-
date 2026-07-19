// ============================================
// Fichier : script.js
// Site : Église Orthodoxe d'Antalaha, Madagascar
// Description : Fonctionnalités interactives pour le site ============================================

// Attendre que le DOM soit entièrement chargé
document.addEventListener('DOMContentLoaded', function() {
    
    // ==================== 1. MENU HAMBURGER RESPONSIVE ====================
    const menuToggle = document.getElementById('menu-toggle');
    const navList = document.querySelector('.nav-list');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (menuToggle && navList) {
        // Fonction pour ouvrir/fermer le menu
        function toggleMenu() {
            navList.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        }
        
        // Événement sur le bouton hamburger
        menuToggle.addEventListener('change', toggleMenu);
        
        // Fermer le menu en cliquant sur un lien (mobile)
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 480) {
                    menuToggle.checked = false;
                    navList.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            });
        });
    }
    
    // ==================== 2. SMOOTH SCROLL POUR LES ANCRES ====================
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Ignorer les liens vides
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Scroll doux vers l'élément cible
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Compenser le header fixe
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ==================== 3. VALIDATION DU FORMULAIRE (version mailto) ====================
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // On empêche d'abord l'envoi pour valider
            
            // Récupérer les champs
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const message = document.getElementById('message');
            
            let isValid = true;
            
            // Validation des champs
            if (!name.value.trim()) {
                isValid = false;
                showFieldError(name, 'Veuillez entrer votre nom');
            } else {
                clearFieldError(name);
            }
            
            if (!email.value.trim()) {
                isValid = false;
                showFieldError(email, 'Veuillez entrer votre email');
            } else if (!isValidEmail(email.value)) {
                isValid = false;
                showFieldError(email, 'Veuillez entrer un email valide');
            } else {
                clearFieldError(email);
            }
            
            if (!message.value.trim()) {
                isValid = false;
                showFieldError(message, 'Veuillez entrer un message');
            } else {
                clearFieldError(message);
            }
            
            // Si tout est valide, on soumet le formulaire (mailto s'ouvrira)
            if (isValid) {
                // Désactiver le bouton pendant un court instant
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Ouverture du client email...';
                submitBtn.disabled = true;
                
                // Afficher un message d'information
                showMessage('Votre client email va s\'ouvrir. Merci d\'envoyer le message pré-rempli !', 'success');
                
                // Laisser un peu de temps pour que l'utilisateur voie le message
                setTimeout(() => {
                    // On soumet le formulaire, ce qui déclenchera mailto
                    contactForm.submit();
                    
                    // Réactiver le bouton après 3 secondes
                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                    }, 3000);
                }, 2000);
            }
        });
        
        // Fonction de validation d'email
        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
        
        // Fonction pour afficher une erreur sur un champ
        function showFieldError(field, message) {
            // Supprimer l'erreur précédente
            clearFieldError(field);
            
            // Ajouter la classe d'erreur
            field.classList.add('error');
            
            // Créer le message d'erreur
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.textContent = message;
            errorDiv.style.color = '#d32f2f';
            errorDiv.style.fontSize = '0.85rem';
            errorDiv.style.marginTop = '0.25rem';
            
            // Insérer après le champ
            field.parentNode.appendChild(errorDiv);
        }
        
        // Fonction pour supprimer l'erreur d'un champ
        function clearFieldError(field) {
            field.classList.remove('error');
            const existingError = field.parentNode.querySelector('.field-error');
            if (existingError) {
                existingError.remove();
            }
        }
        
        // Fonction pour afficher un message global
        function showMessage(text, type) {
            // Supprimer les messages précédents
            const existingMessage = document.querySelector('.form-message');
            if (existingMessage) {
                existingMessage.remove();
            }
            
            // Créer le nouveau message
            const messageDiv = document.createElement('div');
            messageDiv.className = `form-message ${type}`;
            messageDiv.textContent = text;
            messageDiv.style.padding = '1rem';
            messageDiv.style.margin = '1rem 0';
            messageDiv.style.borderRadius = '4px';
            messageDiv.style.textAlign = 'center';
            messageDiv.style.fontWeight = '500';
            
            if (type === 'success') {
                messageDiv.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
                messageDiv.style.color = '#2e7d32';
                messageDiv.style.border = '1px solid #4caf50';
            } else {
                messageDiv.style.backgroundColor = 'rgba(244, 67, 54, 0.1)';
                messageDiv.style.color = '#c62828';
                messageDiv.style.border = '1px solid #f44336';
            }
            
            // Insérer avant le formulaire
            contactForm.parentNode.insertBefore(messageDiv, contactForm);
            
            // Supprimer après 5 secondes
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 5000);
        }
    }
    
    // ==================== 4. GALERIE LIGHTBOX SIMPLE ====================
    const galleryItems = document.querySelectorAll('.gallery-item img');
    
    // Créer les éléments de la lightbox
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.9);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 2000;
        cursor: pointer;
    `;
    
    const lightboxImg = document.createElement('img');
    lightboxImg.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
        border-radius: 4px;
        box-shadow: 0 5px 30px rgba(0, 0, 0, 0.3);
    `;
    
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = `
        position: absolute;
        top: 20px;
        right: 30px;
        background: none;
        border: none;
        color: white;
        font-size: 3rem;
        cursor: pointer;
        z-index: 2001;
        transition: color 0.3s;
    `;
    
    closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.color = '#D4A017';
    });
    
    closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.color = 'white';
    });
    
    // Assembler la lightbox
    lightbox.appendChild(lightboxImg);
    lightbox.appendChild(closeBtn);
    document.body.appendChild(lightbox);
    
    // Ajouter l'effet de hover sur les images de galerie
    galleryItems.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', openLightbox);
    });
    
    // Fonction pour ouvrir la lightbox
    function openLightbox(e) {
        const imgSrc = e.target.src;
        lightboxImg.src = imgSrc;
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Empêcher le scroll
    }
    
    // Fonction pour fermer la lightbox
    function closeLightbox() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // Événements pour fermer la lightbox
    lightbox.addEventListener('click', closeLightbox);
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Empêcher la fermeture via la lightbox
        closeLightbox();
    });
    
    // Fermer avec la touche Échap
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.style.display === 'flex') {
            closeLightbox();
        }
    });
    
    // Empêcher la propagation du clic sur l'image
    lightboxImg.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    // ==================== 5. FADE-IN AU SCROLL ====================
    // Vérifier si l'API IntersectionObserver est supportée
    if ('IntersectionObserver' in window) {
        const fadeElements = document.querySelectorAll('.section, .activity-card, .schedule-item, .gallery-item');
        
        const observerOptions = {
            root: null, // viewport
            rootMargin: '0px',
            threshold: 0.1 // déclenche quand 10% de l'élément est visible
        };
        
        const fadeInObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    // Optionnel : arrêter d'observer après l'animation
                    fadeInObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observer chaque élément
        fadeElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            fadeInObserver.observe(element);
        });
        
        // Ajouter une classe CSS pour l'animation
        const style = document.createElement('style');
        style.textContent = `
            .fade-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
            
            /* Ajouter un léger délai pour les cartes */
            .activity-card:nth-child(2) { transition-delay: 0.1s; }
            .activity-card:nth-child(3) { transition-delay: 0.2s; }
            .activity-card:nth-child(4) { transition-delay: 0.3s; }
        `;
        document.head.appendChild(style);
    }
    
    // ==================== FONCTIONS UTILITAIRES ====================
    // Ajouter la classe "scrolled" au header lors du défilement
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Ajouter des styles CSS supplémentaires via JavaScript
    const additionalStyles = document.createElement('style');
    additionalStyles.textContent = `
        /* Style pour les champs d'erreur */
        .error {
            border-color: #d32f2f !important;
            background-color: rgba(211, 47, 47, 0.05);
        }
        
        /* Style pour le header lorsqu'on scroll */
        .header.scrolled {
            padding: 0.5rem 0;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        /* Animation du menu mobile */
        @media (max-width: 480px) {
            .nav-list {
                transition: right 0.3s ease;
            }
            
            .nav-list.active {
                right: 0;
            }
            
            body.menu-open {
                overflow: hidden;
            }
        }
    `;
    document.head.appendChild(additionalStyles);
    
    // Log de confirmation
    console.log('Script chargé avec succès pour le site de l\'Église Orthodoxe d\'Antalaha - Version mailto activée');
});
