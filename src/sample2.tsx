/* SAMPLE: Bootstrap usage with react component

    1. Must run 'bootstrap.js' to create a <style> element from the CDN download, link doesn't work (probably cross-origin issue)
    2. 
*/
// <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">

import { NS } from "@ns";
import React from "/lib/react";

export async function main(ns: NS) {
    let done = false

    // let link = document.getElementById('bootstrapLink')
    // if (!link) {
    //     console.log('link not set!')
    // }
    // link = null
    // let message = 'hmmm..'
    // if (!link) {
    //     link = Object.assign(document.createElement('link'), {
    //         href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
    //         integrity: "sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH",
    //         crossorigin: "anonymous",
    //         id: 'bootstrapLink',
    //     })
    //     link.onload = () => {
    //         console.log('loaded!')
    //         message = 'loaded!'
    //         done = true
    //     }
    //     link.onerror = err => {
    //         message = `error!  ${err}`
    //         console.log(message)
    //         done = true
    //     }
    //     document.head.appendChild(link)
    // }

    ns.disableLog("ALL");
    ns.ui.openTail()
    ns.ui.resizeTail(800, 940)
    ns.ui.moveTail(1020, 25)
    ns.clearLog()

    ns.tprint('waiting for styles to load...')
    while (!done) {
        if (document.getElementById('bootstrapStyles')) {
            ns.tprint('detected that bootstrapStyles was added!')
            done = true
            break
        }
        await ns.sleep(50)
    }

    //  style={{ "fontSize": "1rem"}}
    ns.printRaw(<div className="container">
        <h1>Hello, world!</h1>
        <div className="alert alert-primary"role="alert">
            A simple primary alert—check it out!
        </div>
    </div>)

    // eslint-disable-next-line no-constant-condition
    // while (true) {
    //     await ns.sleep(500);
    // }
}