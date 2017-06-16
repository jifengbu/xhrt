'use strict';
const React = require('react');
const ReactNative = require('react-native');
const {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    ListView,
    Image,
} = ReactNative;

const BindingBank = require('./BindingBank.js');

module.exports = React.createClass({
    getInitialState () {
        this.list = this.props.bankList;
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        return {
            dataSource: this.ds.cloneWithRows(this.list),
        };
    },
    componentDidMount: function() {
        this.selects = [true,false];
    },
    toBindingBank() {
        app.closeModal();
        app.navigator.push({
            component: BindingBank,
        });
    },
    backWithdraw(name, sectionID, rowID) {
        for (var i = 0; i < this.list.length; i++) {
            this.list[i]['pitch'] = false;
        }
        this.list[rowID].pitch = true;
        this.props.getName(name,this.list);
        app.closeModal();
    },
    renderRow (obj, sectionID, rowID) {
        let name = obj.bank+' - 储蓄卡'+'('+obj.cradno.substring(obj.cradno.length-4)+')';
        return (
            <TouchableOpacity style={styles.btn_item} onPress={this.backWithdraw.bind(null,name, sectionID, rowID)}>
                <Text style={[styles.itemNameText,{marginLeft: 15,}]}>
                    {name}
                </Text>
                {
                    obj.pitch&&
                    <Image
                        resizeMode='stretch'
                        source={app.img.wallet_sure}
                        style={styles.icon_sure} />
                }
            </TouchableOpacity>
        );
    },
    renderFooter () {
        return (
            <TouchableOpacity style={styles.btn_item} onPress={this.toBindingBank}>
                <View style={styles.titleStyle}>
                    <Image
                        resizeMode='stretch'
                        source={app.img.wallet_add}
                        style={styles.icon_add} />
                        <Text style={styles.itemNameText}>
                            {'添加银行卡提现'}
                        </Text>
                </View>
                <View style={styles.infoStyle}>
                    <Image
                        resizeMode='stretch'
                        source={app.img.wallet_enter}
                        style={styles.icon_go} />
                </View>
            </TouchableOpacity>
        );
    },
    render () {
        return (
            <View style={styles.overlayContainer}>
                <View style={styles.container}>
                    <View style={styles.topView}>
                        <Text style={styles.titleNameText}>
                            {'选择提现银行卡'}
                        </Text>
                        <TouchableOpacity style={styles.btn_cancel} onPress={app.closeModal}>
                            <Image
                                resizeMode='stretch'
                                source={app.img.wallet_cancel}
                                style={styles.icon_cancel} />
                        </TouchableOpacity>
                    </View>
                    <ListView
                        initialListSize={1}
                        onEndReachedThreshold={10}
                        enableEmptySections
                        style={styles.listStyle}
                        dataSource={this.state.dataSource}
                        renderRow={this.renderRow}
                        renderFooter={this.renderFooter}
                        />
                    <View style={styles.empty}>
                    </View>
                </View>
            </View>

        );
    },
});

const styles = StyleSheet.create({
    container: {
        marginTop: 140,
        width: sr.w-80,
        height: 180,
        borderRadius: 6,
        backgroundColor: '#FFFFFF',
    },
    overlayContainer: {
        position:'absolute',
        top: 0,
        alignItems:'center',
        width:sr.w,
        height:sr.h,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    topView: {
        width:sr.w-80,
        height:40,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
        backgroundColor: '#DE3031',
    },
    btn_cancel: {
        position: 'absolute',
        top: 4,
        right: 4,
        height: 25,
        width: 25,
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
    },
    icon_cancel: {
        height: 10,
        width: 10,
    },
    btn_item: {
        width: sr.w-80,
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    listStyle: {
        alignSelf:'stretch',
        backgroundColor: '#FFFFFF',
    },
    titleStyle: {
        marginLeft: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemNameText: {
        fontSize: 16,
        color: '#373737',
    },
    titleNameText: {
        fontSize: 16,
        color: '#FFFFFF',
    },
    icon_add: {
        marginHorizontal: 5,
        width: 20,
        height: 20,
    },
    infoStyle: {
        marginRight: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon_go: {
        width: 20,
        height: 22,
    },
    icon_sure: {
        width: 20,
        height: 22,
        marginRight: 15,
    },
    empty: {
        width: sr.w-80,
        height: 10,
    },
});
