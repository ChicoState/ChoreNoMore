import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { useSession } from '@supabase/auth-helpers-react';


export function Groups() {
    const [ groupsNames, setGroupNames] = useState([]);
    const [ groupName, setGroupName] = useState('');
    const session = useSession();

    async function addGroup(count){
      const { error } = await supabase
      .rpc('append_array', {new_element: count, email: session.user.email});
      if(error) {
        alert("Adding group ID to user table is not working");
        console.log(error);
      }
    }
    async function createGroup() {
      const { error } = await supabase
      .from('Groups')
      .insert({ Members: [session.user.email], Name: groupName, Editors: [session.user.email] })
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
        alert("Adding group ID to user table is not working")
        console.log(error)
      }
    }
    
    useEffect(() => {
        async function getGroupIds(){
          console.log("hello");
            const { data: groupIds } = await supabase
            .from('Users')
            .select('UserGroups', 'Email')
            .eq('Email', session.user.email);
            if(groupIds){
                console.log("HERE!")
              var jsonGroupIds = (JSON.stringify(groupIds, null, 2));
              console.log(jsonGroupIds);
              getGroupArrayofIds(jsonGroupIds);
            }
          }
        
          function getGroupArrayofIds(jsonGroupIds){
            const arrayGroupIds = JSON.parse(jsonGroupIds);
            var finalGroupIds = arrayGroupIds[0]; 
            console.log(finalGroupIds.UserGroups.length);
            for(let i = 0; i < finalGroupIds.UserGroups.length; i++){
              console.log(finalGroupIds.UserGroups[i]);
              getGroupName(finalGroupIds.UserGroups[i]);
            }
          }
        
          async function getGroupName(groupId){
            const { data } = await supabase
            .from("Groups")
            .select('Name', 'id')
            .eq('id', groupId);
            if(data){
              var name = data[0];
              console.log(name.Name);
              setGroupNames(current => [...current, name.Name]);
            }
          }
          getGroupIds();
        }, [session]);


    return (
        <div>
          <h1>Your Groups</h1>
          {groupsNames.map((element, index) => {
            return (
              <div key = {index}>
                  <h2>{element}</h2>
              </div>
            );
          })}
          <input type= "text" onChange={(e) => setGroupName(e.target.value)}></input>
          <button onClick={() => createGroup()}> Create Group</button>
        </div>
    )
  
}
