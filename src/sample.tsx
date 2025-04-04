import { NS } from "@ns";
import React from "/lib/react";

export async function main(ns: NS) {
    ns.disableLog("ALL");
    ns.ui.openTail()
    ns.ui.resizeTail(500, 940)
    ns.ui.moveTail(1020, 25)
    ns.clearLog()

    ns.printRaw(<h1>Hello, world!</h1>)

    // eslint-disable-next-line no-constant-condition
    while (true) {
        await ns.sleep(500);
    }
}