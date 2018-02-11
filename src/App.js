import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    const user1 = {
      'firstName': 'little',
      'lastName': 'sister'
    }
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Hello, {user1.firstName + ' ' + user1.lastName}</h1>
        </header>
      </div>
    );
  }
}

export default App;
