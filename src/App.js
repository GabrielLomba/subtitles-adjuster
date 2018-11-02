import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            Simple app that adjusts subtitles timing in SRL files.
          </p>
        </header>
        <div className="App-content">
          <div className="App-input">
            <input type="file" />
            <textarea />
          </div>
          <div className="App-change">
            <label>Timing change applied</label>
            <input type="number" />
          </div>
          <div className="App-output">
            <input type="file" />
            <textarea />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
