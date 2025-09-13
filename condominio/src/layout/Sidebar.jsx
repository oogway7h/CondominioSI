import React from "react";
import { Link } from "react-router-dom";
import LogoutButton from "../components/Logout";

const Sidebar = () => {
  return (
    <aside style={{ width: "200px", background: "#5c987cff", padding: "10px" }}>
      <ul>
        <li><Link to="/Homen">Home</Link></li>
        <li><Link to="/Profile">Perfil</Link></li>
        <li><Link to="/RegistroForm">Registrar Usuario</Link></li>
        <li><LogoutButton /></li>
      </ul>
    </aside>
  );
};

export default Sidebar;
