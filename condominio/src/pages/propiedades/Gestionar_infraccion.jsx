import {useState} from 'react';
import axios from 'axios';
import '../styles/Gestionar_infracciones.css'

function AgregarInfraccion() {
  const [monto, setMonto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState("");
  const [estado, setEstado] = useState("Pendiente");
  const [error, setError] = useState("");

  const handleSubmit = async (e,id) => {
    e.preventDefault(); 
    try {
      const res = await axios.post(`http://127.0.0.1:8000/personas/agregar_infraccion/17/`,{
        monto:monto,
        descripcion:descripcion,
        fecha:fecha,
        estado:estado
      },
      
    {withCredentials:true}
  );

      alert(`Registro exitoso`);
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
          <label>Monto:</label>
          <input
            type="text"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            required
          />    
            <label>Descripcion:</label>
            <textarea className='textarea'
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              
            />
            <label>Fecha:</label>    
            <input
              type="date"
              value={fecha}  
                onChange={(e) => setFecha(e.target.value)}   
                required
            />
            

            <label>Estado:</label>
            <select name="estado" value={estado} onChange={(e) => setEstado(e.target.value)}>
              <option value="pend">Pendiente</option>
              <option value="pag">Pagado</option>
            </select>


            <button type="submit">Registrar</button>

            
        </div>
      </form>
    )
}
export default AgregarInfraccion;