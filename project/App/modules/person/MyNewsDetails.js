'use strict';

var React = require('react');var ReactNative = require('react-native');
var {
    View,
    Text,
    Image,
    ScrollView,
    StyleSheet,
} = ReactNative;

var {Button,RText} = COMPONENTS;

module.exports = React.createClass({
    statics: {
        title: '详细信息',
    },
    getInitialState() {
        return {
            contentText: this.props.contentText,
            time: this.props.time,
        };
    },
    render() {
        return (
          <View style={styles.container}>
              <View style={styles.newsTitle}>
                  <View style={styles.imageName}>
                      <Image
                        resizeMode='contain'
                        source={app.img.personal_letter1}
                        style={styles.icon}  />
                      <Text style={styles.titleNameText}>系统消息</Text>
                  </View>
                  <Text style={styles.titleTimeText}>{this.state.time}</Text>
              </View>
              <ScrollView style={styles.newsContent}>
                  <RText style={styles.contentStyle}>{this.state.contentText}</RText>
              </ScrollView>
          </View>
        )
    }
});

var styles = StyleSheet.create({
  container: {
      marginTop: 10,
      height: sr.ch,
      flexDirection: 'column',
      backgroundColor: '#FFFFFF',
  },
  newsTitle: {
      height: 30,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
  },
  imageName: {
      height: 30,
      marginLeft: 20,
      flexDirection: 'row',
      alignItems: 'center',
  },
  icon: {
      width: 22,
      height: 22,
      margin: 3,
  },
  titleNameText: {
    fontSize: 15,
    marginLeft: 10,
    color: 'gray',
  },
  titleTimeText: {
    marginRight: 10,
    fontSize: 15,
    color: 'gray',
  },
  contentStyle: {
    marginBottom: 20,
    width: sr.w-35,
    lineHeight: 20,
    fontSize: 14,
    alignSelf: 'center',
    color: 'gray',
  },
  newsContent: {
    marginVertical: 10,
    width: sr.w-30,
    height: sr.h-160,
    marginHorizontal: 15,
  },
});
