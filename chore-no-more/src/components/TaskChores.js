import React, { Component } from 'react';
import { supabase } from '../supabaseClient';
import Dropdown from "../Dropdown";

export class TaskChores extends Component {
  constructor(props) {
      super(props);
      this.state = {
        title: "",
        due: undefined,
        frequency: undefined,
        todos: undefined,
        taskList: undefined,
        token: undefined,
        chores: [],
        supabaseEmail: ""
      };
  }

  getAuthToken() {
    supabase.auth.getSession()
    .then(value => {
      this.setState({
        supabaseEmail: value.data.session.user.email
      })
    });
    supabase.auth.getSession()
    .then(value => {
        let token = value.data.session.provider_token; //getting provider token
        console.log(value);
        this.setState({
          token: token
        });
    });
  }

  addToDo() {
    if (this.state.token !== undefined){
      var task = {
        "title": this.state.title,
        "due": this.state.due + "T00:00:00.000Z",
      }
      fetch(`https://tasks.googleapis.com/tasks/v1/lists/${ this.state.taskList }/tasks`, {
        method: "POST",
        headers: {
          'Authorization':'Bearer ' + this.state.token // Access token for google
        },
        body: JSON.stringify(task)
      }).then(response => { //getting array of tasks
        let respObj = response.json();
        respObj
        .then(task => {
          console.log(task)
          let todos = this.state.todos;
          todos.push(task);

          this.setState({
            todos: todos
          });
        })
      });
      this.insertChores();
    }
  }
  
  loadToDo() {
    if (this.state.todos === undefined) {
      if (this.state.token === undefined) {
        this.getAuthToken();
        //this.fetchChores();
      }
      fetch("https://tasks.googleapis.com/tasks/v1/users/@me/lists", { //getting tasks list
        method: "GET",
        headers: {
          'Authorization':'Bearer ' + this.state.token //Access token for google
        }
      }).then((response) => { 
        let respObj = response.json();
        respObj
        .then(data => {
          let taskList = data.items.find(taskList => taskList.title === "Chores").id; //finding task list id
          console.log(taskList)
          fetch(`https://tasks.googleapis.com/tasks/v1/lists/${ taskList }/tasks`, { //getting tasks list
            method: "GET",
            headers: {
              'Authorization':'Bearer ' + this.state.token //Access token for google
            }
          }).then(list => { //getting array of tasks
            let listObj = list.json();
            listObj
            .then(tasks => {
              console.log(tasks)
              this.setState({
                todos: tasks.items,
                taskList: taskList
              });
            })
          });
        })
      });
    }
  }

  insertChores(){
    console.log("In insert chores");
    const {data , error} = supabase.from('Chores')
    .insert([{Chore: this.state.title, Created: this.supabaseEmail}]);
    if(error){
      console.log("Error:" + error);
    }else{
      console.log("Data: " + data);
      this.fetchChores();
    }
  }


  renderGoogleTasks() {
    let loading = <p><em>Loading...</em></p>;
    let todosContent = undefined;
    if (this.state.taskList === undefined) {
      this.loadToDo();
      todosContent = loading;
    } else {
      todosContent = <div><h1>Incomplete Tasks</h1>{this.state.todos.map(todo => <div><b>Chore:</b> {todo.title} - <b>Due:</b> {todo.due}</div>)}</div>
    }

    return (
      <div>
        {todosContent}
      </div>
    );
  }

  render() {
    const frequencyOptions = [
      {value: "daily", label: "Daily"},
      {value: "weekly", label: "Weekly"},
      {value: "monthly", label: "Monthly"},
    ];

    let loading = <p><em>Loading...</em></p>;
    this.renderGoogleTasks();
    let todosContent = supabase === undefined
      ? loading
      : this.renderGoogleTasks();

    return (
      <div>
        <input type="text" className="form-control" placeholder="Title" value={this.state.title} onChange={(e) => this.setState({ title: e.target.value })} />
        <input type="date" value={this.state.due} onChange={(e) => this.setState({ due: e.target.value })} />
        <Dropdown placeHolder="Frequency?" options={frequencyOptions} onChange={(e) => this.setState({ frequency: e.value })} />
        <button className="btn btn-primary" onClick={this.addToDo.bind(this)}>Add Task</button>
        {todosContent}
      </div>
    );
  }
}