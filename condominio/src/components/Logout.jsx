import { useNavigate } from "react-router-dom";
import axios from "axios";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
        const API_URL="https://smartcondominiumbackend-production.up.railway.app"
        await axios.post(`${API_URL}/personas/cerrar_sesion/`, 
          {},
          { withCredentials: true }
        );
      
        localStorage.removeItem("token");
        

      navigate("/");
    } catch (err) {
      console.error(err);
      navigate("/");
    }
  };

  return <button onClick={handleLogout}>Cerrar Sesión</button>;
};

export default LogoutButton;
