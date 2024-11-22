// components/Debugger.js
import React from 'react';

function Debugger({ pc, simulateMIPS, stepMIPS, stepBackMIPS, resetMIPS }) {
  return (
    <div id="debugger">
      <h2>Debugger</h2>
      <div className="debugger-container">
        <div className="debugger-buttons">
          <button className="debugger-button" onClick={resetMIPS}>🔃</button>
          <button className="debugger-button" onClick={simulateMIPS}>▶️</button>
          <button className="debugger-button" onClick={stepMIPS}>⤵️</button>
          <button className="debugger-button" onClick={stepBackMIPS}>⬆️</button>
        </div>
        <div className="debugger-info" id="debugger-info">
          <p>Contador de Programa: {pc}</p>
          {/* Puedes agregar más información si lo deseas */}
        </div>
      </div>
    </div>
  );
}

export default Debugger;