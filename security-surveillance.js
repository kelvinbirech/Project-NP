// Enhanced JavaScript functionality for Security Surveillance page with Interactive Particles
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMobileMenu();
    initSmoothScrolling();
    initContactForm();
    initNavbarEffects();
    initAnimations();
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
                    const subject = encodeURIComponent('Security Surveillance Quote Request');
                    const body = encodeURIComponent(
                        `Name: ${data.name}\n` +
                        `Email: ${data.email}\n` +
                        `Phone: ${data.phone || 'Not provided'}\n` +
                        `Property Type: ${data['property-type'] || 'Not specified'}\n` +
                        `Cameras Needed: ${data['cameras-needed'] || 'Not specified'}\n\n` +
                        `Security Requirements:\n${data.requirements}`
                    );
                    
                    const mailtoLink = `mailto:netprotelecomke@gmail.com?subject=${subject}&body=${body}`;
                    window.location.href = mailtoLink;
                    
                    // Reset form and button
                    this.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    
                    // Show success message
                    showNotification('Thank you for your security inquiry! Your email client should open now.', 'success');
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
                    if (entry.target.parentElement.classList.contains('cameras-grid') ||
                        entry.target.parentElement.classList.contains('tech-grid') ||
                        entry.target.parentElement.classList.contains('features-grid')) {
                        const siblings = Array.from(entry.target.parentElement.children);
                        const index = siblings.indexOf(entry.target);
                        entry.target.style.animationDelay = `${index * 0.1}s`;
                    }
                }
            });
        }, observerOptions);
        
        // Observe all animated elements
        const animatedElements = document.querySelectorAll(
            '.camera-card, .tech-card, .feature-item'
        );
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
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
                this.color = `rgba(96, 165, 250, ${this.opacity})`;
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
                this.color = `rgba(96, 165, 250, ${this.opacity})`;
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
            const particleCount = Math.min(100, Math.floor(canvas.width * canvas.height / 10000));
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
                        ctx.strokeStyle = `rgba(96, 165, 250, ${opacity})`;
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
    
    // Parallax effect for hero background
    function initParallax() {
        const heroBackground = document.querySelector('.hero-background');
        
        if (heroBackground) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.3;
                heroBackground.style.transform = `translateY(${rate}px)`;
            });
        }
    }
    
    // Initialize parallax
    initParallax();
    
    // Camera card hover effects
    function initCameraCardEffects() {
        const cameraCards = document.querySelectorAll('.camera-card');
        
        cameraCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                // Add subtle glow effect
                this.style.boxShadow = '0 20px 40px rgba(96, 165, 250, 0.2)';
            });
            
            card.addEventListener('mouseleave', function() {
                // Remove glow effect
                this.style.boxShadow = '';
            });
        });
    }
    
    // Initialize camera card effects
    initCameraCardEffects();
    
    // Tech card interactive effects
    function initTechCardEffects() {
        const techCards = document.querySelectorAll('.tech-card');
        
        techCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                const icon = this.querySelector('.tech-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.1) rotate(5deg)';
                }
            });
            
            card.addEventListener('mouseleave', function() {
                const icon = this.querySelector('.tech-icon');
                if (icon) {
                    icon.style.transform = 'scale(1) rotate(0deg)';
                }
            });
        });
    }
    
    // Initialize tech card effects
    initTechCardEffects();
    
    // Make showNotification globally available
    window.showNotification = showNotification;
});

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