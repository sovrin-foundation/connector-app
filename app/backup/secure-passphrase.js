// @flow
import { NativeModules } from 'react-native'
const { RNRandomBytes } = NativeModules
import diceware from './eff.js'
const Buffer = require('buffer/').Buffer

// See : https://www.reddit.com/r/crypto/comments/4xe21s/
//
// skip is to make result in this range:
// 0 ≤ result < n* count < 2^31
// (where n is the largest integer that satisfies this equation)
// This makes result % count evenly distributed.
//
// P.S. if (((count - 1) & count) === 0) {...} is optional and for
// when count is a nice binary number (2n). If this if statement is
// removed then it might have to loop a few times. So it saves a
// couple of micro seconds.
export const secureRandom = async (count: number = 6) => {
  const skip = 0x7fffffff - 0x7fffffff % count
  let result
  const numBytes = 64

  const randomBytes = () => {
    return new Promise(function(resolve, reject) {
      RNRandomBytes.randomBytes(numBytes, (err: any, bytes: string) => {
        if (err) {
          reject(err)
        } else {
          //let decoded = atob(bytes)
          const decoded = Buffer.from(bytes, 'base64')
          //console.log("decoded.byteLength: ", decoded.byteLength)
          resolve(decoded)
        }
      })
    })
  }

  let randIndex = numBytes
  let randVals = []
  do {
    if (randIndex >= numBytes) {
      randVals = await randomBytes()
      randIndex = 0
    }
    const randVal = randVals[randIndex++] //.charCodeAt(0)
    result = randVal & 0x7fffffff
  } while (result >= skip)

  return result % count
}

export const getWords = async (
  numWords: number = 12,
  numRollsPerWord: number = 5
) => {
  //'use strict'

  let i, j, words, rollResults, rollResultsJoined

  words = []

  if (!numWords) {
    numWords = 1
  }
  if (!numRollsPerWord) {
    numRollsPerWord = 5
  }

  for (i = 0; i < numWords; i += 1) {
    rollResults = []

    for (j = 0; j < numRollsPerWord; j += 1) {
      // roll a 6 sided die
      const randVal = await secureRandom(6)
      rollResults.push(randVal + 1)
    }

    rollResultsJoined = rollResults.join('')
    words.push(diceware[rollResultsJoined])
  }

  return words
}
