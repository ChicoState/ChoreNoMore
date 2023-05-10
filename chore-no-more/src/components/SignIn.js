import React from 'react';
import { supabase } from '../supabaseClient';
import { useState } from 'react';

export function SignIn() {
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');

      async function supabaseSignIn(){
        const { error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        })
        if (error) {
          console.log(error);
        }
      }

    return ( 
        <div>
          <form className='sign-in'>
              <span > <b>Log In</b> </span><br/><br />
              Email Address:<br></br>
              <input type="text" onChange={(e) => setEmail(e.target.value)} />
              <br></br>
              Password:<br></br>
              <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              />
              <br /><br />
              <button onClick={() => supabaseSignIn()}>Sign In</button><br /><br />
              <span id='sign-up'>Don't have an account? <a href='/sign-up'>Sign Up!</a></span>
          </form>
          
      </div>
    );
}

/*

<form className='create-account'>
            <span className='header'>Create Account</span><br></br>
            Email:<br></br>
            <input type="text" onChange={(e) => setEmail(e.target.value)} />
            <br></br>
            Password:<br></br>
            <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            />
            <br></br>
            
        </form>
<button id='create-account-button' onClick={() => supabaseSignUp()}>Create Account</button>
*/

