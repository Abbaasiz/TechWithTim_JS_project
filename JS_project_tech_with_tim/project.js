const prompt = require('prompt-sync')();
const ROWS = 3;
const COLS = 3;

// The number of each symbol in each reel.
const SYMBOLS_COUNT = {
    A: 2,
    B: 4,
    C: 6,
    D: 8
}

// The value of each symbol.
const SYMBOL_VALUES = {
    A: 5,
    B: 4,
    C: 3,
    D: 2
}

// Get the deposit amount from the user.
const deposit = () => {
    while (true) {
        // Prompt user to enter an amount to deposit.
        const depositAmount = prompt("Enter an amount to deposit: ");

        // Convert string to float.
        const numberDepositAmount = parseFloat(depositAmount);

        if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
            console.log("Please enter a valid amount to deposit.");
        } else {
            return numberDepositAmount;
        }
    }
}


// Get the number of lines the user wants to bet on.

const getNumberOfLines = () => {
    while (true) {
        // Prompt user to enter the number of lines to bet on.
        const lines = prompt("Enter a number of lines to bet on between 1 and 3: ");

        // Convert string to float.
        const numberOfLines = parseFloat(lines);

        if (isNaN(numberOfLines) || numberOfLines < 1 || numberOfLines > 3) {
            console.log("Please enter a valid number of lines to bet on.");
        } else {
            return numberOfLines;
        }
    }
}


// Function that returns the bet amount per line based on the deposit and number of lines betted on. 

const getBet = (balance, lines) => {
    while (true) {
        // Prompt user to enter the number of lines to bet on.
        const bet = prompt("Enter the amount to bet per line: ");

        // Convert string to float.
        const numberBet = parseFloat(bet);

        if (isNaN(numberBet) || numberBet <= 0 || numberBet > balance / lines) {
            console.log("Please enter a valid bet.");
        } else {
            return numberBet;
        }
    }
}


const spin = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }
    console.log(symbols);


    const reels = [];

    for (let i = 0; i < COLS; i++) {
        reels.push([]);
        const reelSymbols = [...symbols];
        for (let j = 0; j < ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }

    return reels;
}


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
            rowString += symbol;

            if (i != row.length - 1) {
                rowString += ' | ';
            }

        }
        console.log(rowString);
    }
}

const getWinning = (rows, bet, lines) => {
    let winning = 0;

    for (let row = 0; row < lines; row++) {
        const symbols = rows[row];
        let allSame = true;

        for (const symbol of symbols) {
            if (symbol != symbol[0]) {
                allSame = false;
                break;
            }
        }

        if (allSame) {
            winning += bet * SYMBOL_VALUES[symbols[0]];
        }
    }
    return winning;

}


const game = () => {
    let balance = deposit();

    while (true) {
        console.log("You have a balance of £" + balance);
        const lines = getNumberOfLines();
        const bet = getBet(balance, lines);
        balance -= bet * lines;
        const reels = spin();
        const rows = transpose(reels);
        printRows(rows);
        const winnings = getWinning(rows, bet, lines);
        balance += winnings;
        console.log("You won, $" + winnings.toString());

        if (balance <= 0) {
            console.log("You have ran out of money!  Game over. ");
            break
        }

        const playAgain = prompt("Would you like to play again? (y/n)");
        if (playAgain != "y") break;
    }

}

game();







