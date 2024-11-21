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
  const [history, setHistory] = useState([]);

  useEffect(() => {
    resetMIPS();
  }, []);

  const resetMIPS = () => {
    setPC(0);
    setHistory([]);
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
    console.log(`Ejecutando instrucción: ${instruction}`);
    const [op, ...operands] = instruction.split(' ').filter(s => s !== '');
    if (!op) return;

    // Actualizar Registros
    setRegisters(prevRegisters => {
      const newRegisters = { ...prevRegisters };
      switch (op) {
        case 'add': {
          const [rd, rs, rt] = operands;
          if (rd && rs && rt && newRegisters[rs] !== undefined && newRegisters[rt] !== undefined) {
            newRegisters[rd] = newRegisters[rs] + newRegisters[rt];
            console.log(`add: ${rd} = ${newRegisters[rd]}`);
          }
          break;
        }
        case 'sub': {
          const [rd, rs, rt] = operands;
          if (rd && rs && rt && newRegisters[rs] !== undefined && newRegisters[rt] !== undefined) {
            newRegisters[rd] = newRegisters[rs] - newRegisters[rt];
            console.log(`sub: ${rd} = ${newRegisters[rd]}`);
          }
          break;
        }
        case 'addi': {
          const [rt, rs, immediate] = operands;
          if (rt && rs && immediate && newRegisters[rs] !== undefined) {
            newRegisters[rt] = newRegisters[rs] + parseInt(immediate, 10);
            console.log(`addi: ${rt} = ${newRegisters[rt]}`);
          }
          break;
        }
        // Agrega más casos según sea necesario
        default:
          console.error('Operación no soportada:', op);
      }
      return newRegisters;
    });

    // Actualizar Memoria
    setMemory(prevMemory => {
      const newMemory = { ...prevMemory };
      switch (op) {
        case 'lw': {
          const [rt, offsetBase] = operands;
          const match = offsetBase.match(/(\-?\d+)\((\w+)\)/); // Soporta offsets negativos
          if (match) {
            const offset = parseInt(match[1], 10);
            const base = match[2];
            const baseValue = registers[base];
            if (baseValue === undefined) {
              console.error(`Registro base no encontrado: ${base}`);
              return newMemory;
            }
            const address = baseValue + offset;
            if (newMemory[address] !== undefined) {
              setRegisters(prevRegisters => ({
                ...prevRegisters,
                [rt]: newMemory[address]
              }));
              console.log(`lw: Cargando en ${rt} el valor ${newMemory[address]} desde la dirección ${address}`);
            } else {
              console.error(`Dirección de memoria no válida: ${address}`);
            }
          }
          break;
        }
        case 'sw': {
          const [rt, offsetBase] = operands;
          const match = offsetBase.match(/(\-?\d+)\((\w+)\)/);
          if (match) {
            const offset = parseInt(match[1], 10);
            const base = match[2];
            const baseValue = registers[base];
            const rtValue = registers[rt];
            if (baseValue === undefined || rtValue === undefined) {
              console.error(`Registro base o rt no encontrado: ${base}, ${rt}`);
              return newMemory;
            }
            const address = baseValue + offset;
            if (address >= 0 && address < 32) { // Asegura que la dirección sea válida
              newMemory[address] = rtValue;
              console.log(`sw: Almacenando en la dirección ${address} el valor ${rtValue} desde ${rt}`);
            } else {
              console.error(`Dirección de memoria fuera de rango: ${address}`);
            }
          }
          break;
        }
        // Agrega más casos según sea necesario
        default:
          break;
      }
      return newMemory;
    });
  };

  const simulateMIPS = async () => {
    resetMIPS();
    const instructions = mipsInput.trim().split('\n');

    for (let i = 0; i < instructions.length; i++) {
      const instruction = instructions[i].trim();
      if (instruction !== '') {
        setHistory(prevHistory => [...prevHistory, { pc, registers: { ...registers }, memory: { ...memory } }]);
        executeMIPSInstruction(instruction);
        setPC(prevPC => prevPC + 1);
        // Esperar brevemente para ver las actualizaciones (opcional)
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  };

  const stepMIPS = () => {
    const instructions = mipsInput.trim().split('\n');
    if (pc >= instructions.length) {
      console.log('Todas las instrucciones han sido ejecutadas.');
      return;
    }
    const instruction = instructions[pc].trim();
    if (instruction !== '') {
      console.log(`Paso ${pc + 1}: Ejecutando ${instruction}`);
      setHistory(prevHistory => [...prevHistory, { pc, registers: { ...registers }, memory: { ...memory } }]);
      executeMIPSInstruction(instruction);
      setPC(prevPC => prevPC + 1);
    }
  };

  const stepBackMIPS = () => {
    if (history.length === 0) {
      console.log('No hay pasos para deshacer.');
      return;
    }
    const lastState = history[history.length - 1];
    setPC(lastState.pc);
    setRegisters(lastState.registers);
    setMemory(lastState.memory);
    setHistory(history.slice(0, -1));
    console.log(`Deshaciendo paso: PC=${lastState.pc}`);
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
          // Aquí puedes procesar el contenido del archivo y actualizar mipsInput o memory según sea necesario
        }}
      />
      <button 
        id="simulate-mips-button" 
        onClick={simulateMIPS}
        style={{ display: 'block', margin: '10px 0' }}
      >
        Simulate MIPS
      </button>
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