'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
} = ReactNative;

var CopyBox = require('../home/CopyBox.js');

module.exports = React.createClass({
    componentDidMount() {
    },
    doComplete(){
        this.props.doComplete();
    },
    onLongPress(){
        // 显示复制按钮
        app.showModal(
            <CopyBox copyY={app.touchPosition.y}
                    copyX={app.touchPosition.x}
                    copyString={this.props.data.content}/>,
                    {backgroundColor: 'transparent'}
        );
    },
    render() {
        const {data, onPress, haveSerialNum, haveImage, isWideStyle} = this.props;
        let contentSyles = styles.textStyleOther;
        if (haveImage) {
            contentSyles = styles.textStyle;
        } else if (haveSerialNum) {
            contentSyles = styles.textStyleAnother;
        } else {
            contentSyles = isWideStyle ? styles.textStyleOther:styles.wideTextStyleOther;
        }

        return (
            <TouchableOpacity onPress={onPress} onLongPress={this.onLongPress}>
                <View style={[styles.rowContainer, {marginVertical: sr.ws(this.props.rowHeight)}]}>
                    {
                        haveSerialNum &&
                        <Text
                            numberOfLines={1}
                            style={styles.numStyle}>
                            {this.props.haveSerialNum}
                        </Text>
                    }
                    <Text
                        style={contentSyles}>
                        {data.content}
                    </Text>
                    {
                        haveImage &&
                        (
                            this.props.data.isOver === 0?
                            <Text style={styles.textCompleteStyle}>
                                完成
                            </Text>
                            :
                            <Text style={styles.textNoCompleteStyle}>
                                未完成
                            </Text>
                        )
                    }
                </View>
            </TouchableOpacity>
        );
    }
});

var styles = StyleSheet.create({
    textCompleteStyle: {
        marginRight: 22,
        fontSize: 14,
        color: '#88CD5C',
        fontFamily:'STHeitiSC-Medium',
    },
    textNoCompleteStyle: {
        marginRight: 22,
        fontSize: 14,
        color: '#FF6A6A',
        fontFamily:'STHeitiSC-Medium',
    },
    textStyle: {
        fontSize: 16,
        color: '#666666',
        fontFamily:'STHeitiSC-Medium',
        width: sr.w-94,
        marginLeft: 32,
    },
    textStyleOther: {
        fontSize: 16,
        color: '#666666',
        marginLeft: 32,
        fontFamily:'STHeitiSC-Medium',
        width: sr.w-60,
    },
    wideTextStyleOther: {
        fontSize: 16,
        color: '#666666',
        marginLeft: 42,
        fontFamily:'STHeitiSC-Medium',
        width: sr.w-46,
    },
    textStyleAnother: {
        fontSize: 16,
        color: '#666666',
        fontFamily:'STHeitiSC-Medium',
        width: sr.w-80,
    },
    rowContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    btnStyle: {
        marginRight: 12,
        width: 40,
        height: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconBtnStyle: {
        marginRight: 4,
        width: 22,
        height: 22,
    },
    iconStyle: {
        marginRight: 23,
        width: 22,
        height: 22,
    },
    numStyle: {
        fontSize:18,
        width: 30,
        marginHorizontal: 3,
        fontFamily:'STHeitiSC-Medium',
        color: '#565656',
    },
});
