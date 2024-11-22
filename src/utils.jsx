// utils.js

function translateInstructionToHex(instruction) {
  const opcodeMap = {
      "add": "000000", "sub": "000000", "slt": "000000", "and": "000000", "or": "000000",
      "addi": "001000", "lw": "100011", "sw": "101011",
      "beq": "000100", "bne": "000101",
      "j": "000010"
  };

  const funcMap = {
      "add": "100000", "sub": "100010", "slt": "101010", "and": "100100", "or": "100101",
  };

  const regMap = {
      "zero": "00000", "at": "00001", "v0": "00010", "v1": "00011",
      "a0": "00100", "a1": "00101", "a2": "00110", "a3": "00111",
      "t0": "01000", "t1": "01001", "t2": "01010", "t3": "01011",
      "t4": "01100", "t5": "01101", "t6": "01110", "t7": "01111",
      "s0": "10000", "s1": "10001", "s2": "10010", "s3": "10011",
      "s4": "10100", "s5": "10101", "s6": "10110", "s7": "10111",
      "t8": "11000", "t9": "11001", "k0": "11010", "k1": "11011",
      "gp": "11100", "sp": "11101", "fp": "11110", "ra": "11111"
  };

  const parts = instruction.split(' ');

  const opcode = opcodeMap[parts[0]];
  if (!opcode) return "Unknown Instruction";

  let binaryInstruction = opcode;
  console.log(parts[0]);
  if (["add", "sub", "slt", "and", "or"].includes(parts[0])) {
      // R-type instruction
      const rd = regMap[parts[1]];
      const rs = regMap[parts[2]];
      const rt = regMap[parts[3]];
      if (!rd || !rs || !rt) return "Invalid Registers";
      binaryInstruction += rs + rt + rd + "00000" + funcMap[parts[0]];
  } else if (["lw", "sw"].includes(parts[0])) {
      // I-type instruction
      const rt = regMap[parts[1]];
      const rs = regMap[parts[3].split(',')[0]];
      const immediate = parseInt(parts[2]);
      if (!rt || !rs || isNaN(immediate)) return "Invalid Syntax";
      binaryInstruction += rs + rt + (immediate >>> 0).toString(2).padStart(16, '0');
  } else if (["addi"].includes(parts[0])) {
      // I-type instruction
      const rt = regMap[parts[1]];
      const rs = regMap[parts[2]];
      const immediate = parseInt(parts[3]);
      if (!rt || !rs || isNaN(immediate)) return "Invalid Syntax";
      binaryInstruction += rs + rt + (immediate >>> 0).toString(2).padStart(16, '0');
  } else if (["beq", "bne"].includes(parts[0])) {
      // I-type instruction
      const rs = regMap[parts[1]];
      const rt = regMap[parts[2]];
      const label = parts[3];
      if (!rs || !rt) return "Invalid Registers";
      // For simplicity, assuming label is an immediate value (offset)
      const offset = parseInt(label);
      if (isNaN(offset)) return "Invalid Syntax";
      binaryInstruction += rs + rt + (offset >>> 0).toString(2).padStart(16, '0');
  } else if (["j"].includes(parts[0])) {
      // J-type instruction
      const address = parseInt(parts[1]);
      if (isNaN(address)) return "Invalid Syntax";
      binaryInstruction += (address >>> 0).toString(2).padStart(26, '0');
  } else {
      return "Unsupported Instruction";
  }

  // Convert binary instruction to hexadecimal
  const hexInstruction = parseInt(binaryInstruction, 2).toString(16).toUpperCase().padStart(8, '0');
  //return "0x" + hexInstruction;
  return hexInstruction;
}

function translateInstructionToMIPS(hexInstruction) {
  console.log("hexInstruction", hexInstruction);

  const opcodeMap = {
      "000000": "R-type",
      "001000": "addi",
      "100011": "lw",
      "101011": "sw",
      "000100": "beq",
      "000101": "bne",
      "000010": "j"
  };

  const funcMap = {
      "100000": "add",
      "100010": "sub",
      "101010": "slt",
      "100100": "and",
      "100101": "or"
  };

  const regMap = {
      "00000": "zero", "00001": "at", "00010": "v0", "00011": "v1",
      "00100": "a0", "00101": "a1", "00110": "a2", "00111": "a3",
      "01000": "t0", "01001": "t1", "01010": "t2", "01011": "t3",
      "01100": "t4", "01101": "t5", "01110": "t6", "01111": "t7",
      "10000": "s0", "10001": "s1", "10010": "s2", "10011": "s3",
      "10100": "s4", "10101": "s5", "10110": "s6", "10111": "s7",
      "11000": "t8", "11001": "t9", "11010": "k0", "11011": "k1",
      "11100": "gp", "11101": "sp", "11110": "fp", "11111": "ra"
  };

  const binaryInstruction = hexToBinary(hexInstruction).padStart(32, '0');
  const opcode = binaryInstruction.slice(0, 6);
  console.log("Opcode:", opcode);

  const opcodeMIPS = opcodeMap[opcode];
  if (!opcodeMIPS) return "Unknown Instruction: invalid opcode";

  let mipsInstruction = "";

  if (opcodeMIPS === "R-type") {
      // R-type instruction
      const rs = regMap[binaryInstruction.slice(6, 11)];
      const rt = regMap[binaryInstruction.slice(11, 16)];
      const rd = regMap[binaryInstruction.slice(16, 21)];
      const shamt = binaryInstruction.slice(21, 26);
      const funct = binaryInstruction.slice(26, 32);

      const funcMIPS = funcMap[funct];
      console.log("Function:", funct, funcMIPS);
      if (!funcMIPS) return "Unknown Instruction: invalid funct code";

      if (!rs || !rt || !rd) return "Invalid Registers";
      mipsInstruction = `${funcMIPS} ${rd}, ${rs}, ${rt}`;
  } else if (["lw", "sw"].includes(opcodeMIPS)) {
      // I-type instruction (load/store)
      const rs = regMap[binaryInstruction.slice(6, 11)];
      const rt = regMap[binaryInstruction.slice(11, 16)];
      const offset = parseInt(binaryInstruction.slice(16, 32), 2);

      if (!rt || !rs || isNaN(offset)) return "Invalid Syntax";
      mipsInstruction = `${opcodeMIPS} ${rt}, ${offset}(${rs})`;
  } else if (opcodeMIPS === "addi") {
      // I-type instruction (addi)
      const rs = regMap[binaryInstruction.slice(6, 11)];
      const rt = regMap[binaryInstruction.slice(11, 16)];
      const immediate = parseInt(binaryInstruction.slice(16, 32), 2);

      if (!rt || !rs || isNaN(immediate)) return "Invalid Syntax";
      mipsInstruction = `addi ${rt}, ${rs}, ${immediate}`;
  } else if (["beq", "bne"].includes(opcodeMIPS)) {
      // I-type instruction (branch)
      const rs = regMap[binaryInstruction.slice(6, 11)];
      const rt = regMap[binaryInstruction.slice(11, 16)];
      const offset = parseInt(binaryInstruction.slice(16, 32), 2);

      if (!rs || !rt || isNaN(offset)) return "Invalid Syntax";
      mipsInstruction = `${opcodeMIPS} ${rs}, ${rt}, ${offset}`;
  } else if (opcodeMIPS === "j") {
      // J-type instruction
      const address = parseInt(binaryInstruction.slice(6, 32), 2);
      if (isNaN(address)) return "Invalid Syntax";
      mipsInstruction = `j ${address}`;
  } else {
      return "Unsupported Instruction";
  }

  return mipsInstruction;
}


function hexToBinary(hex) {
  let binary = '';
  for (let i = 0; i < hex.length; i++) {
      let bin = parseInt(hex[i], 16).toString(2);
      binary += bin.padStart(4, '0');
  }
  return binary;
}


function binaryToHex(binaryString) {
  // Pad the binary string with leading zeros to ensure it's a multiple of 4
  while (binaryString.length % 4 !== 0) {
      binaryString = '0' + binaryString;
  }

  // Initialize an empty string to store the hexadecimal representation
  let hexString = '';

  // Convert each group of 4 bits to its hexadecimal equivalent
  for (let i = 0; i < binaryString.length; i += 4) {
      const binaryChunk = binaryString.substr(i, 4); // Get a chunk of 4 bits
      const hexDigit = parseInt(binaryChunk, 2).toString(16); // Convert the chunk to hexadecimal
      hexString += hexDigit; // Append the hexadecimal digit to the result
  }

  // Return the hexadecimal representation
  return "0x" + hexString.toUpperCase(); // Convert to uppercase for consistency
}

// utils.jsx

// Your existing code...

// utils.jsx

export function executeMIPSInstructions(
  instructions,
  currentRegisters = {},
  currentMemory = {}
) {
  let registers = { ...currentRegisters };
  let memory = { ...currentMemory };
  let pc = 0;
  let history = [];

  instructions.forEach((instruction) => {
    const [op, ...operands] = instruction.split(' ');

    switch (op) {
      case 'add': {
        const [rd, rs, rt] = operands;
        registers[rd] = (registers[rs] || 0) + (registers[rt] || 0);
        break;
      }
      case 'sub': {
        const [rd, rs, rt] = operands;
        registers[rd] = (registers[rs] || 0) - (registers[rt] || 0);
        break;
      }
      case 'slt': {
        const [rd, rs, rt] = operands;
        registers[rd] = (registers[rs] || 0) < (registers[rt] || 0) ? 1 : 0;
        break;
      }
      case 'and': {
        const [rd, rs, rt] = operands;
        registers[rd] = (registers[rs] || 0) & (registers[rt] || 0);
        break;
      }
      case 'or': {
        const [rd, rs, rt] = operands;
        registers[rd] = (registers[rs] || 0) | (registers[rt] || 0);
        break;
      }
      case 'addi': {
        const [rt, rs, immediate] = operands;
        registers[rt] = (registers[rs] || 0) + parseInt(immediate, 10);
        break;
      }
      case 'lw': {
        const [rt, offsetAndRs] = operands;
        const [offset, rs] = offsetAndRs.match(/(\d+)\((\w+)\)/).slice(1);
        const address = (registers[rs] || 0) + parseInt(offset, 10);
        registers[rt] = memory[address] || 0;
        break;
      }
      case 'sw': {
        const [rt, offsetAndRs] = operands;
        const [offset, rs] = offsetAndRs.match(/(\d+)\((\w+)\)/).slice(1);
        const address = (registers[rs] || 0) + parseInt(offset, 10);
        memory[address] = registers[rt] || 0;
        break;
      }
      // Implementa otros casos según sea necesario
      default: {
        console.error('Operación no soportada:', op);
        break;
      }
    }

    pc++;
    history.push({
      pc,
      instruction,
      registers: { ...registers },
      memory: { ...memory },
    });
  });

  return {
    registers,
    memory,
    pc,
    history,
  };
}