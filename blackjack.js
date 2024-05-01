// Define the deck of cards
let balance = 500;
let bet = 0;
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

// Function to start the game
function startGame(betAmount) {
    if (isNaN(betAmount) || betAmount <= 0) {
        alert("Please enter a valid bet amount.");
        return;
    }
    
    bet = betAmount;

    gameStarted = true; // Toggle gameStarted variable
    const startButtonContainer = document.getElementById('start-button-container');
    const gameButtonContainer = document.getElementById('game-button-container');
    startButtonContainer.style.display = gameStarted ? 'none' : 'block'; // Hide or show the start button based on gameStarted variable
    gameButtonContainer.style.display = gameStarted ? 'block' : 'none'; // Hide or show the game button(s) based on gameStarted variable
    createDeck();
    shuffleDeck();
    playerHand = [dealCard(), dealCard()];
    dealerHand = [dealCard(), dealCard()];
    updateDisplay();
    if (calculateHandValue(playerHand) == 21 | calculateHandValue(dealerHand) == 21) {
        endGame();
    }

}

// Function to update the display
function updateDisplay() {
    displayHand(dealerHand, 'dealer-hand');
    displayHand(playerHand, 'player-hand');
}

// Function to display a hand with card images and total value
function displayHand(hand, elementId) {
    const handDiv = document.getElementById(elementId);
    handDiv.innerHTML = '';

    // Create total display box
    const totalValue = calculateHandValue(hand);
    const totalDisplay = document.createElement('div');
    const handName = elementId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    totalDisplay.classList.add('hand-total-display');
    totalDisplay.innerHTML = `<strong>${handName}</strong><br><br><span style="text-align: left;">Total Value: ${totalValue}</span>`;
    handDiv.appendChild(totalDisplay);

    hand.forEach(card => {
        const cardContainer = document.createElement('div');
        cardContainer.classList.add('card-container');

        const img = document.createElement('img');
        img.src = `/BlackjackV3/png/${card.value.toLowerCase()}_of_${card.suit.toLowerCase()}.png`;
        img.classList.add('card');
        cardContainer.appendChild(img);

        const cardName = document.createElement('div');
        cardName.textContent = `${card.value} of ${card.suit}`;
        cardContainer.appendChild(cardName);

        handDiv.appendChild(cardContainer);
    });
}

// Function to add a new card to a hand
function hit(hand) {
    hand.push(dealCard());
    updateDisplay();
    if (calculateHandValue(hand) > 21) {
        endGame();
    }
}

function stand() {
    while (calculateHandValue(dealerHand) < 17 || (calculateHandValue(dealerHand) === 17 && hasSoft17(dealerHand))) {
        dealerHand.push(dealCard());
        updateDisplay();
    }
    endGame();
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
function endGame() {
    gameStarted = false;

    document.getElementById('start-button-container').style.display = gameStarted ? 'none' : 'block'; // Hide or show the start button based on gameStarted variable
    document.getElementById('game-button-container').style.display = gameStarted ? 'block' : 'none'; // Hide or show the game button(s) based on gameStarted variable

    const playerTotal = calculateHandValue(playerHand);
    const dealerTotal = calculateHandValue(dealerHand);

    let message = '';

    if (playerTotal > 21) {
        balance -= bet;
        updateBalance(balance);
        message = 'Player Busts! Dealer Wins!';
    } else if (dealerTotal > 21) {
        balance += bet;
        updateBalance(balance);
        message = 'Dealer Busts! Player Wins!';
    } else if (playerTotal === dealerTotal) {
        message = 'Push!';
    } else if (playerTotal > dealerTotal) {
        balance += bet;
        updateBalance(balance);
        message = 'Player Wins!';
    } else {
        balance -= bet;
        updateBalance(balance);
        message = 'Dealer Wins!';
    }

    const endMessageDiv = document.createElement('div');
    endMessageDiv.style.display = gameStarted ? 'none' : 'block';
    endMessageDiv.textContent = message;
    endMessageDiv.classList.add('end-message-div');
    document.getElementById('playing-area').appendChild(endMessageDiv);
    updateDisplay();

    setTimeout(() => {
        endMessageDiv.style.display = 'none';
    }, 5000);
}