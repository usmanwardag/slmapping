import numpy as np
from scipy import spatial

x_range = 26

def get_normalized(grid):
    sq_sum = np.sqrt(sum([i*i for i in grid]))
    grid = [g/sq_sum for g in grid]
    
    return grid

def get_grid(word, repeat=1, normalize=False):
    grid = [[0 for i in range(x_range)] for j in range(repeat)]
    w = 2
    u = 2
    offset = ord('a')

    for i, char in enumerate(word):
        index = ord(char) - offset
        for rep in range(repeat):
            if grid[rep][index] == 0:
                grid[rep][index] = pow(w, (len(word) - i - 1)) * u
                break
            else:
                continue
                
    if normalize == True:
        grid = get_normalized(grid[0])
               
    return grid

def find_similarity(word1, word2, repeat=1):
    grid_1 = np.array(get_grid(word1, normalize=True))
    grid_2 = np.array(get_grid(word2, normalize=True))

    return (1 - spatial.distance.cosine(grid_1, grid_2))

#print(find_similarity('ohey', 'hey'))