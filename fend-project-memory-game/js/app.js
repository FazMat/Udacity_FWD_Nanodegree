const stars = document.getElementById('stars');
const star = `<li><i class="fa fa-star"></i></li>`;
const deck = document.getElementById('deck');
const moves = document.getElementById('moves');
const message = document.getElementById('message');
let stop = false;
let move = 0;
let badMove = 0;
//the 2 cards to compare
let firstCard = undefined;
let secondCard = undefined;
//every card on screen
let cards = undefined;
//measure playing time
let begin, timer;


//list of card types
const cardTypes = [ 
                    "fa-diamond",
                    "fa-paper-plane-o",
                    "fa-anchor",
                    "fa-bolt",
                    "fa-cube",
                    "fa-leaf",
                    "fa-bicycle",
                    "fa-bomb"
];

//create list with 2 pieces from each type
const allCards = [].concat(cardTypes, cardTypes);

//shuffle and draw cards whilst creating them
function drawDeck() {
    deck.innerHTML = '';
    firstCard = undefined;
    secondCard = undefined;
    shuffle(allCards).forEach(function(card) {
        let newCard = document.createElement('li');
        newCard.className = 'card';
        newCard.innerHTML = `<i class="fa ${card}"></i>`;
        deck.appendChild(newCard);
    });
    cards = deck.children;
    //redraw stars
    stars.innerHTML =  star + star + star;
    //reset moves to 0
    moves.innerHTML = '0';
    move = 0;
    badMove = 0;
    stop = false;
    //show message
    message.innerHTML = 'Hurry up, time is ticking!';
    begin = Date.now();
    //start timer (1 minute to play)
    timer = setTimeout(timeUp, 60000);
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

//clicking on the reset-button
const reset = document.getElementById('restart');
reset.addEventListener('click', drawDeck);

//manage clicks on cards
deck.addEventListener('click', handleClick);

function handleClick(event){
    //works only if not already won
    //and timer is still running
    if (stop) return;
    //works only if there is at least 1 star
    if (!stars.hasChildNodes()) return;
    //works only on cards (li inside deck)
    if (!event.target.matches('li')) return;
    //second click on same card doesnt count
    if (event.target == firstCard) return;
    //first or second card?
    if (!firstCard) {
        firstCard = event.target;
        turn(firstCard);
    } else {
        secondCard = event.target;
        turn(secondCard);
        compareCards(firstCard, secondCard);
    }
}

//function to compare 2 cards
//contains game logic
function compareCards(first, second) {
    //no match, turn cards back
    if (first.innerHTML != second.innerHTML) {
        setTimeout(turn, 400, first);
        setTimeout(turn, 400, second);
        //bad move, you lose 1 life (or not)
        removeStar();
    } else {
    //match, cards stay turned up
        match(first, second);
        //great job, did you win?
        checkWin();
    }
    //increment moves
    moves.innerHTML = ++move;
    //clear cache
    firstCard = undefined;
    secondCard = undefined;
}

//function to show or hide a card
function turn(card) {
    card.classList.toggle('show');
    card.classList.toggle('open');    
}

//function to show matched cards
function match(first, second) {
    turn(first);
    first.classList.add('match');
    turn(second);
    second.classList.add('match');
}

//function to remove a star
//after every 4 steps
function removeStar() {
    badMove++;
    if (badMove % 4 == 0) {
        stars.removeChild(stars.firstChild);
        checkLose();
    }
}

//function to check lose condition
function checkLose() {
    if (stars.children.length == 0) lose();
}

//function to show losing (lives)
function lose() {
    stop = true;
    //stop timer
    clearTimeout(timer);
    //show message
    message.innerHTML = `You lost your last star, click restart!`;
}

//function to show losing (time)
function timeUp() {
    stop = true;
    //show message
    message.innerHTML = `Time is up, click restart!`;
}

//function to check win condition
function checkWin() {
    let i = cards.length;
    while(i--) {
        if (!cards[i].classList.contains('match')) return;
    }
    win();
}

//function to show winning
function win() {
    stop = true;
    let i = cards.length;
    while (i--) {
        cards[i].classList.add('win');
    }
    //stop timer
    clearTimeout(timer);
    //show message
    message.innerHTML = `You won in ${(Date.now() - begin)/1000} seconds!`;
}

//draw deck on page load
drawDeck();