let sha256 = require('sha256');

const generateHash = (string) => {
    let difficulty = '00000';
    let result     = '';
    let nonce      = 0;
    do {
        result = sha256(string + nonce);
        nonce++;

    } while(result.slice(0, 5) !== difficulty);

    return result;
};

module.exports.generateHash = generateHash;