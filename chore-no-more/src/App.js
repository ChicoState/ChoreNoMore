import './App.css';

//https://www.robinwieruch.de/react-add-item-to-list/

import React from "react"

const initialChores = [
  {
    name: "Test",
    date: "2023-02-20",
    completed: true,
    frequency: "Weekly",
  },
];

const App = () => {
  const [chores, setChores] = React.useState(initialChores);
  const [name, setName] = React.useState('')
  const [date, setDate] = React.useState('')
  const [frequency, setFrequency] = React.useState('')
  const completedChores = chores.filter(item => item.completed === true);
  const incompleteChores = chores.filter(item => item.completed === false);

  function handleAdd () {
      const newChore = {
        name,
        date,
        completed: false,
        frequency,
      };
      const newList = [...chores, newChore];
      setChores(newList);
      console.log(name, date, frequency, newChore.completed);
  }

  function handleComplete(index) {
    const updatedChores = [...chores];
    updatedChores[index].completed = true;
    setChores(updatedChores);
    console.log(name, date, frequency, updatedChores[index].completed);
  }

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
