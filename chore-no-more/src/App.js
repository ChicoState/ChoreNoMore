import './App.css';
import { useSession, useSupabaseClient, useSessionContext } from '@supabase/auth-helpers-react';
import DateTimePicker from 'react-datetime-picker';
import { useState } from 'react';
import Dropdown from "./Dropdown";
import { createClient} from '@supabase/supabase-js';
import {SessionContextProvider} from '@supabase/auth-helpers-react';

const supabase = createClient(
  "https://wqamrjqdnsnboscermtz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxYW1yanFkbnNuYm9zY2VybXR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzc2MDU0MjQsImV4cCI6MTk5MzE4MTQyNH0.pI8ucJfxK3Qgx1oGoZRXfYpzIjoxwY2_BqXH0qls7jA"
);

const initialChores = [ 
  {
    eventName: "Test",
    start: "2023-02-20",
    completed: true,
    eventDescription: "Big event!"
  },
];

function App() {
  const [ groupName, setGroupName] = useState('');
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ chores, setChores] = useState(initialChores);
  const [ start, setStart ] = useState(new Date());
  const [ end, setEnd ] = useState(new Date());
  const [ completed, setCompleted ] = useState(false);
  const [ eventName, setEventName ] = useState("");
  const [ eventDescription, setEventDescription ] = useState("");
  const session = useSession(); // tokens, when session exists we have a user
  const supabase = useSupabaseClient(); // talk to supabase!
  const { isLoading } = useSessionContext();
  const [frequency, setFrequency] = useState('');
  const frequencyOptions = [
    {value: "daily", label: "Daily"},
    {value: "weekly", label: "Weekly"},
    {value: "monthly", label: "Monthly"},
  ];
  var done = false;

  
  const completedChores = chores.filter(item => item.completed === true);
  const incompleteChores = chores.filter(item => item.completed === false);

  async function supabaseSignUp() {
    console.log(email, password);
    const { errorSignUp } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    if(errorSignUp){
      alert("Error signing up with email with Supabase");
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
  }

  async function googleSignIn() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'https://www.googleapis.com/auth/calendar'
      }
    });
    if(error) {
      alert("Error logging in to Google provider with Supabase");
      console.log(error);
    }
  } 
  async function runOnce(){
    if(!done){
      done = true; 
      googleAddEmail();
    }
  }
  async function googleAddEmail() {
    const { error } = await supabase
      .from('Users')
      .insert({ Email: session.user.email });
    if(error){
      //alert("Failed to add to database");
      console.log(error);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
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
  async function addGroup(count){
    const { error } = await supabase
    .rpc('append_array', {new_element: count, email: session.user.email})
    console.log(session.user.email);
  }

  
  if(isLoading) {
    return <></>
  }

  async function createCalendarEvent() {
    console.log("Creating calendar event");
    const newList = chores.concat({ eventName, start, completed, eventDescription, frequency });
    setChores(newList);
    const event = {
      //look here for details on the api and its parameters. This is how you add to features that google calendar has.
      //Such as adding more attendees.
      //https://developers.google.com/calendar/api/v3/reference/events/insert
      'summary': eventName,
      'description': eventDescription,
      'start': {
        'dateTime': start.toISOString(), // Date.toISOString() ->
        'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone // America/Los_Angeles
      },
      'end': {
        'dateTime': end.toISOString(), // Date.toISOString() ->
        'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone // America/Los_Angeles
      }
    }
    await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
      method: "POST",
      headers: {
        'Authorization':'Bearer ' + session.provider_token // Access token for google
      },
      body: JSON.stringify(event)
    }).then((data) => {
      return data.json();
    }).then((data) => {
      console.log(data);
      alert("Event created, check your Google Calendar!");
    });
  }
  const handleChange = (event) => {
    setCompleted(event.target.checked);
  }
  console.log(session);
  //console.log(start);
  //console.log(eventName);
  //console.log(eventDescription);
  //console.log(completed);
  return (
    <div className="App">
      <div style={{width: "400px", margin: "30px auto"}}>
        {session ?
          <>
            <body onload = {runOnce()}></body>
            <h2>Hey there {session.user.email}</h2>
            <p>Start of your event</p>
            <DateTimePicker onChange={setStart} value={start} />
            <p>End of your event</p>
            <DateTimePicker onChange={setEnd} value={end} />
            <p>Event name</p>
            <input type="text" onChange={(e) => setEventName(e.target.value)} />
            <p>Event description</p>
            <input type="text" onChange={(e) => setEventDescription(e.target.value)} />
            <p>
            <Dropdown placeHolder="Frequency?" options={frequencyOptions} onChange={(value) => setFrequency(value.value)} />
            </p>
            <p>
            <input
            type="checkbox"
            name="completed"
            onChange={handleChange}
            />
            <label htmlFor="completed"> Completed? </label>
            </p>
            <hr />
            <button onClick={() => createCalendarEvent()}>Create Calendar Event</button>
            <p></p>
            <button onClick={() => signOut()}>Sign Out</button>
            <br></br>
            <input type= "text" onChange={(e) => setGroupName(e.target.value)}></input>
            <button onClick={() => createGroup()}> Create Group</button>
            <h1>To-Do</h1>
      <p>
        {incompleteChores.map((item) => (
          <li key="{item.eventName}">{item.eventName}</li>
        ))}
      </p>
      <h1>Completed</h1>
      <p>
        {completedChores.map((item) => (
          <li key="{item.eventName}">{item.eventName}</li>
        ))}
      </p>
          </>
          :
          <>
          <form> Create Account <br></br>
            Email:<br></br>
            <input type="text" onChange={(e) => setEmail(e.target.value)} /><br></br>
            Password:<br></br>
            <input type="password" onChange={(e) => setPassword(e.target.value)} /><br></br>
            <button onClick={() => supabaseSignUp()}>Create Account</button>
          </form>
          <form> Sign In <br></br>
          Email:<br></br>
          <input type="text" onChange={(e) => setEmail(e.target.value)} /><br></br>
          Password:<br></br>
          <input type="password" onChange={(e) => setPassword(e.target.value)} /><br></br>
          <button onClick={() => supabaseSignIn()}>Sign In</button>
          </form><br></br>
          <button onClick={() => googleSignIn()}>Sign In With Google</button>
          </>

       

        }
      </div>

    </div>
  );
}
    


export default App;
