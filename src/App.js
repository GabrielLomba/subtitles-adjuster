import React, { Component } from 'react';

import './App.css';
import { processTimingChange } from './SrtFileService';

class App extends Component {

  constructor() {
    super();
    this.state = {
      srtFileData: null,
      timingChange: 0,
      error: ''
    }
  }

  handleChosenFile = (file) => {
    this.setState({ error: null });

    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      this.setState({ srlFileData: fileReader.result });
    }
    fileReader.onerror = error => {
      this.setState({ error });
    }

    fileReader.readAsText(file);
  }

  processDataIfValid = () => {
    if (this.state.srtFileData) {
      processTimingChange(this.state.srtFileData, this.state.timingChange);
    } else {
      this.setState({ error: "Please submit a SRT file before applying!" });
    }
  }

  render() {
    const { error } = this.state;

    return (
      <div className="App">
        <header>
          <p>
            Simple app that adjusts subtitles timing in SRT files.
          </p>
        </header>
        <div className="App-content">

          <div className="App-input">
            <label>Select the SRL file:</label>
            <input type="file" accept=".srt" onChange={ev => this.handleChosenFile(ev.target.files[0])} />
          </div>

          <div className="App-change">
            <label>Timing change applied</label>
            <input type="number" onChange={value => this.setState({ timingChange: value })} />
            <button onClick={this.processDataIfValid}>Apply!</button>

            {error ? <p className="App-error">{error}</p> : null}
          </div>

        </div>
      </div>
    );
  }
}

export default App;
