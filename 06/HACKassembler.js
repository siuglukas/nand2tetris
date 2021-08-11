const fs = require("fs");
// Read CLI argument.
const filePath = process.argv[2];
const assemblyProgram = fs.readFileSync(filePath, { encoding: "UTF8" });

const computationTable = {
  0: {
    machineInstruction: "101010",
    a: 0,
  },

  1: {
    machineInstruction: "111111",
    a: 0,
  },

  "-1": {
    machineInstruction: "111010",
    a: 0,
  },
  D: {
    machineInstruction: "001100",
    a: 0,
  },
  A: {
    machineInstruction: "110000",
    a: 0,
  },

  M: {
    machineInstruction: "110000",
    a: 1,
  },

  "!D": {
    machineInstruction: "001101",
    a: 0,
  },
  "!A": {
    machineInstruction: "110001",
    a: 0,
  },
  "!M": {
    machineInstruction: "110001",
    a: 1,
  },
  "-D": {
    machineInstruction: "001111",
    a: 0,
  },
  "-A": {
    machineInstruction: "110011",
    a: 0,
  },
  "-M": {
    machineInstruction: "110011",
    a: 1,
  },
  "D+1": {
    machineInstruction: "011111",
    a: 0,
  },
  "A+1": {
    machineInstruction: "110111",
    a: 0,
  },
  "M+1": {
    machineInstruction: "110111",
    a: 1,
  },
  "D-1": {
    machineInstruction: "001110",
    a: 0,
  },
  "A-1": {
    machineInstruction: "110010",
    a: 0,
  },
  "M-1": {
    machineInstruction: "110010",
    a: 1,
  },

  "D+A": {
    machineInstruction: "000010",
    a: 0,
  },

  "D+M": {
    machineInstruction: "000010",
    a: 1,
  },

  "D-A": {
    machineInstruction: "010011",
    a: 0,
  },
  "D-M": {
    machineInstruction: "010011",
    a: 1,
  },

  "A-D": {
    machineInstruction: "000111",
    a: 0,
  },

  "M-D": {
    machineInstruction: "000111",
    a: 1,
  },

  "D&A": {
    machineInstruction: "000000",
    a: 0,
  },
  "D&M": {
    machineInstruction: "000000",
    a: 1,
  },
  "D|A": {
    machineInstruction: "010101",
    a: 0,
  },
  "D|M": {
    machineInstruction: "010101",
    a: 1,
  },
};

const destinationTable = {
  M: "001",
  D: "010",
  MD: "011",
  A: "100",
  AM: "101",
  AD: "110",
  AMD: "111",
};

const jumpTable = {
  JGT: "001",
  JEQ: "010",
  JGE: "011",
  JLT: "100",
  JNE: "101",
  JLE: "110",
  JMP: "111",
};

const symbolTable = {
  R0: "0",
  R1: "1",
  R2: "2",
  R3: "3",
  R4: "4",
  R5: "5",
  R6: "6",
  R7: "7",
  R8: "8",
  R9: "9",
  R10: "10",
  R11: "11",
  R12: "12",
  R13: "13",
  R14: "14",
  R15: "15",
  SCREEN: "16384",
  KBD: "24576",
  SP: "0",
  LCL: "1",
  ARG: "2",
  THIS: "3",
  THAT: "4",
};

function dec2bin(dec) {
  return (dec >>> 0).toString(2);
}

const listOfInstructions = assemblyProgram
  .split(/\r\n|\n\r|\n|\r/) // Split by new line
  .filter((instruction) => instruction.trim().length !== 0); // Remove blank lines

let updatedInstructions = [];

// Remove comments and fill the symbol table.
let lineCounter = 0;
listOfInstructions.forEach((instruction) => {
  {
    if (instruction.startsWith("//")) return;

    if (instruction.includes("//")) {
      const splitByComment = instruction.split("//");
      splitByComment.pop();
      instruction = splitByComment.join().trim();
    }
  }

  if (instruction.includes("(") && instruction.includes(")")) {
    lineCounter--; // Don't count a label as an instruction.

    const labelLine = lineCounter + 1; // Select a line that goes after the label.
    let labelName = instruction.replace("(", "").replace(")", "");
    symbolTable[labelName] = `${labelLine}`;
  } else {
    // Labels and comments removed.
    updatedInstructions.push(instruction);
  }

  lineCounter++;
});

let RAMVariableRegister = 16;
function AInstruction(instruction) {
  const AIns = instruction.split("@");
  let registerName = AIns[1].trim();

  const toInt = parseInt(registerName);

  // Convert labels and variables to RAM registers.
  if (!Number.isInteger(toInt)) {
    const label = symbolTable[registerName];

    if (!label) {
      // Add a variable to the symbol table.
      symbolTable[registerName] = RAMVariableRegister;
      RAMVariableRegister++;

      registerName = symbolTable[registerName];
    } else {
      registerName = label;
    }
  }

  const AInsToBinary = dec2bin(registerName);
  const A = "0".repeat(16 - AInsToBinary.length) + AInsToBinary;
  instruction = A;
  return instruction;
}

/*
  C instruction:
      Symbolic syntax:  dest = comp ; jump
      Binary syntax:  111 a c1 c2 c3 c4 c5 c6 d1 d2 d3 j1 j2 j3
      Example: MD=D+1 
*/

function CInstruction(instruction) {
  const compIns = instruction.split("=");

  const dest = compIns[0].trim();
  const comp = compIns[1].trim();

  const aBit = computationTable[comp].a;
  const cBits = computationTable[comp].machineInstruction;
  const dBits = destinationTable[dest];
  const jBits = "000";

  const CInstruction = `111${aBit}${cBits}${dBits}${jBits}`;
  instruction = CInstruction;

  return instruction;
}

function CInstructionJump(instruction) {
  const jumpIns = instruction.split(";");
  const comp = jumpIns[0].trim();
  const jump = jumpIns[1].trim();

  const aBit = computationTable[comp].a;
  const cBits = computationTable[comp].machineInstruction;
  const dBits = "000";
  const jBits = jumpTable[jump];

  const CInstructionJump = `111${aBit}${cBits}${dBits}${jBits}`;
  instruction = CInstructionJump;

  return instruction;
}

// Convert instructions to machine code.

let machineCode = "";
updatedInstructions.forEach((instruction) => {
  if (instruction.includes("@")) {
    instruction = AInstruction(instruction);
  }

  if (instruction.includes("=")) {
    instruction = CInstruction(instruction);
  }

  if (instruction.includes(";")) {
    instruction = CInstructionJump(instruction);
  }

  machineCode += `${instruction}\n`;
});

fs.writeFile("./machineCode.hack", machineCode, function (err) {
  if (err) {
    return console.log(err);
  }
  console.log("The file was saved!");
});
