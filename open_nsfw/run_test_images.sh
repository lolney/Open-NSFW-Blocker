for filename in test_images/*; do
	echo "$filename $(docker run --volume=$(pwd):/workspace bvlc/caffe:cpu \
	python ./classify_nsfw.py \
	--model_def nsfw_model/deploy.prototxt \
	--pretrained_model nsfw_model/resnet_50_1by2_nsfw.caffemodel \
	$filename)" >> output.txt
done