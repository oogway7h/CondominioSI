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
import Recuperar_contraseña from "./components/Recuperar_contraseña";
import Cambiar_contrasena from "./components/Cambiar_contrasena";
import Gestionar_vehiculo from "./pages/propiedades/Gestionar_vehiculo";
import Gestionar_aviso from "./pages/avisos/Gestionar_aviso";
import Mostrar_avisos from "./pages/avisos/Mostrar_avisos";
import Verificar_pagos from "./pages/finanzas/Verificar_pagos"
import CamaraReconocimiento from "./pages/reconocimiento/CamaraReconocimiento";


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);   

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const API_URL="https://smartcondominiumbackend-production.up.railway.app"
        const res = await axios.get(`${API_URL}/personas/obtener_datos/`, {
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

        
        <Route path="/Recuperar_contraseña" element={
          //<PrivateRoute isLoggedIn={isLoggedIn}>
        
              <Recuperar_contraseña />
            
          //</PrivateRoute>
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

        
        <Route path="/Cambiar_contrasena" element={
          //<PrivateRoute isLoggedIn={isLoggedIn}>
            <MainLayout>
              <Cambiar_contrasena/>
            </MainLayout>
          //</PrivateRoute>
        } />

        <Route path="/Gestionar_vehiculo" element={
          //<PrivateRoute isLoggedIn={isLoggedIn}>
            <MainLayout>
              <Gestionar_vehiculo/>
            </MainLayout>
          //</PrivateRoute>
        } />


        <Route path="/Gestionar_aviso" element={
          //<PrivateRoute isLoggedIn={isLoggedIn}>
            <MainLayout>
              <Gestionar_aviso/>
            </MainLayout>
          //</PrivateRoute>
        } />

        <Route path="/Mostrar_avisos" element={
          //<PrivateRoute isLoggedIn={isLoggedIn}>
            <MainLayout>
              <Mostrar_avisos/>
            </MainLayout>
          //</PrivateRoute>
        } />

        <Route path="/Verificar_pagos" element={
          //<PrivateRoute isLoggedIn={isLoggedIn}>
            <MainLayout>
              <Verificar_pagos/>
            </MainLayout>
          //</PrivateRoute>
        } />
        
        
        <Route path="/CamaraReconocimiento" element={
          //<PrivateRoute isLoggedIn={isLoggedIn}>
            <MainLayout>
              <CamaraReconocimiento/>
            </MainLayout>
          //</PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;

