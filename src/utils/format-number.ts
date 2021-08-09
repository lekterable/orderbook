const formatNumber = (number: number, options?: Intl.NumberFormatOptions) =>
  number.toLocaleString('en', options)

export default formatNumber
