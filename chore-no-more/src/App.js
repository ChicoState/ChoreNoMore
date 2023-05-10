import './App.css';
import { useSession, useSessionContext } from '@supabase/auth-helpers-react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import ErrorPage from './pages/ErrorPage';

function App() {

  return (
      <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/sign-up' element={<SignUp />} />
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