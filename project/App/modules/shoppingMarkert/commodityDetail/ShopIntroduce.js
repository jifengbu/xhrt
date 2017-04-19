'use strict';

const React = require('react');const ReactNative = require('react-native');
const {
    StyleSheet,
    View,
    WebView,
    Text,
    Image,
} = ReactNative;

const { Button } = COMPONENTS;

module.exports = React.createClass({
    statics: {
        title: '商家介绍',
    },
    getInitialState () {
        return {
            detaiContext: null,
        };
    },
    componentDidMount () {
        this.getShopInfo();
    },
    getShopInfo () {
        const param = {
            shopID: this.props.shopID,
        };
        POST(app.route.ROUTE_GET_SHOP_INFO, param, this.getShopInfoSuccess);
    },
    getShopInfoSuccess (data) {
        if (data.success) {
            if (data.context.detaiList == [] || data.context.detaiList.length <= 0) {
                return;
            }
            this.setState({ detaiContext: data.context });
        } else {
            Toast(data.msg);
        }
    },
    render () {
        let index = 1;
        let str = '';
        if (this.state.detaiContext != null) {
            for (let item in this.state.detaiContext.detaiList) {
                str += "<div style='font-weight: bold;width: auto;'>0" + index + '.' + "<span style='font-size:16px;font-weight: normal'>" + this.state.detaiContext.detaiList[item].title + '<span></div>';
                str += "<div style='background: -webkit-linear-gradient(left, #239fdb , white); height: 1px; width: 95%'> </div></br>";
                str += this.state.detaiContext.detaiList[item].content;
                index++;
            }
        }
        return (
            <View style={styles.container}>
                {
                      (this.state.detaiContext == null) ?
                      null
                      :
                      <View style={styles.container}>
                          <Image
                              resizeMode='stretch'
                              defaultSource={app.img.mall_picture}
                              source={{ uri: this.state.detaiContext.shopImage }}
                              style={styles.pictureStyle} />
                          <WebView
                              style={styles.webview}
                              source={{ html:str }}
                              scalesPageToFit={false}
                              />
                      </View>
                  }
            </View>
        );
    },
});
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E1E4E9',
    },
    pictureStyle: {
        marginTop: 10,
        width: sr.w - 16,
        height: 200,
        alignSelf: 'center',
    },
    titleContainer: {
        marginTop: 20,
        marginLeft: 25,
        alignItems: 'flex-start',
    },
    titleText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    soldText: {
        fontSize: 10,
        color: '#666666',
        marginLeft: 60,
        alignSelf: 'center',
    },
    splitLine: {
        height: 1,
        width: sr.w - 100,
        marginBottom: 20,
    },
    detailText: {
        marginTop: 10,
        width: sr.w - 50,
        fontSize: 12,
        color: '#666666',
    },
    list: {
        alignSelf:'stretch',
    },
    titleStyle: {
        backgroundColor: 'white',
        flexDirection: 'row',
    },
    webview: {
        alignSelf: 'center',
        width: sr.w - 16,
        height: sr.h - 200,
    },
});
