/**
 * Created by lipeiwei on 16/10/18.
 */

import React, { PropTypes } from 'react';
import {
  TouchableOpacity,
  View,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  ListView,
  PixelRatio,
  Platform
} from 'react-native';
import GiftedListView from '../widget/giftedListView';
import CommentType from '../constant/commentType';
import CommentItem from './commentItem';
import commonStyle from '../style/commonStyle';

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  separatorView: {
    height: 1,
    backgroundColor: '#ECECEC',
    width: windowWidth
  },
  grayViewContainer: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  lightGrayText: {
    color: commonStyle.TEXT_GRAY_COLOR,
    fontSize: 14,
    marginVertical: 8
  },
});

class CommentListView extends React.Component {

  constructor(props) {
    super(props);
    this.renderRow = this.renderRow.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.fetchMoreData = this.fetchMoreData.bind(this);
    this.fetchLatestData = this.fetchLatestData.bind(this);
    this.renderSeparator = this.renderSeparator.bind(this);
    this.state = {
      refreshing: false,
      hasMore: true,//是否有更多数据
      commentList: []
    };
    this.lastOneId = 0;
    this.hotCommentIndex = -1;
  }

  //该接口传0代表加载最新的
  fetchLatestData() {
    this.setState({
      refreshing: true
    });
    // this.fetchData(0).then(commentList => {
    //   this.setState({
    //     refreshing: false,
    //     hasMore: commentList.length != 0,
    //     commentList,
    //   });
    // });
    const commentList = [{
      content: 'eee',
      praisenum: 444,
      created_at: '',
      user: { user_name: 'dsx', web_url: 'https://img.mukewang.com/user/58d5ee580001432401000100-100-100.jpg' },
      type: 1,
      score: 90
    }, {
      content: 'aaa',
      praisenum: 444,
      created_at: '',
      user: { user_name: 'dsx', web_url: 'https://img.mukewang.com/user/58d5ee580001432401000100-100-100.jpg' },
      type: 1,
      score: 100
    }, {
      content: 'aaa',
      praisenum: 444,
      created_at: '',
      user: { user_name: 'dsx', web_url: 'https://img.mukewang.com/user/58d5ee580001432401000100-100-100.jpg' },
      type: 1,
      score: 100
    }, {
      content: 'aaa',
      praisenum: 444,
      created_at: '',
      user: { user_name: 'dsx', web_url: 'https://img.mukewang.com/user/58d5ee580001432401000100-100-100.jpg' },
      type: 1,
      score: 100
    }, {
      content: 'aaa',
      praisenum: 444,
      created_at: '',
      user: { user_name: 'dsx', web_url: 'https://img.mukewang.com/user/58d5ee580001432401000100-100-100.jpg' },
      type: 1,
      score: 100
    }, {
      content: 'aaa',
      praisenum: 444,
      created_at: '',
      user: { user_name: 'dsx', web_url: 'https://img.mukewang.com/user/58d5ee580001432401000100-100-100.jpg' },
      type: 1,
      score: 100
    }, {
      content: 'aaa',
      praisenum: 444,
      created_at: '',
      user: { user_name: 'dsx', web_url: 'https://img.mukewang.com/user/58d5ee580001432401000100-100-100.jpg' },
      type: 1,
      score: 100
    }, {
      content: 'aaa',
      praisenum: 444,
      created_at: '',
      user: { user_name: 'dsx', web_url: 'https://img.mukewang.com/user/58d5ee580001432401000100-100-100.jpg' },
      type: 1,
      score: 100
    }]
    this.setState({
      refreshing: false,
      hasMore: commentList.length != 0,
      commentList: commentList,
    });
  }

  //加载更多
  fetchMoreData() {
    // this.fetchData(this.lastOneId).then(newCommentList => {
    //   let commentList = this.state.commentList.concat(newCommentList);//push只能传元素.concat才能传数组
    //   this.setState({
    //     commentList,
    //     hasMore: newCommentList.length != 0
    //   });
    // });
    const newCommentList = []
    let commentList = this.state.commentList.concat(newCommentList);//push只能传元素.concat才能传数组
    this.setState({
      commentList,
      hasMore: newCommentList.length != 0
    });
  }

  fetchData(index) {
    const { type, id } = this.props;
    return [];
    // return getCommentList(type, id, index).then(response => response.data).then(commentList => {
    //   if (commentList && commentList.length > 0) {
    //     this.lastOneId = commentList[commentList.length - 1].id;//记录下来
    //   } else {
    //     this.lastOneId = -1;
    //   }
    //   if (this.hotCommentIndex === -1) {
    //     this.hotCommentIndex = this.getHotCommentIndex(commentList);
    //   }
    //   return commentList;
    // });
  }

  //TODO removeClippedSubviews
  render() {
    //pageSize代表一个event loop绘制多少个row
    let dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }).cloneWithRows(this.state.commentList);
    let removeClippedSubviews = true;
    if (Platform.OS === 'ios' && 'removeClippedSubviews' in this.props
      && typeof this.props.removeClippedSubviews === 'boolean') {
      removeClippedSubviews = this.props.removeClippedSubviews;//该bug只在iOS下出现
    }
    return (
      <GiftedListView
        removeClippedSubviews={removeClippedSubviews}
        initialListSize={20}
        pageSize={20}
        refreshing={this.state.refreshing}
        hasMore={this.state.hasMore}
        fetchLatestData={this.fetchLatestData}
        fetchMoreData={this.fetchMoreData}
        dataSource={dataSource}
        renderRow={this.renderRow}
        renderSeparator={this.renderSeparator}
        renderHeader={this.props.renderHeader}
      />
    );
  }

  renderRow(commentData, sectionID, rowID) {
    return (
      <CommentItem key={rowID} commentData={commentData} />
    );
  }

  renderSeparator(sectionID, rowID) {
    return (
      <View key={rowID} style={styles.separatorView} />
    );
  }



}

CommentListView.propTypes = {
  renderHeader: PropTypes.func.isRequired,
  type: PropTypes.oneOf([CommentType.ESSAY, CommentType.SERIAL, CommentType.QUESTION, CommentType.MUSIC, CommentType.MOVIE]),
  id: PropTypes.number.isRequired,
};

export default CommentListView;

















