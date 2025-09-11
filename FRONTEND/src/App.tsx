import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Models from './pages/Models';
import ModelDetail from './pages/ModelDetail';
import ContentDetail from './pages/ContentDetail';
import Premium from './pages/Premium';
import DMCA from './pages/DMCA';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminModels from './pages/admin/AdminModels';
import AdminContent from './pages/admin/AdminContent';
import AdminReports from './pages/admin/AdminReports';
import BillingPortal from './pages/BillingPortal';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-dark-300">
        <Header />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/models" element={<Models />} />
            <Route path="/model/:slug" element={<ModelDetail />} />
            <Route path="/content/:id" element={<ContentDetail />} />
            <Route path="/premium" element={<Premium />} />
            <Route path="/dmca" element={<DMCA />} />
            <Route path="/success" element={<PaymentSuccess />} />
            <Route path="/cancel" element={<PaymentCancel />} />
            <Route path="/billing" element={<BillingPortal />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/models" element={<AdminModels />} />
            <Route path="/admin/content" element={<AdminContent />} />
            <Route path="/admin/reports" element={<AdminReports />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;