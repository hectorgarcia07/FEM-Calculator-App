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
//Checks to see if users prefered theme is set in localstorage and sets it
//otherwise, check where current theme button is and set it
if(localStorage.getItem('themeCalculator')){
    switchTheme(localStorage.getItem('themeCalculator'))

    //make appropriate radio button checked
    themeSwitcherBtn[localStorage.getItem('themeCalculator')].checked = true
}
else{
    for(radioBtn of themeSwitcherBtn){
        if(radioBtn.checked){
            switchTheme(radioBtn.dataset.radio)
            break;
        }
    }
}

//switches the theme based on given parameter
function switchTheme(theme) {
    // saved theme to localstorage
    localStorage.setItem('themeCalculator', theme)
    html.dataset.theme = `theme-${theme}`
}

//for each radio button give it the ability to switch theme based on it's state
themeSwitcherBtn.forEach( radioBtn => {
    radioBtn.addEventListener('click', event =>{
        switchTheme(radioBtn.dataset.radio)
    })
})

/*  ---      Click Events        ---*/

//updates the current operand and appends number
digitKeys.forEach( digitKey => {
    digitKey.addEventListener('click', event => {
        calculator.updateOperand(digitKey.dataset.digit)
    })
})

//adds a decimal to the operand if it doesn't have one
decimalKey.addEventListener('click', event => {
    calculator.decimal()
})

//Deletes last number in the operand
deleteKey.addEventListener('click', event => {
    calculator.deleteDigit()
})

//performs arithmatic
operationKeys.forEach(operationKey => {
    operationKey.addEventListener('click', event => {
        calculator.operation(operationKey.dataset.operation)
    })
})

//Resets the entire operands and operator
resetKey.addEventListener('click', event => {
    calculator.reset()
})

//calculate's the result
equalKey.addEventListener('click', event => {
    calculator.equal()
})

/*  ---      ButtenPress Events        ---*/

//will listen to keyboard stroke and checks to see if its a
//number, operator, decimal, escape, backspace or enter/equal.
//will also change respective key background color
window.addEventListener('keydown', event => {
    let key = event.key 

    if(/^\d+$/.test(key)){
        const keyDom = document.querySelector(`[data-digit="${key}"]`)
        keyDom.classList.add("active-secondary")
        calculator.updateOperand(event.key)
    }
    else if(key == '/' || key == '*' || key == '-' || key == '+'){
        calculator.operation(key)
        event.preventDefault()
        const keyDom = document.querySelector(`[data-operation="${key}"]`)
        keyDom.classList.add("active-secondary")
    }
    else if(key == '.'){
        calculator.decimal()
        const keyDom = document.querySelector(`[data-decimal]`)
        keyDom.classList.add("active-secondary")
    }
    else if(key == '=' || key == 'Enter'){
        calculator.equal()
        const keyDom = document.querySelector(`[data-equal]`)
        keyDom.classList.add("active-equal")
    }
    else if(key == 'Backspace'){
        calculator.deleteDigit()
        const keyDom = document.querySelector(`[data-delete]`)
        keyDom.classList.add("active-primary")
    }
    else if(key == 'Escape'){
        calculator.reset()
        const keyDom = document.querySelector(`[data-rest]`)
        keyDom.classList.add("active-primary")
    }
})

//will remove the background color and revert it back to its normal state
window.addEventListener('keyup', event => {
    let key = event.key

    if(/^\d+$/.test(key)){
        const keyDom = document.querySelector(`[data-digit="${key}"]`)
        keyDom.classList.remove("active-secondary")
    }
    else if(key == '.'){
        const keyDom = document.querySelector(`[data-decimal]`)
        keyDom.classList.remove("active-secondary")
    }
    else if(key == '/' || key == '*' || key == '-' || key == '+'){
        const keyDom = document.querySelector(`[data-operation="${key}"]`)
        keyDom.classList.remove("active-secondary")
    }
    else if(key == "Backspace" || key == "Escape"){
        const keyDom = document.querySelector(`[data-${key == 'Backspace' ? 'delete' : 'reset'}]`)
        keyDom.classList.remove("active-primary")
    }
    else if(key == '=' || key == 'Enter'){
        const keyDom = document.querySelector(`[data-equal]`)
        keyDom.classList.remove("active-equal")
    }
})

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
            //make if currentOperand is empty then append a 0
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

    //can compute the given operations or updates the opperator and compute later
    //if only 1 operand is set
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
            //if currentOperand isn't provided yet update the operator
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