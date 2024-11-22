// ButtonContainer.jsx
import React from 'react';
import DropArea from './DropArea';
import { executeMIPSInstructions } from '../utils';

function ButtonContainer({ mipsInput, setRegisters, setMemory, setPc, setHistory }) {
  const simulateMIPS = () => {
    // Separar las instrucciones por línea
    const instructions = mipsInput
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    // Ejecutar las instrucciones MIPS
    const { registers, memory, pc, history } = executeMIPSInstructions(instructions);

    // Actualizar el estado con los resultados
    setRegisters(registers);
    setMemory(memory);
    setPc(pc);
    setHistory(history);
  };

  return (
    <div className="button-container">
      <DropArea setMemory={setMemory} />
      <button onClick={simulateMIPS}>Simular MIPS</button>
    </div>
  );
}

export default ButtonContainer;