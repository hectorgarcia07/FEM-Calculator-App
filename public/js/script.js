const html = document.querySelector('html');
html.dataset.theme = `theme-one`;

function switchTheme(theme) {
  html.dataset.theme = `theme-${theme}`;
  console.log(theme)
}



console.log('sa')