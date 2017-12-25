import React, { Component } from 'react'
import {
  StyleSheet,
  Navigator,
  Dimensions,
  TouchableOpacity,
  Modal,
  StatusBar,
  Text,
  DeviceEventEmitter,
  Alert
} from 'react-native'
import Carousel from 'react-native-snap-carousel'
import ImageViewer from 'react-native-image-zoom-viewer'
import { View } from 'react-native-animatable'
import Image from 'react-native-image-progress'
import * as Progress from 'react-native-progress'

import TextPingFang from '../common/TextPingFang'
import { HOST } from '../util/config'
import HttpUtils from '../util/HttpUtils'

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height
const URL = HOST + 'notes/delete'
import { headerStyle, headerTitleStyle } from '../util/commonStyle'


export default class DairyPage extends Component {
  static defaultProps = {}

  constructor(props) {
    super(props)
    this.state = {
      isImageViewerVisible: false,
      ImageViewerIndex: 0,
      note_images: [
        'https://airing.ursb.me/image/twolife/demo.png-yasuo.jpg',
        'https://airing.ursb.me/image/twolife/demo.png-yasuo.jpg',
        'https://airing.ursb.me/image/twolife/demo.png-yasuo.jpg'
      ],
      note_location: '来自地球上的某个角落'
    }
    { this.showImageViewer = this.showImageViewer.bind(this) }
  }

  static navigationOptions = {
    headerTitle: '日记详情',
    headerTitleStyle: headerTitleStyle,
    headerStyle: headerStyle,
    headerTintColor: '#ffffff',
    headerRight: <TouchableOpacity style={{ marginRight: 30 }} onPress={() => navigation.state.params.onPost()}>
      <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: '500' }}></Text>
    </TouchableOpacity>
  };


  formatDate(now) {
    let year = now.getYear() - 100 + 2000
    let month = (now.getMonth() + 1) < 10 ? '0' + (now.getMonth() + 1) : (now.getMonth() + 1)
    let date = now.getDate() < 10 ? '0' + now.getDate() : now.getDate()
    return month + '-' + date + '-' + year
  }

  formatTime(now) {
    let hour = now.getHours() < 10 ? '0' + now.getHours() : now.getHours()
    let minute = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes()
    return hour + ':' + minute
  }

  showImageViewer() {
    this.setState({ isImageViewerVisible: true })
  }

  render() {

    let d = new Date(this.props.navigation.state.params.note_time)
    let date = this.formatDate(d)
    let time = this.formatTime(d)

    let images = []
    let note_images = ''
    if (this.props.navigation.state.params.note_images !== null) {
      note_images = this.props.navigation.state.params.note_images.split(',')
    } else {
      note_images = this.state.note_images
    }
    if (this.props.navigation.state.params.note_location !== 'undefined' && this.props.navigation.state.params.note_location !== null) {
      this.state.note_location = this.props.navigation.state.params.note_location
    }

    note_images.map(item => {
      images.push({ url: item })
    })

    let AvatarContainer, DeleteButton = null
    if (this.props.navigation.state.params.me === 'yes') {
      AvatarContainer = <View style={styles.avatarContainer}>
        <Image style={styles.avatar} source={{ uri: this.props.navigation.state.params.user.user_face }} />
        <TextPingFang style={styles.username}>{this.props.navigation.state.params.user.user_name}</TextPingFang>
      </View>

      DeleteButton = <View>
        <TouchableOpacity
          onPress={() => {
            Alert.alert('是否删除日记？', '', [
              { text: '取消', onPress: this.userCanceled },
              {
                text: '确定',
                onPress: (user_state) => {
                  HttpUtils.post(URL,
                    {
                      uid: this.props.navigation.state.params.user.uid,
                      token: this.props.navigation.state.params.user.token,
                      timestamp: this.props.navigation.state.params.user.timestamp,
                      note_id: this.props.navigation.state.params.note_id
                    })
                    .then((res) => {
                      if (res.status === 0) {
                        Alert.alert('小提醒', '删除成功！')
                        DeviceEventEmitter.emit('homepageDidChange', 'update')
                        this.props.navigation.goBack();
                      }
                    })
                }
              }])
          }}>
          <Image style={styles.delete} source={require('../../res/images/icondelete1.png')} />
        </TouchableOpacity>
      </View>
    } else {
      AvatarContainer = <View style={styles.avatarContainer}>
        <Image style={styles.avatar} source={{ uri: this.props.navigation.state.params.partner.user_face }} />
        <TextPingFang style={styles.username}>{this.props.navigation.state.params.partner.user_name}</TextPingFang>
      </View>
    }


    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={'#73C0FF'} />
        <Modal
          animationType={'fade'}
          transparent={true}
          visible={this.state.isImageViewerVisible}>
          <ImageViewer
            imageUrls={images}
            index={this.state.ImageViewerIndex}
            onClick={() => {
              this.setState({ isImageViewerVisible: false })
            }} />
        </Modal>
        <View style={styles.card}>
          <View style={styles.menuContainer}>
            {/* <TouchableOpacity
              onPress={() => {
                this.props.navigation.goBack();
              }}>
              <Image style={styles.menu} source={require('../../res/images/menu.png')} />
            </TouchableOpacity> */}
            <TextPingFang style={styles.date}>{date}</TextPingFang>
            <TextPingFang style={styles.time}>{time}</TextPingFang>
            {
              DeleteButton
            }
          </View>
          {
            AvatarContainer
          }
          <View style={styles.swiperContainer}>
            <Carousel
              sliderWidth={269 / 375 * WIDTH}
              itemWidth={220 / 375 * WIDTH}
              data={note_images}
              firstItem={0}
              renderItem={({ item, i }) => (
                <TouchableOpacity
                  onPress={() => {
                    this.state.ImageViewerIndex = i
                    this.showImageViewer()
                  }}>
                  <Image
                    style={{ width: 100, height: 100 }}
                    source={{ uri: item }}
                    indicator={Progress.Circle}>
                  </Image>
                </TouchableOpacity>
              )}
              inactiveSlideScale={0.94}
              inactiveSlideOpacity={0.6}
              enableMomentum={false}
              containerCustomStyle={styles.slider}
              contentContainerCustomStyle={styles.sliderContainer}
              showsHorizontalScrollIndicator={false}
            >
            </Carousel>
          </View>
          <View style={styles.contentContainer}>
            <TextPingFang style={styles.title}>{this.props.navigation.state.params.title}</TextPingFang>
            <TextPingFang style={styles.place}>{this.state.note_location}</TextPingFang>
            <TextPingFang style={styles.content}>{this.props.navigation.state.params.content}</TextPingFang>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: HEIGHT,
    backgroundColor: 'rgb(242,246,250)'
  },
  card: {
    backgroundColor: 'white',
    flexDirection: 'column',
    // marginTop: (HEIGHT - 567 / 667 * HEIGHT) / 2,
    // marginLeft: (WIDTH - 336 / 375 * WIDTH) / 2,
    borderRadius: 5 / 667 * HEIGHT,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    shadowOpacity: 0.5,
    // width: 336 / 375 * WIDTH,
    height: HEIGHT
  },
  menuContainer: {
    flexDirection: 'row',
    marginLeft: 31 / 375 * WIDTH,
    marginTop: 33 / 667 * HEIGHT
  },
  menu: {
    width: 18,
    height: 16,
  },
  date: {
    marginLeft: 21 / 375 * WIDTH,
    fontSize: 12,
    lineHeight: 17,
    color: 'black'
  },
  time: {
    marginLeft: 12 / 375 * WIDTH,
    fontSize: 12,
    lineHeight: 17,
    color: '#989898'
  },
  avatarContainer: {
    flexDirection: 'row',
    marginLeft: 70 / 375 * WIDTH,
    marginTop: 19 / 667 * HEIGHT
  },
  avatar: {
    width: 20 / 375 * WIDTH,
    height: 20 / 667 * HEIGHT,
    borderRadius: 4 / 667 * HEIGHT,
  },
  username: {
    marginLeft: 6 / 375 * WIDTH,
    fontSize: 12,
    lineHeight: 20,
    color: 'black'
  },
  swiperContainer: {
    marginLeft: 67 / 375 * WIDTH,
    marginTop: 20 / 667 * HEIGHT,
    width: 269 / 375 * WIDTH
  },
  image: {
    width: 220 / 375 * WIDTH,
    height: 108 / 667 * HEIGHT,
    borderRadius: 7 / 667 * HEIGHT,
  },
  contentContainer: {
    marginLeft: 67 / 375 * WIDTH,
    marginRight: 20 / 375 * WIDTH,
    marginTop: 21 / 667 * HEIGHT
  },
  title: {
    fontSize: 17,
    lineHeight: 22,
    color: '#030303'
  },
  place: {
    marginTop: 21 / 667 * HEIGHT,
    fontSize: 12,
    lineHeight: 17,
    color: '#9B9B9B'
  },
  content: {
    marginTop: 21 / 667 * HEIGHT,
    fontSize: 12,
    lineHeight: 17,
    color: '#3D3D3D'
  },
  slider: {
    margin: 0,
    width: 220 / 375 * WIDTH,
    height: 108 / 667 * HEIGHT
  },
  sliderContainer: {},
  delete: {
    width: 12 / 375 * WIDTH,
    height: 12 / 667 * HEIGHT,
    marginLeft: 20 / 375 * WIDTH,
    marginTop: 2 / 667 * HEIGHT
  }
})