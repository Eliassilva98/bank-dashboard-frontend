import { css } from 'styled-components'

export const color =
  (path) =>
  ({ theme }) => {
    const keys = path.split('.')
    const value = keys.reduce((acc, key) => acc?.[key], theme.colors)

    if (value === undefined) {
      console.warn(`[theme] color path not found: ${path}`)
    }

    return value
  }

export const spacing =
  (size) =>
  ({ theme }) => {
    const value = theme.spacing[size]

    if (value === undefined) {
      console.warn(`[theme] spacing not found: ${size}`)
    }

    return value
  }

export const fontSize =
  (size) =>
  ({ theme }) => {
    const value = theme.fontSizes[size]

    if (value === undefined) {
      console.warn(`[theme] fontSize not found: ${size}`)
    }

    return value
  }

export const fontWeight =
  (weight) =>
  ({ theme }) => {
    const value = theme.fontWeights[weight]

    if (value === undefined) {
      console.warn(`[theme] fontWeight not found: ${weight}`)
    }

    return value
  }

export const radius =
  (size) =>
  ({ theme }) => {
    const value = theme.radii[size]

    if (value === undefined) {
      console.warn(`[theme] radius not found: ${size}`)
    }

    return value
  }

export const shadow =
  (name) =>
  ({ theme }) => {
    const value = theme.shadows?.[name]

    if (value === undefined) {
      console.warn(`[theme] shadow not found: ${name}`)
    }

    return value
  }

export const transition = (
  properties,
  duration = '0.2s',
  easing = 'ease'
) => css`
  transition: ${properties.map((prop) => `${prop} ${duration} ${easing}`).join(', ')};
`
