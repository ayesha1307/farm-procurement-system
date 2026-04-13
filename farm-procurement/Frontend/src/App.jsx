<<<<<<< HEAD
import { BrowserRouter, Routes, Route } from "react-router-dom";

function Home() {
}
=======
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";
>>>>>>> 9fc93fc775d3f99bd4cee8a477dec371a48afc32

function App() {
  return (
    <BrowserRouter>
<<<<<<< HEAD
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
=======
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
>>>>>>> 9fc93fc775d3f99bd4cee8a477dec371a48afc32
    </BrowserRouter>
  );
}

<<<<<<< HEAD
export default App;
=======
export default App;
>>>>>>> 9fc93fc775d3f99bd4cee8a477dec371a48afc32
