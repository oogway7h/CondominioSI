import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Gestionar_privilegios.css"
import { createMemorySessionStorage } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



function GestionPrivilegios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mostrar, setMostrar] = useState(false);

  const handleCambio = async (id, campo, valorActual) => {
  const API_URL="https://smartcondominiumbackend-production.up.railway.app"
    try {

    await axios.patch(
      
      `${API_URL}/personas/actualizar_privilegios/${id}/`,
      { [campo]: !valorActual },
      { withCredentials: true }
    );

    setUsuarios((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, [campo]: !valorActual } : u
      )
    );
  } catch (err) {
    alert("Error al actualizar privilegios");
  }
};

const handleGuardar = () => {
  toast.success("Cambios guardados con éxito", {
    position: "top-center",
    autoClose: 3000,
  });
};

 /* const handleEliminar = async(id)=>{
    try{
        await axios.delete(`http://127.0.0.1:8000/personas/eliminar_usuario/${id}/` ,{
            withCredentials:true,
        });
        setUsuarios(usuarios.filter((user) => user.id !== id));
        alert("Usuario Eliminado con exito")
    }catch(err){
        alert("No se pudo eliminar el usuario")
    }
  };*/

  useEffect(() => {
    const fetchUsuarios = async(id)=> {
      try {
        const API_URL="https://smartcondominiumbackend-production.up.railway.app"
        const response = await axios.get(`${API_URL}/personas/gestionar_privilegios/`, {
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
    <div className="tabla">
      <h2>Gestión de Usuarios</h2>
      <table className="dat">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Cesped</th>
            <th>Entrada</th>
            <th>Basura</th>
            <th>Visita</th>
            <th>Gimnasio</th>
            <th>Piscina</th>
            <th>SalaEventos</th>
            <th>Especiales</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.nombre}</td>
              <td>{user.correo}</td>
              <td> <div className={`switch ${user.corte_cesped ? "true" : "false"}`} 
              onClick={()=>handleCambio(user.id,"corte_cesped",user.corte_cesped)}></div></td>
              <td> <div className={`switch ${user.entrada_auto ? "true" : "false"}`} 
              onClick={()=>handleCambio(user.id,"entrada_auto",user.entrada_auto)}></div></td>
              <td> <div className={`switch ${user.recojo_basura ? "true" : "false"}`}
              onClick={()=>handleCambio(user.id,"recojo_basura",user.recojo_basura)}></div></td>
              <td> <div className={`switch ${user.avisos_visita ? "true" : "false"}`}
              onClick={()=>handleCambio(user.id,"avisos_visita",user.avisos_visita)}></div></td>
              <td> <div className={`switch ${user.acceso_gimnasio ? "true" : "false"}`}
              onClick={()=>handleCambio(user.id,"acceso_gimnasio",user.acceso_gimnasio)}></div></td>
              <td> <div className={`switch ${user.acceso_piscina ? "true" : "false"}`}
              onClick={()=>handleCambio(user.id,"acceso_piscina",user.acceso_piscina)}></div></td>
              <td> <div className={`switch ${user.acceso_sala_eventos ? "true" : "false"}`}
              onClick={()=>handleCambio(user.id,"acceso_sala_eventos",user.acceso_sala_eventos)}></div></td>
              <td>{user.permisos_especiales}</td>
              <td></td>
              <td><button id="elim" onClick={()=> handleEliminar(user.id)}>eliminar</button></td>
              <td><button id="edit" >editar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="guardar" onClick={ ()=>handleGuardar(true)}>
        Guardar
      </button>
       <ToastContainer />
    </div>
  );
}

export default GestionPrivilegios;
