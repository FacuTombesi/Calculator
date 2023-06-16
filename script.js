class Calculator { // Guarda la informacion de los numeros y operadores que se presionan
    constructor(previousOperandTextElement, currentOperandTextElement) { // Toma todos los input y funciones de la calculadora
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement; // Estos "this" setean la informacion que se guarda en la clase
        this.clear(); // Limpia todos los valores cada vez que se carga la aplicacion
    }

    // Defino las funciones que se van a ejecutar cada vez que se haga click en un boton

    clear() {
        this.currentOperand = "";
        this.previousOperand = "";
        this.operation = undefined;
    };

    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1); // Convierto el currentOperand a string y despues le realizo un slice para quitarle el ultimo numero introducido
    };

    // appendNumber() define lo que ocurre cada vez que se hace click en un numero
    appendNumber(number) {
        if (number === "." && this.currentOperand.includes(".")) return; // Me fijo si quiero agregar y si ya tengo un "." en currentOperand. Si ya hay, termino la operacion para que solo se pueda agregar un "." por operacion
        this.currentOperand = this.currentOperand.toString() + number.toString(); // Necesito convertir los numeros a strings ya que si intento agregar numeros los vas a sumar en lugar de agregarlos al costado
    };

    // chooseOperation() define lo que ocurre cada vez que se hace click en una operacion
    chooseOperation(operation) {
        if (this.currentOperand === "") return; // Si currentOperand esta vacio, no nos va a dejar seguir
        if (this.previousOperand !== "") { // Si previousOperand no esta vacio, se realiza la computacion
            this.compute();
        };
        this.operation = operation;
        this.previousOperand = this.currentOperand; // previousOperand pasa a ser currentOperand...
        this.currentOperand = ""; // ...y currentOperand queda vacio, indicando que es una nueva operacion
    };

    // compute() toma los valores de la calculadora y calcula lo que se va a mostrar en el display
    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand); // parseFloat() convierte el string de vuelta a numero
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return; // Si no tengo prev y no tengo current, la funcion no se ejecuta
        switch (this.operation) { // Defino un switch con todos los casos de operaciones posibles
            case "+":
                computation = prev + current;
                break;
            case "-":
                computation = prev - current;
                break;
            case "x":
                computation = prev * current;
                break;
            case "÷":
                computation = prev / current;
                break;
            case "%":
                computation = (prev * current) / 100;
                break;
            default:
                return;
        };
        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = "";
    };

    // getDisplayNumber() agrega las comas a los numeros. Ej: 1,000 - 10,000 - 1,000,000 - etc...
    // Tambien se encargara de dar la posibilidad de ingresar decimales menores al entero 1. Ej: 0.25
    getDisplayNumber(number) {
        const stringNumber = number.toString(); // Cambio los numeros a string para poder hacerle un split y separar los decimales
        const integerDigits = parseFloat(stringNumber.split(".")[0]); // Vuelvo a convertir el string a numero pero antes hago el split al numero en el indice [0] para agarrar el numero antes del "."
        const decimalDigits = stringNumber.split(".")[1]; // Hago lo mismo con los decimales, es decir todo lo que esta despues del ".", pero sin convertirlo a numero todavia
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = "";
        }   else {
            integerDisplay = integerDigits.toLocaleString("en", { // toLocaleString("en") hace que los numeros grandes se vean con el formato mas conocido donde el mil, el millon, etc tienen una "," cada 3 numeros. Ej: 1,000,000
                maximumFractionDigits: 0
            });
        };
        if (decimalDigits != null) { // Si tengo decimales
            return `${integerDisplay}.${decimalDigits}`; // devuelvo "numero entero . numero decimal"
        }   else {
            return integerDisplay; // sino devuelvo solo el numero entero
        };
    };

    // updateDisplay() actualiza el display segun los resultados de compute()
    updateDisplay() {
        this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand); // Al agregar la funcion getDisplayNumber hago que los numeros de currentOperand como los de previousOperand mas abajo tengan coma cuando sean numeros grandes
        if (this.operation != null) {
            this.previousOperandTextElement.innerText =
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}` // Esto mueve el valor de currentOperand a previousOperand y lo concatena con el simbolo de la operacion
        }   else {
            this.previousOperandTextElement.innerText = "";
        };
    };
};

// Selecciono y guardo todos los tipos de botones en mi HTML
const numberButtons = document.querySelectorAll("[data-number]");
const operationButtons = document.querySelectorAll("[data-operation]");
const equalsButton = document.querySelector("[data-equals]");
const deleteButton = document.querySelector("[data-delete]");
const allClearButton = document.querySelector("[data-all-clear]");
const previousOperandTextElement = document.querySelector("[data-previous]");
const currentOperandTextElement = document.querySelector("[data-current]");

// Creo la calculadora en si utilizando la clase constructora que defini al principio y le paso los valores de la clase contructora
const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

// Selecciono todos los botones numericos y por cada uno le agrego un eventListener para que ocurra algo cuando le doy click
numberButtons.forEach(button => {
    button.addEventListener("click", () => {
        calculator.appendNumber(button.innerText); // Le paso el contenido de los botones (en este caso, los numeros) a la funcion appendNumber() de la clase
        calculator.updateDisplay(); // Y luego actualizo el display para que se muestre lo que clickeo
    });
});

// Hago lo mismo para las operaciones
operationButtons.forEach(button => {
    button.addEventListener("click", () => {
        calculator.chooseOperation(button.innerText);
        calculator.updateDisplay();
    });
});

// Le doy la funcion al "=" para que al hacerle click, realice la operacion y actualize el display
equalsButton.addEventListener("click", button => {
    calculator.compute();
    calculator.updateDisplay();
});

allClearButton.addEventListener("click", button => {
    calculator.clear();
    calculator.updateDisplay();
});

deleteButton.addEventListener("click", button => {
    calculator.delete();
    calculator.updateDisplay();
});