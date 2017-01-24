'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    StyleSheet,
    Text,
    Animated,
    View,
    Image,
    TouchableOpacity,
} = ReactNative;

var Button = require('../../components/Button.js');
import Swiper from 'react-native-swiper2';

module.exports = React.createClass({
    getInitialState() {
        return {
            opacity: new Animated.Value(0)
        };
    },
    componentWillMount(){
        app.toggleNavigationBar(false);
    },
    onWillHide() {
        app.toggleNavigationBar(true);
    },
    componentDidMount() {
        Animated.timing(this.state.opacity, {
            toValue: 1,
            duration: 500,
        }).start();
    },
    enterNextPage() {
       app.navigator.pop();
    },
    render() {
        return (
            <Animated.View style={[styles.overlayContainer, {opacity: this.state.opacity}]}>
              <Swiper
                  paginationStyle={styles.paginationStyle}
                  dot={<View style={{backgroundColor:'#FFFFFF', width: 8, height: 8,borderRadius: 4, marginLeft: 8, marginRight: 8,}} />}
                  height={sr.th}
                  loop={false}>
                  {
                      [1,2,3,4].map((i)=>{
                          return (
                              <Image
                                  key={i}
                                  resizeMode='stretch'
                                  source={app.img["splash_splash"+i]}
                                  style={styles.bannerImage}>
                                  {
                                      i===4 &&
                                      <TouchableOpacity
                                          style={styles.enterButtonContainer}
                                          onPress={this.enterNextPage}>
                                          <Image resizeMode='stretch' style={styles.enterButton} source={app.img.splash_known} />
                                     </TouchableOpacity>
                                  }
                              </Image>
                          )
                      })
                  }
              </Swiper>
            </Animated.View>
        );
    }
});

var styles = StyleSheet.create({
    overlayContainer: {
        position:'absolute',
        bottom: 0,
        alignItems:'center',
        justifyContent: 'center',
        width:sr.w,
        height:sr.h,
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
    },
    paginationStyle: {
        bottom: 30,
    },
    bannerImage: {
        width: sr.w,
        height: sr.h,
    },
    enterButtonContainer: {
        position: 'absolute',
        width: 165,
        height: 40,
        left: (sr.w-165)/2,
        bottom: 110,
        alignItems:'center',
        justifyContent: 'center',
    },
    enterButton: {
        width: 140,
        height: 36,
    },
});
