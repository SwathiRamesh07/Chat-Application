import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.REACT_APP_MESSAGE_SECRET;
console.log("Frontend SECRET_KEY:", SECRET_KEY);
const decryptMessage = (cipherText) => {
  try {
    if (!cipherText) return "";
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted || "[Decryption failed]";
  } catch (error) {
    console.error("Decryption error:", error, "for cipherText:", cipherText);
    return "[Decryption failed]";
    
  }
};

export default decryptMessage;
