'use strict';

const React = require('react');const ReactNative = require('react-native');
const {
    View,
    Text,
    Image,
    ListView,
    StyleSheet,
} = ReactNative;

const { PageList } = COMPONENTS;
const SplashScreen = require('@remobile/react-native-splashscreen');

module.exports = React.createClass({
    componentDidMount () {
        SplashScreen.hide();
        setInterval(() => {
            const len = this.list.length;
            this.list.push(len);
            this.setState({ dataSource: this.ds.cloneWithRows(this.list) });
        }, 1000);
    },
    getInitialState () {
        this.listViewHeight = 0;
        this.autoScrollEnable = true;
        this.rowHeight = 50;
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.list = [];
        return {
            dataSource: this.ds.cloneWithRows(this.list),
        };
    },
    renderRow (obj) {
        return (
            <View style={styles.icon_item}>
                <Text>图{obj}</Text>
            </View>
        );
    },
    renderSeparator (sectionID, rowID) {
        return (
            <View style={styles.separator} key={rowID} />
        );
    },
    onContentSizeChange (w, h) {
        this.yOffset = h - this.listViewHeight;
        if (this.yOffset > 0 && this.autoScrollEnable) {
            this.listView.scrollTo({ x:0, y:this.yOffset, animated:true });
        }
    },
    onScroll (e) {
        const y = e.nativeEvent.contentOffset.y;
        this.autoScrollEnable = y + this.rowHeight >= this.yOffset;
    },
    onLayout (e) {
        this.listViewHeight = e.nativeEvent.layout.height;
    },
    render () {
        return (
            <View style={styles.container}>
                <ListView
                    style={styles.list}
                    onScroll={this.onScroll}
                    onContentSizeChange={this.onContentSizeChange}
                    onLayout={this.onLayout}
                    ref={(listView) => { this.listView = listView; }}
                    initialListSize={1}
                    enableEmptySections
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
                    renderSeparator={this.renderSeparator}
                    />
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
    },
    list: {
        height: 300,
        width: sr.w,
        position: 'absolute',
        backgroundColor:'red',
    },
    icon_item: {
        height: 50,
    },
    separator: {
        height: 1,
        backgroundColor: '#EEEEEE',
    },
});
