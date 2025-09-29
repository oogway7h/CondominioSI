import {useState} from 'react';
import axios from 'axios';
import './RegistroForm.css';

function RegistroForm() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("residente");
  const [error, setError] = useState("");
  const [cargo, setCargo] = useState("");
  const [estado,setEstado] = useState("propie");
  const [foto, setFoto] = useState(null);  

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    try {
      const API_URL="https://smartcondominiumbackend-production.up.railway.app"
      //const API_URL="http://127.0.0.1:8000"
      const formData = new FormData();
      formData.append("correo", correo);
      formData.append("nombre", nombre);
      formData.append("telefono", telefono);
      formData.append("passwor", password);
      formData.append("rol", rol);
      formData.append("cargo", cargo);
      formData.append("estado", estado);
      if (foto) {
        formData.append("foto", foto); 
      }

      const res = await axios.post(`${API_URL}/personas/registro/`, formData, {
        withCredentials:true,
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      alert(`Registro exitoso: ${res.data.nombre}`);
      console.log(res.data);
    } catch (err) {
      console.error(err);
      setError("Error en el registro, intente nuevamente");
    }   
  };

  return (
    <form onSubmit={handleSubmit} className="formRegistro">
      <h2>Registro de Usuario</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      <label>Nombre:</label>
      <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />    

      <label>Correo:</label>
      <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required />

      <label>Teléfono:</label>
      <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />

      <label>Contraseña:</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

      <label>Rol:</label>
      <select name="rol" value={rol} onChange={(e) => setRol(e.target.value)}>
        <option value="admin">Administrador</option>
        <option value="residente">Residente</option>
      </select>

      <label>Estado:</label>
      <select name="estado" value={estado} onChange={(e) => setEstado(e.target.value)}>
        <option value="propie">Propietario</option>
        <option value="inqui">Inquilino</option>
      </select>
      
      <label>Cargo:</label>
      <input type="text" value={cargo} onChange={(e) => setCargo(e.target.value)} />

      <label>Foto de referencia:</label>
      <input type="file" accept="image/*" onChange={(e) => setFoto(e.target.files[0])} />

      <button type="submit">Registrar</button>
    </form>
  );
}
export default RegistroForm;
