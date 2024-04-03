async function hashPassword(password) {
    try {
      const hashedPassword = await myHash(password);
      return hashedPassword;
    } catch (error) {
      throw new Error('Error hashing password');
    }
  }
  
  async function comparePassword(password, hashedPassword) {
    try {
      const isMatch = await myCompare(password, hashedPassword);
      return isMatch;
    } catch (error) {
      throw new Error('Error comparing passwords');
    }
  }
  
  async function decryptPassword(hashedPassword) {
    try {
      const decryptedPassword = await myDecrypt(hashedPassword);
      return decryptedPassword;
    } catch (error) {
      throw new Error('Error decrypting password');
    }
  }
  
  async function myHash(password) {
    let hash = 0;
    if (password.length === 0) {
      return hash.toString();
    }
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash &= hash;
    }
    return hash.toString();
  }
  
  async function myCompare(password, hashedPassword) {
    const inputHash = await myHash(password);
    return inputHash === hashedPassword;
  }
  
  async function myDecrypt(hashedPassword) {
    return hashedPassword;
  }
  
  module.exports = { hashPassword, comparePassword, decryptPassword };
  