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
        
    } catch (error: any) {
       return error.message
    }
    })())


// $ExpectType Effect<never, never, number>
const  p2 = Effect.sync(() => {
    console.log("Hello, World!") // side effect
    return 42 // return value
  })

Effect.runSync(p2);

// $ExpectType Effect<never, UnknownException, any>
const p3 = Effect.try(
    () => JSON.parse("") // JSON.parse may throw for bad input
)


console.log((()=>{
    try {
        Effect.runSync(p3)
    } catch (error: any) {
        return error.message
    }
})())


const p4= Effect.try({
    try: ()=>JSON.parse(''),
    catch: unknown=>new Error(`something went wrong ${unknown}`)
})


Effect.runSync(p4);