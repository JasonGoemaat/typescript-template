/* SAMPLE: Using MUI table classes

    I'm trying to figure this out.   Unfortunately some of the bitburner styles
    are hidden in compiled class names, like here:

        <p class="MuiTypography-root MuiTypography-body1 css-140xtch">Hack&nbsp;</p>
    
    This is for the 'Hack' in the Overview window, styled by the theme.  That
    contains several things:

        margin: 0
        font-familyh
        font-weight: 400
        font-size: 1rem
        line-height: 1.5
        color (green - 173,255,47)

    This will create a base table with the MUI classes though
*/
// <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">

import { NS } from "@ns";
import React from "/lib/react";

export async function main(ns: NS) {
    ns.disableLog("ALL");
    ns.ui.openTail()
    ns.ui.resizeTail(800, 540)
    ns.ui.moveTail(1020, 25)
    ns.clearLog()

    let st = {'padding': '1px', 'margin': 0, 'color': 'white',
        'fontWeight': 400, lineHeight: '1.5rem'
    }

    ns.printRaw(
<div className="container">
    <h2>Looks pretty similar for me with their classes</h2>
    <table className="MuiTable-root css-1xsw7rv">
        <tbody className="MuiTableBody-root css-1xnox0e">
            <tr className="MuiTableRow-root css-1dix92e">
                <th className="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium css-wv5f3v-cellNone" scope="row">
                    <p className="MuiTypography-root MuiTypography-body1 css-1w7q4iv">HP&nbsp;
                    </p>
                </th>
                <td className="MuiTableCell-root MuiTableCell-body MuiTableCell-alignRight MuiTableCell-sizeMedium css-1nv618x-cellNone">
                    <p className="MuiTypography-root MuiTypography-body1 css-1w7q4iv">10 / 10
                    </p>
                </td>
                <td className="MuiTableCell-root MuiTableCell-body MuiTableCell-alignRight MuiTableCell-sizeMedium css-1nv618x-cellNone">
                    <p className="MuiTypography-root MuiTypography-body1 css-1w7q4iv">
                    </p>
                </td>
            </tr>
            <tr className="MuiTableRow-root css-1dix92e">
            <th className="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium css-6f2pp2-cell" scope="row">
            <p className="MuiTypography-root MuiTypography-body1 css-17bjo4m">Money&nbsp;
            </p>
            </th>
            <td className="MuiTableCell-root MuiTableCell-body MuiTableCell-alignRight MuiTableCell-sizeMedium css-d7dwfk-cell">
            <p className="MuiTypography-root MuiTypography-body1 css-17bjo4m">$1.000q
            </p>
            </td>
            <td className="MuiTableCell-root MuiTableCell-body MuiTableCell-alignRight MuiTableCell-sizeMedium css-d7dwfk-cell">
            <p className="MuiTypography-root MuiTypography-body1 css-17bjo4m">
            </p>
            </td>
            </tr>
            <tr className="MuiTableRow-root css-1dix92e">
                <th className="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium css-6f2pp2-cell" scope="row">
                    <p className="MuiTypography-root MuiTypography-body1 css-140xtch">Hack&nbsp;</p>
                </th>
                <td className="MuiTableCell-root MuiTableCell-body MuiTableCell-alignRight MuiTableCell-sizeMedium css-d7dwfk-cell">
                    <p className="MuiTypography-root MuiTypography-body1 css-140xtch">246</p>
                </td>
                <td className="MuiTableCell-root MuiTableCell-body MuiTableCell-alignRight MuiTableCell-sizeMedium css-d7dwfk-cell">
                    <p className="MuiTypography-root MuiTypography-body1 css-140xtch"></p>
                </td>
            </tr>
            <tr className="MuiTableRow-root css-1dix92e">
                <th className="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium css-wv5f3v-cellNone" scope="row" colSpan={2} style={{'padding': '2px', 'position': 'relative', 'top': '-3px'}}>
                    <span className="MuiLinearProgress-bar MuiLinearProgress-barColorPrimary MuiLinearProgress-bar1Determinate css-14usnx9" style={{'transform': 'translateX(-75.7862%)'}}>
                    </span>
                </th>
            </tr>
            <tr className="MuiTableRow-root css-1dix92e">
                <th className="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium css-wv5f3v-cellNone" scope="row">
                    <p className="MuiTypography-root MuiTypography-body1 css-1xx3f0g">Str&nbsp;</p>
                </th>
                <td className="MuiTableCell-root MuiTableCell-body MuiTableCell-alignRight MuiTableCell-sizeMedium css-1nv618x-cellNone">
                    <p className="MuiTypography-root MuiTypography-body1 css-1xx3f0g">1</p>
                </td>
                <td className="MuiTableCell-root MuiTableCell-body MuiTableCell-alignRight MuiTableCell-sizeMedium css-1nv618x-cellNone">
                    <p className="MuiTypography-root MuiTypography-body1 css-1xx3f0g"></p>
                </td>
            </tr>
        </tbody>
    </table>
    
    <h2>Now my own without them...</h2>
    <table className="MuiTable-root">
        <tbody className="MuiTableBody-root">
            <tr className="MuiTableRow-root">
                <th className="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium" scope="row">
                    <p className="MuiTypography-root MuiTypography-body1" style={st}>HP&nbsp;</p>
                </th>
                <td className="MuiTableCell-root MuiTableCell-body MuiTableCell-alignRight MuiTableCell-sizeMedium">
                    <p className="MuiTypography-root MuiTypography-body1" style={st}>10 / 10</p>
                </td>
                <td className="MuiTableCell-root MuiTableCell-body MuiTableCell-alignRight MuiTableCell-sizeMedium">
                    <p className="MuiTypography-root MuiTypography-body1" style={st}></p>
                </td>
            </tr>
            <tr className="MuiTableRow-root">
                <th className="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium" scope="row">
                    <p className="MuiTypography-root MuiTypography-body1" style={st}>Money&nbsp;</p>
                </th>
                <td className="MuiTableCell-root MuiTableCell-body MuiTableCell-alignRight MuiTableCell-sizeMedium">
                    <p className="MuiTypography-root MuiTypography-body1" style={st}>$1.000q</p>
                </td>
                <td className="MuiTableCell-root MuiTableCell-body MuiTableCell-alignRight MuiTableCell-sizeMedium">
                    <p className="MuiTypography-root MuiTypography-body1" style={st}></p>
                </td>
            </tr>
            <tr className="MuiTableRow-root">
                <th className="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium" scope="row">
                    <p className="MuiTypography-root MuiTypography-body1" style={st}>Speakers</p>
                </th>
                <td className="MuiTableCell-root MuiTableCell-body MuiTableCell-alignRight MuiTableCell-sizeMedium">
                    <p className="MuiTypography-root MuiTypography-body1" style={st}>For the</p>
                </td>
                <td className="MuiTableCell-root MuiTableCell-body MuiTableCell-alignRight MuiTableCell-sizeMedium">
                    <p className="MuiTypography-root MuiTypography-body1" style={st}>Dead</p>
                </td>
            </tr>
        </tbody>
    </table>
</div>)

    // eslint-disable-next-line no-constant-condition
    // while (true) {
    //     await ns.sleep(500);
    // }
}