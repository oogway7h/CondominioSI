import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegistroForm from "./components/RegistroForm";
import Homen from "./components/Homen";
import MainLayout from "./layout/mainloyout";
import Profile from "./components/profile"; 
import PrivateRoute from "./components/PrivateRoute";
import './App.css'  

function App() {
  localStorage.removeItem("token");
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<div className="logincont"><LoginForm /></div>} />

        <Route
          path="/Homen"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <MainLayout>
                <Homen />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/Profile"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <MainLayout>
                <Profile />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/RegistroForm"
          element={ <PrivateRoute isLoggedIn={isLoggedIn}>
              <MainLayout>
                <RegistroForm />
              </MainLayout>
            </PrivateRoute>}
        />
      </Routes>
    </Router>
  );
}

export default App;
