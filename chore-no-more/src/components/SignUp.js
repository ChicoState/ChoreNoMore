import React from 'react';
import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useSession, useSessionContext } from '@supabase/auth-helpers-react';
import { Stylesheet } from '../components/Stylesheet';

function SignUp() {
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ name, setName ] = useState('');

    async function supabaseSignUp() {
        console.log(email, password);
        const { errorSignUp } = await supabase.auth.signUp({
          email: email,
          password: password,
        });
        if(errorSignUp){
          alert("Error logging in with email with Supabase");
          console.log(errorSignUp);
        }
        const { error } = await supabase
          .from('Users')
          .insert({ Email: email, Name : name })
        if(error){
          alert("Failed to add to database");
          console.log(error);
        } 
     
      }

    return (
        <div className='App'>
          <div style={{ width: "400px", margin: "30px auto" }}>
            <Stylesheet />
            <form className='create-account'> 
                <span> <b>Create Account</b> </span><br></br>
                Email:<br></br>
                <input type="text" onChange={(e) => setEmail(e.target.value)} />
                
                Password:<br></br>
                <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                />
                
                Name:<br />
                <input
                type="text"
                onChange={(e) => setName(e.target.value)}
                />
                <button onClick={() => supabaseSignUp()}>Create Account</button><br /><br />
                {/*<span id='sign-up'> <a href='/'>Back to Sign In</a></span>*/}
            </form>
            
          </div>
        </div>
    );
}

export default SignUp;
