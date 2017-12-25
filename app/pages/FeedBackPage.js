import React, { Component } from 'react'
import {
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
  StatusBar,
  Text
} from 'react-native'
import { View } from 'react-native-animatable'

import { headerStyle, headerTitleStyle } from '../util/commonStyle'

import HttpUtils from '../util/HttpUtils'
import { HOST } from '../util/config'
import AlertBox from '../common/AlertBox'

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height
const INNERWIDTH = WIDTH - 16

const URL = HOST + 'users/feedback'

export default class FeedBackPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      contact: '',
      content: '',
      isDialogVisible: false,
    }
  }

  static navigationOptions = ({ navigation }) => ({
    headerTitle: '意见反馈',
    headerTitleStyle: headerTitleStyle,
    headerStyle: headerStyle,
    headerTintColor: '#ffffff',
    headerRight:
    <TouchableOpacity style={{ marginRight: 30 }} onPress={() => navigation.state.params.onPost()}>
      <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: '500' }}>完成</Text>
    </TouchableOpacity>
  });

  componentDidMount() {
    /**  
     * 将单击回调函数作为参数传递  
     */
    this.props.navigation.setParams({
      onPost: () => this.onPost()
    });
  }

  showDialog() {
    this.setState({ isDialogVisible: true })
  }

  hideDialog() {
    this.setState({ isDialogVisible: false })
  }

  onPost() {
    if (!this.state.contact.trim()) {
      Alert.alert('小提示', '请输入您的联系方式哦~')
      return
    }
    if (!this.state.content.trim()) {
      Alert.alert('小提示', '请输入您的反馈内容哦~')
      return
    }
    HttpUtils.post(URL, {
      token: this.props.navigation.state.params.user.token,
      content: this.state.content,
      contact: this.state.contact,
      uid: this.props.navigation.state.params.user.uid,
      timestamp: this.props.navigation.state.params.timestamp
    }).then((response) => {
      if (response.msg === '请求成功') {
        this.showDialog()
      }
    })
  }

  render() {
    return <View style={styles.container}>
      <StatusBar backgroundColor={'#73C0FF'} />
      <AlertBox
        _dialogVisible={this.state.isDialogVisible}
        _dialogRightBtnAction={() => {
          this.hideDialog()
        }}
        _dialogContent={'谢谢您的反馈，我们会尽快回复的！'}
        _dialogLeftBtnAction={() => {
          this.props.navigation.goBack()
        }}
      />
      <TextInput
        underlineColorAndroid='transparent'
        placeholder={'请输入您的邮箱或者电话'}
        placeholderTextColor={'#999999'}
        style={styles.textInput_title}
        onChangeText={(text) => {
          this.setState({ contact: text })
        }}
      />
      <TextInput
        underlineColorAndroid='transparent'
        placeholder={'描述一下你的体验或者建议吧～'}
        placeholderTextColor={'#999999'}
        multiline={true}
        style={[styles.textInput_title, styles.textInput_content]}
        onChangeText={(text) => {
          this.setState({ content: text })
        }}
      />

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
    height: 270
  },
  rightButton: {
    position: 'absolute',
    right: 0,
    width: 56,
    alignItems: 'center'
  },
  rightButton_font: {
    color: '#73C0FF',
    fontSize: 17,
    fontWeight: '500'
  },
})