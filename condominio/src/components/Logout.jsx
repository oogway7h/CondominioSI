import { useNavigate } from "react-router-dom";
import axios from "axios";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const refresh = localStorage.getItem("refresh");
      if (refresh) {
        await axios.post("http://127.0.0.1:7000/personas/cerrar_sesion/", 
          { refresh },
          { withCredentials: true }
        );
      }

      //borrar tokens
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      navigate("/");
    } catch (err) {
      console.error(err);
      navigate("/");
    }
  };

  return <button onClick={handleLogout}>Cerrar Sesión</button>;
};

export default LogoutButton;
