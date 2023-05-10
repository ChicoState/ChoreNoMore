import React, { useEffect } from 'react';
import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useSession } from '@supabase/auth-helpers-react';
import { TaskChores } from './TaskChores';
import { GoogleSignIn } from './GoogleSignIn';
import Chorecard from './Chorecard';

export function Chores({groupId}) {
    const [ chores, setChoresList ] = useState([]);
    const [ choreName, setChoreName ] = useState('');
    const [ choresLoaded, setChoresLoaded ] = useState('');
    const [ addedChores, setAddedChores ] = useState(false);
    const session = useSession();
    const [ claimed, setClaimed ] = useState(false);
    const [ deleted, setDeleted ] = useState(false);
    useEffect(() => {

      async function fetchChores(){
          //console.log("In fetchChores");
          const {data , error} = await supabase
          .from('Chores')
          .select()
          .eq('Group', groupId)

          if(error){
            console.log(error);
          }else{
            //console.log(session.user.email)
            //console.log(data);
            setChoresList(data);
            setChoresLoaded(true);
          }
      }
    
      fetchChores();
      setAddedChores(false);
      setClaimed(false);
    }, [addedChores, groupId, choresLoaded, claimed, deleted]);

    async function insertChores(){
      const {/*data ,*/ error} = await supabase.from('Chores')
      .insert([{Chore: choreName, Created: session.user.email, Group: groupId}]);
      if(error){
        console.log(error);
      }else{
        //console.log(data);
        //fetchChores();
        //console.log(addedChores)
        setAddedChores(true);
        //console.log(addedChores)
      }
  }
  async function claimChore(chore){
    //console.log(chore);
    const{error} = await supabase
    .from('Chores')
    .update({Assignee : session.user.email})
    .eq('id', chore)
    if(error){
      console.log(error)
    }
    setClaimed(true);
  }

  async function deleteChore(chore){
    const { data, error } = await supabase
      .from('Chores')
      .delete()
      .eq('id', chore)
    
    if (error) {
      console.log(error)
    }
    if (data) {
      console.log(data)
    }
    setDeleted(true);
  }

  const handleDelete = (id) => {
    setChoresList(prevChores => {
      return prevChores.filter(ch => ch.id !== id)
    })
  }

  const handleClaim = (id) => {
    setDeleted(true)
  }

      return (
        <div>
            {session.provider_token ? <TaskChores/> : 
              <div>
                {groupId ?
                <div>
                    <h2>Add a new chore</h2>
                    <input type="text" onChange={(e) => setChoreName(e.target.value )} />
                    <button className="btn btn-primary" onClick={() => insertChores()}>Add Chore</button>
                </div>:<p></p>}
                <GoogleSignIn />
              </div>
            }
            
            
            {groupId ? 
            <><h1>Incomplete Chores</h1><div>
                         {chores && (
        <div className="chores">
          {/* order-by buttons */}
          <div className="chore-grid">
            {chores.map(chore => (
              <Chorecard key={chore.id} chore={chore} onDelete={handleDelete} onClaim={handleClaim}/>
            ))}
          </div>
        </div>
      )}
            </div></>:<p></p>}
            
        </div>
      );
}