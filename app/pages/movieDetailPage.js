/**
 * Created by lipeiwei on 16/10/9.
 */
import React, { PropTypes, Component } from 'react';
import {
  Image,
  Text,
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  InteractionManager,
  Platform,
  Slider,
  Dimensions
} from 'react-native';


import commonStyle from '../style/commonStyle';
import { parseDate } from '../util/dateUtil';
import monthArray from '../constant/month';
import MovieInfo from './movieInfo';

import LoadingManagerView from './loadingManagerView';

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: '#F4F5F7',
    flex: 1
  },
  image: {
    width: windowWidth,
    height: 150,
  },
  avatarImage: {
    height: 50,
    width: 50,
    borderRadius: 25
  },
  rowContainer: {
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  authorInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  authorInfo: {
    marginLeft: 10
  },
  authorName: {
    color: commonStyle.LIGHT_BLUE_COLOR
  },
  timeText: {
    color: commonStyle.TEXT_GRAY_COLOR,
    marginTop: 5
  },
  titleText: {
    marginVertical: 10,
    color: commonStyle.TEXT_COLOR,
    fontSize: 20,
    margin: 10
  },
  contentText: {
    color: commonStyle.TEXT_COLOR,
    fontSize: 16,
    margin: 10
  },
  grayViewContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: commonStyle.LIGHT_GRAY_COLOR,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  lightGrayText: {
    color: commonStyle.TEXT_GRAY_COLOR,
    fontSize: 14
  },
  smallIcon: {
    width: 45,
    height: 45,
  },
  video: {
    flex: 1
  },
});

import { headerStyle, headerTitleStyle } from '../util/commonStyle'
import Video from 'react-native-video';
const defaultNavigationHeight = 50;
const defaultButtonHeight = defaultNavigationHeight - 25;//
export default class MovieDetailPage extends Component {

  constructor(props) {
    super(props);
    this.fetchData = this.fetchData.bind(this);
    this.onSharePressed = this.onSharePressed.bind(this);
    this.state = {
      detailMovieData: null,
      isPlay: false,
      isFullScreen: true,//是否全屏
      loadingStatus: LoadingManagerView.Loading,
      isLoading: true,//是否正在加载
      rate: 1,//播放速率
      muted: false,//是否静音
      paused: false,
      resizeMode: 'contain',
      duration: 0.0,//总时长 单位秒
      currentTime: 0.0,//当前播放位置 单位秒
    };
    this.onLoad = this.onLoad.bind(this);
    this.onProgress = this.onProgress.bind(this);
    this.onLoadStart = this.onLoadStart.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.renderActivityIndicator = this.renderActivityIndicator.bind(this);
    this.renderNavigationBar = this.renderNavigationBar.bind(this);
    this.renderBottomControlView = this.renderBottomControlView.bind(this);
    this.changeVideoFullScreen = this.changeVideoFullScreen.bind(this);
    props.isPlayingMedia && props.stopPlayMedia();//暂停播放音乐
  }


  static navigationOptions = ({ navigation, screenProps
}) => ({
      headerTitle: '课程详情',
      headerTitleStyle: headerTitleStyle,
      headerStyle: headerStyle,
      headerTintColor: '#ffffff',
      headerRight: <TouchableOpacity
        onPress={() => {
          navigation.state.params.navigatePress()
        }}>
        <Image style={{ marginRight: 20, tintColor: '#FFFFFF', width: 30, height: 30 }} source={require('../../res/images/share.png')} />
      </TouchableOpacity>
    });

  componentWillMount() {
    this.props.navigation.setParams({ navigatePress: this.shareButtom })
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(this.fetchData);
  }

  renderActivityIndicator() {
    if (this.state.isLoading) {
      return (
        <ActivityIndicator color='white'
          style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }} />
      );
    }
    return null;
  }
  renderNavigationBar() {
    if (this.state.isFullScreen) {
      return null;
    }
    const movieName = this.props.navigation.state.params.movieName;
    return (
      <View style={stylesVedio.navigationBarContainer}>
        {this.renderBackTouchableOpacityImage(() => this.props.navigation.goBack())}
        <Text style={stylesVedio.navigationBarText}>{movieName}</Text>
      </View>
    );
  }

  renderBackTouchableOpacityImage(onPress) {
    return (
      <TouchableOpacity style={styles.leftButton} onPress={onPress}>
        <Image style={{ height: defaultButtonHeight }} source={require('../../res/vedio/return.png')} resizeMode="contain" />
      </TouchableOpacity>
    );
  }

  renderBottomControlView() {
    const { detailMovieData } = this.state;
    if (this.state.isFullScreen) {
      return null;
    }
    const { duration, currentTime, paused } = this.state;
    return (
      <View style={{ backgroundColor: '#00000088', position: 'absolute', bottom: 0, right: 0, left: 0 }}>
        <View style={stylesVedio.bottomProgressContainer}>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            {
              paused ?
                this.renderTouchableOpacityImage(require('../../res/vedio/movie_review_play.png'), () => this.setState({
                  paused: false
                })) :
                this.renderTouchableOpacityImage(require('../../res/vedio/movie_review_pause.png'), () => this.setState({
                  paused: true
                }))
            }
          </View>
          <View style={{ flex: 5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={stylesVedio.bottomText}>{this.getTimeStr(currentTime)}</Text>
            {/*如何改变进度条颜色*/}
            <Slider
              value={currentTime}
              step={1}
              minimumValue={0}
              maximumValue={duration}
              onSlidingComplete={currentTime => this.seekTo(currentTime)}
              style={{ flex: 3 }} />
            <Text style={stylesVedio.bottomText}>{this.getTimeStr(duration)}</Text>
          </View>
          <View style={{ flex: 1 }}>
            {
              this.renderTouchableOpacityImage(require('../../res/vedio/fullP.png'), () => {
                this.setState({
                  paused: true
                }, () => {
                  this.props.navigation.navigate('ClassDetailPage', {
                    uri: detailMovieData.video,
                    movieName: detailMovieData.title
                  })
                })
              }, 40)
            }
          </View>
        </View>
      </View>
    );
  }

  renderTouchableOpacityImage(imageSource, onPress, size = 25) {
    return (
      <TouchableOpacity onPress={onPress}>
        <Image style={{ height: size, alignSelf: 'center' }} source={imageSource} resizeMode="contain" />
      </TouchableOpacity>
    );
  }
  onProgress(data) {
    this.setState({
      currentTime: data.currentTime
    });
  }
  onEnd() {
    this.setState({
      paused: true
    });
  }
  onLoadStart() {
    this.setState({ isLoading: true });
  }
  onLoad(data) {
    this.setState({
      isLoading: false,
      duration: data.duration
    });
  }

  changeVideoFullScreen(isFullScreen) {
    this.setState({
      isFullScreen
    });
  }

  shareButtom() {
    alert('分享正在路上')
  }

  getTimeStr(timeInSecond) {
    let minute = Math.round(timeInSecond / 60) + '';
    let second = Math.round(timeInSecond % 60) + '';
    //补全两位
    let complete = str => str.length >= 2 ? str : str.length >= 1 ? `0${str}` : '00';
    return `${complete(minute)}:${complete(second)}`
  }

  seekTo(currentTime) {
    this.videoRef.seek(currentTime);
    this.setState({
      currentTime: currentTime,
      paused: false
    });
  }
  fetchData() {
    this.setState({
      loadingStatus: LoadingManagerView.Loading
    });

    // Promise.all([movieDetailPromise, detailMovieDataPromise]).then(response => {
    //   var detailMovieData = response[0];
    //   var detailMovieData = response[1].data[0];
    //   this.setState({
    //     detailMovieData,
    //     detailMovieData,
    //     loadingStatus: LoadingManagerView.LoadingSuccess//加载成功
    //   });
    // }).catch(error => {
    //   //失败处理
    //   this.setState({
    //     loadingStatus: LoadingManagerView.LoadingError//加载失败
    //   });
    // });
    this.setState({
      detailMovieData: {
        id: 1,
        title: '测试视频',
        info: 'ceshi 测试是恶吃额',
        keywords: 'js,dd,fff',
        detailcover: 'https:////img.mukewang.com/szimg/5a405cbc000124ca05400300.jpg',
        score: 90,
        photo: ['https://img.mukewang.com/user/58d5ee580001432401000100-100-100.jpg'],
        video: 'https://v3.mukewang.com/shizhan/5a39002ae520e5b11c8b456b/H.mp4',
        user: { user_name: 'dsx', web_url: 'https://img.mukewang.com/user/58d5ee580001432401000100-100-100.jpg' },
        creat_date: '',
        content: 'Java秒杀系统方案优化 高性能高并发实战',
        type: 1
      },
      loadingStatus: LoadingManagerView.LoadingSuccess//加载成功
    });
  }



  render() {
    const { loadingStatus, detailMovieData, isPlay } = this.state;

    if (loadingStatus === LoadingManagerView.LoadingSuccess) {
      if (isPlay) {
        return (
          <ScrollView contentContainerStyle={styles.contentContainer}>
            <View style={{ flex: 3, position: 'relative' }}>
              <TouchableOpacity style={{ flex: 1, backgroundColor: 'black', justifyContent: 'space-between' }} activeOpacity={1} onPress={() => this.changeVideoFullScreen(!this.state.isFullScreen)}>
                <Video
                  ref={component => this.videoRef = component}
                  source={{ uri: detailMovieData.video }}
                  style={stylesVedio.video}
                  rate={this.state.rate}
                  paused={this.state.paused}
                  volume={1}
                  muted={this.state.muted}
                  resizeMode={this.state.resizeMode}
                  onLoadStart={this.onLoadStart}
                  onLoad={this.onLoad}
                  onProgress={this.onProgress}
                  onEnd={this.onEnd}
                  repeat={false} />
              </TouchableOpacity>
              {this.renderBottomControlView()}
              {this.renderActivityIndicator()}
            </View>
            <MovieInfo detailMovieData={detailMovieData} />
          </ScrollView>
        );
      } else {
        return (
          <ScrollView contentContainerStyle={styles.contentContainer}>
            <Image style={[styles.image, { flex: 3, width: windowWidth }]} resizeMode="cover" source={{ uri: detailMovieData.detailcover }} >
              <View style={{ flex: 3, backgroundColor: '#000', opacity: 0.7, justifyContent: 'center', position: 'relative' }}>
                <View style={{ flex: 1, zIndex: 90, justifyContent: 'center', alignItems: 'center', paddingHorizontal: windowWidth / 10 }}><Text style={{ fontSize: 19, color: '#fff', fontWeight: '400' }}>Java秒杀系统方案优化 高性能高并发实战</Text></View>
                <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
                  <TouchableOpacity onPress={() => {
                    this.setState({
                      isPlay: true
                    })
                  }}>
                    <Image style={{ width: 50, height: 50 }} source={require('../../res/images/play.png')} />
                  </TouchableOpacity>
                </View>
              </View>
            </Image>
            <MovieInfo detailMovieData={detailMovieData} navigation={this.props.navigation} />
          </ScrollView>
        );
      }

    }
    return (
      <LoadingManagerView status={loadingStatus} onFetchData={this.fetchData} />
    );
  }

  onAvatarImagePress() {

  }

  onSharePressed() {
    const { detailMovieData } = this.state;
    getNavigator().push({
      name: 'SharePage',
      shareData: {
        type: 'news',
        webpageUrl: detailMovieData.web_url,
        thumbImage: detailMovieData.indexcover,
        title: `《${detailMovieData.title}》`,
        description: `${detailMovieData.officialstory}`
      }
    });
  }

}

const stylesVedio = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'space-between'
  },
  videoContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  video: {
    flex: 1
  },
  navigationBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: defaultNavigationHeight,
    backgroundColor: '#00000088'
  },
  navigationBarText: {
    color: 'white',
    fontSize: 18
  },
  leftButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    height: defaultNavigationHeight
  },
  bottomProgressContainer: {
    flex: 1,
    flexDirection: 'row',
    margin: 10,
  },
  bottomText: {
    color: 'white',
    fontSize: 16,
    flex: 1,

  },
});