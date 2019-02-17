var hasPressedOperator = false;
var operation = "";


// Handles switching between calculator tabs
function tabSwitcher(evt,tabName) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}

function updateInput(language, number, prefix){
	if(!prefix){
		var prefix = prefixHandler();
	}
	var img = document.getElementById(prefix + 1);
	if(prefix === 'c'){
		var table = document.getElementById('tableInput')
	}
	else if(prefix ==='1c'){
		var table = document.getElementById('table1Input')
	}
	else{
		var table = document.getElementById('table2Input')
	}
	var currentVal = parseInt(table.dataset.count);
	if(prefix === '2c'){
		currentVal = 0;
	}
	var newNum = currentVal + number;
	table.dataset.count = newNum.toString();
	if(newNum === 1) {
		img.src='./media/'+language+'/'+newNum+'.png';
	}
	else{
		clearInput(prefix);
		var num = parseBaseSixty(toBaseSixty(newNum));
		var i=0, j= num.length-1;
		while(i < num.length) {
			img = document.getElementById(prefix + parseInt(i+1));
			img.src='./media/'+language+'/'+num[j]+'.png'
			i++;
			j--;
		}
	}
}


// converts numbers to base 60, returns array of transliteration
function toBaseSixty(num) {
	var x = 0;
	while(Math.pow(60, x) < num + 1) {
		x++;
	}
	var result = new Array(x);
	var j = x-1;
	for(var i=0; i < result.length; i++){
		result[i] = Math.floor(num / (Math.pow(60, j)));
		num = num % Math.pow(60, j);
		j--;
	}
	console.log(result);
	return result;
}


function parseBaseSixty(numArray){
	var x = numArray.length;
	for(var i=0; i < numArray.length; i++) {
		if(numArray[i] % 10 !== 0 && numArray[i] > 20) {
			x++;
		}
	}
	var result = new Array(x);
	var j=0, i=0, y;
	while(i < result.length) {
		y = numArray[j] % 10;
		if(y !== 0 && numArray[j] > 20) {
			result[i] = numArray[j] - y;
			result[i+1] = y;
			i += 2;
			j++;
		}
		else {
			result[i] = numArray[j];
			i++;
			j++;
		}
	}
	// result = removeZeroes(result);
	return result;
}

function clearInput(prefix) {
	var img;
	for(var i=1; i < 9; i++){
		img = document.getElementById(prefix + i)
		img.src='./media/background.jpg'
	}
}

function removeZeroes(array) {
	var x=array.length;
	for(var i=0; i < array.length; i++){
		if(array[i] === 0){
			x--;
		}
	}
	zeroLess = new Array(x);
	var j=0, k=0;
	while(j < zeroLess.length) {
		 if(array[k] !== 0){
			 zeroLess[j] = array[k]
			 j++;
			 k++;
		 }
		 else {
			 k++;
		 }
	}
	return zeroLess;
}

function setOperatorActive(evt, buttonName) {
	// Get all elements with class="operatorButtons" and remove the class "active"
  buttons = document.getElementsByClassName("operatorButtons");
  for (i = 0; i < buttons.length; i++) {
    buttons[i].className = buttons[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  operation = buttonName;
  evt.currentTarget.className += " active";
	hasPressedOperator = true;
}


function prefixHandler(){
	if(hasPressedOperator){
		return '1c';
	}
	else {
		return 'c'
	}
}

function handleOperation() {
	var inputOne = parseInt(document.getElementById('tableInput').dataset.count);
	var inputTwo = parseInt(document.getElementById('table1Input').dataset.count);
	var x;
	console.log(inputOne);
	console.log(inputTwo);
	console.log(operation);
	if(operation === 'plus') {
		return inputOne + inputTwo;
	}
	if(operation === 'minus') {
		x = inputOne - inputTwo;
		if(x < 0){
			alert('That resulted in a negative number! \nThe Babylonians had no concept of negative numbers!');
		}
		else {
			return x;
		}
	}
	if(operation === 'multiply') {
		return inputOne * inputTwo;
	}
	if(operation === 'divide') {
		x = inputOne / inputTwo;
		if(Number.isInteger(x) === false) {
			alert('Can\'t do this yet. Sorry.');
		}
		else{
			return x;
		}
	}
}

function clearAll() {
	clearInput('c');
	clearInput('1c');
	clearInput('2c');
	document.getElementById('tableInput').dataset.count = 0;
	document.getElementById('table1Input').dataset.count = 0;
	document.getElementById('table2Input').dataset.count = 0;
	console.log(document.getElementById('table2Input').dataset.count);
	hasPressedOperator = false;
	operation = "";
	buttons = document.getElementsByClassName("operatorButtons");
  for (i = 0; i < buttons.length; i++) {
    buttons[i].className = buttons[i].className.replace(" active", "");
  }
}