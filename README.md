# REAMP - Real Estate Agent Management Platform

A comprehensive real estate management platform built with React, TypeScript, and modern web technologies. This application provides a complete solution for managing real estate listings, agents, and photography services.

## 🌐 Live Demo

**[View Live Application](https://reamp-brady.vercel.app/)**

## ✨ Features

### Core Functionality
- **Property Management**: Create, edit, and manage property listings with detailed information
- **Agent Management**: Comprehensive agent profiles with contact information and property assignments
- **Photography Services**: Integration with photography companies for professional property photos
- **Dashboard Analytics**: Real-time insights and property status tracking
- **Media Management**: Upload and organize property photos and media assets

### User Roles & Permissions
- **Agents**: Manage their property listings and client contacts
- **Photography Companies**: Handle photo uploads and assignments
- **Admin**: Oversee all operations and user management

### Key Features
- 🏠 **Property Listings**: Detailed property information with photos, maps, and descriptions
- 👥 **Agent Directory**: Search and manage real estate agents
- 📸 **Photography Integration**: Professional photography service management
- 📱 **Responsive Design**: Mobile-first approach with modern UI/UX
- 🗺️ **Google Maps Integration**: Location-based property visualization
- 🔐 **Secure Authentication**: JWT-based authentication system
- 📊 **Dashboard Analytics**: Real-time data and insights

## 🛠️ Technology Stack

### Frontend
- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS 4** - Utility-first CSS framework
- **React Router Dom 7** - Client-side routing
- **Axios** - HTTP client for API communication

### UI & UX
- **Lucide React** - Beautiful icons
- **React Icons** - Additional icon library
- **React Dropzone** - File upload functionality
- **Google Maps API** - Interactive maps and location services

### Development Tools
- **ESLint** - Code linting
- **TypeScript ESLint** - TypeScript-specific linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Google Maps API key (for location features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd REAMP-Frontend/REMP
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=your-backend-api-url
   VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── api/                    # API service functions
│   ├── agent/             # Agent-related API calls
│   ├── listingcase/       # Property listing APIs
│   └── photography/       # Photography service APIs
├── components/            # React components
│   ├── AgentContact/      # Agent contact management
│   ├── AgentList/         # Agent listing and management
│   ├── AgentPropertyPage/ # Agent dashboard
│   ├── CreateNewProperty/ # Property creation forms
│   ├── ListingDashBoard/  # Main dashboard
│   ├── PhotoGraphyCompany/# Photography features
│   └── PropertyPreviewPage/# Property preview
├── contexts/              # React contexts (Auth, etc.)
├── enums/                 # TypeScript enums
├── interfaces/            # TypeScript interfaces
├── lib/                   # Utility functions
├── services/              # Business logic services
└── types/                 # TypeScript type definitions
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 🌟 Key Components

### Authentication
- Secure login/logout functionality
- JWT token management
- Role-based access control

### Property Management
- Create and edit property listings
- Media upload and management
- Google Maps integration for location
- Property status tracking

### Agent Management
- Agent profile creation and editing
- Contact information management
- Property assignment system

### Photography Services
- Photography company registration
- Photo upload and organization
- Assignment management system

## 🔗 API Integration

This frontend application communicates with a private backend API deployed on Azure. The backend provides:

- RESTful API endpoints
- JWT authentication
- File upload services
- Database management
- Email notifications

*Note: The backend repository is private and not publicly accessible.*

## 🚀 Deployment

The application is deployed on **Vercel** with automatic deployments from the main branch.

**Live URL**: [https://reamp-brady.vercel.app/](https://reamp-brady.vercel.app/)

### Deployment Configuration
- Platform: Vercel
- Build Command: `npm run build`
- Output Directory: `dist`
- Node.js Version: 18.x

## 🤝 Contributing

While this is a personal project, contributions and suggestions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is private and proprietary.

## 📞 Contact

For questions or inquiries about this project, please feel free to reach out.

---

**Built with ❤️ using modern web technologies**
