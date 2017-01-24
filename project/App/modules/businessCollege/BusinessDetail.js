'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    StyleSheet,
    View,
    WebView,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
} = ReactNative;

var PixelRatio = require('PixelRatio');
var {DImage, Button, PageList} = COMPONENTS;
var Player = require('../shoppingMarkert/commodityDetail/Player.js');

var PlayerItem = React.createClass({
    render() {
        var {videoAddr, videoImg,videoName} = this.props.data;
        return (
            this.props.playing ?
            <View style={styles.playerView}>
                <View style={styles.playerTextView}>
                    <Text style={styles.playerText}>{videoName}
                    </Text>
                </View>
                <Player uri={videoAddr} />
            </View>
            :
            <View style={styles.playerView}>
                <View style={styles.playerTextView}>
                    <Text style={styles.playerText}>{videoName}
                    </Text>
                </View>
                <DImage
                    resizeMode='stretch'
                    defaultSource={app.img.common_default}
                    source={{uri: videoImg}}
                    style={styles.playerContainer}>
                    <TouchableOpacity
                        style={styles.video_icon_container}
                        onPress={this.props.onPress}>
                        <Image
                            resizeMode='stretch'
                            source={app.img.live_play}
                            style={styles.video_icon}>
                        </Image>
                    </TouchableOpacity>
                </DImage>
            </View>
        )
    }
});

module.exports = React.createClass({
    getInitialState() {
        return {
            detaiContext: null,
            itemDetail:null,
            height: 0,
        };
    },
    onNavigationStateChange(navState) {
        this.setState({
            height: navState.title*1,
        });
    },
    getItemDetail() {
          var param = {
              schoolID: this.props.schoolID,
          };
          POST(app.route.ROUTE_BUSINESS_SCHOOL_ITEM, param, this.getItemDetailSuccess, true);
      },
      getItemDetailSuccess(data) {
          if (data.success) {
              this.setState({itemDetail: data.context});
          } else {
              Toast(data.msg);
          }
      },
    componentDidMount() {
      this.getItemDetail();
    },
    // 两个视频
    ItemIntroduce() {
          var {schoolVideoList} = this.state.itemDetail;
          return (
              <View style={styles.videoContainer}>
                  {
                      !!schoolVideoList[0].videoAddr && [
                          <PlayerItem
                              key={1}
                              playing={this.state.playingIndex===0}
                              onPress={()=>{this.setState({playingIndex: 0})}}
                              data={schoolVideoList[0]}/>
                          ,
                          <View key={2} style={styles.separator}/>
                      ]
                  }
                  {
                      !!schoolVideoList[1].videoAddr && [
                          <PlayerItem
                              key={1}
                              playing={this.state.playingIndex===1}
                              onPress={()=>{this.setState({playingIndex: 1})}}
                              data={schoolVideoList[1]}/>
                          ,
                          <View key={2} style={styles.separator}/>
                      ]
                  }
              </View>
          )
      },
    render() {
        var index = 1;
        var str = '<body><style>div{font-size: '+(18*PixelRatio.get()/PixelRatio.getFontScale())+'px}</style><div id="view">';
        if (this.state.itemDetail != null) {
            for (var item in this.state.itemDetail.schoolDetailList) {
                str += "<div style='background: -webkit-linear-gradient(left, #A60245 , white);margin-Top:23px;margin-Bottom:-20px; width: 45%;padding-left:20px ;font-weight: bold;color:white;font-size:20px;font-family:SimHei;font-weight:normal;'>"+this.state.itemDetail.schoolDetailList[item].title+"</div></br>";
                str += this.state.itemDetail.schoolDetailList[item].content;
                index++;
            }
        }
        var tempStr = str.replace(/\<img/g,'<img width="100%" onload=imageLoad() onerror=imageLoad()');
        tempStr += '</div><script>function imageLoad(){document.title = document.getElementById("view").offsetHeight;}imageLoad();</script></body>'
        return (
              <ScrollView style={styles.container}>
                  {
                      this.state.itemDetail == null?null
                      :
                      <View style={styles.container}>
                          <View style={styles.headView}>
                              <Image
                                  resizeMode='contain'
                                  source={{uri:this.state.itemDetail.schoolImg}}
                                  style={styles.videohead}>
                              </Image>
                          </View>
                          <View style={styles.playerTextView2}>
                              <View style={styles.lineTextView}>
                              </View>
                              <View style={{flex: 1}}>
                                  <Text style={styles.playerText1}>
                                      {this.state.itemDetail.schoolName}
                                  </Text>
                              </View>
                          </View>
                          <View style={styles.lineView}>
                          </View>
                          <this.ItemIntroduce />
                          <View style={styles.webContainer}>
                              {
                                  app.isandroid?
                                  <WebView style={{height: this.state.height+30}}
                                      injectedJavaScript='document.title = document.getElementById("view").offsetHeight;'
                                      javaScriptEnabled={true}
                                      automaticallyAdjustContentInsets={false}
                                      scrollEnabled={false}
                                      onNavigationStateChange={this.onNavigationStateChange}
                                      source={{html:tempStr}} />
                                  :
                                  <WebView style={{height: this.state.height+30}}
                                      injectedJavaScript='document.title = document.getElementById("view").offsetHeight;'
                                      javaScriptEnabled={true}
                                      automaticallyAdjustContentInsets={false}
                                      scrollEnabled={false}
                                      onNavigationStateChange={this.onNavigationStateChange}
                                      source={{html:tempStr}} />
                              }
                          </View>
                      </View>
                  }
              </ScrollView>
        );
    },
});

var NORMAL_WIDTH = sr.w;
var NORMAL_HEIGHT = NORMAL_WIDTH*2/3;
var styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: '#E1E4E9',
    },
    videoContainer: {
        flex:1,
        alignSelf:'center',
        marginHorizontal:16,
    },
    webContainer: {
        width:sr.w-16,
        marginBottom:10,
        alignSelf:'center',
        backgroundColor:'#FFFFFF',
    },
    lineView: {
        alignSelf:'center',
        width: sr.w-20,
        height: 1.5,
        backgroundColor: CONSTANTS.THEME_COLOR,
    },
    playerContainer: {
        width: sr.w-40,
        height: 193/330*(NORMAL_WIDTH-75),
        justifyContent: 'center',
        alignItems:'center',
        backgroundColor: 'white',
    },
    playerView: {
        width: sr.w-16,
        height: NORMAL_HEIGHT-20,
        justifyContent: 'space-around',
        alignItems:'center',
        alignSelf:'center',
        backgroundColor: 'white',
        overflow:"hidden",
    },
    playerTextView: {
        width: sr.w-16,
        height: 37,
        alignSelf:'center',
        flexDirection: 'row',
    },
    playerTextView2: {
        width: sr.w-16,
        height:38,
        alignSelf:'center',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
    },
    headView: {
        width: sr.w-16,
        height: 160,
        marginTop:8,
        justifyContent: 'center',
        alignItems:'center',
        alignSelf:'center',
        backgroundColor: 'white',
    },
    playerText: {
        marginLeft:16,
        fontSize:18,
        alignSelf:'flex-end',
        fontWeight: '700',
        color: '#333333'
    },
    playerText1: {
        marginLeft:10,
        fontWeight: '700',
        fontSize:20,
        color: CONSTANTS.THEME_COLOR,
    },
    video_icon_container: {
        height: 40,
        width: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems:'center',
    },
    video_icon: {
        height: 40,
        width: 40,
    },
    videohead: {
        height: 400,
        width: sr.w-16,
    },
    lineTextView: {
        height: 20,
        marginLeft: 16,
        width: 1.5,
        backgroundColor: CONSTANTS.THEME_COLOR,
    },
});
