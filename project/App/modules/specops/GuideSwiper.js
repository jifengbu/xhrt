'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
} = ReactNative;

var {Button} = COMPONENTS;
import Swiper from 'react-native-swiper2';

module.exports = React.createClass({
    finishGuide() {
        app.closeModal();
    },
    render() {
        let images = [app.img.specops_guide1,app.img.specops_guide2,app.img.specops_guide3,app.img.specops_guide4];
        return (
            <View style={styles.overlayContainer}>
                <Swiper
                    paginationStyle={styles.overlayBackgroundStyle}
                    dot={<View style={{backgroundColor:'transparent'}} />}
                    activeDot={<View style={{backgroundColor:'transparent'}} />}
                    loop={false}>
                    {
                        images.map((item, i)=>{
                            return (
                                <Image
                                    key={i}
                                    resizeMode='stretch'
                                    source={images[i]}
                                    style={styles.overlayBackgroundStyle}>
                                    <TouchableOpacity
                                        onPress={this.finishGuide}
                                        style={i!==3?styles.bannerTouch:styles.bannerOther}>
                                    </TouchableOpacity>
                                </Image>
                            )
                        })
                    }
                </Swiper>
            </View>
        );
    }
});

var styles = StyleSheet.create({
    overlayContainer: {
        position:'absolute',
        top: 0,
        width:sr.w,
        height:sr.h,
    },
    overlayBackgroundStyle: {
        width:sr.w,
        alignItems: 'center',
        height:sr.h,
    },
    btnText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontFamily: 'STHeitiSC-Medium'
    },
    bottomContainer: {
        width: sr.w-60,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bannerTouch: {
        width: 160,
        height: 50,
        marginTop: 550,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
    bannerOther: {
        width: 160,
        height: 50,
        marginTop: 290,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
});
