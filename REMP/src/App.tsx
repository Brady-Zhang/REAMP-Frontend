import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignInPage from './components/SignInPage';
import { AgentPropertyPage } from './components/AgentPropertyPage/AgentPropertyPage';
import PropertyDetails from './components/PropertyDetails';
import HeroImageSelect from './components/HeroImageSelect';
import AgentsPage from './components/PhotoGraphyCompany/AgentsPage';
import DashboardLayout from './components/ListingDashBoard/DashboardLayout';
import AddAgentByEmail from './components/PhotoGraphyCompany/AddAgentByEmail';
import ListingDashboard from './components/ListingDashBoard/ListingDashboard';
import ConpanySignUpPage from './components/PhotoGraphyCompany/ConpanySignUp';
import PhotographyCompanyPortal from './components/PhotoGraphyCompany/PhotographyCompanyPortal';
import PreviewPage from './components/PropertyPreviewPage/PreviewPage';
import ChangePasswordPage from './components/AgentPropertyPage/ChangePasswordPage';
import AgentContact from './components/AgentContact/AgentContact';

const mockImages = Array.from({ length: 25 }, (_, i) => ({
  id: `${i}`,
  url: `https://picsum.photos/seed/${i}/150`
}));


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/AgentPropertyPage" element={<AgentPropertyPage/>} />
        <Route path="/dashboard" element={<ListingDashboard />} />
        <Route path="/login" element={<SignInPage/>} />
        <Route path="/DashboardLayout" element={<DashboardLayout/>} />
        <Route path="/ConpanySignUpPage" element={<ConpanySignUpPage/>} />
        <Route path="/agentspage" element={<AgentsPage/>} />
        <Route path="/AddAgentByEmail" element={<AddAgentByEmail/>} />
        <Route path="/portal" element={<PhotographyCompanyPortal />} />
        <Route path="/preview/:id" element={<PreviewPage />} />
        <Route path="/ChangePasswordPage" element={<ChangePasswordPage/>} />
        <Route path="/property/:listingId" element={<PropertyDetails />} />

        <Route
          path="/hero-select"
          element={
            <HeroImageSelect
              images={mockImages}
              onSave={(img) => console.log('Selected image:', img)}
              onCancel={() => console.log('Cancelled')}
            />
          }
        />
      </Routes>
    </BrowserRouter>

    

    
  );
}

export default App;