import './App.css';
import { Stylesheet } from './components/Stylesheet'
import { useSession, useSessionContext } from '@supabase/auth-helpers-react';
import { supabase } from './supabaseClient';
import { TaskChores } from './components/TaskChores';
import { useState, useEffect } from 'react';
import { Groups } from './components/Groups';
import Dropdown from "./Dropdown";
import Navbar from "./Navbar"
import { Route, Routes } from "react-router-dom"
import Instructions from "./pages/HowToUse";

function App() {
  const [ groupsNames, setGroupNames] = useState([]);
  const [ groupName, setGroupName] = useState('');
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ choreName, setChoreName ] = useState('');
  const session = useSession(); // tokens, when session exists we have a user
  const { isLoading } = useSessionContext();
  const [ chores, setChoresList ] = useState([]);
  const [ choresLoaded, setChoresLoaded ] = useState('');


  async function supabaseSignUp() {
    console.log(email, password);
    const { errorSignUp } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    if(errorSignUp){
      alert("Error logging in with email with Supabase");
      console.log(errorSignUp);
    }
    const { error } = await supabase
      .from('Users')
      .insert({ Email: email })
    if(error){
      alert("Failed to add to database");
      console.log(error);
  } 
 
  }
  async function supabaseSignIn(){
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })
    if (error) {
      console.log(error);
    }
  }

  



  async function googleSignIn() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'https://www.googleapis.com/auth/tasks'
      }
    });
    if(error) {
      alert("Error logging in to Google provider with Supabase");
      console.log(error);
    }
  } 

  async function signOut() {
    await supabase.auth.signOut();
  }
  

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

  async function insertChores(){
    const {data , error} = await supabase.from('Chores')
    .insert([{Chore: choreName, Created: session.user.email}]);
    if(error){
      console.log(error);
    }else{
      console.log(data);
      fetchChores();
    }
  }

  async function fetchChores(){
    console.log("In fetchChores");
    const {data , error} = await supabase
    .from('Chores')
    .select('Chore')
    .eq('Created', session.user.email)

    if(error){
      console.log(error);
    }else{
      console.log(session.user.email)
      console.log(data);
      setChoresList(data);
      setChoresLoaded(true);
    }
  }


  
  if(choresLoaded !== true) {
    fetchChores();
  }

  if (isLoading) {
    return <></>
  }
  return (
    <div className="App">
      <Navbar />
      <div style={{ width: "400px", margin: "30px auto" }}>
        {session ? (
          <>
                  {/*<Navbar />*/}
            
            <h1>Incomplete Chores</h1>
            <div>
              {chores.map(todo => <div><b>Chore:</b> {todo.Chore}</div>)}
            </div>
            {session.provider_token ? <TaskChores/> : 
              <div>
                <div>
                  <br></br>
                  <input type="text" onChange={(e) => setChoreName(e.target.value )} />
                  <button className="btn btn-primary" onClick={() => insertChores()}>Add Task</button>
                </div>
                <button onClick={() => {googleSignIn()}}>Sign In With Google</button>
                <br></br>
                <button onClick={() => signOut()}>Sign Out</button>
              </div>
            }
            <input type= "text" onChange={(e) => setGroupName(e.target.value)}></input>
            <button onClick={() => createGroup()}> Create Group</button>

            <div>
              <h1>Your Groups</h1>
            <Groups /></div>
          </>
        ) : (
          <>  
            <Stylesheet />
            <form className='create-account'>
              <span className='header'>Create Account</span><br></br>
              Email:<br></br>
              <input type="text" onChange={(e) => setEmail(e.target.value)} />
              <br></br>
              Password:<br></br>
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <br></br>
              
            </form>
            <button onClick={() => supabaseSignUp()}>Create Account</button>
            <div className='page-break'></div>
            <form className='sign-in'>
              <span class='header'>Sign In</span><br></br>
              Email:<br></br>
              <input type="text" onChange={(e) => setEmail(e.target.value)} />
              <br></br>
              Password:<br></br>
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <br></br>
            </form>
            <button onClick={() => supabaseSignIn()}>Sign In</button>

            <br></br>
            <button className='button' onClick={() => googleSignIn()}>Sign In With Google</button>
          </>
        )}
      </div>
    </div>
  );
}
    


export default App;