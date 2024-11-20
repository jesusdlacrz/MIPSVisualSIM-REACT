export const opcodeMap: { [key: string]: string } = {
    add: "000000",
    sub: "000000",
    slt: "000000",
    and: "000000",
    or: "000000",
    addi: "001000",
    lw: "100011",
    sw: "101011",
    beq: "000100",
    bne: "000101",
    j: "000010",
  };
  
  export const funcMap: { [key: string]: string } = {
    "100000": "add",
    "100010": "sub",
    "101010": "slt",
    "100100": "and",
    "100101": "or",
  };
  
  export const regMap: { [key: string]: string } = {
    zero: "00000",
    at: "00001",
    v0: "00010",
    v1: "00011",
    a0: "00100",
    a1: "00101",
    a2: "00110",
    a3: "00111",
    t0: "01000",
    t1: "01001",
    t2: "01010",
    t3: "01011",
    t4: "01100",
    t5: "01101",
    t6: "01110",
    t7: "01111",
    s0: "10000",
    s1: "10001",
    s2: "10010",
    s3: "10011",
    s4: "10100",
    s5: "10101",
    s6: "10110",
    s7: "10111",
    t8: "11000",
    t9: "11001",
    k0: "11010",
    k1: "11011",
    gp: "11100",
    sp: "11101",
    fp: "11110",
    ra: "11111",
  };
  
  export function translateInstructionToHex(instruction: string): string {
    const parts = instruction.split(" ");
    const opcode = opcodeMap[parts[0]];
    if (!opcode) return "Unknown Instruction";
  
    let binaryInstruction = opcode;
  
    if (["add", "sub", "slt", "and", "or"].includes(parts[0])) {
      // R-type instruction
      const rd = regMap[parts[1]];
      const rs = regMap[parts[2]];
      const rt = regMap[parts[3]];
      if (!rd || !rs || !rt) return "Invalid Registers";
      binaryInstruction += rs + rt + rd + "00000" + Object.keys(funcMap).find(key => funcMap[key] === parts[0]);
    } else if (["lw", "sw"].includes(parts[0])) {
      // I-type instruction
      const rt = regMap[parts[1]];
      const rs = regMap[parts[2]];
      const immediate = parseInt(parts[3]);
      if (!rt || !rs || isNaN(immediate)) return "Invalid Syntax";
      binaryInstruction += rs + rt + (immediate >>> 0).toString(2).padStart(16, "0");
    } else if (["addi"].includes(parts[0])) {
      // I-type instruction
      const rt = regMap[parts[1]];
      const rs = regMap[parts[2]];
      const immediate = parseInt(parts[3]);
      if (!rt || !rs || isNaN(immediate)) return "Invalid Syntax";
      binaryInstruction += rs + rt + (immediate >>> 0).toString(2).padStart(16, "0");
    } else if (["beq", "bne"].includes(parts[0])) {
      // I-type instruction
      const rs = regMap[parts[1]];
      const rt = regMap[parts[2]];
      const label = parts[3];
      if (!rs || !rt) return "Invalid Registers";
      const offset = parseInt(label);
      if (isNaN(offset)) return "Invalid Syntax";
      binaryInstruction += rs + rt + (offset >>> 0).toString(2).padStart(16, "0");
    } else if (["j"].includes(parts[0])) {
      // J-type instruction
      const address = parseInt(parts[1]);
      if (isNaN(address)) return "Invalid Syntax";
      binaryInstruction += (address >>> 0).toString(2).padStart(26, "0");
    } else {
      return "Unsupported Instruction";
    }
  
    // Convert binary instruction to hexadecimal
    const hexInstruction = parseInt(binaryInstruction, 2)
      .toString(16)
      .toUpperCase()
      .padStart(8, "0");
    return hexInstruction;
  }
  
  export function translateInstructionToMIPS(hexInstruction: string): string {
    const binaryInstruction = hexToBinary(hexInstruction);
    const opcode = binaryInstruction.slice(0, 6);
  
    const opcodeMIPS = Object.keys(opcodeMap).find(key => opcodeMap[key] === opcode);
    if (!opcodeMIPS) return "Unknown Instruction, opcode null";
  
    let mipsInstruction = opcodeMIPS + " ";
  
    if (["add", "sub", "slt", "and", "or"].includes(opcodeMIPS)) {
      // R-type instruction
      const func = binaryInstruction.slice(26, 32);
      const funcMIPS = funcMap[func];
      if (!funcMIPS) return "Unknown Instruction (function)";
      mipsInstruction = funcMIPS + " ";
      const rs = Object.keys(regMap).find(key => regMap[key] === binaryInstruction.slice(6, 11));
      const rt = Object.keys(regMap).find(key => regMap[key] === binaryInstruction.slice(11, 16));
      const rd = Object.keys(regMap).find(key => regMap[key] === binaryInstruction.slice(16, 21));
      if (!rs || !rt || !rd) return "Invalid Registers";
      mipsInstruction += `${rd} ${rs} ${rt}`;
    } else if (["lw", "sw"].includes(opcodeMIPS)) {
      // I-type instruction
      const rt = Object.keys(regMap).find(key => regMap[key] === binaryInstruction.slice(6, 11));
      const rs = Object.keys(regMap).find(key => regMap[key] === binaryInstruction.slice(11, 16));
      const offset = binaryInstruction.slice(16, 32);
      mipsInstruction += `${rt} ${rs} ${binaryToHex(offset)}`;
    } else if (["addi"].includes(opcodeMIPS)) {
      // I-type instruction
      const rt = Object.keys(regMap).find(key => regMap[key] === binaryInstruction.slice(6, 11));
      const rs = Object.keys(regMap).find(key => regMap[key] === binaryInstruction.slice(11, 16));
      const immediate = binaryToHex(binaryInstruction.slice(16, 32));
      if (!rt || !rs || !immediate) return "Invalid Syntax";
      mipsInstruction += `${rt} ${rs} ${immediate}`;
    } else if (["beq", "bne"].includes(opcodeMIPS)) {
      // I-type instruction
      const rs = Object.keys(regMap).find(key => regMap[key] === binaryInstruction.slice(6, 11));
      const rt = Object.keys(regMap).find(key => regMap[key] === binaryInstruction.slice(11, 16));
      const offset = parseInt(binaryInstruction.slice(16, 32), 2);
      mipsInstruction += `${rs} ${rt} ${offset}`;
    } else if (["j"].includes(opcodeMIPS)) {
      // J-type instruction
      const address = binaryToHex(binaryInstruction.slice(6, 32));
      mipsInstruction += address;
    } else {
      return "Unsupported Instruction opcode";
    }
  
    return mipsInstruction;
  }
  
  export function binaryToHex(binaryString: string): string {
    const paddedBinary = binaryString.padStart(Math.ceil(binaryString.length / 4) * 4, "0");
    let hexString = "";
    for (let i = 0; i < paddedBinary.length; i += 4) {
      const chunk = paddedBinary.substr(i, 4);
      const hexDigit = parseInt(chunk, 2).toString(16);
      hexString += hexDigit;
    }
    return "0x" + hexString.toUpperCase();
  }
  
  export function hexToBinary(hex: string): string {
    let binary = "";
    for (let i = 0; i < hex.length; i++) {
      const bin = parseInt(hex[i], 16).toString(2);
      binary += bin.padStart(4, "0");
    }
    return binary;
  }
  
  export function sum(a: number, b: number): number {
    return a + b;
  }