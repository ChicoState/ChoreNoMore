import React from 'react';
import { supabase } from '../supabaseClient';

export function SignOut() {
    async function signOut() {
        await supabase.auth.signOut();
    }

    return (
        <div>
            <button className='signOut'onClick={() => signOut()}>Sign Out</button> <br></br>
        </div>
    );
}