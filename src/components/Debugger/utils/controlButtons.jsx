import React from 'react';

const ControlButtons = ({ stepMIPS, stepBackMIPS, resetMIPS }) => {
  return (
    <div id="control-buttons">
      <button onClick={stepMIPS}>Step In</button>
      <button onClick={stepBackMIPS}>Step Back</button>
      <button onClick={resetMIPS}>Reset</button>
    </div>
  );
};

export default ControlButtons;