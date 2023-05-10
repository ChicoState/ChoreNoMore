import React from 'react';
import { supabase } from '../supabaseClient';
import { useState } from 'react';
import '../App.css';

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
            <span> <b>Create Account</b></span><br></br>
            Email:
            <input type="text" onChange={(e) => setEmail(e.target.value)} />
           
            Password:<br></br>
            <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            />
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
            <span> <b>Sign In</b></span><br></br><br /><br />
            Email:<br></br>
            <input type="text" onChange={(e) => setEmail(e.target.value)} />
            
            Password:
            <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            />
        </form>
        <button id='sign-in-button' onClick={() => supabaseSignIn()}>Sign In</button>
    </div>
    );
}