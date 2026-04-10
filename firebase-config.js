// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBGDT1IZGFR0ravirAC-jpcuj4Y9Uuipks",
  authDomain: "adageorge-35236.firebaseapp.com",
  projectId: "adageorge-35236",
  storageBucket: "adageorge-35236.firebasestorage.app",
  messagingSenderId: "397933347333",
  appId: "1:397933347333:web:316bacd8dc69b56f7fd26c",
  measurementId: "G-6PPH3KWEXY"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Database Collections
const Collections = {
  SETTINGS: 'settings',
  SERMONS: 'sermons',
  EVENTS: 'events',
  SERVICES: 'services',
  TESTIMONIES: 'testimonies',
  CONTENT: 'content',
  ADMIN: 'admin',
  MESSAGES: 'messages'
};

// Global flag to track initialization
window.firebaseInitialized = false;

// Initialize default data if not exists
async function initializeDefaultData() {
  try {
    // Check if settings exist
    const settingsDoc = await db.collection(Collections.SETTINGS).doc('theme').get();
    
    if (!settingsDoc.exists) {
      console.log('Initializing default data...');
      
      // Initialize default theme settings
      await db.collection(Collections.SETTINGS).doc('theme').set({
        mode: 'light',
        primaryColor: '#6366f1',
        secondaryColor: '#ec4899',
        accentColor: '#8b5cf6',
        heroImage: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?w=1600&q=80',
        heroText: 'Welcome to Salvation Ministries Ada George',
        heroSubtext: 'Where Faith Meets Purpose',
        logoUrl: '/uploads/1775217322747_image.png',
        faviconUrl: '/uploads/1775217322747_image.png'
      });

      // Initialize default content
      await db.collection(Collections.CONTENT).doc('about').set({
        mission: 'To spread the Gospel of Jesus Christ and transform lives through biblical teaching and community service.',
        vision: 'Building a community of believers who live out their faith with passion and purpose.',
        welcomeMessage: 'We are a vibrant community of believers committed to worshipping God, studying His Word, and serving our community with love and compassion.'
      });

      // Initialize default service times
      await db.collection(Collections.SERVICES).doc('schedule').set({
        sunday: {
          title: 'Sunday Worship Service',
          time: '8:00 AM - 11:00 AM',
          description: 'Join us for praise, worship, and powerful biblical teaching'
        },
        midweek: {
          title: 'Midweek Service',
          time: 'Wednesday 6:00 PM',
          description: 'Prayer, Bible study, and fellowship'
        },
        special: {
          title: 'Special Programs',
          time: 'Check Events',
          description: 'Monthly special services and programs'
        }
      });

      // Initialize contact info
      await db.collection(Collections.CONTENT).doc('contact').set({
        email: 'info@salvationministries-adageorge.org',
        phone: '+234 123 456 7890',
        address: 'Ada George Road, Port Harcourt, Rivers State, Nigeria',
        offeringAccount: {
          bank: 'Sample Bank',
          accountName: 'Salvation Ministries Ada George',
          accountNumber: '0123456789'
        }
      });

      // Initialize default admin credentials
      await db.collection(Collections.ADMIN).doc('credentials').set({
        username: 'admin',
        password: 'admin123' // In production, this should be hashed
      });

      console.log('Default data initialized successfully');
    }
    
    // Mark initialization as complete
    window.firebaseInitialized = true;
    console.log('Firebase initialization complete');
  } catch (error) {
    console.error('Error initializing default data:', error);
    window.firebaseInitialized = true; // Still mark as initialized to allow login attempts
  }
}

// Call initialization on load
initializeDefaultData();

// Helper function to wait for Firebase initialization
function waitForFirebase() {
  return new Promise((resolve) => {
    if (window.firebaseInitialized) {
      resolve();
    } else {
      const checkInterval = setInterval(() => {
        if (window.firebaseInitialized) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
      
      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        resolve();
      }, 10000);
    }
  });
}
