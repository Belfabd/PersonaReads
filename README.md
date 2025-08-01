# PersonaReads

PersonaReads is a Chrome extension that provides personalized book recommendations based on your reading persona, tone, and themes — not just algorithms. It analyzes books you're interested in and suggests similar books with explanations of how they relate to your selection.

## Project Overview

PersonaReads enhances your book discovery experience by:

- Analyzing books you're viewing in your browser
- Creating and evolving your reading persona based on your interests
- Providing personalized book recommendations with meaningful connections
- Offering detailed book information including descriptions and tags

## Architecture

The project consists of two main components:

### 1. Chrome Extension (Frontend)

The frontend is a Chrome extension built with Angular that uses the Chrome Side Panel API to display the user interface. It includes:

- **Background Service Worker**: Manages the extension state, detects book pages, and communicates with the backend
- **Side Panel Angular App**: Provides the user interface for authentication, book analysis, and recommendations
- **Content Scripts**: Extract book information from web pages
- **Offscreen Document**: Handles Firebase communication and DOM scraping

### 2. Firebase Backend

The backend is built with Firebase Cloud Functions and uses TypeScript. It includes:

- **Cloud Functions**: Process book analysis requests and generate recommendations
- **Firestore Database**: Stores user data, personas, and reading progression
- **Firebase Authentication**: Manages user authentication

### External APIs

The application integrates with:

- **Qloo API**: Provides book search and recommendation functionality
- **Google AI (Gemini)**: Enhances recommendations and generates personalized insights

## Technical Stack

- **Frontend**:
  - Angular
  - TypeScript
  - Chrome Extension APIs
  - Material Design components
  
- **Backend**:
  - Firebase (Functions, Firestore, Auth)
  - TypeScript
  - Genkit (for AI integration)
  
- **Build Tools**:
  - Webpack
  - npm

## Setup and Installation

### Prerequisites

- Node.js and npm
- Firebase CLI
- Google Chrome browser
- API keys for:
  - Google AI (Gemini)
  - Qloo API
  - Firebase project

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   cd functions
   npm install
   ```

3. Configure Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Update `.firebaserc` with your project ID
   - Set up Firebase secrets for API keys:
     ```
     firebase functions:secrets:set GOOGLE_GENAI_API_KEY
     firebase functions:secrets:set QLOO_API_KEY
     ```

4. Deploy Firebase functions:
   ```
   firebase deploy --only functions
   ```

### Extension Setup

1. Navigate to the extension directory:
   ```
   cd extension
   ```

2. Install dependencies:
   ```
   npm install
   cd src/sidepanel/app
   npm install
   ```

3. Configure Firebase:
   - Update `src/firebase.js` with your Firebase project configuration

4. Build the extension:
   ```
   cd ../../../..  # Return to project root
   ./build.sh
   ```
   
   Alternatively, you can run the build steps manually:
   ```
   cd extension/src/sidepanel/app
   npm run build-prod
   cd ../../..
   npm run release
   ```

5. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `extension/dist` directory

## Usage

1. Install the extension in Chrome
2. Create an account or log in
3. Navigate to a book page (e.g., on Amazon, Goodreads)
4. Open the side panel by clicking the extension icon
5. Click "Scan" to analyze the current book
6. View personalized recommendations and book details
7. Explore your reading persona in the persona section

## Project Structure

```
PersonaReads/
├── backend/                  # Firebase backend
│   ├── functions/            # Cloud Functions
│   │   ├── src/              # TypeScript source code
│   │   │   ├── index.ts      # Main entry point
│   │   │   ├── types.ts      # Type definitions
│   │   │   └── utilities/    # Helper functions
│   │   │       ├── api.ts    # External API integration
│   │   │       ├── database.ts # Firestore operations
│   │   │       └── prompts.ts # AI prompts
│   ├── .firebaserc           # Firebase project configuration
│   └── firebase.json         # Firebase service configuration
│
├── extension/                # Chrome extension
│   ├── src/                  # Source code
│   │   ├── background.js     # Background service worker
│   │   ├── manifest.json     # Extension manifest
│   │   ├── content/          # Content scripts
│   │   ├── images/           # Extension icons
│   │   ├── offscreen/        # Offscreen document
│   │   ├── sidepanel/        # Side panel Angular app
│   │   └── utilities/        # Helper functions
│   ├── dist/                 # Built extension
│   └── webpack.config.js     # Webpack configuration
│
└── build.sh                  # Build script
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
