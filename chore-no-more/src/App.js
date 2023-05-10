import './App.css';
import { useSession, useSessionContext } from '@supabase/auth-helpers-react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ErrorPage from './pages/ErrorPage';
import Instructions from './pages/HowToUse';
import Home from './pages/Home';

function App() {

  return (
      <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/instructions' element={<Instructions/>} />
          <Route path='/home' element={<Home />} />
          <Route path='*' element={<ErrorPage />} />
        </Routes>
  );
}
    
/*
<Router>
        <Routes>
          <Route path='/'>
            
          </Route>
          <Route path='/' element={<Home />} />
          <Route path='/' element={<Home />} />
        </Routes>
</Router>
*/

export default App;