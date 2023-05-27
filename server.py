from flask import Flask, request, jsonify
from flask_socketio import SocketIO,emit
from flask_cors import CORS

from flask import send_file
from models.player import Player
from models.deck import Deck

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
CORS(app,cors_allowed_origins="*")
socketio = SocketIO(app,cors_allowed_origins="*")

players = {}
played_cards = Deck(0, True)

@app.route("/get_players")
def get_players():
    """event listener when client requests for player locations"""
    # return all players as json object
    get_players = []
    for player in players.values():
        get_players.append(player.to_json())

    return jsonify(get_players)

@app.route("/board")
def board():
    return send_file('images/board.png', mimetype='image/png')

@app.route("/obi")
def obi():
    return send_file('images/obi.png', mimetype='image/png')

@app.route("/vader")
def vader():
    return send_file('images/vader.png', mimetype='image/png')

@app.route("/http-call")
def http_call():
    """return JSON with string data as the value"""
    data = {'data':'This text was fetched using an HTTP call to server on render'}
    return jsonify(data)


@socketio.on("shuffle_discard_to_main_deck")
def reshuffle_to_main_deck():
    players[request.sid].reshuffle_discard_pile()
    emit("get_discard_pile",{'data':players[request.sid].get_discard_pile()}, broadcast=True)
    emit("get_main_deck",{'data':players[request.sid].get_main_deck()}, broadcast=True)

@socketio.on("get_discard_pile")
def get_discard_pile():
    discard_pile = players[request.sid].discard_pile.get_all_to_json()
    emit("get_discard_pile",{'data':discard_pile})

@socketio.on("get_deck")
def get_deck():
    deck = players[request.sid].get_main_deck()
    emit("get_deck",{'data':deck})

@socketio.on("get_hand")
def get_hand():
    hand = players[request.sid].get_hand()
    emit("get_hand",{'data':hand})

@socketio.on("get_discard_pile")
def get_discard_pile():
    discard_pile = players[request.sid].get_discard_pile()
    emit("get_discard_pile",{'data':discard_pile})

@socketio.on("draw_card")
def draw_card():
    players[request.sid].draw_card()
    hand = players[request.sid].get_hand()
    emit("draw_card",{'data':hand})
    emit("get_hand",{'data':hand})
    emit("get_deck",{'data':players[request.sid].get_main_deck()})

@socketio.on("discard_card")
def discard_card(data):
    players[request.sid].discard_card(data['selected_card'])
    hand = players[request.sid].get_hand()
    played_cards.remove_card_by_id(data['selected_card'])
    emit("get_hand",{'data':hand})
    emit("get_discard_pile",{'data':players[request.sid].get_discard_pile()})
    emit("get_played_cards",{'data':played_cards.get_all_to_json()}, broadcast=True)

@socketio.on("get_played_cards")
def get_played_cards():
    # played_cards = players[request.sid].get_played_cards()
    emit("get_played_cards",{'data':played_cards.get_all_to_json()}, broadcast=True)

@socketio.on("play_card")
def play_card(data):
    card = players[request.sid].play_card(data['selected_card'])
    played_cards.add_card(card)
    hand = players[request.sid].get_hand()
    # played_cards = players[request.sid].get_played_cards()
    emit("get_played_cards",{'data':played_cards.get_all_to_json()}, broadcast=True)
    emit("get_hand",{'data':hand})

@socketio.on("remove_card_from_play")
def remove_card_from_play(data):
    card = players[request.sid].remove_card_from_play(data)
    hand = players[request.sid].get_hand()
    played_cards = players[request.sid].get_played_cards()
    emit("remove_card_from_play",{'data':hand,'card':card})
    emit("remove_card_from_play",{'data':played_cards,'card':card},broadcast=True)

@socketio.on("reshuffle_discard_pile")
def reshuffle_discard_pile():
    players[request.sid].reshuffle_discard_pile()
    hand = players[request.sid].get_hand()
    emit("reshuffle_discard_pile",{'data':hand})

@socketio.on("connect")
def connected():
    """event listener when client connects to the server"""
    player = Player(request.sid)
    players[request.sid] = player

    get_players = []
    for player in players.values():
        get_players.append(player.to_json())

    if get_players == None:
        get_players = []

    # emit("playerAdded",{'data':get_players}, broadcast=True)
    emit("connect",{"data":f"id: {request.sid} is connected"})

@socketio.on("create_character")
def create_character(character):
    name = character['character']
    deck_path = f'./decks/{name}.csv'
    players[request.sid].create_player(deck_path)
    players[request.sid].set_name(name)

    get_players = []
    for player in players.values():
        get_players.append(player.to_json())

    if get_players == None:
        get_players = []

    emit("playerAdded",{'data':get_players}, broadcast=True)

@socketio.on('data')
def handle_message(data):
    """event listener when client types a message"""
    emit("data",{'data':data,'id':request.sid},broadcast=True)
    players[request.sid].set_name(data)

@socketio.on("disconnect")
def disconnected():
    """event listener when client disconnects to the server"""
    emit("disconnect",f"user {request.sid} disconnected",broadcast=True)
    players.pop(request.sid)

@socketio.on('move_player')
def move_player_socket(data):
    players[request.sid].set_location((int(data['x']),int(data['y'])))

    get_players = []
    for player in players.values():
        get_players.append(player.to_json())

    if get_players == None:
        get_players = []

    emit("playerAdded",{'data':get_players}, broadcast=True)

@socketio.on('playerAdded')
def handle_player_added(data):
    emit('playerAdded', data)

@socketio.on('healthChanged')
def handle_health_changed(data):
    max = int(players[request.sid].max_health)
    health = int(players[request.sid].health)
    health_change = data['health_change']
    health += health_change
    if health <= max and health >= 0:
        players[request.sid].health = health

    print(players[request.sid].health)
    get_players = []
    for player in players.values():
        get_players.append(player.to_json())

    if get_players == None:
        get_players = []

    emit("playerAdded",{'data':get_players}, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', port=5001)
