import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient';
import { useSession} from '@supabase/auth-helpers-react';


export function Groups() {
  const [groupsName, setGroupName] = useState();
  const [Group, setGroup] = useState('');
  const session = useSession();
  const [exist, setExist] = useState(false); // Initialize to false instead of null
  const [loading, setLoading] = useState(true); // Add loading state
  const [member, setMember] = useState('');
  const [groupId, setGroupId] = useState('');
  const [newName, setNewName] = useState(null);
  const [changedName, setChangedName] = useState(false);

  useEffect(() => {
    async function getGroupId() {
      const { data: groupId, error } = await supabase
        .from('Users')
        .select('Group')
        .eq('Email', session.user.email);
        var groupIdS = groupId[0].Group;
      if (groupIdS != null) {
        setGroupId(groupIdS);
        getGroupName(groupIdS);
        setExist(true);
      } else {
        setExist(false); // Set exist to false if there is an error
      }
      if (error) {
        alert("Failed to get group ID")
      }
      setLoading(false);
    }

    async function getGroupName(groupId) {
      const { data } = await supabase
        .from("Groups")
        .select('Name', 'id')
        .eq('id', groupId);
      if (data) {
        var name = data[0];
        setGroupName(name.Name);
      }
    }
    getGroupId();
  }, [session, exist, changedName]);

  async function createGroup() {
    const { error } = await supabase
      .from('Groups')
      .insert({ Members: [session.user.email], Name: Group, Editors: [session.user.email] });
    countGroup();
    if (error) {
      console.log(error);
    }
    else{
      setExist(true);
    }
  }

  async function countGroup() {
    const { error, count } = await supabase
      .from('Groups')
      .select('id', { count: 'exact', head: true })
    if (count) {
      addGroup(count)
    }
    //for new_element take the length of the id coloumn and use that as the key since it will be the last one created!
    if (error) {
      alert("COUNT GROUP Adding group ID to user table is not working")
      console.log(error)
    }
  }

  async function addMember(){
    const {error} = await supabase
    .from('Users')
    .update({Group: groupId})
    .eq('Email', member)
    if(error){
      console.log(error);
    }
    /*const {error2} = await supabase
    .from('Groups')
    */
  }

  async function addGroup(count) {
    const { error } = await supabase
      .from('Users')
      .update({ Group: count })
      .eq('Email', session.user.email)
    if (error) {
      alert("ADD GROUP Adding group ID to user table is not working");
      console.log(error);
    }
  }

  async function changeName(){
    if(newName != null){
      const{error} = await supabase
      .from('Groups')
      .update({Name : newName})
      .eq('id', groupId)
      if(error){
        console.log(error);
      }
      else{
        setChangedName(true);
      }
    }
  }

  async function leaveGroup(){
    const{error} = await supabase
    .from('Users')
    .update({Group : null})
    .eq('Email', session.user.email)
    if(error){
      console.log(error)
    }
    else{
      setExist(false);
    }

  }

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {exist ? (
            <div>
              <h2>Your Household</h2>
              <p><strong>{groupsName}</strong></p>
              <br></br>

              <h2>Add Member to household by email</h2>
              <input type="text" onChange={(e) => setMember(e.target.value)} />
              <button onClick={() => addMember()}>Add Member</button><br/>

              <h2>Change Household Name</h2>
              <input type="text" onChange={(e) => setNewName(e.target.value)} />
              <button onClick={() => changeName()}>Change</button><br/><br/>

              <button onClick={() => leaveGroup()}>Leave Group</button>
            </div>
          ) : (
            <div>
              <h1>Create Group</h1>
              <input type="text" onChange={(e) => setGroup(e.target.value)} />
              <button onClick={() => createGroup()}>Create</button>
            </div>
          )}
      </div>
    )}
  </div>
  );

}



