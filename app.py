from helper import get_dictionaries, load_data
from flask_cors import CORS
from flask import Flask, jsonify, request, render_template

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

# LOAD DATA IN 
dataframes = load_data()

@app.route("/")
def home():
    return render_template('index.html')

@app.route('/postmethod', methods=['POST'])
def getData():
    global Team1, Team2, Season1, Season2
    
    print(f'LINE 31: {Team1}, {Team2}, {Season1}, {Season2}')
    
    data = request.get_json()
    
    print(f'LINE 35: {data}')
    
    Season1 = data['Season1']
    Season2 = data['Season2']
    Team1 = data['Team1']
    Team2 = data['Team2']
        
    Team1 = teams[f'{Team1}']
    Team2 = teams[f'{Team2}']
     
    print(f'LINE 45: {Team1}, {Team2}, {Season1}, {Season2}')

    dictionaries = get_dictionaries(dataframes, Team1, int(Season1), Team2, int(Season2))
    first_team = dictionaries[0]
    second_team = dictionaries[1]

    print(f'LINE 51: {first_team}')
    print(f'LINE 52: {second_team}')
    
    return jsonify('{}/{}'.format(first_team, second_team))
    
if __name__ == "__main__":
    app.run(debug=True)
