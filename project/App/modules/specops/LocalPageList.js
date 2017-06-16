'use strict';

const React = require('react');const ReactNative = require('react-native');
const {
    View,
    Text,
    Image,
    StyleSheet,
    ListView,
    TouchableHighlight,
    RefreshControl,
} = ReactNative;

const { STATUS_TEXT_HIDE, STATUS_START_LOAD, STATUS_HAVE_MORE, STATUS_NO_DATA, STATUS_ALL_LOADED, STATUS_LOAD_ERROR } = CONSTANTS.LISTVIEW_INFINITE.STATUS;

module.exports = React.createClass({
    getDefaultProps () {
        return {
            pageNo: 1,
            pageCount: 15,
            list: [],
        };
    },
    getShowList(){
        this.showList = _.take(this.list, this.pageNo*this.pageCount);
    },
    getInitialState () {
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.showList = [];
        this.list = this.props.list || [];
        this.pageCount = this.props.pageCount;
        this.pageNo=1;
        this.getShowList();
        return {
            dataSource: this.ds.cloneWithRows(this.showList),
            infiniteLoadStatus: STATUS_TEXT_HIDE,
        };
    },
    onEndReached () {
        if (this.pageNo*this.pageCount > this.list.length) {
            this.setState({
                infiniteLoadStatus: STATUS_ALL_LOADED,
            });
            return;
        }
        this.setState({
            infiniteLoadStatus: STATUS_HAVE_MORE,
        });
        setTimeout(()=>{
            this.pageNo++;
            this.getShowList();
            this.setState({
                dataSource: this.ds.cloneWithRows(this.showList),
            });
        }, 600);
    },
    renderFooter () {
        const status = this.state.infiniteLoadStatus;
        return (
            <View style={styles.listFooterContainer}>
                <Text style={styles.listFooter}>
                    {
                        CONSTANTS.LISTVIEW_INFINITE.TEXT[status]
                    }
                </Text>
            </View>
        );
    },
    render () {
        return (
            <View style={styles.container}>
                <ListView
                    onEndReached={this.onEndReached}
                    onEndReachedThreshold={this.pageCount}
                    initialListSize={this.pageCount}
                    enableEmptySections
                    style={{alignSelf:'stretch' }}
                    dataSource={this.state.dataSource}
                    renderRow={this.props.renderRow}
                    renderFooter={this.renderFooter}
                    renderSeparator={this.props.renderSeparator}
                    />
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listFooterContainer: {
        height: 60,
        alignItems: 'center',
    },
    listFooter: {
        marginTop: 10,
        color: 'gray',
        fontSize: 14,
    },
    separator: {
        backgroundColor: '#DDDDDD',
        height: 1,
    },
});
