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
        const images = [{'img':app.img.home_specops_bg7,height: 848},
                        {'img':app.img.home_specops_bg8,height: 1228},
                        {'img':app.img.home_specops_bg9,height: 784},
                        {'img':app.img.home_specops_bg10,height: 1007},
                        {'img':app.img.home_specops_bg11,height: 653},
                        {'img':app.img.home_specops_bg12,height: 567},
                    ];
        return (
            <View style={styles.container}>
                <Image
                    resizeMode='stretch'
                    source={app.img.home_specops_banner2}
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
