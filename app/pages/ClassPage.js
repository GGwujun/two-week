import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ScrollView,
  StatusBar,
  ListView,
  FlatList,
  TouchableHighlight,
  ActivityIndicator
} from 'react-native'

import LinearGradient from 'react-native-linear-gradient';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { sliderWidth, itemWidthTwo, itemWidth } from '../example/styles/SliderEntry.style';
import SliderEntry from '../example/components/SliderEntry';
import { styles, styles1, colors, styles2 } from '../example/styles/index.style';

import { ENTRIES1, ENTRIES2, list } from '../example/static/entries';
import { headerStyle, headerTitleStyle } from '../util/commonStyle'

import Video from 'react-native-video';


import HttpUtils from '../util/HttpUtils'
import ClassCell from '../common/ClassCell'

import { HOST } from '../util/config'

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height
const URL = HOST + 'users/show_notification'

const SLIDER_1_FIRST_ITEM = 1;


export default class ClassPage extends Component {

  constructor(props) {
    super(props)

    this.state = {
      refreshing: false,
      loaded: false,
      loading: false,
      dataSource: [],
      user: this.props.navigation.state.params.user,
      partner: this.props.navigation.state.params.partner,
      slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
      slider1Ref: null
    }

    this.renderNotificationsList = this.renderNotificationsList.bind(this)
  }

  static navigationOptions = {
    headerTitle: '首页',
    headerTitleStyle: headerTitleStyle,
    headerLeft: null,
    headerStyle: headerStyle
  };




  componentDidMount() {
    this.fetchData()
  }

  fetchData() {
    // HttpUtils.post(URL, {
    //   uid: this.state.user.id,
    //   token: this.state.user.token,
    //   timestamp: this.state.user.timestamp
    // }).then((res) => {
    //   if (res.status === 0) {
    //     alert(JSON.stringify(res.data))
    //     this.setState({
    //       dataSource: this.state.dataSource.cloneWithRows(res.data),
    //       loaded: true,
    //     })
    //   }
    // })

    this.setState({
      dataSource: list,
      loaded: true,
    })
  }


  /**
   * 轮播图测试开始
   */

  _renderItem({ item, index }) {
    return (
      <SliderEntry
        data={item}
        even={(index + 1) % 2 === 0}
        itemWith={'slideInnerContainer2'}
      />
    );
  }

  _renderItemWithParallax({ item, index }, parallaxProps) {
    return (
      <SliderEntry
        data={item}
        even={(index + 1) % 2 === 0}
        parallax={true}
        parallaxProps={parallaxProps}
        itemWith={'slideInnerContainer1'}
      />
    );
  }


  _onRefresh = () => {
    //alert(22)
  };

  get example1() {
    const { slider1ActiveSlide, slider1Ref } = this.state;

    return (
      <View style={styles1.exampleContainer}>
        <Carousel
          ref={(c) => { if (!this.state.slider1Ref) { this.setState({ slider1Ref: c }); } }}
          data={ENTRIES1}
          renderItem={this._renderItemWithParallax}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          hasParallaxImages={true}
          firstItem={SLIDER_1_FIRST_ITEM}
          inactiveSlideScale={0.94}
          inactiveSlideOpacity={0.7}
          enableMomentum={false}
          containerCustomStyle={styles1.slider}
          contentContainerCustomStyle={styles1.sliderContentContainer}
          loop={true}
          loopClonesPerSide={2}
          autoplay={true}
          autoplayDelay={500}
          autoplayInterval={3000}
          onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index })}
        />
        <Pagination
          dotsLength={ENTRIES1.length}
          activeDotIndex={slider1ActiveSlide}
          containerStyle={styles1.paginationContainer}
          dotColor={'rgba(255, 255, 255, 0.92)'}
          dotStyle={styles1.paginationDot}
          inactiveDotColor={colors.black}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
          carouselRef={slider1Ref}
          tappableDots={!!slider1Ref}
        />
      </View>
    );
  }

  get example2() {
    return (
      <View style={styles2.exampleContainer}>
        <Carousel
          data={ENTRIES2}
          renderItem={this._renderItem}
          sliderWidth={sliderWidth}
          itemWidth={10}
          inactiveSlideScale={1}
          inactiveSlideOpacity={1}
          enableMomentum={true}
          activeSlideAlignment={'start'}
          containerCustomStyle={styles2.slider}
          contentContainerCustomStyle={styles2.sliderContentContainer}
          removeClippedSubviews={false}
        />
      </View>
    );
  }

  get gradient() {
    return (
      <LinearGradient
        colors={[colors.background1, colors.background2]}
        style={styles.gradient}
      />
    );
  }





  // Header
  renderHeader = () => {
    return <View style={styles.container}>
      {this.gradient}
      {this.example1}
      {this.example2}
    </View>
  };

  // Footer
  renderFooter = () => {
    if (!this.state.loading) {
      return (
        <View
          style={{
            paddingVertical: 20,
            borderTopWidth: 1,
            borderColor: "#CED0CE",
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {<Text>我们是有底线的哦，):</Text>}

        </View>
      )
    }
    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: "#CED0CE"
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };


  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          backgroundColor: "#CED0CE",
          marginHorizontal: '5%'
        }}
      />
    );
  };

  render() {
    return (
      <View>
        {/* <View style={{ height: 45, width: 500 }}>
          <Text>这是吸顶的导航 (一定要固定高度),</Text>
        </View> ListHeaderComponent={this.allww}*/}
        <StatusBar backgroundColor={'#73C0FF'} />
        <FlatList
          ListHeaderComponent={this.renderHeader}
          ListFooterComponent={this.renderFooter}
          data={this.state.dataSource}
          progressViewOffset={10}
          keyExtractor={(item, index) => item.id}
          onRefresh={this._onRefresh}
          refreshing={this.state.refreshing}
          renderItem={({ item }) => (
            <TouchableHighlight
              onPress={() => {
                this.props.navigation.navigate('ClassDetailPage', { url: item.url })
              }}>
              <View style={stylesFLOAT.container}>
                <View style={stylesFLOAT.ImgContainer}>

                  {<Image
                    style={stylesFLOAT.image}
                    source={{ uri: item.image }}
                  />}
                </View>

                <View style={stylesFLOAT.contentContainer}>
                  <Text
                    numberOfLines={2}
                    style={stylesFLOAT.title}>
                    {item.title}
                  </Text>
                  <Text
                    numberOfLines={2}
                    style={stylesFLOAT.content}>
                    {item.content}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={stylesFLOAT.price}>
                    ￥299
                  </Text>
                </View>
              </View>
            </TouchableHighlight>
          )}
        />
      </View>
    );
  }

  renderNotificationsList(notification) {
    return (
      <ClassCell
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

const stylesList = StyleSheet.create({
  container: {
    height: HEIGHT - 50 / 667 * HEIGHT,
    width: WIDTH,
    alignItems: 'center',
    backgroundColor: '#ffffff'
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  listView: {
    flex: 1,
    width: WIDTH,
    backgroundColor: '#ffffff'
  },
  image: {
    width: 20,
    height: 30
  }
})



const stylesFLOAT = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 15
  },
  ImgContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {
    width: (320 / 375 * WIDTH) / 2.5,
    height: (170 / 667 * HEIGHT) / 1.8,
    resizeMode: 'cover',
    borderRadius: 3
  },

  contentContainer: {
    flexDirection: 'column',
    marginLeft: 10,
    borderRadius: 7 / 667 * HEIGHT,
    shadowColor: '#AEAFAC',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 2,
    shadowOpacity: 0.5,
    flex: 3,
  },
  title: {
    fontSize: 16,
    marginVertical: 8,
    color: '#2E363E',
  },

  content: {
    fontSize: 14,
    color: '#9FA0A2',
    textAlignVertical: 'center'
  },

  price: {
    fontSize: 14,
    marginTop: 2,
    color: '#78797D',
  }
})
