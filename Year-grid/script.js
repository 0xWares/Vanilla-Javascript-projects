const dots = document.querySelectorAll('.dots');
const gridGallery = document.querySelector('.grid-gallery');
const quote = document.querySelector('.quote');
const info = document.querySelector('.info');
let id = 1;
const dates = [];

const start = new Date(new Date().getFullYear(), 0, 1); // Jan 1
const today = new Date();
// console.log(start);


for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
  dates.push(new Date(d)); 
  document.getElementById(id.toString()).classList.add('active');
  id++;
}
const today_date = document.getElementById(dates.length.toString());
today_date.classList.add('today');

// console.log(dates);

//Check if the current year is a leap year

function isALeap(){
  const year = new Date().getFullYear();
  // console.log(year);
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  
}

// If it is a leap year, remove the 365th day from the grid
if(isALeap() != false){
  const newDiv = document.createElement('div');
  newDiv.setAttribute('id', '366');
  newDiv.classList.add('dots');
  gridGallery.appendChild(newDiv);
}

// Calculate the percentage of the year that has passed
const percentage_passed = ((dates.length / (isALeap() ? 366 : 365)) * 100).toFixed(0);

// Day's remaining in the year
const days_left = (isALeap() ? 366 : 365) - dates.length;
info.innerText = `${days_left} Days left  |  ${percentage_passed}% passed`;

// mouseover event listener for the dots
dots.forEach(dot => {
  dot.addEventListener('click', (e) => {
    const hoverElementDate = dates[parseInt(e.target.id) - 1];
    console.log(hoverElementDate);
    
    
  });
});


//Motivational quote of the day

function getQuote(){
  try{
    fetch('https://api.api-ninjas.com/v2/quotes?categories=success%2Cwisdom',{
      headers: {
        'X-Api-Key': 'JqVXTomVU0CtpkX03FLouFnPRd1x21J5ES6bQw3D'
      }
    }).then(response => response.json()).then(data => {
      quote.innerText = `${data[0].quote} - ${data[0].author}`;
    }
    )

  }catch(error){
    console.log(error);
  }
}
getQuote();