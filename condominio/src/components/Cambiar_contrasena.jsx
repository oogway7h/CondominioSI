import {useState} from 'react';
import axios from 'axios';
import './RegistroForm.css'

function Cambiar_contrasena(){
    const [error, setError] = useState("");
    const [password, setPassword] = useState("");


    const handleSubmit=async(e)=>{
         e.preventDefault();
        try{
            const API_URL="https://smartcondominiumbackend-production.up.railway.app"
            const res = await axios.post(`${API_URL}/personas/cambiar_contraseña/`,{
            //const res = await axios.post("http://127.0.0.1:8000/personas/cambiar_contrasena/",{
            passwor:password
            },{
                withCredentials:true
            }
            );
        }catch(err){
            setError("algo salio mal")
        }
    };
    return(
        <form onSubmit={handleSubmit} className="formRegistro">
        <h2>Cambiar contraseña</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div>  
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
export default Cambiar_contrasena;