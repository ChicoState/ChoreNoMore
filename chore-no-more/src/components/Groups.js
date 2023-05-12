import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient';
import { useSession} from '@supabase/auth-helpers-react';
import { Chores } from './Chores';
import AddPopup from './AddPopup';
import LeavePopup from './LeavePopup';
import ChangePopup from './ChangePopup';


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
  const [nameList, setNameList] = useState([]);
  const [addPopup, setAddPopup] = useState(false);
  const [leavePopup, setLeavePopup] = useState(false);
  const [changePopup, setChangePopup] = useState(false);
  const [addedMember, setAddedMemeber] = useState(false);

 
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

    async function displayMembers(){
      const {error, data} = await supabase
      .from("Users")
      .select('Name')
      .eq('Group', groupId)
      if(error){
        console.log(error)
      }
      if(data){
        //console.log(data)
        setNameList(data)
      }
    }

    setChangedName(false); 
    setAddedMemeber(false);
    getGroupId();
    displayMembers();
  }, [session, exist, changedName, groupId, addedMember]);


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
      setGroupId(count);
    }
    //for new_element take the length of the id coloumn and use that as the key since it will be the last one created!
    if (error) {
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
    } else {
      setAddedMemeber(true);
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
      setGroupId(null);
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
              <Chores groupId = {groupId} />

              
              <div class='users-display'>
                <div class='header'>
                  <p><strong>Your Household: {groupsName}</strong></p>
                  <h2>Members</h2><div />
                </div>
                <div className='body2'>
                  <br />
                  
                    {nameList.map(todo => <div>{todo.Name}</div>)}
                  
                </div>
                <div class='footer'>
                  <button id='addMember' onClick={() => setAddPopup(true)}>Add Member</button>
                  <AddPopup trigger={addPopup} setTrigger={setAddPopup}>
                    <h2>Add a new member</h2><br />
                    <input type="text" onChange={(e) => setMember(e.target.value)} />
                    <div class='divider' />
                    <button onClick={
                      () => {
                          addMember()
                          setAddPopup(false)
                        }}>Add Member</button>
                  </AddPopup>
                  <div class='divider' />
                  <button id='leaveGroup' onClick={() => setLeavePopup(true)}>Leave Group</button>
                  <LeavePopup trigger={leavePopup} setTrigger={setLeavePopup}>
                    <h2>Are you sure you want to leave this group?</h2><br />
                    <button onClick={
                      () => {
                          leaveGroup()
                          setLeavePopup(false)
                        }}>Yes</button>
                    <div class='divider' />
                    <button onClick={
                      () => {
                          setLeavePopup(false)
                        }}>No</button>
                  </LeavePopup>
                  <div class='divider' />
                  <button onClick={() => setChangePopup(true)}>Change Household Name</button><br/>
                  <ChangePopup trigger={changePopup} setTrigger={setChangePopup}>
                    <h2>Enter New Household Name</h2><br />
                    <input type="text" onChange={(e) => setNewName(e.target.value)} />
                    <div class='divider' />
                    <button onClick={
                      () => {
                          changeName()
                          setChangePopup(false)
                        }}>Change</button>
                  </ChangePopup>
                </div>
                
              </div>
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