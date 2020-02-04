# Video Super-Resolution Application
Video Super Resolution application using Reactjs + Django. In this project, I use [EDVR](https://github.com/xinntao/EDVR) model which is trained by my own datasets. You are allowed using any other SR models.

## Requirements
- Python 3
- Pytorch >= 1.1
- NVIDIA GPU + CUDA
- Deformable Convolution. We use mmdetection's dcn implementation. Please first compile it. 
```
cd ./recognition/SRModels/EDVR/models/archs/dcn
python setup.py develop
```
- Python packages: ```pip install numpy opencv-python pyyaml```
- Django 3
- DjangoRestFramework
- MySQL connection (can use any other database, remember to config it in Django).
- React >= 16.8
- Running ```yarn install``` to install the dependencies (you could use NPM).

## To-dos
- [x] Implement video player.
- [x] Implement Cropping tool for video.
- [x] Implement extracting frames from Cropping tool.
- [x] Implement API for generating SR images from video.
- [ ] User login.
- [ ] Upload videos.
- [ ] Landing pages.
- [ ] Using GraphQL.
- [ ] Further more features.

## Preview
![Preview](/preview.gif)

## Projects model
![Projects Model](/project.png)

## Citation
```
@InProceedings{wang2019edvr,
  author    = {Wang, Xintao and Chan, Kelvin C.K. and Yu, Ke and Dong, Chao and Loy, Chen Change},
  title     = {EDVR: Video restoration with enhanced deformable convolutional networks},
  booktitle = {The IEEE Conference on Computer Vision and Pattern Recognition Workshops (CVPRW)},
  month     = {June},
  year      = {2019},
}
```
