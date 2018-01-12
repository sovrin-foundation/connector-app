// @flow

// We need to decide on format for error codes
// there is a convention in HTTP error codes is that all errors
// starting from 4xx are client side errors and 5xx are server side errors
// we also need to have codes in some logical sequence
// Here is the proposal for that sequence of Error codes
// 1xxxx = data validation error
// where first two `xx` denotes the area of code in which error occurred
// and third x denotes which functionality of that particular area
// and last x denotes which parameter failed
// 2xxxx = libindy exceptions
// 3xxxx = something else
// ----------
// There can another proposal where we just write a detailed error message
// and assign any type of sequential number to error codes
// error code are still needed because we need to take different actions
// for different error codes and we need to match codes, we can do string
// comparisons as well, but tracking code will be bit easier
//
// ---------------
// There can be another way of writing error codes
// where we will write error codes with abbreviated feature
// for example if validation error occurs in user onboarding with agency
// we can write error code as UO-100 where UO- stands for user onboarding
// 1 stands for validation error, 0 stands which part of onboarding
// and last 0 stands for which parameter of part of onboarding
//
// There are advantages and disadvantages to all the approaches
//

export const CLAIM_STORAGE_ERROR = (e?: Error) => ({
  code: 'C-20001',
  message: `Failed to store claim ${e ? e.message : ''}`,
})

export const CONNECTION_HISTORY_STORAGE_ERROR = (e?: Error) => ({
  code: 'C-20002',
  message: `Failed to store connection history ${e ? e.message : ''}`,
})
