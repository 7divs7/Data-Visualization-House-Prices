import numpy as np
import pandas as pd

df = pd.read_csv('crime.csv').drop(columns=['MajorText', 'MinorText']).dropna()
df = df.rename(columns={'LookUp_BoroughName': 'Borough'})
print(len(df))


# Extract year from column names
df.columns = df.columns.str.slice(start=0, stop=4)

print(df.columns)

# Group by 'Class' and year, then calculate the mean
output_df = df.groupby(['Boro', df.columns]).mean().reset_index()

print(len(output_df))


# Class 20101   20102   20103   20111   20112   20113
# A     1       2       4       5       3       8
# A     3       7       7       8       6       5
# A     2       3       2       2       2       2
# B     1       2       4       5       3       8
# B     3       7       7       8       6       5
# B     2       3       2       2       2       2
# C     1       2       4       5       3       8
# C     3       7       7       8       6       5
# C     2       3       2       2       2       2


# Class 2010   2011
# A     1       2       
# A     3       7       
# A     2       3       