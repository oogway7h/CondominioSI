import {useState} from 'react';
import axios from 'axios';
import './RegistroForm.css'

function Recupera_contraseña(){
    const [correo,setCorreo]=useState("");
    const [codigo,setCodigo]=useState("");
    const [error, setError] = useState("");
    const [password, setPassword] = useState("");


    const handleSubmit=async(e)=>{
         e.preventDefault();
        try{
            const API_URL="https://smartcondominiumbackend-production.up.railway.app"
            const res = await axios.post(`${API_URL}/personas/nueva_contraseña/`,{
            //const res = await axios.post("http://127.0.0.1:8000/personas/nueva_contrasena/",{
            reset_token: codigo,
            correo:correo,
            passwor:password
            },
            );
        }catch(err){
            setError("algo salio mal")
        }
    };
    return(
        <form onSubmit={handleSubmit} className="formRegistro">
        <h2>Recupera tu contraseña</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div>
          <label>Codigo:</label>
          <input
            type="text"
            value={codigo}
            onChange={(e)=> setCodigo(e.target.value)}
            required
          />    
            <label>Correo:</label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
            
            <label>Nueva Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Guardar nueva contraseña</button>
        </div>
      </form>
    ) 
}
export default Recupera_contraseña;