import React, { Component } from 'react';

import './App.css';
import { processTimingChange } from './SrtFileService';

const MAX_TIMING_CHANGE = 10 * 60 * 60 * 1000;

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
      this.setState({ srtFileData: fileReader.result });
    }
    fileReader.onerror = error => {
      this.setState({ error });
    }

    fileReader.readAsText(file);
  }

  validateInput = () => {
    if (!this.state.srtFileData) {
      throw new Error("Please submit a SRT file before applying!");
    }

    if (!this.state.timingChange) {
      throw new Error("Please specify a timing change before applying!");
    }

    if (this.state.timingChange > MAX_TIMING_CHANGE) {
      throw new Error(`Please specify a timing change less than or equal to ${MAX_TIMING_CHANGE}!`);
    }
  }

  processDataIfValid = () => {
    try {
      this.validateInput();
      processTimingChange(this.state.srtFileData, this.state.timingChange);
    } catch (err) {
      this.setState({ error: err.message });
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
            <label>Timing change applied in ms</label>
            <input type="number" max={MAX_TIMING_CHANGE} onChange={ev => this.setState({ timingChange: Number(ev.target.value) })} />
            <button onClick={this.processDataIfValid}>Apply!</button>

            {error ? <p className="App-error">{error}</p> : null}
          </div>

        </div>
      </div>
    );
  }
}

export default App;
