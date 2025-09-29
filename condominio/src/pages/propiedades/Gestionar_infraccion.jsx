import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Gestionar_infracciones.css";

function AgregarInfraccion() {
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [form, setForm] = useState({
    persona: "",
    monto: "",
    descripcion: "",
    fecha: "",
    estado: "Pendiente",
  });


  const fetchUsuarios = async () => {
    try {
      const API_URL = "https://smartcondominiumbackend-production.up.railway.app";
      const response = await axios.get(`${API_URL}/personas/gestionar_usuario/`, {
      //const response = await axios.get(`http://127.0.0.1:8000/personas/gestionar_usuario/`, {
        withCredentials: true,
      });
      setPersonas(response.data.usuarios);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);


  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const API_URL = "https://smartcondominiumbackend-production.up.railway.app";

      const res = await axios.post(`${API_URL}/personas/agregar_infraccion/${form.persona}/`,{
      //const res = await axios.post(`http://127.0.0.1:8000/personas/agregar_infraccion/${form.persona}/`,{  
          monto: form.monto,
          descripcion: form.descripcion,
          fecha: form.fecha,
          estado: form.estado,
        },
        { withCredentials: true }
      );

      setMensaje("Infracción registrada correctamente ");
      console.log(res.data);


      setForm({
        persona: "",
        monto: "",
        descripcion: "",
        fecha: "",
        estado: "Pendiente",
      });
    } catch (err) {
      console.error(err);
      setError("Error en el registro, intente nuevamente");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="formRegistroi">
      <h2>Gestionar infracción</h2>
      {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Cargando usuarios...</p>}

      <div>
        
        <label className="form-label">Persona</label>
        <select
          name="persona"
          value={form.persona}
          onChange={handleChange}
          className="form-select"
          required
        >
          <option value="">Seleccione una persona</option>
          {personas.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre} (ID: {p.id})
            </option>
          ))}
        </select>

        <label>Monto:</label>
        <input
          type="text"
          name="monto"
          value={form.monto}
          onChange={handleChange}
          required
        />

        <label>Descripción:</label>
        <textarea
          className="textarea"
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
        />

        <label>Fecha:</label>
        <input
          type="date"
          name="fecha"
          value={form.fecha}
          onChange={handleChange}
          required
        />

        <label>Estado:</label>
        <select
          name="estado"
          value={form.estado}
          onChange={handleChange}
        >
          <option value="Pendiente">Pendiente</option>
          <option value="Pagado">Pagado</option>
        </select>

        <button type="submit">Registrar</button>
      </div>
    </form>
  );
}

export default AgregarInfraccion;
