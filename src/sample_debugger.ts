export async function main(ns) {
    ns.tprint('Hello, world!')
    ns.tprint('See you in the debugger in 2 seconds...')
    await ns.sleep(2000)
    debugger;
    ns.tprint('Did you get what you want?')
}