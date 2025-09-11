import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegistroForm from "./components/RegistroForm";
import Homen from "./components/Homen";

function App() {
  return (
    <Router> {/* Esto es clave */}
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/Homen" element={<Homen/>} />
        <Route path="/RegistroForm" element={<RegistroForm />} />
      </Routes>
    </Router>
  );
}

export default App;
