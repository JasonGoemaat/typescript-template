import { NS } from "@ns";

// pass host and filename

/** @param {NS} ns */
export async function main(ns: NS) {
    if (ns.args.length === 1 && ns.args[0] === 'test') {
        testSolvers()
        return
    }

    if (ns.args.length !== 2) {
        ns.tprint('Usage:')
        ns.tprint('    solve.js <contractFileName> <host>')
        return
    }

    let [contractFileName, host] = <string[]>ns.args

    let type = ns.codingcontract.getContractType(contractFileName, host)
    if (!type) {
        ns.tprint(`Cannot find contract ${contractFileName} on host ${host}`)
        return
    }

    let solver = contractSolvers[type]
    if (!solver) {
        ns.tprint(`No solver for ${contractFileName} on host ${host}`)
        ns.tprint(`Need to add type: ${type}`)
        return
    }

    let data = ns.codingcontract.getData(contractFileName, host)
    let answer = solver(data)
    ns.tprint(`Answer: ${answer}`)

    let result = ns.codingcontract.attempt(`${answer}`, contractFileName, host) // , { returnReward: true }
    ns.tprint(`Result: ${result}`)
}

const testSolver = (name: string, data: any, expected: any) {
    const solver = contractSolvers[name]
    let answer = solver(data)
    if (typeof(expected) === 'object') {
        answer = JSON.stringify(answer)
        expected = JSON.stringify(expected)
    }
    if (answer == expected) {
        console.log(`${name}: SUCCESS!`)
    } else {
        console.log(`${name}: FAILURE!`)
        console.log(`  Expected: ${expected}`)
        console.log(`  Got     : ${answer}`)
    }
}

const testSolvers = () => {
    testSolver('Total Ways to Sum II', [12,[2,3,5]], 5)
    testSolver('Minimum Path Sum in a Triangle', [[2],[3,4],[6,5,7],[4,1,8,3]], 11)
    testSolver('Algorithmic Stock Trader I', [188,83,102,37], 19)
    testSolver('Merge Overlapping Intervals', [[1, 3], [8, 10], [2, 6], [10, 16]], [[1, 6], [8, 16]])
}

const contractSolvers: any = {
    'BAD: Total Ways to Sum II': (data: any) => {
        // This doesn't work, it isn't unique, I need to loop through like
        // this, but do it for each number once maybe?  No, because 
        // sample data: [159,[2,3,5,7,9,10,11,12,13,14,18,19]]
        // how many ways to total 159 given numbers in the array
        const targetNumber = data[0]
        const integers = data[1]
        const ways = new Array(targetNumber + 1)
        ways[0] = 1n // 1 way to get to start
        for (let i = 0; i < targetNumber; i++) {
            if (ways[i]) {
                for (let j = 0; j < integers.length; j++) {
                    const num = i + integers[j]
                    if (num <= targetNumber) {
                        ways[num] = (ways[num] || 0n) + ways[i]
                    }
                }
            }
        }
        return ways[targetNumber] || 0
    },
    'Total Ways to Sum II': (data: any) => {
        /*
        contract-132199.cct: Total Ways to Sum II
        Data: [159,[2,3,5,7,9,10,11,12,13,14,18,19]]
        
        How many different distinct ways can the number 159 be written as a sum of integers contained in the set:
        
        [2,3,5,7,9,10,11,12,13,14,18,19]?
        
        You may use each integer in the set zero or more times.
        */

        // sample data: [159,[2,3,5,7,9,10,11,12,13,14,18,19]]
        // how many ways to total 159 given numbers in the array
        // Answer: 8295681

        // What I do is count how many ways to get to each value from
        // 0 up to and including the result we're looking for.
        // `ways[i]` is the number of ways we can get to 'i' by totaling
        // the integers.  We start using the first integer, this should
        // give us all multiples of that integer.   Then we move to the
        // next integer.
        // My simple example is [12,[2,3,5]] which has 5 ways to get to it:
        //  1. 2+2+2+2+2+2
        //  2. 2+2+2+3+3
        //  3. 3+3+3+3
        //  4. 2+2+3+5
        //  5. 2+5+5
        // When we use 2s, we end up with 1 for ways 0,2,4,6,8,10,12
        // When we use 3s:
        //      we take the 1 at ways[0] and add it to the 0 at ways[3] for 1
        //      we take the 1 at ways[2] and add it to the 0 at ways[5] for 1
        //      we take the 1 at ways[3] and add it to the 1 at ways[6] for 2
        //          This gives us our 2 ways to get to '6': 2+2+2 and 3+3
        //      we take the 1 at ways[4] and add it to the 0 at ways[7] for 1
        //      we take the 1 at ways[5] (that we got from 2+3) and add it to the 1 at ways[8] (from 2+2+2+2) to get 2 representing 2+3+3 and 2+2+2+2
        //      we take the 2 at ways[6] (2+2+2 and 3+3) and add it to 0 at ways[9] for 1
        //      
        const targetNumber = data[0]
        const integers = data[1]
        const ways = <bigint[]>(new Array(targetNumber + 1))
        ways[0] = 1n // 1 way to get to start
        for (let i = 1; i <= targetNumber; i++) {
            ways[i] = 0n
        }
        integers.forEach((i: number) => {
            for (let j = i; j <= targetNumber; j++) {
                ways[j] = ways[j] + ways[j-i]
            }
            // console.log('After', i, [...ways])
        })
        return ways[targetNumber] || 0n
    },
    'Minimum Path Sum in a Triangle': (data: any) => {
        /*
            Example: If you are given the following triangle:

                [
                    [2],
                    [3,4],
                    [6,5,7],
                    [4,1,8,3]
                ]

            The minimum path sum is 11 (2 -> 3 -> 5 -> 1).
        */
        for (let i = 1; i < data.length; i++) {
            let previous = data[i-1]
            let arr = data[i]
            for (let j = 0; j < arr.length; j++) {
                const left = (j === 0) ? Number.MAX_VALUE : previous[j-1]
                const right = (j === (arr.length - 1)) ? Number.MAX_VALUE : previous[j]
                arr[j] += Math.min(left, right)
            }
        }
        let answer = data[data.length-1].reduce((prev: number, curr: number) => Math.min(prev, curr), Number.MAX_VALUE)
        return answer
    },
    'Algorithmic Stock Trader I': (data: any) => {
        /*
            You are given the following array of stock prices (which are numbers)
            where the i-th element represents the stock price on day i:

            188,83,102,37

            Determine the maximum possible profit you can earn using at most one
            transaction (i.e. you can only buy and sell the stock once).
            If no profit can be made then the answer should be 0. Note that you
            have to buy the stock before you can sell it.
        */
        let maxProfit = 0
        for (let i = 0; i < data.length - 1; i++) {
            const buy = data[i]
            for (let j = i + 1; j < data.length; j++) {
                const sell = data[j]
                if (sell > buy) {
                    const profit = sell - buy
                    if (profit > maxProfit) {
                        maxProfit = profit
                    }
                }
            }
        }
        return maxProfit
    },
    'Subarray with Maximum Sum': (data: any) => {
        /*
            contract-235043.cct

            Given the following integer array, find the contiguous subarray
            (containing at least one number) which has the largest sum and
            return that sum. 'Sum' refers to the sum of all the numbers in
            the subarray.
        */
       
        // I think I can avoid a lot of adds by first doing a loop and
        // creating a running total.   Then we can get the subarray total
        // from a to b by subtracting a-1 from b.   For example:
        // [5,1,2,-2,4] becomes [0,5,6,8,6,10] (0 is added at start).
        // Now for indexes a to b we can subtract total[a] from total[b+1]
        // Example: Entire array is 0-4, so we subtract 0 (total[0]) from
        // 10 (total[5]).  We still have to n^2 it, but we don't have to
        // do all the adding every time
        let totals = [0]
        for (let i = 0; i < data.length; i++) {
            totals.push(totals[i] + data[i])
        }
        let maxTotal = Number.MIN_VALUE
        for (let i = 0; i < data.length - 1; i++) {
            for (let j = i+1; j < data.length; j++) {
                let total = data[j] - data[i]
                maxTotal = Math.max(maxTotal, total)
            }
        }
        return maxTotal
    },
    'Square Root': (data: any) => {
        /*
        contract-254743.cct

        You are given a ~200 digit BigInt. Find the square root of this number, to the nearest integer.

        The input is a BigInt value. The answer must be the string representing the solution's BigInt value. The trailing "n" is not part of the string.

        Hint: If you are having trouble, you might consult https://en.wikipedia.org/wiki/Methods_of_computing_square_roots
        */
        
    },
/*
contract/test.js: contract-263061.cct: Find All Valid Math Expressions
contract/test.js: ["9906853",-83]
contract/test.js: You are given the following string which contains only digits between 0 and 9:

 9906853

 You are also given a target number of -83. Return all possible ways you can add the +(add), -(subtract), and *(multiply) operators to the string such that it evaluates to the target number. (Normal order of operations applies.)

 The provided answer should be an array of strings containing the valid expressions. The data provided by this problem is an array with two elements. The first element is the string of digits, while the second element is the target number:

 ["9906853", -83]

 NOTE: The order of evaluation expects script operator precedence.
 NOTE: Numbers in the expression cannot have leading 0's. In other words, "1+01" is not a valid expression.

 Examples:

 Input: digits = "123", target = 6
 Output: ["1+2+3", "1*2*3"]

 Input: digits = "105", target = 5
 Output: ["1*0+5", "10-5"]
*/

/*
contract/test.js: contract-288350.cct: Merge Overlapping Intervals
contract/test.js: [[23,26],[17,22],[16,23],[24,31],[13,16]]
contract/test.js: Given the following array of arrays of numbers representing
a list of intervals, merge all overlapping intervals.

 [[23,26],[17,22],[16,23],[24,31],[13,16]]

 Example:

 [[1, 3], [8, 10], [2, 6], [10, 16]]

 would merge into [[1, 6], [8, 16]].

 The intervals must be returned in ASCENDING order. You can assume that in an
 interval, the first number will always be smaller than the second.
*/
    'Merge Overlapping Intervals': (data: any) => {
        // should be easy, sort by lowest number in group, then reduce and
        // if the lowest number is lower than the previous high, set previous
        // high to the maximum of the two.   Otherwise start a new group
        let intervals = <number[][]>(data.map((interval: number[]) => ([...interval])))
        intervals.sort((a, b) => {
            if (a[0] < b[0]) {
                return -1
            }
            if (a[0] > b[0]) {
                return 1
            }
            return 0
        })
        let answer = intervals.reduce((prev: any, curr: any) => {
            if (prev.length === 0 || curr[0] > prev[prev.length - 1][1]) {
                prev.push([...curr])
            } else {
                let prevValue = prev[prev.length - 1]
                prevValue[1] = Math.max(prevValue[1], curr[1])
            }
            return prev
        }, [])
        return answer
    },

/*
contract/test.js: contract-288350.cct: Merge Overlapping Intervals
contract/test.js: [[23,26],[17,22],[16,23],[24,31],[13,16]]
contract/test.js: Given the following array of arrays of numbers representing a list of intervals, merge all overlapping intervals.

 [[23,26],[17,22],[16,23],[24,31],[13,16]]

 Example:

 [[1, 3], [8, 10], [2, 6], [10, 16]]

 would merge into [[1, 6], [8, 16]].

 The intervals must be returned in ASCENDING order. You can assume that in an interval, the first number will always be smaller than the second.
*/

/*
contract/test.js: contract-316189.cct: Array Jumping Game II
contract/test.js: [2,2,1,2,3,3,1,3,3,5,2,2,0]
contract/test.js: You are given the following array of integers:

 2,2,1,2,3,3,1,3,3,5,2,2,0

 Each element in the array represents your MAXIMUM jump length at that position. This means that if you are at position i and your maximum jump length is n, you can jump to any position from i to i+n. 

Assuming you are initially positioned at the start of the array, determine the minimum number of jumps to reach the end of the array.

 If it's impossible to reach the end, then the answer should be 0.
*/

/*
contract/test.js: contract-363220.cct: Algorithmic Stock Trader II
contract/test.js: [61,87,103,181,79,132,37,17,19,55,112,155,25,92,171,54,2,39,146,40,18,179,127,133,65,46,112,185,113,61]
contract/test.js: You are given the following array of stock prices (which are numbers) where the i-th element represents the stock price on day i:

 61,87,103,181,79,132,37,17,19,55,112,155,25,92,171,54,2,39,146,40,18,179,127,133,65,46,112,185,113,61

 Determine the maximum possible profit you can earn using as many transactions as you'd like. A transaction is defined as buying and then selling one share of the stock. Note that you cannot engage in multiple transactions at once. In other words, you must sell the stock before you buy it again.

 If no profit can be made, then the answer should be 0.
*/

/*
contract/test.js: contract-391666.cct: HammingCodes: Integer to Encoded Binary
contract/test.js: 42
contract/test.js: You are given the following decimal value: 
 42 

 Convert it to a binary representation and encode it as an 'extended Hamming code'.
  The number should be converted to a string of '0' and '1' with no leading zeroes.
 A parity bit is inserted at position 0 and at every position N where N is a power of 2.
 Parity bits are used to make the total number of '1' bits in a given set of data even.
 The parity bit at position 0 considers all bits including parity bits.
 Each parity bit at position 2^N alternately considers 2^N bits then ignores 2^N bits, starting at position 2^N.
 The endianness of the parity bits is reversed compared to the endianness of the data bits:
 Data bits are encoded most significant bit first and the parity bits encoded least significant bit first.
 The parity bit at position 0 is set last.

 Examples:

 8 in binary is 1000, and encodes to 11110000 (pppdpddd - where p is a parity bit and d is a data bit)
 21 in binary is 10101, and encodes to 1001101011 (pppdpdddpd)

 For more information on the 'rule' of encoding, refer to Wikipedia (https://wikipedia.org/wiki/Hamming_code) or the 3Blue1Brown videos on Hamming Codes. (https://youtube.com/watch?v=X8jsijhllIA)
*/

/*
contract/test.js: contract-582048.cct: Compression III: LZ Compression
contract/test.js: Shm1111111113gf113gf113gaY7P3gaucATynWWWWWWWWWWPebMguMguMguMDIDIDIDIDEcDIDID
contract/test.js: Lempel-Ziv (LZ) compression is a data compression technique which encodes data using references to earlier parts of the data. In this variant of LZ, data is encoded in two types of chunk. Each chunk begins with a length L, encoded as a single ASCII digit from 1 to 9, followed by the chunk data, which is either:

 1. Exactly L characters, which are to be copied directly into the uncompressed data.
 2. A reference to an earlier part of the uncompressed data. To do this, the length is followed by a second ASCII digit X: each of the L output characters is a copy of the character X places before it in the uncompressed data.

 For both chunk types, a length of 0 instead means the chunk ends immediately, and the next character is the start of a new chunk. The two chunk types alternate, starting with type 1, and the final chunk may be of either type.

 You are given the following input string:
     Shm1111111113gf113gf113gaY7P3gaucATynWWWWWWWWWWPebMguMguMguMDIDIDIDIDEcDIDID
 Encode it using Lempel-Ziv encoding with the minimum possible output length.

 Examples (some have other possible encodings of minimal length):
     abracadabra     ->  7abracad47
     mississippi     ->  4miss433ppi
     aAAaAAaAaAA     ->  3aAA53035
     2718281828      ->  627182844
     abcdefghijk     ->  9abcdefghi02jk
     aaaaaaaaaaaa    ->  3aaa91
     aaaaaaaaaaaaa   ->  1a91031
     aaaaaaaaaaaaaa  ->  1a91041
*/

/*
contract/test.js: contract-591600.cct: Encryption II: Vigenère Cipher
contract/test.js: ["MEDIAQUEUEARRAYTRASHLOGIN","HARDWARE"]
contract/test.js: Vigenère cipher is a type of polyalphabetic substitution. It uses  the Vigenère square to encrypt and decrypt plaintext with a keyword.

   Vigenère square:
          A B C D E F G H I J K L M N O P Q R S T U V W X Y Z 
        +----------------------------------------------------
      A | A B C D E F G H I J K L M N O P Q R S T U V W X Y Z 
      B | B C D E F G H I J K L M N O P Q R S T U V W X Y Z A 
      C | C D E F G H I J K L M N O P Q R S T U V W X Y Z A B
      D | D E F G H I J K L M N O P Q R S T U V W X Y Z A B C
      E | E F G H I J K L M N O P Q R S T U V W X Y Z A B C D
                 ...
      Y | Y Z A B C D E F G H I J K L M N O P Q R S T U V W X
      Z | Z A B C D E F G H I J K L M N O P Q R S T U V W X Y

 For encryption each letter of the plaintext is paired with the corresponding letter of a repeating keyword. For example, the plaintext DASHBOARD is encrypted with the keyword LINUX:
    Plaintext: DASHBOARD
    Keyword:   LINUXLINU
 So, the first letter D is paired with the first letter of the key L. Therefore, row D and column L of the  Vigenère square are used to get the first cipher letter O. This must be repeated for the whole ciphertext.

 You are given an array with two elements:
   ["MEDIAQUEUEARRAYTRASHLOGIN", "HARDWARE"]
 The first element is the plaintext, the second element is the keyword.

 Return the ciphertext as uppercase string.
*/

/*
contract/test.js: contract-610515.cct: Unique Paths in a Grid II
contract/test.js: [[0,0,0,0,0,0,1,0,0,0],[0,0,0,0,0,1,0,1,0,0],[0,0,0,0,1,0,0,1,1,0],[1,0,1,0,0,0,0,0,1,0],[0,1,1,1,0,0,0,0,0,0],[0,0,0,0,0,0,1,0,0,0]]
contract/test.js: You are located in the top-left corner of the following grid:

 0,0,0,0,0,0,1,0,0,0,
0,0,0,0,0,1,0,1,0,0,
0,0,0,0,1,0,0,1,1,0,
1,0,1,0,0,0,0,0,1,0,
0,1,1,1,0,0,0,0,0,0,
0,0,0,0,0,0,1,0,0,0,

 You are trying reach the bottom-right corner of the grid, but you can only move down or right on each step. Furthermore, there are obstacles on the grid that you cannot move onto. These obstacles are denoted by '1', while empty spaces are denoted by 0.

 Determine how many unique paths there are from start to finish.

 NOTE: The data returned for this contract is an 2D array of numbers representing the grid.
*/

/*
contract/test.js: contract-627348.cct: Generate IP Addresses
contract/test.js: 16159107190
contract/test.js: Given the following string containing only digits, return an array with all possible valid IP address combinations that can be created from the string:

 16159107190

 Note that an octet cannot begin with a '0' unless the number itself is exactly '0'. For example, '192.168.010.1' is not a valid IP.

 Examples:

 25525511135 -> ["255.255.11.135", "255.255.111.35"]
 1938718066 -> ["193.87.180.66"]
*/

/*
contract/test.js: contract-677409.cct: Encryption I: Caesar Cipher
contract/test.js: ["VIRUS MEDIA SHELL ARRAY MACRO",10]
contract/test.js: Caesar cipher is one of the simplest encryption technique. It is a type of substitution cipher in which each letter in the plaintext  is replaced by a letter some fixed number of positions down the alphabet. For example, with a left shift of 3, D would be replaced by A,  E would become B, and A would become X (because of rotation).

 You are given an array with two elements:
   ["VIRUS MEDIA SHELL ARRAY MACRO", 10]
 The first element is the plaintext, the second element is the left shift value.

 Return the ciphertext as uppercase string. Spaces remains the same.
*/

/*
contract/test.js: contract-687435.cct: Find Largest Prime Factor
contract/test.js: 220971707
contract/test.js: A prime factor is a factor that is a prime number. What is the largest prime factor of 220971707?
*/

/*
contract/test.js: contract-704384.cct: Compression I: RLE Compression
contract/test.js: 4JJgKKAXXXXXXXXXXWWWWWWWWWWWWWWfm333333333lVVnnl30044PGGYYhhIIqqqqqq
contract/test.js: Run-length encoding (RLE) is a data compression technique which encodes data as a series of runs of a repeated single character. Runs are encoded as a length, followed by the character itself. Lengths are encoded as a single ASCII digit; runs of 10 characters or more are encoded by splitting them into multiple runs.

 You are given the following input string:
     4JJgKKAXXXXXXXXXXWWWWWWWWWWWWWWfm333333333lVVnnl30044PGGYYhhIIqqqqqq
 Encode it using run-length encoding with the minimum possible output length.

 Examples:

     aaaaabccc            ->  5a1b3c
     aAaAaA               ->  1a1A1a1A1a1A
     111112333            ->  511233
     zzzzzzzzzzzzzzzzzzz  ->  9z9z1z  (or 9z8z2z, etc.)
*/

/*
contract/test.js: contract-780769.cct: Spiralize Matrix
contract/test.js: [[23,43,16,16,13,13,21,5,32,14,15,20,8,11,20],[31,42,4,42,38,37,6,14,4,24,39,13,17,49,2],[47,3,18,6,5,39,27,40,35,38,7,22,34,11,14],[5,6,26,14,2,29,7,32,9,7,7,24,16,46,3]]
contract/test.js: Given the following array of arrays of numbers representing a 2D matrix, return the elements of the matrix as an array in spiral order:

    [
        [23,43,16,16,13,13,21, 5,32,14,15,20, 8,11,20]
        [31,42, 4,42,38,37, 6,14, 4,24,39,13,17,49, 2]
        [47, 3,18, 6, 5,39,27,40,35,38, 7,22,34,11,14]
        [ 5, 6,26,14, 2,29, 7,32, 9, 7, 7,24,16,46, 3]
    ]

Here is an example of what spiral order should be:

     [
         [1, 2, 3]
         [4, 5, 6]
         [7, 8, 9]
     ]

 Answer: [1, 2, 3, 6, 9, 8 ,7, 4, 5]

 Note that the matrix will not always be square:

     [
         [1,  2,  3,  4]
         [5,  6,  7,  8]
         [9, 10, 11, 12]
     ]

 Answer: [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]
*/

/*
contract/test.js: contract-782358.cct: Algorithmic Stock Trader III
contract/test.js: [25,21,160,168,2,75,167,81,119,11,193,64,23,194,138,182]
contract/test.js: You are given the following array of stock prices (which are numbers) where the i-th element represents the stock price on day i:

 25,21,160,168,2,75,167,81,119,11,193,64,23,194,138,182

 Determine the maximum possible profit you can earn using at most two transactions. A transaction is defined as buying and then selling one share of the stock. Note that you cannot engage in multiple transactions at once. In other words, you must sell the stock before you buy it again.

 If no profit can be made, then the answer should be 0.
*/

/*
contract/test.js: contract-786369.cct: Shortest Path in a Grid
contract/test.js: [[0,0,0,0,1,0,0,0,0,0],[0,0,1,0,0,0,1,0,0,1],[1,0,0,1,0,0,0,0,0,0],[0,0,1,0,0,0,0,0,0,1],[0,0,0,0,0,0,0,0,0,0],[0,0,0,1,0,0,0,0,0,0]]
contract/test.js: You are located in the top-left corner of the following grid:

   [[0,0,0,0,1,0,0,0,0,0],
   [0,0,1,0,0,0,1,0,0,1],
   [1,0,0,1,0,0,0,0,0,0],
   [0,0,1,0,0,0,0,0,0,1],
   [0,0,0,0,0,0,0,0,0,0],
   [0,0,0,1,0,0,0,0,0,0]]

 You are trying to find the shortest path to the bottom-right corner of the grid, but there are obstacles on the grid that you cannot move onto. These obstacles are denoted by '1', while empty spaces are denoted by 0.

 Determine the shortest path from start to finish, if one exists. The answer should be given as a string of UDLR characters, indicating the moves along the path

 NOTE: If there are multiple equally short paths, any of them is accepted as answer. If there is no path, the answer should be an empty string.
 NOTE: The data returned for this contract is an 2D array of numbers representing the grid.

 Examples:

     [[0,1,0,0,0],
      [0,0,0,1,0]]
 
 Answer: 'DRRURRD'

     [[0,1],
      [1,0]]
 
 Answer: ''
*/

/*
contract/test.js: contract-805817.cct: Total Ways to Sum
contract/test.js: 66
contract/test.js: It is possible write four as a sum in exactly four different ways:

     3 + 1
     2 + 2
     2 + 1 + 1
     1 + 1 + 1 + 1

 How many different distinct ways can the number 66 be written as a sum of at least two positive integers?
*/

/*
contract/test.js: contract-827899.cct: Algorithmic Stock Trader IV
contract/test.js: [6,[186,142,58,194,26,168,122,24,133,56,81,60,63,57,199,79,170,153,84,158,83,13,159,142]]
contract/test.js: You are given the following array with two elements:

 [6, [186,142,58,194,26,168,122,24,133,56,81,60,63,57,199,79,170,153,84,158,83,13,159,142]]

 The first element is an integer k. The second element is an array of stock prices (which are numbers) where the i-th element represents the stock price on day i.

 Determine the maximum possible profit you can earn using at most k transactions. A transaction is defined as buying and then selling one share of the stock. Note that you cannot engage in multiple transactions at once. In other words, you must sell the stock before you can buy it again.

 If no profit can be made, then the answer should be 0.
*/

/*
contract/test.js: contract-831875.cct: Proper 2-Coloring of a Graph
contract/test.js: [7,[[3,5],[0,2],[2,3],[1,6],[0,5]]]
contract/test.js: You are given the following data, representing a graph:
 [7,[[3,5],[0,2],[2,3],[1,6],[0,5]]]
 Note that "graph", as used here, refers to the field of graph theory, and has no relation to statistics or plotting. The first element of the data represents the number of vertices in the graph. Each vertex is a unique number between 0 and 6. The next element of the data represents the edges of the graph. Two vertices u,v in a graph are said to be adjacent if there exists an edge [u,v]. Note that an edge [u,v] is the same as an edge [v,u], as order does not matter. You must construct a 2-coloring of the graph, meaning that you have to assign each vertex in the graph a "color", either 0 or 1, such that no two adjacent vertices have the same color. Submit your answer in the form of an array, where element i represents the color of vertex i. If it is impossible to construct a 2-coloring of the given graph, instead submit an empty array.

 Examples:

 Input: [4, [[0, 2], [0, 3], [1, 2], [1, 3]]]
 Output: [0, 0, 1, 1]

 Input: [3, [[0, 1], [0, 2], [1, 2]]]
 Output: []
*/

/*
contract/test.js: contract-841071.cct: Array Jumping Game
contract/test.js: [3,7,0,9,6]
contract/test.js: You are given the following array of integers:

 3,7,0,9,6

 Each element in the array represents your MAXIMUM jump length at that position. This means that if you are at position i and your maximum jump length is n, you can jump to any position from i to i+n. 

Assuming you are initially positioned at the start of the array, determine whether you are able to reach the last index.

 Your answer should be submitted as 1 or 0, representing true and false respectively.
*/

/*
contract/test.js: contract-924086.cct: Compression II: LZ Decompression
contract/test.js: 3lhb916y1250B890897B66by1r3556OBQL948E66GFdhB158n07JqJ5K
contract/test.js: Lempel-Ziv (LZ) compression is a data compression technique which encodes data using references to earlier parts of the data. In this variant of LZ, data is encoded in two types of chunk. Each chunk begins with a length L, encoded as a single ASCII digit from 1 to 9, followed by the chunk data, which is either:

 1. Exactly L characters, which are to be copied directly into the uncompressed data.
 2. A reference to an earlier part of the uncompressed data. To do this, the length is followed by a second ASCII digit X: each of the L output characters is a copy of the character X places before it in the uncompressed data.

 For both chunk types, a length of 0 instead means the chunk ends immediately, and the next character is the start of a new chunk. The two chunk types alternate, starting with type 1, and the final chunk may be of either type.

 You are given the following LZ-encoded string:
     3lhb916y1250B890897B66by1r3556OBQL948E66GFdhB158n07JqJ5K
 Decode it and output the original string.

 Example: decoding '5aaabb450723abb' chunk-by-chunk

     5aaabb           ->  aaabb
     5aaabb45         ->  aaabbaaab
     5aaabb450        ->  aaabbaaab
     5aaabb45072      ->  aaabbaaababababa
     5aaabb450723abb  ->  aaabbaaababababaabb
*/

/*
contract/test.js: contract-925749.cct: Unique Paths in a Grid I
contract/test.js: [7,14]
contract/test.js: You are in a grid with 7 rows and 14 columns, and you are positioned in the top-left corner of that grid. You are trying to reach the bottom-right corner of the grid, but you can only move down or right on each step. Determine how many unique paths there are from start to finish.

 NOTE: The data returned for this contract is an array with the number of rows and columns:

 [7, 14]
*/

/*
contract/test.js: contract-944525.cct: HammingCodes: Encoded Binary to Integer
contract/test.js: 1100000000000000100000000111101010010110100100100101101011110101
contract/test.js: You are given the following encoded binary string: 
 '1100000000000000100000000111101010010110100100100101101011110101' 

 Decode it as an 'extended Hamming code' and convert it to a decimal value.
 The binary string may include leading zeroes.
 A parity bit is inserted at position 0 and at every position N where N is a power of 2.
 Parity bits are used to make the total number of '1' bits in a given set of data even.
 The parity bit at position 0 considers all bits including parity bits.
 Each parity bit at position 2^N alternately considers 2^N bits then ignores 2^N bits, starting at position 2^N.
 The endianness of the parity bits is reversed compared to the endianness of the data bits:
 Data bits are encoded most significant bit first and the parity bits encoded least significant bit first.
 The parity bit at position 0 is set last.
 There is a ~55% chance for an altered bit at a random index.
 Find the possible altered bit, fix it and extract the decimal value.

 Examples:

 '11110000' passes the parity checks and has data bits of 1000, which is 8 in binary.
 '1001101010' fails the parity checks and needs the last bit to be corrected to get '1001101011', after which the data bits are found to be 10101, which is 21 in binary.

 For more information on the 'rule' of encoding, refer to Wikipedia (https://wikipedia.org/wiki/Hamming_code) or the 3Blue1Brown videos on Hamming Codes. (https://youtube.com/watch?v=X8jsijhllIA)
*/

/*
contract/test.js: contract-965872.cct: Sanitize Parentheses in Expression
contract/test.js: (()(()()(((((a((
contract/test.js: Given the following string:

 (()(()()(((((a((

 remove the minimum number of invalid parentheses in order to validate the string. If there are multiple minimal ways to validate the string, provide all of the possible results. The answer should be provided as an array of strings. If it is impossible to validate the string the result should be an array with only an empty string.

 IMPORTANT: The string may contain letters, not just parentheses.

 Examples:

 "()())()" -> ["()()()", "(())()"]
 "(a)())()" -> ["(a)()()", "(a())()"]
 ")(" -> [""]
*/
}
