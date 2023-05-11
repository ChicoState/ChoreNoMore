import './App.css';
import { useSession, useSessionContext } from '@supabase/auth-helpers-react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login';
import ErrorPage from './pages/ErrorPage';
import Instructions from './pages/HowToUse';
import SignUp from './components/SignUp';

function App() {

  return (
      <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/instructions' element={<Instructions/>} />
          <Route path='*' element={<ErrorPage />} />
        </Routes>
  );
}

export default App;
