const eventContainer = document.getElementsByClassName('theme-switches')[0]
const btnEventContainer = document.getElementsByClassName('btn-keys')[0]
const inputScreen = document.getElementById('screen-input')

const html = document.querySelector('html');
html.dataset.theme = `theme-one`;

function switchTheme(theme) {
  html.dataset.theme = `theme-${theme}`;
}

//when user clicks on radio button the event will bubble up and this
//will capture it and change theme accordingly
eventContainer.addEventListener('click', event => {
  if(event.target.id == 'theme-one'){
    switchTheme('one')
  }
  else if(event.target.id == 'theme-two'){
    switchTheme('two')
  }
  else if(event.target.id == 'theme-three'){
    switchTheme('three')
  }
})

btnEventContainer.addEventListener('click', event => {
  let key = event.target.dataset.key
  console.log(key)

  if(key){
    switch(key){
      case 'del':
        deleteKey()
        break
      case key.match(/\d/).input:
        appendNumber(key)
        break
    }
  }
})

//removes last char in input
function deleteKey(){
  let value = inputScreen.value.slice(0, -1)
  
  if(value == ''){
    value = 0
  }

  inputScreen.value = value
}

//appends number to the input
function appendNumber(number){
  if (inputScreen.value == '0'){
    inputScreen.value = number
  }
  else{
    inputScreen.value = inputScreen.value + number

  }
}