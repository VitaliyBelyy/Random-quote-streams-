$(document).ready(function() {

	const { Observable, fromEvent, from, timer } = rxjs;
	const { map, mergeMap, startWith, switchMap } = rxjs.operators;
	
	const url = "https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=jsonp&jsonp=?";
	const period = 10000;

	let refreshButton = $('button.new');

	const refreshClickStream = fromEvent(refreshButton, 'click');

	const timerStream = timer(0, period);

	const requestStream = refreshClickStream.pipe(
		startWith('startup click'),
		switchMap(event => timerStream),
		map(() => url)
	);

	const responseStream = requestStream.pipe(
		mergeMap(requestUrl => from($.getJSON(requestUrl))),
		map(({quoteText, quoteAuthor}) => ({quoteText, quoteAuthor}))
	);

	function render(quoteData) {
		let quoteEl = $('blockquote.quote');
		let authorEl = $('p.author');
		let twitterButton = $('.twitter');
		quoteEl.text(quoteData.quoteText);
		authorEl.text(quoteData.quoteAuthor);
		twitterButton.attr('href', 'https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text=' + encodeURIComponent('"' + quoteData.quoteText + '" ' + quoteData.quoteAuthor));
	}

	responseStream.subscribe(data => render(data));
	
	//Animation

	let hueRotationSpeed = 10,
	color = "hsl(hue, 100%, 50%)",
	tick = 0,
	currentHue = 0;

	function anim() {
	  setTimeout(function() {
	  	window.requestAnimationFrame(anim)
	  }, 1000 / 30);

	  filling();

	  ++tick;
	  if (isNaturalNumber(tick / hueRotationSpeed)) {
	    currentHue++;
	  };
	  if (currentHue == 356) {
	    currentHue = 0;
	  }
	}

	anim(); //Calling the animation function

	function filling() {
	  let textColor = color.replace("hue", currentHue);
	  $('.title').css('color', textColor);
	}

	function isNaturalNumber(n) {
	  n = n.toString(); // force the value incase it is not
	  let n1 = Math.abs(n),
	  n2 = parseInt(n, 10);
	  return !isNaN(n1) && n2 === n1 && n1.toString() === n;
	}

})






