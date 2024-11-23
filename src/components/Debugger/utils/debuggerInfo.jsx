import React from 'react';

const DebuggerInfo = ({ PC, instructions }) => {
  return (
    <div id="debugger-info">
      <p>PC: {PC}</p>
      <p>Current instruction: {instructions[PC] ?? 'N/A'}</p>
      <p>Previous instruction: {instructions[PC - 1] ?? 'N/A'}</p>
    </div>
  );
};

export default DebuggerInfo;