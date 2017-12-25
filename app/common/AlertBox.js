import React, { Component } from 'react'
import {
  Modal,
  TouchableHighlight,
  StyleSheet,
  Image,
  Dimensions
} from 'react-native'
import { View, Text } from 'react-native-animatable'


const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

export default class AlertBox extends Component {

  constructor(props) {
    super(props)
  }

  // static propTypes = {
  //   _dialogTitle: React.PropTypes.string, //标题
  //   _dialogContent: React.PropTypes.string, //内容
  //   _dialogLeftBtnTitle: React.PropTypes.string,    //左按键标题
  //   _dialogRightBtnTitle: React.PropTypes.string,   //右按键标题
  //   _dialogLeftBtnAction: React.PropTypes.func.isRequired,  //左点击方法
  //   _dialogRightBtnAction: React.PropTypes.func.isRequired, //右点击方法
  //   _dialogVisible: React.PropTypes.bool,       //显示还是隐藏
  // }

  static defaultProps = {
    _dialogTitle: '小提醒',
    _dialogContent: '创建日记成功',
    _dialogLeftBtnTitle: 'CANCEL',
    _dialogRightBtnTitle: 'CONTINUE',
    _dialogVisible: false,
  }

  render() {
    // onPress事件直接与父组件传递进来的属性挂接
    return (
      <Modal
        visible={this.props._dialogVisible}
        transparent={true}
        onRequestClose={() => {
        }} //如果是Android设备 必须有此方法
      >
        <View style={styles.bg}>
          <View style={styles.dialog}>
            <View style={styles.dialogImageView}>
              <Image
                style={styles.dialogImage}
                source={require('../../res/images/alertbox1.png')} />
            </View>
            <View style={styles.dialogContentView}>
              <Text style={styles.dialogContent}>
                {this.props._dialogContent}
              </Text>
            </View>
            <View style={styles.dialogUpBtnView} animation='rubberBand'>
              <TouchableHighlight style={styles.dialogBtnViewItem} onPress={this.props._dialogRightBtnAction}>
                <Text style={styles.rightButton}>
                  {this.props._dialogRightBtnTitle}
                </Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  bg: {
    width: WIDTH,
    height: HEIGHT,
    backgroundColor: 'rgba(52,52,52,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    width: 324 / 375 * WIDTH,
    height: 402 / 667 * HEIGHT,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#7C7C7C',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.8,
    alignItems: 'center',
  },
  dialogImageView: {
    width: 324 / 375 * WIDTH,
    height: 246 / 667 * HEIGHT,
  },
  dialogImage: {
    width: 324 / 375 * WIDTH,
    height: 246 / 667 * HEIGHT,
  },
  dialogTitleView: {
    width: WIDTH * 0.8,
    height: HEIGHT * 0.08,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEEEEE',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8
  },
  dialogTitle: {
    textAlign: 'center',
    fontSize: 18,
    color: '#000000',
  },
  dialogContentView: {
    width: WIDTH * 0.8,
    height: HEIGHT * 0.10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogContent: {
    textAlign: 'center',
    fontSize: 14,
    color: '#4A4A4A',
  },
  dialogUpBtnView: {
    marginTop: 10 / 667 * HEIGHT,
    width: 132 / 375 * WIDTH,
    height: 32 / 667 * HEIGHT,
  },
  dialogDownBtnView: {
    marginTop: 10 / 667 * HEIGHT,
    width: 132 / 375 * WIDTH,
    height: 32 / 667 * HEIGHT,
  },
  dialogBtnViewItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#A1C5F2',
    borderRadius: 5,
    shadowColor: '#616060',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.5,
  },
  leftButton: {
    fontSize: 14,
    color: '#f8f8f8',
    borderBottomLeftRadius: 8,
  },
  rightButton: {
    fontSize: 14,
    color: '#f8f8f8',
    borderBottomRightRadius: 8,
  },
  line: {
    backgroundColor: '#F5F5F5',
    height: 1.5,
  },
})