import { useState } from "react";
import axios from "axios";
import "../styles/Gestionar_aviso.css";
import { useNavigate } from "react-router-dom";

function Gestionar_aviso() {
  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    fecha_expiracion: "",
    visible: true,
  });
  const navigate=useNavigate()
  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleMostrar =(e)=>{
    navigate("/Mostrar_avisos")
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const API_URL="https://smartcondominiumbackend-production.up.railway.app"
    axios.get(`${API_URL}/personas/crear_aviso/`,form, {
    //axios.post("http://127.0.0.1:8000/personas/crear_aviso/", form, {
        withCredentials: true,
      })
      .then((res) => {
        setMensaje("Aviso publicado correctamente");
        setForm({
          titulo: "",
          descripcion: "",
          fecha_expiracion: "",
          visible: true,
        });
      })
      .catch((err) => {
        console.error(err);
        setMensaje("Error al publicar el aviso");
      });
  };

  return (
    <div className="form-container">
      <h2>Publicar Aviso</h2>
      {mensaje && <p className="message">{mensaje}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Título</label>
          <input
            type="text"
            name="titulo"
            value={form.titulo}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Descripción</label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            className="form-textarea"
            rows="4"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Fecha de Expiración</label>
          <input
            type="date"
            name="fecha_expiracion"
            value={form.fecha_expiracion}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group checkbox-group">
          <label className="form-label">Visible</label>
          <input
            type="checkbox"
            name="visible"
            checked={form.visible}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn-submit">
          Publicar
        </button>
        
      </form>
      <button onClick={handleMostrar}>Ver avisos</button>
    </div>
  );
}

export default Gestionar_aviso;
