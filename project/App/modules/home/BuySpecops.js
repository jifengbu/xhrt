'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    Image,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
} = ReactNative;

module.exports = React.createClass({
    toBuySpecops() {

    },
    render () {
        const images = [{'img':app.img.home_specops_bg,height: 770},
                        {'img':app.img.home_specops_bg2,height: 557},
                        {'img':app.img.home_specops_bg3,height: 774},
                        {'img':app.img.home_specops_bg4,height: 1085},
                        {'img':app.img.home_specops_bg5,height: 1004},
                        {'img':app.img.home_specops_bg6,height: 1223},
                    ];
        return (
            <View style={styles.container}>
                <Image
                    resizeMode='stretch'
                    source={app.img.home_specops_banner}
                    style={styles.bannerStyle}>
                </Image>
                <ScrollView style={styles.panleMenuContainer}>
                    {
                        images.map((item,i) => {
                            return(
                                <Image
                                    key={i}
                                    resizeMode='stretch'
                                    source={item.img}
                                    style={[styles.detailStyle,{height: item.height}]}>
                                </Image>
                            );
                        })
                    }
                </ScrollView>
                <View style={styles.bottomContainer}>
                    <TouchableOpacity onPress={this.toBuySpecops}>
                        <Image
                            resizeMode='stretch'
                            source={app.img.home_btn_buyspecops}
                            style={styles.btnStyle}>
                        </Image>
                    </TouchableOpacity>
                </View>
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        width:sr.w,
        height: sr.ch,
        backgroundColor: '#EEEEEE'
    },
    panleMenuContainer: {
        width:sr.w,
        marginBottom: 49,
        backgroundColor: '#EEEEEE'
    },
    bannerStyle: {
        width:sr.w,
        height: 85,
    },
    btnStyle: {
        width:325,
        height: 38,
    },
    detailStyle: {
        width:sr.w,
        height: 770,
    },
    bottomContainer: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        width:sr.w,
        height: 49,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF'
    },
});
