import React, { Component } from 'react'
import {
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  AlertIOS,
  StatusBar,
  Alert,
  DeviceEventEmitter,
  AsyncStorage
} from 'react-native'
import { View, Text } from 'react-native-animatable'

import CommonNav from '../common/CommonNav'
import TextPingFang from '../common/TextPingFang'
import { HOST } from '../util/config'
import HttpUtils from '../util/HttpUtils'
import Platform from 'Platform'
import AlertBox from '../common/AlertBox'
import { headerStyle, headerTitleStyle } from '../util/commonStyle'
const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height
const URL1 = HOST + 'users/connect'
const URL2 = HOST + 'users/connect_by_id'

export default class ConnectPage extends Component {
  static defaultProps = {}

  constructor(props) {
    super(props)
    this.state = {
      data: {},
      isDialogVisible: false
    }
  }

  static navigationOptions = ({ navigation }) => ({
    headerTitle: '匹配Ta',
    headerTitleStyle: headerTitleStyle,
    headerStyle: headerStyle,
    headerTintColor: '#ffffff',
    headerRight:
    <TouchableOpacity style={{ marginRight: 30 }} onPress={() => navigation.state.params.onPost()}>
      <Text style={{ color: '#ffffff', fontSize: 18,fontWeight: '500' }}>完成</Text>
    </TouchableOpacity>
  });

  showDialog() {
    this.setState({ isDialogVisible: true })
  }

  connectByRandom() {
    HttpUtils.post(URL1, {
      uid: this.props.navigation.state.params.user.uid,
      token: this.props.navigation.state.params.user.token,
      timestamp: this.props.navigation.state.params.user.timestamp,
      sex: this.props.navigation.state.params.user.user_sex
    }).then((res) => {
      if (res.status === 0) {
        this.setState({
          data: {
            user_other_id: res.data.id,
            partner: res.data
          }
        })
        this.showDialog()
      } else {
        Alert.alert('小提醒', 'QAQ，系统中已经没有异性供匹配了~快拉点你的小伙伴加入吧！')
      }
    }).catch((error) => {
      console.log(error)
    })
  }

  connectById() {
    if (Platform.OS === 'ios') {
      AlertIOS.prompt('请输入另一半的ID号', '',
        [
          { text: '取消' },
          { text: '确定' }
        ],
        (code) => {
          HttpUtils.post(URL2, {
            uid: this.props.navigation.state.params.user.uid,
            token: this.props.navigation.state.params.user.token,
            timestamp: this.props.navigation.state.params.user.timestamp,
            sex: this.props.navigation.state.params.user.user_sex,
            code: code
          }).then((res) => {
            if (res.status === 0) {
              Alert.alert('小提醒', '匹配成功啦！')
              this.setState({
                data: {
                  user_other_id: res.data.id,
                  partner: res.data
                }
              })
              this.showDialog()
            } else {
              Alert.alert('小提醒', 'QAQ，您要匹配的小伙伴不存在或者已被别人匹配过了！')
            }
          }).catch((error) => {
            console.log(error)
          })
        })
    } else {
      Alert.alert('小提醒', '对不起，安卓用户暂时不支持定向匹配。。')
    }

  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={'#73C0FF'} />
        {/* <CommonNav
          title={this.props.navigator.state.params.title}
          navigator={this.props.navigator}
          navStyle={styles.opacity0}
          navBarStyle={styles.opacity0} /> */}
        <AlertBox
          _dialogVisible={this.state.isDialogVisible}
          _dialogContent={'匹配成功啦'}
          _dialogRightBtnAction={() => {
            AsyncStorage.setItem('partner_info', JSON.stringify(this.state.data), (error) => {
              if (!error) {
                AsyncStorage.getItem('user_info', (error, result) => {
                  var user = JSON.parse(result)
                  user.user_other_id = this.state.data.id
                  AsyncStorage.setItem('user_info', JSON.stringify(user), (error) => {
                    DeviceEventEmitter.emit('homepageDidChange', 'update')
                    //this.props.onCallBack(this.state.data)
                    this.props.navigation.goBack()
                  })
                })
              }
            })
          }}
        />
        <Image style={styles.title_image} source={require('../../res/images/bad.png')} />
        <Text style={styles.title}>"Oh - Uh"</Text>
        <TextPingFang style={styles.e_title}>快点匹配自己的另一半吧~</TextPingFang>
        <TouchableOpacity
          onPress={() => {
            this.connectByRandom()
          }}>
          <View style={styles.online_login} delay={100} animation="bounceInRight">
            <Text
              style={styles.online_font}>
              随机匹配
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.connectById()
          }}>
          <View style={styles.online_register} delay={150} animation="bounceInRight">
            <Text
              style={styles.online_font}>
              定点匹配
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: WIDTH,
    height: HEIGHT,
    alignItems: 'center',
    backgroundColor: 'rgb(242,246,250)'
  },
  opacity0: {
    backgroundColor: 'rgba(0,0,0,0)'
  },
  online_login: {
    marginTop: 50,
    backgroundColor: '#73C0FF',
    alignItems: 'center',
    justifyContent: 'center',
    width: 150 / 375 * WIDTH,
    height: 44 / 667 * HEIGHT,
    borderRadius: 22 / 667 * HEIGHT
  },
  online_register: {
    margin: 20,
    backgroundColor: '#73C0FF',
    alignItems: 'center',
    justifyContent: 'center',
    width: 150 / 375 * WIDTH,
    height: 44 / 667 * HEIGHT,
    borderRadius: 22 / 667 * HEIGHT
  },
  online_font: {
    fontSize: 14,
    color: 'white',
  },
  title_image: {
    margin: 20
  },
  title: {
    margin: 10,
    color: '#1B1B1B',
    fontSize: 20
  },
  e_title: {
    margin: 5,
    color: '#777777',
    fontSize: 12,
  }
})