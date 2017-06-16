'use strict';

const React = require('react');
const ReactNative = require('react-native');

const {
    StyleSheet,
    View,
    Text,
    Image,
    Platform,
    TouchableOpacity,
    UIManager,
    CameraRoll,
} = ReactNative;

const { QRCode} = COMPONENTS;
const Umeng = require('../../native/index.js').Umeng;
const fs = require('react-native-fs');
import { takeSnapshot,dirs } from "react-native-view-shot";
// cross platform dirs:
const { CacheDir, DocumentDir, MainBundleDir, MovieDir, MusicDir, PictureDir } = dirs;
// only available Android:
const { DCIMDir, DownloadDir, RingtoneDir, SDCardDir } = dirs;

module.exports = React.createClass({
    getInitialState(){
        return {
            uri: '',
        };
    },
    takeToImage() {
        takeSnapshot(this.refs.location, {format: 'png', quality: 0.8,result:"base64",width:100,height:100})
        .then((uri) => {
            var data = 'data:image/jpeg;base64,'+uri;
            console.log(">>>>data",data);
        })
        .catch(
            (error) => console.log("<<<<<error",error)
        );


        // UIManager.takeSnapshot(this.refs.location, {format: 'png', quality: 0.8})
            // .then((uri) => {
            //     this.setState({uri});
            //     console.log(">>>>",uri);
            //     fs.readFile(uri, 'base64')
            //     .then((content) => {
            //         console.log("content:",content);
            //         this.saveImg('data:image/jpeg;base64,'+content)
            //     }).catch((error) => {
            //       console.log('error>>>' + error);
            //     });
            // })
            // .catch(
            //     (error) => console.log("<<<<<error",error)
            // );
    },
    saveImg(img) {
        console.log('>>>>>>>>>>>',img);
          var promise = CameraRoll.saveToCameraRoll(img);
          promise.then(function(result) {
            console.log('保存成功！地址如下：\n' + result);
          }).catch(function(error) {
            console.log('保存失败！\n' + error);
          });
      },
    render () {
        return (
            <View  style={styles.container}>
                <View ref='location' collapsable={false}  style={styles.itemContainer}>
                    <Image
                        resizeMode='stretch'
                        source={app.img.wallet_QRcode}
                        style={styles.img_icon}>
                        <View style={styles.QRcode}>
                            <QRCode
                                text={"shareUrl"}
                                colorDark='black'
                                width={sr.ws(120)}
                                height={sr.ws(120)}
                                />
                            <Text numberOfLines={1} style={styles.QRcode_text}>
                                {"app.personal.info.name"}
                            </Text>
                        </View>
                    </Image>
                </View>
                <Text onPress={()=>this.takeToImage()}>生成图片</Text>

                <Image source={{uri: this.state.uri}} style={styles.itemContainer}/>
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width:300,
        height:300,
    },
    QRcode_text: {
        marginTop: 10,
        fontSize: 14,
        color: '#222222',
        backgroundColor: 'transparent',
    },
    img_icon: {
        marginTop: 5,
        width: 340,
        height: 452,
        alignItems: 'center',
    },
    QRcode: {
        width: 220,
        height: 140,
        alignItems: 'center',
        marginTop: 210,
    },
    saveImg:{
      height:30,
      padding:6,
      textAlign:'center',
      backgroundColor:'#3BC1FF',
      color:'#FFF',
      marginTop:10,
  },
});
