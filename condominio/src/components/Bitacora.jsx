import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Bitacora.css";

function Bitacora() {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const API_URL="https://smartcondominiumbackend-production.up.railway.app"
    const fetchBitacora = async () => {
      try {
        const response = await axios.get(`${API_URL}/personas/bitacora/`, {
         //const response = await axios.get(`http://127.0.0.1:8000/personas/bitacora/`, { 
          withCredentials: true
        });
        setRegistros(response.data.bitacora);
      } catch (err) {
        setError("No se pudieron cargar los registros");
      } finally {
        setLoading(false);
      }
    };

    fetchBitacora();
  }, []);

  if (loading) return <p>Cargando bitácora...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Bitácora</h2>
      <table className="dat">
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Fecha y hora</th>
            <th>Acción</th>
            <th>Detalle</th>
            <th>Ip</th>
          </tr>
        </thead>
        <tbody>
          {registros.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.usuario}</td>
              <td>{new Date(r.fecha_hora).toLocaleString()}</td>
              <td>{r.accion}</td>
              <td>{r.detalle}</td>
              <td>{r.ip}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Bitacora;
