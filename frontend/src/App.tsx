import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Modal from './components/ui/Modal';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from './store/store';
import { closeModal } from './store/modal';
import SignupForm from './components/auth/SignupForm';
import LoginForm from './components/auth/LoginForm';
import DashBoardPage from './pages/DashboardPage';
import RootLayout from './pages/RootLayout';
import ProtectedRoute from './pages/ProtectedRoute';

function App() {
  const isLoggedIn = false;
  const { isOpen, mode } = useSelector((state: RootState) => state.modal);
  const dispatch = useDispatch();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<LandingPage />} />
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="dashboard" element={<DashBoardPage />} />
            {/* Add more protected routes here */}
          </Route>
        </Route>
      </Routes>
      {/* Modal stays outside so it overlays all pages */}
      <Modal
        isOpen={isOpen}
        onClose={() => dispatch(closeModal())}
        title={mode === "signup" ? "Sign Up" : mode === "login" ? "Login" : ""}
      >
        {mode === "signup" ? <SignupForm /> : mode === "login" ? <LoginForm /> : null}
      </Modal>
    </BrowserRouter>
  );
}

export default App;