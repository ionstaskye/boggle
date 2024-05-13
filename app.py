from boggle import Boggle
from flask import Flask, request, render_template, session, flash, jsonify
from flask_debugtoolbar import DebugToolbarExtension
boggle_game = Boggle()
app = Flask(__name__)
app.config["SECRET_KEY"] = "Secret"
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False

@app.route("/")
def home_page():
    game_board = boggle_game.make_board()
    session["board"] = game_board
    highscore = session.get("highscore", 0)
    plays = session.get("plays", 0)

    return render_template("base.html", game_board= game_board,
    highscore = highscore,
    plays= plays)



@app.route("/guess")
def check_guess():
    guess = request.args["guess"]
    board = session["board"]
    res = boggle_game.check_valid_word(board, guess)

    return jsonify({"result": res})

@app.route('/score', methods =  ["POST"])
def post_score():

    score = request.json["score"]
    highscore = session.get("highscore", 0)
    plays = session.get("plays", 0)

    session['plays'] = plays +1
    session['highscore']= max(score, highscore)

    return jsonify(brokeRecord=score > highscore)

