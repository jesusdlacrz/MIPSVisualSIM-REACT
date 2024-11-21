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
    setRegisters(initialRegisters);
    const initialMemory = {};
    for (let i = 0; i < 32; i++) {
      initialMemory[i] = 0;
    }
    setMemory(initialMemory);
  };

  const executeMIPSInstruction = (instruction) => {
    const [op, ...operands] = instruction.split(" ").filter((s) => s !== "");
    setRegisters((prevRegisters) => {
      const newRegisters = { ...prevRegisters };
      switch (op) {
        case "add": {
          const [rd, rs, rt] = operands;
          if (rd && rs && rt) {
            if (
              prevRegisters[rs] !== undefined &&
              prevRegisters[rt] !== undefined
            ) {
              newRegisters[rd] = prevRegisters[rs] + prevRegisters[rt];
            } else {
              console.error(`Registro no definido: ${rs} o ${rt}`);
            }
          } else {
            console.error("Número incorrecto de operandos para 'add'");
          }
          break;
        }
        case "sub": {
          const [rd, rs, rt] = operands;
          if (rd && rs && rt) {
            if (
              prevRegisters[rs] !== undefined &&
              prevRegisters[rt] !== undefined
            ) {
              newRegisters[rd] = prevRegisters[rs] - prevRegisters[rt];
            } else {
              console.error(`Registro no definido: ${rs} o ${rt}`);
            }
          } else {
            console.error("Número incorrecto de operandos para 'sub'");
          }
          break;
        }
        case "addi": {
          const [rt, rs, immediate] = operands;
          if (rt && rs && immediate) {
            if (prevRegisters[rs] !== undefined) {
              newRegisters[rt] = prevRegisters[rs] + parseInt(immediate, 10);
            } else {
              console.error(`Registro no definido: ${rs}`);
            }
          } else {
            console.error("Número incorrecto de operandos para 'addi'");
          }
          break;
        }
        // Agrega más casos según sea necesario
        default: {
          console.error("Operación no soportada:", op);
          break;
        }
      }
      return newRegisters;
    });
  };

  const simulateMIPS = () => {
    resetMIPS();
    const instructions = mipsInput.trim().split("\n");
    instructions.forEach((instruction) => {
      if (instruction.trim() !== "") {
        executeMIPSInstruction(instruction.trim());
      }
    });
    updateTables();
  };

  const stepMIPS = () => {
    const instructions = mipsInput.trim().split("\n");
    if (pc >= instructions.length) return;
    const instruction = instructions[pc].trim();
    if (instruction !== "") {
      executeMIPSInstruction(instruction);
      setPC((prevPC) => prevPC + 1);
    } else {
      setPC((prevPC) => prevPC + 1);
      stepMIPS(); // Saltar líneas vacías
    }
    updateTables();
  };

  const stepBackMIPS = () => {
    console.warn("La función de retroceso no está disponible.");
  };

  const handleMipsInputChange = (e) => {
    setMipsInput(e.target.value);
  };

  const updateTables = () => {
    // Actualizar la tabla de registros
    const registerTable = document.getElementById("registerTable");
    if (registerTable) {
      const rows = registerTable.getElementsByTagName("tr");
      for (let i = 1; i < rows.length; i++) {
        const registerName = rows[i].cells[0].textContent;
        if (registerName) {
          const registerValue = registers[registerName].toString(16).toUpperCase();
          rows[i].cells[1].textContent = "0x" + registerValue;
        }
      }
    }

    // Actualizar la tabla de memoria
    const memoryTable = document.getElementById("ramTable");
    if (memoryTable) {
      const rows = memoryTable.getElementsByTagName("tr");
      for (let i = 1; i < rows.length; i++) {
        const memoryAddress = parseInt(rows[i].cells[0].textContent || "0", 16);
        const memoryValue = memory[memoryAddress].toString(16).toUpperCase();
        rows[i].cells[1].textContent = "0x" + memoryValue;
      }
    }
  };

  return (
    <div className="container">
      <h1>MIPS Visual Simulator</h1>
      <InputArea mipsInput={mipsInput} onChange={handleMipsInputChange} />
      <FileProcessor
        onProcessFile={(content) => {
          console.log("Contenido del archivo:", content);
        }}
      />
      <DebuggerComponent
        pc={pc}
        currentInstruction={mipsInput.trim().split("\n")[pc] ?? ""}
        previousInstruction={mipsInput.trim().split("\n")[pc - 1] ?? ""}
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