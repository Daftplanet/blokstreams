from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_socketio import SocketIO, send

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://username:password@localhost/streaming_db'
db = SQLAlchemy(app)
CORS(app)
socketio = SocketIO(app)

class Stream(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    description = db.Column(db.String(200))
    category = db.Column(db.String(50))
    thumbnail = db.Column(db.String(100))
    is_live = db.Column(db.Boolean, default=False)

@app.route('/streams', methods=['GET'])
def get_streams():
    streams = Stream.query.all()
    return jsonify([stream.to_dict() for stream in streams])

@app.route('/stream', methods=['POST'])
def create_stream():
    data = request.json
    new_stream = Stream(**data)
    db.session.add(new_stream)
    db.session.commit()
    return jsonify(new_stream.to_dict()), 201

@socketio.on('message')
def handleMessage(msg):
    send(msg, broadcast=True)

if __name__ == '__main__':
    db.create_all()
    socketio.run(app, debug=True)
