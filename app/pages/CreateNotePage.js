import React, { Component } from 'react'
import {
  TextInput,
  StyleSheet,
  Dimensions,
  Alert,
  StatusBar,
  Text,
  Button,
  DeviceEventEmitter,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Modal
} from 'react-native'
import ImagePicker from 'react-native-image-picker'
import ImageResizer from 'react-native-image-resizer'
import ImageViewer from 'react-native-image-zoom-viewer'

import { View } from 'react-native-animatable'


import HttpUtils from '../util/HttpUtils'
import { HOST, QINIU_UPHOST } from '../util/config'
import AlertBox from '../common/AlertBox'

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height
const INNERWIDTH = WIDTH - 16

import { headerStyle, headerTitleStyle } from '../util/commonStyle'

const URL = HOST + 'notes/save'
const URL_TOKEN = HOST + 'util/qiniu_token'

export default class CreateNotePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      content: '',
      city: '',
      district: '',
      township: '',
      longitude: 0,
      latitude: 0,
      location: '地球上的某个角落',
      isDialogVisible: false,
      isImageViewerVisible: false,
      ImageViewerIndex: 0,
      animating: false,//HUD
      fileList: [],//[file1:{uri:*,name:*,token:*},file2:{uri:*,name:*,token:*}]
      note_images: [],
      uploading: false
    }
  }


  static navigationOptions = ({ navigation }) => ({
    headerTitle: '创建日记',
    headerTitleStyle: headerTitleStyle,
    headerStyle: headerStyle,
    headerTintColor: '#ffffff',
    headerRight:
    <TouchableOpacity style={{ marginRight: 30 }} onPress={() => navigation.state.params.onPost()}>
      <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: '500' }}>完成</Text>
    </TouchableOpacity>
  });


  componentDidMount() {
    // navigator.geolocation.watchPosition(
    //   (position) => {
    //     let longitude = JSON.stringify(position.coords.longitude)
    //     let latitude = JSON.stringify(position.coords.latitude)
    //     console.log(longitude + latitude)
    //     this.setState({
    //       longitude: longitude,
    //       latitude: latitude
    //     })
    //     this.fetchData(longitude, latitude)
    //   },
    //   (error) => {
    //     console.log(error)
    //   },
    //   {enableHighAccuracy: true, timeout: 5000, maximumAge: 1000}
    // )

    /**  
     * 将单击回调函数作为参数传递  
     */
    this.props.navigation.setParams({
      onPost: () => this.onPost()
    });
  }

  fetchData = (longitude, latitude) => {
    fetch('http://restapi.amap.com/v3/geocode/regeo?key=9d6935d546e2b3ec1ee3b872c1ee9bbe&location=' + longitude + ',' + latitude + '')
      .then((response) => response.json())
      .then((responseBody) => {
        console.log(responseBody)
        console.log(responseBody.regeocode.formatted_address)
        let formatted_address = responseBody.regeocode.formatted_address
        let city = responseBody.regeocode.addressComponent.province
        let district = responseBody.regeocode.addressComponent.district
        let township = responseBody.regeocode.addressComponent.township

        if (responseBody.status === 1) {
          this.setState({
            city: city,
            district: district,
            township: township,
            location: formatted_address
          })
        } else {
          console.log('定位失败')
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  showDialog() {
    this.setState({ isDialogVisible: true })
  }

  showImageViewer() {
    this.setState({ isImageViewerVisible: true })
  }

  onPost() {
    if (!this.state.title.trim()) {
      Alert.alert('小提示', '请输入日记的标题哦~')
      return
    }
    if (!this.state.content.trim()) {
      Alert.alert('小提示', '请输入日记的内容哦~')
      return
    }

    var note_images = []

    this.state.fileList.map((d, i) => {
      note_images.push('http://p1aewhbrc.bkt.clouddn.com/' + d.name)
    })

    if (note_images[0] == undefined) {
      note_images.push('https://airing.ursb.me/image/twolife/demo.png-yasuo.jpg')
    }

    this.setState({ uploading: true })
    HttpUtils.post(URL, {
      token: this.props.navigation.state.params.user.token,
      uid: this.props.navigation.state.params.user.uid,
      timestamp: this.props.navigation.state.params.timestamp,
      note_title: this.state.title,
      note_content: this.state.content,
      note_date: new Date().getTime(),
      note_location: this.state.location,
      note_longitude: this.state.longitude,
      note_latitude: this.state.latitude,
      note_images: note_images.toString()
    }).then((response) => {
      if (response.status == 0) {
        if (this.state.fileList[0] !== undefined) {
          this.state.fileList.map((d, i) => {
            console.log('this.state.fileList.map((d,i)=>')
            console.log(d)
            this.uploadFile(d, () => {
              console.log('uploadFile=>')
              console.log(d)
              console.log('uploadFile success= ', i)
              //不知道RN如何实现NSOperation group
              if (i + 1 == this.state.fileList.length) {
                this.setState({ uploading: false })
                this.showDialog()
              }
            })
          })
        } else {
          this.setState({ uploading: false })
          this.showDialog()
        }
      }
    }).catch((error) => {
      Alert.alert('小提示', '网络故障:(')
    })
  }

  resizeFile(file, complete) {
    if (!file.name) {
      Alert.alert('小提示', '图片没有名称哦~')
      return
    }
    if (!file.uri) {
      Alert.alert('小提示', '图片没有内容哦~')
      return
    }

    ImageResizer.createResizedImage(file.uri, file.width, file.height, 'JPEG', 50)
      .then((resizedImageUri) => {
        file.resizedUri = resizedImageUri
        complete(file)
      })
      .catch((err) => {
        Alert.alert('小提示', '压缩图片失败哦~')
        return
      })
  }

  uploadFile(file, complete) {
    if (!file.name) {
      Alert.alert('小提示', '图片没有名称哦~')
      return
    }
    if (!file.uri) {
      Alert.alert('小提示', '图片没有内容哦~')
      return
    }

    HttpUtils.post(URL_TOKEN, {
      token: this.props.navigation.state.params.user.token,
      uid: this.props.navigation.state.params.user.uid,
      timestamp: this.props.navigation.state.params.timestamp,
      filename: file.name
    }).then((response) => {
      if (response.status == 0) {
        file.token = response.qiniu_token
        var formData = new FormData()
        formData.append('file', { uri: file.resizedUri.uri, type: 'application/octet-stream', name: file.name })
        formData.append('key', file.name)
        formData.append('token', file.token)

        return fetch(QINIU_UPHOST, {
          method: 'post',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data'
          },
          body: formData
        }).then((response) => {
          complete()
        }).catch((error) => {
          Alert.alert('小提示', '网络故障:(')
        })
      }
    }).catch((error) => {
      Alert.alert('小提示', '网络故障:(')
    })
  }

  render() {
    var options = {
      title: '选择图片',
      takePhotoButtonTitle: '拍照',
      chooseFromLibraryButtonTitle: '选择相册',
      customButtons: [],
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    }

    var images = []
    this.state.fileList.map((d, i) => {
      file = d
      images.push({ url: file.uri })
    })

    return <View style={styles.container}>
      <StatusBar backgroundColor={'#73C0FF'} />
      <Modal
        animationType={'fade'}
        transparent={true}
        visible={this.state.isImageViewerVisible}
        onRequestClose={() => { }}
      >
        <ImageViewer imageUrls={images} index={this.state.ImageViewerIndex} onClick={() => {
          this.setState({ isImageViewerVisible: false })
        }} />
      </Modal>

      <AlertBox
        _dialogVisible={this.state.isDialogVisible}
        _dialogContent={'日记创建成功'}
        _dialogRightBtnAction={() => {
          DeviceEventEmitter.emit('homepageDidChange', 'update')
          this.props.navigation.goBack()
        }}
      />

      <ActivityIndicator
        style={styles.center}
        animating={this.state.uploading}
        color='gray'
        size='large'
      />

      <TextInput
        underlineColorAndroid='transparent'
        placeholder={'请输入日记标题'}
        placeholderTextColor={'#999999'}
        style={styles.textInput_title}
        maxLength={10}
        onChangeText={(text) => {
          this.setState({ title: text })
        }}
      />
      <TextInput
        underlineColorAndroid='transparent'
        placeholder={'描述一下你今天的心情吧～'}
        placeholderTextColor={'#999999'}
        multiline={true}
        style={[styles.textInput_title, styles.textInput_content]}
        onChangeText={(text) => {
          this.setState({ content: text })
        }} />
      <View style={styles.imageConteainer}>
        {
          this.state.fileList.map((d, i) => {
            file = d

            return <View animation='bounceInRight'>
              <TouchableOpacity
                onPress={
                  () => {
                    this.state.ImageViewerIndex = i
                    this.showImageViewer()
                  }
                }>
                <Image style={styles.addImage} source={{ uri: file.uri }} />
              </TouchableOpacity>
            </View>
          })
        }

        <TouchableOpacity
          onPress={() => {
            ImagePicker.showImagePicker(options, (response) => {
              console.log('Response = ', response)
              if (response.didCancel) {
                console.log('User cancelled image picker')
              }
              else if (response.error) {
                console.log('ImagePicker Error: ', response.error)
              }
              else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton)
              }
              else {
                let file = {
                  uri: response.uri,
                  height: response.height,
                  width: response.width,
                  name: 'image/twolife/' + this.props.navigation.state.params.user.uid + '/' + response.fileName + '-yasuo.jpg'
                }
                this.resizeFile(file, (files) => {
                  console.log('resizeFile=>')
                  console.log(file)
                  this.state.fileList.push(file)
                  this.setState({
                    fileList: this.state.fileList
                  })
                  console.log(this.state.fileList)
                })
              }
            })
          }}>
          <Image style={styles.addImage} source={require('../../res/images/upload1.png')}></Image>
        </TouchableOpacity>
      </View>
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgb(242,246,250)',
    width: WIDTH,
    height: HEIGHT
  },
  textInput_title: {
    fontFamily: 'PingFang SC',
    fontSize: 14,
    width: INNERWIDTH,
    height: 48,
    alignItems: 'center',
    backgroundColor: 'white',
    marginTop: 8,
    marginLeft: 8,
    paddingLeft: 16,
    borderRadius: 8,
  },
  textInput_content: {
    height: 0.3 * HEIGHT
  },
  imageConteainer: {
    flexDirection: 'row',
  },
  addImage: {
    width: 48,
    height: 48,
    margin: 8
  },
  center: {
    zIndex: 1,
    position: 'absolute',
    top: 100,
    left: WIDTH / 2 - 18,
    justifyContent: 'center',
  }
})
