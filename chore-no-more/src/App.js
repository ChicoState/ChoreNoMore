import './App.css';
import { useSession, useSessionContext } from '@supabase/auth-helpers-react';
import { supabase } from './supabaseClient';
import { TaskChores } from './components/TaskChores';


function App() {
  const session = useSession(); // tokens, when session exists we have a user
  const { isLoading } = useSessionContext();

  if(isLoading) {
    return <></>
  }

  async function googleSignIn() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'https://www.googleapis.com/auth/tasks'
      }
    });
    if(error) {
      alert("Error logging in to Google provider with Supabase");
      console.log(error);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <div className="App">
      <div style={{width: "400px", margin: "30px auto"}}>
        {session ?
          <>
            <TaskChores />
            <button onClick={() => signOut()}>Sign Out of Google</button>
          </>
          :
          <>
            <p>Sign in with Google to sync with Google Tasks</p>
            <button onClick={() => googleSignIn()}>Sign In With Google</button>
          </>
        }
      </div>
    </div>
  );
}

export default App;