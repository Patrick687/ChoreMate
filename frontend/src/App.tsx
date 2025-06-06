import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import GroupsPage from './pages/GroupsPage';
import GroupDetailsPage from './pages/GroupDetailsPage';
import AddChoreModal from './components/groups/groupDetails/AddChoreModal';
import ErrorModal from './components/utils/error/ErrorModal';
import ChoreDetailView from './components/chore/detailView/ChoreDetailView';
import InviteMember from './components/groups/groupDetails/InviteMember';

function App() {
  const { isOpen, mode, modalProps } = useSelector((state: RootState) => state.modal);
  if (modalProps) {
    console.log("Modal Props:", modalProps);
  }
  const dispatch = useDispatch();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<LandingPage />} />
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="dashboard" element={<DashBoardPage />} />
            <Route path="groups" element={<GroupsPage />} />
            <Route path="groups/:groupId" element={<GroupDetailsPage />} />
            {/* Add more protected routes here */}
          </Route>
        </Route>
      </Routes>
      {/* Modal stays outside so it overlays all pages */}
      <Modal
        isOpen={isOpen}
        onClose={() => dispatch(closeModal())}
        title={
          mode === "signup" ? "Sign Up" :
            mode === "login" ? "Login" :
              mode === "inviteMember" ? "Invite Member" :
                mode === "addChore" ? "Add Chore" :
                  mode === "choreDetail" ? "Chore Detail" :
                    mode === "relogError" ? "Ruh Roh!" :
                      ""
        }
      >
        {mode === "signup" && <SignupForm />}
        {mode === "login" && <LoginForm />}
        {mode === "addChore" && modalProps && modalProps.userId && modalProps.groupId && (
          <AddChoreModal groupId={modalProps.groupId} />
        )}
        {mode === "choreDetail" && modalProps && modalProps.choreId && modalProps.groupId &&
          <ChoreDetailView choreId={modalProps.choreId} groupId={modalProps.groupId} />
        }
        {mode === "inviteMember" && modalProps && modalProps.groupId &&
          <InviteMember groupId={modalProps.groupId} />
        }
        {mode === "relogError" && <ErrorModal message={modalProps?.message} />}
      </Modal>
    </BrowserRouter>
  );
}

export default App;