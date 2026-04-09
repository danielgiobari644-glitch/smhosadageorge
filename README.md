# Salvation Ministries Ada George - Web Application

A modern, interactive web application for Salvation Ministries Ada George built with vanilla HTML, CSS, and JavaScript, integrated with Firebase Firestore for data persistence.

## Features

### Public Site
- **Dynamic Hero Section** - Customizable background image and welcome text
- **About Us** - Mission, vision, and welcome message
- **Service Times** - Sunday worship, midweek services, and special programs
- **Sermons** - YouTube video integration with embedded player
- **Events** - Upcoming events with images and descriptions
- **Testimonies** - User-submitted testimonies with admin approval workflow
- **Offering** - Bank account details for donations
- **Contact** - Email, phone, address, and contact form

### Admin Dashboard
- **Secure Login** - Username/password authentication
- **Theme Management** - Light/dark mode, primary and secondary colors
- **Hero Section Control** - Change background image, title, and subtitle
- **Content Management** - Edit all text content across the site
- **Service Times** - Update service schedules
- **Sermon Management** - Add/remove YouTube sermon videos
- **Event Management** - Add/remove events with images
- **Testimony Moderation** - Approve/reject user submissions
- **Contact Info** - Update contact details and offering accounts

## Tech Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Database**: Firebase Firestore
- **Fonts**: Cormorant Garamond (display), Lato (body)
- **Icons**: Emoji-based (can be replaced with icon fonts)

## Setup Instructions

### 1. Firebase Configuration
The application is already configured with Firebase. The credentials are in `firebase-config.js`:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyAgW-zEIRJbg3CeIRgtAqq6cOFuCUZPwX0",
  authDomain: "gen-lang-client-0338882324.firebaseapp.com",
  projectId: "gen-lang-client-0338882324",
  storageBucket: "gen-lang-client-0338882324.firebasestorage.app",
  messagingSenderId: "953395311086",
  appId: "1:953395311086:web:51769bc2208f7de0ca1eff"
};
```

### 2. File Structure
```
salvation-ministries/
├── index.html          # Public-facing site
├── admin.html          # Admin dashboard
├── styles.css          # Main stylesheet
├── app.js             # Public site JavaScript
├── admin.js           # Admin dashboard JavaScript
├── firebase-config.js # Firebase initialization
└── README.md          # This file
```

### 3. Deployment

#### Option 1: Local Development
1. Open `index.html` in a web browser
2. Navigate to `admin.html` for the dashboard

#### Option 2: Web Server
1. Upload all files to your web hosting
2. Ensure all files are in the same directory
3. Access via your domain

#### Option 3: Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase Hosting
firebase init hosting

# Deploy
firebase deploy
```

## Default Credentials

**Admin Login:**
- Username: `admin`
- Password: `admin123`

**⚠️ IMPORTANT:** Change these credentials immediately after first login by updating the Firestore database.

## Usage Guide

### Public Site

#### Navigation
- Smooth scroll navigation to sections
- Responsive mobile menu
- "Admin" link to access dashboard

#### Submitting Testimonies
1. Navigate to the Testimonies section
2. Fill out the form with your name and testimony
3. Click "Submit Testimony"
4. Testimony will be held for admin approval

### Admin Dashboard

#### Logging In
1. Navigate to `admin.html`
2. Enter username and password
3. Click "Login"

#### Theme Settings
1. Select "Theme Settings" in sidebar
2. Choose light/dark mode
3. Pick primary and secondary colors using color pickers
4. Click "Save Theme Settings"
5. Changes reflect immediately on the public site

#### Hero Section
1. Select "Hero Section" in sidebar
2. Enter background image URL
3. Update hero title and subtitle
4. Click "Save Hero Settings"

#### Content Management
1. Select "Content" in sidebar
2. Edit mission, vision, and welcome messages
3. Click "Save Content"

#### Service Times
1. Select "Service Times" in sidebar
2. Update titles, times, and descriptions for each service
3. Click "Save Service Times"

#### Sermons
1. Select "Sermons" in sidebar
2. Fill in sermon details:
   - Title
   - YouTube video URL (full URL or video ID)
   - Date
   - Optional description
3. Click "Add Sermon"
4. Sermons appear in the list below
5. Click "Delete" to remove a sermon

#### Events
1. Select "Events" in sidebar
2. Fill in event details:
   - Title
   - Image URL
   - Date
   - Description
3. Click "Add Event"
4. Events appear in the list below
5. Click "Delete" to remove an event

#### Testimonies
1. Select "Testimonies" in sidebar
2. View pending testimonies in the first section
3. Click "Approve" to publish or "Reject" to delete
4. View approved testimonies in the second section
5. Add testimonies manually using the form at the bottom

#### Contact Information
1. Select "Contact Info" in sidebar
2. Update email, phone, and address
3. Update offering account details
4. Click "Save Contact Information"

## Image and Video URLs

### Recommended Image Hosting
- **Cloudinary** - Free tier available
- **ImgBB** - Free unlimited hosting
- **Imgur** - Popular image hosting
- **Google Drive** - Use direct link generator

### YouTube Video URLs
Supported formats:
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`

## Customization

### Colors
Update CSS variables in `styles.css`:
```css
:root {
    --primary-color: #2c5f7a;
    --secondary-color: #d4a574;
    --text-dark: #1a1a1a;
    --text-light: #f5f5f5;
}
```

### Fonts
Change fonts in `<head>` section:
```html
<link href="https://fonts.googleapis.com/css2?family=YOUR_FONT&display=swap" rel="stylesheet">
```

Update CSS variables:
```css
:root {
    --font-display: 'Your Display Font', serif;
    --font-body: 'Your Body Font', sans-serif;
}
```

### Logo
Replace the logo path in:
- `index.html` (navigation and footer)
- `admin.html` (login and dashboard)

Update path:
```html
<img src="/path/to/your/logo.png" alt="Logo">
```

## Real-time Updates

The application uses Firebase real-time listeners to automatically update content when changes are made in the admin dashboard:

- Theme changes apply immediately
- New sermons appear instantly
- Events update in real-time
- Approved testimonies show immediately

No page refresh required!

## Security Notes

### Production Recommendations

1. **Change Admin Credentials**
   - Access Firestore database
   - Update `admin/credentials` document
   - Use strong passwords

2. **Firebase Security Rules**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Allow read for all collections
       match /{document=**} {
         allow read: true;
       }
       
       // Restrict write access
       match /settings/{docId} {
         allow write: if request.auth != null;
       }
       
       match /sermons/{docId} {
         allow write: if request.auth != null;
       }
       
       match /events/{docId} {
         allow write: if request.auth != null;
       }
       
       match /testimonies/{docId} {
         allow create: true; // Public submission
         allow update, delete: if request.auth != null;
       }
       
       match /content/{docId} {
         allow write: if request.auth != null;
       }
       
       match /services/{docId} {
         allow write: if request.auth != null;
       }
     }
   }
   ```

3. **HTTPS Only**
   - Always use HTTPS in production
   - Enable Firebase App Check for additional security

4. **Rate Limiting**
   - Implement rate limiting for form submissions
   - Use Firebase App Check

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

### Optimization Tips
1. Compress images before uploading
2. Use optimized YouTube embed parameters
3. Enable browser caching
4. Consider lazy loading for images
5. Minify CSS and JavaScript for production

### Recommended Image Sizes
- Hero background: 1920x1080px
- Event images: 800x600px
- Logo: 200x200px (transparent PNG)

## Troubleshooting

### Common Issues

**Issue:** Changes not appearing on public site
- **Solution:** Check browser cache, hard refresh (Ctrl+Shift+R)

**Issue:** Login not working
- **Solution:** Verify Firebase credentials, check browser console for errors

**Issue:** YouTube videos not displaying
- **Solution:** Ensure URL is correct, check if video is public

**Issue:** Images not loading
- **Solution:** Verify image URL is accessible, check CORS settings

### Browser Console
Open Developer Tools (F12) to view detailed error messages.

## Support

For technical issues or questions, check:
1. Browser console for JavaScript errors
2. Firebase Console for database errors
3. Network tab for failed requests

## License

This application is provided as-is for Salvation Ministries Ada George.

## Credits

- **Design**: Refined spiritual aesthetic with elegant typography
- **Fonts**: Google Fonts (Cormorant Garamond, Lato)
- **Database**: Firebase Firestore
- **Icons**: Emoji (can be replaced with Font Awesome or similar)

---

**Version:** 1.0.0  
**Last Updated:** 2024  
**Built for:** Salvation Ministries Ada George
