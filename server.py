from flask import Flask, request, jsonify
from flask_socketio import SocketIO,emit
from flask_cors import CORS

from flask import send_file
from models.player import Player

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
# CORS(app,resources={r"/*":{"origins":"*"}})
CORS(app, origins='http://localhost:3000')
socketio = SocketIO(app,cors_allowed_origins="*")

players = {}

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

@app.route("/luke")
def luke():
    return send_file('images/luke.png', mimetype='image/png')

@app.route("/vader")
def vader():
    return send_file('images/vader.png', mimetype='image/png')

@app.route("/http-call")
def http_call():
    """return JSON with string data as the value"""
    data = {'data':'This text was fetched using an HTTP call to server on render'}
    return jsonify(data)

@socketio.on("connect")
def connected():
    """event listener when client connects to the server"""
    player = Player(request.sid)
    players[request.sid] = player
    if len(players) == 1:
        players[request.sid].set_name("luke")
    else:
        players[request.sid].set_name("vader")

    get_players = []
    for player in players.values():
        get_players.append(player.to_json())

    if get_players == None:
        get_players = []

    emit("playerAdded",{'data':get_players}, broadcast=True)
    emit("connect",{"data":f"id: {request.sid} is connected"})

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

if __name__ == '__main__':
    socketio.run(app, debug=True,port=5001)
