import { NS } from "@ns";

// need this if we want to tprint the contract or convert to JSON
// eval("BigInt.prototype.toJSON = function() { return this.toString(); };")

/** @param {NS} ns */
export async function main(ns: NS) {
    // from my save with one of each type on 'home'
    let contractFiles = ns.ls('home', '.cct')
    ns.tprint('Files:', contractFiles)
    for (let i = 0; i < contractFiles.length; i++) {
        let filename = contractFiles[i]
        // this is 15gb
        let contract = ns.codingcontract.getContract(filename, 'home')

        // individual methods are 5gb each, so could ust use type and data, don't
        // need description to solve
        ns.tprint(`${filename}: ${ns.codingcontract.getContractType(filename, 'home')}`)
        ns.tprint(ns.codingcontract.getData(filename, 'home'))
        ns.tprint(ns.codingcontract.getDescription(filename, 'home'))
    }

    /*
    contract-132199.cct: Total Ways to Sum II
    Data: [159,[2,3,5,7,9,10,11,12,13,14,18,19]]
    
    How many different distinct ways can the number 159 be written as a sum of integers contained in the set:
    
     [2,3,5,7,9,10,11,12,13,14,18,19]?
    
     You may use each integer in the set zero or more times.
    */
}

const contractSolvers = {
    'Total Ways to Sum II': (data: any) => {
        // sample data: [159,[2,3,5,7,9,10,11,12,13,14,18,19]]
        // how many ways to total 159 given numbers in the array
        const targetNumber = data[0]
        const integers = data[1]
        const ways = new Array(targetNumber + 1)
        ways[0] = 1 // 1 way to get to start
        for (let i = 0; i < targetNumber; i++) {
            if (ways[i]) {
                for (let j = 0; j < integers.length; j++) {
                    const num = i + integers[j]
                    if (num <= targetNumber) {
                        ways[num] = (ways[num] || 0) + ways[i]
                    }
                }
            }
        }
        return ways[targetNumber] || 0
    }
}
