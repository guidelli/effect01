import { Effect, Console } from 'effect';
import * as NodeFS from "node:fs"

const pConsoleLog = Console.log('Hello, World!');

Effect.runSync(pConsoleLog);


const pSucceed = Effect.succeed(42)


// $ExpectType Effect<never, string, never>
const pFail = Effect.fail("my error")

const divide = (a: number, b: number): Effect.Effect<never, Error, number> =>
  b === 0
    ? Effect.fail(new Error("Cannot divide by zero"))
    : Effect.succeed(a / b)


// $ExpectType Effect<never, never, number>
const  pSync = Effect.sync(() => {
    console.log("Hello, World!") // side effect
    return 42 // return value
  })


// $ExpectType Effect<never, UnknownException, any>
const pTry = Effect.try(
    () => JSON.parse("") // JSON.parse may throw for bad input
)

// $ExpectType Effect<never, Error, any>
const pTryCatch= Effect.try({
    try: ()=>JSON.parse(''),
    catch: unknown=>new Error(`something went wrong ${unknown}`)
})


// $ExpectType Effect<never, never, string>
const pPromise = Effect.promise<string>(
    () =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve("Async operation completed successfully!")
        }, 2000)
      })
  )

// $ExpectType Effect<never, UnknownException, Response>
const pTryPromise = Effect.tryPromise(() =>
  fetch("https://jsonplaceholder.typicode.com/todos/1")
)


// $ExpectType Effect<never, Error, Response>
const pTryCatchPromise = Effect.tryPromise({
    try: () => fetch("https://jsonplaceholder.typicode.com/todos/1"),
    catch: (unknown) => new Error(`something went wrong ${unknown}`) // remap the error
  })


// $ExpectType Effect<never, Error, Buffer>
const pAsync = Effect.async<never, Error, Buffer>((resume) => {
    NodeFS.readFile("todos.txt", (error, data) => {
      if (error) {
        resume(Effect.fail(error))
      } else {
        resume(Effect.succeed(data))
      }
    })
  });


// Lazy evaluation
(()=>{
    let i = 0     
    const bad = Effect.succeed(i++)     
    const good = Effect.suspend(() => Effect.succeed(i++))
     
    console.log(Effect.runSync(bad)) // Output: 0
    console.log(Effect.runSync(bad)) // Output: 0
     
    console.log(Effect.runSync(good)) // Output: 1
    console.log(Effect.runSync(good)) // Output: 2
})();



// Handling Circular Dependencies
(()=>{
    const blowsUp = (n: number): Effect.Effect<never, never, number> =>
      n < 2
        ? Effect.succeed(1)
        : Effect.zipWith(blowsUp(n - 1), blowsUp(n - 2), (a, b) => a + b)
     
    // console.log(Effect.runSync(blowsUp(32))) // crash: JavaScript heap out of memory
     
    const allGood = (n: number): Effect.Effect<never, never, number> =>
      n < 2
        ? Effect.succeed(1)
        : Effect.zipWith(
            Effect.suspend(() => allGood(n - 1)),
            Effect.suspend(() => allGood(n - 2)),
            (a, b) => a + b
          )
     
    console.log(Effect.runSync(allGood(32))) // Output: 3524578
})();



// Unifying Return Type
(()=>{
// $ExpectType (a: number, b: number) => Effect<never, never, number> | Effect<never, Error, never>
const ugly = (a: number, b: number) =>
  b === 0
    ? Effect.fail(new Error("Cannot divide by zero"))
    : Effect.succeed(a / b)
 
// $ExpectType (a: number, b: number) => Effect<never, Error, number>
const nice = (a: number, b: number) =>
  Effect.suspend(() =>
    b === 0
      ? Effect.fail(new Error("Cannot divide by zero"))
      : Effect.succeed(a / b)
  )
})()