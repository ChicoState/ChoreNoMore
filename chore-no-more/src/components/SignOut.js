import { supabase } from '../supabaseClient';
import '../App.css';

export function SignOut() {
    async function signOut() {
        await supabase.auth.signOut();
    }

    return (
        <div>
            <button id='sign-out' onClick={() => signOut()}>Sign Out</button> <br></br>
        </div>
    );
}