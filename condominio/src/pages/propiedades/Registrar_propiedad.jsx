import { useState } from "react";
import "../styles/Registrarpropiedad.css";
import axios from "axios"

function PropiedadForm({ onSuccess }) {
  const [ubicacion, setUbicacion] = useState("");
  const [perteneceA, setPerteneceA] = useState("");
  const [personaId, setPersonaId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/personas/registrar_propiedad/${personaId}/`,
        {
            ubicacion:ubicacion,
            pertenece_a:perteneceA
        },{
            WithCredentials:true
        }
      );

      const data = response.data;

      if (!response.ok) {
        throw new Error(data.message || "Error al agregar propiedad");
      }

      if (onSuccess) onSuccess(data);

      setUbicacion("");
      setPerteneceA("");
      setPersonaId("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Agregar Propiedad</h2>

      <label >
        ID Persona:
        <input
          type="number"
          value={personaId}
          onChange={(e) => setPersonaId(e.target.value)}
          required
        />
      </label>

      <label >
        Ubicación:
        <input
          type="text"
          value={ubicacion}
          onChange={(e) => setUbicacion(e.target.value)}
          required
        
        />
      </label>

      <label >
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
