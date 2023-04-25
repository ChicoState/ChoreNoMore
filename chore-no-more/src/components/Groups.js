import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient';
import { useSession} from '@supabase/auth-helpers-react';


export function Groups() {
  const [groupsName, setGroupName] = useState();
  const [Group, setGroup] = useState('');
  const session = useSession();
  const [exist, setExist] = useState(false); // Initialize to false instead of null
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    async function getGroupId() {
      console.log(session.user.email);
      const { data: groupId, error } = await supabase
        .from('Users')
        .select('Group')
        .eq('Email', session.user.email);
        var groupIdS = groupId[0].Group;
      if (groupIdS != null) {
        console.log(groupIdS);
        getGroupName(groupIdS);
        setExist(true);
        console.log(exist);
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
        console.log(name.Name);
        setGroupName(name.Name);
      }
    }
    getGroupId();
  }, [session, exist]);

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
      console.log(count)
      addGroup(count)
    }
    //for new_element take the length of the id coloumn and use that as the key since it will be the last one created!
    if (error) {
      alert("COUNT GROUP Adding group ID to user table is not working")
      console.log(error)
    }
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
    console.log(exist);
  }

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {exist ? (
            <div>{groupsName}</div>
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
