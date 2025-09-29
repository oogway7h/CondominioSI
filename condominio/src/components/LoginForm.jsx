import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './LoguinForm.css'
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 

function LoginForm({ setIsLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRecoverPass=async (e) =>{
     e.preventDefault();
        try{
            const API_URL="https://smartcondominiumbackend-production.up.railway.app"
            const res = await axios.post(`${API_URL}/personas/obtener_codigo/`,{
            //const res = await axios.post("http://127.0.0.1:8000/personas/obtener_codigo/",{
            correo: username,
            },
            );
            console.log("enviado")
        }catch(err){
            setError("error al enviar codigo")
        }
    navigate('/Recuperar_contraseña')
  }


  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const API_URL="https://smartcondominiumbackend-production.up.railway.app"
    //const res = await axios.post(`${API_URL}/personas/login/`,{
    const res = await axios.post("http://127.0.0.1:8000/personas/login/",{
        correo: username,
        passwor: password,
      },
      { withCredentials: true }
    );
    if (setIsLoggedIn) setIsLoggedIn(true);

    await new Promise((r) => setTimeout(r, 0));
    handleInicio();
    
    console.log(res.data);
  } catch (err) {
    setError("Error, usuario o contraseña incorrectos");
  }
};
  


  const handleInicio = () => {
    toast.success("Inicio de sesion exitoso ", {
      position: "top-center",
      autoClose: 3000,
    });
    setTimeout(() => {
      navigate("/Homen");
    },1000); 
  };

  return (
    <>
    <ToastContainer/> 
    <form onSubmit={handleSubmit} className="formLogin">
      <h2>Inicia Sesión</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <label>Usuario:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label>Contraseña:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Ingresar</button> 
        <button className="forgot" onClick={handleRecoverPass}>Olvidé mi contraseña</button>
        
      </div>
    </form>
    </>
  );
}

export default LoginForm;
