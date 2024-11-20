import React from "react";

interface DebuggerProps {
  pc: number;
  currentInstruction: string;
  previousInstruction: string;
  onRun: () => void;
  onStepIn: () => void;
  onStepOver: () => void;
  onReset: () => void;
}

const DebuggerComponent: React.FC<DebuggerProps> = ({
  pc,
  currentInstruction,
  previousInstruction,
  onRun,
  onStepIn,
  onStepOver,
  onReset,
}) => {
  return (
    <div id="debugger">
      <h2>Debugger</h2>
      <div className="debugger-container">
        <div className="debugger-buttons">
          <button className="debugger-button" id="dg-reset-button" onClick={onReset}>
            🔃
          </button>
          <button className="debugger-button" id="dg-run-button" onClick={onRun}>
            ▶️
          </button>
          <button className="debugger-button" id="dg-step-in-button" onClick={onStepIn}>
            ⤵️
          </button>
          <button className="debugger-button" id="dg-step-over-button" onClick={onStepOver}>
            ⬆️
          </button>
        </div>
        <div className="debugger-info" id="debugger-info">
          <p>Program Counter: {pc}</p>
          <p>Current Instruction: {currentInstruction}</p>
          <p>Previous Instruction: {previousInstruction}</p>
        </div>
      </div>
    </div>
  );
};

export default DebuggerComponent;