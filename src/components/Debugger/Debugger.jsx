import React from 'react';
import '../../styles/Debugger.css';
import ControlButtons from './utils/controlButtons';
import DebuggerInfo from './utils/debuggerInfo';

const Debugger = ({ PC, mipsInput, stepMIPS, stepBackMIPS, resetMIPS }) => {
  const instructions = mipsInput.trim().split('\n');

  return (
    <div id="debugger">
      <h2>Debugger</h2>
      <ControlButtons stepMIPS={stepMIPS} stepBackMIPS={stepBackMIPS} resetMIPS={resetMIPS} />
      <DebuggerInfo PC={PC} instructions={instructions} />
    </div>
  );
};

export default Debugger;