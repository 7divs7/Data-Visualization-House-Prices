import pandas as pd

df = pd.read_csv('housing-density-borough.csv').drop(columns=['Code', 'Source', 'Population', 'Inland_Area _Hectares',
       'Total_Area_Hectares','Square_Kilometres',
       'Population_per_square_kilometre'])

df = df.rename(columns={'Name': 'Borough'})

df = df.loc[(df['Borough'] != 'Greater London')]
df = df.loc[(df['Borough'] != 'Inner London')]
df = df.loc[(df['Borough'] != 'Outer London')]
df = df.loc[(df['Year'] >= 2010)]
df = df.loc[(df['Year'] <= 2023)]

df_1 = pd.DataFrame(columns=['Borough', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', 
                             '2020', '2021', '2022', '2023'])
# Pivot the DataFrame
df = df.pivot_table(index='Borough', columns='Year', values='Population_per_hectare').reset_index()
df = df.set_index('Borough')
print(df)

years = ['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023']
final_df = pd.DataFrame()
for year in years:
    df_price = pd.read_csv(f'assets/datasets/avg-house-price/{year}.csv')
    df_crime = pd.read_csv(f'assets/datasets/crime-stats/{year}.csv')
    df_pop = pd.read_csv(f'assets/datasets/population/{year}.csv')
    combined_df = pd.concat([df_price, df_crime, df_pop], axis=1, ignore_index=False)
    combined_df = combined_df.loc[:, ~combined_df.columns.duplicated()]
    combined_df = combined_df.rename(columns={'Price': f'Price_{year}', 'Crime': f'Crime_{year}', 'Population': f'Pop_{year}'})
    final_df = pd.concat([final_df, combined_df], axis=1, ignore_index=False)
    final_df = final_df.loc[:, ~final_df.columns.duplicated()]



df_income = pd.read_csv('income_full.csv')
for column in df_income.columns:
    if column == 'Borough':
       continue
    df_income[column] = df_income[column].str.replace(',', '').astype(int)
print(df_income)

final_df = pd.concat([final_df, df_income], axis=1, ignore_index=False)
final_df = final_df.loc[:, ~final_df.columns.duplicated()]

    
print(final_df)


df = pd.read_csv('income_full_indi.csv')
for column in df.columns:
    if column == 'Borough':
       continue
    df[column] = df[column].str.replace(',', '').astype(int)


df.set_index(df.columns[0], inplace=True)
print(df)

for column in df.columns:
    df[column].to_csv(f'{column}.csv', sep=',', encoding='utf-8', index=True, header=True)


df = pd.read_csv('Misc/old-combined-dataset.csv')

# Unpivot the dataframe
df = df.melt(id_vars='Borough', var_name='Variable', value_name='Value')

# Extract year information from the Variable column
df['Year'] = df['Variable'].str.split('_').str[-1]

# Extract column information from the Variable column
df['Column'] = df['Variable'].str.split('_').str[0]

# Drop the Variable column
df = df.drop(columns=['Variable'])

# Pivot the dataframe to desired format
df = df.pivot_table(index=['Borough', 'Year'], columns='Column', values='Value').reset_index()

# Reorder columns
df = df[['Borough', 'Year', 'Price', 'Pop', 'Crime', 'Income']]

# # Set 'Borough' column as index
# df.set_index('Borough', inplace=True)

for column in df.columns:
    if column == 'Borough' or column == 'Year':
       continue
    df[column] = df[column].astype(int)

df = df.rename(columns={'Pop': 'Population'})
print(df)

# df.to_csv('output.csv', index=True)

df1 = df.copy().drop(columns='Borough')
means = df1.groupby('Year').mean()

for column in means.columns:
    if column == 'Year':
       continue
    means[column] = means[column].astype(int)

print(means)

print(df)




