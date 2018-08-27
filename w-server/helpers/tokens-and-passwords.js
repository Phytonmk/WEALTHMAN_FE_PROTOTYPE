const salt = 'super salt'

const crypto = require('crypto')

const genAccessToken = (user) => {
  const token = 
    crypto.createHash('md5')
    .update(
      salt +
      user._id +
      salt +
      (new Date).getTime() +
      salt +
      (user.password_hash || salt) +
      salt
    ).digest("hex")
  return token
}

const genConfirmToken = (token) => crypto.createHash('md5').update(token + Math.random() + salt + token + Math.random() + salt).digest("hex")

const passwordHash = (password) => crypto.createHash('md5').update(salt + password + salt).digest("hex")

const newPassword = (length=16, charactersCase="different", alphabet="abcdefghijklmnopqrstuvwxyz1234567890") => {
  let result = ''
  for (let i = 0; i < 256 && i < length; i++) {
    let newCharacter = alphabet[Math.floor(Math.random() * alphabet.length)]
    switch (charactersCase) {
      case 'upper':
        newCharacter = newCharacter.toUpperCase()
        break
      case 'different':
        newCharacter = Math.random() > 0.5 ? newCharacter.toUpperCase() : newCharacter
        break
    }
    result += newCharacter
  }
  return result
}

module.exports = {
  genAccessToken,
  passwordHash,
  genConfirmToken,
  newPassword,
}