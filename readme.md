First time running:
```
docker run --volume=$(pwd):/workspace --name=images -e PYTHONUNBUFFERED=0 --publish 8000:8000 bvlc/caffe:cpu python ./webserver.py
```

Subsequently (may have run with sudo):
```
docker start -a images
```
