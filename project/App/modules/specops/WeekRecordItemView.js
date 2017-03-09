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
    onPressAll(){
        // 显示复制按钮
        app.showModal(
            <CopyBox copyY={app.touchPosition.y}
                    copyX={app.touchPosition.x}
                    copyString={this.props.data.content}/>,
                    {backgroundColor: 'transparent'}
        );
    },
    render() {
        const {data} = this.props;
        return (
            <TouchableOpacity onLongPress={this.onPressAll}>
                <View style={[styles.rowContainer, {marginVertical: sr.ws(this.props.rowHeight)}]}>
                    <Text
                        style={styles.textStyle}>
                        {data.content}
                    </Text>
                    {
                        (data.isOver === 1&&this.props.haveImage)&&
                        <Image
                            resizeMode='contain'
                            source={app.img.specops_green_right_mark}
                            style={styles.iconStyle}>
                        </Image>
                    }
                </View>
            </TouchableOpacity>
        );
    }
});

var styles = StyleSheet.create({
    textStyle: {
        fontSize: 14,
        color: '#3A3A3A',
        fontFamily:'STHeitiSC-Medium',
        width: sr.w-94,
        marginLeft: 12,
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconStyle: {
        width: 16,
        height: 16,
        marginRight: 27,
        marginLeft:16,
    },
    numStyle: {
        fontSize:18,
        width: 30,
        marginHorizontal: 3,
        fontFamily:'STHeitiSC-Medium',
        color: '#565656',
    },
});
