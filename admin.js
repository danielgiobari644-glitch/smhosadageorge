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
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'flex';
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
}

// ========================================
// Theme Settings
// ========================================

async function loadThemeData() {
    try {
        const doc = await db.collection(Collections.SETTINGS).doc('theme').get();
        if (doc.exists) {
            const theme = doc.data();
            document.getElementById('themeMode').value = theme.mode || 'light';
            document.getElementById('primaryColor').value = theme.primaryColor || '#2c5f7a';
            document.getElementById('secondaryColor').value = theme.secondaryColor || '#d946ef';
            document.getElementById('accentColor').value = theme.accentColor || '#6366f1';
            document.getElementById('logoUrl').value = theme.logoUrl || '';
            document.getElementById('faviconUrl').value = theme.faviconUrl || '';
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
            document.getElementById('heroImageUrl').value = theme.heroImage || '';
            document.getElementById('heroTitleInput').value = theme.heroText || '';
            document.getElementById('heroSubtextInput').value = theme.heroSubtext || '';
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
            document.getElementById('missionInput').value = content.mission || '';
            document.getElementById('visionInput').value = content.vision || '';
            document.getElementById('welcomeInput').value = content.welcomeMessage || '';
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
                document.getElementById('sundayTitle').value = schedule.sunday.title || '';
                document.getElementById('sundayTime').value = schedule.sunday.time || '';
                document.getElementById('sundayDescription').value = schedule.sunday.description || '';
            }
            
            if (schedule.midweek) {
                document.getElementById('midweekTitle').value = schedule.midweek.title || '';
                document.getElementById('midweekTime').value = schedule.midweek.time || '';
                document.getElementById('midweekDescription').value = schedule.midweek.description || '';
            }
            
            if (schedule.special) {
                document.getElementById('specialTitle').value = schedule.special.title || '';
                document.getElementById('specialTime').value = schedule.special.time || '';
                document.getElementById('specialDescription').value = schedule.special.description || '';
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
            
            document.getElementById('contactEmailAdmin').value = contact.email || '';
            document.getElementById('contactPhoneAdmin').value = contact.phone || '';
            document.getElementById('contactAddressAdmin').value = contact.address || '';
            
            if (contact.offeringAccount) {
                document.getElementById('offeringBankAdmin').value = contact.offeringAccount.bank || '';
                document.getElementById('offeringAccountNumberAdmin').value = contact.offeringAccount.accountNumber || '';
                document.getElementById('offeringAccountNameAdmin').value = contact.offeringAccount.accountName || '';
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
        
        const snapshot = await db.collection(Collections.TESTIMONIES)
            .where('approved', '==', false)
            .orderBy('submittedAt', 'desc')
            .get();
        
        if (snapshot.empty) {
            pendingList.innerHTML = '<p style="text-align: center; opacity: 0.6;">No pending testimonies</p>';
            return;
        }
        
        snapshot.forEach(doc => {
            const testimony = doc.data();
            const card = createTestimonyPendingCard(doc.id, testimony);
            pendingList.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading pending testimonies:', error);
    }
}

async function loadApprovedTestimonies() {
    try {
        const approvedList = document.getElementById('approvedTestimoniesList');
        approvedList.innerHTML = '';
        
        const snapshot = await db.collection(Collections.TESTIMONIES)
            .where('approved', '==', true)
            .orderBy('submittedAt', 'desc')
            .get();
        
        if (snapshot.empty) {
            approvedList.innerHTML = '<p style="text-align: center; opacity: 0.6;">No approved testimonies</p>';
            return;
        }
        
        snapshot.forEach(doc => {
            const testimony = doc.data();
            const card = createTestimonyApprovedCard(doc.id, testimony);
            approvedList.appendChild(card);
        });
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
