import './App.css';
import './createChores.css'

//https://www.robinwieruch.de/react-add-item-to-list/

import React from "react"
import Dropdown from "./Dropdown";

//list that stores the initial chores list
const initialChores = [ 
  {
    name: "Test",
    date: "2023-02-20",
    completed: true,
    frequency: "Weekly",
  },
];

const App = () => {
  //constants
  const [chores, setChores] = React.useState(initialChores); //sets chores
  const [name, setName] = React.useState('') //sets name of chore
  const [date, setDate] = React.useState('') //sets date of chore
  const [frequency, setFrequency] = React.useState('') //sets frequency of chore
  const frequencyOptions = [
    {value: "daily", label: "Daily"},
    {value: "weekly", label: "Weekly"},
    {value: "monthly", label: "Monthly"},
  ]; //sets options for frequency dropdown


  //filtering chores list into two separate lists-- completed and incomplete
  const completedChores = chores.filter(item => item.completed === true);
  const incompleteChores = chores.filter(item => item.completed === false);

  function handleAdd () {
    //takes user input and adds it to the chores list
    const completed = false;
    const newList = chores.concat({ name, date, completed, frequency });
    setChores(newList);
    console.log(name, date, frequency)
  }

  return (
    <div className="createChores">
      <h1>Add Chores</h1>
      <p>
        Chore Name
        <input placeholder="Chore Name" value={name} onChange={e => setName(e.target.value)} />
        Last completed
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        <Dropdown placeHolder="Frequency?" options={frequencyOptions} onChange={(value) => setFrequency(value.value)} />
        <button onClick={handleAdd}>Add Chore</button>
      </p>
      <h1>To-Do</h1>
      <p>
        {incompleteChores.map((item) => (
          <li key="{item.name}">{item.name} {item.date}</li>
        ))}
      </p>
      <h1>Completed</h1>
      <p>
        {completedChores.map((item) => (
          <li key="{item.name}">{item.name} {item.date}</li>
        ))}
      </p>
    </div>
  );
}


export default App;
