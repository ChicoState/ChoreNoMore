import React, { Component } from 'react';
import { supabase } from '../supabaseClient';

export class TaskChores extends Component {
    constructor(props) {
        super(props);
        this.state = {
          message: "",
          title: "",
          description: "",
          due: new Date(),
          todos: undefined,
          taskList: undefined,
          isSignedIn: false
        };
    }

    componentDidMount() {
        const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest';
        const SCOPES = 'https://www.googleapis.com/auth/tasks.readonly';
    }

    
    loadToDo() {

    }

    renderGoogleTasks() {
        return (
            <div>
                <h1>Incomplete</h1>
                {this.state.todos.map(todo => <div>
                <b>Chore:</b> {todo.title} <b>Due:</b> {todo.due.toLocaleString('en-GB', { timeZone: 'UTC' })}
                </div>)}
            </div>
        );
    }

    render() {
        let loading = <p><em>Loading...</em></p>;
        let todosContent = this.state.session === undefined
          ? loading
          : this.renderGoogleTasks();
    
    
        return (
          <div>
            <h1>To Dos</h1>
            {todosContent}
          </div>
        );
      }
}