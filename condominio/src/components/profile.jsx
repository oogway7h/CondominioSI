import { useEffect, useState } from "react";
import axios from "axios";
import "./profile.css"

function Profile() {
  const [userData, setUserData] = useState(null);

  const getUserData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/personas/obtener_datos/", {
        withCredentials:true
      });
      setUserData(response.data);
    } catch (err) {
      console.log("se viene aqui", err);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div>
      <h1>Perfil</h1>
      {userData ? (
        <div className="datos">
          <p><strong>Nombre:</strong> {userData.nombre}</p>
          <p><strong>Correo:</strong> {userData.correo}</p>
          <p><strong>ID:</strong> {userData.id}</p>
          <p><strong>Cargo:</strong> {userData.cargo}</p>
        </div>
      ) : (
        <p>Cargando datos...</p>
      )}

      <button>
        Editar
      </button>
    </div>
  );
}

export default Profile;
