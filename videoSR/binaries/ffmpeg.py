import os
from os.path import join
from glob import glob
import subprocess


def video2Frames(crop, fps, totalTime, videoLocation):
    currentTime = crop["currentTime"]
    height = crop["height"] // 4 * 4
    width = crop["width"] // 4 * 4
    x = crop["x"]
    y = crop["y"]
    timePerFrame = 1 / fps
    startTime = float(currentTime) - timePerFrame * 2
    time = timePerFrame * 5
    savePath = "recognition\\SRModels\\EDVR\\data"

    arg = (
        "binaries\\ffmpeg.exe -i {}".format(videoLocation)
        + " -vf fps={} -filter:v crop={}:{}:{}:{} ".format(fps, width, height, x, y)
        + "-ss {} -t {} {}\\%02d.png".format(startTime, time, savePath)
    ).split()
    print(arg)

    # Clean up before executing command
    for path in glob(join(savePath, "*")):
        os.remove(path)
    subprocess.run(arg, shell=True)
