// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Fill.asm

// Runs an infinite loop that listens to the keyboard input.
// When a key is pressed (any key), the program blackens the screen,
// i.e. writes "black" in every pixel;
// the screen should remain fully black as long as the key is pressed. 
// When no key is pressed, the program clears the screen, i.e. writes
// "white" in every pixel;
// the screen should remain fully clear as long as no key is pressed.

// Put your code here.


// 256x512
// 1 row in 32 registers.
// 32*256 = 8192


@8192
D=A
@pixels
M=D


@SCREEN // RAM[16384]
D=A
@screenBaseAddress //
M=D


(LOOP)

// If key is pressed, go to the (KEYPRESSED) part.
    @24576
    D=M
    @KEYPRESSED
    D;JGT




// Whiten all pixels.

@pixels
M=M-1

@LOOP
0;JMP


(KEYPRESSED)


// If key is released, jump back to loop.
    @24576
    D=M
    @LOOP
    D;JEQ


// Check if screen is already filled.
    @KEYPRESSED
    @pixels
    M;JEQ





// Starts from RAM[16384]
@screenBaseAddress
A=M // select the memory address where a pixel has to be drawn.
M=-1 // set 16-bit register to 1111111111111111


//Increment
@screenBaseAddress 
M=M+1 


@pixels
M=M-1



@KEYPRESSED
0;JEQ









