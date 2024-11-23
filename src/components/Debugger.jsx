import React from 'react';
import '../styles/Debugger.css';

const ControlButtons = ({ stepMIPS, stepBackMIPS, resetMIPS }) => {
  return (
    <div id="control-buttons">
      <button onClick={stepMIPS}>Step In</button>
      <button onClick={stepBackMIPS}>Step Back</button>
      <button onClick={resetMIPS}>Reset</button>
    </div>
  );
};

const DebuggerInfo = ({ PC, instructions }) => {
  return (
    <div id="debugger-info">
      <p>PC: {PC}</p>
      <p>Current instruction: {instructions[PC] ?? 'N/A'}</p>
      <p>Previous instruction: {instructions[PC - 1] ?? 'N/A'}</p>
    </div>
  );
};

const Debugger = ({ PC, mipsInput, stepMIPS, stepBackMIPS, resetMIPS }) => {
  const instructions = mipsInput.trim().split('\n');

  return (
    <div id="debugger">
      <h2>Debugger</h2>
      <ControlButtons
        stepMIPS={stepMIPS}
        stepBackMIPS={stepBackMIPS}
        resetMIPS={resetMIPS}
      />
      <DebuggerInfo PC={PC} instructions={instructions} />
    </div>
  );
};

export default Debugger;
