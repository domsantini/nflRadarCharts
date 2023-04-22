import pandas as pd
import nfl_data_py as nfl

def get_dictionaries(Team1, Season1, Team2, Season2):

  # Pull offensive stats (organize, add columns, and rank)
  df_offense = pd.read_csv('https://raw.githubusercontent.com/tylermeyers351/nfl_data/main/Clean%20NFL%20Offense%20Stats%20(2002%20-%202022).csv')
  df_offense = df_offense[['Rk', 'Tm', 'PF', 'Passing Yds', 'Rushing Yds ', 'Season']]
  df_offense['PF Rank'] = df_offense.groupby("Season")["PF"].rank(method="dense", ascending=False)
  df_offense['Passing Yds Rank'] = df_offense.groupby("Season")["Passing Yds"].rank(method="dense", ascending=False)
  df_offense['Rushing Yds Rank'] = df_offense.groupby("Season")["Rushing Yds "].rank(method="dense", ascending=False)
  df_offense = df_offense.rename(columns={"Rushing Yds ": "Rushing Yds"})

  # Pull defensive stats (organize, add columns, and rank)
  df_defense = pd.read_csv('https://raw.githubusercontent.com/tylermeyers351/nfl_data/main/Clean%20NFL%20Defense%20Stats%20(2002%20-%202022).csv')
  df_defense = df_defense[['Rk', 'Tm', 'PA', 'Passing Yds','Rushing Yds', 'Season']]
  df_defense['PA Rank'] = df_defense.groupby("Season")["PA"].rank(method="dense", ascending=True)
  df_defense['Def Passing Yds Rank'] = df_defense.groupby("Season")["Passing Yds"].rank(method="dense", ascending=True)
  df_defense['Def Rushing Yds Rank'] = df_defense.groupby("Season")["Rushing Yds"].rank(method="dense", ascending=True)
  df_defense = df_defense.rename(columns={"Passing Yds": "Def Passing Yds", "Rushing Yds": "Def Rushing Yds"})

  # Pull key player for every team
  df_key_players = pd.read_csv('https://raw.githubusercontent.com/tylermeyers351/nfl_data/main/NFL%20Key%20Players%20(2002%20through%202022).csv')
  
  # Pull team data (for colors)
  team_colors = nfl.import_team_desc()

  # Create dictionaries to later return
  team_dict1 = {'team': Team1, 'season': Season1,
          
          'PF Rank': None, 'Passing Yds Rank': None, 'Rushing Yds Rank': None, 
          'PA Rank': None, 'Def Passing Yds Rank': None, 'Def Rushing Yds Rank': None,
          
          'PF': None,	'Passing Yds': None,	'Rushing Yds': None,
          'PA': None,	'Def Passing Yds': None,	'Def Rushing Yds': None,
          
          'Key Player': None,
          
          # 'team_color': None, 	'team_color2': None,	'team_color3': None,	'team_color4': None
          'team_color': None, 	'team_color2': None
          }

  team_dict2 = {'team': Team2, 'season': Season2,
          'PF Rank': None, 'Passing Yds Rank': None, 'Rushing Yds Rank': None, 
          'PA Rank': None, 'Def Passing Yds Rank': None, 'Def Rushing Yds Rank': None,
          
          'PF': None,	'Passing Yds': None,	'Rushing Yds': None,
          'PA': None,	'Def Passing Yds': None,	'Def Rushing Yds': None,
          
          'Key Player': None,
          
          # 'team_color': None, 	'team_color2': None,	'team_color3': None,	'team_color4': None
          'team_color': None, 	'team_color2': None
          }

  # Update dictionary values with stats from relevant dataframes
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
      team_dict1[key] = team_colors.loc[(team_colors['team_name'] == Team1)][key].iloc[0]
      team_dict2[key] = team_colors.loc[(team_colors['team_name'] == Team2)][key].iloc[0]
    except:
      pass

  return team_dict1, team_dict2