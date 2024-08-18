class Calculadora extends HTMLElement {
    constructor() {
        super();

        const shadow = this.attachShadow({ mode: 'open' });
        const template = document.getElementById('calculator-template').content.cloneNode(true);

        // Estilos modificados según tus indicaciones
        const style = document.createElement('style');
        style.textContent = `
            .calculator {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 12px;
                max-width: 200px;
                margin: auto;
                padding: 20px;
                border: 20px solid #24c0eb;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }

            .calculator input {
                grid-column: span 4;
                padding: 12px;
                font-size: 1.2em;
                text-align: right;
            }

            .calculator button {
                padding: 15px;
                font-size: 1em;
                border: none;
                border-radius: 10px;
                cursor: pointer;
                transition: background-color 0.3s ease;
            }

            .calculator button.operator {
                background-color: #DE382A; /* Naranja para operadores */
                color: white;
            }

            .calculator button:not(.operator) {
                background-color: white; /* Botones con números en blanco */
                color: #333; /* Texto negro */
            }
            
            .calculator button.equal {
                background-color: #116251; /* Verde para el botón igual */
                color: white;
                width: 229%;
                height: 100%;
            }

            .calculator button.clear {
                background-color: #790614; /* Rojo para el botón limpiar */
                color: white;
            }

            .calculator button:hover {
                background-color: #df8615; /* Color de fondo al hacer hover */
            }
        `;

        shadow.appendChild(style);
        shadow.appendChild(template);

        this.display = shadow.getElementById('display');
        this.buttons = shadow.querySelectorAll('button');
        this.currentValue = '';
        this.previusValue = '';
        this.operator = '';

        this.buttons.forEach(button => {
            button.addEventListener('click', () => this.onButtonClick(button));
        });
    }

    onButtonClick(button) {
        const value = button.textContent;
        if (!isNaN(value) || value === '.') {
            this.appendNumber(value);
        } else if (value === '=') {
            this.calculate();
        } else if (value === 'C') {
            this.clear();
        } else if (value === '√') {
            this.sqrt();
        } else if (value === '^') {
            this.setOperator('^');
        } else {
            this.setOperator(value);
        }
    }

    appendNumber(number) {
        if (this.currentValue.includes('.') && number === '.') return;
        this.currentValue += number;
        this.updateDisplay();
    }

    setOperator(operator) {
        if (this.currentValue === '') return;
        if (this.currentValue !== '') {
            this.calculate();
        }
        this.operator = operator;
        this.previusValue = this.currentValue;
        this.currentValue = '';
    }

    calculate() {
        let result;

        const prev = parseFloat(this.previusValue);
        const current = parseFloat(this.currentValue);

        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operator) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                result = prev / current;
                break;
            case '^':
                result = Math.pow(prev, current);
                break;
            default:
                return;
        }

        this.currentValue = result.toString();
        this.operator = '';
        this.previusValue = '';
        this.updateDisplay();
    }

    sqrt() {
        const current = parseFloat(this.currentValue);
        if (isNaN(current)) return;
        this.currentValue = Math.sqrt(current).toString();
        this.updateDisplay();
    }

    clear() {
        this.currentValue = '';
        this.previusValue = '';
        this.operator = '';
        this.updateDisplay();
    }

    updateDisplay() {
        this.display.value = this.currentValue;
    }
}

customElements.define('mi-calculadora', Calculadora);
