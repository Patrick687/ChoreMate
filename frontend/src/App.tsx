import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Modal from './components/ui/Modal';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from './store/store';
import { closeModal } from './store/modal';
import SignupForm from './components/auth/SignupForm';
import LoginForm from './components/auth/LoginForm';

function App() {
  const isLoggedIn = false;
  const { isOpen, mode } = useSelector((state: RootState) => state.modal);
  const dispatch = useDispatch();
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <LandingPage />} />
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          {/* Add more routes as needed */}
        </Routes>
      </BrowserRouter>
      <Modal
        isOpen={isOpen}
        onClose={() => dispatch(closeModal())}
        title={mode === "signup" ? "Sign Up" : mode === "login" ? "Login" : ""}
      >
        {mode === "signup" ? <SignupForm /> : mode === "login" ? <LoginForm /> : null}
      </Modal>
    </>
  );
}

export default App;