// const jest = require('jest')
const showFlag = require('./flag.js')
const make2darr = require('./make2darr.js')

test('Show flag', () => {
  expect(showFlag()).toBe('flag');
});


test('Make Array', () => {
  expect(make2darr(1,1)).toEqual([[0]]);
});

