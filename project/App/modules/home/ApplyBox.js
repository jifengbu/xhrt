'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    StyleSheet,
    Text,
    Animated,
    View,
    TouchableOpacity,
} = ReactNative;

module.exports = React.createClass({
    render() {
        return (
              <View style={styles.overlayContainer}>
                  <View style={styles.container}>
                      <Text style={styles.content}>
                          {'报名成功，我们会尽快联系你'}
                      </Text>
                      <View style={styles.lineStyleTop}/>
                      <View style={styles.buttonViewStyle}>
                          <TouchableOpacity
                              onPress={app.closeModal}
                              style={styles.buttonStyleContain}>
                              <Text style={styles.buttonStyle}>确定</Text>
                          </TouchableOpacity>
                      </View>
                    </View>
              </View>
        );
    }
});

var styles = StyleSheet.create({
    buttonViewStyle: {
        position:'absolute',
        bottom: 0,
        flexDirection: 'row',
        width: 270,
        height: 44,
        justifyContent:'space-between',
    },
    buttonStyleContain: {
        flex: 1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: 'white',
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
    },
    buttonStyle: {
        fontSize: 17,
        color: '#0076FF'
    },
    lineStyleTop: {
        position: 'absolute',
        bottom: 44,
        left: 0,
        width: 270,
        height: 1,
        backgroundColor: '#D6D6D6'
    },
    container: {
        width: 270,
        height:129,
        borderRadius: 12,
        alignItems:'center',
        backgroundColor:'#FFFFFF',
    },
    content: {
        color:'#030303',
        marginTop: 35,
        fontSize:17,
        fontFamily: 'STHeitiSC-Medium',
    },
    overlayContainer: {
        position: 'absolute',
        width: sr.w,
        height: sr.h,
        left: 0,
        bottom: 0,
        alignItems:'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
      },
});
