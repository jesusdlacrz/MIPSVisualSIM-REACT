// App.jsx
import React, { useState } from 'react';
import Header from './components/Header';
import InputContainer from './components/InputContainer';
import ButtonContainer from './components/ButtonContainer';
import SimulationTables from './components/SimulationTables';
import { initialRegisters, initialMemory } from './intialState';
import { executeMIPSInstructions } from './utils';

function App() {
  const [mipsInput, setMipsInput] = useState('');
  const [registers, setRegisters] = useState({ ...initialRegisters });
  const [memory, setMemory] = useState({ ...initialMemory });
  const [pc, setPc] = useState(0);
  const [history, setHistory] = useState([]);
  const [instructions, setInstructions] = useState([]);

  // Actualizar las instrucciones cuando cambia mipsInput
  React.useEffect(() => {
    const instr = mipsInput
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    setInstructions(instr);
  }, [mipsInput]);

  const simulateMIPS = () => {
    const result = executeMIPSInstructions(instructions);
    setRegisters(result.registers);
    setMemory(result.memory);
    setPc(result.pc);
    setHistory(result.history);
  };

  const stepMIPS = () => {
    // Implementar la lógica para ejecutar una instrucción y actualizar el estado
    const currentInstruction = instructions[pc];
    if (currentInstruction) {
      const result = executeMIPSInstructions([currentInstruction], registers, memory);
      setRegisters(result.registers);
      setMemory(result.memory);
      setPc(pc + 1);
      setHistory([...history, currentInstruction]);
    }
  };

  const stepBackMIPS = () => {
    // Implementar la lógica para retroceder una instrucción
    if (pc > 0) {
      const prevPc = pc - 1;
      // Recuperar el estado anterior del historial
      // Necesitas llevar un seguimiento detallado del historial de estados
      // Para simplificar, aquí reiniciamos y ejecutamos hasta prevPc
      resetMIPS();
      for (let i = 0; i < prevPc; i++) {
        const result = executeMIPSInstructions([instructions[i]], registers, memory);
        setRegisters(result.registers);
        setMemory(result.memory);
      }
      setPc(prevPc);
      setHistory(history.slice(0, -1));
    }
  };

  const resetMIPS = () => {
    setRegisters({ ...initialRegisters });
    setMemory({ ...initialMemory });
    setPc(0);
    setHistory([]);
  };

  return (
    <div className="container">
      <Header />
      <InputContainer mipsInput={mipsInput} setMipsInput={setMipsInput} />
      <ButtonContainer
        mipsInput={mipsInput}
        setRegisters={setRegisters}
        setMemory={setMemory}
        setPc={setPc}
        setHistory={setHistory}
        simulateMIPS={simulateMIPS}
      />
      <SimulationTables
        registers={registers}
        memory={memory}
        pc={pc}
        simulateMIPS={simulateMIPS}
        stepMIPS={stepMIPS}
        stepBackMIPS={stepBackMIPS}
        resetMIPS={resetMIPS}
      />
    </div>
  );
}

export default App;