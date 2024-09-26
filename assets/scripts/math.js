function mathHelp() {
    echo("add, subtract, multiply, divide, modulus, log, power, sqrt, abs");
}

function add(...numbers) {
    echo(numbers.reduce((acc, curr) => acc + Number(curr), 0));
}

function subtract(...numbers) {
    if (numbers.length === 0) return 0;
    echo(numbers.reduce((acc, curr) => acc - Number(curr)));
}

function multiply(...numbers) {
    if (numbers.length === 0) return 0;
    echo(numbers.reduce((acc, curr) => acc * Number(curr), 1));
}

function divide(...numbers) {
    if (numbers.length === 0) return 0;
    if (numbers.includes(0)) throw new Error("Division by zero is not allowed");
    echo(numbers.reduce((acc, curr) => acc / Number(curr)));
}

function modulus(...numbers) {
    if (numbers.length === 0) return 0;
    if (numbers.includes(0)) throw new Error("Modulus by zero is not allowed");
    echo(numbers.reduce((acc, curr) => acc % Number(curr)));
}

function log(number, base = Math.E) {
    if (number <= 0) throw new Error("Logarithm undefined for non-positive numbers");
    echo(Math.log(number) / Math.log(base));
}

function power(base, exponent) {
    echo(Math.pow(base, exponent));
}

function sqrt(number) {
    if (number < 0) throw new Error("Square root undefined for negative numbers");
    echo(Math.sqrt(number));
}

function abs(number) {
    echo(Math.abs(number));
}