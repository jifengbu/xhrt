'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
} = ReactNative;

const CopyBox = require('../home/CopyBox.js');

module.exports = React.createClass({
    componentDidMount () {
    },
    doComplete () {
        this.props.doComplete();
    },
    onLongPress () {
        // 显示复制按钮
        app.showModal(
            <CopyBox copyY={app.touchPosition.y}
                copyX={app.touchPosition.x}
                copyString={this.props.data.content} />,
                    { backgroundColor: 'transparent' }
        );
    },
    render () {
        const { data, onPress, haveSerialNum, haveImage } = this.props;
        let contentSyles = styles.textStyleOther;
        if (haveImage) {
            contentSyles = styles.textStyle;
        } else if (haveSerialNum) {
            contentSyles = styles.textStyleAnother;
        }

        return (
            <TouchableOpacity onPress={onPress} onLongPress={this.onLongPress}>
                <View style={[styles.rowContainer, { marginVertical: sr.ws(this.props.rowHeight) }]}>
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
                            this.props.data.isOver === 0 ?
                                <TouchableOpacity
                                    onPress={this.doComplete}
                                    style={styles.btnStyle}>
                                    <Image
                                        resizeMode='contain'
                                        source={app.img.specops_cicle}
                                        style={styles.iconBtnStyle} />
                                </TouchableOpacity>
                            :
                                <Image
                                    resizeMode='contain'
                                    source={app.img.specops_cicleTick}
                                    style={styles.iconStyle} />
                        )
                    }
                </View>
            </TouchableOpacity>
        );
    },
});

const styles = StyleSheet.create({
    textStyle: {
        fontSize: 14,
        color: '#2A2A2A',
        fontFamily:'STHeitiSC-Medium',
        width: sr.w - 94,
        marginLeft: 23,
    },
    textStyleOther: {
        fontSize: 14,
        color: '#2A2A2A',
        marginLeft: 23,
        fontFamily:'STHeitiSC-Medium',
        width: sr.w - 46,
    },
    textStyleAnother: {
        fontSize: 14,
        color: '#2A2A2A',
        fontFamily:'STHeitiSC-Medium',
        width: sr.w - 80,
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
