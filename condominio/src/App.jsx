import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegistroForm from "./components/RegistroForm";
import Homen from "./components/Homen";
import MainLayout from "./layout/mainloyout";
import Profile from "./components/profile"; 
import PrivateRoute from "./components/PrivateRoute";
import './App.css'  
import { useEffect, useState } from "react";
import axios from "axios";


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);   

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:7000/personas/obtener_datos/", {
          withCredentials: true, 
        });
        setIsLoggedIn(true);
        console.log("Usuario autenticado:", res.data);
      } catch (err) {
        setIsLoggedIn(false);
      }
    };
    
    checkAuth();
  }, []);


  if (isLoggedIn === null) {
    return <div>Cargando...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="logincont"><LoginForm setIsLoggedIn={setIsLoggedIn} /></div>
        } />
        
        <Route path="/Homen" element={
          //<PrivateRoute isLoggedIn={isLoggedIn}>
            <MainLayout>
              <Homen />
            </MainLayout>
          //</PrivateRoute>
        } />

        <Route path="/Profile" element={
          //<PrivateRoute isLoggedIn={isLoggedIn}>
            <MainLayout>
              <Profile />
            </MainLayout>
          //</PrivateRoute>
        } />

        <Route path="/RegistroForm" element={
          //<PrivateRoute isLoggedIn={isLoggedIn}>
            <MainLayout>
              <RegistroForm />
            </MainLayout>
          //</PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;

