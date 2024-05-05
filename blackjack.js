// Define the deck of cards
let balance = 500;
let bet = [0];
let currentHand = 0;
let gameStarted = false;
let deck = [];
const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];

// Create the deck
function createDeck() {
    deck = []
    for (let suitIdx = 0; suitIdx < suits.length; suitIdx++) {
        for (let valueIdx = 0; valueIdx < values.length; valueIdx++) {
            let card = {
                suit: suits[suitIdx],
                value: values[valueIdx]
            };
            deck.push(card);
        }
    }
}

// Function to shuffle the deck
function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

// Function to get the value of a card
function getCardValue(card) {
    switch (card.value) {
        case 'Jack':
        case 'Queen':
        case 'King':
            return 10;
        case 'Ace':
            return 11;
        default:
            return parseInt(card.value);
    }
}

// Function to calculate the total value of a hand
function calculateHandValue(hand) {
    let value = 0;
    let aceCount = 0;
    for (let i = 0; i < hand.length; i++) {
        let cardValue = getCardValue(hand[i]);
        if (cardValue === 11) {
            aceCount++;
        }
        value += cardValue;
    }
    while (value > 21 && aceCount > 0) {
        value -= 10;
        aceCount--;
    }
    return value;
}

// Function to deal a card from the deck
function dealCard() {
    return deck.pop();
}

function updateBalance(balance) {
    const balanceDocument = document.getElementById('balance');
    balanceDocument.innerText = `Balance: $${balance}`; // Assuming balance is a numeric value
}

// Function to double down
function doubleDown() {
    if ((bet[currentHand] + sumOfAllBets()) > balance) {
        alert("You cannot bet more than your current balance.");
        return;
    }
    bet[currentHand] = bet[currentHand] * 2;
    playerHand[currentHand].push(dealCard());
    updateDisplay();
    stand();
}

function sumOfAllBets() {
    let sum = 0;
    for (let i = 0; i < bet.length; i++) {
        sum += bet[i];
    }
    return sum;
}

// Function to start the game
function startGame(betAmount) {

    if (balance === 0) {
        alert("You are broke! Please refresh the page for a new balance.");
        return;
    }

    if (isNaN(betAmount) || betAmount <= 0) {
        alert("Please enter a valid bet amount.");
        return;
    }

    if (betAmount > balance) {
        alert("You cannot bet more than your current balance.");
        return;
    }

    bet[0] = betAmount;

    gameStarted = true; // set gameStarted variable
    const startButtonContainer = document.getElementById('start-button-container');
    const gameButtonContainer = document.getElementById('game-button-container');
    startButtonContainer.style.display = gameStarted ? 'none' : 'block'; // Hide or show the start button based on gameStarted variable
    gameButtonContainer.style.display = gameStarted ? 'block' : 'none'; // Hide or show the game button(s) based on gameStarted variable
    createDeck();
    shuffleDeck();
    playerHand = [[dealCard(), dealCard()]];
    dealerHand = [dealCard(), dealCard()];
    updateDisplay();
    if (calculateHandValue(playerHand[0]) == 21 | calculateHandValue(dealerHand) == 21) {
        endGame();
    }

}

// Function to update the display
function updateDisplay() {
    displayFirstDealerCard();
    // Iterate over each hand in playerHand array and display it
    playerHand.forEach((hand, index) => {
        displayHand(hand, `player-hand-${index}`);
    });
}

function displayDealer() {
    const elementId = 'dealer-hand';
    const handDiv = document.getElementById(elementId);
    handDiv.innerHTML = '';

    // Create total display box
    const totalValue = calculateHandValue(dealerHand);
    const totalDisplay = document.createElement('div');
    const handName = elementId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    totalDisplay.classList.add('hand-total-display');
    totalDisplay.innerHTML = `<strong>${handName}</strong><br><br><span style="text-align: left;">Total Value: ${totalValue}</span>`;
    handDiv.appendChild(totalDisplay);

    dealerHand.forEach(card => {
        const cardContainer = document.createElement('div');
        cardContainer.classList.add('card-container');

        const img = document.createElement('img');
        img.src = `/Blackjack/png/${card.value.toLowerCase()}_of_${card.suit.toLowerCase()}.png`;
        img.classList.add('card');
        cardContainer.appendChild(img);

        const cardName = document.createElement('div');
        cardName.textContent = `${card.value} of ${card.suit}`;
        cardContainer.appendChild(cardName);

        handDiv.appendChild(cardContainer);
    });
}

function displayFirstDealerCard() {
    const handDiv = document.getElementById('dealer-hand');
    handDiv.innerHTML = '';

    // Display total value with the first card only
    const firstCard = dealerHand[0]; // Move the declaration of firstCard here
    const totalDisplay = document.createElement('div');
    totalDisplay.classList.add('hand-total-display');
    totalDisplay.innerHTML = `<strong>Dealer</strong><br><br><span style="text-align: left;">Total Value: ${getCardValue(firstCard)}</span>`;
    handDiv.appendChild(totalDisplay);

    // Display only the first card of the dealer
    const cardContainer = document.createElement('div');
    cardContainer.classList.add('card-container');

    const img = document.createElement('img');
    img.src = `/Blackjack/png/${firstCard.value.toLowerCase()}_of_${firstCard.suit.toLowerCase()}.png`;
    img.classList.add('card');
    cardContainer.appendChild(img);

    const cardName = document.createElement('div');
    cardName.textContent = `${firstCard.value} of ${firstCard.suit}`;
    cardContainer.appendChild(cardName);

    handDiv.appendChild(cardContainer);
}

// Function to display a hand with card images and total value
function displayHand(hand, elementId) {
    const index = parseInt(elementId.split('-')[2]);
    const handDiv = document.getElementById(elementId);
    handDiv.innerHTML = '';

    // Create total display box
    const totalValue = calculateHandValue(hand);
    const totalDisplay = document.createElement('div');
    const handName = elementId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    totalDisplay.classList.add('hand-total-display');
    if (index === currentHand) {
        totalDisplay.style.border = '2px solid crimson'; // Add bold crimson border if index equals currentHand
    }
    totalDisplay.innerHTML = `<strong>${handName}</strong><br><br><span style="text-align: left;">Total Value: ${totalValue}</span><br><br><span style="text-align: left;">Bet: $${bet[index]}</span>`;
    handDiv.appendChild(totalDisplay);

    hand.forEach(card => {
        const cardContainer = document.createElement('div');
        cardContainer.classList.add('card-container');

        const img = document.createElement('img');
        img.src = `/Blackjack/png/${card.value.toLowerCase()}_of_${card.suit.toLowerCase()}.png`;
        img.classList.add('card');
        cardContainer.appendChild(img);

        const cardName = document.createElement('div');
        cardName.textContent = `${card.value} of ${card.suit}`;
        cardContainer.appendChild(cardName);

        handDiv.appendChild(cardContainer);
    });
}

// Function to add a new card to a hand
function hit() {
    playerHand[currentHand].push(dealCard());
    updateDisplay();
    if (calculateHandValue(playerHand[currentHand]) >= 21) {
        stand();
    }
}

function stand() {
    if (currentHand < playerHand.length - 1) {
        // If the current hand is not the last hand, increment currentHand
        currentHand++;
        updateDisplay();
    } else {
        // If it is the last hand, call endGame()
        endGame();
    }
}

function dealerLogic() {
    while (calculateHandValue(dealerHand) < 17 || (calculateHandValue(dealerHand) === 17 && hasSoft17(dealerHand))) {
        dealerHand.push(dealCard());
    }
    displayDealer();
    return calculateHandValue(dealerHand);
}

function split() {
    if (bet[currentHand] + sumOfAllBets() > balance) {
        alert("You cannot bet more than your current balance.");
        return;
    }
    if (playerHand.length > 2) {
        alert("You cannot have more than three active hands.");
        return;
    }
    const card1 = playerHand[currentHand][0];
    const card2 = playerHand[currentHand][1];
    if (card1.value !== card2.value) {
        alert("You can only split if the two cards have the same rank.");
        return;
    }

    hand1 = [card1, dealCard()];
    hand2 = [card2, dealCard()];
    playerHand[currentHand] = hand1;
    playerHand.push(hand2);
    bet.push(bet[currentHand]);
    updateDisplay();
}

function hasSoft17(hand) {
    let hasAce = false;
    let total = 0;
    for (let i = 0; i < hand.length; i++) {
        total += getCardValue(hand[i]);
        if (hand[i].value === 'Ace') {
            hasAce = true;
        }
    }
    return hasAce && total === 17;
}

// Function to end the game
async function endGame() {

    document.getElementById('start-button-container').style.display = 'block'; // Hide or show the start button based on gameStarted variable
    document.getElementById('game-button-container').style.display = 'none'; // Hide or show the game button(s) based on gameStarted variable

    let runDealerLogic = false;

    // Check if any hand has a value under 22
    for (let i = 0; i < playerHand.length; i++) {
        const playerTotal = calculateHandValue(playerHand[i]);
        if (playerTotal <= 21) {
            runDealerLogic = true;
            break;
        }
    }

    if (runDealerLogic) {
        dealerLogic();
    }

    let dealerTotal = calculateHandValue(dealerHand);

    for (let i = 0; i <= playerHand.length - 1; i++) {
        playerTotal = calculateHandValue(playerHand[i]);
        playerBet = bet[i]

        let message = '';
        let outcomeColor = '';
        let outcomeText = '';


        if (playerTotal > 21) {
            balance -= playerBet;
            updateBalance(balance);
            message += 'Player Busts! Dealer Wins!\n';
            outcomeColor = 'red';
            outcomeText = -playerBet;
        } else if (dealerTotal > 21) {
            balance += playerBet;
            updateBalance(balance);
            message += 'Dealer Busts! Player Wins!\n';
            outcomeColor = 'green';
            outcomeText = playerBet;
        } else if (playerTotal === dealerTotal) {
            message += 'Push!\n';
            outcomeColor = 'grey';
            outcomeText = '0';
        } else if (playerTotal > dealerTotal) {
            balance += playerBet;
            updateBalance(balance);
            message += 'Player Wins!\n';
            outcomeColor = 'green';
            outcomeText = playerBet;
        } else {
            balance -= playerBet;
            updateBalance(balance);
            message += 'Dealer Wins!\n';
            outcomeColor = 'red';
            outcomeText = -playerBet;
        }

        const endMessageDiv = document.createElement('div');
        endMessageDiv.textContent = message;
        endMessageDiv.classList.add('end-message-div');
        document.getElementById('playing-area').appendChild(endMessageDiv);

        const gameOutcomeData = {
            result: outcomeText >= 0 ? 'W' : 'L', // 'W' for win, 'L' for loss
            description: message, // 'Player Busts! Dealer Wins!', etc.
            wager: outcomeText // The amount won/lost
        };

        try {
            const response = await axios.post('https://sheetdb.io/api/v1/0kmejh0iur6l8', gameOutcomeData);
            console.log(response.data); // Log the response from the API (optional)
        } catch (error) {
            console.error('Error posting game outcome data:', error);
        }

        // Append the outcome element to 'last10GamesList'
        const outcomeElement = document.createElement('div');
        outcomeElement.classList.add('color');
        outcomeElement.style.background = outcomeColor;
        outcomeElement.style.border = '1.5px solid #333';
        const spanElement = document.createElement('span');
        spanElement.textContent = outcomeText;
        outcomeElement.appendChild(spanElement);

        // Check if there are already ten elements in 'last10GamesList', remove the oldest one if there are
        const last10GamesList = document.getElementById('last10GamesList');
        if (last10GamesList.children.length >= 10) {
            last10GamesList.removeChild(last10GamesList.children[last10GamesList.children.length - 2]);
        }
        // Insert the outcomeElement before the last child
        last10GamesList.appendChild(outcomeElement);

        const last10GamesListContainer = document.getElementById('last10GamesListContainer');
        last10GamesListContainer.style.display = 'block';

        endMessageDiv.style.display = 'block';

        setTimeout(() => {
            endMessageDiv.style.display = 'none';
        }, 3000);
    }
    gameStarted = false;

}