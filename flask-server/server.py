from flask import Flask
from flask_cors import CORS

app=Flask(__name__)
CORS(app)

# members API Route
#go to http://127.0.0.1:5000/members, not localhost5000/members
@app.route("/members")

def members():
    return {"members":["evemike","Member2","Memver3"]}

if __name__ == "__main__":
    app.run(debug=True)
