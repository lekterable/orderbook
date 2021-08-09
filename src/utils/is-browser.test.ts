import isBrowser from './is-browser'

describe('isBrowser', () => {
  let windowSpy: jest.SpyInstance

  beforeEach(() => {
    windowSpy = jest.spyOn(window, 'window', 'get')
  })

  it('should be `false` if window is undefined', () => {
    windowSpy.mockReturnValue(undefined)

    expect(isBrowser()).toBe(false)
  })

  it('should be `true` if window is defined', () => {
    windowSpy.mockReturnValue({})

    expect(isBrowser()).toBe(true)
  })
})
