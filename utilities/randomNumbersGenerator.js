/**
 * ### Description
 * Generates a random number of variable length using a prefix that is passed;
 * @param {string} prefix - prefix to be used when creating random number.
 * @param {number} length - the length of the number to create. 
 * @returns {string}
 */
exports.randomNumberGenerator = function (prefix, length){
    let randomNumber = prefix;

    while (randomNumber.length <= length){
        randomNumber += Date.now().toString().slice(6, 8);
        if(randomNumber.length > length){
            randomNumber = randomNumber.slice(0, randomNumber.length-1);
        }
    }

    return randomNumber
}