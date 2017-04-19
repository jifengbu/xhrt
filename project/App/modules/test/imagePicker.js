const React = require('react');const ReactNative = require('react-native');
const {
    StyleSheet,
    View,
} = ReactNative;

const ImagePicker = require('@remobile/react-native-image-picker');
const Button = require('@remobile/react-native-simple-button');
const Dialogs = require('@remobile/react-native-dialogs');

module.exports = React.createClass({
    onOpen () {
        const options = { maximumImagesCount: 10, width: 400 };
        ImagePicker.getPictures(options, function (results) {
            let msg = '';
            for (let i = 0; i < results.length; i++) {
                msg += 'Image URI: ' + results[i] + '\n';
            }
            Dialogs.alert(msg);
        }, function (error) {
            Dialogs.alert('Error: ' + error);
        });
    },
    render () {
        return (
            <View style={styles.container}>
                <Button onPress={this.onOpen}>Photo</Button>
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
});
