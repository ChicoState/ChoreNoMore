import React, { useEffect } from 'react';
import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useSession } from '@supabase/auth-helpers-react';
import { TaskChores } from './TaskChores';
import { GoogleSignIn } from './GoogleSignIn';
import Chorecard from './Chorecard';
import Popup from './Popup';

export function Chores({groupId}) {
    const [ chores, setChoresList ] = useState([]);
    const [ choreName, setChoreName ] = useState('');
    const [ choresLoaded, setChoresLoaded ] = useState('');
    const [ addedChores, setAddedChores ] = useState(false);
    const session = useSession();
    const [ claimed, setClaimed ] = useState(false);
    const [ deleted, setDeleted ] = useState(false);
    const [buttonPopup, setButtonPopup] = useState(false);
    const [username, setUserName] = useState();

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

      async function getUsersName(){
        const { data } = await supabase
        .from('Users')
        .select('Name')
        .eq('Email', session.user.email);
        if(data){
          var name = data[0];
          setUserName(name.Name);
         // console.log(username)
        }
      }

      getUsersName();
    
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
    setClaimed(true)
  }

      return (
        <div>
            {session.provider_token ? <TaskChores/> : 
              <div>
                {groupId ? 
                <>
                <div class='chores-display'>
                  <div class='header'>
                      <h2>Chores</h2>
                  </div>
                  {chores && (
                    <div className="chores">
                      {/* order-by buttons */}
                      <div className="body">
                      {chores.map(chore => (
                        <Chorecard key={chore.id} chore={chore} onDelete={handleDelete} onClaim={handleClaim} name = {username}/>
                      ))}
                      </div>
                    </div>
                  )}
                  <div class='footer'>
                    <button id='addChore' onClick={() => setButtonPopup(true)}>Add Chores</button>
                      <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
                        <h2>Add a new chore</h2><br />
                        <input type="text" onChange={(e) => setChoreName(e.target.value )} />
                        <button onClick={
                          () => {
                              insertChores()
                              setButtonPopup(false)
                            }}>Add Chore</button>
                      </Popup>                
                  </div>
                </div></>:<p></p>}
              </div>
            }
            
        </div>
      );
}
