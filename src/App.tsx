import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './views/Login';
import Register from './views/Register';

function App() {
  return (
    <div>
      <Routes>
        <Route path='/login' element={<Login />}/>
        <Route path='/register' element={<Register />}/>
        <Route path="*" element={<Navigate to="/login" replace />}/>
      </Routes>
    </div>
  );
}

export default App;
