export const fadeIn = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0
  },
  exit: {
    opacity: 0,
    y: 20
  },
  transition: {
    duration: 0.3
  }
}

export const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5
}

export function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
