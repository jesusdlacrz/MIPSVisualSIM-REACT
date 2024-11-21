import React, { useState, useEffect } from "react";
import InputArea from "./InputArea";
import FileProcessor from "./FileProcessor";
import RamTable from "./RamTable";
import RegisterTable from "./RegisterTable";
import DebuggerComponent from "./Debugger";
import { translateInstructionToHex, translateInstructionToMIPS } from "../utils";

const Simulator = () => {
  const [mipsInput, setMipsInput] = useState("");
  const [registers, setRegisters] = useState({});
  const [memory, setMemory] = useState({});
  const [pc, setPC] = useState(0);

  useEffect(() => {
    resetMIPS();
  }, []);

  const resetMIPS = () => {
    setPC(0);
    const initialRegisters = {
      zero: 0, at: 0, v0: 0, v1: 0,
      a0: 0, a1: 0, a2: 0, a3: 0,
      t0: 0, t1: 0, t2: 0, t3: 0,
      t4: 0, t5: 0, t6: 0, t7: 0,
      s0: 0, s1: 0, s2: 0, s3: 0,
      s4: 0, s5: 0, s6: 0, s7: 0,
      t8: 0, t9: 0, k0: 0, k1: 0,
      gp: 0, sp: 0, fp: 0, ra: 0
    };
    setRegisters(initialRegisters);

    const initialMemory = {};
    for (let i = 0; i < 32; i++) {
      initialMemory[i] = 0;
    }
    setMemory(initialMemory);
  };

  const executeMIPSInstruction = (instruction) => {
    const [op, ...operands] = instruction.split(' ').filter(s => s !== '');
    let newRegisters = { ...registers };
    let newMemory = { ...memory };

    switch (op) {
      case 'add': {
        const [rd, rs, rt] = operands;
        if (rd && rs && rt && registers[rs] !== undefined && registers[rt] !== undefined) {
          newRegisters[rd] = registers[rs] + registers[rt];
        }
        break;
      }
      case 'sub': {
        const [rd, rs, rt] = operands;
        if (rd && rs && rt && registers[rs] !== undefined && registers[rt] !== undefined) {
          newRegisters[rd] = registers[rs] - registers[rt];
        }
        break;
      }
      case 'addi': {
        const [rt, rs, immediate] = operands;
        if (rt && rs && immediate && registers[rs] !== undefined) {
          newRegisters[rt] = registers[rs] + parseInt(immediate, 10);
        }
        break;
      }
      case 'lw': {
        const [rt, offsetBase] = operands;
        const match = offsetBase.match(/(\d+)\((\w+)\)/);
        if (match) {
          const offset = parseInt(match[1], 10);
          const base = match[2];
          const address = registers[base] + offset;
          if (memory[address] !== undefined) {
            newRegisters[rt] = memory[address];
          }
        }
        break;
      }
      case 'sw': {
        const [rt, offsetBase] = operands;
        const match = offsetBase.match(/(\d+)\((\w+)\)/);
        if (match) {
          const offset = parseInt(match[1], 10);
          const base = match[2];
          const address = registers[base] + offset;
          newMemory[address] = registers[rt];
        }
        break;
      }
      // Agrega más casos según sea necesario
      default:
        console.error('Operación no soportada:', op);
    }

    setRegisters(newRegisters);
    setMemory(newMemory);
  };

  const simulateMIPS = () => {
    resetMIPS();
    const instructions = mipsInput.trim().split('\n');
    instructions.forEach((instruction) => {
      if (instruction.trim() !== '') {
        executeMIPSInstruction(instruction.trim());
      }
    });
    setPC(instructions.length);
  };

  const stepMIPS = () => {
    const instructions = mipsInput.trim().split('\n');
    if (pc >= instructions.length) return;
    const instruction = instructions[pc].trim();
    if (instruction !== '') {
      executeMIPSInstruction(instruction);
    }
    setPC(pc + 1);
  };

  const stepBackMIPS = () => {
    console.warn('La función de retroceso no está disponible.');
  };

  const handleMipsInputChange = (e) => {
    setMipsInput(e.target.value);
  };

  return (
    <div className="container">
      <h1>MIPS Visual Simulator</h1>
      <InputArea mipsInput={mipsInput} onChange={handleMipsInputChange} />
      <FileProcessor
        onProcessFile={(content) => {
          console.log('Contenido del archivo:', content);
        }}
      />
      <button id="simulate-mips-button" onClick={simulateMIPS}>Simulate MIPS</button>
      <DebuggerComponent
        pc={pc}
        currentInstruction={mipsInput.trim().split('\n')[pc] ?? ''}
        previousInstruction={mipsInput.trim().split('\n')[pc - 1] ?? ''}
        onRun={simulateMIPS}
        onStepIn={stepMIPS}
        onStepOver={stepBackMIPS}
        onReset={resetMIPS}
      />
      <div id="simulation-tables" className="button-container">
        <RamTable memory={memory} />
        <RegisterTable registers={registers} />
      </div>
    </div>
  );
};

export default Simulator;