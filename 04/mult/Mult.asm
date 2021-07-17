// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Mult.asm

// Multiplies R0 and R1 and stores the result in R2.
// (R0, R1, R2 refer to RAM[0], RAM[1], and RAM[2], respectively.)
//
// This program only needs to handle arguments that satisfy
// R0 >= 0, R1 >= 0, and R0*R1 < 32768.

// Put your code here.

// @sum 
// M=0
// @R0 
// D=M
// @REG0 
// M=D

// (LOOP)
// @R1    
// D=M  
// @sum
// M=M+D 
// @REG0  
// M=M-1
// D=M

// @R2
// M=0

// @LOOP
// D;JGT

// @sum
// D=M
// @R2
// M=D

// (END)
// @END

// 0;JMP


// 5*3 in pseudocode:

// sum = 0
// register0 = 5 
// register1 = 3

// for(i=5; i != 0; i--) {   
//    sum += 
// }



@sum 
M=0 // sum = 0
@R0 
D=M
@REG0 
M=D // REG0 = RAM[0]

(LOOP)


// If REG0 == 0, exit the loop.
@REG0
@STOP
M;JEQ

// else
@R1    
D=M  
@sum
M=M+D // sum += register1
@REG0  
M=M-1 // REG0--


@LOOP
0;JMP


// Store the result in register2 and exit the program. 
(STOP)
@sum
D=M
@R2
M=D

(END)
@END
0;JMP

