import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  StatusBar,
  ListView,
  ActivityIndicatorIOS
} from 'react-native'
import { createAnimatableComponent } from 'react-native-animatable'


import HttpUtils from '../util/HttpUtils'
import NotificationCell from '../common/NotificationCell'

import { HOST } from '../util/config'

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

import { headerStyle, headerTitleStyle } from '../util/commonStyle'


const AnimatableListView = createAnimatableComponent(ListView)

const URL = HOST + 'users/show_notification'

export default class NotificationsPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loaded: false,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      }),
      user: this.props.navigation.state.params.user,
      partner: this.props.navigation.state.params.partner,
      timestamp: this.props.navigation.state.params.timestamp
    }

    this.renderNotificationsList = this.renderNotificationsList.bind(this)
  }

  static navigationOptions = {
    headerTitle: '消息中心',
    headerTitleStyle: headerTitleStyle,
    headerStyle: headerStyle,
    headerLeft: null
  };


  componentDidMount() {
    this.fetchData()
  }

  fetchData() {
    HttpUtils.post(URL, {
      uid: this.state.user.id,
      token: this.state.user.token,
      timestamp: this.state.timestamp
    }).then((res) => {
      if (res.status === 0) {
        // alert(res.data)
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(res.data),
          loaded: true,
        })
      }
    })
  }

  render() {

    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={'#73C0FF'} />
        <AnimatableListView
          duration={1000}
          animation='bounceInUp'
          delay={50}
          dataSource={this.state.dataSource}
          renderRow={this.renderNotificationsList}
          removeClippedSubviews={false}
          style={styles.listView}
        />
      </View>
    )
  }

  renderNotificationsList(notification) {
    return (
      <NotificationCell
        notification={notification}
        navigator={this.props.navigation}
      />
    )
  }

  renderLoadingView() {
    return (
      <View style={styles.loading}>
        <Text>
          Loading notifications...
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: HEIGHT - 50 / 667 * HEIGHT,
    width: WIDTH,
    alignItems: 'center',
    backgroundColor: '#F3F4F6'
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  listView: {
    flex: 1,
    width: WIDTH,
    backgroundColor: '#F3F4F6',
    marginBottom: 100
  },
})
