import { NS } from "@ns";
import React from 'lib/react';

// alternate:
// import ReactNamespace from 'react/index';
// declare var React: typeof ReactNamespace;

export async function main(ns: NS) {
    const table = <table>
        <tbody>
            <tr><td>r1,c1</td><td>row1,c2</td></tr>
            <tr><td>row1,c1</td><td>Row 2 Column 2</td></tr>
        </tbody>
    </table>
    ns.tprintRaw(table);
}