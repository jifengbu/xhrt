'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity
} = ReactNative;

var SplashScreen = require('@remobile/react-native-splashscreen');
var ipType = 1;//1：本地，0:阿里服务
module.exports = React.createClass({
    getInitialState() {
        return {
            url: '',
            json: '',
        };
    },
    componentWillMount() {
        SplashScreen.hide();
    },
    sendPost() {
        POST(this.state.url, JSON.parse(this.state.json), this.callBack, true);
    },
    callBack() {

    },
    render() {
        return (
            <View style={styles.container}>
                <TextInput
                    placeholder='URL'
                    onChangeText={(text) => {this.state.url= text}}
                    defaultValue={ipType==0?"http://www.gyyxjqd.com/app/api/trainingConsumptio":"http://localhost:8080/app/api/getPackageItem"}
                    style={styles.TextInput}
                    editable={true}
                    />
                <TextInput
                    placeholder='JSON'
                    onChangeText={(text) => {this.state.json= text}}
                    defaultValue='{"userID":"56cfb282c76ac713cc5f04c7","packageID":"52F68FFD95EC4EF2BB425066E01F1304","typeCode":"10001"}'
                    style={styles.TextInput}
                    editable={true}
                    />
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={this.sendPost}
                  style={styles.button}>
                    <Text style={styles.buttonText}>发送请求</Text>
                </TouchableOpacity>
            </View>

        );
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    TextInput: {
      width: sr.w-20,
      height: 80,
      backgroundColor:'#efefef',
      color:'black',
      marginVertical:10,
      marginHorizontal:10,
    },
    button: {
      flex:1,
      justifyContent: 'center',
      alignItems: 'center',
      height: 50,
    },
    buttonText: {
      color:'black',
      fontSize: 15,
    },
});
