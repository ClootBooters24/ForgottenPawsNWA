// Main JavaScript for Forgotten Paws NWA website

document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    const closeNav = () => {
        if (!mainNav) return;
        mobileMenuToggle.classList.remove('active');
        mainNav.classList.remove('active');
        document.body.style.overflow = '';
        document.body.classList.remove('nav-open');
    };

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mainNav.classList.toggle('active');
            const isOpen = mainNav.classList.contains('active');
            document.body.style.overflow = isOpen ? 'hidden' : '';
            document.body.classList.toggle('nav-open', isOpen);
        });
    }
    
    // Close mobile menu when clicking a link
    const navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenuToggle) {
                closeNav();
            }
        });
    });

    // Close mobile nav when clicking outside the panel
    document.addEventListener('click', (event) => {
        if (!mainNav || !mobileMenuToggle) return;
        const navOpen = mainNav.classList.contains('active');
        const clickedToggle = mobileMenuToggle.contains(event.target);
        const clickedNav = mainNav.contains(event.target);
        if (navOpen && !clickedToggle && !clickedNav) {
            closeNav();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeNav();
        }
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Don't smooth scroll if it's just "#" 
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                window.scrollTo({
                    top: target.offsetTop - 80, // Adjust for header height
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add animation to donation buttons on click
    const donationButtons = document.querySelectorAll('.donation-btn');
    donationButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Add a visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
            
            // Track donation clicks (if you have analytics)
            // console.log('Donation button clicked:', this.textContent.trim());
        });
    });
});