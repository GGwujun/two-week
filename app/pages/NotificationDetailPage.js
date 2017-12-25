import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Dimensions,
  WebView,
  StatusBar,
  TouchableOpacity,
  Text
} from 'react-native'

import { headerStyle, headerTitleStyle } from '../util/commonStyle'

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

export default class NotificationDetailPage extends Component {
  static defaultProps = {}

  static navigationOptions = {
    headerTitle: '消息详情',
    headerTitleStyle: headerTitleStyle,
    headerStyle: headerStyle,
    headerTintColor: '#ffffff',
    headerRight: <TouchableOpacity style={{ marginRight: 30 }} onPress={() => navigation.state.params.onPost()}>
      <Text style={{ color: '#000', fontSize: 18 }}></Text>
    </TouchableOpacity>
  };

  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={'#73C0FF'} />
        <WebView
          bounces={true}
          scalesPageToFit={true}
          startInLoadingState={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          source={{ uri: this.props.navigation.state.params.url }}
          style={styles.webview}>
        </WebView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    width: WIDTH,
    height: HEIGHT
  }
})