import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import "../styles/CamaraReconocimiento.css";

function CamaraReconocimiento() {
  const webcamRef = useRef(null);
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [captura, setCaptura] = useState(null); 

  const capture = async () => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    const blob = await (await fetch(imageSrc)).blob();
    const file = new File([blob], "captura.jpg", { type: "image/jpeg" });
    setCaptura(file); 
    const formData = new FormData();
    formData.append("foto", file);

    setLoading(true);
    try {
        const API_URL="https://smartcondominiumbackend-production.up.railway.app"
      //const API_URL = "http://127.0.0.1:8000"; 
      const res = await axios.post(`${API_URL}/personas/reconocer/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true
      });
      setResultado(res.data); 
    } catch (err) {
      console.error(err);
      setResultado({ error: "No se pudo reconocer la cara" });
    } finally {
      setLoading(false);
    }
  };

  const registrarAcceso = async () => {
    if (!resultado || !resultado.id_persona) {
      alert("Primero reconoce a la persona.");
      return;
    }
    if (!captura) {
      alert("No hay foto capturada para registrar.");
      return;
    }

    const formData = new FormData();
    formData.append("id_persona", resultado.id_persona);
    formData.append("tipo", "entrada");
    formData.append("foto_url", captura); 

    try {
      const API_URL="https://smartcondominiumbackend-production.up.railway.app"
      //const API_URL = "http://127.0.0.1:8000";
      const res = await axios.post(`${API_URL}/personas/registrar_acceso/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true
      });
      alert(res.data.mensaje);
    } catch (err) {
      console.error(err);
      alert("Error al registrar acceso");
    }
  };

  return (
    <div>
      <h2>Reconocimiento Facial</h2>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={320}
        height={240}
        videoConstraints={{ facingMode: "user" }}
      />
      <br />
      <button onClick={capture} disabled={loading}>
        {loading ? "Reconociendo..." : "Capturar y Reconocer"}
      </button>
      <button onClick={registrarAcceso} disabled={!resultado || !resultado.id_persona}>
        Registrar Acceso
      </button>
      {resultado && (
        <div style={{ marginTop: "1rem" }}>
          {resultado.error ? (
            <p style={{ color: "red" }}>{resultado.error}</p>
          ) : (
            <>
              <p>Persona reconocida: {resultado.nombre}</p>
              <p>Correo: {resultado.correo}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default CamaraReconocimiento;
