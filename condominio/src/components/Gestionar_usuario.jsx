import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Gestionar_usuario.css"

function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleEliminar = async(id)=>{
    try{
        await axios.delete(`http://127.0.0.1:8000/personas/eliminar_usuario/${id}/` ,{
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
        const response = await axios.get("http://127.0.0.1:8000/personas/gestionar_usuario/", {
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
              <td>{user.id}</td>
              <td>{user.nombre}</td>
              <td>{user.correo}</td>
              <td>{user.rol}</td>
              <td><button id="elim" onClick={()=> handleEliminar(user.id)}>eliminar</button></td>
              <td><button id="edit" >editar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GestionUsuarios;
