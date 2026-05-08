# HireSense – AI Resume Screening & Candidate Ranking System

HireSense is a modern, AI-driven talent acquisition dashboard designed to streamline the recruitment process. It allows HR professionals and recruiters to upload multiple resumes, define detailed job descriptions, and use automated scoring to rank candidates based on skill match and experience.

## Features
- **Intelligent Dashboard**: View recruitment metrics, candidate score distributions, and recent upload activity.
- **Bulk Resume Upload**: Drag-and-drop interface supporting PDF, DOCX, and TXT files.
- **JD Matching**: Dynamic matching engine that compares candidate profiles against custom high-level job requirements.
- **Automated Ranking**: Instant results table featuring match scores, top skills, and AI-driven recommendations.
- **Responsive Design**: Fully functional on desktop and tablet views with a clean, indigo-themed SaaS UI.
- **Modular Architecture**: Built with React Context API and reusable Tailwind components.

## Prerequisites
- Node.js (v16.x or higher)
- npm (v8.x or higher)

## Installation Steps
1.  **Extract the project files** into your desired directory.
2.  **Navigate to the root project folder**:
    `cd hiresense-frontend`
3.  **Install dependencies**:
    `npm install`
4.  **Start the development server**:
    `npm start`

## How to Use the Application
1.  **Login**: Open the app (defaults to localhost:3000). The login is pre-filled for demo purposes. Click "Sign in".
2.  **Dashboard**: Review the high-level stats of your candidate pipeline.
3.  **Upload Resumes**: Go to the "Resume Upload" tab. Drag some sample files or click to add files. 
4.  **Define JD**: Click "Continue to Job Description". You can paste an existing JD or click "Use Sample Template" to quickly populate requirements.
5.  **Run Analysis**: Proceed to "Ranking Results" and click "Run Analysis". The system will simulate the AI extraction and matching process and display a ranked list of candidates.

## Project Structure
- `src/context/`: Contains `ProjectContext.js` for global state management.
- `src/components/`: Reusable UI components (Sidebar, Navbar, Cards, Dropzone).
- `src/pages/`: Main application views (Dashboard, Ranking, Upload, etc.).
- `src/index.css`: Tailwind configuration and global styles.

## Troubleshooting
- **Missing Tailwind Styles**: Ensure `postinstall` or `tailwind.config.js` is present. If styles are missing, run `npm install -D tailwindcss postcss autoprefixer` and check `tailwind.config.js` contents.
- **Route Issues**: The app uses `react-router-dom` v6. If you encounter white screens, verify the routing logic in `App.js`.
- **Responsive Charts**: Recharts depends on parent container dimensions. If charts don't appear, ensure the browser window is resized or parent divs have height/width.
