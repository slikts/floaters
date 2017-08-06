import { Observable, Subject, Scheduler } from 'rxjs/Rx'
// import { animationFrame } from 'rxjs/scheduler/animationFrame'

// const o$ = Observable.create((observer: any) => {
//   console.log(0)
//   observer.next(1)
//   observer.next(2)
//   observer.next(3)
//   observer.complete()
//   console.log(9)
// })
// .observeOn(Scheduler.animationFrame)

// o$.subscribe(console.log)

getMapKeys(map: Map): string[] {
    return Array.from(map.keys());
}
/*

// type El = {
//   prop: number
// }
// const render = (target: El) => (...args) => {
//   target.prop += 1
//   return 'zzz'
//   // return target.prop
// }
// const anim = (target: El) => new Subject().map(render(target))
// const el: El = {
//   prop: 10
// }
// const anim$ = anim(el)
// console.log(anim$)

// const clicks = new Observable(observer => {
//   const handler = (e) => observer.next(e);
//   button.addEventListener('click', handler);
//   return () => button.removeEventListener('click', handler);
// });


// const move = tick$.subscribe(Observable.of(console.log).map)


// const tick$ = Observable.interval(0)

// const subj = new Subject()

// // const bla$ = Observable.of(5)
 
// const subscr = tick$.subscribe(subj)

// subj.map((x: number) => {
//   if (x === 4) {
//     // subscr.unsubscribe()itju
//     subj.complete()
//     console.log(subscr)
//   }
//   return x * 2
// }).delay(1000).subscribe(console.log, console.error, () => {
//   console.log('complete')
//   // subscr.unsubscribe()
//   console.log(subscr)
//   console.log(tick$)
// })

// let a: string = `asd`
// a = 'bsd'


const decorate = (target: {}) => {
  return target
}

// const source = Symbol('source')

// class CancelToken {
//   source: () => {
//     token: CancelToken,
//     cancel: () => void,
//   }
//   constructor(cancel: () => void) {
//     this.source = () => ({
//       token: this,
//       cancel, 
//     })
//   }

// }

class CancelablePromise<T> extends Promise<T> {
  cancel: () => void

  constructor(
    executor: (
      resolve: (value?: T | PromiseLike<T>) => void,
      reject: (reason?: any) => void,
    ) => void,
  ) {
    super((resolve, reject) => {
      let canceled = false
      this.cancel = () => {
        canceled = true
        reject()
      }
      const wrap = (fn: typeof resolve) => (value: any) => { if (!canceled) fn(value) }
      executor(wrap(resolve), wrap(reject))
    })
  }
}

// class CancelablePromise<T> extends Promise<T> {
  
// }

const cancelableFetch = (input: RequestInfo, init?: RequestInit) => {
  return new CancelablePromise((resolve, reject) => {
    fetch(input, init).then(resolve, reject)
  })
}

const cancelToken = new CancelToken(() => {

})

const { token, cancel } = cancelToken.source()


// const cancelableFetch = (cancelToken: Promise<any>, ...args: any[]) => new Promise((resolve, reject) => {
//   fetch(...args).then(results => )
// })
*/
