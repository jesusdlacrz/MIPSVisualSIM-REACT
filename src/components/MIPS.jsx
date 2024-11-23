import React, { useState } from "react";
import Debugger from "./Debugger";
import  DropArea  from "./DropArea";
import  SimulationTables  from "./Tables";
import "../styles/MipsApps.css";

const initialRegisters = {
  zero: 0,
  at: 0,
  v0: 0,
  v1: 0,
  a0: 0,
  a1: 0,
  a2: 0,
  a3: 0,
  t0: 0,
  t1: 0,
  t2: 0,
  t3: 0,
  t4: 0,
  t5: 0,
  t6: 0,
  t7: 0,
  s0: 0,
  s1: 0,
  s2: 0,
  s3: 0,
  s4: 0,
  s5: 0,
  s6: 0,
  s7: 0,
  t8: 0,
  t9: 0,
  k0: 0,
  k1: 0,
  gp: 0,
  sp: 0,
  fp: 0,
  ra: 0,
};

const initialMemory = Array.from({ length: 32 }).reduce(
  (acc, curr, i) => ({ ...acc, [i]: 0 }),
  {}
);

const MIPS = () => {
  const [mipsInput, setMipsInput] = useState("");
  const [hexInput, setHexInput] = useState("");
  const [registers, setRegisters] = useState(initialRegisters);
  const [memory, setMemory] = useState(initialMemory);
  const [PC, setPC] = useState(0);
  const [history, setHistory] = useState([]);

  const updateTables = (newRegisters, newMemory) => {
    setRegisters(newRegisters);
    setMemory(newMemory);
  };

  const simulateMIPS = () => {
    document
      .getElementById("simulation-tables")
      .scrollIntoView({ behavior: "smooth" });

    const hexInstructions = mipsInput.trim().split("\n");
    resetMIPS();

    const newRegisters = { ...initialRegisters };
    const newMemory = { ...initialMemory };

    hexInstructions.forEach((instruction) => {
      executeMIPSInstruction(instruction, newRegisters, newMemory);
    });

    updateTables(newRegisters, newMemory);
  };

  const stepMIPS = () => {
    const instructions = mipsInput.trim().split("\n");
    if (PC >= instructions.length) return;

    setHistory([
      ...history,
      { PC, registers: { ...registers }, memory: { ...memory } },
    ]);
    const newRegisters = { ...registers };
    const newMemory = { ...memory };
    executeMIPSInstruction(instructions[PC], newRegisters, newMemory);

    setPC(PC + 1);
    updateTables(newRegisters, newMemory);
  };

  const stepBackMIPS = () => {
    if (PC === 0) return;

    const lastState = history.pop();
    if (lastState) {
      setPC(lastState.PC);
      setRegisters(lastState.registers);
      setMemory(lastState.memory);
      setHistory(history.slice(0, -1));
    }
  };

  const resetMIPS = () => {
    setPC(0);
    setHistory([]);
    setRegisters(initialRegisters);
    setMemory(initialMemory);
  };

  return (
    <div>
      <section className="inputs-container">
        <div className="row-container">
          <textarea
            id="mips-input"
            className="input-text-area"
            value={mipsInput}
            onChange={(e) => setMipsInput(e.target.value)}
          />
          <button
            id="simulate-mips-button"
            className="btn"
            onClick={simulateMIPS}
          >
            Simulate MIPS
          </button>
        </div>
        <DropArea setMipsInput={setMipsInput} setHexInput={setHexInput} />
      </section>
      <SimulationTables registers={registers} memory={memory} />
      <Debugger
        PC={PC}
        mipsInput={mipsInput}
        stepMIPS={stepMIPS}
        stepBackMIPS={stepBackMIPS}
        resetMIPS={resetMIPS}
      />
    </div>
  );
};

function executeMIPSInstruction(instruction, registers, memory) {
  // Split MIPS instruction into operation and operands
  const [op, ...operands] = instruction.split(" ");
  // Implement execution logic for each MIPS operation
  switch (op) {
    case "add": {
      const [rd, rs, rt] = operands;
      registers[rd] = registers[rs] + registers[rt];
      break;
    }
    case "sub": {
      const [rd, rs, rt] = operands;
      registers[rd] = registers[rs] - registers[rt];
      break;
    }
    case "slt": {
      const [rd, rs, rt] = operands;
      registers[rd] = registers[rs] < registers[rt] ? 1 : 0;
      break;
    }
    case "and": {
      const [rd, rs, rt] = operands;
      registers[rd] = registers[rs] & registers[rt];
      break;
    }
    case "or": {
      const [rd, rs, rt] = operands;
      registers[rd] = registers[rs] | registers[rt];
      break;
    }
    case "addi": {
      const [rd, rs, immediate] = operands;
      registers[rd] = registers[rs] + parseInt(immediate);
      break;
    }
    case "lw": {
      const [rt, rs, offset] = operands;
      const address = registers[rs] + parseInt(offset);
      //console.log('lw address:', address);
      //console.log('lw memory value:', memory[address]);
      if (memory.hasOwnProperty(address)) {
        registers[rt] = memory[address];
      } else {
        console.error("Memory address not found:", address);
      }
      break;
    }
    case "sw": {
      const [rt, rs, offset] = operands;
      const address = registers[rs] + parseInt(offset);
      //console.log('sw rt:', rt, 'rs', rs, 'offset', offset, 'address', address,'getting', registers[rt] );
      memory[address] = registers[rt];
      break;
    }
    // Add cases for other MIPS operations
    default: {
      console.error("Unsupported operation:", op);
      break;
    }
  }
}

export default MIPS;
