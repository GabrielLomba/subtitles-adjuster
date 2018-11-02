import React, { Component } from 'react';

import Download from '@axetroy/react-download';

import './App.css';
import { processTimingChange } from './SrtFileService';

const MAX_TIMING_CHANGE = 10 * 60 * 60 * 1000;

class App extends Component {

  constructor() {
    super();
    this.state = {
      srtFileName: null,
      srtFileData: null,
      strProcessedData: null,
      timingChange: 0,
      error: ''
    }
  }

  resetGeneralState = () => {
    this.setState({ error: null });
    this.setState({ strProcessedData: null });
  }

  resetFileState = () => {
    this.setState({ srtFileName: null });
    this.setState({ srtFileData: null });
  }

  handleChosenFile = (file) => {
    this.resetGeneralState();

    if (file) {
      this.setState({ srtFileName: file.name });

      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        this.setState({ srtFileData: fileReader.result });
      }
      fileReader.onerror = error => {
        this.setState({ error });
      }

      fileReader.readAsText(file);
    } else {
      this.resetFileState();
    }
  }

  handleTimingChange = (newTimingChange) => {
    this.resetGeneralState();
    this.setState({ timingChange: Number(newTimingChange) });
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
      const strProcessedData = processTimingChange(this.state.srtFileData, this.state.timingChange);
      this.setState({ strProcessedData });
    } catch (err) {
      this.setState({ error: err.message });
    }
  }

  getProcessedFileName = () => {
    const { srtFileName, timingChange } = this.state;

    const name = srtFileName.slice(0, srtFileName.lastIndexOf('.'));

    return `${name}Processed${timingChange}.srt`;
  }

  render() {
    const { error, strProcessedData } = this.state;

    return (
      <div className="App">
        <header>
          <p className="header">
            Simple app that adjusts subtitles timing in SRT files. Thanks for using!
          </p>
        </header>

        <main>

          <div className="file-input">
            <label>Select the SRL file:</label>
            <input type="file" accept=".srt" onChange={ev => this.handleChosenFile(ev.target.files[0])} />
          </div>

          <div className="timing-change">
            <label>Timing change applied in ms</label>
            <input type="number" max={MAX_TIMING_CHANGE} onChange={ev => this.handleTimingChange(ev.target.value)} />
            <button onClick={this.processDataIfValid}>Proccess!</button>

            {strProcessedData ? (
              <Download file={this.getProcessedFileName()} content={strProcessedData}>
                <button type="button">Download processed file!</button>
              </Download>) : null}

            {error ? <p className="error">{error}</p> : null}
          </div>

        </main>

        <footer>
          Let me know if you have any issues <a href="https://github.com/GabrielLomba/subtitles-adjuster/issues">here</a>.
          Author: <a href="https://github.com/GabrielLomba">Gabriel Lomba</a>
        </footer>
      </div>
    );
  }
}

export default App;
