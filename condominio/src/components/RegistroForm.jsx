import {useState} from 'react';
import axios from 'axios';
import './RegistroForm.css'

function RegistroForm() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("residente");
  const [error, setError] = useState("");
  const [cargo, setCargo] = useState("");
  const [estado,setEstado] =useState("propie");

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      const res = await axios.post("http://127.0.0.1:8000/personas/registro/",{
        correo: correo,
        nombre: nombre,
        telefono: telefono,
        passwor: password,  
        rol:rol,
        cargo:cargo,
        estado:estado 
      },
    
    {withCredentials:true}
  );

      alert(`Registro exitoso: ${res.data.nombre}`);
      console.log(res.data);
    } catch (err) {
      setError("Error en el registro, intente nuevamente");
    }   
    };

    return (
        <form onSubmit={handleSubmit} className="formRegistro">
        <h2>Registro de Usuario</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />    
            <label>Correo:</label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
            <label>Teléfono:</label>    
            <input
              type="text"
              value={telefono}  
                onChange={(e) => setTelefono(e.target.value)}   
                required
            />
            <label>Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

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
            <input
              type="cargo"
              value={cargo}
              onChange={(e) => setCargo(e.target.value)}
            />

            <button type="submit">Registrar</button>

            
        </div>
      </form>
    )
}
export default RegistroForm;