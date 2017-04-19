'use strict';

const React = require('react');const ReactNative = require('react-native');
const {
    StyleSheet,
    Image,
    View,
    TouchableHighlight,
    TouchableOpacity,
    Text,
} = ReactNative;

const PlanDetails = require('./PlanDetails');
const CardBox = require('../shared/CardBox.js');

const { PageList, StarBar, DImage } = COMPONENTS;

module.exports = React.createClass({
    getInitialState () {
        return {
            overlayShowCardBox: false,
            specopsUser: '',
        };
    },
    _onPressRow (obj) {
        this.props.isPlayer();
        app.navigator.push({
            component: PlanDetails,
            passProps: { schemeID: obj.schemeID, schemeDetail: obj, tabIndex:this.props.tabIndex, doRefresh:this.doRefresh },
        });
    },
    renderRow (obj, sectionID, rowID) {
        return (
            <TouchableHighlight
                style={[styles.itemContainer, rowID < 3 ? { marginBottom: 11 } : null]}
                onPress={this._onPressRow.bind(null, obj)}
                underlayColor='#EEB422'>
                <View style={styles.titleContainer}>
                    <TouchableOpacity
                        onPress={obj.userType == 5 ? this.showCard.bind(null, obj) : null}
                        style={styles.userInfoStyle}>
                        <View style={styles.levelContainer}>
                            {
                                rowID < 3 &&
                                <Image
                                    resizeMode='contain'
                                    style={styles.rankingIcon}
                                    source={app.img['actualCombat_no_' + rowID]} />
                            }
                        </View>
                        <DImage
                            resizeMode='cover'
                            style={styles.headerIcon}
                            defaultSource={app.img.personal_head}
                            source={{ uri: obj.publisherImg }} />
                        {
                            obj.userType == 5 ?
                                <View style={styles.infoView}>
                                    <Text numberOfLines={1} style={styles.nameText}>
                                        {obj.publisherName + '/  ' + obj.industryName + '/  ' + obj.pos}
                                    </Text>
                                    <Text numberOfLines={1} style={styles.nameText}>
                                        {obj.company}
                                    </Text>
                                </View> :
                                <Text numberOfLines={1} style={[styles.nameText, { alignSelf: 'center' }]}>
                                    {obj.publisherName}
                                </Text>
                        }
                    </TouchableOpacity>
                    <StarBar value={obj.score} style={styles.scoreIconStyle} starStyle={styles.scoreIcon} />
                    <Image
                        resizeMode='stretch'
                        source={app.img.common_go}
                        style={styles.iconGo} />
                </View>
            </TouchableHighlight>
        );
    },
    renderSeparator (sectionID, rowID) {
        return (
            <View style={styles.separator} key={rowID} />
        );
    },
    doRefresh () {
        this.listView.refresh();
    },
    hideCard () {
        this.setState({ overlayShowCardBox: false });
    },
    showCard (obj) {
        if (this.props.showCardType === 1) {
            this.setState({ overlayShowCardBox: true, specopsUser:obj.userID });
        } else if (this.props.showCardType === 2) {
            this.props.isShowCard(obj.userID);
        }
    },
    render () {
        return (
            <View style={styles.container}>
                <PageList
                    ref={listView => { this.listView = listView; }}
                    renderRow={this.renderRow}
                    listParam={{ kitID: this.props.kitID }}
                    listName={'caseList'}
                    refreshEnable
                    listUrl={app.route.ROUTE_CASE_SCHEME}
                    />
                {
                    // showCardType 1个人中心进 2实战场进
                    this.props.showCardType === 1 && this.state.overlayShowCardBox &&
                    <CardBox
                        userID={this.state.specopsUser}
                        hideCard={this.hideCard} />
                }
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: '#EEEEEE',
        flexDirection: 'column',
    },
    list: {
        alignSelf:'stretch',
    },
    separator: {
        backgroundColor: '#DDDDDD',
        height: 1,
    },
    itemContainer: {
        width:sr.w,
        backgroundColor: 'white',
    },
    titleContainer: {
        flexDirection: 'row',
        flex: 1,
    },
    titleText: {
        flex: 2,
        fontSize: 16,
        color: '#666664',
        alignSelf: 'center',
    },
    userInfoStyle: {
        flex: 2,
        flexDirection: 'row',
    },
    rankingIcon: {
        width: 18,
        height: 18,
        marginLeft: 5,
    },
    headerIcon: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 1,
        marginVertical: 8,
        borderColor: CONSTANTS.THEME_COLOR,
    },
    scoreIconStyle: {
        flexDirection: 'row',
    },
    scoreIcon: {
        alignSelf: 'center',
        marginLeft: 3,
        width: 20,
        height: 20,
    },
    iconGo: {
        width: 8,
        height: 15,
        marginLeft: 5,
        marginRight: 10,
        alignSelf: 'center',
    },
    levelContainer: {
        height: 46,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    levelText: {
        alignSelf: 'center',
        color: '#f8000c',
    },
    infoView: {
        width: sr.w / 3 + 30,
        justifyContent: 'center',
    },
    nameText: {
        fontSize: 12,
        color: '#666664',
    },
});
