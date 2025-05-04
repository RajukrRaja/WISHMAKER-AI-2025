from flask import Flask, request, jsonify
from src.generate_wish import generate_wish, generate_batch_wish
from src.generate_tribute import generate_tribute
from src.generate_collage import create_collage
import base64

app = Flask(__name__)

@app.route('/generate-wish', methods=['POST'])
def wish():
    data = request.json
    wish = generate_wish(data['name'], data['theme'], data['vibe'])
    return jsonify({'wish': wish})

@app.route('/generate-batch-wish', methods=['GET'])
def batch_wish():
    wish = generate_batch_wish()
    return jsonify({'batch_wish': wish})

@app.route('/generate-tribute', methods=['POST'])
def tribute():
    data = request.json
    tribute = generate_tribute(data['friend_name'], data['memory'])
    return jsonify({'tribute': tribute})

@app.route('/generate-collage', methods=['POST'])
def collage():
    data = request.json
    collage_base64 = create_collage(data['images'])
    return jsonify({'collage': f'data:image/png;base64,{collage_base64}'})

if __name__ == '__main__':
    app.run(port=5001, debug=True)