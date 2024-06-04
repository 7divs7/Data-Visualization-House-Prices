import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

df = pd.read_csv('Misc/old-combined-dataset.csv')

df = df.melt(id_vars='Borough', var_name='Variable', value_name='Value')
df['Year'] = df['Variable'].str.split('_').str[-1]
df['Column'] = df['Variable'].str.split('_').str[0]
df = df.drop(columns=['Variable'])
df = df.pivot_table(index=['Borough', 'Year'], columns='Column', values='Value').reset_index()

# Reorder columns
df = df[['Borough', 'Year', 'Price', 'Pop', 'Crime', 'Income']]
for column in df.columns:
    if column == 'Borough' or column == 'Year':
       continue
    df[column] = df[column].astype(int)
df = df.rename(columns={'Pop': 'Population'})
df1 = df.copy().drop(columns='Borough')
df = df1.groupby('Year').mean()

# Calculate correlation matrix
correlation_matrix = df.corr()

# Create a heatmap
plt.figure(figsize=(10, 8))
sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm', fmt=".2f")
# plt.title('Correlation Heatmap of 4 Variables')
plt.show()

# Calculate correlation coefficients
corr_price_income = df['Price'].corr(df['Income'])
corr_price_population = df['Price'].corr(df['Population'])
corr_price_crime = df['Price'].corr(df['Crime'])

print("Correlation coefficient between Price and Population:", corr_price_population)
print("Correlation coefficient between Price and Crime:", corr_price_crime)
print("Correlation coefficient between Price and Income:", corr_price_income)