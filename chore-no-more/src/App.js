import React, { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';
import './App.css';

const supabaseUrl = "https://wqamrjqdnsnboscermtz.supabase.co";
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxYW1yanFkbnNuYm9zY2VybXR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzc2MDU0MjQsImV4cCI6MTk5MzE4MTQyNH0.pI8ucJfxK3Qgx1oGoZRXfYpzIjoxwY2_BqXH0qls7jA';
const supabase = createClient(supabaseUrl, supabaseKey);

const App = () => {
  const [chores, setChores] = useState([]);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [frequency, setFrequency] = useState('');

  useEffect(() => {
    supabase
      .from('chores')
      .select('*')
      .then(({ data: chores, error }) => {
        if (error) {
          console.log(error);
        } else {
          setChores(chores);
        }
      })
      .catch(error => console.error(error));
  }, []);

  function handleAdd() {
    const newChore = {
      name,
      date,
      completed: false,
      frequency,
    };
    supabase
      .from('chores')
      .insert([newChore])
      .then(({ data: chores, error }) => {
        if (error) {
          console.log(error);
        } else {
          setChores([...chores, newChore]);
        }
      })
      .catch(error => console.error(error));
  }

  function handleComplete(index) {
    const updatedChores = [...chores];
    const chore = updatedChores[index];
    chore.completed = true;
    supabase
      .from('chores')
      .update({ completed: true })
      .match({ id: chore.id })
      .then(() => {
        setChores(updatedChores);
      })
      .catch(error => console.error(error));
  }

  const completedChores = chores.filter(item => item.completed === true);
  const incompleteChores = chores.filter(item => item.completed === false);

  return (
    <div className="App">
      <h1>Add Chores</h1>
      <p>
      <input placeholder="Chore Name" value={name} onChange={e => setName(e.target.value)} />
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        <input placeholder="Weekly, Daily, Monthly?" value={frequency} onChange={e => setFrequency(e.target.value)} />
        <button onClick={handleAdd}>Add Chore</button>
      </p>
      <h1>To-Do</h1>
      <p>
      {incompleteChores.map((item, index) => (
          <li key={index}>
            <label>
            {item.name} {item.date}
              <input type="checkbox" checked={item.completed} onChange={() => handleComplete(index)} />
            </label>
          </li>
        ))}
      </p>
      <h1>Completed</h1>
      <p>
        {completedChores.map((item) => (
          <li>{item.name} {item.date}</li>
        ))}
      </p>
    </div>
  );
}


export default App;
