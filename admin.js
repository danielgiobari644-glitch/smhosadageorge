// Admin Dashboard JavaScript - Salvation Ministries Ada George
// Handles authentication, content management, and real-time updates

let currentUser = null;

// Wait for DOM and Firebase to be ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, waiting for Firebase...');
  waitForFirebase().then(() => {
    console.log('Firebase ready, initializing admin...');
    initializeAdmin();
    loadThemeSettings(); // Apply theme to admin dashboard
  });
});

function initializeAdmin() {
    setupLogin();
    setupNavigation();
    setupForms();
    
    // Initialize icons
    if (window.lucide) {
        lucide.createIcons();
    }
}

// ========================================
// Theme Settings Application
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
                const logos = document.querySelectorAll('.admin-logo img, .login-logo img');
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
// Authentication
// ========================================

function setupLogin() {
    const loginForm = document.getElementById('loginForm');
    const loginFeedback = document.getElementById('loginFeedback');
    
    // Check if already logged in
    const loggedIn = sessionStorage.getItem('adminLoggedIn');
    if (loggedIn === 'true') {
        showDashboard();
        return;
    }
    
    loginForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value.trim();
        
        if (!username || !password) {
            showFeedback(loginFeedback, 'Please enter both username and password', 'error');
            return;
        }
        
        try {
            console.log('Attempting login...');
            
            // Wait for Firebase to be ready
            await waitForFirebase();
            
            const doc = await db.collection(Collections.ADMIN).doc('credentials').get();
            
            if (!doc.exists) {
                console.error('Credentials document does not exist');
                showFeedback(loginFeedback, 'Admin credentials not found. Please check Firebase setup.', 'error');
                return;
            }
            
            const credentials = doc.data();
            console.log('Credentials retrieved successfully');
            
            if (username === credentials.username && password === credentials.password) {
                console.log('Login successful');
                sessionStorage.setItem('adminLoggedIn', 'true');
                currentUser = username;
                showDashboard();
            } else {
                console.log('Invalid credentials');
                showFeedback(loginFeedback, 'Invalid username or password', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            showFeedback(loginFeedback, `Error: ${error.message}. Please try again.`, 'error');
        }
    });
}

function showDashboard() {
    const loginScreen = document.getElementById('loginScreen');
    const adminDashboard = document.getElementById('adminDashboard');
    if (loginScreen) loginScreen.style.display = 'none';
    if (adminDashboard) adminDashboard.style.display = 'flex';
    loadAllData();
}

// ========================================
// Navigation
// ========================================

function setupNavigation() {
    const navItems = document.querySelectorAll('.admin-nav-item');
    const panels = document.querySelectorAll('.admin-panel');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const panelId = item.dataset.panel + 'Panel';
            
            // Update active states
            navItems.forEach(nav => nav.classList.remove('active'));
            panels.forEach(panel => panel.classList.remove('active'));
            
            item.classList.add('active');
            document.getElementById(panelId)?.classList.add('active');
        });
    });
}

// ========================================
// Load All Data
// ========================================

async function loadAllData() {
    loadThemeData();
    loadHeroData();
    loadContentData();
    loadServicesData();
    loadContactData();
    loadSermonsList();
    loadEventsList();
    loadTestimoniesList();
    loadMessagesList();
}

// ========================================
// Theme Settings
// ========================================

async function loadThemeData() {
    try {
        const doc = await db.collection(Collections.SETTINGS).doc('theme').get();
        if (doc.exists) {
            const theme = doc.data();
            const themeMode = document.getElementById('themeMode');
            const primaryColor = document.getElementById('primaryColor');
            const secondaryColor = document.getElementById('secondaryColor');
            const accentColor = document.getElementById('accentColor');
            const logoUrl = document.getElementById('logoUrl');
            const faviconUrl = document.getElementById('faviconUrl');

            if (themeMode) themeMode.value = theme.mode || 'light';
            if (primaryColor) primaryColor.value = theme.primaryColor || '#2c5f7a';
            if (secondaryColor) secondaryColor.value = theme.secondaryColor || '#d946ef';
            if (accentColor) accentColor.value = theme.accentColor || '#6366f1';
            if (logoUrl) logoUrl.value = theme.logoUrl || '';
            if (faviconUrl) faviconUrl.value = theme.faviconUrl || '';
        }
    } catch (error) {
        console.error('Error loading theme data:', error);
    }
}

// ========================================
// Hero Settings
// ========================================

async function loadHeroData() {
    try {
        const doc = await db.collection(Collections.SETTINGS).doc('theme').get();
        if (doc.exists) {
            const theme = doc.data();
            const heroImageUrl = document.getElementById('heroImageUrl');
            const heroTitleInput = document.getElementById('heroTitleInput');
            const heroSubtextInput = document.getElementById('heroSubtextInput');

            if (heroImageUrl) heroImageUrl.value = theme.heroImage || '';
            if (heroTitleInput) heroTitleInput.value = theme.heroText || '';
            if (heroSubtextInput) heroSubtextInput.value = theme.heroSubtext || '';
        }
    } catch (error) {
        console.error('Error loading hero data:', error);
    }
}

// ========================================
// Content Settings
// ========================================

async function loadContentData() {
    try {
        const doc = await db.collection(Collections.CONTENT).doc('about').get();
        if (doc.exists) {
            const content = doc.data();
            const missionInput = document.getElementById('missionInput');
            const visionInput = document.getElementById('visionInput');
            const welcomeInput = document.getElementById('welcomeInput');

            if (missionInput) missionInput.value = content.mission || '';
            if (visionInput) visionInput.value = content.vision || '';
            if (welcomeInput) welcomeInput.value = content.welcomeMessage || '';
        }
    } catch (error) {
        console.error('Error loading content data:', error);
    }
}

// ========================================
// Services Settings
// ========================================

async function loadServicesData() {
    try {
        const doc = await db.collection(Collections.SERVICES).doc('schedule').get();
        if (doc.exists) {
            const schedule = doc.data();
            
            if (schedule.sunday) {
                const sundayTitle = document.getElementById('sundayTitle');
                const sundayTime = document.getElementById('sundayTime');
                const sundayDescription = document.getElementById('sundayDescription');
                if (sundayTitle) sundayTitle.value = schedule.sunday.title || '';
                if (sundayTime) sundayTime.value = schedule.sunday.time || '';
                if (sundayDescription) sundayDescription.value = schedule.sunday.description || '';
            }
            
            if (schedule.midweek) {
                const midweekTitle = document.getElementById('midweekTitle');
                const midweekTime = document.getElementById('midweekTime');
                const midweekDescription = document.getElementById('midweekDescription');
                if (midweekTitle) midweekTitle.value = schedule.midweek.title || '';
                if (midweekTime) midweekTime.value = schedule.midweek.time || '';
                if (midweekDescription) midweekDescription.value = schedule.midweek.description || '';
            }
            
            if (schedule.special) {
                const specialTitle = document.getElementById('specialTitle');
                const specialTime = document.getElementById('specialTime');
                const specialDescription = document.getElementById('specialDescription');
                if (specialTitle) specialTitle.value = schedule.special.title || '';
                if (specialTime) specialTime.value = schedule.special.time || '';
                if (specialDescription) specialDescription.value = schedule.special.description || '';
            }
        }
    } catch (error) {
        console.error('Error loading services data:', error);
    }
}

// ========================================
// Contact Settings
// ========================================

async function loadContactData() {
    try {
        const doc = await db.collection(Collections.CONTENT).doc('contact').get();
        if (doc.exists) {
            const contact = doc.data();
            
            const contactEmailAdmin = document.getElementById('contactEmailAdmin');
            const contactPhoneAdmin = document.getElementById('contactPhoneAdmin');
            const contactAddressAdmin = document.getElementById('contactAddressAdmin');

            if (contactEmailAdmin) contactEmailAdmin.value = contact.email || '';
            if (contactPhoneAdmin) contactPhoneAdmin.value = contact.phone || '';
            if (contactAddressAdmin) contactAddressAdmin.value = contact.address || '';
            
            if (contact.offeringAccount) {
                const offeringBankAdmin = document.getElementById('offeringBankAdmin');
                const offeringAccountNumberAdmin = document.getElementById('offeringAccountNumberAdmin');
                const offeringAccountNameAdmin = document.getElementById('offeringAccountNameAdmin');

                if (offeringBankAdmin) offeringBankAdmin.value = contact.offeringAccount.bank || '';
                if (offeringAccountNumberAdmin) offeringAccountNumberAdmin.value = contact.offeringAccount.accountNumber || '';
                if (offeringAccountNameAdmin) offeringAccountNameAdmin.value = contact.offeringAccount.accountName || '';
            }
        }
    } catch (error) {
        console.error('Error loading contact data:', error);
    }
}

// ========================================
// Sermons Management
// ========================================

async function loadSermonsList() {
    try {
        const sermonsList = document.getElementById('sermonsList');
        sermonsList.innerHTML = '';
        
        const snapshot = await db.collection(Collections.SERMONS)
            .orderBy('date', 'desc')
            .get();
        
        if (snapshot.empty) {
            sermonsList.innerHTML = '<p style="text-align: center; opacity: 0.6;">No sermons yet</p>';
            return;
        }
        
        snapshot.forEach(doc => {
            const sermon = doc.data();
            const card = createSermonAdminCard(doc.id, sermon);
            sermonsList.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading sermons list:', error);
    }
}

function createSermonAdminCard(id, sermon) {
    const card = document.createElement('div');
    card.className = 'item-card';
    
    const date = sermon.date.toDate ? sermon.date.toDate() : new Date(sermon.date);
    
    card.innerHTML = `
        <div class="item-info">
            <h3>${sermon.title}</h3>
            <p style="color: var(--secondary-color); margin: 0.5rem 0;">${date.toLocaleDateString()}</p>
            ${sermon.description ? `<p style="opacity: 0.7;">${sermon.description}</p>` : ''}
        </div>
        <div class="item-actions">
            <button class="btn-admin" style="background: #ef4444;" onclick="deleteSermon('${id}')">Delete</button>
        </div>
    `;
    
    return card;
}

async function deleteSermon(id) {
    if (confirm('Are you sure you want to delete this sermon?')) {
        try {
            await db.collection(Collections.SERMONS).doc(id).delete();
            loadSermonsList();
        } catch (error) {
            console.error('Error deleting sermon:', error);
            alert('Error deleting sermon');
        }
    }
}

// ========================================
// Events Management
// ========================================

async function loadEventsList() {
    try {
        const eventsList = document.getElementById('eventsList');
        eventsList.innerHTML = '';
        
        const snapshot = await db.collection(Collections.EVENTS)
            .orderBy('date', 'desc')
            .get();
        
        if (snapshot.empty) {
            eventsList.innerHTML = '<p style="text-align: center; opacity: 0.6;">No events yet</p>';
            return;
        }
        
        snapshot.forEach(doc => {
            const event = doc.data();
            const card = createEventAdminCard(doc.id, event);
            eventsList.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading events list:', error);
    }
}

function createEventAdminCard(id, event) {
    const card = document.createElement('div');
    card.className = 'item-card';
    
    const date = event.date.toDate ? event.date.toDate() : new Date(event.date);
    
    card.innerHTML = `
        <div class="item-info">
            <h3>${event.title}</h3>
            <p style="color: var(--secondary-color); margin: 0.5rem 0;">${date.toLocaleDateString()}</p>
            <p style="opacity: 0.7;">${event.description}</p>
        </div>
        <div class="item-actions">
            <button class="btn-admin" style="background: #ef4444;" onclick="deleteEvent('${id}')">Delete</button>
        </div>
    `;
    
    return card;
}

async function deleteEvent(id) {
    if (confirm('Are you sure you want to delete this event?')) {
        try {
            await db.collection(Collections.EVENTS).doc(id).delete();
            loadEventsList();
        } catch (error) {
            console.error('Error deleting event:', error);
            alert('Error deleting event');
        }
    }
}

// ========================================
// Testimonies Management
// ========================================

async function loadTestimoniesList() {
    loadPendingTestimonies();
    loadApprovedTestimonies();
}

async function loadPendingTestimonies() {
    try {
        const pendingList = document.getElementById('pendingTestimoniesList');
        pendingList.innerHTML = '';
        
        // Fetch all testimonies ordered by date to avoid composite index requirement
        const snapshot = await db.collection(Collections.TESTIMONIES)
            .orderBy('submittedAt', 'desc')
            .get();
        
        const pendingTestimonies = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.approved === false) {
                pendingTestimonies.push({ id: doc.id, ...data });
            }
        });

        if (pendingTestimonies.length > 0) {
            pendingTestimonies.forEach(testimony => {
                const card = createTestimonyPendingCard(testimony.id, testimony);
                pendingList.appendChild(card);
            });
        } else {
            pendingList.innerHTML = '<p style="text-align: center; opacity: 0.6;">No pending testimonies</p>';
        }
    } catch (error) {
        console.error('Error loading pending testimonies:', error);
    }
}

async function loadApprovedTestimonies() {
    try {
        const approvedList = document.getElementById('approvedTestimoniesList');
        approvedList.innerHTML = '';
        
        // Fetch all testimonies ordered by date to avoid composite index requirement
        const snapshot = await db.collection(Collections.TESTIMONIES)
            .orderBy('submittedAt', 'desc')
            .get();
        
        const approvedTestimonies = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.approved === true) {
                approvedTestimonies.push({ id: doc.id, ...data });
            }
        });

        if (approvedTestimonies.length > 0) {
            approvedTestimonies.forEach(testimony => {
                const card = createTestimonyApprovedCard(testimony.id, testimony);
                approvedList.appendChild(card);
            });
        } else {
            approvedList.innerHTML = '<p style="text-align: center; opacity: 0.6;">No approved testimonies</p>';
        }
    } catch (error) {
        console.error('Error loading approved testimonies:', error);
    }
}

function createTestimonyPendingCard(id, testimony) {
    const card = document.createElement('div');
    card.className = 'item-card';
    
    const date = testimony.submittedAt.toDate ? testimony.submittedAt.toDate() : new Date(testimony.submittedAt);
    
    card.innerHTML = `
        <div class="item-info">
            <h3>${testimony.name}</h3>
            <p style="color: var(--secondary-color); margin: 0.5rem 0;">${date.toLocaleDateString()}</p>
            <p style="opacity: 0.7; font-style: italic;">"${testimony.message}"</p>
        </div>
        <div class="item-actions">
            <button class="btn-admin" style="background: #10b981; margin-right: 0.5rem;" onclick="approveTestimony('${id}')">Approve</button>
            <button class="btn-admin" style="background: #ef4444;" onclick="rejectTestimony('${id}')">Reject</button>
        </div>
    `;
    
    return card;
}

function createTestimonyApprovedCard(id, testimony) {
    const card = document.createElement('div');
    card.className = 'item-card';
    
    const date = testimony.submittedAt.toDate ? testimony.submittedAt.toDate() : new Date(testimony.submittedAt);
    
    card.innerHTML = `
        <div class="item-info">
            <h3>${testimony.name}</h3>
            <p style="color: var(--secondary-color); margin: 0.5rem 0;">${date.toLocaleDateString()}</p>
            <p style="opacity: 0.7; font-style: italic;">"${testimony.message}"</p>
        </div>
        <div class="item-actions">
            <button class="btn-admin" style="background: #ef4444;" onclick="deleteTestimony('${id}')">Delete</button>
        </div>
    `;
    
    return card;
}

async function approveTestimony(id) {
    try {
        await db.collection(Collections.TESTIMONIES).doc(id).update({
            approved: true
        });
        loadTestimoniesList();
    } catch (error) {
        console.error('Error approving testimony:', error);
        alert('Error approving testimony');
    }
}

async function rejectTestimony(id) {
    if (confirm('Are you sure you want to reject this testimony?')) {
        try {
            await db.collection(Collections.TESTIMONIES).doc(id).delete();
            loadTestimoniesList();
        } catch (error) {
            console.error('Error rejecting testimony:', error);
            alert('Error rejecting testimony');
        }
    }
}

async function deleteTestimony(id) {
    if (confirm('Are you sure you want to delete this testimony?')) {
        try {
            await db.collection(Collections.TESTIMONIES).doc(id).delete();
            loadTestimoniesList();
        } catch (error) {
            console.error('Error deleting testimony:', error);
            alert('Error deleting testimony');
        }
    }
}

// ========================================
// Form Handlers
// ========================================

function setupForms() {
    // Theme Form
    document.getElementById('themeForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        try {
            const updates = {
                mode: document.getElementById('themeMode').value,
                primaryColor: document.getElementById('primaryColor').value,
                secondaryColor: document.getElementById('secondaryColor').value,
                accentColor: document.getElementById('accentColor').value
            };
            
            const logoUrl = document.getElementById('logoUrl').value.trim();
            const faviconUrl = document.getElementById('faviconUrl').value.trim();
            
            if (logoUrl) updates.logoUrl = logoUrl;
            if (faviconUrl) updates.faviconUrl = faviconUrl;
            
            await db.collection(Collections.SETTINGS).doc('theme').update(updates);
            
            // Re-apply theme to dashboard immediately
            loadThemeSettings();
            
            alert('Theme settings saved successfully!');
        } catch (error) {
            console.error('Error saving theme:', error);
            alert('Error saving theme settings: ' + error.message);
        }
    });
    
    // Hero Form
    document.getElementById('heroForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        try {
            await db.collection(Collections.SETTINGS).doc('theme').update({
                heroImage: document.getElementById('heroImageUrl').value,
                heroText: document.getElementById('heroTitleInput').value,
                heroSubtext: document.getElementById('heroSubtextInput').value
            });
            alert('Hero settings saved successfully!');
        } catch (error) {
            console.error('Error saving hero:', error);
            alert('Error saving hero settings');
        }
    });
    
    // Content Form
    document.getElementById('contentForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        try {
            await db.collection(Collections.CONTENT).doc('about').update({
                mission: document.getElementById('missionInput').value,
                vision: document.getElementById('visionInput').value,
                welcomeMessage: document.getElementById('welcomeInput').value
            });
            alert('Content saved successfully!');
        } catch (error) {
            console.error('Error saving content:', error);
            alert('Error saving content');
        }
    });
    
    // Services Form
    document.getElementById('servicesForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        try {
            await db.collection(Collections.SERVICES).doc('schedule').update({
                sunday: {
                    title: document.getElementById('sundayTitle').value,
                    time: document.getElementById('sundayTime').value,
                    description: document.getElementById('sundayDescription').value
                },
                midweek: {
                    title: document.getElementById('midweekTitle').value,
                    time: document.getElementById('midweekTime').value,
                    description: document.getElementById('midweekDescription').value
                },
                special: {
                    title: document.getElementById('specialTitle').value,
                    time: document.getElementById('specialTime').value,
                    description: document.getElementById('specialDescription').value
                }
            });
            alert('Service times saved successfully!');
        } catch (error) {
            console.error('Error saving services:', error);
            alert('Error saving service times');
        }
    });
    
    // Sermon Form
    document.getElementById('sermonForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const title = document.getElementById('sermonTitle').value;
        const videoUrl = document.getElementById('sermonVideoUrl').value;
        const dateStr = document.getElementById('sermonDate').value;
        const description = document.getElementById('sermonDescription').value;
        
        try {
            await db.collection(Collections.SERMONS).add({
                title: title,
                videoUrl: videoUrl,
                date: firebase.firestore.Timestamp.fromDate(new Date(dateStr)),
                description: description
            });
            
            e.target.reset();
            loadSermonsList();
            alert('Sermon added successfully!');
        } catch (error) {
            console.error('Error adding sermon:', error);
            alert('Error adding sermon');
        }
    });
    
    // Event Form
    document.getElementById('eventForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const title = document.getElementById('eventTitle').value;
        const imageUrl = document.getElementById('eventImageUrl').value;
        const dateStr = document.getElementById('eventDate').value;
        const description = document.getElementById('eventDescription').value;
        
        try {
            await db.collection(Collections.EVENTS).add({
                title: title,
                imageUrl: imageUrl,
                date: firebase.firestore.Timestamp.fromDate(new Date(dateStr)),
                description: description
            });
            
            e.target.reset();
            loadEventsList();
            alert('Event added successfully!');
        } catch (error) {
            console.error('Error adding event:', error);
            alert('Error adding event');
        }
    });
    
    // Manual Testimony Form
    document.getElementById('testimonyManualForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('testimonyManualName').value;
        const message = document.getElementById('testimonyManualMessage').value;
        
        try {
            await db.collection(Collections.TESTIMONIES).add({
                name: name,
                message: message,
                approved: true,
                submittedAt: firebase.firestore.Timestamp.now()
            });
            
            e.target.reset();
            loadTestimoniesList();
            alert('Testimony added successfully!');
        } catch (error) {
            console.error('Error adding testimony:', error);
            alert('Error adding testimony');
        }
    });
    
    // Contact Form
    document.getElementById('contactForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        try {
            await db.collection(Collections.CONTENT).doc('contact').update({
                email: document.getElementById('contactEmailAdmin').value,
                phone: document.getElementById('contactPhoneAdmin').value,
                address: document.getElementById('contactAddressAdmin').value,
                offeringAccount: {
                    bank: document.getElementById('offeringBankAdmin').value,
                    accountNumber: document.getElementById('offeringAccountNumberAdmin').value,
                    accountName: document.getElementById('offeringAccountNameAdmin').value
                }
            });
            alert('Contact information saved successfully!');
        } catch (error) {
            console.error('Error saving contact info:', error);
            alert('Error saving contact information');
        }
    });
}

async function loadMessagesList() {
    const list = document.getElementById('messagesList');
    if (!list) return;

    try {
        const snapshot = await db.collection(Collections.MESSAGES)
            .orderBy('submittedAt', 'desc')
            .get();

        if (snapshot.empty) {
            list.innerHTML = '<p class="empty-msg">No messages yet.</p>';
            return;
        }

        list.innerHTML = snapshot.docs.map(doc => {
            const msg = doc.data();
            const date = msg.submittedAt ? msg.submittedAt.toDate().toLocaleString() : 'N/A';
            return `
                <div class="item-card">
                    <div class="item-info">
                        <h3>${msg.name}</h3>
                        <p style="color: var(--secondary-color); margin: 0.5rem 0;">${msg.email}</p>
                        <p style="opacity: 0.7;">${msg.message}</p>
                        <small style="display: block; margin-top: 1rem; opacity: 0.5;">${date}</small>
                    </div>
                    <div class="item-actions">
                        <button class="btn-admin" style="background: #ef4444;" onclick="deleteMessage('${doc.id}')">Delete</button>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading messages:', error);
        list.innerHTML = '<p class="error-msg">Error loading messages.</p>';
    }
}

async function deleteMessage(id) {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
        await db.collection(Collections.MESSAGES).doc(id).delete();
        loadMessagesList();
    } catch (error) {
        console.error('Error deleting message:', error);
        alert('Error deleting message');
    }
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

// Make functions globally accessible
window.deleteSermon = deleteSermon;
window.deleteEvent = deleteEvent;
window.approveTestimony = approveTestimony;
window.rejectTestimony = rejectTestimony;
window.deleteTestimony = deleteTestimony;
window.deleteMessage = deleteMessage;
