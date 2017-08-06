export const log = (x: any, ...args: any[]) => {
  console.log(x, ...args)
  return x
}

export const init = <T>(target: T, source: T) => Object.assign(target, source)
