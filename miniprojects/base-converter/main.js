function toBase10(number, base) {
    output = 0;
    number = number.split('').reverse();
    for (i = 0; i < number.length; i++) {
        digit = number[i];
        if (digit * 1 != digit) { // true if digit is a letter
            digit = digit.toLowerCase().charCodeAt(0) - 87;
        }
        output += Math.pow(base, i) * digit;
    }
    return output;
}

// largest: 9,007,199,254,740,992