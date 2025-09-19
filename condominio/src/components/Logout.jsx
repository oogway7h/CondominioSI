import { useNavigate } from "react-router-dom";
import axios from "axios";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
        await axios.post("http://127.0.0.1:8000/personas/cerrar_sesion/", 
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
