// Enhanced JavaScript functionality with Interactive Particles
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMobileMenu();
    initSmoothScrolling();
    initContactForm();
    initNavbarEffects();
    initAnimations();
    initCounterAnimations();
    initFAQ();
    initInteractiveParticles();
    
    // Mobile menu functionality
    function initMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const navLinks = document.getElementById('nav-links');
        
        if (mobileMenuBtn && navLinks) {
            mobileMenuBtn.addEventListener('click', function() {
                navLinks.classList.toggle('active');
                mobileMenuBtn.classList.toggle('active');
            });
            
            // Close mobile menu when clicking on links
            const navLinksElements = navLinks.querySelectorAll('.nav-link');
            navLinksElements.forEach(link => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
                });
            });
            
            // Close mobile menu when clicking outside
            document.addEventListener('click', function(e) {
                if (!mobileMenuBtn.contains(e.target) && !navLinks.contains(e.target)) {
                    navLinks.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
                }
            });
        }
    }
    
    // Smooth scrolling for navigation links
    function initSmoothScrolling() {
        const navLinksElements = document.querySelectorAll('a[href^="#"]');
        navLinksElements.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 60; // Account for fixed navbar
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // Enhanced contact form handling with Gmail integration
    function initContactForm() {
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Show loading state
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<span>Sending...</span>';
                submitBtn.disabled = true;
                
                const formData = new FormData(this);
                const data = Object.fromEntries(formData);
                
                // Simulate form processing
                setTimeout(() => {
                    // Create mailto link to netprotelecomke@gmail.com
                    const subject = encodeURIComponent('ConnectKenya Service Inquiry');
                    const body = encodeURIComponent(
                        `Name: ${data.name}\n` +
                        `Email: ${data.email}\n` +
                        `Phone: ${data.phone || 'Not provided'}\n` +
                        `Service Interest: ${data.service || 'Not specified'}\n\n` +
                        `Message:\n${data.message}`
                    );
                    
                    const mailtoLink = `mailto:netprotelecomke@gmail.com?subject=${subject}&body=${body}`;
                    window.location.href = mailtoLink;
                    
                    // Reset form and button
                    this.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    
                    // Show success message
                    showNotification('Thank you for your message! Your email client should open now.', 'success');
                }, 1000);
            });
        }
    }
    
    // Advanced navbar scroll effects
    function initNavbarEffects() {
        const navbar = document.getElementById('navbar');
        let lastScrollTop = 0;
        let ticking = false;
        
        function updateNavbar() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add/remove scrolled class for styling
            if (scrollTop > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            // Keep navbar always visible at top
            navbar.style.transform = 'translateY(0)';
            
            lastScrollTop = scrollTop;
            ticking = false;
        }
        
        window.addEventListener('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(updateNavbar);
                ticking = true;
            }
        });
    }
    
    // Intersection Observer for animations
    function initAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    
                    // Add staggered animation for grid items
                    if (entry.target.parentElement.classList.contains('services-grid') ||
                        entry.target.parentElement.classList.contains('packages-grid') ||
                        entry.target.parentElement.classList.contains('speed-test-grid')) {
                        const siblings = Array.from(entry.target.parentElement.children);
                        const index = siblings.indexOf(entry.target);
                        entry.target.style.animationDelay = `${index * 0.1}s`;
                    }
                }
            });
        }, observerOptions);
        
        // Observe all animated elements
        const animatedElements = document.querySelectorAll(
            '.service-card, .package-card, .speed-test-card, .faq-item, .about-stat'
        );
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }
    
    // Counter animations for stats
    function initCounterAnimations() {
        const stats = document.querySelectorAll('.stat-number');
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        stats.forEach(stat => {
            statsObserver.observe(stat);
        });
        
        function animateCounter(element) {
            const text = element.textContent;
            const hasPercent = text.includes('%');
            const hasPlus = text.includes('+');
            const hasSlash = text.includes('/');
            
            if (hasSlash) return; // Skip "24/7" type values
            
            let targetValue = parseFloat(text.replace(/[^\d.]/g, ''));
            
            if (isNaN(targetValue)) return;
            
            let currentValue = 0;
            const increment = targetValue / 60; // 60 frames for 1 second at 60fps
            const duration = 2000; // 2 seconds
            const stepTime = duration / 60;
            
            const updateCounter = () => {
                currentValue += increment;
                
                if (currentValue >= targetValue) {
                    currentValue = targetValue;
                }
                
                let displayValue = Math.floor(currentValue);
                
                if (hasPercent) {
                    element.textContent = `${displayValue}%`;
                } else if (hasPlus) {
                    element.textContent = `${displayValue}+`;
                } else {
                    element.textContent = displayValue;
                }
                
                if (currentValue < targetValue) {
                    setTimeout(updateCounter, stepTime);
                }
            };
            
            updateCounter();
        }
    }
    
    // FAQ functionality - Completely rewritten and working
    function initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            if (question) {
                question.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Get current state
                    const isCurrentlyActive = item.classList.contains('active');
                    
                    // Close all FAQ items first
                    faqItems.forEach(otherItem => {
                        otherItem.classList.remove('active');
                        const otherIcon = otherItem.querySelector('.faq-icon');
                        if (otherIcon) {
                            otherIcon.textContent = '+';
                        }
                    });
                    
                    // If this item wasn't active, open it
                    if (!isCurrentlyActive) {
                        item.classList.add('active');
                        const icon = item.querySelector('.faq-icon');
                        if (icon) {
                            icon.textContent = '−';
                        }
                    }
                });
            }
        });
    }
    
    // Interactive Particle System - Only for Hero Section
    function initInteractiveParticles() {
        const canvas = document.getElementById('particle-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: 0, y: 0 };
        let animationId;
        let isInHeroSection = true;
        
        // Set canvas size
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Check if user is in hero section
        function checkHeroSection() {
            const heroSection = document.querySelector('.hero');
            if (heroSection) {
                const heroRect = heroSection.getBoundingClientRect();
                const isVisible = heroRect.bottom > 0 && heroRect.top < window.innerHeight;
                
                if (isVisible !== isInHeroSection) {
                    isInHeroSection = isVisible;
                    if (!isInHeroSection) {
                        // Clear canvas when not in hero section
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        particles = [];
                    } else {
                        // Recreate particles when entering hero section
                        createParticles();
                    }
                }
            }
        }
        
        // Particle class
        class Particle {
            constructor(x, y) {
                this.x = x || Math.random() * canvas.width;
                this.y = y || Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 2 + 1;
                this.opacity = Math.random() * 0.5 + 0.2;
                this.originalOpacity = this.opacity;
                this.color = `rgba(37, 99, 235, ${this.opacity})`;
            }
            
            update() {
                // Move particle
                this.x += this.vx;
                this.y += this.vy;
                
                // Bounce off edges
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
                
                // Mouse interaction
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    const force = (100 - distance) / 100;
                    this.vx += dx * force * 0.001;
                    this.vy += dy * force * 0.001;
                    this.opacity = this.originalOpacity + force * 0.5;
                } else {
                    this.opacity = this.originalOpacity;
                    this.vx *= 0.99; // Damping
                    this.vy *= 0.99;
                }
                
                // Update color with new opacity
                this.color = `rgba(37, 99, 235, ${this.opacity})`;
            }
            
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
                
                // Add glow effect
                ctx.shadowBlur = 10;
                ctx.shadowColor = this.color;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }
        
        // Create particles
        function createParticles() {
            const particleCount = Math.min(80, Math.floor(canvas.width * canvas.height / 12000));
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }
        
        // Draw connections between nearby particles
        function drawConnections() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 80) {
                        const opacity = (80 - distance) / 80 * 0.2;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(37, 99, 235, ${opacity})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }
        }
        
        // Animation loop
        function animate() {
            checkHeroSection();
            
            if (isInHeroSection) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // Update and draw particles
                particles.forEach(particle => {
                    particle.update();
                    particle.draw();
                });
                
                // Draw connections
                drawConnections();
            }
            
            animationId = requestAnimationFrame(animate);
        }
        
        // Mouse tracking
        document.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });
        
        // Touch support for mobile
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                mouse.x = e.touches[0].clientX;
                mouse.y = e.touches[0].clientY;
            }
        });
        
        // Scroll listener for hero section detection
        window.addEventListener('scroll', checkHeroSection);
        
        // Initialize
        createParticles();
        animate();
        
        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        });
    }
    
    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#2563eb'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 400px;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Close functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
    
    // Parallax effect for hero section
    function initParallax() {
        const heroBackground = document.querySelector('.hero-background');
        
        if (heroBackground) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;
                heroBackground.style.transform = `translateY(${rate}px)`;
            });
        }
    }
    
    // Initialize parallax
    initParallax();
    
    // Lazy loading for images
    function initLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    // Initialize lazy loading
    initLazyLoading();
    
    // Make showNotification globally available
    window.showNotification = showNotification;
});

// Service Details Modal Functions
function showServiceDetails(serviceType) {
    const modal = document.getElementById('service-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    let title = '';
    let content = '';
    
    switch(serviceType) {
        case 'it-support':
            // Redirect to the dedicated IT services page
            window.location.href = 'it-services.html';
            return;
            
        case 'security':
            // Redirect to the dedicated security surveillance page
            window.location.href = 'security-surveillance.html';
            return;
    }
    
    modalTitle.textContent = title;
    modalBody.innerHTML = content;
    modal.style.display = 'block';
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeServiceModal();
        }
    });
}

function closeServiceModal() {
    const modal = document.getElementById('service-modal');
    modal.style.display = 'none';
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Performance optimizations
const debouncedResize = debounce(() => {
    // Handle resize events
    console.log('Window resized');
}, 250);

const throttledScroll = throttle(() => {
    // Handle scroll events
}, 16); // ~60fps

window.addEventListener('resize', debouncedResize);
window.addEventListener('scroll', throttledScroll);