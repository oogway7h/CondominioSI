import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Gestionar_usuario.css"

function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const handleEliminar = async(id)=>{
    try{
        const API_URL="https://smartcondominiumbackend-production.up.railway.app"
        await axios.delete(`${API_URL}/eliminar_usuario/${id}/` ,{
            withCredentials:true,
        });
        setUsuarios(usuarios.filter((user) => user.id !== id));
        alert("Usuario Eliminado con exito")
    }catch(err){
        alert("No se pudo eliminar el usuario")
    }
  };

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const API_URL="https://smartcondominiumbackend-production.up.railway.app"
        const response = await axios.get(`${API_URL}/personas/gestionar_usuario/`, {
          withCredentials: true,
        });
        setUsuarios(response.data.usuarios);
      } catch (err) {
        setError("No se pudieron cargar los usuarios");
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  if (loading) return <p>Cargando usuarios...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Gestión de Usuarios</h2>
      <table className="dat">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((user) => (
            <tr key={user.id}>
              <td data-label="ID">{user.id}</td>
              <td data-label="Nombre">{user.nombre}</td>
              <td data-label="Correo">{user.correo}</td>
              <td data-label="Rol">{user.rol}</td>
              <td data-label="Acción">
                <button id="elim" onClick={() => handleEliminar(user.id)}>eliminar</button>
              </td>
              <td data-label="Acción">
                <button id="edit">editar</button>
              </td>
          </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GestionUsuarios;
