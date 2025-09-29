import React, { useState } from "react";
import { Link } from "react-router-dom";
import LogoutButton from "../components/Logout";
import "./Sidebar.css"; 

const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <aside className="sidebar">
      <ul className="sidebar-menu">
        <li>
          <button className="menu-boton" onClick={() => toggleMenu("home")}>
            Home
            <span className={`arrow ${openMenu === "home" ? "open" : ""}`}>▶</span>
          </button>
          {openMenu === "home" && (
            <ul className="submenu">
              <li><Link to="/Homen">Dashboard</Link></li>
              <li><Link to="/CamaraReconocimiento">Camara entrada</Link></li>
            </ul>
          )}
        </li>

        <li>
          <button className="menu-boton" onClick={() => toggleMenu("profile")}>
            Seguridad
            <span className={`arrow ${openMenu === "profile" ? "open" : ""}`}>▶</span>
          </button>
          {openMenu === "profile" && (
            <ul className="submenu">
              <li><Link to="/Bitacora">Bitacora</Link></li>
              <li><Link to="">Reportes</Link></li>
              <li><Link to="/Gestionar_aviso">Avisos</Link></li>
            </ul>
          )}
        </li>

        <li>
          <button className="menu-boton" onClick={() => toggleMenu("registro")}>
            Usuario
            <span className={`arrow ${openMenu === "registro" ? "open" : ""}`}>▶</span>
          </button>
          {openMenu === "registro" && (
            <ul className="submenu">
              <li><Link to="/RegistroForm">Registrar</Link></li>
              <li><Link to="/Gestionar_usuario"> Gestionar Usuario</Link></li>
              <li><Link to="/Profile">Ver Perfil</Link></li>
            </ul>
          )}
        </li>

        
        <li>
          <button className="menu-boton" onClick={() => toggleMenu("Propiedades")}>
            Propiedades e Infracciones
            <span className={`arrow ${openMenu === "Propiedades" ? "open" : ""}`}>▶</span>
          </button>
          {openMenu === "Propiedades" && (
            <ul className="submenu">
              <li><Link to="/Registrar_propiedad">Registrar</Link></li>
              <li><Link to="/Gestionar_privilegios"> Gestionar Privilegios</Link></li>
              <li><Link to="/Gestionar_infraccion">Gestionar infraccion</Link></li>
              <li><Link to="/Gestionar_vehiculo">Gestionar Vehiculo</Link></li>
            </ul>
          )}
        </li>



         <li>
          <button className="menu-boton" onClick={() => toggleMenu("Finanzas")}>
            Finanzas
            <span className={`arrow ${openMenu === "Fiananza" ? "open" : ""}`}>▶</span>
          </button>
          {openMenu === "Finanzas" && (
            <ul className="submenu">
              <li><Link to="/buscar_persona">Buscar</Link></li>
              <li><Link to="/Verificar_pagos">Verificar Pago</Link></li>
            </ul>
          )}
        </li>
        <li>
          <LogoutButton />
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
