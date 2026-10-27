import '@testing-library/jest-dom'

const originalWarn = console.warn
let themeWarnings = []

beforeEach(() => {
  themeWarnings = []

  jest.spyOn(console, 'warn').mockImplementation((...args) => {
    if (String(args[0]).startsWith('[theme]')) {
      themeWarnings.push(args[0])
      return
    }

    originalWarn(...args)
  })
})

afterEach(() => {
  expect(themeWarnings).toEqual([])
})
