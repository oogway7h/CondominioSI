import { useState, useEffect } from "react";
import "../styles/Registrarpropiedad.css";
import axios from "axios";

function PropiedadForm({ onSuccess }) {
  const [ubicacion, setUbicacion] = useState("");
  const [perteneceA, setPerteneceA] = useState("");
  const [personaId, setPersonaId] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const API_URL = "https://smartcondominiumbackend-production.up.railway.app";
        const response = await axios.get(`${API_URL}/personas/gestionar_usuario/`, {
          withCredentials: true,
        });
        //filtra solo residentes para que muestre eso en el select
        const residentes = response.data.usuarios.filter(
          (u) => u.rol.toLowerCase() === "residente"
        );
        setUsuarios(residentes);
      } catch (err) {
        console.error("Error al cargar usuarios", err);
      }
    };
    fetchUsuarios();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const API_URL = "https://smartcondominiumbackend-production.up.railway.app";
      const response = await axios.post(
        `${API_URL}/personas/registrar_propiedad/${personaId}/`,
        {
          ubicacion: ubicacion,
          pertenece_a: perteneceA,
        },
        {
          withCredentials: true, 
        }
      );

      const data = response.data;
      if (onSuccess) onSuccess(data);

      setUbicacion("");
      setPerteneceA("");
      setPersonaId("");
    } catch (err) {
      setError(err.message || "Error al registrar la propiedad");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Agregar Propiedad</h2>

      <label>
        Seleccionar Residente:
        <select
          value={personaId}
          onChange={(e) => setPersonaId(e.target.value)}
          required
        >
          <option value="">Seleccione un residente ya registrado</option>
          {usuarios.map((user) => (
            <option key={user.id} value={user.id}>
              {user.nombre} ({user.correo})
            </option>
          ))}
        </select>
      </label>

      <label>
        Ubicación:
        <input
          type="text"
          value={ubicacion}
          onChange={(e) => setUbicacion(e.target.value)}
          required
        />
      </label>

      <label>
        Pertenece a:
        <input
          type="text"
          value={perteneceA}
          onChange={(e) => setPerteneceA(e.target.value)}
        />
      </label>

      <button type="submit" disabled={loading}>
        {loading ? "Guardando..." : "Agregar Propiedad"}
      </button>

      {error && <p>{error}</p>}
    </form>
  );
}

export default PropiedadForm;
