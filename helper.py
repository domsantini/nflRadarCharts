import pandas as pd

def get_dictionaries(Team1, Season1, Team2, Season2):
  df_offense = pd.read_csv('https://raw.githubusercontent.com/tylermeyers351/nfl_data/main/Clean%20NFL%20Offense%20Stats%20(2002%20-%202022).csv')

  df_offense = df_offense[['Rk', 'Tm', 'PF', 'Passing Yds',
        'Rushing Yds ', 'Season']]

  df_offense['PF Rank'] = df_offense.groupby("Season")["PF"].rank(method="dense", ascending=False)
  df_offense['Passing Yds Rank'] = df_offense.groupby("Season")["Passing Yds"].rank(method="dense", ascending=False)
  df_offense['Rushing Yds Rank'] = df_offense.groupby("Season")["Rushing Yds "].rank(method="dense", ascending=False)

  df_defense = pd.read_csv('https://raw.githubusercontent.com/tylermeyers351/nfl_data/main/Clean%20NFL%20Defense%20Stats%20(2002%20-%202022).csv')

  df_defense = df_defense[['Rk', 'Tm', 'PA', 'Passing Yds',
        'Rushing Yds', 'Season']]

  df_defense['PA Rank'] = df_defense.groupby("Season")["PA"].rank(method="dense", ascending=True)
  df_defense['Def Passing Yds Rank'] = df_defense.groupby("Season")["Passing Yds"].rank(method="dense", ascending=True)
  df_defense['Def Rushing Yds Rank'] = df_defense.groupby("Season")["Rushing Yds"].rank(method="dense", ascending=True)



  # Create dictionaries and pull data from dataframe
  team_dict1 = {'team': Team1, 'season': Season1,
          'PF Rank': None, 'Passing Yds Rank': None, 'Rushing Yds Rank': None, 
          'PA Rank': None, 'Def Passing Yds Rank': None, 'Def Rushing Yds Rank': None}

  team_dict2 = {'team': Team2, 'season': Season2,
          'PF Rank': None, 'Passing Yds Rank': None, 'Rushing Yds Rank': None, 
          'PA Rank': None, 'Def Passing Yds Rank': None, 'Def Rushing Yds Rank': None}


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

  return team_dict1, team_dict2