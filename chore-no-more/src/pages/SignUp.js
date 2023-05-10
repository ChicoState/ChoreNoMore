import React from 'react';
import '../App.css';
import { useState } from 'react';
import { supabase } from '../supabaseClient';

function SignUp() {
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');

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
          .insert({ Email: email })
        if(error){
          alert("Failed to add to database");
          console.log(error);
        } 
     
      }

    return (
        <div>
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
                <br /><br />
                <button id='create-account-button' onClick={() => supabaseSignUp()}>Create Account</button>
            </form>
            
        </div>
    );
}

export default SignUp;