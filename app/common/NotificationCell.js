import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity
} from 'react-native'
import Image from 'react-native-image-progress'
import * as Progress from 'react-native-progress'

import TextPingFang from './TextPingFang'


const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

export default class NotificationCell extends Component {
  static defaultProps = {}

  constructor(props) {
    super(props)
    this.state = {
      title: this.props.notification.title,
      content: this.props.notification.content,
      image: this.props.notification.image,
      time: this.props.notification.time,
      type: this.props.notification.type,
      url: this.props.notification.url,
    }
  }

  formatDate(time) {
    let month = (time.getMonth() + 1 < 10) ? ('0' + (time.getMonth() + 1)) : time.getMonth() + 1
    let date = time.getDate() < 10 ? '0' + time.getDate() : time.getDate()
    let hour = time.getHours() < 10 ? '0' + time.getHours() : time.getHours()
    let minute = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()
    return month + '-' + date + ' ' + hour + ':' + minute
  }


  render() {
    let d = new Date(this.state.time)
    let time = this.formatDate(d)
    let CoverImage = null
    const { navigate } = this.props.navigator;
    if (this.state.type === 1) {
      CoverImage = <Image
        style={styles.image}
        source={{ uri: this.state.image }}
        indicator={Progress.Circle}
      />
    }

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.timeStampContainer}>
          <TextPingFang style={styles.timeStamp}>
            {time}
          </TextPingFang>
        </View>

        <View style={styles.contentContainer}>
          <TextPingFang style={styles.title}>
            {this.state.title}
          </TextPingFang>
          <View style={styles.line} />
          {CoverImage}

          <TextPingFang style={styles.content}>
            {this.state.content}
          </TextPingFang>

          <View style={styles.line} />
          <TouchableOpacity
            onPress={() => {
              navigate('NotificationDetailPage', { url: this.state.url })
            }}>
            <View style={styles.detailConteainer}>
              <TextPingFang style={styles.detailTitle}>
                查看详情
              </TextPingFang>
              <Image
                style={styles.detailIcon}
                source={require('../../res/images/right1.png')} />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    marginLeft: 12,
    marginRight: 12,
    alignItems: 'center',
    paddingBottom:25
  },
  timeStampContainer: {
    margin: 10,
    backgroundColor: '#DBE2E8',
    borderRadius: 20 / 667 * HEIGHT,
    width: 80,
    height: 20,
    alignItems: 'center'
  },
  timeStamp: {
    fontSize: 10,
    margin: 3,
    color: 'white',
  },
  contentContainer: {
    backgroundColor: 'white',
    flexDirection: 'column',
    margin: 10,
    borderRadius: 7 / 667 * HEIGHT,
    shadowColor: '#AEAFAC',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 2,
    shadowOpacity: 0.5,
    width: WIDTH * 0.91
  },
  title: {
    fontSize: 17,
    margin: 10,
    color: '#7B8993',
  },
  image: {
    width: 320 / 375 * WIDTH,
    height: 170 / 667 * HEIGHT,
    marginTop: 10,
    marginLeft: (WIDTH * 0.91 - (320 / 375 * WIDTH)) / 2
  },
  content: {
    fontSize: 14,
    margin: 10,
    color: '#AAAAAA',
  },
  line: {
    backgroundColor: '#F5F5F5',
    height: 1.5,
  },
  detailTitle: {
    fontSize: 14,
    margin: 10,
    color: '#7B8993',
  },
  detailIcon: {
    marginTop: 12,
    marginLeft: 230 / 375 * WIDTH,
    width: 10,
    height: 16
  },
  detailConteainer: {
    flexDirection: 'row',
    height: 50
  }
})
