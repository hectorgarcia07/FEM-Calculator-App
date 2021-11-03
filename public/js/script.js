const screenDisplay = document.getElementById('screen-input')
const miniDisplay = document.getElementById('mini-display')
const html = document.querySelector('html')
const themeSwitcherBtn = document.querySelectorAll('input[name="theme"]')
const digitKeys = document.querySelectorAll('[data-digit]')
const decimalKey = document.querySelector('[data-decimal]')
const deleteKey = document.querySelector('[data-delete]')
const operationKeys = document.querySelectorAll('[data-operation]')
const resetKey = document.querySelector('[data-reset]')
const equalKey = document.querySelector('[data-equal]')

/*  ---      Theme Events        ---*/

//theme one is the default theme
html.dataset.theme = `theme-one`

//switches the theme based on given parameter
function switchTheme(theme) {
  html.dataset.theme = `theme-${theme}`
}

//for each radio button switch the theme to its respective active state
themeSwitcherBtn.forEach( radioBtn => {
    radioBtn.addEventListener('click', event =>{
        switchTheme(radioBtn.dataset.radio)
    })
})

/*  ---      Click Events        ---*/

//event for all key 0 - 9 click and on button press
digitKeys.forEach( digitKey => {
    digitKey.addEventListener('click', event => {
        calculator.updateOperand(digitKey.dataset.digit)
    })
})

//event for decimal click
decimalKey.addEventListener('click', event => {
    calculator.decimal()
})

//event for the delete key
deleteKey.addEventListener('click', event => {
    calculator.deleteDigit()
})

//event for each operation key
operationKeys.forEach(operationKey => {
    operationKey.addEventListener('click', event => {
        calculator.operation(operationKey.dataset.operation)
    })
})

//event to clear operands and operator
resetKey.addEventListener('click', event => {
    calculator.reset()
})

//calculate's the result
equalKey.addEventListener('click', event => {
    calculator.equal()
})

/*  ---      ButtenPress Events        ---*/
//will check and handle if user entered a number, decimal or operator symbols
window.addEventListener('keydown', event => {
    let key = event.key 

    if(/^\d+$/.test(key)){
        calculator.updateOperand(event.key)
    }
    else if(key == '/' || key == '*' || key == '-' || key == '+'){
        calculator.operation(key)
    }
    else if(key == '.'){
        calculator.decimal()
    }
    else if(key == '=' || key == 'Enter'){
        calculator.equal()
    }
    else if(key == 'Backspace'){
        calculator.deleteDigit()
    }
    else if(key == 'Escape'){
        calculator.reset()
    }
})

//calcuator object that will serve 
class Calculator {
    constructor(){
        this.currentOperand = ''
        this.previousOperand = ''
        this.operator = undefined
        this.isPrevOperandSet = false
    }
    //will update the current operand
    updateOperand(digit){
        //if the first digit is zero, set it to the users number
        //otherwise append to the end
        if(this.currentOperand == '' || this.currentOperand == '0'){
            this.currentOperand = digit
        }
        else{
            this.currentOperand = this.currentOperand + digit
        }
        this.updateDisplay()
    }
    //will update the display to show current operand
    updateDisplay(){
        if(this.currentOperand == ''){
            screenDisplay.textContent = '0'
        }
        else if(this.currentOperand[this.currentOperand.length - 1] == '.'){
            screenDisplay.textContent = this.currentOperand
        }else{
            //splits the string for easy formating
            const [value, decimalValue] = this.currentOperand.split('.')
            const output = this.formatOutput(value, decimalValue)

            screenDisplay.textContent = output
        }
    }

    //will return output as formated in en-IN
    formatOutput(value, decimal){
        let newVal = parseFloat(value).toLocaleString("en-IN", { useGrouping: true })
        //if there are decmimal, append it
        if(decimal){
            return `${newVal}.${decimal}`
        }
        return `${newVal}`
    }

    //will append a decmial if one hasn't been added yet
    decimal(){
        if(!this.currentOperand.includes('.')){
            //fixes a bug where adding a decimal on empty currentoperand causes NAN
            if(this.currentOperand.length == 0){
                this.currentOperand = '0'
            }
            this.currentOperand = this.currentOperand + '.'
            this.updateDisplay()
        }
    }
    //will delete digit
    deleteDigit(){
        if(this.currentOperand.length == 1){
            this.currentOperand = ''
        }
        else if(this.currentOperand == 'Infinity'){
            this.currentOperand = ''
        }
        else{
            this.currentOperand = this.currentOperand.slice(0, -1)
        }
        this.updateDisplay()
    }
    //can compute the given operations or updates the opperator
    operation(op){
        //if the second operand exist, save it and set a new operand
        if(!this.operator){
            if(!this.currentOperand){
                this.currentOperand = '0'
            }
            this.operator = op
            this.previousOperand = this.currentOperand
            this.currentOperand = ''
            this.isPrevOperandSet = true

            miniDisplay.textContent = `${this.previousOperand} ${this.operator}`
        }
        else if(this.isPrevOperandSet){
            if(!this.currentOperand){
                this.operator = op
            }else{
                //compute the current operand and previous operand
                const result = this.compute()
                this.operator = op
                this.previousOperand = result.toString()
                this.currentOperand = ''
            }

            miniDisplay.textContent = `${this.previousOperand} ${this.operator}`
        }

        this.updateDisplay()
    }
    //computes the result based on given operation
    compute(){
        if(!this.currentOperand){
            this.currentOperand = '0'
        }
        switch(this.operator){
            case '+':
                return parseFloat(this.previousOperand) + parseFloat(this.currentOperand)
                break;
            case '-':
                return parseFloat(this.previousOperand) - parseFloat(this.currentOperand)
                break;
            case '/':
                return parseFloat(this.previousOperand) / parseFloat(this.currentOperand)
                break;
            case '*':
                return parseFloat(this.previousOperand) * parseFloat(this.currentOperand)
                break;
        }
    }

    //resets the calculator
    reset(){
        this.currentOperand = '0'
        this.previousOperand = '0'
        this.operator = undefined
        this.isPrevOperandSet = false
        miniDisplay.textContent = '\u00a0'
        this.updateDisplay()
    }

    //computes the result based on the two operands
    equal(){
        if(this.operator){
            const result = this.compute()
            this.currentOperand = result.toString()

            this.previousOperand = '0'
            this.operator = undefined
            this.isPrevOperandSet = false
            miniDisplay.textContent = '\u00a0'

            this.updateDisplay()
        }
    }
}

const calculator = new Calculator()

/*
todo 
fix bug where on refresh, user theme option doesn't load.
make automatically load users borwser them on the calculator
*/