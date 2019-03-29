function toBaseN(number, base) {
    nOut.print("Decimal Value: " + number);
    let output = "";
    let quotient = number;
    while (quotient > 0) {
        remainder = quotient % base;
        quotient = Math.floor(quotient / base);
        if (remainder > 9) {
            remainder = String.fromCharCode(remainder+55)
        }
        output += remainder;
    }
    output = output.split("").reverse().join("");
    return output;
}