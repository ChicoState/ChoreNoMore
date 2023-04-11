import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { useSession, useSessionContext } from '@supabase/auth-helpers-react';


export function Groups({}) {
    const [ groupsNames, setGroupNames] = useState([]);
    const session = useSession();
    useEffect(() => {
        async function getGroupIds(){
          console.log("hello");
            const { data: groupIds, error } = await supabase
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
            const {error, data} = await supabase
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
        <div>{groupsNames.map((element, index) => {
            return (
              <div key = {index}>
                  <h2>{element}</h2>
              </div>
            );
            })}
          </div>
    )
  
}
