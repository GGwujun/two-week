/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';

import {
  StyleSheet, Text, View, Button, Dimensions,
  AsyncStorage, TabBarBottom, Image, StatusBar
} from 'react-native';
import { StackNavigator, TabNavigator, NavigationActions } from 'react-navigation';




import ProfileScreen from './app/pages/myCenter.js'
import NotificationsPage from './app/pages/NotificationsPage.js'
import NotificationDetailPage from './app/pages/NotificationDetailPage.js'
import AgendaScreen from './app/pages/AgendaScreen.js'

import ClassPage from './app/pages/ClassPage.js'
import ClassDetailPage from './app/pages/ClassDetailPage.js'


import DairyPage from './app/pages/DairyPage.js'

import RegisterPage from './app/pages/RegisterPage'
import LoginPage from './app/pages/LoginPage'
import HttpUtils from './app/util/HttpUtils'
import { HOST } from './app/util/config'

import CreateNotePage from './app/pages/CreateNotePage'
import SettingPage from './app/pages/SettingPage'
import FeedBackPage from './app/pages/FeedBackPage'
import ConnectPage from './app/pages/ConnectPage'
import PartnerPage from './app/pages/PartnerPage'

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height
const URL = HOST + 'users/check'

class HomeScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  static navigationOptions = {
    headerTitle: 'Welcome',
    header: null
  };

  _checkPermissions() {
    PushNotificationIOS.checkPermissions((permissions) => {
      if (!permissions.alert) {
        PushNotificationIOS.requestPermissions()
      }
    })
  }

  _sendLocalNotification() {
    AsyncStorage.setItem('notifi_registered', 'true', (error) => {
      let notification = {
        fireDate: new Date(1970, 1, 1, 20, 0, 0).getTime(),
        alertBody: '今天你遇到了什么？记得来双生里记录一下哦~',
        userInfo: {},
        applicationIconBadgeNumber: 1,
        repeatInterval: 'day'
      }
      //PushNotificationIOS.scheduleLocalNotification(notification)
    })
  }

  componentDidMount() {
    //this._checkPermissions()
    AsyncStorage.getItem('notifi_registered', (error, result) => {
      if (!error) {
        if (result === '' || result === null || result !== 'true') {
          this._sendLocalNotification()
        }
      } else {
        console.log('查询数据失败')
      }
    })
  }

  componentWillMount() {
    AsyncStorage.getItem('user_info',
      (error, result) => {
        if (!error) {
          if (result != '' && result != null) {
            console.log('查询到的内容是：' + result)
            result.uid = result.id;
            this.state.user = JSON.parse(result)
            AsyncStorage.getItem('partner_info', (error, result) => {
              this.state.partner = JSON.parse(result)
              if (!error) {
                HttpUtils.post(URL, {
                  token: this.state.user.token,
                  uid: this.state.user.uid,
                  timestamp: this.state.user.timestamp,
                }).then((res) => {
                  if (res.status === 0) {

                    const resetAction = NavigationActions.reset({
                      index: 0,
                      actions: [NavigationActions.init({
                        routeName: 'Tab',
                        params: {
                          user: this.state.user,
                          partner: this.state.partner,
                          timestamp: this.state.user.timestamp
                        }
                      })]
                    })
                    this.props.navigation.dispatch(resetAction)
                  } else {
                    const resetAction = NavigationActions.reset({
                      index: 0,
                      actions: [
                        NavigationActions.navigate({ routeName: 'LoginPage' })
                      ]
                    })
                    this.props.navigation.dispatch(resetAction)
                  }
                }).catch(error => { })
              }
            })
          } else {
            const resetAction = NavigationActions.reset({
              index: 0,
              actions: [NavigationActions.navigate({ routeName: 'LoginPage' })]
            })
            this.props.navigation.dispatch(resetAction)
          }
        } else {
          console.log('发生错误')
        }
      })
  }

  render() {

    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={'#73C0FF'} />
        <Image source={require('./res/images/welcome1.png')} style={styles.logo} />
      </View>
    )
  }
}







const Tab = TabNavigator(
  {
    ClassPage: {
      screen: ClassPage,
      navigationOptions: ({ navigation }) => ({
        tabBarLabel: '首页',
        tabBarIcon: ({ tintColor, focused }) => (
          <Image
            source={focused ? require('./res/images/home21.png') : require('./res/images/home11.png')}
            style={{}}
          />
        ),
      })
    },
    AgendaScreen: {
      screen: AgendaScreen,
      navigationOptions: ({ navigation }) => ({
        tabBarLabel: '日记',
        tabBarIcon: ({ tintColor, focused }) => (
          <Image
            source={focused ? require('./res/images/home21.png') : require('./res/images/home11.png')}
            style={{}}
          />
        ),
      }),
    },

    NotificationsPage: {
      screen: NotificationsPage,
      navigationOptions: ({ navigation }) => ({
        tabBarLabel: '消息',
        tabBarIcon: ({ tintColor, focused }) => (
          <Image
            source={focused ? require('./res/images/message21.png') : require('./res/images/message11.png')}
            style={{}}
          />
        )
      })
    },

    ProfileScreen: {
      screen: ProfileScreen,
      navigationOptions: ({ navigation }) => ({
        tabBarLabel: '我',
        tabBarIcon: ({ tintColor, focused }) => (
          <Image
            source={focused ? require('./res/images/profile21.png') : require('./res/images/profile11.png')}
            style={{}}
          />
        )
      })
    }
  },

  {
    tabBarPosition: 'bottom',
    swipeEnabled: true,
    animationEnabled: true,
    lazy: true,
    backBehavior: true,
    tabBarOptions: {
      activeTintColor: '#06c1ae',
      inactiveTintColor: '#979797',
      showIcon: true,
      indicatorStyle: {
        height: 0  // 如TabBar下面显示有一条线，可以设高度为0后隐藏
      },
      style: { backgroundColor: '#ffffff', height: 60 },
      labelStyle: {
        // fontSize: 16
      }
    }

  }

);


const SimpleApp = StackNavigator({
  HomeScreen: {
    screen: HomeScreen
  },
  Tab: {
    screen: Tab
  },
  NotificationDetailPage: {
    screen: NotificationDetailPage
  },
  ClassDetailPage: { screen: ClassDetailPage },
  CreateNotePage: {
    screen: CreateNotePage
  },
  SettingPage: { screen: SettingPage },
  FeedBackPage: { screen: FeedBackPage },
  ConnectPage: { screen: ConnectPage },
  PartnerPage: { screen: PartnerPage },
  LoginPage: {
    screen: LoginPage
  },
  RegisterPage: {
    screen: RegisterPage
  },
  DairyPage: {
    screen: DairyPage
  }
});

export default class App extends Component {
  render() {
    return <SimpleApp />;
  }
}


const styles = StyleSheet.create({
  container: {
    height: HEIGHT,
    backgroundColor: 'white'
  },
  logo: {
    position: 'absolute',
    top: 260 / 667 * HEIGHT,
    left: (WIDTH - 165 / 375 * WIDTH) / 2,
    width: 165 / 375 * WIDTH,
    height: 138 / 667 * HEIGHT,
  }
})


