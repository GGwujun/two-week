import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Dimensions,
  TouchableOpacity
} from 'react-native'
import Image from 'react-native-image-progress'
import * as Progress from 'react-native-progress'

import TextPingFang from './TextPingFang'


const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

export default class ClassCell extends Component {
  static defaultProps = {}

  constructor(props) {
    super(props)
    this.state = {
      title: this.props.notification.title,
      content: this.props.notification.content,
      image: this.props.notification.image,
      // time: this.props.notification.time,
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
    //let d = new Date(this.state.time)
    //let time = this.formatDate(d)
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
      <ScrollView contentContainerStyle={styles.container} >
        <TouchableOpacity
          style={styles.container}
          onPress={() => {
            navigate('NotificationDetailPage', { url: this.state.url })
          }}>

          <View style={styles.ImgContainer}>
            {CoverImage}
          </View>

          <View style={styles.contentContainer}>
            <Text
              numberOfLines={1}
              style={styles.title}>
              {this.state.title}
            </Text>
            <Text
              numberOfLines={2}
              style={styles.content}>
              {this.state.content}
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginLeft: 12,
    marginRight: 12,
    alignItems: 'center'
  },
  ImgContainer: {
    // backgroundColor: '#DBE2E8',
    alignItems: 'center',
    flex: 2
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
    flex: 3,
    paddingVertical: 30
  },
  title: {
    fontSize: 17,
    margin: 10,
    color: '#7B8993',
  },
  image: {
    height: 100,
    width: 160,
  },
  content: {
    fontSize: 14,
    margin: 10,
    color: '#AAAAAA',
    textAlignVertical: 'center'
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
