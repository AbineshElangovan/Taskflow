# TaskFlow  – Mini SaaS Productivity Platform

TaskFlow is a modern, full-stack SaaS productivity dashboard designed to help users manage projects and tasks efficiently. It features AI-driven suggestions, real-time analytics, and a clean, responsive interface.

## Features

- **Authentication**: Secure JWT-based registration, login, and logout.
- **Dashboard**: High-level overview of projects, tasks, and productivity metrics.
- **Project Management**: Full CRUD operations for projects with priority and status tracking.
- **Task Management**: Comprehensive task tracking with search, filtering, and completion status.
- **AI Suggestion Module**: Intelligent alerts for overdue tasks and priority focus.
- **Analytics**: Visual representation of task completion and weekly progress using Recharts.
- **Responsive Design**: Optimized for Desktop, Tablet, and Mobile devices.

## Tech Stack

### Frontend
- **React.js (Vite)**: Fast, modern UI library.
- **Lucide React**: Clean and consistent iconography.
- **Axios**: API communication with interceptors for JWT handling.

### Backend
- **Django & Django REST Framework**: Robust API development.
- **JWT Authentication**: Secure stateless authentication.
- **SQLite**: Default database (easily switchable to PostgreSQL).

<img width="2240" height="1400" alt="image" src="https://github.com/user-attachments/assets/83f51249-41b0-490c-8b96-811882a71e8d" />


## Project Structure


taskflow/
├── backend/
│   ├── api/
│   │   ├── models.py       # Database schemas
│   │   ├── serializers.py  # Data transformation
│   │   ├── views.py        # API logic
│   │   └── urls.py         # API routing
│   ├── backend/
│   │   ├── settings.py     # Configuration
│   │   └── urls.py         # Main routing
│   └── requirements.txt    # Dependencies
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI elements
│   │   ├── pages/          # Main view components
│   │   ├── services/       # API abstraction layer
│   │   ├── App.jsx         # Routing and layout
│   │   └── main.jsx        # Entry point
│   └── package.json        # Dependencies
└── README.md

## How to Run:

### 1. Backend Setup
'''bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
'''


### 2. Frontend Setup
'''bash
cd frontend
npm install
npm run dev
'''


## Deployment Steps

1. **Backend**:
   - Set `DEBUG = False` in `settings.py`.
   - Configure a production database like SQLlite.
2. **Frontend**:
   - Run `npm run build` to generate the `dist` folder.
   - Host the static files on platforms like Vercel, Netlify, or an S3 bucket.
3. **General**:
   - Use Environment Variables for `SECRET_KEY` and API URLs.
   - Enable HTTPS.

