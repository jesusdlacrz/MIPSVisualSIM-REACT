// components/SimulationTables.js
import React from 'react';
import RamTable from './RamTable';
import Debugger from './Debugger';
import RegisterTable from './RegisterTable';

function SimulationTables({ registers, memory, pc, simulateMIPS, stepMIPS, stepBackMIPS, resetMIPS }) {
  return (
    <div id="simulation-tables" className="button-container">
      <RamTable memory={memory} />
      <Debugger
        pc={pc}
        simulateMIPS={simulateMIPS}
        stepMIPS={stepMIPS}
        stepBackMIPS={stepBackMIPS}
        resetMIPS={resetMIPS}
      />
      <RegisterTable registers={registers} />
    </div>
  );
}

export default SimulationTables;