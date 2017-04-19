'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    document,
    WebView,
    TouchableOpacity,
} = ReactNative;

const SplashScreen = require('@remobile/react-native-splashscreen');
const { DImage, Button, PageList } = COMPONENTS;
const Player = require('../shoppingMarkert/commodityDetail/Player.js');
const HTMLView = require('react-native-htmlview');

const PlayerItem = React.createClass({
    componentDidMount () {
        SplashScreen.hide();
    },
    render () {
        const { videoAddr, videoImg, videoName } = this.props.data;
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
                        source={{ uri: videoImg }}
                        style={styles.playerContainer}>
                        <TouchableOpacity
                            style={styles.video_icon_container}
                            onPress={this.props.onPress}>
                            <Image
                                resizeMode='stretch'
                                source={app.img.live_play}
                                style={styles.video_icon} />
                        </TouchableOpacity>
                    </DImage>
                </View>
        );
    },
});

module.exports = React.createClass({
    getInitialState () {
        return {
            detaiContext: null,
            itemDetail:null,
            height:0,
        };
    },
    getItemDetail () {
        const param = {
            schoolID: '96D59F4492EF42A69D50A4DF195C380B',
        };
        POST(app.route.ROUTE_BUSINESS_SCHOOL_ITEM, param, this.getItemDetailSuccess, true);
    },
    getItemDetailSuccess (data) {
        if (data.success) {
            this.setState({ itemDetail: data.context });
        } else {
            Toast(data.msg);
        }
    },
    componentDidMount () {
        this.getItemDetail();
        SplashScreen.hide();
    },
    onNavigationStateChange (navState) {
        console.log('=========', navState, navState.title);
        this.setState({
            height: navState.title * 1,
        });
    },
    // 两个视频
    ItemIntroduce () {
        const { schoolVideoList } = this.state.itemDetail;
        return (
            <View style={styles.videoContainer}>
                {
                      !!schoolVideoList[0].videoAddr && [
                          <PlayerItem
                              key={1}
                              playing={this.state.playingIndex === 0}
                              onPress={() => { this.setState({ playingIndex: 0 }); }}
                              data={schoolVideoList[0]} />,
                          <View key={2} style={styles.separator} />,
                      ]
                  }
                {
                      !!schoolVideoList[1].videoAddr && [
                          <PlayerItem
                              key={1}
                              playing={this.state.playingIndex === 1}
                              onPress={() => { this.setState({ playingIndex: 1 }); }}
                              data={schoolVideoList[1]} />,
                          <View key={2} style={styles.separator} />,
                      ]
                  }
            </View>
        );
    },
    render () {
        let index = 1;
        let str = '<body><div id="view">';
        if (this.state.itemDetail != null) {
            for (let item in this.state.itemDetail.schoolDetailList) {
                str += "<div style='background: -webkit-linear-gradient(left, #239fdb , white);margin-Top:23px;margin-Bottom:-20px; width: 45%;padding-left:20px ;font-weight: bold;color:white;font-size:20px;font-family:SimHei;font-weight:normal;'>" + this.state.itemDetail.schoolDetailList[item].title + '</div></br>';
                str += this.state.itemDetail.schoolDetailList[item].content;
                index++;
            }
        }
        str += '</div><script>document.title = document.getElementById("view").offsetHeight;</script></body>';
        return (
            <ScrollView style={styles.container}>
                {
                      this.state.itemDetail == null ? null
                      :
                      <View style={styles.container}>
                          <View style={styles.headView}>
                              <Image
                                  resizeMode='contain'
                                  source={{ uri:this.state.itemDetail.schoolImg }}
                                  style={styles.videohead} />
                          </View>
                          <View style={styles.playerTextView2}>
                              <View style={styles.lineTextView} />
                              <Text style={styles.playerText1}>{this.state.itemDetail.schoolName}
                              </Text>
                          </View>
                          <View style={styles.lineView} />
                          <this.ItemIntroduce />
                          <View style={styles.webContainer}>
                              {
                                  app.isandroid ?
                                      <WebView style={{ height: this.state.height + 30 }}
                                          javaScriptEnabled
                                          automaticallyAdjustContentInsets={false}
                                          scrollEnabled={false}
                                          onNavigationStateChange={this.onNavigationStateChange}
                                          source={{ html:str }} />
                                  :
                                      <WebView style={{ height: this.state.height + 30 }}
                                          injectedJavaScript='document.title = document.getElementById("view").offsetHeight;'
                                          javaScriptEnabled
                                          automaticallyAdjustContentInsets={false}
                                          scrollEnabled={false}
                                          onNavigationStateChange={this.onNavigationStateChange}
                                          source={{ html:str }} />
                              }
                          </View>
                      </View>
                  }
            </ScrollView>
        );
    },
});

const NORMAL_WIDTH = sr.w;
const NORMAL_HEIGHT = NORMAL_WIDTH * 2 / 3;
const styles = StyleSheet.create({
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
        width:sr.w - 16,
        marginBottom:10,
        alignSelf:'center',
        backgroundColor:'#FFFFFF',
    },
    lineView: {
        alignSelf:'center',
        width: sr.w - 26,
        height: 1.5,
        backgroundColor: '#9adeff',
    },
    playerContainer: {
        width: sr.w - 52,
        height: 193 / 330 * (sr.w - 52),
        justifyContent: 'center',
        alignItems:'center',
        backgroundColor: 'white',
    },
    playerView: {
        width: sr.w - 16,
        height: NORMAL_HEIGHT - 20,
        justifyContent: 'space-around',
        alignItems:'center',
        alignSelf:'center',
        backgroundColor: 'white',
        overflow:'hidden',
    },
    playerTextView: {
        width: sr.w - 16,
        height: 37,
        alignSelf:'center',
        flexDirection: 'row',
    },
    playerTextView2: {
        width: sr.w - 16,
        height:38,
        alignSelf:'center',
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
    },
    headView: {
        width: sr.w - 16,
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
        color: '#333333',
    },
    playerText1: {
        alignSelf:'center',
        marginLeft:10,
        fontWeight: '700',
        fontSize:20,
        color: 'rgba(44,160,217,1)',
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
        width: sr.w - 16,
    },
    lineTextView: {
        height: 20,
        marginLeft: 16,
        width: 1.5,
        marginTop:3,
        alignSelf:'center',
        backgroundColor: 'rgba(44,160,217,1)',
    },
});

const styles1 = StyleSheet.create({
    a: {
        fontWeight: '300',
        color: 'red',
    },
});
