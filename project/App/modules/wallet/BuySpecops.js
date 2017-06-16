'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    ScrollView,
} = ReactNative;

const OpenSpecops = require('./OpenSpecops.js');

module.exports = React.createClass({
  statics: {
        title: '推荐大使',
        color: '#FFFFFF',
        leftButton: { image: app.img.common_back, handler: () => { app.navigator.pop(); } },
    },
    componentWillMount () {
        app.updateNavbarColor('#DE3031');
    },
    onWillFocus () {
        app.updateNavbarColor('#DE3031');
    },
    buySpecops () {
        app.updateNavbarColor(CONSTANTS.THEME_COLORS[1]);
        app.navigator.push({
            component: OpenSpecops,
        });
    },
    render () {
        return (
            <ScrollView style={styles.container}>
                <Image
                    resizeMode='stretch'
                    source={app.img.wallet_re_detail}
                    style={styles.img_icon} >
                    <View style={styles.title_style}>
                        <Text numberOfLines={1} style={styles.titleText}>
                            {app.personal.info.name+' ：'}
                        </Text>
                    </View>
                </Image>
                <Text style={styles.title_text}>
                    <Text style={styles.icon_text}>
                        {'*'}
                    </Text>
                    {'成为赢销特种兵后，才能成为推荐大使'}
                </Text>
                <TouchableOpacity
                    style={styles.btn_container}
                    onPress={this.buySpecops}>
                    <Image
                        resizeMode='stretch'
                        source={app.img.wallet_add_btn}
                        style={styles.btn_container} />
                </TouchableOpacity>
                <View style={{height: 10}}/>
            </ScrollView>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        width: sr.w,
    },
    img_icon: {
        alignSelf: 'center',
        width: 355,
        height: 476,
    },
    title_style: {
        width: 200,
        height: 22,
        marginTop: 27,
        marginLeft: 70,
        justifyContent: 'flex-end',
    },
    titleText: {
        fontSize: 14,
        color: '#292929',
    },
    title_text: {
        alignSelf: 'center',
        marginBottom: 15,
        fontSize: 15,
        color: '#888888',
    },
    icon_text: {
        marginBottom: 15,
        fontSize: 16,
        color: 'red',
    },
    btn_container: {
        alignSelf: 'center',
        height: 56,
        width: 352,
    },
    empty: {
        height: 35,
        width: sr.w,
    },
});
