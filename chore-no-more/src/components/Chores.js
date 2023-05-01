import React from 'react';
import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useSession } from '@supabase/auth-helpers-react';
import { TaskChores } from './TaskChores';
import { GoogleSignIn } from './GoogleSignIn';
import { Chorecard } from './Chorecard';

export function Chores() {
    const [ chores, setChoresList ] = useState([]);
    const [ choreName, setChoreName ] = useState('');
    const [ choresLoaded, setChoresLoaded ] = useState('');
    const session = useSession();

    async function insertChores(){
        const {/*data ,*/ error} = await supabase.from('Chores')
        .insert([{Chore: choreName, Created: session.user.email}]);
        if(error){
          console.log(error);
        }else{
          //console.log(data);
          fetchChores();
        }
    }

    async function fetchChores(){
        //console.log("In fetchChores");
        const {data , error} = await supabase
        .from('Chores')
        .select()
        .eq('Created', session.user.email)

        if(error){
            console.log(error);
        }else{
            //console.log(session.user.email)
            //console.log(data);
            setChoresList(data);
            setChoresLoaded(true);
        }
    }
    
    if(choresLoaded !== true) {
        fetchChores();
    }

    return (
        <div>
            {session.provider_token ? <TaskChores/> : 
              <div>
                <div>
                    <h2>Add a new chore</h2>
                    <input type="text" onChange={(e) => setChoreName(e.target.value )} />
                    <button className="btn btn-primary" onClick={() => insertChores()}>Add Chore</button>
                </div>
                <GoogleSignIn />
              </div>
            }
            <h1>Incomplete Chores</h1>
            <div>
            {chores && (
        <div className="chores">
          {/* order-by buttons */}
          <div className="chore-grid">
            {chores.map(chore => ( 
              <Chorecard key={chore.id} chore={Chore} />
            ))}
          </div>
        </div>
      )}
            </div>
        </div>
    );
}