/**
 * Created by lipeiwei on 16/10/10.
 */

import React, { PropTypes } from 'react';
import {
  ListView,
  Text,
  Image,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { StackNavigator, TabNavigator, NavigationActions } from 'react-navigation';
import ScrollableTabView, { DefaultTabBar, ScrollableTabBar } from 'react-native-scrollable-tab-view';

import commonStyle from '../style/commonStyle';
import MovieKeywordsChart from './movieKeywordsChart';
import CommentListView from './commentListView';

import { list } from '../example/static/entries';
var ScreenWidth = Dimensions.get('window').width;
var ScreenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  grayViewContainer: {
    paddingHorizontal: 10,
    backgroundColor: commonStyle.LIGHT_GRAY_COLOR,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  lightGrayText: {
    color: commonStyle.TEXT_GRAY_COLOR,
    fontSize: 14
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  smallIcon: {
    width: 50,
    height: 50,
  },
  image: {
    width: 150,
    height: 150,
  },
  separatorView: {
    width: 3
  },
  rowContainer: {
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40
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
  avatarImage: {
    height: 50,
    width: 50,
    borderRadius: 25
  },
});





class MovieInfo extends React.Component {

  constructor(props) {
    super(props);
    this.state = { detailMovieData: this.props.detailMovieData };
    this.renderListItem = this.renderListItems.bind(this);
  }

  onAvatarPressed(uri) {
    // getNavigator().push({
    //   name: 'ImageViewer',
    //   source: {uri}
    // });
    alert(222)
  }

  renderListItems(item, sectionID, rowID) {
    return (
      <TouchableOpacity key={rowID} onPress={() => {
        //this.props.navigation.navigate('MovieDetailPage', { url: item.url })
        //this.props.detailMovieData.title = item.title;
        const detailMovieData = this.state.detailMovieData;
        detailMovieData.content = item.content;
        this.setState({
          detailMovieData: detailMovieData
        })
      }
      }>
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
      </TouchableOpacity>
    );
  }



  render() {
    const { detailMovieData } = this.props
    let dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }).cloneWithRows(list);

    return (
      <ScrollableTabView
        initialPage={0}
        style={stylesss.container}
        renderTabBar={() => <DefaultTabBar />}
        tabBarUnderlineStyle={stylesss.lineStyle}
        tabBarInactiveTextColor='#949599'
        tabBarBackgroundColor="#ffffff"
        tabBarTextStyle={{ fontSize: 18, fontWeight: '400' }}
        tabBarActiveTextColor='#DB1F24'>
        <View style={stylesss.tabContent} tabLabel='介绍'>
          <View style={{ padding: 10, borderRadius: 5, backgroundColor: '#ffffff', marginHorizontal: 10 }}>
            <View style={styles.rowContainer}>
              <View style={styles.authorInfoContainer}>
                <TouchableOpacity onPress={this.onAvatarImagePress}>
                  <Image style={styles.avatarImage} source={{ uri: detailMovieData.user.web_url }} />
                </TouchableOpacity>
                <View style={styles.authorInfo}>
                  <Text style={styles.authorName}>{detailMovieData.user.user_name}</Text>
                  <Text style={styles.timeText}>2107</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image style={styles.smallIcon} resizeMode="contain" source={require('../../res/vedio/laud.png')} />
                <Text style={{ color: commonStyle.TEXT_GRAY_COLOR }}>9.9</Text>
              </View>
            </View>
            <Text style={{ marginLeft: 10, marginVertical: 3 }}>{detailMovieData.content}</Text>
          </View>
        </View>
        <View style={stylesss.tabContent} tabLabel='相似课程'>
          <ListView
            dataSource={dataSource}
            renderRow={this.renderListItem}
          />
        </View>
        <View style={stylesss.tabContent} tabLabel='评价'>
          <CommentListView
            type={CommentType.MOVIE}
            id={parseInt(detailMovieData.id)} />
        </View>

      </ScrollableTabView>
    );
  }
}

const stylesss = StyleSheet.create({
  container: {
    borderTopColor: '#E5E6E7',
    borderTopWidth: 1,
    shadowColor: '#E5E6E7',
    flex: 6
  },
  lineStyle: {
    width: ScreenWidth / 15,
    height: 5,
    backgroundColor: '#F11213',
    borderRadius: 100,
    alignItems: 'center',
    marginHorizontal: ScreenWidth * 2 / 15
  },
  tabContent: {
    backgroundColor: '#F4F5F7',
    paddingTop: 10,
    paddingHorizontal: 10
  }
});

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
    width: (320 / 375 * ScreenWidth) / 2.5,
    height: (170 / 667 * ScreenHeight) / 1.8,
    resizeMode: 'cover',
    borderRadius: 3
  },

  contentContainer: {
    flexDirection: 'column',
    marginLeft: 10,
    borderRadius: 7 / 667 * ScreenHeight,
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


export default MovieInfo;
