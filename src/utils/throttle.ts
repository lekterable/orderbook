const throttle = (fn: Function, wait: number) => {
  let isCalled = false

  return (...args: any) => {
    if (!isCalled) {
      fn(...args)
      isCalled = true

      setTimeout(() => (isCalled = false), wait)
    }
  }
}

export default throttle
