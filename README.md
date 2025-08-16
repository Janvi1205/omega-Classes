# Omega Pro Classes - Study Materials Platform

A comprehensive study materials platform built with React, TypeScript, and Firebase.

## Features

- **Study Materials**: Access to comprehensive study materials for all classes
- **Admin Dashboard**: Teacher portal for uploading and managing content
- **User Authentication**: Secure login system for teachers
- **Real-time Notifications**: Dynamic notification system
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Shadcn/ui
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Animations**: Framer Motion
- **Deployment**: Vercel

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd omega-spark-learn
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a Firebase project
   - Add your Firebase config to `src/lib/firebase.ts`
   - Set up Firestore and Storage rules

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── contexts/      # React contexts
├── hooks/         # Custom hooks
├── lib/           # Utility libraries
└── assets/        # Static assets
```

## Deployment

The project is configured for deployment on Vercel with automatic builds and deployments.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is proprietary to Omega Pro Classes.
