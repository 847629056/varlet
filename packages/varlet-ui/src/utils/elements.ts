import { isNumber, isString, toNumber } from './shared'

export function getTop(element: HTMLElement): number {
  const { top } = element.getBoundingClientRect()

  return top + (document.body.scrollTop || document.documentElement.scrollTop)
}

export function getScrollTop(element: Element | Window): number {
  const top = 'scrollTop' in element ? element.scrollTop : element.pageYOffset

  // iOS scroll bounce cause minus scrollTop
  return Math.max(top, 0)
}

export function getLeft(element: HTMLElement): number {
  const { left } = element.getBoundingClientRect()
  return left + (document.body.scrollLeft || document.documentElement.scrollLeft)
}

export function inViewport(element: HTMLElement): boolean {
  const { top, bottom, left, right } = element.getBoundingClientRect()

  const xInViewport = left < window.innerWidth && right > 0
  const yInViewport = top < window.innerHeight && bottom > 0

  return xInViewport && yInViewport
}

export function getTranslate(el: HTMLElement) {
  const { transform } = window.getComputedStyle(el)
  return +transform.slice(transform.lastIndexOf(',') + 2, transform.length - 1)
}

export function isHidden(el: HTMLElement) {
  const { width, height } = el.getBoundingClientRect()

  return width === 0 && height === 0
}

export function getParentScroller(el: HTMLElement): HTMLElement | Window {
  let element = el

  while (element) {
    if (!element.parentNode) {
      break
    }

    element = element.parentNode as HTMLElement

    if (element === document.body || element === document.documentElement) {
      break
    }

    const scrollRE = /(scroll|auto)/
    const { overflowY } = window.getComputedStyle(element)

    if (scrollRE.test(overflowY)) {
      return element
    }
  }

  return window
}

// example 1rem
export const isRem = (value: unknown) => isString(value) && value.endsWith('rem')

// example 1 || 1px
export const isPx = (value: unknown) => (isString(value) && value.endsWith('px')) || isNumber(value)

// example 1%
export const isPercent = (value: unknown) => isString(value) && value.endsWith('%')

// example return 1
export const toPxNum = (value: unknown): number => {
  if (isNumber(value)) {
    return value
  }

  if (isPx(value)) {
    return +(value as string).replace('px', '')
  }

  if (isRem(value)) {
    const num = +(value as string).replace('rem', '')
    const rootFontSize = window.getComputedStyle(document.documentElement).fontSize

    return num * parseFloat(rootFontSize)
  }

  if (isString(value)) {
    return toNumber(value)
  }

  return 0
}

// example return 1px | 1%
export const toSizeUnit = (value: unknown) => {
  if (value == null) {
    return null
  }

  if (isPercent(value)) {
    return value
  }

  return `${toPxNum(value)}px`
}

export function requestAnimationFrame(fn: FrameRequestCallback): number {
  return window.requestAnimationFrame ? window.requestAnimationFrame(fn) : window.setTimeout(fn, 16)
}

export function cancelAnimationFrame(handle: number): void {
  window.cancelAnimationFrame ? window.cancelAnimationFrame(handle) : window.clearTimeout(handle)
}

export function nextTickFrame(fn: FrameRequestCallback) {
  requestAnimationFrame(() => {
    requestAnimationFrame(fn)
  })
}
