import { sum } from '../../src/utils/sum'

describe('sum', () => {
  it('test example：should add two numbers', () => {
    expect(sum(1, 2)).toBe(3)
  })
})
