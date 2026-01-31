// ===== DOM ELEMENTS =====
const header = document.getElementById('header');
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');
const navLinks = document.querySelectorAll('.nav__link');
const backToTop = document.getElementById('back-to-top');
const contactForm = document.getElementById('contact-form');
const statNumbers = document.querySelectorAll('.hero__stat-number');

// ===== CAROUSELS (GLOBAL) =====
const initializeCarousel = (carouselElement) => {
    const slides = carouselElement.querySelectorAll('.carousel-slide');
    const indicators = carouselElement.querySelectorAll('.indicator');
    let prevButton = carouselElement.querySelector('.carousel-btn-prev');
    let nextButton = carouselElement.querySelector('.carousel-btn-next');
    const container = carouselElement.querySelector('.carousel-container') || carouselElement;

    if (slides.length === 0) return;

    let currentIndex = 0;
    let slideInterval;
    let isDragging = false;
    let startX = 0;
    let currentX = 0;
    const autoplayDelay = 8000;

    const ensureArrowButtons = () => {
        if (!prevButton) {
            prevButton = document.createElement('button');
            prevButton.type = 'button';
            prevButton.className = 'carousel-btn carousel-btn-prev';
            prevButton.setAttribute('aria-label', 'Imagem anterior');
            prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
            carouselElement.appendChild(prevButton);
        }

        if (!nextButton) {
            nextButton = document.createElement('button');
            nextButton.type = 'button';
            nextButton.className = 'carousel-btn carousel-btn-next';
            nextButton.setAttribute('aria-label', 'Próxima imagem');
            nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
            carouselElement.appendChild(nextButton);
        }
    };

    const showSlide = (index) => {
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));

        slides[index].classList.add('active');
        if (indicators[index]) {
            indicators[index].classList.add('active');
        }
        currentIndex = index;
    };

    const nextSlide = () => {
        const nextIndex = (currentIndex + 1) % slides.length;
        showSlide(nextIndex);
    };

    const prevSlide = () => {
        const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
        showSlide(prevIndex);
    };

    const startAutoplay = () => {
        stopAutoplay();
        slideInterval = setInterval(nextSlide, autoplayDelay);
    };

    const stopAutoplay = () => {
        clearInterval(slideInterval);
    };

    const registerInteraction = () => {
        startAutoplay();
    };

    ensureArrowButtons();

    prevButton.addEventListener('click', () => {
        prevSlide();
        registerInteraction();
    });

    nextButton.addEventListener('click', () => {
        nextSlide();
        registerInteraction();
    });

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide(index);
            registerInteraction();
        });
    });

    const onPointerDown = (event) => {
        isDragging = true;
        startX = event.clientX || event.touches?.[0]?.clientX || 0;
        currentX = startX;
    };

    const onPointerMove = (event) => {
        if (!isDragging) return;
        currentX = event.clientX || event.touches?.[0]?.clientX || 0;
    };

    const onPointerUp = () => {
        if (!isDragging) return;
        const deltaX = currentX - startX;
        const threshold = 50;
        if (Math.abs(deltaX) >= threshold) {
            if (deltaX < 0) {
                nextSlide();
            } else {
                prevSlide();
            }
            registerInteraction();
        }
        isDragging = false;
        startX = 0;
        currentX = 0;
    };

    if (window.PointerEvent) {
        container.addEventListener('pointerdown', onPointerDown);
        container.addEventListener('pointermove', onPointerMove);
        container.addEventListener('pointerup', onPointerUp);
        container.addEventListener('pointerleave', onPointerUp);
    } else {
        container.addEventListener('touchstart', onPointerDown, { passive: true });
        container.addEventListener('touchmove', onPointerMove, { passive: true });
        container.addEventListener('touchend', onPointerUp);

        container.addEventListener('mousedown', onPointerDown);
        container.addEventListener('mousemove', onPointerMove);
        container.addEventListener('mouseup', onPointerUp);
        container.addEventListener('mouseleave', onPointerUp);
    }

    showSlide(0);
    startAutoplay();
};

document.querySelectorAll('.mapeamento__carousel, .inspecao__carousel').forEach(initializeCarousel);

// ===== MOBILE MENU =====
// Create overlay element
const overlay = document.createElement('div');
overlay.classList.add('nav__overlay');
document.body.appendChild(overlay);

// Open menu
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
}

// Close menu function
const closeMenu = () => {
    navMenu.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
};

// Close menu on close button click
if (navClose) {
    navClose.addEventListener('click', closeMenu);
}

// Close menu on overlay click
overlay.addEventListener('click', closeMenu);

// Close menu on nav link click
navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
});

// ===== HEADER SCROLL EFFECT =====
const handleScroll = () => {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Back to top visibility
    if (window.scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
};

window.addEventListener('scroll', handleScroll);

// ===== BACK TO TOP =====
if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');

const activateNavLink = () => {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 150;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);
        
        if (navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink.classList.add('active');
            } else {
                navLink.classList.remove('active');
            }
        }
    });
};

window.addEventListener('scroll', activateNavLink);

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const headerHeight = header.offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== COUNTER ANIMATION =====
const animateCounters = () => {
    statNumbers.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
};

// Intersection Observer for counter animation
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero__stats');
if (heroStats) {
    counterObserver.observe(heroStats);
}

// ===== SCROLL REVEAL ANIMATION =====
const revealElements = document.querySelectorAll(
    '.service-card, .application-card, .process__step, .bim__benefit, .bim__layer'
);

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    revealObserver.observe(el);
});

// ===== CONTACT FORM =====
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());
        
        // Simple validation
        if (!data.name || !data.email || !data.subject || !data.message) {
            showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showNotification('Por favor, insira um e-mail válido.', 'error');
            return;
        }
        
        // Simulate form submission
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
            this.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <div class="notification__content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification__close" aria-label="Fechar">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        max-width: 400px;
        padding: 20px 25px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
        animation: slideIn 0.3s ease;
    `;
    
    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        .notification__content {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .notification__content i {
            font-size: 20px;
        }
        .notification__close {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s;
        }
        .notification__close:hover {
            background: rgba(255, 255, 255, 0.3);
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification__close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ===== PHONE INPUT MASK =====
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 11) {
            value = value.slice(0, 11);
        }
        
        if (value.length > 0) {
            if (value.length <= 2) {
                value = `(${value}`;
            } else if (value.length <= 7) {
                value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
            } else {
                value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
            }
        }
        
        e.target.value = value;
    });
}

// ===== PARALLAX EFFECT FOR HERO SHAPES =====
const heroShapes = document.querySelectorAll('.hero__shape');

if (heroShapes.length > 0) {
    window.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        heroShapes.forEach((shape, index) => {
            const speed = (index + 1) * 20;
            const x = (mouseX - 0.5) * speed;
            const y = (mouseY - 0.5) * speed;
            
            shape.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
}

// ===== LAZY LOADING FOR IMAGES =====
const lazyImages = document.querySelectorAll('img[data-src]');

if (lazyImages.length > 0) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
}

// ===== TYPING EFFECT (Optional Enhancement) =====
const typingElement = document.querySelector('.hero__title .gradient-text');

// ===== SERVICE CARD HOVER EFFECT =====
const serviceCards = document.querySelectorAll('.service-card:not(.service-card--featured)');

serviceCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.borderColor = 'var(--primary-color)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.borderColor = 'var(--border-color)';
    });
});

// ===== BIM LAYERS INTERACTION =====
const bimLayers = document.querySelectorAll('.bim__layer');

bimLayers.forEach(layer => {
    layer.addEventListener('click', function() {
        bimLayers.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});

// ===== HERO SLIDESHOW =====
const heroSlides = document.querySelectorAll('.hero__slide');
let currentSlide = 0;

function nextSlide() {
    if (heroSlides.length > 0) {
        heroSlides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % heroSlides.length;
        heroSlides[currentSlide].classList.add('active');
    }
}

// Change slide every 5 seconds
if (heroSlides.length > 0) {
    setInterval(nextSlide, 5000);
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    // Check initial scroll position
    handleScroll();
    activateNavLink();
    
    // Add loaded class to body for animations
    document.body.classList.add('loaded');
});

// ===== PRELOADER (Optional) =====
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
});

// ===== CONSOLE MESSAGE =====
console.log('%c EnguLan - Engenharia & Tecnologia BIM ', 
    'background: linear-gradient(135deg, #2563eb, #06b6d4); color: white; font-size: 16px; padding: 10px 20px; border-radius: 5px;');
console.log('%c Desenvolvido com ❤️ para transformar projetos em realidade.', 
    'color: #475569; font-size: 12px;');
