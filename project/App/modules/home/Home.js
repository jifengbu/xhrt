'use strict';

var React = require('react');var ReactNative = require('react-native');
var {
    StyleSheet,
    View,
    Text,
    Image,
    ListView,
    ScrollView,
    TouchableHighlight,
    TouchableOpacity,
} = ReactNative;

var moment = require('moment');
import Swiper from 'react-native-swiper2';
import Badge from 'react-native-smart-badge'
var PersonInfo = require('../person/PersonInfo.js');
var StarCompany = require('./StarCompany.js');
var OfflinePrograms = require('./OfflinePrograms.js');
var WinBook = require('./WinBook.js');
var WinVideo = require('./WinVideo.js');
var ImageSelect = require('./ImageSelect.js');
var CompanyDetail = require('./CompanyDetail.js');
var ActivityDetail = require('./ActivityDetail.js');
var ReadingDetail = require('./ReadingDetail.js');
var RecommendVideoPlayer = require('./RecommendVideoPlayer.js');
var CoursePlayer = require('../specops/CoursePlayer.js');
var ShowWebView = require('./ShowWebView.js');
var specialTask = require('../task/index.js');
var BindingBox = require('../login/BindingBox.js');

var {DImage} = COMPONENTS;

module.exports = React.createClass({
    statics: {
        title: '赢销截拳道',
    },
    getInitialState() {
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return {
            bannerList:[],
            hotActiveityList:[],
            encourageReadList:[],
            encourageCourseList:[],
            shopInfoList:[],
            dataSource: this.ds.cloneWithRows([]),
        };
    },
    componentDidMount() {
        this.getHomePageData();
        if (app.isBind === false) {
            app.showModal(
                <BindingBox doRefresh={this.doRefresh}/>
            );
        }
    },
    doRefresh() {
        this.getHomePageData();
    },
    onWillFocus() {
        app.updateNavbarColor('#DE3031');
        this.getHomePageData();
    },
    getHomePageData() {
        var param = {
            userID: app.personal.info.userID,
        };
        POST(app.route.ROUTE_GET_HOME_PAGE_DATA, param, this.getHomePageDataSuccess, this.getHomePageDataError, true);
    },
    getHomePageDataSuccess(data) {
        if (data.success) {
            // app.data.specopsPackageID = data.context.packageID; //特种兵套餐ID，用来支付
            // app.data.specopsPackagePrice = data.context.packagePrice.toFixed(2); //特种兵套餐价钱，用来支付和显示
            let {banner, hotActiveity, encourageRead, encourageCourse, shopInfo, packageList} = data.context;
            app.data.packageList = packageList;
            let hotActiveityList = [];
            let encourageReadList = [];
            let encourageCourseListTemp = [];
            let encourageCourseList = [];
            let shopInfoList = [];
            if (hotActiveity) {
                hotActiveityList = hotActiveity.slice(0,6);
            }
            if (encourageRead) {
                encourageReadList = encourageRead.slice(0,4);
            }
            if (encourageCourse) {
                encourageCourseListTemp = encourageCourse.slice(0,4);
                if (encourageCourseListTemp.length > 0) {
                    const tempUserData = encourageCourseListTemp.slice(0);
                    let tempArray = [];

                    for (let i = 0; i < tempUserData.length; i++) {
                        tempArray.push(tempUserData[i]);
                        if (tempArray.length == 2) {
                            encourageCourseList.push(tempArray);
                            tempArray = [];
                        }
                    }
                    if (tempArray.length > 0) {
                        encourageCourseList.push(tempArray);
                    }
                }
            }
            if (shopInfo) {
                shopInfoList = shopInfo.slice(0,4);
            }

            let bannerList = [];
            if (banner) {
                for (var i = 0; i < banner.length; i++) {
                    switch (banner[i].type) {
                        case 1:
                        bannerList.push({"banneType": 1, "bannerId": banner[i].activityId?banner[i].activityId:'',
                                        "imageUrl": banner[i].imageUrl?banner[i].imageUrl:'', "title": banner[i].title?banner[i].title:'',
                                        "describe": banner[i].describe?banner[i].describe:''});
                            break;
                        case 2:
                        bannerList.push({"banneType": 2, "bannerId": banner[i].encourageReadId?banner[i].encourageReadId:'',
                                        "imageUrl": banner[i].imageUrl?banner[i].imageUrl:'', "title": banner[i].title?banner[i].title:'',
                                        "describe": banner[i].describe?banner[i].describe:''});
                            break;
                        case 3:
                        bannerList.push({"banneType": 3, "videoInfo": banner[i].videoInfo?banner[i].videoInfo:'',
                                    "imageUrl": banner[i].imageUrl?banner[i].imageUrl:'', "title": banner[i].title?banner[i].title:'',
                                    "describe": banner[i].describe?banner[i].describe:''});
                            break;
                        case 4:
                        bannerList.push({"banneType": 4, "bannerId": banner[i].shopInfoId?banner[i].shopInfoId:'',
                                        "imageUrl": banner[i].imageUrl?banner[i].imageUrl:'', "title": banner[i].title?banner[i].title:'',
                                        "describe": banner[i].describe?banner[i].describe:''});
                            break;
                        case 5:
                        bannerList.push({"banneType": 5, "bannerId": 'null', "imageUrl": banner[i].imageUrl?banner[i].imageUrl:'',
                                        "title": banner[i].title?banner[i].title:'',"cUrl": banner[i].cUrl?banner[i].cUrl:'',
                                        "describe": banner[i].describe?banner[i].describe:''});
                            break;
                        case 6:
                        bannerList.push({"banneType": 6, "bannerId": 'null', "imageUrl": banner[i].imageUrl?banner[i].imageUrl:'',
                                        "title": banner[i].title?banner[i].title:'', "describe": banner[i].describe?banner[i].describe:''});
                            break;
                    }

                }
            }
            this.setState({bannerList, hotActiveityList, encourageReadList, encourageCourseList, shopInfoList, dataSource: this.ds.cloneWithRows(encourageCourseList)}, ()=>{
                app.dismissProgressHUD();
            });
        } else {
            app.dismissProgressHUD();
            Toast(data.msg);
        }
    },
    getHomePageDataError() {
        app.dismissProgressHUD();
    },
    toNextPages(bannerInfo) {
        //1.活动详情页 2.文章详情页 3.课程详情页 4.明星示范单位详情页 5.网页 6.个人中心
        switch (bannerInfo.banneType) {
            case 1:
                app.navigator.push({
                    title: '活动详情页',
                    component: ActivityDetail,
                    passProps: {activeityId:bannerInfo.bannerId},
                });
                break;
            case 2:
                app.navigator.push({
                    title: bannerInfo.title,
                    component: ReadingDetail,
                    passProps: {articleId: bannerInfo.bannerId},
                });
                break;
            case 3:
                if (bannerInfo.videoInfo) {
                    this.playVideo(bannerInfo.videoInfo, true);
                }
                break;
            case 4:
                app.navigator.push({
                    title: '明星企业',
                    component: CompanyDetail,
                    passProps: {starCompanyID: bannerInfo.bannerId},
                });
                break;
            case 5:
                app.navigator.push({
                    title: bannerInfo.title,
                    component: ShowWebView,
                    passProps: {htmlUrl:bannerInfo.cUrl, imageUrl: bannerInfo.imageUrl, title: bannerInfo.title, describe: bannerInfo.describe},
                });
                break;
            case 6:
                app.navigator.push({
                    component: PersonInfo,
                    fromLeft: true,
                });
                break;
            default:
        }
    },
    toDredgeBoss(i) {
        switch (i) {
            case 0:
                app.navigator.push({
                    title: '赢销视频',
                    component: WinVideo,
                });
                break;
            case 1:
                app.navigator.push({
                    title: '赢销宝典',
                    component: WinBook,
                });
                break;
            case 2:
                app.navigator.push({
                    title: '线下课程',
                    component: OfflinePrograms,
                });
                break;
            case 3:
                // app.navigator.push({
                //     title: '明星示范单位',
                //     component: StarCompany,
                // });
                break;
            default:
        }
    },
    toWinBook() {
        app.navigator.push({
            title: '赢销宝典',
            component: WinBook,
        });
    },
    toStarCompanyList() {
        app.navigator.push({
            title: '明星示范单位',
            component: StarCompany,
        });
    },
    toRecommendVideoPage() {
        app.navigator.push({
            title: '赢销视频',
            component: WinVideo,
        });
    },
    renderBanner() {
        var {bannerList} = this.state;
        return (
            <View style={styles.bannerContainer}>
                <Swiper
                    paginationStyle={styles.paginationStyle}
                    height={sr.ws(150)}
                    dot={<View style={{ backgroundColor:'rgba(255,255,255,0.5)', width: 25, height: 2, borderRadius: 0, marginLeft: 4, marginRight: 4 }} />}
                    activeDot={<View style={{ backgroundColor:'#FFFFFF', width: 25, height: 2, borderRadius: 0, marginLeft: 4, marginRight: 4 }} />}
                    loop={true}
                    autoplay={true}
                    dotColor={'red'}
                    autoplayTimeout={5}
                    >
                    {
                        bannerList.map((item, i)=>{
                            return (
                                <TouchableOpacity
                                    key={i}
                                    onPress={this.toNextPages.bind(null, item)}>
                                    <Image
                                        resizeMode='stretch'
                                        defaultSource={app.img.common_default}
                                        source={{uri: item.imageUrl}}
                                        style={styles.bannerImage}
                                        />
                                </TouchableOpacity>
                            )
                        })
                    }
                </Swiper>
            </View>
        );
    },
    renderItem() {
        const btnArr = [{name:'赢销视频',img: app.img.home_video},{name: '赢销宝典',img: app.img.home_bible},{name:'线下课程',img: app.img.home_course},{name: '赢销特种兵',img: app.img.home_commando}];
        return (
            <View style={styles.itemStyle}>
                {
                    btnArr.map((item,i) => {
                        return(
                            <TouchableOpacity key={i} onPress={this.toDredgeBoss.bind(null,i)} style={styles.btnStyle}>
                                <Image
                                    resizeMode= 'stretch'
                                    source={item.img}
                                    style={styles.selectedScore}>
                                </Image>
                                <Text numberOfLines={1} style={styles.textStyle}>{item.name}</Text>
                            </TouchableOpacity>
                        );
                    })
                }
            </View>
        );
    },
    renderRead(obj) {
        return (
            <View style={styles.itemListView}>
                {
                    obj.map((item, j) => {
                        return (
                            <TouchableHighlight
                                key={j}
                                onPress={this.playVideo.bind(null, item, false)}
                                underlayColor="rgba(0, 0, 0, 0)">
                                <View style={styles.listViewItemContain}>
                                    <View style={styles.ItemContentContain}>
                                        <Image
                                            resizeMode='stretch'
                                            source={{uri:item.imageUrl}}
                                            style={styles.videoImage}>
                                        </Image>
                                        <View style={styles.flexConten}>
                                            <View style={styles.rowViewStyle}>
                                                <Text
                                                    numberOfLines={2}
                                                    style={styles.nameTextStyles}>
                                                    {'哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈啊哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈'}
                                                </Text>
                                                <Text
                                                    numberOfLines={1}
                                                    style={styles.detailTextStyles}>
                                                    {'哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈啊哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈'}
                                                </Text>
                                            </View>
                                            <View style={styles.columnViewStyle}>
                                                <Text style={styles.timeStyle}>{'6小时前'}
                                                </Text>
                                                <View style={styles.mainSpeakStyles}>
                                                    <Image
                                                        resizeMode='stretch'
                                                        source={app.img.home_eye}
                                                        style={styles.iconImage}>
                                                    </Image>
                                                    <Text style={styles.timeStyle}>{'888'}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </TouchableHighlight>
                        );
                    })
                }
            </View>
        )
    },
    renderEncourageRead() {
        var {encourageReadList} = this.state;
        return (
            <View style={styles.businessContainer}>
                <View style={styles.titleContainer}>
                    <View style={styles.leftTitleStyle}>
                        <Image
                            resizeMode='stretch'
                            source={app.img.home_rectangle}
                            style={styles.titleView}>
                        </Image>
                        <Text style={styles.titleText}>赢销宝典</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.rightTitleStyle}
                        onPress={this.toWinBook}>
                        <Text style={styles.targetText}>查看更多</Text>
                        <Image
                            resizeMode='stretch'
                            source={app.img.home_go}
                            style={styles.icon_go}>
                        </Image>
                    </TouchableOpacity>
                </View>
                <View style={styles.titleDivisionLine}>
                </View>
                {
                    encourageReadList.length > 0&&
                    this.renderRead(encourageReadList)
                }
            </View>
        );
    },
    playVideo(obj, isFromBanner) {
        const {isAgent, isSpecialSoldier} = app.personal.info;
        let authorized = isAgent||isSpecialSoldier; //是否是特种兵1—是  0—不是
        if (obj.videoType==6) {
            if (!authorized) {
                //跳转到购买特种兵页
                app.navigator.pop();
                app.showMainScene(1);
            } else {
                //跳转到特种兵视频播放页
                var param = {
                    userID:app.personal.info.userID,
                    videoID: obj.videoID,
                };
                POST(app.route.ROUTE_STUDY_PROGRESS, param, (data)=>{
                    if (data.success) {
                        app.navigator.push({
                            component: CoursePlayer,
                            passProps: {isCourseRecord:true, lastStudyProgress: data.context, otherVideoID: isFromBanner?null:obj.videoID},
                        });
                    } else {
                        Toast('该特种兵课程学习进度获取失败，请重试！');
                    }
                });
            }
        } else {
            //跳转到普通视频播放页
            app.navigator.push({
                component: RecommendVideoPlayer,
                passProps: {videoInfo:obj},
            });
        }
    },
    renderRow(obj, i) {
        let name = obj.name ? obj.name: '';
        return (
            <View key={i} style={styles.itemListView}>
                {
                    obj.map((item, j) => {
                        return (
                            <TouchableHighlight
                                key={j}
                                onPress={this.playVideo.bind(null, item, false)}
                                underlayColor="rgba(0, 0, 0, 0)">
                                <View style={styles.listViewItemContain}>
                                    <View style={styles.ItemContentContain}>
                                        <Image
                                            resizeMode='stretch'
                                            source={{uri:item.urlImg}}
                                            style={styles.videoImage}>
                                        </Image>
                                        <View style={styles.flexConten}>
                                            <View style={styles.rowViewStyle}>
                                                <Text
                                                    numberOfLines={2}
                                                    style={styles.nameTextStyles}>
                                                    {item.name}
                                                </Text>
                                                <Text
                                                    numberOfLines={1}
                                                    style={styles.detailTextStyles}>
                                                    {item.detail}
                                                </Text>
                                            </View>
                                            <View style={styles.columnViewStyle}>
                                                <Text style={styles.money}>{'￥'}<Text numberOfLines={1} style={styles.lastTimeText}>
                                                    {'9.9'}
                                                </Text>
                                                </Text>
                                                <View style={styles.mainSpeakStyles}>
                                                    <Text style={[styles.mainSpeakTag, {color: '#FFB235'}]}>{item.likes}
                                                        <Text style={[styles.mainSpeakTag, {color: '#9E9E9E'}]}>{'人正在学习'}</Text>
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </TouchableHighlight>
                        );
                    })
                }
            </View>
        )
    },
    renderEncourageCourse() {
        var {encourageCourseList} = this.state;
        return (
            <View style={styles.businessContainer}>
                <View style={styles.titleContainer}>
                    <View style={styles.leftTitleStyle}>
                        <Image
                            resizeMode='stretch'
                            source={app.img.home_rectangle}
                            style={styles.titleView}>
                        </Image>
                        <Text style={styles.titleText}>赢销视频</Text>
                    </View>
                    <TouchableOpacity style={styles.rightTitleStyle} onPress={this.toRecommendVideoPage}>
                        <Text style={styles.targetText}>查看更多</Text>
                        <Image
                            resizeMode='stretch'
                            source={app.img.home_go}
                            style={styles.icon_go}>
                        </Image>
                    </TouchableOpacity>
                </View>
                <View style={styles.titleDivisionLine}></View>
                <View style={styles.itemParentView}>
                    {
                        encourageCourseList.length>0&&
                        encourageCourseList.map((item, i) => {
                            return (
                                this.renderRow(item, i)
                            );
                        })
                    }
                </View>
            </View>
        );
    },
    renderImageSelectRow(obj) {
        return (
            <DImage
                defaultSource={app.img.common_default}
                source={{uri:obj.imageUrl==null?'':obj.imageUrl}}
                style={styles.selectedScoreContainer}>
                <View style={styles.bottomStyleMid}>
                    <Text
                        numberOfLines={1}
                        style={styles.textStyleMid}>
                        {obj.shopName}
                    </Text>
                </View>
            </DImage>
        )
    },
    doSelect(obj) {
        app.navigator.push({
            title: '活动详情页',
            component: CompanyDetail,
            passProps: {starCompanyID: obj.shopId, shopName: obj.shopName, imageUrl: obj.imageUrl},
        });
    },
    renderStarCompany() {
        var {shopInfoList} = this.state;
        return (
            <View style={[styles.businessContainer, {marginBottom: 8}]}>
                <View style={styles.titleContainer}>
                    <View style={styles.leftTitleStyle}>
                        <Image
                            resizeMode='stretch'
                            source={app.img.home_rectangle}
                            style={styles.titleView}>
                        </Image>
                        <Text style={styles.titleText}>明星企业</Text>
                    </View>
                    <TouchableOpacity style={styles.rightTitleStyle} onPress={this.toStarCompanyList}>
                        <Text style={styles.targetText}>查看更多</Text>
                        <Image
                            resizeMode='stretch'
                            source={app.img.home_go}
                            style={styles.icon_go}>
                        </Image>
                    </TouchableOpacity>
                </View>
                <View style={styles.titleDivisionLine}></View>
                {
                    shopInfoList.length > 0&&
                    <View style={styles.activityStyle}>
                        <ImageSelect
                            index={shopInfoList.length>2 ? 1: 0}
                            list={shopInfoList}
                            width={sr.ws(361)}
                            height={sr.ws(158)}
                            onPress={this.doSelect}
                            renderRow={this.renderImageSelectRow}
                            />
                    </View>
                }
            </View>
        );
    },
    render() {
        var {gotoSpecialSoldierTime,PKTime,PKWinTime,newReplay} = app.personal.info;
        var becomeSpecialSoldierDay = Math.floor(moment().diff(moment(gotoSpecialSoldierTime))/(24 * 60 * 60 * 1000))+1||1;
        var {bannerList, hotActiveityList, encourageReadList, encourageCourseList, shopInfoList, studyInfo} = this.state;
        return (
            <View style={styles.container}>
                <ScrollView style={styles.pageContainer}>
                    {
                        bannerList.length >=1 &&
                        <this.renderBanner />
                    }
                    <this.renderItem />
                    <this.renderEncourageRead />
                    <this.renderEncourageCourse />
                    <this.renderStarCompany />
                </ScrollView>
            </View>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EEEEEE'
    },
    pageContainer: {
        flex: 1,
        marginBottom: 49,
    },
    bannerContainer: {
        width: sr.w,
        height: 150,
    },
    paginationStyle: {
        width: sr.w,
        bottom: 7,
    },
    bannerImage: {
        width: sr.w,
        height: 150,
    },
    itemStyle: {
        width: sr.w,
        height: 90,
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
    },
    btnStyle: {
        width: sr.w/4,
        height: 90,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedScore: {
        width: 28,
        height: 28,
    },
    textStyle: {
        marginTop: 10,
        fontSize: 12,
        color: '#5B5B5B',
    },
    titleContainer: {
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    leftTitleStyle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    titleView: {
        width: 2,
        height: 14,
        marginLeft: 8,
    },
    icon_go: {
        width: 8,
        height: 14,
        marginLeft: 5,
    },
    titleText: {
        width: 150,
        fontSize: 14,
        color: '#4A4848',
        marginLeft: 10,
        fontFamily: 'STHeitiSC-Medium',
    },
    rightTitleStyle: {
        marginRight: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    targetText: {
        color: '#A7A7A7',
        fontSize: 13,
    },
    titleDivisionLine: {
        width: sr.w,
        height: 1,
        alignSelf: 'center',
        backgroundColor: '#F1F1F1',
    },
    businessContainer: {
        width: sr.w,
        marginTop: 6,
        backgroundColor: '#FFFFFF',
    },
   itemParentView: {
       backgroundColor:'#FFFFFF',
   },
   itemListView: {
       backgroundColor: 'red',
   },
   listViewItemContain: {
       flexDirection: 'row',
       width: sr.w,
       paddingVertical: 2,
       backgroundColor: '#FFFFFF',
   },
   ItemContentContain: {
       flexDirection: 'row',
       width: sr.w - 20,
       margin: 10,
   },
   videoImage: {
       width: 125,
       height: 85,
   },
   flexConten: {
       width: 220,
       marginLeft: 10,
       flexDirection: 'column',
   },
   rowViewStyle: {
       backgroundColor: 'transparent',
   },
   nameTextStyles: {
       color: '#383838',
       fontSize:14,
   },
   detailTextStyles: {
       marginTop: 10,
       color: '#AFAFAF',
       fontSize:12,
   },
   columnViewStyle: {
       position: 'absolute',
       bottom: 0,
       left: 0,
       width: 220,
       height: 20,
       flexDirection: 'row',
       alignItems: 'flex-end',
       justifyContent: 'space-between',
   },
   mainSpeakStyles: {
       flexDirection: 'row',
       alignItems: 'center',
   },
   iconImage: {
       width: 15,
       height: 10,
       marginHorizontal: 5,
   },
   mainSpeakTag: {
       fontSize: 12,
       marginLeft: 5,
       backgroundColor: 'transparent',
   },
   money: {
       color: '#FB771A',
       fontSize: 9,
   },
   lastTimeText: {
       color: '#FB771A',
       fontSize: 14,
   },
   selectedScoreContainer: {
       width: 256,
       height: 158,
       alignItems: 'center',
       borderRadius: 4,
       justifyContent: 'center',
   },
   bottomStyleMid: {
       position: 'absolute',
       left: 0,
       bottom: 0,
       width: 256,
       height: 45,
       alignItems: 'center',
       justifyContent: 'center',
       backgroundColor: 'rgba(0,0,0,0.3)'
   },
   textStyleMid: {
       fontSize: 16,
       fontFamily:'STHeitiSC-Medium',
       color: '#FFFFFF',
   },
   activityStyle: {
       marginHorizontal: 7,
       marginVertical: 20,
   },
   timeStyle: {
       fontSize: 10,
       color: '#9E9E9E',
   },
});
