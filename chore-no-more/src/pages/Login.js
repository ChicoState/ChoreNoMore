import React from 'react';
import { useSession, useSessionContext } from '@supabase/auth-helpers-react';
import { Groups } from '../components/Groups';
import { SignIn } from '../components/SignIn';
import { Chores } from '../components/Chores';
import { Stylesheet } from '../components/Stylesheet'
import Navbar from '../Navbar'
import { GoogleSignIn } from '../components/GoogleSignIn';
import SignUp from '../components/SignUp';

function Login(){
    
    const { isLoading } = useSessionContext();
    const session = useSession();

    if (isLoading) {
        return <>Loading...</>
    }

    return (
        <div className='App'>
            <Navbar />
            <div style={{ width: "400px", margin: "30px auto" }}>
            {session ? (
                <>
                <Stylesheet />
                <Chores />
                <Groups />
                </>
            ) : (
                <>
                <SignIn />
                <SignUp />
                <GoogleSignIn />
                </>
            )}
            </div>
        </div>
    );
}

export default Login;
