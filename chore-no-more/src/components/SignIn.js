import React from 'react';
import { supabase } from '../supabaseClient';
import { useState } from 'react';

export function SignIn() {
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
            Name:<br></br>
            <input
            type="text"
            onChange={(e) => setName(e.target.value)}
            />
            <br></br>
            
        </form>
        <button id='create-account-button' onClick={() => supabaseSignUp()}>Create Account</button>
        <div className='page-break'></div>
        <form className='sign-in'>
            <span class='header'>Sign In</span><br></br>
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
        <button id='sign-in-button' onClick={() => supabaseSignIn()}>Sign In</button>
    </div>
    );
}