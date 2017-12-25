import React, { Component } from 'react'
import {
  StyleSheet,
  Navigator,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
  Dimensions,
  TextInput,
  Alert,
  AsyncStorage,
  TouchableWithoutFeedback
} from 'react-native'
import dismissKeyboard from 'dismissKeyboard'
import * as Animatable from 'react-native-animatable'
import { createAnimatableComponent, View, Text } from 'react-native-animatable'
import { NavigationActions } from 'react-navigation';

import NavigationBar from '../common/NavigationBar'
import TextPingFang from '../common/TextPingFang'
import TimerButton from '../common/TimerButton'

import LoginPage from './LoginPage'
import HttpUtils from '../util/HttpUtils'
import { HOST } from '../util/config'

const WIDTH = Dimensions.get('window').width
const INNERWIDTH = WIDTH - 16
const HEIGHT = Dimensions.get('window').height

const URL1 = HOST + 'users/code'
const URL2 = HOST + 'users/register'

export default class RegisterPage extends Component {
  static defaultProps = {}

  constructor(props) {
    super(props)
    this.state = {
      user_account: '',
      user_password: '',
      user_name: '',
      code: '',
      lasttime: 0
    }
  }

  static navigationOptions = {
    headerTitle: '注册',
    headerTitleStyle: {
      alignSelf: 'center'
    },
    header: null
  };

  getCode() {
    let nowtime = new Date().getTime()
    if (nowtime - this.state.lasttime < 600000) {
      Alert.alert('小提示', '请等待十分钟才可以获取哦~')
      return
    }
    if (!this.state.user_account.trim()) {
      Alert.alert('小提示', '请输入手机号哦~')
      return
    }
    HttpUtils.post(URL1, {
      user_account: this.state.user_account.trim(),
      timestamp: nowtime
    }).then((response) => {
      switch (response.status) {
        case 200:
          this.state.lasttime = response.timestamp
          break
        case 5000:
          Alert.alert('小提示', '请等待十分钟才可以获取哦~')
          break
        default:
          Alert.alert('小提示', '获取验证码失败！')
          break
      }
    }).catch((error) => {
      console.log(error)
    })
  }

  onSubmit() {
    if (!this.state.user_account.trim()) {
      Alert.alert('小提示', '请输入手机号哦~')
      return
    }
    if (!this.state.code.trim()) {
      Alert.alert('小提示', '请输入验证码哦~')
      return
    }
    if (!this.state.user_password.trim()) {
      Alert.alert('小提示', '请输入密码哦~')
      return
    }
    if (!this.state.user_name.trim()) {
      Alert.alert('小提示', '请输入昵称哦~')
      return
    }
    alert(this.state.code)
    HttpUtils.post(URL2, {
      user_account: this.state.user_account.trim(),
      user_password: this.state.user_password.trim(),
      user_name: this.state.user_name.trim(),
      code: this.state.code.trim(),
      timestamp: this.state.lasttime
    }).then((response) => {
      switch (response.status) {
        case 0:
          Alert.alert('小提示', '注册成功！')
          const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
              NavigationActions.init({
                routeName: 'LoginPage'
              })
            ]
          })
          this.props.navigation.dispatch(resetAction)
          break
        case 1003:
          Alert.alert('小提示', '验证码错误！')
          break
        case 1004:
          Alert.alert('小提示', '该手机号已被注册！')
          break
        default:
          Alert.alert('小提示', '注册失败！')
          break
      }
    }).catch((error) => {
      console.log(error)
    })
  }

  render() {
    return (
      <View>
        <StatusBar backgroundColor={'#73C0FF'} />
        <TouchableWithoutFeedback onPress={dismissKeyboard}>

          <View style={styles.container} animation='fadeIn'>
            {/* <Image style={styles.bg} source={require('../../res/images/welcome_bg.png')}>
            </Image> */}
            <View style={styles.text}>
              <TextPingFang style={styles.title}>双生</TextPingFang>
              <TextPingFang style={styles.e_title}>今夕何夕 见此良人</TextPingFang>
            </View>
            <View style={styles.form} animation='zoomIn' delay={100}>
              <TextInput
                underlineColorAndroid='transparent'
                placeholder={'请输入您的手机号'}
                placeholderTextColor={'white'}
                style={styles.textinput}
                keyboardType='numeric'
                onChangeText={(text) => {
                  this.setState({ user_account: text })
                }}
              />
              <TextInput
                underlineColorAndroid='transparent'
                placeholder={'请先获取验证码再输入哦'}
                placeholderTextColor={'white'}
                keyboardType='numeric'
                style={styles.textinput}
                onChangeText={(text) => {
                  this.setState({ code: text })
                }}
              />
              <TextInput
                underlineColorAndroid='transparent'
                placeholder={'请输入密码'}
                placeholderTextColor={'white'}
                style={styles.textinput}
                password={true}
                onChangeText={(text) => {
                  this.setState({ user_password: text })
                }}
              />
              <TextInput
                underlineColorAndroid='transparent'
                placeholder={'请输入您的昵称'}
                placeholderTextColor={'white'}
                style={styles.textinput}
                onChangeText={(text) => {
                  this.setState({ user_name: text })
                }}
              />
              <Text style={styles.remind}>很高兴 遇见你 ：）</Text>
            </View>
            <TouchableOpacity
              style={styles.online_code}
              onPress={() => {
                this.getCode()
              }}>
              <View animation='zoomIn' delay={100}>
                <Text
                  style={styles.online_font}>
                  获取验证码
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.online_login}
              onPress={() => {
                this.onSubmit()
              }}>
              <View animation='zoomIn' delay={100}>
                <Text
                  style={styles.online_font}>
                  注册
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.online_register}
              onPress={() => {
                {/* navigate('LoginPage') */ }
                const resetAction = NavigationActions.reset({
                  index: 0,
                  actions: [
                    NavigationActions.init({
                      routeName: 'LoginPage'
                    })
                  ]
                })
                this.props.navigation.dispatch(resetAction)
              }}>
              <View animation='zoomIn' delay={100}>
                <Text
                  style={styles.online_font}>
                  返回
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#73C0FF',
    width: WIDTH,
    height: HEIGHT,
    alignItems: 'center',
  },
  bg: {
    alignItems: 'center',
    width: WIDTH,
    height: HEIGHT
  },
  logo: {
    marginTop: 60 * HEIGHT / 667,
  },
  text: {
    alignItems: 'center',
  },
  title: {
    backgroundColor: 'rgba(0,0,0,0)',
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    height: 33 / 667 * HEIGHT,
    marginTop: HEIGHT * 0.0419
  },
  e_title: {
    backgroundColor: 'rgba(0,0,0,0)',
    fontSize: 12,
    color: 'white'
  },
  form: {
    marginTop: HEIGHT * 0.0479,
    alignItems: 'center',
    justifyContent: 'center',
    // width:240
  },
  textinput: {
    height: 44 / 667 * HEIGHT,
    width: 240 / 375 * WIDTH,
    color: 'white',
    backgroundColor: 'rgb(139,203,255)',
    borderRadius: 22 / 667 * HEIGHT,
    marginBottom: 14 / 667 * HEIGHT,
    fontSize: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 10 / 375 * WIDTH,
    flexDirection: 'row'
  },
  remind: {
    fontSize: 10,
    color: 'white',
    marginTop: HEIGHT * 0.037,
    backgroundColor: 'rgba(0,0,0,0)'
  },
  online_code: {
    position: 'absolute',
    bottom: HEIGHT * 0.245,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    width: 150 / 375 * WIDTH,
    height: 44 / 667 * HEIGHT,
    borderRadius: 22 / 667 * HEIGHT
  },
  online_login: {
    position: 'absolute',
    bottom: HEIGHT * 0.155,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    width: 150 / 375 * WIDTH,
    height: 44 / 667 * HEIGHT,
    borderRadius: 22 / 667 * HEIGHT
  },
  online_register: {
    position: 'absolute',
    bottom: HEIGHT * 0.065,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    width: 150 / 375 * WIDTH,
    height: 44 / 667 * HEIGHT,
    borderRadius: 22 / 667 * HEIGHT
  },
  online_font: {
    fontSize: 14
  }
})