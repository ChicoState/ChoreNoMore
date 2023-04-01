import './App.css';
import { useSession, useSupabaseClient, useSessionContext } from '@supabase/auth-helpers-react';
import DateTimePicker from 'react-datetime-picker';
import { useState } from 'react';
import Dropdown from "./Dropdown";
const initialChores = [ 
  {
    eventName: "Test",
    start: "2023-02-20",
    completed: true,
    eventDescription: "Big event!"
  },
];

function App() {
  const [ chores, setChores] = useState(initialChores);
  const [ start, setStart ] = useState(new Date());
  const [ end, setEnd ] = useState(new Date());
  const [ completed, setCompleted ] = useState(false);
  const [ eventName, setEventName ] = useState("");
  const [ eventDescription, setEventDescription ] = useState("");
  const session = useSession(); // tokens, when session exists we have a user
  const supabase = useSupabaseClient(); // talk to supabase!
  const { isLoading } = useSessionContext();
  const [frequency, setFrequency] = useState('')
  const frequencyOptions = [
    {value: "daily", label: "Daily"},
    {value: "weekly", label: "Weekly"},
    {value: "monthly", label: "Monthly"},
  ];

  const completedChores = chores.filter(item => item.completed === true);
  const incompleteChores = chores.filter(item => item.completed === false);

  
  if(isLoading) {
    return <></>
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

  async function insertChores(){
    const {data , error} = await supabase.from('Chores')
    .insert([{id: 1, Chore: eventName, Created: session.user.email}]);
    if(error){
      console.log(error);
    }else{
      console.log(data);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
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
    await insertChores();
  }
  const handleChange = (event) => {
    setCompleted(event.target.checked);
  }
  console.log(session);
  console.log(start);
  console.log(eventName);
  console.log(eventDescription);
  console.log(completed);
  return (
    <div className="App">
      <div style={{width: "400px", margin: "30px auto"}}>
        {session ?
          <>
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
          </>
          :
          <>
            <button onClick={() => googleSignIn()}>Sign In With Google</button>
          </>
        }
      </div>
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
    </div>
  );
}

export default App;