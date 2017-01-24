'use strict';

var React = require('react');var ReactNative = require('react-native');
var ReactBase = require('react');
var {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    Navigator,
} = ReactNative;

import Swiper from 'react-native-swiper2';

module.exports = React.createClass({
    doImageClose() {
        this.props.doImageClose();
    },
    getInitialState() {
        var tempImageArray=[];
        var tempImageArray1=[];
        this.props.defaultImageArray.map((item, i)=>{
            if (i >= this.props.defaultIndex) {
                tempImageArray1.push(item);
            } else {
                tempImageArray.push(item);
            }
        })
        var imageArray = tempImageArray1.concat(tempImageArray);
        return {
            imageArray: imageArray,
        };
    },
    render() {
        return (
            <View style={styles.overlayContainer}>
                  <Swiper
                       paginationStyle={styles.paginationStyle}
                       height={sr.th}>
                       {
                           this.state.imageArray.map((item, i)=>{
                               return (
                                   <TouchableOpacity
                                       key={i}
                                       onPress={this.doImageClose}
                                       style={styles.imageContainer}>
                                       <Image
                                           resizeMode='contain'
                                           defaultSource={app.img.common_default}
                                           source={{uri: item}}
                                           style={styles.bannerImage}
                                           />
                                   </TouchableOpacity>
                               )
                           })
                       }
                   </Swiper>
            </View>
        );
    },
});

var styles = StyleSheet.create({
    overlayContainer: {
        alignItems:'center',
        justifyContent: 'center',
        width:sr.w,
        height:sr.h,
        position:'absolute',
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
    },
    paginationStyle: {
        bottom: 30,
    },
    imageContainer: {
        width:sr.w,
        height:sr.h,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bannerImage: {
        alignSelf: 'center',
        width: sr.w,
        flex: 1,
    },
});
