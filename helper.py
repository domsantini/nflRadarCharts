import pandas as pd

# A function that loads in data and returns dataframes.
def load_data():

  # Pulls offensive stats (organize, add columns, and rank).
  # df_offense = pd.read_csv(r"csv/Clean NFL Offense Stats (2002 - 2022).csv")
  df_offense = pd.read_csv('/Users/dominicsantini/Downloads/CSV/Clean NFL Offense Stats (2002 - 2022).csv')
  df_offense = df_offense[['Rk', 'Tm', 'PF', 'Passing Yds', 'Rushing Yds ', 'Season']]
  df_offense['PF Rank'] = df_offense.groupby("Season")["PF"].rank(method="dense", ascending=False)
  df_offense['Passing Yds Rank'] = df_offense.groupby("Season")["Passing Yds"].rank(method="dense", ascending=False)
  df_offense['Rushing Yds Rank'] = df_offense.groupby("Season")["Rushing Yds "].rank(method="dense", ascending=False)
  df_offense = df_offense.rename(columns={"Rushing Yds ": "Rushing Yds"})

  # Pulls defensive stats (organize, add columns, and rank).
  # df_defense = pd.read_csv(r"Clean NFL Defense Stats (2002 - 2022).csv")
  df_defense = pd.read_csv('/Users/dominicsantini/Downloads/CSV/Clean NFL Defense Stats (2002 - 2022).csv')

  df_defense = df_defense[['Rk', 'Tm', 'PA', 'Passing Yds','Rushing Yds', 'Season']]
  df_defense['PA Rank'] = df_defense.groupby("Season")["PA"].rank(method="dense", ascending=True)
  df_defense['Def Passing Yds Rank'] = df_defense.groupby("Season")["Passing Yds"].rank(method="dense", ascending=True)
  df_defense['Def Rushing Yds Rank'] = df_defense.groupby("Season")["Rushing Yds"].rank(method="dense", ascending=True)
  df_defense = df_defense.rename(columns={"Passing Yds": "Def Passing Yds", "Rushing Yds": "Def Rushing Yds"})

  # Pulls key player for every team for every season.
  df_key_players = pd.read_csv('/Users/dominicsantini/Downloads/CSV/NFL Key Players (2002 through 2022).csv')

  # Pulls team colors.
  df_team_colors = pd.read_csv('/Users/dominicsantini/Downloads/CSV/teamcolors.csv')

  # Pulls team's win/loss record for season.
  df_records = pd.read_csv('/Users/dominicsantini/Downloads/CSV/nfl_wins_losses.csv')

  dataframes = [df_offense, df_defense, df_key_players, df_team_colors, df_records]

  return dataframes


# Returns 2 dictionaries that contain the relevant data for the spider chart (ranks), 
# and raw statisitics (e.g., points for, rushing yards, etc.).
def get_dictionaries(dataframes, Team1, Season1, Team2, Season2):

  df_offense = dataframes[0]
  df_defense = dataframes[1]
  df_key_players = dataframes[2]
  df_team_colors = dataframes[3]
  df_records = dataframes[4]

  # Creates dictionaries to later return.
  team_dict1 = {'team': Team1, 'season': Season1,
          
          'PF Rank': None, 'Passing Yds Rank': None, 'Rushing Yds Rank': None, 
          'PA Rank': None, 'Def Passing Yds Rank': None, 'Def Rushing Yds Rank': None,
          
          'PF': None,	'Passing Yds': None,	'Rushing Yds': None,
          'PA': None,	'Def Passing Yds': None,	'Def Rushing Yds': None,
          
          'Key Player': None,
          
          'team_color': None, 	'team_color2': None,

          'Record': None}

  team_dict2 = {'team': Team2, 'season': Season2,
          'PF Rank': None, 'Passing Yds Rank': None, 'Rushing Yds Rank': None, 
          'PA Rank': None, 'Def Passing Yds Rank': None, 'Def Rushing Yds Rank': None,
          
          'PF': None,	'Passing Yds': None,	'Rushing Yds': None,
          'PA': None,	'Def Passing Yds': None,	'Def Rushing Yds': None,
          
          'Key Player': None,
          
          'team_color': None, 	'team_color2': None,

          'Record': None}

  # Updates dictionary values with stats from relevant dataframes (use a try/except for each dataframe).
  for key in team_dict1:
    try:
      team_dict1[key] = df_offense.loc[(df_offense['Tm'] == Team1) & (df_offense['Season'] == Season1)][key].iloc[0]
      team_dict2[key] = df_offense.loc[(df_offense['Tm'] == Team2) & (df_offense['Season'] == Season2)][key].iloc[0]
    except:
      pass
    try:
      team_dict1[key] = df_defense.loc[(df_defense['Tm'] == Team1) & (df_defense['Season'] == Season1)][key].iloc[0]
      team_dict2[key] = df_defense.loc[(df_defense['Tm'] == Team2) & (df_defense['Season'] == Season2)][key].iloc[0]
    except:
      pass
    try:
      team_dict1[key] = df_key_players.loc[(df_key_players['Tm'] == Team1) & (df_key_players['Season'] == Season1)][key].iloc[0]
      team_dict2[key] = df_key_players.loc[(df_key_players['Tm'] == Team2) & (df_key_players['Season'] == Season2)][key].iloc[0]
    except:
      pass
    try:
      team_dict1[key] = df_team_colors.loc[(df_team_colors['Tm'] == Team1)][key].iloc[0]
      team_dict2[key] = df_team_colors.loc[(df_team_colors['Tm'] == Team2)][key].iloc[0]
    except:
      pass
    try:
      team_dict1[key] = df_records.loc[(df_records['Tm'] == Team1) & (df_key_players['Season'] == Season1)][key].iloc[0]
      team_dict2[key] = df_records.loc[(df_records['Tm'] == Team2) & (df_key_players['Season'] == Season2)][key].iloc[0]
    except:
      pass

  # Returns two dictionaries with all of the relevant data.
  return team_dict1, team_dict2