
function base10() { // Gets input from boxes when button is clicked
    let number = document.getElementById("base10-number").value;
    let base = document.getElementById("base10-base").value;
    if (base >= 2 && base <= 16) {
        simpleOut.print("\nConverting to Base 10");
        simpleOut.print("Start Number: "+number);
        simpleOut.print("Start Base: " + base);
        let output = toBase10(number, base)
        simpleOut.print("Result: " + output);
    } else {
        simpleOut.print("Base must be >= 2 and <= 16");
    }
}

function baseN() {
    let number = document.getElementById("baseN-number").value;
    let baseInitial = document.getElementById("baseN-base-initial").value;
    let baseFinal = document.getElementById("baseN-base-final").value;
    if (baseInitial >= 2 && baseInitial <= 16 && baseFinal >= 2 && baseFinal <= 16) {
        nOut.print("\nConverting to Base "+baseFinal);
        nOut.print("Start Number: "+number);
        nOut.print("Start Base: " + baseInitial);
        let output = toBaseN(toBase10(number, baseInitial), baseFinal);
        nOut.print("Result: " + output);
    } else {
        nOut.print("Base must be >= 2 and <= 16");
    }
}