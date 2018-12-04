An experimental web extension that Yahoo's open_nsfw to block naughty images.

# Setting up the server (see open_nsfw for more details)

First time running:

```
docker run --volume=$(pwd):/workspace --name=images -e PYTHONUNBUFFERED=0 --publish 8000:8000 bvlc/caffe:cpu python ./webserver.py
```

Subsequently (may have to run with sudo):

```
docker start -a images
```
