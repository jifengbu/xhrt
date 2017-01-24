'use strict';

var React = require('react');var ReactNative = require('react-native');

var {
    Image,
    StyleSheet,
    Text,
    View,
} = ReactNative;


module.exports = React.createClass({
    getDefaultProps() {
        return {
            title: '温馨提示',
            content: '暂未开放，敬情期待...',
        };
    },
    render() {
        const {title, content} = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.boxContainer}>
                    {!!title && <Text style={styles.title}>{title}</Text>}
                    <Text style={styles.actualContent}>{content}</Text>
                </View>
            </View>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    boxContainer: {
        width:sr.w*5/6,
        height:120,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#A62045',
        borderRadius:10,
    },
    title: {
        color: '#BDA066',
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 10,
        textAlign: 'center',
        overflow: 'hidden',
    },
    actualContent: {
        marginVertical:10,
        color: 'white',
        fontSize: 18,
        fontWeight: '400',
        overflow: 'hidden',
        textAlign:'center',
    },
});
