// Tim Haygood
// functions.js
// This file contains all code necessary for running the calculator,
// including changing visual elements, base conversions, and parsing and
// displaying results.


// global var to indicate whether the operator has been pressed
var hasPressedOperator = false;
// global var to indicate which operation has been selected
var operation = "";


// Handles switching between calculator tabs
function tabSwitcher(evt,tabName) {
  // Declare all variables
  var i, tabcontent, tablinks;
	
	clearAll();
	
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


// Handles updating input for both input fields and the result field.
function updateInput(number, prefix){
	// the prefix variable is used to determine which table to edit, and re
	if(!prefix){
		var prefix = prefixHandler('c');
	}
	
	// stores the reference to the first image in the table
	var img = document.getElementById(prefix + 1);
	
	// stores the reference to the table, based on the prefix
	if(prefix === 'c'){
		var table = document.getElementById('tableInput')
	}
	else if(prefix ==='1c'){
		var table = document.getElementById('table1Input')
	}
	else{
		var table = document.getElementById('table2Input')
	}
	
	// grabs and stores the current value stored in the table
	var currentVal = parseInt(table.dataset.count);
	if(prefix === '2c'){
		currentVal = 0;
	}
	
	// addes the number entered to currentVal
	var newNum = currentVal + number;
	// sets the table value to the new value
	table.dataset.count = newNum.toString();
	
	// updates the table by iterating through the table and updating each image
	if(newNum === 1) {
		img.src='./media/cuneiform/'+newNum+'.png';
	}
	else{
		// clears the table to ensure no leftover images remain 
		clearInput(prefix);
		// converts the number to base sixty, then converts it to an array to be displayed by the table
		var num = parseBaseSixty(toBaseSixty(newNum));
		
		// updates the table based on the contents of the array
		var i=0, j= num.length-1;
		while(i < num.length) {
			img = document.getElementById(prefix + parseInt(i+1));
			img.src='./media/cuneiform/'+num[j]+'.png'
			i++;
			j--;
		}
	}
}


// converts numbers to base 60, returns array of transliteration
function toBaseSixty(num) {
	// determines how many array elements are needed to represent the number
	// by incrementing a counter for every power of 60 that the number is greater than
	var x = 0;
	while(Math.pow(60, x) < num + 1) {
		x++;
	}
	
	// fills the result array with the number represented in base 60
	var result = new Array(x);
	var j = x-1;
	for(var i=0; i < result.length; i++){
		// determines the number to be placed, starting from the left, moving right
		result[i] = Math.floor(num / (Math.pow(60, j)));
		// takes the remainder to be interpreted next
		num = num % Math.pow(60, j);
		j--;
	}
	return result;
}


// parses the base sixty number so the calculator can represent it, as the image library only
// includes the numbers 1-20, 30, 40, 50, and 60
function parseBaseSixty(numArray){
	// determines how much larger the array needs to be to accomodate the number by incrementing
	// if the number is greater than 20 and not a multiple of 10
	var x = numArray.length;
	for(var i=0; i < numArray.length; i++) {
		if(numArray[i] % 10 !== 0 && numArray[i] > 20) {
			x++;
		}
	}
	
	// fills the new array with numbers that the calculator can display
	var result = new Array(x);
	var j=0, i=0, y;
	while(i < result.length) {
		y = numArray[j] % 10;
		
		// if the number is not a multiple of 10 and is greater than 20, place the nearest 10,
		// then place the remaining number<10 in the index after
		if(y !== 0 && numArray[j] > 20) {
			result[i] = numArray[j] - y;
			result[i+1] = y;
			i += 2;
			j++;
		}
		// otherwise place the number
		else {
			result[i] = numArray[j];
			i++;
			j++;
		}
	}
	return result;
}


// clear the input table for either the cuneiform calculator or the greek calculator
function clearInput(prefix) {
	var img;
	if(prefix.includes('g')){
		for(var i=1; i < 11; i++){
		img = document.getElementById(prefix + i)
		img.src='./media/background.jpg'
		}
	}
	else{
		for(var i=1; i < 9; i++){
			img = document.getElementById(prefix + i)
			img.src='./media/background.jpg'
		}
	}
}

// highlights the selected operator and sets the operation variable 
function setOperatorActive(evt, buttonName) {
	// Get all elements with class="operatorButtons" and remove the class "active"
  buttons = document.getElementsByClassName("operatorButtons");
  for (i = 0; i < buttons.length; i++) {
    buttons[i].className = buttons[i].className.replace(" active", "");
  }

  // set the operator to active 
  operation = buttonName;
  evt.currentTarget.className += " active";
	hasPressedOperator = true;
}



// sets the prefix, based on whether an operator button has been pressed
// used to determine which table is waiting for input
function prefixHandler(language){
	if(language === 'c'){	
		if(hasPressedOperator){
			return '1c';
		}
		else {
			return 'c'
		}
	}
	else {
		if(hasPressedOperator){
			return '1g';
		}
		else {
			return 'g'
		}
	}
}

// returns the result of the two fields, for both languages
function handleOperation(inputOne, inputTwo, lang) {
	var x;
	var negative = 'That resulted in a negative number! \nThe {0} had no concept of negative numbers!';
	var nonInt = 'That didn\'t result in an integer. \nThe {0} were too ambiguous with fractions for them to be \naccurately represented with a calculator.'
	if(lang === 'c'){
		negative = negative.replace('{0}', "Babylonians");
		nonInt = nonInt.replace('{0}', "Babylonians");
	}
	else{
		negative = negative.replace('{0}', "Greeks of Ionia");
		nonInt = nonInt.replace('{0}', "Greeks of Ionia");
	}
	if(operation === 'plus') {
		return inputOne + inputTwo;
	}
	if(operation === 'minus') {
		x = inputOne - inputTwo;
		if(x < 0){
			if(lang === 'c'){
				document.getElementById('errorMessage').innerHTML = negative;
			}
			else {
				document.getElementById('errorMessageG').innerHTML = negative;
			}
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
			if(lang === 'c'){
				document.getElementById('errorMessage').innerHTML = nonInt;
			}
			else {
				document.getElementById('errorMessageG').innerHTML = nonInt;
			}
		}
		else{
			return x;
		}
	}
}

// clears all fields, resets operator variables, basically clears the whole calculator
function clearAll() {
	clearInput('c');
	clearInput('1c');
	clearInput('2c');
	clearInput('g');
	clearInput('1g');
	clearInput('2g');
	document.getElementById('tableInput').dataset.count = 0;
	document.getElementById('table1Input').dataset.count = 0;
	document.getElementById('table2Input').dataset.count = 0;
	document.getElementById('tableInputG').dataset.count = 0;
	document.getElementById('table1InputG').dataset.count = 0;
	document.getElementById('table2InputG').dataset.count = 0;
	hasPressedOperator = false;
	operation = "";
	buttons = document.getElementsByClassName("operatorButtons");
  for (i = 0; i < buttons.length; i++) {
    buttons[i].className = buttons[i].className.replace(" active", "");
  }
	document.getElementById('errorMessage').innerHTML = "";
	document.getElementById('errorMessageG').innerHTML = "";
}



// 	Greek functions 


// handles input for both fields and the solution field
function updateGreekInput(number, prefix){
	
	// handles printing the solution
	if(prefix === '2g'){
		// stores a reference to the respective tables
		var table = document.getElementById('table2InputG');
		var inputOneTable = document.getElementById('tableInputG');
		var inputTwoTable = document.getElementById('table1InputG');
		// stores the decimal values of each input
		var inputOne = parseGreek(inputOneTable.dataset.count.split(' '));
		var inputTwo = parseGreek(inputTwoTable.dataset.count.split(' '));
		// converts the result to greek, represented as an array
		var result = decimalToGreek(handleOperation(inputOne, inputTwo, 'g'));
		// displays the solution
		var i=0, j= result.length-1;
		while(i < result.length) {
			// prints error message if an accent mark was placed last in one of the input boxes
			if(result[j] === "NaN"){
				document.getElementById('errorMessageG').innerHTML = "Accent marks can't come last! Try again.";
				clearInput('2g');
				break;
			}
			img = document.getElementById(prefix + parseInt(i+1));
			img.src='./media/greek/'+result[j]+'.png'
			i++;
			j--;
		}
	}
	else{
		// stores a reference to the table, based on the prefix
		prefix = prefixHandler('g');
		if(prefix === 'g'){
			var table = document.getElementById('tableInputG');
		}
		else{
			var table = document.getElementById('table1InputG');
		}
		// updates the table data string by concat-ing the most recent input
		if(table.dataset.count === '0') {
			table.dataset.count = number.toString();
		}
		else{
			table.dataset.count += ' ' + number.toString();
		}
		// updates the table, just as it did in cuneiform
		clearInput(prefix);
		var num = table.dataset.count.split(' ');
		var i=0, j= num.length-1;
		while(i < num.length) {
			img = document.getElementById(prefix + parseInt(i+1));
			img.src='./media/greek/'+num[j]+'.png'
			i++;
			j--;
		}		
	}
}

// converts greek input to a decimal value
function parseGreek(num){
	var decSolution = 0, i=0, currentNum;
	while(i < num.length){
		currentNum = parseInt(num[i])
		// multiplies current sum by 10,000 if an M is seen
		if(currentNum === 10000){
			decSolution += (decSolution * 10000) - decSolution;
			i++;
		}
		// multiplies the following number by 1000 and adds it to the solution
		// returns if nothing comes after the accent mark, and throws an error
		else if(currentNum === 1000){
			try{
				decSolution += parseInt(num[i+1]) * 1000
				i += 2;
			} catch(error){
				return 0;
			}
		}
		// adds the current number to the solution
		else{
			decSolution += currentNum;
			i++;
		}
	}
	return decSolution;
}

// simple function to filer null or '0' elements from arrays
function removeZeroes(array){
	var result = new Array();
	for(var i=0; i< array.length; i++){
		if(array[i] && array[i] !== '0'){
			result.push(array[i])
		}
	}
	return result;
}

// converts a decimal number to its greek representation by running through the string backwards,
// multiplying each number by a power of 10 as it moves
function decimalToGreek(number){
	var x = new Array();
	var y = number.toString();
	var i = y.length-1;
	var decimal = 1;
	var nextNum;
	var overFlowArray = new Array();
	while(i >= 0){
		if(number >= 10000){
			// finds the greek representation of the number coming before the M will, then pushes the M to the array
			overFlowArray = decimalToGreek(parseInt(y.substring(0,y.length-4)))
			overFlowArray.push("10000")
			// sets the number to what would come after the M
			number = parseInt(y.substring(y.length-4));
			y = number.toString();
			i = y.length-1;
		}
		else if(decimal % 1000 === 0){
			x.push((y.charAt(i) * decimal / 1000).toString());
			x.push("1000")
			i--;
			decimal *= 10;
		}
		else {
			nextNum = y.charAt(i) * decimal;
			x.push(nextNum.toString());
			i--;
			decimal *= 10;
		}
	}
	if(overFlowArray){
		return removeZeroes(overFlowArray.concat(x.reverse()));
	}
	else{
		removeZeroes(x.reverse())
	}
}