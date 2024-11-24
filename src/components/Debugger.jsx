import React from 'react';
import '../styles/Debugger.css';

const ControlButtons = ({ simulateMIPS, stepMIPS, stepBackMIPS, resetMIPS }) => {
  return (
    <div id="control-buttons">
      <button onClick={simulateMIPS}>RUN</button>
      <button onClick={stepMIPS}>NEXT</button>
      <button onClick={stepBackMIPS}>BACK</button>
      <button onClick={resetMIPS}>RESET</button>
    </div>
  );
};

const DebuggerInfo = ({ PC, instructions }) => {
  return (
    <div id="debugger-info">
      <p>PC: {PC}</p>
      <p>Current instruction: {instructions[PC] ?? 'Null'}</p>
      <p>Previous instruction: {instructions[PC - 1] ?? 'Null'}</p>
    </div>
  );
};

const Debugger = ({ PC, mipsInput, stepMIPS, stepBackMIPS, resetMIPS, simulateMIPS }) => {
  const instructions = mipsInput.trim().split('\n');
  return (
    <div id="debugger" className='Debugger'>
      <h2>Debugger</h2>
      <ControlButtons
        simulateMIPS={simulateMIPS}
        stepMIPS={stepMIPS}
        stepBackMIPS={stepBackMIPS}
        resetMIPS={resetMIPS}
      />
      <DebuggerInfo PC={PC} instructions={instructions} />
    </div>
  );
};

export default Debugger;
