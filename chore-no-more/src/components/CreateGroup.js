import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient';
import { useSession, useSessionContext } from '@supabase/auth-helpers-react';

export function CreateGroup() {
    const [ Group, setGroup ] = useState('');
    const session = useSession();
        async function createGroup() {
            const { error } = await supabase
            .from('Groups')
            .insert({ Members: [session.user.email], Name: Group, Editors: [session.user.email] })
            countGroup();
            if(error){
            console.log(error);
            }
        }
        async function countGroup(){
            const { error, count } = await supabase
            .from('Groups')
            .select('id', {count: 'exact', head: true})
            if(count){
              console.log(count)
              addGroup(count)
            }
            //for new_element take the length of the id coloumn and use that as the key since it will be the last one created!
            if(error) {
              alert("COUNT GROUP Adding group ID to user table is not working")
              console.log(error)
            }
          }
          async function addGroup(count){
            const { error } = await supabase
            .from('Users')
            .update({Group: count})
            .eq('Email', session.user.email)
            if(error) {
              alert("ADD GROUP Adding group ID to user table is not working");
              console.log(error);
            }
          }
    return (
        <div>
            <h1>Create Group</h1>
            <input type="text" onChange={(e) => setGroup(e.target.value )} />
            <button onClick={() => createGroup()}>Create Group</button>
        </div>
    );
}
