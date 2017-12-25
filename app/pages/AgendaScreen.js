import React, { Component } from 'react'
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  DeviceEventEmitter,
} from 'react-native'
import { Agenda } from 'react-native-calendars'
import { View } from 'react-native-animatable'



import TextPingFang from '../common/TextPingFang'
import { HOST } from '../util/config'
import HttpUtils from '../util/HttpUtils'

import { headerStyle, headerTitleStyle } from '../util/commonStyle'


const HEIGHT = Dimensions.get('window').height
const URL = HOST + 'notes/show'

export default class AgendaScreen extends Component {
  static navigationOptions = ({ navigation, screenProps
}) => ({
      headerTitle: '日记',
      headerTitleStyle: headerTitleStyle,
      headerStyle: headerStyle,
      headerLeft: <Image source={require('../../res/images/update_white.png')} />,
      headerRight: <TouchableOpacity
        onPress={() => {
          navigation.state.params.navigatePress()
        }}>
        <Image style={{ marginRight: 20, tintColor: '#FFFFFF' }} source={require('../../res/images/update_icon.png')} />
      </TouchableOpacity>
    });


  constructor(props) {
    super(props)

    this.state = {
      items: {},
      show: false,
      user: this.props.navigation.state.params.user,
      partner: this.props.navigation.state.params.partner
    }
  }

  render() {
    let nowtimestamp = new Date().getTime()
    let nowtime = this.timeToString(nowtimestamp)
    return (
      <View style={styles.container} animation='fadeIn'>
        <Agenda
          items={this.state.items}
          loadItemsForMonth={this.loadItems.bind(this)}
          selected={nowtime}
          renderItem={this.renderItem.bind(this)}
          renderEmptyDate={this.renderEmptyDate.bind(this)}
          rowHasChanged={this.rowHasChanged.bind(this)}
          theme={{
            backgroundColor: 'rgb(242,246,250)'
          }}
        />
      </View>
    )
  }
  clickFinishButton = () => {
    this.state.items = {}
    this.loadData(this.state.user.uid, this.state.user.user_other_id)
  }
  componentWillMount() {
    this.loadData(this.state.user.uid, this.state.user.user_other_id)
    this.props.navigation.setParams({ navigatePress: this.clickFinishButton })
    // this.subscription = DeviceEventEmitter.addListener('homepageDidChange', () => {
    //   this.state.items = {}
    //   this.loadData(this.state.user.uid, this.state.user.user_other_id)
    //   this.setState({
    //     show: !this.state.show
    //   })
    // })
  }

  componentWillUnmount() {
    //this.subscription.remove()
  }

  loadData(uid, user_id) {
    for (let i = -365; i < 365; i++) {
      const time = 1496707200000 + i * 24 * 60 * 60 * 1000
      const strTime = this.timeToString(time)
      if (!this.state.items[strTime]) {
        this.state.items[strTime] = []
      }
    }

    HttpUtils.post(URL, {
      uid: uid,
      token: this.state.user.token,
      timestamp: this.state.user.timestamp,
      user_id: user_id,
      sex: this.state.user.user_sex
    }).then((res) => {
      //alert(JSON.stringify(res.data[0].me))
      res.data.map((note) => {
        let note_time = note.note_date
        let note_date = this.timeToString(note_time)
        if (!this.state.items[note_date]) {
          this.state.items[note_date] = []
          this.state.items[note_date].push({
            title: note.note_title,
            content: note.note_content,
            height: 70,
            male: note.male,
            note_id: note.note_id,
            note_time: note.note_date,
            me: note.me,
            location: note.note_location,
            images: note.note_images
          })
        } else {
          this.state.items[note_date].push({
            title: note.note_title,
            content: note.note_content,
            height: 70,
            male: note.male,
            note_id: note.note_id,
            note_time: note.note_date,
            me: note.me,
            location: note.note_location,
            images: note.note_images
          })
        }
      })
      console.log(this.state.items)
      const newItems = {}
      Object.keys(this.state.items).forEach(key => {
        newItems[key] = this.state.items[key]
      })
      this.setState({
        items: newItems
      })
    }).catch((error) => {
      console.log(error)
    })
  }

  loadItems(day) {
    console.log(`Load Items for ${day.year}-${day.month}`)
  }



  renderItem(item) {
    return (
      <TouchableOpacity
        onPress={() => {
          {/* alert(this.state.partner) */}
          this.props.navigation.navigate('DairyPage', {
            note_id: item.note_id,
            note_time: item.note_time,
            me: item.me,
            title: item.title,
            content: item.content,
            user: this.state.user,
            partner: this.state.partner,
            note_images: item.images,
            note_location: item.location
          });
        }}>
        <View
          animation="bounceInRight"
          delay={100}
          style={[item.male === 'male' ? styles.item_male : styles.item_female, { height: item.height }]}>
          <TextPingFang style={item.male === 'male' ? styles.font_male_title : styles.font_female_title}>
            {item.title}
          </TextPingFang>
          <TextPingFang style={item.male === 'male' ? styles.font_male : styles.font_female}>
            {item.content}
          </TextPingFang>
        </View>
      </TouchableOpacity>
    )
  }

  renderEmptyDate() {
    return (
      <View style={styles.emptyDate}><TextPingFang>今天没有写日记哦~</TextPingFang></View>
    )
  }

  rowHasChanged(r1, r2) {
    // return r1.name !== r2.name
  }

  timeToString(time) {
    const date = new Date(time)
    return date.toISOString().split('T')[0]
  }
}

const styles = StyleSheet.create({
  container: {
    height: HEIGHT,
    backgroundColor: 'rgb(242,246,250)'
  },
  item_male: {
    backgroundColor: '#45b0f9',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 5
  },
  item_female: {
    backgroundColor: 'pink',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 5
  },
  font_male: {
    color: 'white',
    height: 20
  },
  font_female: {
    color: 'white',
    height: 20
  },
  font_male_title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  font_female_title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30
  }
})
