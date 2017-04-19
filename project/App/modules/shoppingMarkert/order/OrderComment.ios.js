'use strict';

const React = require('react');const ReactNative = require('react-native');
const {
    View,
    Text,
    Image,
    TextInput,
    StyleSheet,
    TouchableOpacity,
} = ReactNative;

const ImagePicker = require('@remobile/react-native-image-picker');
const Dialogs = require('@remobile/react-native-dialogs');

const { Button, DelayTouchableOpacity } = COMPONENTS;
const starArray = [1, 2, 3, 4, 5];

module.exports = React.createClass({
    statics: {
        title: '评论',
    },
    getInitialState () {
        return {
            showTextInput: false,
            urlImages: null,
            commentContent: '',
            stars:3,
        };
    },
    submitComment () {
        const param = {
            userID: app.personal.info.userID,
            orderNo: this.props.data.orderNo,
            startNum: this.state.stars,
            comment: this.state.commentContent,
            imageArray: this.state.urlImages,
            userName: app.personal.info.name,
            goodsID: this.props.data.goodsID,
        };
        POST(app.route.ROUTE_SUBMIT_GOODS_COMMENT, param, this.submitCommentSuccess, true);
    },
    submitCommentSuccess (data) {
        if (data.success) {
            Toast(data.msg);
            this.props.updateIsComment({ isComment:2, orderNo: this.props.data.orderNo });
            app.navigator.pop();
        } else {
            Toast(data.msg);
        }
    },
    showCommentTextInput () {
        this.setState({ showTextInput: !this.state.showTextInput });
    },
    uploadFiles (filePaths) {
        const param = {
            userID:app.personal.info.userID,
        };
        MULTIUPLOAD(filePaths, app.route.ROUTE_UPDATE_MULTI_FILES, param, (progress) => console.log(progress),
            this.uploadSuccessCallback, this.uploadErrorCallback, true);
    },
    uploadSuccessCallback (data) {
        if (data.success) {
            this.setState({ urlImages: data.context.url });
        } else {
            Toast('上传失败');
        }
    },
    uploadErrorCallback () {
    },
    showPohotoImg () {
        const options = { maximumImagesCount: 3, width: 400 };
        const filePaths = [];
        ImagePicker.getPictures(options, (results) => {
            console.log('+++++++++++', results);
            if (results.length > 0) {
                for (let i = 0; i < results.length; i++) {
                    const filePath = results[i];
                    const item = {
                        name: 'file', // optional, if none then `filename` is used instead
                        filename: filePath.substr(filePath.lastIndexOf('/') + 1), // require, file name
                        filepath: filePath, // require, file absoluete path
                        filetype: 'image/png', // options, if none, will get mimetype from `filepath` extension
                    };
                    filePaths.push(item);
                }
                console.log('===========', filePaths);
                this.uploadFiles(filePaths);
            }
        }, (error) => {
            Dialogs.alert('Error: ' + error);
        });

        // this.setState({hasPohoto: !this.state.hasPohoto});
    },
    changStars (value) {
        this.setState({ stars:value });
    },
    render () {
        return (
            <View style={styles.mainContian}>
                <View>
                    <View style={styles.profitTitle}>
                        <View style={styles.profitTitle_Name}>
                            <Image
                                resizeMode='stretch'
                                source={app.img.mall_tagging_icon}
                                style={styles.tagging_icon_style} />
                            <Text style={styles.shopNameStyle}>{this.props.data.shopName}</Text>
                        </View>
                    </View>

                    <View style={styles.goodsInfoViewStyle}>
                        <View style={styles.goodsImgStyle}>
                            <Image
                                resizeMode='stretch'
                                source={{ uri:this.props.data.goodsImg }}
                                style={styles.shopImgStyle} />
                        </View>
                        <View style={styles.payPriceView}>
                            <View style={styles.goodsContentStyle}>
                                <Text style={styles.goodsName}>{this.props.data.goodsDec}</Text>
                            </View>
                            <View style={styles.payPriceViewStyle}>
                                <Text style={styles.goodsName2}>实付款: {this.props.data.totalPrice}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.chatViewStyle}>
                        <View style={styles.commentStarsView}>
                            <View style={styles.commentStarsViewTextView}>
                                <Text>评分</Text>
                            </View>
                            <View style={styles.commentStars}>
                                {
                                  starArray.map((item, i) => {
                                      return (
                                          <TouchableOpacity key={i} activeOpacity={0.7} onPress={this.changStars.bind(this, item)} style={styles.commentStar}>
                                              <Image
                                                  resizeMode='stretch'
                                                  source={this.state.stars >= item ? app.img.mall_star_checked : app.img.mall_star_not_checked}
                                                  style={styles.commentStar} />
                                          </TouchableOpacity>
                                      );
                                  })
                              }
                            </View>
                        </View>
                        {
                          this.state.showTextInput ?
                              <TextInput
                                  placeholder='请填写评论内容'
                                  onChangeText={(text) => this.setState({ commentContent: text })}
                                  defaultValue={this.state.commentContent}
                                  style={styles.text_input}
                                  multiline
                                />
                            :
                              <TouchableOpacity activeOpacity={0.7} onPress={this.showCommentTextInput} style={styles.commentOnTouchStyle}>
                                  <Text style={{ color: 'red' }}>点击编辑评论，长度为 1-500 字之间</Text>
                              </TouchableOpacity>
                        }
                        <View style={styles.imageViewStyle}>
                            { this.state.urlImages && this.state.urlImages.map((image) => {
                                return <Image source={{ uri: image }} style={styles.thumbnail} />;
                            })
                            }
                        </View>
                        <DelayTouchableOpacity onPress={this.showPohotoImg} activeOpacity={0.7} style={styles.chatTouchStyle}>
                            <Text style={styles.chatTextStyle}>添加照片</Text>
                        </DelayTouchableOpacity>
                    </View>
                </View>
                <View style={styles.bottomStyle}>
                    <TouchableOpacity activeOpacity={0.7} style={styles.sumitCommentStyle} onPress={this.submitComment}>
                        <Text style={styles.sumitCommentTextStyle}>提交评论</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    },
});

const styles = StyleSheet.create({
    mainContian: {
        flex: 1,
        width: sr.w,
        height: sr.h,
    },
    profitTitle: {
        width: sr.w,
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
    },
    profitTitle_Name: {
        flex: 1,
        marginVertical: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    profitTitle_Code: {
        flex: 1,
        marginRight: 10,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    tagging_icon_style: {
        marginLeft: 5,
        width: 25,
        height: 25,
    },
    delete_icon_style: {
        marginRight: 10,
        width: 30,
        height: 30,
    },
    shopImgStyle: {
        width: 80,
        height: 80,
    },
    chatImgStyle: {
        width: 30,
        height: 30,
        marginTop: 5,
        marginLeft: 20,
    },
    shopNameViewStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection:'row',
        width: sr.w,
        height: 40,
    },
    shopNameStyle: {
        alignSelf: 'center',
        color:'#000000',
    },
    goodsInfoViewStyle: {
        marginTop: 1,
        width: sr.w,
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
    },
    goodsImgStyle: {
        flex: 1,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    goodsContentStyle: {
        flexDirection: 'column',
        marginTop: 20,
        marginLeft: 10,
    },
    goodsName: {
        color:'#000000',
        marginTop: 5,
        fontSize: 13,
    },
    goodsName2: {
        color:'#666666',
        marginTop: 5,
        fontSize: 13,
    },
    chatViewStyle: {
        backgroundColor: '#efefef',
        marginTop: 2,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection:'column',
        width: sr.w,
    },
    imageViewStyle: {
        backgroundColor: '#FFFFFF',
        marginTop: 2,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection:'row',
        width: sr.w,
    },
    chatTextStyle: {
        color:'#FFFFFF',
        fontSize: 14,
        marginRight: 20,
        marginLeft: 20,
    },
    pohotoStyle: {
        width: 100,
        height: 100,
        marginTop: 10,
        marginBottom: 10,
    },
    chatTouchStyle: {
        borderRadius: 4,
        marginTop: 8,
        marginBottom: 8,
        flexDirection:'row',
        alignItems: 'center',
        backgroundColor: '#4FC1E9',
        height: 40,
    },
    commentStarsView: {
        width: sr.w,
        height: 40,
        backgroundColor:'#FFFFFF',
        flexDirection:'row',
        marginVertical:8,
    },
    commentStarsViewTextView: {
        flex:1,
        justifyContent:'center',
        padding:10,
    },
    commentStars: {
        flex:1,
        flexDirection:'row',
        padding:10,
        justifyContent:'flex-end',
    },
    commentStar: {
        marginHorizontal:5,
        width: 20,
        height: 20,
    },
    text_input: {
        width: sr.w,
        height: 120,
        marginVertical:10,
        padding:10,
        fontSize:13,
        textAlignVertical: 'top',
        backgroundColor:'#FFFFFF',
    },
    bottomStyle: {
        flex: 1,
        position:'absolute',
        bottom: 0,
        left: 0,
        flexDirection: 'column',
    },
    commentOnTouchStyle: {
        width: sr.w,
        height: 120,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#FFFFFF',
    },
    sumitCommentStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4FC1E9',
        width: sr.w,
        height: 50,
    },
    sumitCommentTextStyle: {
        color: '#FFFFFF',
        fontSize: 15,
    },
    payPriceViewStyle: {
        marginLeft: 10,
        flexDirection: 'row',
    },
    payPriceView: {
        flex: 3,
        flexDirection: 'column',
    },
    thumbnail: {
        width: 73,
        height: 73,
        borderWidth: 1,
        borderColor: '#DDD',
        margin: 5,
    },
});
