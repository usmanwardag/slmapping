import math
from matplotlib import pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
import numpy as np
import pickle

def plot(coords, words, size=(8,8), dimensions=2, xlim=None):
    fig = plt.figure(figsize=size)
    ax = Axes3D(fig)

    x = [round(c[0], 8) for c in coords]
    y = [round(c[1], 8) for c in coords]
    
    if dimensions == 2:
        z = [0 for c in coords]
    else:
        z = [round(c[2], 8) for c in coords]
       
    ax.scatter(x, y, z)
    [ax.text(x[i], y[i], z[i], words[i]) for i in range(len(x))]
    
    return ax
    
def two_point_distance(p1, p2):
    return math.sqrt(pow(p1[0] - p2[0], 2) + pow(p1[1] - p2[1], 2) + pow(p1[2] - p2[2], 2))

def contain_punctuation(word):
    for char in word:
        if ord(char) < ord('a') or ord(char) > ord('z'):
            return True
    
    return False

def get_words(language='en', words=None, length=None, isogram=True):
    
    if language == 'en':
        with open('data/words_en.pickle', 'rb') as f:
            words = pickle.load(f)    
            
    if length is not None:
        words = [w for w in words if len(w) == length]
    
    if isogram == True:
        words = [w for w in words if len(set(w))==len(w)]
        
    return words