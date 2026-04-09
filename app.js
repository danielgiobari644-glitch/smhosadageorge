// Public Site JavaScript - Salvation Ministries Ada George
// Handles dynamic content loading, form submissions, and real-time updates

// Wait for Firebase to initialize
setTimeout(initializeSite, 1000);

function initializeSite() {
    // Load all dynamic content
    loadThemeSettings();
    loadAboutContent();
    loadServiceTimes();
    loadSermons();
    loadEvents();
    loadTestimonies();
    loadContactInfo();
    loadOfferingDetails();
    
    // Setup navigation
    setupNavigation();
    
    // Setup form handlers
    setupTestimonyForm();
    setupContactForm();
    
    // Setup scroll animations
    setupScrollAnimations();
    
    // Listen for real-time updates
    setupRealtimeListeners();
}

// ========================================
// Navigation
// ========================================

function setupNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    navToggle?.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
    
    // Smooth scroll and close menu
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                    navMenu.classList.remove('active');
                }
            }
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 100) {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
        }
    });
}

// ========================================
// Theme Settings
// ========================================

async function loadThemeSettings() {
    try {
        const doc = await db.collection(Collections.SETTINGS).doc('theme').get();
        if (doc.exists) {
            const theme = doc.data();
            
            // Update CSS variables
            if (theme.primaryColor) {
                document.documentElement.style.setProperty('--primary-color', theme.primaryColor);
            }
            if (theme.secondaryColor) {
                document.documentElement.style.setProperty('--secondary-color', theme.secondaryColor);
            }
            if (theme.accentColor) {
                document.documentElement.style.setProperty('--accent-color', theme.accentColor);
            }
            
            // Update logo
            if (theme.logoUrl) {
                const logos = document.querySelectorAll('.nav-logo img, .footer-logo img');
                logos.forEach(logo => {
                    logo.src = theme.logoUrl;
                    logo.onerror = () => {
                        logo.src = '/mnt/user-data/uploads/1775217322747_image.png';
                    };
                });
            }
            
            // Update favicon
            if (theme.faviconUrl) {
                let favicon = document.querySelector('link[rel="icon"]');
                if (!favicon) {
                    favicon = document.createElement('link');
                    favicon.rel = 'icon';
                    document.head.appendChild(favicon);
                }
                favicon.href = theme.faviconUrl;
            }
            
            // Update hero section
            const hero = document.querySelector('.hero');
            if (hero && theme.heroImage) {
                hero.style.background = `linear-gradient(135deg, 
                    rgba(99, 102, 241, 0.95), 
                    rgba(236, 72, 153, 0.9)),
                    url('${theme.heroImage}')`;
                hero.style.backgroundSize = 'cover';
                hero.style.backgroundPosition = 'center';
                hero.style.backgroundAttachment = 'fixed';
            }
            
            // Update hero text
            const heroTitle = document.getElementById('heroTitle');
            const heroSubtext = document.getElementById('heroSubtext');
            if (heroTitle && theme.heroText) heroTitle.textContent = theme.heroText;
            if (heroSubtext && theme.heroSubtext) heroSubtext.textContent = theme.heroSubtext;
            
            // Apply dark mode if set
            if (theme.mode === 'dark') {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
        }
    } catch (error) {
        console.error('Error loading theme settings:', error);
    }
}

// ========================================
// About Content
// ========================================

async function loadAboutContent() {
    try {
        const doc = await db.collection(Collections.CONTENT).doc('about').get();
        if (doc.exists) {
            const content = doc.data();
            
            const missionText = document.getElementById('missionText');
            const visionText = document.getElementById('visionText');
            const welcomeText = document.getElementById('welcomeText');
            
            if (missionText && content.mission) missionText.textContent = content.mission;
            if (visionText && content.vision) visionText.textContent = content.vision;
            if (welcomeText && content.welcomeMessage) welcomeText.textContent = content.welcomeMessage;
        }
    } catch (error) {
        console.error('Error loading about content:', error);
    }
}

// ========================================
// Service Times
// ========================================

async function loadServiceTimes() {
    try {
        const doc = await db.collection(Collections.SERVICES).doc('schedule').get();
        if (doc.exists) {
            const schedule = doc.data();
            
            // Update Sunday service
            if (schedule.sunday) {
                const sundayCard = document.getElementById('sundayService');
                if (sundayCard) {
                    sundayCard.querySelector('.service-title').textContent = schedule.sunday.title;
                    sundayCard.querySelector('.service-time').textContent = schedule.sunday.time;
                    sundayCard.querySelector('.service-description').textContent = schedule.sunday.description;
                }
            }
            
            // Update midweek service
            if (schedule.midweek) {
                const midweekCard = document.getElementById('midweekService');
                if (midweekCard) {
                    midweekCard.querySelector('.service-title').textContent = schedule.midweek.title;
                    midweekCard.querySelector('.service-time').textContent = schedule.midweek.time;
                    midweekCard.querySelector('.service-description').textContent = schedule.midweek.description;
                }
            }
            
            // Update special service
            if (schedule.special) {
                const specialCard = document.getElementById('specialService');
                if (specialCard) {
                    specialCard.querySelector('.service-title').textContent = schedule.special.title;
                    specialCard.querySelector('.service-time').textContent = schedule.special.time;
                    specialCard.querySelector('.service-description').textContent = schedule.special.description;
                }
            }
        }
    } catch (error) {
        console.error('Error loading service times:', error);
    }
}

// ========================================
// Sermons
// ========================================

async function loadSermons() {
    try {
        const sermonsGrid = document.getElementById('sermonsGrid');
        const sermonsEmpty = document.getElementById('sermonsEmpty');
        
        const snapshot = await db.collection(Collections.SERMONS)
            .orderBy('date', 'desc')
            .limit(6)
            .get();
        
        if (!snapshot.empty) {
            sermonsEmpty.style.display = 'none';
            sermonsGrid.innerHTML = '';
            
            snapshot.forEach(doc => {
                const sermon = doc.data();
                const card = createSermonCard(sermon);
                sermonsGrid.appendChild(card);
            });
        }
    } catch (error) {
        console.error('Error loading sermons:', error);
    }
}

function createSermonCard(sermon) {
    const card = document.createElement('div');
    card.className = 'sermon-card fade-in';
    
    // Extract YouTube video ID
    const videoId = extractYouTubeId(sermon.videoUrl);
    
    card.innerHTML = `
        <div class="sermon-video">
            <iframe 
                src="https://www.youtube.com/embed/${videoId}" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen
                loading="lazy">
            </iframe>
        </div>
        <div class="sermon-info">
            <h3 class="sermon-title">${sermon.title}</h3>
            <div class="sermon-date">${formatDate(sermon.date)}</div>
            ${sermon.description ? `<p class="sermon-description">${sermon.description}</p>` : ''}
        </div>
    `;
    
    return card;
}

function extractYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
}

// ========================================
// Events
// ========================================

async function loadEvents() {
    try {
        const eventsGrid = document.getElementById('eventsGrid');
        const eventsEmpty = document.getElementById('eventsEmpty');
        
        const snapshot = await db.collection(Collections.EVENTS)
            .orderBy('date', 'asc')
            .get();
        
        if (!snapshot.empty) {
            eventsEmpty.style.display = 'none';
            eventsGrid.innerHTML = '';
            
            snapshot.forEach(doc => {
                const event = doc.data();
                const card = createEventCard(event);
                eventsGrid.appendChild(card);
            });
        }
    } catch (error) {
        console.error('Error loading events:', error);
    }
}

function createEventCard(event) {
    const card = document.createElement('div');
    card.className = 'event-card fade-in';
    
    card.innerHTML = `
        <img src="${event.imageUrl}" alt="${event.title}" class="event-image" onerror="this.src='https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&q=80'">
        <div class="event-content">
            <div class="event-date">${formatDate(event.date)}</div>
            <h3 class="event-title">${event.title}</h3>
            <p class="event-description">${event.description}</p>
        </div>
    `;
    
    return card;
}

// ========================================
// Testimonies
// ========================================

async function loadTestimonies() {
    try {
        const testimoniesGrid = document.getElementById('testimoniesGrid');
        const testimoniesEmpty = document.getElementById('testimoniesEmpty');
        
        const snapshot = await db.collection(Collections.TESTIMONIES)
            .where('approved', '==', true)
            .orderBy('submittedAt', 'desc')
            .get();
        
        if (!snapshot.empty) {
            testimoniesEmpty.style.display = 'none';
            testimoniesGrid.innerHTML = '';
            
            snapshot.forEach(doc => {
                const testimony = doc.data();
                const card = createTestimonyCard(testimony);
                testimoniesGrid.appendChild(card);
            });
        }
    } catch (error) {
        console.error('Error loading testimonies:', error);
    }
}

function createTestimonyCard(testimony) {
    const card = document.createElement('div');
    card.className = 'testimony-card fade-in';
    
    card.innerHTML = `
        <p class="testimony-message">${testimony.message}</p>
        <div class="testimony-author">${testimony.name}</div>
        <div class="testimony-date">${formatDate(testimony.submittedAt)}</div>
    `;
    
    return card;
}

// ========================================
// Contact Info
// ========================================

async function loadContactInfo() {
    try {
        const doc = await db.collection(Collections.CONTENT).doc('contact').get();
        if (doc.exists) {
            const contact = doc.data();
            
            const emailEl = document.getElementById('contactEmail');
            const phoneEl = document.getElementById('contactPhone');
            const addressEl = document.getElementById('contactAddress');
            
            if (emailEl && contact.email) emailEl.textContent = contact.email;
            if (phoneEl && contact.phone) phoneEl.textContent = contact.phone;
            if (addressEl && contact.address) addressEl.textContent = contact.address;
        }
    } catch (error) {
        console.error('Error loading contact info:', error);
    }
}

// ========================================
// Offering Details
// ========================================

async function loadOfferingDetails() {
    try {
        const doc = await db.collection(Collections.CONTENT).doc('contact').get();
        if (doc.exists) {
            const contact = doc.data();
            
            if (contact.offeringAccount) {
                const bankEl = document.getElementById('offeringBank');
                const accountNameEl = document.getElementById('offeringAccountName');
                const accountNumberEl = document.getElementById('offeringAccountNumber');
                
                if (bankEl) bankEl.textContent = contact.offeringAccount.bank;
                if (accountNameEl) accountNameEl.textContent = contact.offeringAccount.accountName;
                if (accountNumberEl) accountNumberEl.textContent = contact.offeringAccount.accountNumber;
            }
        }
    } catch (error) {
        console.error('Error loading offering details:', error);
    }
}

// ========================================
// Testimony Form
// ========================================

function setupTestimonyForm() {
    const form = document.getElementById('testimonyForm');
    const feedback = document.getElementById('testimonyFeedback');
    
    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('testimonyName').value.trim();
        const message = document.getElementById('testimonyMessage').value.trim();
        
        if (!name || !message) {
            showFeedback(feedback, 'Please fill in all fields', 'error');
            return;
        }
        
        try {
            await db.collection(Collections.TESTIMONIES).add({
                name: name,
                message: message,
                approved: false,
                submittedAt: firebase.firestore.Timestamp.now()
            });
            
            form.reset();
            showFeedback(feedback, 'Thank you! Your testimony has been submitted and is awaiting approval.', 'success');
        } catch (error) {
            console.error('Error submitting testimony:', error);
            showFeedback(feedback, 'An error occurred. Please try again later.', 'error');
        }
    });
}

// ========================================
// Contact Form
// ========================================

function setupContactForm() {
    const form = document.getElementById('contactForm');
    const feedback = document.getElementById('contactFeedback');
    
    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('contactName').value.trim();
        const email = document.getElementById('contactEmailInput').value.trim();
        const message = document.getElementById('contactMessage').value.trim();
        
        if (!name || !email || !message) {
            showFeedback(feedback, 'Please fill in all fields', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showFeedback(feedback, 'Please enter a valid email address', 'error');
            return;
        }
        
        try {
            // In a real application, you would send this to a backend or email service
            // For now, we'll just show a success message
            console.log('Contact form submitted:', { name, email, message });
            
            form.reset();
            showFeedback(feedback, 'Thank you for your message! We will get back to you soon.', 'success');
        } catch (error) {
            console.error('Error submitting contact form:', error);
            showFeedback(feedback, 'An error occurred. Please try again later.', 'error');
        }
    });
}

// ========================================
// Scroll Animations
// ========================================

function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeIn 0.8s ease-out forwards';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.fade-in, .about-card, .service-card, .sermon-card, .event-card, .testimony-card').forEach(el => {
        observer.observe(el);
    });
}

// ========================================
// Real-time Listeners
// ========================================

function setupRealtimeListeners() {
    // Listen for theme changes
    db.collection(Collections.SETTINGS).doc('theme')
        .onSnapshot((doc) => {
            if (doc.exists) {
                loadThemeSettings();
            }
        });
    
    // Listen for sermon updates
    db.collection(Collections.SERMONS)
        .onSnapshot(() => {
            loadSermons();
        });
    
    // Listen for event updates
    db.collection(Collections.EVENTS)
        .onSnapshot(() => {
            loadEvents();
        });
    
    // Listen for approved testimony updates
    db.collection(Collections.TESTIMONIES)
        .where('approved', '==', true)
        .onSnapshot(() => {
            loadTestimonies();
        });
}

// ========================================
// Utility Functions
// ========================================

function showFeedback(element, message, type) {
    element.textContent = message;
    element.className = `form-feedback ${type}`;
    
    setTimeout(() => {
        element.className = 'form-feedback';
    }, 5000);
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function formatDate(timestamp) {
    if (!timestamp) return '';
    
    let date;
    if (timestamp.toDate) {
        date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
        date = timestamp;
    } else {
        date = new Date(timestamp);
    }
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}
