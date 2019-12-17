cardValue = {
    KING: 10,
    QUEEN: 10,
    JACK: 10,
    ACE: [1, 11],
    "1": 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "10": 10
}

document.addEventListener("DOMContentLoaded", () => {

})

const startGame = async () => {
    let res = await axios.get(`https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`)
    let deck = res.data
    let startButton = document.querySelector("#start")
    startButton.parentNode.removeChild(startButton)
    let hit = document.querySelector("#hit")
    let stand = document.querySelector("#stand")
    hit.style.display = "inline"
    stand.style.display = "inline"
    dealCards(deck)
}

const hit = async () => {
    let deckId = document.querySelector("p")
    let res = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId.innerText}/draw/?count=1`)
    let drawCard = res.data
    let playerHand = document.querySelector("#player")
    let card = drawCard.cards[0]
    let li = document.createElement("li")
    li.value = cardValue[card.value]
    let img = document.createElement("img")
    img.src = card.image
    li.appendChild(img)
    playerHand.appendChild(li) 
    hitScore(li)
}

const dealCards = async (deck) => {
    let deckId = document.querySelector("#deckId")
    deckId.innerText = deck.deck_id
    let res = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId.innerText}/draw/?count=2`)
    let cards = res.data.cards
    let playerHand = document.createElement("ul")
    playerHand.id = "player"
    cards.forEach(card => {
        let li = document.createElement("li")
        li.value = cardValue[card.value]
        let img = document.createElement("img")
        img.src = card.image
        li.appendChild(img)
        playerHand.appendChild(li) 
    })
    let div = document.querySelector("div")
    div.appendChild(playerHand)
    findScore(playerHand)
}

const findScore = async (hand) => {
    let cards = hand.querySelectorAll("li")
    let score = document.createElement("h3")
    score.id = "playerScore"
    score.innerText = 0
    for(let i = 0; i < cards.length; i++){
        score.innerText = Number(score.innerText) + cards[i].value
    }
    if(Number(score.innerText) > 21) {
        score.innerText = "BUSTED"
        computerPlayer()
    }
    let div = document.querySelector("div")
    div.appendChild(score)
}

const hitScore = async (card) => {
    let score = document.querySelector("#playerScore")
    score.innerText = Number(score.innerText) + card.value
    if(Number(score.innerText) > 21) {
        score.innerText = "BUSTED"
        computerPlayer()
    }
}

const stay = async () => {
   computerPlayer() 
}

const computerPlayer = async () => {
    let deckId = document.querySelector("#deckId")
    let res = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId.innerText}/draw/?count=3`)
    let computerCards = res.data.cards
    let computerHand = document.createElement("ul")
    computerHand.id = "player"
    computerCards.forEach(card => {
        let li = document.createElement("li")
        li.value = cardValue[card.value]
        let img = document.createElement("img")
        img.src = card.image
        li.appendChild(img)
        computerHand.appendChild(li) 
    })
    let div = document.querySelector("div")
    div.appendChild(computerHand)

    let cards = computerHand.querySelectorAll("li")
    let score = document.createElement("h3")
    score.id = "computerScore"
    score.innerText = 0
    for(let i = 0; i < cards.length; i++){
        score.innerText = Number(score.innerText) + cards[i].value
    }
    if(Number(score.innerText) > 21) {
        score.innerText = "BUSTED"
    }
    div.appendChild(score)
    findWinner()
}

const findWinner = async () => {
    let computerScore = document.querySelector("#computerScore")
    let playerScore = document.querySelector("#playerScore")
    let winner = document.querySelector("#winner")
    if(playerScore.innerText === "BUSTED" || Number(computerScore.innerText) > Number(playerScore.innerText)){
        winner.innerText = "Computer Player Wins!!!"
    } else if (computerScore.innerText === "BUSTED" || Number(playerScore.innerText) > Number(computerScore.innerText)){
        winner.innerText = "YOU WIN!!!"
    }

    let hit = document.querySelector("#hit")
    let stand = document.querySelector("#stand")
    hit.style.display = "none"
    stand.style.display = "none"
}

