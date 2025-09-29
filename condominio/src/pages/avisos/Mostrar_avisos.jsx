import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Avisos.css";

function Avisos() {
  const [avisos, setAvisos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const API_URL = "https://smartcondominiumbackend-production.up.railway.app";
    
    const fetchAvisos = async () => {
      try {
        const response = await axios.get(`${API_URL}/personas/mostrar_avisos/`, {
        //const response = await axios.get(`http://127.0.0.1:8000/personas/mostrar_avisos/`, {     
            withCredentials: true });
        setAvisos(response.data.avisos || []);
      } catch (err) {
        setError("No se pudieron cargar los avisos");
      } finally {
        setLoading(false);
      }
    };

    fetchAvisos();
  }, []);

  const eliminarAviso = async (id) => {
    const API_URL = "https://smartcondominiumbackend-production.up.railway.app";
    try {
      await axios.delete(`${API_URL}/personas/eliminar_aviso/${id}/`, {
      //await axios.delete(`http://127.0.0.1:8000/personas/eliminar_aviso/${id}/`, {  
        withCredentials: true });
      setAvisos(avisos.filter(a => a.id !== id));
      setMensaje("Aviso eliminado correctamente");
    } catch (err) {
      console.error(err);
      setMensaje("Error al eliminar el aviso");
    }
  };

  if (loading) return <p>Cargando avisos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Avisos publicados</h2>
      {mensaje && <p className="message">{mensaje}</p>}
      <table className="dat">
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Descripción</th>
            <th>Publicado por</th>
            <th>Fecha publicación</th>
            <th>Fecha expiración</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {avisos.length === 0 ? (
            <tr><td colSpan="7">No hay avisos publicados :(((</td></tr>
          ) : (
            avisos.map((a) => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.titulo}</td>
                <td>{a.descripcion}</td>
                <td>{a.publicado_por}</td>
                <td>{new Date(a.fecha_publicacion).toLocaleString()}</td>
                <td>{a.fecha_expiracion ? new Date(a.fecha_expiracion).toLocaleString() : "Sin fecha"}</td>
                <td>
                  <button className="eliminar" onClick={() => eliminarAviso(a.id) }>Eliminar</button>
                  <br />
                  <button className="editar">Editar</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Avisos;
