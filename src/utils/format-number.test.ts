import formatNumber from './format-number'

describe('formatNumber', () => {
  it('should format number', () => {
    const number = 100000

    expect(formatNumber(number)).toMatchInlineSnapshot(`"100,000"`)
  })

  it('should format number with fractions', () => {
    const number = 100000.5

    expect(formatNumber(number)).toMatchInlineSnapshot(`"100,000.5"`)
  })

  it('should format number with options', () => {
    const number = 100000.5

    expect(
      formatNumber(number, { minimumFractionDigits: 2 })
    ).toMatchInlineSnapshot(`"100,000.50"`)
  })
})
