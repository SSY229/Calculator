
(function() {
  "use strict";

  // Get elements
  var el = function(element) {
    if (element.charAt(0) === "#") { // If passed an ID...
      return document.querySelector(element); // ... returns single element
    }

    return document.querySelectorAll(element); // Else, returns a nodelist
  };

  // Variables
  var viewer = el("#viewer"), // Calculator screen
    equals = el("#equals"), // Equal button
    nums = el(".num"), // List of numbers
    ops = el(".ops"), // List of operators
    theNum = "", // Current number
    oldNum = "", // First number
    resultNum, // Result
    operator, // + - * /
    decCount = "", // Count of decimal click
	  opCount = "";  // Count of operator sign click;

  // When a number is clicked, get the number
  var setNum = function() {
    if (resultNum) { // If a result was displayed, reset number
        theNum = this.getAttribute("data-num");
        resultNum = "";
        opCount = "";
        decCount = "";
    } else { // Else, add digit to previous number (this is a string)
      theNum += this.getAttribute("data-num");
    }
    
      theNum = parseFloat(theNum); //Convert string to float number (handle 022, .2, 0002)
      viewer.innerHTML = theNum; // Display current number

  };

// When: decimal point is clicked. 
var decPoint = function () {

  var decNum = this.getAttribute("decNum"); //Get the click property

  if (decCount) { //If decimal point is clicked before (to allow only one decimal click per digit)
      viewer.innerHTML = theNum; // Display current number
  }
  else {  //Otherwise 

      if (theNum != "0" && decNum == "." && theNum != "") { 
//Get the decimal number (>=1) if the current number is not '0' and null when decimal is clicked
          theNum = theNum + "."; 
      }
      else if (decNum == "." || theNum == "0") { 
//Get the decimal number (<1) if the current number is '0' when decimal is clicked
          theNum = "0" + ".";
      }
      else {
          theNum = theNum + ".";
      }
      viewer.innerHTML = theNum; // Display current number
  }

  decCount++; // To increase the count of decimal click, showing there is clicked before

};

  // When click the operator, pass number to oldNum and save operator
  var moveNum = function () {

    if (opCount) {  //If operator is clicked before
  decCount = "";  //Reset decimal count
        operator = this.getAttribute("data-ops");  //Get the click property and overwrite the operator before
    }
    else { //Otherwise save the current number to first number and get operator property
        oldNum = theNum;  
        theNum = "";
        decCount = "";
        operator = this.getAttribute("data-ops");
    }

    opCount++; // To increase the count of operator click, showing there is clicked before
    equals.setAttribute("data-result", ""); // Reset result in attribute
};

  // When click equal, calculate result
  var displayNum = function() {

    // Convert string input to numbers
    theNum = parseFloat(theNum);
    oldNum = parseFloat(oldNum);

    // Perform operation
    switch (operator) {
      case "plus":
        resultNum = oldNum + theNum;
        resultNum = parseFloat(parseFloat(resultNum).toFixed(10));
        break;

      case "minus":
        resultNum = oldNum - theNum;
        resultNum =  Math.round(eval(resultNum)*1000000)/1000000;
        break;

      case "times":
        resultNum = oldNum * theNum;
        resultNum =  Math.round(eval(resultNum)*1000000)/1000000; 
        break;

      case "divided by":
        resultNum = oldNum / theNum;
        resultNum = parseFloat(parseFloat(resultNum).toFixed(10));
        break;

        // Keep resultNum as current number
      default:
        resultNum = theNum;
    }

    // If NaN or Infinity returned
    if (!isFinite(resultNum)) {
      if (isNaN(resultNum)) { // If result is not a number; set off by, eg, double-clicking operators
        resultNum = "You broke it!";
      } else { // If result is infinity, set off by dividing by zero
        resultNum = "Look at what you've done";
        el('#calculator').classList.add("broken"); // Break calculator
      }
    }

    // Display result
        resultNum = resultNum.toString();
        viewer.innerHTML = resultNum;
        equals.setAttribute("data-result", resultNum);

    // Now reset oldNum, decimal count, operator count & keep result
    oldNum = 0;
    opCount = "";
    if (resultNum.includes('.')){
        decCount++;
    }
    else{
        decCount = "";
    }
    theNum = resultNum;

  };

  // When click clear button, clear everyting
  var clearAll = function() {
    oldNum = "";
        theNum = "";
        decCount = "";
        opCount = "";
        operator = "";
        viewer.innerHTML = "0";
        equals.setAttribute("data-result", resultNum);
  };

  /* The click events */

  // Add click event to numbers
  for (var i = 0, l = nums.length; i < l; i++) {
    nums[i].onclick = setNum;
  }

  // Add click event to operators
  for (var i = 0, l = ops.length; i < l; i++) {
    ops[i].onclick = moveNum;
  }

  // Add click event to equal sign
  equals.onclick = displayNum;

  // Add click event to decimal button
  el("#dec").onclick = decPoint;

  // Add click event to clear button
  el("#clear").onclick = clearAll;

}());