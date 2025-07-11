import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Calendar from "./components/Calendar"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/calendar" element={<Calendar />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

