import { ToastContainer } from 'react-toastify';
import './App.css';
import { Route, Routes } from "react-router-dom";
import Home from './Pages/Home';
import Chats from './Pages/Chats';
function App() {
  return (
    <div className="App">
      <ToastContainer/>
     <Routes>
        <Route path="/" element={<Home />} exact />
        <Route path="/chats" element={<Chats />} />
      </Routes>
    </div>
  );
}

export default App;
