'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet
} = ReactNative;

var {ClipRect} = COMPONENTS;

module.exports = React.createClass({
  getInitialState() {
        return {
            isImage: false,
        };
    },
  changeImage() {
        this.setState({isImage: true});
    },
  changeTap() {
        app.hideAssistModal();
    },
    render() {
        return (
          !this.state.isImage?
          <TouchableOpacity
              onPress={this.changeImage}
              style={styles.container}>
              <View style={styles.rect2} />
              <View style={styles.container1}>
                  <View style={styles.rect1} />
                  <ClipRect style={styles.cliprect1}/>
              </View>
              <View style={styles.line}>
                  <Image
                      resizeMode='stretch'
                      source={app.img.guide_hand_gif}
                      style={styles.cliprect4}>
                  </Image>
              </View>
              <View style={styles.rect1} />
              <Image
                  resizeMode='stretch'
                  source={app.img.guide_video_task_txt}
                  style={styles.task_image_txt_style}>
              </Image>
          </TouchableOpacity>
          :
          <TouchableOpacity
            onPress={this.changeTap}
            style={styles.container2}>
            <View style={styles.rect3} />
            <View style={styles.container} >
                <Image
                    resizeMode='stretch'
                    source={app.img.guide_hand_gif}
                    style={styles.cliprect6}>
                </Image>
                <Image
                    resizeMode='stretch'
                    source={app.img.guide_arrow_image}
                    style={styles.cliprect7}>
                </Image>
            </View>
            <Image
                resizeMode='stretch'
                source={app.img.guide_video_slide_txt}
                style={styles.slide_image_txt_style}>
            </Image>
          </TouchableOpacity>
        );
    }
});

var BACK_COLOR = 'rgba(0, 0, 0, 0.4)';
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    task_image_txt_style: {
        top: 130,
        right: 20,
        position: 'absolute',
        alignSelf: 'center',
        width: 200,
        height:108,
    },
    slide_image_txt_style: {
        top: 150,
        left: (sr.w-266)/2,
        position: 'absolute',
        alignSelf: 'center',
        width: 266,
        height:109,
    },
    container2: {
        flex: 0.5,
    },
    cliprect1: {
        width: 60,
        height: 60,
        borderRadius: 30,
        color: BACK_COLOR,
    },
    cliprect2: {
        width: 180,
        height: 90,
        letterSpacing:5,
        borderRadius: 6,
        color: BACK_COLOR,
    },
    cliprect: {
        marginLeft:98,
        marginTop:0,
        width: 178,
        height: 90,
    },
    cliprect5: {
        marginLeft:98,
        marginTop:-90,
        width: 180,
        height: 90,
    },
    cliprect4: {
        transform:[{rotate:'225deg'}],
        marginLeft:280,
        marginTop:-10,
        width: 50,
        height: 80,
    },
    cliprect6: {
        transform:[{rotate:'135deg'}],
        marginLeft:280,
        marginTop:80,
        width: 50,
        height: 80,
    },
    cliprect7: {
        marginLeft:258,
        marginTop:-100,
        width: 15,
        height: 140,
    },
    line: {
        height: 70,
        backgroundColor: BACK_COLOR,
    },
    rect2: {
        height: 5,
        backgroundColor: BACK_COLOR,
    },
    container1: {
        flexDirection: 'row',
    },
    rect1: {
        flex: 1,
        backgroundColor: BACK_COLOR,
    },
    rect3: {
        width: sr.w,
        height:sr.w*3/4+130,
        backgroundColor: BACK_COLOR,
    },
    rect4: {
        backgroundColor: BACK_COLOR,
    },
});
