// Importing the readline module to handle user input from the command line
const readline = require('readline');

// Stack class implementation
class Stack {
    constructor() {
        this.items = []; // Initialize an empty array to hold the stack elements
    }

    // Method to push an element onto the stack
    push(element) {
        this.items.push(element);
    }

    // Method to pop an element from the stack
    pop() {
        if (this.isEmpty()) {
            throw new Error("Stack Underflow"); // Error if stack is empty
        }
        return this.items.pop();
    }

    // Method to check if the stack is empty
    isEmpty() {
        return this.items.length === 0;
    }

    // Method to peek at the top element of the stack without removing it
    peek() {
        if (this.isEmpty()) {
            throw new Error("Stack is empty"); // Error if stack is empty
        }
        return this.items[this.items.length - 1];
    }
}

// SymbolTable class implementation
class SymbolTable {
    constructor() {
        this.table = {}; // Initialize an empty object to hold variable mappings
    }

    // Method to insert a key-value pair into the symbol table
    insert(key, value) {
        this.table[key] = value;
    }

    // Method to search for a key in the symbol table
    search(key) {
        if (this.table.hasOwnProperty(key)) {
            return this.table[key];
        }
        throw new Error(`Key ${key} not found`); // Error if key is not found
    }
}

// Function to evaluate postfix expressions
function evaluatePostfix(tokens, symbolTable) {
    const stack = new Stack(); // Create a new stack instance

    // Iterate over each token in the expression
    tokens.forEach(token => {
        if (!isNaN(token)) { // Check if the token is a number
            stack.push(parseFloat(token)); // Push the number onto the stack
        } else if (token === "+" || token === "-" || token === "*" || token === "/") { // Check if the token is an operator
            const operand2 = stack.pop(); // Pop the top two operands
            const operand1 = stack.pop();
            let result;
            // Perform the appropriate operation based on the token
            switch (token) {
                case "+":
                    result = operand1 + operand2;
                    break;
                case "-":
                    result = operand1 - operand2;
                    break;
                case "*":
                    result = operand1 * operand2;
                    break;
                case "/":
                    result = operand1 / operand2;
                    break;
            }
            stack.push(result); // Push the result back onto the stack
        } else if (token === "=") { // Check if the token is an assignment operator
            const value = stack.pop(); // Pop the value and variable name
            const variable = stack.pop();
            symbolTable.insert(variable, value); // Insert the variable and value into the symbol table
        } else { // Treat the token as a variable name
            try {
                stack.push(symbolTable.search(token)); // Push the variable's value onto the stack
            } catch (error) {
                stack.push(token); // If not found, treat it as a new variable for assignment
            }
        }
    });

    return stack.peek(); // Return the top value of the stack
}

// Create a readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const symbolTable = new SymbolTable(); // Create a new symbol table instance

// Function to prompt the user for input
function promptUser() {
    rl.question('> ', (input) => {
        const tokens = input.split(' '); // Split the input into tokens
        try {
            const result = evaluatePostfix(tokens, symbolTable); // Evaluate the postfix expression
            if (result !== undefined) {
                console.log(result); // Print the result if defined
            }
        } catch (error) {
            console.error(error.message); // Print error message if an error occurs
        }
        promptUser(); // Prompt the user for another input
    });
}

promptUser(); // Start the user prompt loop
