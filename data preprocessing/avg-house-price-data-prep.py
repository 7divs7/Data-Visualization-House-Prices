import pandas as pd
import os

df = pd.read_csv('datafile.csv').drop(columns=['Month']).dropna()

for column in df.columns:
    df[column] = df[column].astype(str).str.replace(',', '').astype(float)

df = round(df.groupby(['Year']).mean(), 2)

df = df.T
csv_header = "Borough", "Price"
print(csv_header)
for year in df.columns:
    if year == 2010:
        continue
    filename = f"{int(year)}.csv"
    df[year] = pd.DataFrame(round(df[year]).astype(int))
    df[year].to_csv(filename, sep=',', encoding='utf-8', header=False)

# df = df.T[2011]

# print(df)
# # df.to_csv('2010.csv', index=False)  
