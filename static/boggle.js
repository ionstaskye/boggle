class BoggleGame{
    // Make a new game//
constructor(boardID, secs = 60){
    this.secs = secs
    this.showTimer()
    this.score = 0
    this.words = new Set()
    this.board = $("#"+boardID)

    this.timer = setInterval(this.tick.bind(this), 1000)
    $(".wordForm", this.board).on("submit", this.handleSubmit.bind(this))
}

foundWords(word){
    $(".foundWords", this.board).append($("<li>", {text: word}))
}

showScore() {
    //show score//
    $(".score", this.board).text(this.score)

}

showMessage(msg, cls) {
    //displays message//
    $(".msg", this.board)
    .text(msg)
    .removeClass()
    .addClass(`msg ${cls}`)
}

async handleSubmit(evt){
    //handle Submit event//
    evt.preventDefault()
    const $guess = $(".guessText", this.board)

    let guess = $guess.val()

    if (!guess) return;

    if (this.words.has(guess))  {
        this.showMessage(`${guess} Already Found`, "err")
    }

    const res = await axios.get("/guess", { params: { guess: guess }})
    
    console.log(res)
    if (res.data.result === "not-word"){
    this.showMessage(`${guess} is not a word`, "err")
    } 
    else if (res.data.result === "not-on-board"){
        this.showMessage(`${guess} is not on the board`, "err")
    }
    else{
        this.foundWords(guess)
        this.score += guess.length
        this.showScore
        this.words.add(guess)
        this.showMessage("Correct Guess", "Success")
    }
    $guess.val("").focus()
}
    
showTimer(){
    $(".timer", this.board).text(this.secs)
}

async tick(){
    this.secs -= 1
    this.showTimer()

    if (this.secs === 0){
        clearInterval(this.timer)
        await this.scoreGame()
    }
}
async scoreGame(){
    $(".wordForm", this.board).hide()
    const res = await axios.post("/score", {score: this.score})
if (res.data.brokeRecord){
    this.showMessage(`New Record: ${this.score}`, "Success")
}
else{
    this.showMessage(`Final Score ${this.score}`, "Success")
}

}
}