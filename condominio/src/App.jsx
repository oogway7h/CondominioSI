import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegistroForm from "./components/RegistroForm";

function App() {
  return (
    <Router> {/* Esto es clave */}
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/RegistroForm" element={<RegistroForm />} />
      </Routes>
    </Router>
  );
}

export default App;
