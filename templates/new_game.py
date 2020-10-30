import os
import shutil
d=r"C:\Users\lmgd\Documents\GitHub\LowGamesApp"
name=input("Game Name : ")
file=d+fr"\server\games\{name}.js"
shutil.copy(d + r"\templates\GameName.js", file)
with open(file, "r")as f:a=f.read().replace("GameName", name)
with open(file, "w")as f:f.write(a)

os.mkdir(d + fr"\app\games\{name.lower()}")
for i in ["css","html","js"]:
    file = d + fr"\app\games\{name.lower()}\{name.lower()}.{i}"
    shutil.copy(d + fr"\templates\game_name.{i}", file)
    with open(file, "r")as f:a=f.read().replace("game_name", name.lower())
    with open(file, "w")as f:f.write(a)