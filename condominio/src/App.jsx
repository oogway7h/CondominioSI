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
import GestionUsuarios from "./components/Gestionar_usuario";
import Bitacora from "./components/Bitacora";
import PropiedadForm from "./pages/propiedades/Registrar_propiedad";
import GestionarPrivilegios from "./pages/propiedades/Gestionar_privilegios";
import AgregarInfraccion from "./pages/propiedades/Gestionar_infraccion"


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);   

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/personas/obtener_datos/", {
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

        <Route path="/Gestionar_usuario" element={
          //<PrivateRoute isLoggedIn={isLoggedIn}>
            <MainLayout>
              <GestionUsuarios />
            </MainLayout>
          //</PrivateRoute>
        } />

         <Route path="/Bitacora" element={
          //<PrivateRoute isLoggedIn={isLoggedIn}>
            <MainLayout>
              <Bitacora />
            </MainLayout>
          //</PrivateRoute>
        } />

        <Route path="/Registrar_propiedad" element={
          //<PrivateRoute isLoggedIn={isLoggedIn}>
            <MainLayout>
              <PropiedadForm/>
            </MainLayout>
          //</PrivateRoute>
        } />


        <Route path="/Gestionar_privilegios" element={
          //<PrivateRoute isLoggedIn={isLoggedIn}>
            <MainLayout>
              <GestionarPrivilegios/>
            </MainLayout>
          //</PrivateRoute>
        } />

        <Route path="/Gestionar_infraccion" element={
          //<PrivateRoute isLoggedIn={isLoggedIn}>
            <MainLayout>
              <AgregarInfraccion/>
            </MainLayout>
          //</PrivateRoute>
        } />

      </Routes>
    </Router>
  );
}

export default App;

