// Public Site JavaScript - Salvation Ministries Ada George
// Handles dynamic content loading, form submissions, and real-time updates

// Wait for Firebase to initialize
document.addEventListener('DOMContentLoaded', () => {
    waitForFirebase().then(() => {
        initializeSite();
    });
});

function initializeSite() {
    // Load all dynamic content
    loadThemeSettings();
    loadAboutContent();
    loadQuotes();
    loadServiceTimes();
    loadSermons();
    loadEvents();
    loadMoments();
    loadTestimonies();
    loadContactInfo();
    loadOfferingDetails();
    
    // Setup navigation
    setupNavigation();
    
    // Setup form handlers
    setupTestimonyForm();
    setupContactForm();

    // Setup moments tabs
    setupMomentsTabs();

    // Initialize icons
    if (window.lucide) {
        lucide.createIcons();
    }
    
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
                });
            }

            // Update favicon
            if (theme.faviconUrl) {
                let link = document.querySelector("link[rel~='icon']");
                if (!link) {
                    link = document.createElement('link');
                    link.rel = 'icon';
                    document.getElementsByTagName('head')[0].appendChild(link);
                }
                link.href = theme.faviconUrl;
            }
            
            // Update hero section
            const heroSection = document.getElementById('home');
            const heroTitle = document.getElementById('heroTitle');
            const heroSubtext = document.getElementById('heroSubtext');
            
            if (heroSection && theme.heroImage) {
                heroSection.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('${theme.heroImage}')`;
                heroSection.style.backgroundSize = 'cover';
                heroSection.style.backgroundPosition = 'center';
            }
            
            if (heroTitle && theme.heroText) heroTitle.textContent = theme.heroText;
            if (heroSubtext && theme.heroSubtext) heroSubtext.textContent = theme.heroSubtext;
            
            // Update livestream button
            const livestreamBtn = document.getElementById('livestreamBtn');
            if (livestreamBtn && theme.livestreamUrl) {
                livestreamBtn.href = theme.livestreamUrl;
            }
            
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
            
            const missionImg = document.getElementById('missionImage');
            const visionImg = document.getElementById('visionImage');
            const welcomeImg = document.getElementById('welcomeImage');
            
            if (missionText && content.mission) missionText.textContent = content.mission;
            if (visionText && content.vision) visionText.textContent = content.vision;
            if (welcomeText && content.welcomeMessage) welcomeText.textContent = content.welcomeMessage;
            
            if (missionImg && content.missionImage) missionImg.src = content.missionImage;
            if (visionImg && content.visionImage) visionImg.src = content.visionImage;
            if (welcomeImg && content.welcomeImage) welcomeImg.src = content.welcomeImage;
        }
    } catch (error) {
        console.error('Error loading about content:', error);
    }
}

// ========================================
// Daily Quotes
// ========================================

async function loadQuotes() {
    try {
        const container = document.getElementById('quoteContainer');
        if (!container) return;

        // Fetch all quotes ordered by date to avoid composite index requirement
        const snapshot = await db.collection(Collections.QUOTES)
            .orderBy('createdAt', 'desc')
            .get();

        const activeQuote = snapshot.docs.find(doc => doc.data().active === true);

        if (activeQuote) {
            const quote = activeQuote.data();
            container.innerHTML = `
                <blockquote>"${quote.text}"</blockquote>
                ${quote.author ? `<cite>— ${quote.author}</cite>` : ''}
            `;
        } else {
            container.innerHTML = '<p>The word of God is a lamp unto my feet and a light unto my path.</p><cite>— Psalm 119:105</cite>';
        }
    } catch (error) {
        console.error('Error loading quotes:', error);
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
            
            // Update Sunday services
            for (let i = 1; i <= 4; i++) {
                const key = `sunday${i}`;
                if (schedule[key]) {
                    const card = document.getElementById(`sundayService${i}`);
                    if (card) {
                        card.querySelector('.service-title').textContent = schedule[key].title;
                        card.querySelector('.service-time').textContent = schedule[key].time;
                        card.querySelector('.service-description').textContent = schedule[key].description;
                    }
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
        
        if (!sermonsGrid || !sermonsEmpty) return;

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
        } else {
            sermonsEmpty.style.display = 'block';
            sermonsGrid.innerHTML = '';
        }
    } catch (error) {
        console.error('Error loading sermons:', error);
    }
}

function createSermonCard(sermon) {
    const card = document.createElement('div');
    card.className = 'card sermon-card';
    
    const videoId = extractYouTubeId(sermon.videoUrl);
    
    card.innerHTML = `
        <div class="sermon-video">
            <iframe 
                src="https://www.youtube.com/embed/${videoId}" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
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

let currentEventSlide = 0;
let eventSlidesCount = 0;
let eventSliderInterval = null;

async function loadEvents() {
    try {
        const eventsGrid = document.getElementById('eventsGrid');
        const eventsSlider = document.getElementById('eventsPosterSlider');
        
        if (!eventsGrid || !eventsSlider) return;

        const snapshot = await db.collection(Collections.EVENTS)
            .orderBy('date', 'asc')
            .get();
        
        if (!snapshot.empty) {
            eventsGrid.innerHTML = '';
            
            const events = [];
            snapshot.forEach(doc => events.push(doc.data()));
            eventSlidesCount = events.length;
            
            events.forEach((event) => {
                const card = createEventCard(event);
                eventsGrid.appendChild(card);
            });

            setupEventSlider();
            if (window.lucide) {
                lucide.createIcons();
            }
        } else {
            eventsGrid.innerHTML = '<div class="event-poster-item"><img src="https://images.unsplash.com/photo-1438032005730-c779502df39b?w=800&q=80" alt="No Events"></div>';
        }
    } catch (error) {
        console.error('Error loading events:', error);
    }
}

function setupEventSlider() {
    const prevBtn = document.getElementById('eventPrev');
    const nextBtn = document.getElementById('eventNext');
    
    if (prevBtn) prevBtn.onclick = () => {
        moveEventSlide(-1);
        resetEventInterval();
    };
    if (nextBtn) nextBtn.onclick = () => {
        moveEventSlide(1);
        resetEventInterval();
    };
    
    resetEventInterval();
}

function resetEventInterval() {
    if (eventSliderInterval) clearInterval(eventSliderInterval);
    eventSliderInterval = setInterval(() => moveEventSlide(1), 5000);
}

function moveEventSlide(direction) {
    currentEventSlide = (currentEventSlide + direction + eventSlidesCount) % eventSlidesCount;
    updateEventSlider();
}

function goToEventSlide(index) {
    currentEventSlide = index;
    updateEventSlider();
}

function updateEventSlider() {
    const track = document.getElementById('eventsGrid');
    
    if (track) {
        track.style.transform = `translateX(-${currentEventSlide * 100}%)`;
    }
}

function createEventCard(event) {
    const card = document.createElement('div');
    card.className = 'event-poster-item';
    
    card.innerHTML = `
        <img src="${event.imageUrl}" alt="${event.title}" referrerPolicy="no-referrer">
    `;
    
    return card;
}

// ========================================
// Moments
// ========================================

let currentMomentSlide = 0;
let momentSlidesCount = 0;
let momentSliderInterval = null;

async function loadMoments() {
    try {
        const photosTrack = document.getElementById('photosTrack');
        const videosTrack = document.getElementById('videosTrack');
        const momentDots = document.getElementById('momentDots');
        
        if (!photosTrack || !videosTrack) return;

        const snapshot = await db.collection(Collections.MOMENTS)
            .orderBy('createdAt', 'desc')
            .get();
        
        const photos = [];
        const videos = [];
        
        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.type === 'photo') photos.push(data);
            else if (data.type === 'video') videos.push(data);
        });

        // Load Photos
        if (photos.length > 0) {
            photosTrack.innerHTML = '';
            momentDots.innerHTML = '';
            momentSlidesCount = photos.length;
            
            photos.forEach((photo, index) => {
                const slide = document.createElement('div');
                slide.className = 'moment-slide';
                slide.innerHTML = `
                    <img src="${photo.url}" alt="${photo.title || ''}" referrerPolicy="no-referrer">
                    ${(photo.title || photo.description) ? `
                        <div class="moment-info">
                            ${photo.title ? `<h3>${photo.title}</h3>` : ''}
                            ${photo.description ? `<p>${photo.description}</p>` : ''}
                        </div>
                    ` : ''}
                `;
                photosTrack.appendChild(slide);
                
                const dot = document.createElement('button');
                dot.className = `slider-dot ${index === 0 ? 'active' : ''}`;
                dot.onclick = () => goToMomentSlide(index);
                momentDots.appendChild(dot);
            });
            setupMomentSlider();
        }

        // Load Videos
        if (videos.length > 0) {
            videosTrack.innerHTML = '';
            videos.forEach(video => {
                const card = document.createElement('div');
                card.className = 'video-card';
                card.innerHTML = `
                    <a href="${video.url}" target="_blank" class="video-thumb">
                        <i data-lucide="play-circle"></i>
                    </a>
                    <div class="video-content">
                        <h3>${video.title || 'Church Moment'}</h3>
                    </div>
                `;
                videosTrack.appendChild(card);
            });
            if (window.lucide) lucide.createIcons();
        }
    } catch (error) {
        console.error('Error loading moments:', error);
    }
}

function setupMomentsTabs() {
    const tabs = document.querySelectorAll('.moment-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const type = tab.dataset.type;
            document.querySelectorAll('.moments-gallery').forEach(g => g.classList.remove('active'));
            document.getElementById(`${type}Gallery`).classList.add('active');
        });
    });
}

function setupMomentSlider() {
    const prevBtn = document.getElementById('momentPrev');
    const nextBtn = document.getElementById('momentNext');
    
    if (prevBtn) prevBtn.onclick = () => {
        moveMomentSlide(-1);
        resetMomentInterval();
    };
    if (nextBtn) nextBtn.onclick = () => {
        moveMomentSlide(1);
        resetMomentInterval();
    };
    
    resetMomentInterval();
}

function resetMomentInterval() {
    if (momentSliderInterval) clearInterval(momentSliderInterval);
    momentSliderInterval = setInterval(() => moveMomentSlide(1), 6000);
}

function moveMomentSlide(direction) {
    if (momentSlidesCount === 0) return;
    currentMomentSlide = (currentMomentSlide + direction + momentSlidesCount) % momentSlidesCount;
    updateMomentSlider();
}

function goToMomentSlide(index) {
    currentMomentSlide = index;
    updateMomentSlider();
    resetMomentInterval();
}

function updateMomentSlider() {
    const track = document.getElementById('photosTrack');
    const dots = document.querySelectorAll('#momentDots .slider-dot');
    
    if (track) {
        track.style.transform = `translateX(-${currentMomentSlide * 100}%)`;
    }
    
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentMomentSlide);
    });
}

// ========================================
// Testimonies
// ========================================

async function loadTestimonies() {
    try {
        const testimoniesGrid = document.getElementById('testimoniesGrid');
        const testimoniesEmpty = document.getElementById('testimoniesEmpty');
        
        if (!testimoniesGrid || !testimoniesEmpty) return;

        // Fetch all testimonies ordered by date to avoid composite index requirement
        const snapshot = await db.collection(Collections.TESTIMONIES)
            .orderBy('submittedAt', 'desc')
            .get();
        
        const approvedTestimonies = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.approved === true) {
                approvedTestimonies.push(data);
            }
        });

        if (approvedTestimonies.length > 0) {
            testimoniesEmpty.style.display = 'none';
            testimoniesGrid.innerHTML = '';
            
            approvedTestimonies.forEach(testimony => {
                const card = createTestimonyCard(testimony);
                testimoniesGrid.appendChild(card);
            });
        } else {
            testimoniesEmpty.style.display = 'block';
            testimoniesGrid.innerHTML = '';
        }
    } catch (error) {
        console.error('Error loading testimonies:', error);
    }
}

function createTestimonyCard(testimony) {
    const card = document.createElement('div');
    card.className = 'card testimony-card';
    
    card.innerHTML = `
        <p class="testimony-message">"${testimony.message}"</p>
        <div class="testimony-author">- ${testimony.name}</div>
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
        
        try {
            await db.collection(Collections.MESSAGES).add({
                name: name,
                email: email,
                message: message,
                submittedAt: firebase.firestore.Timestamp.now()
            });
            
            form.reset();
            showFeedback(feedback, 'Thank you for your message! We will get back to you soon.', 'success');
        } catch (error) {
            console.error('Error submitting contact form:', error);
            showFeedback(feedback, 'An error occurred. Please try again later.', 'error');
        }
    });
}

// ========================================
// Real-time Listeners
// ========================================

function setupRealtimeListeners() {
    db.collection(Collections.SETTINGS).doc('theme')
        .onSnapshot((doc) => {
            if (doc.exists) {
                loadThemeSettings();
            }
        });
    
    db.collection(Collections.SERMONS)
        .onSnapshot(() => {
            loadSermons();
        });
    
    db.collection(Collections.EVENTS)
        .onSnapshot(() => {
            loadEvents();
        });

    db.collection(Collections.QUOTES)
        .onSnapshot(() => {
            loadQuotes();
        });

    db.collection(Collections.MOMENTS)
        .onSnapshot(() => {
            loadMoments();
        });
    
    db.collection(Collections.TESTIMONIES)
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
