import React from 'react';
import { supabase } from '../supabaseClient';

export function GoogleSignIn() {
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


    return (
        <div>
        <button className='gsign-in' onClick={() => googleSignIn()}>Sign In With Google</button>
    </div>
    );
}