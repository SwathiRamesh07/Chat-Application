const CryptoJS = require("crypto-js");

const SECRET_KEY = process.env.MESSAGE_SECRET || "default-secret-key";

// Encrypt
const encrypt = (text) => {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
};

// // Decrypt
// const decrypt = (cipherText) => {
//   const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
//   return bytes.toString(CryptoJS.enc.Utf8);
// };

module.exports = { encrypt };
                     