'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    StyleSheet,
    View,
    Animated,
    Text,
    Image,
    TouchableOpacity,
    Navigator,
} = ReactNative;

const { Button, DImage } = COMPONENTS;

module.exports = React.createClass({
    getInitialState () {
        return {
            opacity: new Animated.Value(0),
            name: '',
            post: '',
            sex: 0,
            phone: '',
            email: '',
            industry: '',
            city: '',
            company: '',
            education: '',
        };
    },
    componentDidMount () {
        Animated.timing(this.state.opacity, {
            toValue: 1,
            duration: 500,
        }
        ).start();

        // get data
        const param = {
            userID:this.props.userID,
        };
        POST(app.route.ROUTE_GET_PERSONAL_CARD_INFO, param, this.getPersonalCardInfoSuccess, true);
    },
    getPersonalCardInfoSuccess (data) {
        if (data.success) {
            this.setState({
                name: data.context.name ? data.context.name : '',
                phone: data.context.phone ? data.context.phone : '',
                company: data.context.company ? data.context.company : '',
                post: data.context.post ? data.context.post : '',
                headImg :data.context.headImg,
                city :data.context.city ? data.context.city : '',
                sex :data.context.sex ? data.context.sex : 0,
                email :data.context.email ? data.context.email : '',
                industry :data.context.industryPersonal ? data.context.industryPersonal : '',
            });

            switch (data.context.education) {
                case 0:
                    this.setState({ education:'高中' });
                    break;
                case 1:
                    this.setState({ education:'专科' });
                    break;
                case 2:
                    this.setState({ education:'本科' });
                    break;
                case 3:
                    this.setState({ education:'硕士' });
                    break;
                case 4:
                    this.setState({ education:'博士' });
                    break;
                case 5:
                    this.setState({ education:'博士后' });
                    break;
            }
        } else {
            Toast(data.msg);
        }
    },
    doConfirm () {
        this.closeModal(() => {
            this.props.hideCard();
        });
    },
    closeModal (callback) {
        Animated.timing(this.state.opacity, {
            toValue: 0,
            duration: 500,
        }).start(() => {
            callback();
        });
    },
    render () {
        const { headImg, name, post, sex, phone, email, industry, city, company, education } = this.state;

        return (
            <Animated.View style={[styles.overlayContainer, { opacity: this.state.opacity }]}>
                <TouchableOpacity
                    onPress={this.doConfirm}
                    activeOpacity={1}
                    style={styles.touchLayer}
                    >
                    <Image
                        resizeMode='stretch'
                        source={app.img.actualCombat_business_card}
                        style={styles.backgroundStyle}>
                        <DImage
                            resizeMode='stretch'
                            defaultSource={app.img.personal_head}
                            source={{ uri: headImg }}
                            style={styles.headStyle} />
                        <View style={styles.leftContainer}>
                            <Text style={styles.nameText}>{name}</Text>
                            <Text style={styles.nameText1}>{post}</Text>
                        </View>
                        <View style={styles.rightContainer}>
                            <Text style={styles.textStyle}>{'性别： ' + (sex === 1 ? '男' : '女')}</Text>
                            <Text style={styles.textStyle} numberOfLines={2}>{'手机： ' + phone}</Text>
                            <Text style={styles.textStyle} numberOfLines={2}>{'邮箱： ' + email}</Text>
                            <Text style={styles.textStyle} numberOfLines={2}>{'行业： ' + industry}</Text>
                            <Text style={styles.textStyle} numberOfLines={2}>{'城市： ' + city}</Text>
                            <Text style={styles.textStyle} numberOfLines={2}>{'公司： ' + company}</Text>
                            <Text style={styles.textStyle} numberOfLines={1}>{'学历： ' + education}</Text>
                        </View>
                    </Image>
                </TouchableOpacity>
            </Animated.View>
        );
    },
});

const styles = StyleSheet.create({
    overlayContainer: {
        position:'absolute',
        bottom : 0,
        left: 0,
        width:sr.w,
        height:sr.h,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    touchLayer: {
        width:sr.w,
        height:sr.h,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backgroundStyle: {
        width: 307,
        height: 475,
        marginLeft: -20,
        flexDirection: 'row',
    },
    headStyle: {
        position: 'absolute',
        width:108,
        height:108,
        top: 66,
        left: 6,
        borderRadius: app.isandroid ? 108 * 6 : 54,
    },
    leftContainer: {
        width: 60,
        height: 200,
        marginLeft: 31,
        marginTop: 190,
        alignItems: 'center',
    },
    rightContainer: {
        width: 300,
        height: 170,
        marginTop: 180,
        justifyContent: 'space-between',
    },
    nameText: {
        width: 30,
        fontSize: 25,
        marginBottom: 15,
        textAlign: 'center',
        color: '#555555',
    },
    nameText1: {
        width: 25,
        fontSize: 14,
        textAlign: 'center',
        color: '#555555',
    },
    textStyle: {
        width: 210,
        fontSize: 14,
        color: '#999999',
    },
});
