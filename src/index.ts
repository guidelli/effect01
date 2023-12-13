import { Effect, Console } from 'effect';

const program = Console.log('Hello, World!');

Effect.runSync(program);



const p = Effect.succeed(42)

console.log(Effect.runSync(p));


const divide = (a: number, b: number): Effect.Effect<never, Error, number> =>
  b === 0
    ? Effect.fail(new Error("Cannot divide by zero"))
    : Effect.succeed(a / b)


console.log((()=>{
    try {
        Effect.runSync(divide(3,0))
        
    } catch (error) {
        return error
    }
    })())


// $ExpectType Effect<never, never, number>
const program = Effect.sync(() => {
    console.log("Hello, World!") // side effect
    return 42 // return value
  })