const quoteDisplayElement = document.getElementById('quoteDisplay');
const quoteInputElement = document.getElementById('quoteInput');
const reload = document.querySelector('.reload');
const timerElement = document.getElementById('timer');
const themeToggler = document.querySelector('.theme-toggler');
const body = document.querySelector('body');
const wpmElement = document.querySelector('.wpm');
let quotes;

quoteInputElement.addEventListener('input', () => {
	let correct = false;
	const arrayQuote = quoteDisplayElement.querySelectorAll('span');
	const arrayInput = quoteInputElement.value.split('');
	arrayQuote.forEach((char, indx) => {
		const currentChar = arrayInput[indx];
		if(currentChar == null){
			arrayQuote[indx].classList.remove('correct');
			arrayQuote[indx].classList.remove('incorrect');
			correct = false;

		}else if(currentChar === arrayQuote[indx].innerText){
			arrayQuote[indx].classList.add('correct');
			arrayQuote[indx].classList.remove('incorrect');
			correct = true;
		}else{
			arrayQuote[indx].classList.remove('correct');
			arrayQuote[indx].classList.add('incorrect');
			correct = false;
		}})
		if(correct) {
			showQuote();
			wpmElement.innerHTML = `0 WPM`;
			return;
		};

		wpm(arrayInput.length)

});

function getQuote(){
		return fetch('https://dummyjson.com/quotes')
		.then(res => res.json())
		.then(data => data.quotes);
	
}

async function showQuote(){
	quotes = await getQuote();
	quoteDisplayElement.innerHTML = null;
	const randomIndex = Math.floor(Math.random() * quotes.length);
	const quote = quotes[randomIndex].quote;
	quote.split('').forEach(char => {
		const spans = document.createElement('span');
		spans.innerText = char;
		// spans.classList.add('correct');
		quoteDisplayElement.appendChild(spans);
	})
	quoteInputElement.value = null;
	startTimer();
}

// Timer
let startTime;
let timerInterval; 

function startTimer() {
    timerElement.innerText = 0;
    startTime = new Date();
    clearInterval(timerInterval); // clear previous before starting new
    timerInterval = setInterval(() => {
        timerElement.innerText = `${getCorrectTime()} second`;
    }, 1000);
}

function getCorrectTime(){
	return Math.floor((new Date() - startTime) / 1000);
}

showQuote();

// Theme toggler
themeToggler.addEventListener('click', () => {
	const isDark = body.classList.toggle('dark-theme');
	localStorage.setItem('theme', isDark ? 'dark' : 'light');
	themeToggler.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>'
})



// Word per minute feature
let totalWpm;
function wpm(chlen){
	 const elapsedMinutes = getCorrectTime() / 60; // 
    if (elapsedMinutes === 0) return;

     totalWpm = Math.round((chlen / 5) / elapsedMinutes);
	
		wpmElement.innerText = `${totalWpm} WPM`;
	

}

reload.addEventListener('click', () => {
	showQuote();
	startTime = 0;
	wpmElement.innerText = "0 WPM";
})