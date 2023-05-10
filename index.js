const prompt = require("prompt-sync")();


const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
    A: 2,
    B: 4,
    C: 6,
    D: 8
}

const SYMBOL_VALUES = {
    A: 5, 
    B: 4,
    C: 3,
    D: 2
}


const deposit = () => {
    while (true) {
        const depositAmount = parseFloat(prompt("Enter a deposit amount: "));

        if (isNaN(depositAmount) || depositAmount <= 0) {
            console.log("Invalid deposit amount, try again.");
        }
        
        else {
            return depositAmount;
        }
    }
};


const getLines = () => {
    while (true) {
        const numberLines = parseFloat(prompt("Enter the number of lines you want to bet (1-3): "));

        if (isNaN(numberLines) || numberLines <= 0 || numberLines > 3) {
            console.log("Invalid number of lines, try again");
        }

        else {
            return numberLines;
        }
    }
};


const getBet = (balance, lines) => {
    while (true) {
        const betAmount = parseFloat(prompt(`Enter an amount to bet per line [${balance}]: `));
        
        if (isNaN(betAmount) || betAmount <= 0 || betAmount > balance/lines) {
            console.log("Invalid amount to bet, try again.")
        }

        else {
            return betAmount
        }
    }
};

const spin = () => {
    const symbols = [];

    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }

    const reels = [[], [], []];

    for (let i = 0; i < COLS; i++) {
        const reelSymbols = [...symbols];
        for (let j = 0; j < ROWS; j++) {
            const randIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randIndex];

            reels[i].push(selectedSymbol);
            reelSymbols.splice(randIndex, 1);
        }
    }

    return reels
};

const transpose = (reels) => {
    const rows = [];

    for (let i = 0; i < ROWS; i++) {
        rows.push([]);

        for (let j = 0; j < COLS; j++) {
            rows[i].push(reels[j][i]);
        }
    }

    return rows;
}

const printRows = (rows) => {
    for (const row of rows) {
        let rowString = "";

        for (const [i, symbol] of row.entries()) {
            rowString += symbol

            if (i != row.length - 1) {
                rowString += " | "

            }
        }

        console.log(rowString);
    }
}

const getWinnings = (rows, bet, lines) => {
    let winnings = 0;

    for (let row = 0; row < lines; row++) {
        const symbols = rows[row];
        let allSame = true;

        for (const symbol of symbols) {
            if (symbol != symbols[0]) {
                allSame = false;
                break;
            }
        }

        if (allSame) {
            winnings = bet * SYMBOL_VALUES[symbols[0]]
        }
    }

    return winnings;
}


let balance = deposit()

// game loop
while (true) {
    const lines = getLines();
    const bet = getBet(balance, lines);
    const reels = spin();
    const rows = transpose(reels);
    
    printRows(rows);

    const winnings = getWinnings(rows, bet, lines);

    console.log(`You won $${winnings}!`);

    const play_again = prompt("Would you like to play again? (Y/N): ");

    if (play_again.toUpperCase() == "Y") {
        if (winnings > 0) {
            balance += winnings
        }

        else {
            balance = balance - bet
        }

        continue;
    }
    
    else {
        console.log("Thanks for playing!")
        break;
    }
}