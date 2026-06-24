import { createSmartClsx } from './dist/shared/smart-clsx.js'

// Test 1: '0' should resolve to hashed0
const styles1 = { 0: 'hashed0' }
const smartClsx1 = createSmartClsx(styles1)
const result1 = smartClsx1('0', 'global')
console.log('Test 1 - createSmartClsx({ "0": "hashed0" })(\'0\', \'global\')')
console.log('Expected: hashed0 global')
console.log('Actual:  ', result1)
console.log('Pass:', result1 === 'hashed0 global')
console.log()

// Test 2: empty string should pass through
const styles2 = {}
const smartClsx2 = createSmartClsx(styles2)
const result2 = smartClsx2('')
console.log("Test 2 - createSmartClsx({})('')")
console.log('Expected: (empty string)')
console.log('Actual:  ', `'${result2}'`)
console.log('Pass:', result2 === '')
console.log()

// Test 3: undefined should be skipped by clsx
const result3 = smartClsx2(undefined)
console.log('Test 3 - createSmartClsx({})(undefined)')
console.log('Expected: (empty string)')
console.log('Actual:  ', `'${result3}'`)
console.log('Pass:', result3 === '')
console.log()

// Test 4: false should be skipped by clsx
const result4 = smartClsx2(false)
console.log('Test 4 - createSmartClsx({})(false)')
console.log('Expected: (empty string)')
console.log('Actual:  ', `'${result4}'`)
console.log('Pass:', result4 === '')
console.log()

// Test 5: 0 (number) should pass through
const result5 = smartClsx2(0)
console.log('Test 5 - createSmartClsx({})(0)')
console.log('Expected: (empty string, clsx skips 0)')
console.log('Actual:  ', `'${result5}'`)
console.log('Pass:', result5 === '')
console.log()

// Summary
const allPass = result1 === 'hashed0 global' && result2 === '' && result3 === '' && result4 === '' && result5 === ''
console.log('ALL TESTS PASS:', allPass)
