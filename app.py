from flask import Flask, jsonify, request, session
from flask_cors import CORS
from helper import get_dictionaries
import json

app = Flask(__name__)
app.secret_key = 'mysecretkey'
CORS(app)

teams = {'ARI':'Arizona Cardinals', 'ATL': 'Atlanta Falcons', 'BAL': 'Baltimore Ravens', 'BUF':'Buffalo Bills', 'CAR':'Carolina Panthers', 'CHI':'Chicago Bears', 'CIN':'Cincinnati Bengals', 'CLE':'Cleveland Browns', 
        'DAL':'Dallas Cowboys', 'DEN':'Denver Broncos', 'DET':'Detroit Lions', 'GB':'Green Bay Packers', 'HOU':'Houston Texans', 'IND':'Indianapolis Colts', 'JAX':'Jacksonville Jaguars', 'KC':'Kansas City Chiefs', 
        'LAC':'Los Angeles Chargers', 'LAR':'Los Angeles Rams', 'LV':'Las Vegas Raiders', 'MIA':'Miami Dolphins', 'MIN':'Minnesota Vikings', 'NE':'New England Patriots', 'NO':'New Orleans Saints', 'NYG':'New York Giants', 
        'NYJ':'New York Jets', 'PHI':'Philadelphia Eagles', 'PIT':'Pittsburgh Steelers', 'SEA':'Seattle Seahawks', 'SF':'San Francisco 49ers', 'TB':'Tampa Bay Buccaneers', 'TEN':'Tennessee Titans', 'WAS':'Washington Commanders'}



### INPUTS TO COME FROM FRONT-END ###
Team1 = ''
Season1 = ''

Team2 = ''
Season2 = ''

@app.route('/postmethod', methods=['GET','POST'])
def getData():
    global Team1, Team2, Season1, Season2
    data = request.get_json()
    
    Season1 = data['Season1']
    Season2 = data['Season2']

    Team1 = data['Team1']
    Team2 = data['Team2']
        
    Team1 = teams[f'{Team1}']
    Team2 = teams[f'{Team2}']
    
    session['Season1'] = Season1
    session['Season2'] = Season2
    session['Team1'] = Team1
    session['Team2'] = Team2
    
    print(Team1)
    print(Team2)
    print(Season1)
    print(Season2)
    
    return jsonify(Season1=Season1, Season2=Season2, Team1=Team1, Team2=Team2)

@app.route('/getmethod')
def passData():

    dictionaries = get_dictionaries(Team1, int(Season1), Team2, int(Season2))
    first_team = dictionaries[0]
    second_team = dictionaries[1]

    print(first_team)
    print(second_team)
    
    return jsonify('{}/{}'.format(first_team, second_team))
    
@app.route("/")
def home():
    print('connected to flask')



if __name__ == "__main__":
    app.run()
