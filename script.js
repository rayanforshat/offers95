// Language state
let currentLang = 'ar';

// Toggle language function
function toggleLanguage() {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    
    // Update HTML attributes
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    
    // Update body font family
    document.body.style.fontFamily = currentLang === 'ar' ? "'Cairo', sans-serif" : "'Poppins', sans-serif";
    
    // Update all multilingual elements
    updateMultilingualElements();
    
    // Update search placeholder
    const searchInput = document.getElementById('searchInput');
    searchInput.placeholder = searchInput.getAttribute('data-placeholder-' + currentLang);
    
    // Update language toggle button text
    const langBtn = document.getElementById('languageToggle');
    langBtn.querySelector('.lang-text').textContent = currentLang === 'ar' ? 'English' : 'العربية';
}

// Update all elements with multilingual data attributes
function updateMultilingualElements() {
    document.querySelectorAll('[data-ar][data-en]').forEach(element => {
        const text = element.getAttribute('data-' + currentLang);
        if (text) {
            // Preserve original text as data attribute for search functionality
            if (!element.dataset.originalText) {
                element.dataset.originalText = element.textContent;
            }
            element.textContent = text;
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const clinicSections = document.querySelectorAll('.clinic-section');
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearSearch');
    
    // Navigation functionality
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetClinic = this.getAttribute('data-clinic');
            
            navButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            clinicSections.forEach(section => section.classList.remove('active'));
            
            const targetSection = document.getElementById(targetClinic);
            if (targetSection) {
                targetSection.classList.add('active');
            }
            
            clearSearch();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
    
    // Search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        if (searchTerm.length > 0) {
            clearBtn.classList.add('show');
        } else {
            clearBtn.classList.remove('show');
        }
        
        filterServices(searchTerm);
    });
    
    clearBtn.addEventListener('click', clearSearch);
    
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            clearSearch();
        }
    });
    
    function clearSearch() {
        searchInput.value = '';
        clearBtn.classList.remove('show');
        
        document.querySelectorAll('.service-item').forEach(item => {
            item.style.display = 'block';
            removeHighlights(item);
        });
    }
    
    function filterServices(searchTerm) {
        if (searchTerm === '') {
            document.querySelectorAll('.service-item').forEach(item => {
                item.style.display = 'block';
                removeHighlights(item);
            });
            return;
        }
        
        document.querySelectorAll('.service-item').forEach(item => {
            const serviceName = item.querySelector('.service-name');
            const serviceDesc = item.querySelector('.service-desc');
            
            // Get text in both languages for search
            const nameAr = serviceName?.getAttribute('data-ar') || '';
            const nameEn = serviceName?.getAttribute('data-en') || '';
            const descAr = serviceDesc?.getAttribute('data-ar') || '';
            const descEn = serviceDesc?.getAttribute('data-en') || '';
            
            const searchText = (nameAr + ' ' + nameEn + ' ' + descAr + ' ' + descEn).toLowerCase();
            
            if (searchText.includes(searchTerm)) {
                item.style.display = 'block';
                highlightSearchTerm(item, searchTerm);
            } else {
                item.style.display = 'none';
                removeHighlights(item);
            }
        });
    }
    
    function highlightSearchTerm(item, searchTerm) {
        const serviceName = item.querySelector('.service-name');
        const serviceDesc = item.querySelector('.service-desc');
        
        if (serviceName) highlightText(serviceName, searchTerm);
        if (serviceDesc) highlightText(serviceDesc, searchTerm);
    }
    
    function highlightText(element, searchTerm) {
        const originalText = element.textContent;
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        const highlightedText = originalText.replace(regex, '<span class="highlight">$1</span>');
        element.innerHTML = highlightedText;
    }
    
    function removeHighlights(item) {
        const serviceName = item.querySelector('.service-name');
        const serviceDesc = item.querySelector('.service-desc');
        
        if (serviceName) {
            serviceName.textContent = serviceName.getAttribute('data-' + currentLang) || serviceName.textContent;
        }
        if (serviceDesc) {
            serviceDesc.textContent = serviceDesc.getAttribute('data-' + currentLang) || serviceDesc.textContent;
        }
    }
    
    // Loading animation
    const container = document.querySelector('.container');
    container.style.opacity = '0';
    container.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        container.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
    }, 100);
});
