import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Gestionar_vehiculo.css"; 

function Gestionar_vehiculo() {
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [form, setForm] = useState({
    placa: "",
    persona: "",
    marca: "",
    modelo: "",
    color: "",
  });

  
  const fetchUsuarios = async () => {
    try {
      const API_URL="https://smartcondominiumbackend-production.up.railway.app"
      const response = await axios.get(`${API_URL}/personas/gestionar_usuario/`, {
      //const response = await axios.get("http://127.0.0.1:8000/personas/gestionar_usuario/",{ 
        withCredentials: true }
      );
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


  const handleSubmit = (e) => {
    e.preventDefault();
    const API_URL="https://smartcondominiumbackend-production.up.railway.app"
    axios.post(`${API_URL}/vehiculos/gestionar_vehiculo/`,form)
    //axios.post("http://127.0.0.1:8000/vehiculos/gestionar_vehiculo/", form)
      .then((res) => {
        setMensaje(res.data.message);
        setForm({
          placa: "",
          persona: "",
          marca: "",
          modelo: "",
          color: "",
        });
      })
      .catch((err) => {
        console.error(err);
        setMensaje("Error al gestionar vehículo");
      });
  };

  return (
    <div className="formcontainer">
      <h2>Gestionar Vehículo</h2>
      {mensaje && <p className="message">{mensaje}</p>}
      {loading && <p className="message">Cargando usuarios...</p>}
      {error && <p className="message">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Placa</label>
          <input
            type="text"
            name="placa"
            value={form.placa}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
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
        </div>

        <div className="form-group">
          <label className="form-label">Marca</label>
          <input
            type="text"
            name="marca"
            value={form.marca}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Modelo</label>
          <input
            type="text"
            name="modelo"
            value={form.modelo}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Color</label>
          <input
            type="text"
            name="color"
            value={form.color}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <button type="submit" className="btnsubmit">
          Guardar
        </button>
      </form>
    </div>
  );
}

export default Gestionar_vehiculo;
