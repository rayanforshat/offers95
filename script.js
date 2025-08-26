// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Get all navigation buttons and clinic sections
    const navButtons = document.querySelectorAll('.nav-btn');
    const clinicSections = document.querySelectorAll('.clinic-section');
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearSearch');
    const serviceItems = document.querySelectorAll('.service-item');
    
    // Add click event listeners to navigation buttons
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get the target clinic from data attribute
            const targetClinic = this.getAttribute('data-clinic');
            
            // Remove active class from all buttons
            navButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Hide all clinic sections
            clinicSections.forEach(section => {
                section.classList.remove('active');
            });
            
            // Show target clinic section
            const targetSection = document.getElementById(targetClinic);
            if (targetSection) {
                targetSection.classList.add('active');
            }
            
            // Clear search when switching tabs
            clearSearch();
            
            // Scroll to top of section smoothly
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    });
    
    // Search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        // Show/hide clear button
        if (searchTerm.length > 0) {
            clearBtn.classList.add('show');
        } else {
            clearBtn.classList.remove('show');
        }
        
        // Filter services
        filterServices(searchTerm);
    });
    
    // Clear search functionality
    clearBtn.addEventListener('click', function() {
        clearSearch();
    });
    
    function clearSearch() {
        searchInput.value = '';
        clearBtn.classList.remove('show');
        
        // Remove all highlights and show all items
        serviceItems.forEach(item => {
            item.style.display = 'block';
            removeHighlights(item);
        });
    }
    
    function filterServices(searchTerm) {
        if (searchTerm === '') {
            // Show all items if search is empty
            serviceItems.forEach(item => {
                item.style.display = 'block';
                removeHighlights(item);
            });
            return;
        }
        
        let hasResults = false;
        
        serviceItems.forEach(item => {
            const serviceName = item.querySelector('.service-name').textContent.toLowerCase();
            const serviceDesc = item.querySelector('.service-desc');
            let descText = serviceDesc ? serviceDesc.textContent.toLowerCase() : '';
            
            // Check if search term matches service name or description
            if (serviceName.includes(searchTerm) || descText.includes(searchTerm)) {
                item.style.display = 'block';
                highlightSearchTerm(item, searchTerm);
                hasResults = true;
            } else {
                item.style.display = 'none';
                removeHighlights(item);
            }
        });
        
        // Show "no results" message if needed
        if (!hasResults) {
            showNoResults();
        } else {
            hideNoResults();
        }
    }
    
    function highlightSearchTerm(item, searchTerm) {
        const serviceName = item.querySelector('.service-name');
        const serviceDesc = item.querySelector('.service-desc');
        
        // Highlight in service name
        highlightText(serviceName, searchTerm);
        
        // Highlight in service description if exists
        if (serviceDesc) {
            highlightText(serviceDesc, searchTerm);
        }
    }
    
    function highlightText(element, searchTerm) {
        const originalText = element.dataset.originalText || element.textContent;
        element.dataset.originalText = originalText;
        
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        const highlightedText = originalText.replace(regex, '<span class="highlight">$1</span>');
        element.innerHTML = highlightedText;
    }
    
    function removeHighlights(item) {
        const serviceName = item.querySelector('.service-name');
        const serviceDesc = item.querySelector('.service-desc');
        
        if (serviceName.dataset.originalText) {
            serviceName.innerHTML = serviceName.dataset.originalText;
        }
        
        if (serviceDesc && serviceDesc.dataset.originalText) {
            serviceDesc.innerHTML = serviceDesc.dataset.originalText;
        }
    }
    
    function showNoResults() {
        // Remove existing no results message
        hideNoResults();
        
        const activeSection = document.querySelector('.clinic-section.active .services-grid');
        if (activeSection) {
            const noResultsDiv = document.createElement('div');
            noResultsDiv.className = 'no-results';
            noResultsDiv.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #666;">
                    <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 20px; opacity: 0.3;"></i>
                    <h3 style="margin-bottom: 10px;">لم يتم العثور على نتائج</h3>
                    <p>جرب البحث بكلمات أخرى أو تصفح الأقسام المختلفة</p>
                </div>
            `;
            activeSection.appendChild(noResultsDiv);
        }
    }
    
    function hideNoResults() {
        const existingNoResults = document.querySelector('.no-results');
        if (existingNoResults) {
            existingNoResults.remove();
        }
    }
    
    // Add hover effects to service items
    serviceItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            if (!this.classList.contains('no-offer')) {
                this.style.transform = 'translateY(-5px) scale(1.02)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            if (!this.classList.contains('no-offer')) {
                this.style.transform = 'translateY(0) scale(1)';
            }
        });
    });
    
    // Add click tracking for social media links
    const socialLinks = document.querySelectorAll('.social-icon');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Add animation effect
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Add click tracking for contact buttons
    const contactButtons = document.querySelectorAll('.contact-btn');
    
    contactButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
            
            // Log contact attempt for analytics
            const contactType = this.classList.contains('whatsapp-btn') ? 'WhatsApp' : 'Phone';
            console.log(`تم النقر على ${contactType}: 0148134516`);
        });
        
        // Add hover pulse animation for contact buttons
        button.addEventListener('mouseenter', function() {
            this.style.animation = 'pulse 0.6s ease-in-out';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.animation = '';
        });
    });
    
    // Add scroll animation for elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all service items for animation
    serviceItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });
    
    // Add keyboard navigation support
    navButtons.forEach((button, index) => {
        button.addEventListener('keydown', function(e) {
            let nextIndex;
            
            switch(e.key) {
                case 'ArrowRight':
                    nextIndex = (index - 1 + navButtons.length) % navButtons.length;
                    navButtons[nextIndex].focus();
                    e.preventDefault();
                    break;
                case 'ArrowLeft':
                    nextIndex = (index + 1) % navButtons.length;
                    navButtons[nextIndex].focus();
                    e.preventDefault();
                    break;
                case 'Enter':
                case ' ':
                    this.click();
                    e.preventDefault();
                    break;
            }
        });
    });
    
    // Add Enter key support for search
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            clearSearch();
        }
    });
    
    // Add loading animation
    const container = document.querySelector('.container');
    container.style.opacity = '0';
    container.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        container.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
    }, 100);
    
    // Add price highlight animation for national day prices
    const nationalPrices = document.querySelectorAll('.national-price');
    
    nationalPrices.forEach(price => {
        price.addEventListener('mouseenter', function() {
            this.style.textShadow = '0 0 10px rgba(13, 119, 51, 0.5)';
            if (!this.classList.contains('special')) {
                this.style.fontSize = '1.6rem';
            }
        });
        
        price.addEventListener('mouseleave', function() {
            this.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.1)';
            if (!this.classList.contains('special')) {
                this.style.fontSize = '1.5rem';
            }
        });
    });
    
    // Add special animation for special offers
    const specialOffers = document.querySelectorAll('.special-offer');
    
    specialOffers.forEach(offer => {
        // Add subtle glow animation
        setInterval(() => {
            offer.style.boxShadow = '0 10px 30px rgba(255, 215, 0, 0.3)';
            setTimeout(() => {
                offer.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.08)';
            }, 1000);
        }, 3000);
    });
    
    // Add note card animation
    const noteCard = document.querySelector('.note-card');
    if (noteCard) {
        noteCard.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
        });
        
        noteCard.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }
    
    // Add Saudi flag animation
    const flagElements = document.querySelectorAll('.flag-decoration i, .flag-decoration span');
    
    flagElements.forEach((flag, index) => {
        setInterval(() => {
            flag.style.transform = 'scale(1.2)';
            setTimeout(() => {
                flag.style.transform = 'scale(1)';
            }, 300);
        }, 2000 + (index * 200));
    });
    
    // Count services for each section
    function countServices() {
        const dentalServices = document.querySelectorAll('#dental .service-item').length;
        const dermatologyServices = document.querySelectorAll('#dermatology .service-item').length;
        const nutritionServices = document.querySelectorAll('#nutrition .service-item').length;
        
        console.log('عروض اليوم الوطني - إحصائيات:');
        console.log('عروض الأسنان:', dentalServices);
        console.log('عروض الجلدية والتجميل:', dermatologyServices);
        console.log('عروض التغذية:', nutritionServices);
        console.log('المجموع:', dentalServices + dermatologyServices + nutritionServices);
    }
    
    // Auto-focus search input on page load
    setTimeout(() => {
        searchInput.focus();
    }, 1000);
    
    // Add search suggestions (optional enhancement)
    const commonSearchTerms = [
        'ليزر', 'بوتوكس', 'فيلر', 'تبييض', 'تنظيف', 'زراعة', 'ابتسامة',
        'هيدرافيشيال', 'تشقير', 'فراكشنال', 'بلازما', 'إبرة', 'لايبوسل',
        'تحليل', 'باقة', 'تغذية', 'اسنان', 'جلدية'
    ];
    
    // Initialize the application
    countServices();
    console.log('عروض اليوم الوطني السعودي 95 - محملة بنجاح! 🇸🇦');
});