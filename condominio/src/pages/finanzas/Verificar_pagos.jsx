import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Verificar_pagos.css";

function GestionPagos() {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
//const API_URL = "http://127.0.0.1:8000"; 
const API_URL = "https://smartcondominiumbackend-production.up.railway.app";
  useEffect(() => {
    const fetchPagos = async () => {
      try {
        const response = await axios.get(`${API_URL}/personas/listar_todos_pagos/`, {
          withCredentials: true,
        });

        const pagosPagados = response.data.filter(p => p.estado === "pagado");

        setPagos(pagosPagados);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los pagos.");
      } finally {
        setLoading(false);
      }
    };

    fetchPagos();
  }, []);


 const handleEdit = async (id) => {
    try {
      await axios.patch(`${API_URL}/personas/cambiar_estado/${id}/`, 
        { estado: "pendiente" }, 
        { withCredentials: true }
      );


      setPagos(prev => prev.map(p => p.id_pago === id ? { ...p, estado: "pendiente" } : p));
    } catch (err) {
      console.error(err);
      alert("No se pudo cambiar el estado del pago");
    }
  };


  if (loading) return <p>Cargando pagos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="pagos-container">
      <h2>Pagos marcados como pagados</h2>
      {pagos.length === 0 ? (
        <p>No hay pagos pagados.</p>
      ) : (
        <table className="pagos-table">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>ID</th>
              <th>ID Persona</th>
              <th>Monto</th>
              <th>Fecha</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {pagos.map((pago) => (
              <tr key={pago.id_pago}>
                <td>{pago.tipo}</td>
                <td>{pago.id_cuota || pago.id_infraccion}</td>
                <td>{pago.id_persona}</td>
                <td>{pago.monto}</td>
                <td>{pago.fecha}</td>
                <td>{pago.estado}</td>
                <td data-label="Acción">
                <button id="edit" onClick={() => handleEdit(pago.id_pago)}>Cambiar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default GestionPagos;
