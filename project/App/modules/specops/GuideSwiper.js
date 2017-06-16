'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
} = ReactNative;

const { Button } = COMPONENTS;
import Swiper from 'react-native-swiper2';

module.exports = React.createClass({
    getInitialState () {
        this.changeIndex = 0;
        return {
            overlayImage1: true,
            overlayImage2: false,
            overlayImage3: false,
            overlayImage4: false,
            currentIndex: 0,
        };
    },
    onPressImage1 () {
        this.setState({currentIndex:-1}, ()=>{
            this.setState({currentIndex:1});
        });
        this.setState({
            overlayImage1: false,
            overlayImage2: true,
        });
    },
    onPressImage2 () {
        this.setState({currentIndex:-1}, ()=>{
            this.setState({currentIndex:2});
        });
        this.setState({
            overlayImage2: false,
            overlayImage3: true,
        });
    },
    onPressImage3 () {
        this.setState({currentIndex:-1}, ()=>{
            this.setState({currentIndex:3});
        });
        this.setState({
            overlayImage3: false,
            overlayImage4: true,
        });
    },
    onPressImage4 () {
        app.closeModal();
    },
    onChangePage (index) {
        if (this.changeIndex == index) {
            return;
        }
        this.changeIndex = Math.round(index);
    },
    render () {
        return (
            <View style={styles.overlayContainer}>
            {
                this.state.currentIndex==0 &&
                <Swiper
                    paginationStyle={styles.paginationStyle}
                    dot={<View style={{ backgroundColor:'#FFFCF4', width: 0, height: 0, }} />}
                    activeDot={<View style={{ backgroundColor:'#FFCD53', width: 0, height: 0, }} />}
                    height={sr.ws(sr.h)}
                    index={0}
                    onChangePage={this.onChangePage}
                    loop={false}>
                    {
                        [1, 2, 3, 4].map((i) => {
                            return (
                                <View key={i}>
                                {
                                    i === 1 &&
                                    <Image
                                        resizeMode='stretch'
                                        source={app.img.specops_guide1}
                                        style={styles.overlayBackgroundStyle}>
                                        <TouchableOpacity
                                            onPress={this.onPressImage1}
                                            style={styles.bannerTouch} />
                                    </Image>
                                }
                                {
                                    i === 2 &&
                                    <Image
                                        resizeMode='stretch'
                                        source={app.img.specops_guide2}
                                        style={styles.overlayBackgroundStyle}>
                                        <TouchableOpacity
                                            onPress={this.onPressImage2}
                                            style={styles.bannerTouch} />
                                    </Image>
                                }
                                {
                                    i === 3 &&
                                    <Image
                                        resizeMode='stretch'
                                        source={app.img.specops_guide3}
                                        style={styles.overlayBackgroundStyle}>
                                        <TouchableOpacity
                                            onPress={this.onPressImage3}
                                            style={styles.bannerTouch} />
                                    </Image>
                                }
                                {
                                    i === 4 &&
                                    <Image
                                        resizeMode='stretch'
                                        source={app.img.specops_guide4}
                                        style={styles.overlayBackgroundStyle}>
                                        <TouchableOpacity
                                            onPress={this.onPressImage4}
                                            style={styles.bannerOther} />
                                    </Image>
                                }
                                </View>
                            );
                        })
                    }
                </Swiper>
            }
            {
                this.state.currentIndex==1 &&
                <Swiper
                    paginationStyle={styles.paginationStyle}
                    dot={<View style={{ backgroundColor:'#FFFCF4', width: 0, height: 0, }} />}
                    activeDot={<View style={{ backgroundColor:'#FFCD53', width: 0, height: 0, }} />}
                    height={sr.ws(sr.h)}
                    index={1}
                    onChangePage={this.onChangePage}
                    loop={false}>
                    {
                        [1, 2, 3, 4].map((i) => {
                            return (
                                <View key={i}>
                                {
                                    i === 1 &&
                                    <Image
                                        resizeMode='stretch'
                                        source={app.img.specops_guide1}
                                        style={styles.overlayBackgroundStyle}>
                                        <TouchableOpacity
                                            onPress={this.onPressImage1}
                                            style={styles.bannerTouch} />
                                    </Image>
                                }
                                {
                                    i === 2 &&
                                    <Image
                                        resizeMode='stretch'
                                        source={app.img.specops_guide2}
                                        style={styles.overlayBackgroundStyle}>
                                        <TouchableOpacity
                                            onPress={this.onPressImage2}
                                            style={styles.bannerTouch} />
                                    </Image>
                                }
                                {
                                    i === 3 &&
                                    <Image
                                        resizeMode='stretch'
                                        source={app.img.specops_guide3}
                                        style={styles.overlayBackgroundStyle}>
                                        <TouchableOpacity
                                            onPress={this.onPressImage3}
                                            style={styles.bannerTouch} />
                                    </Image>
                                }
                                {
                                    i === 4 &&
                                    <Image
                                        resizeMode='stretch'
                                        source={app.img.specops_guide4}
                                        style={styles.overlayBackgroundStyle}>
                                        <TouchableOpacity
                                            onPress={this.onPressImage4}
                                            style={styles.bannerOther} />
                                    </Image>
                                }
                                </View>
                            );
                        })
                    }
                </Swiper>
            }
            {
                this.state.currentIndex==2 &&
                <Swiper
                    paginationStyle={styles.paginationStyle}
                    dot={<View style={{ backgroundColor:'#FFFCF4', width: 0, height: 0, }} />}
                    activeDot={<View style={{ backgroundColor:'#FFCD53', width: 0, height: 0, }} />}
                    height={sr.ws(sr.h)}
                    index={2}
                    onChangePage={this.onChangePage}
                    loop={false}>
                    {
                        [1, 2, 3, 4].map((i) => {
                            return (
                                <View key={i}>
                                {
                                    i === 1 &&
                                    <Image
                                        resizeMode='stretch'
                                        source={app.img.specops_guide1}
                                        style={styles.overlayBackgroundStyle}>
                                        <TouchableOpacity
                                            onPress={this.onPressImage1}
                                            style={styles.bannerTouch} />
                                    </Image>
                                }
                                {
                                    i === 2 &&
                                    <Image
                                        resizeMode='stretch'
                                        source={app.img.specops_guide2}
                                        style={styles.overlayBackgroundStyle}>
                                        <TouchableOpacity
                                            onPress={this.onPressImage2}
                                            style={styles.bannerTouch} />
                                    </Image>
                                }
                                {
                                    i === 3 &&
                                    <Image
                                        resizeMode='stretch'
                                        source={app.img.specops_guide3}
                                        style={styles.overlayBackgroundStyle}>
                                        <TouchableOpacity
                                            onPress={this.onPressImage3}
                                            style={styles.bannerTouch} />
                                    </Image>
                                }
                                {
                                    i === 4 &&
                                    <Image
                                        resizeMode='stretch'
                                        source={app.img.specops_guide4}
                                        style={styles.overlayBackgroundStyle}>
                                        <TouchableOpacity
                                            onPress={this.onPressImage4}
                                            style={styles.bannerOther} />
                                    </Image>
                                }
                                </View>
                            );
                        })
                    }
                </Swiper>
            }
            {
                this.state.currentIndex==3 &&
                <Swiper
                    paginationStyle={styles.paginationStyle}
                    dot={<View style={{ backgroundColor:'#FFFCF4', width: 0, height: 0, }} />}
                    activeDot={<View style={{ backgroundColor:'#FFCD53', width: 0, height: 0, }} />}
                    height={sr.ws(sr.h)}
                    index={3}
                    onChangePage={this.onChangePage}
                    loop={false}>
                    {
                        [1, 2, 3, 4].map((i) => {
                            return (
                                <View key={i}>
                                {
                                    i === 1 &&
                                    <Image
                                        resizeMode='stretch'
                                        source={app.img.specops_guide1}
                                        style={styles.overlayBackgroundStyle}>
                                        <TouchableOpacity
                                            onPress={this.onPressImage1}
                                            style={styles.bannerTouch} />
                                    </Image>
                                }
                                {
                                    i === 2 &&
                                    <Image
                                        resizeMode='stretch'
                                        source={app.img.specops_guide2}
                                        style={styles.overlayBackgroundStyle}>
                                        <TouchableOpacity
                                            onPress={this.onPressImage2}
                                            style={styles.bannerTouch} />
                                    </Image>
                                }
                                {
                                    i === 3 &&
                                    <Image
                                        resizeMode='stretch'
                                        source={app.img.specops_guide3}
                                        style={styles.overlayBackgroundStyle}>
                                        <TouchableOpacity
                                            onPress={this.onPressImage3}
                                            style={styles.bannerTouch} />
                                    </Image>
                                }
                                {
                                    i === 4 &&
                                    <Image
                                        resizeMode='stretch'
                                        source={app.img.specops_guide4}
                                        style={styles.overlayBackgroundStyle}>
                                        <TouchableOpacity
                                            onPress={this.onPressImage4}
                                            style={styles.bannerOther} />
                                    </Image>
                                }
                                </View>
                            );
                        })
                    }
                </Swiper>
            }
            </View>
        );
    },
});

const styles = StyleSheet.create({
    overlayContainer: {
        position:'absolute',
        top: 0,
        width:sr.w,
        height:sr.h,
        backgroundColor: 'rgba(0,0,0,0.88)',
    },
    overlayBackgroundStyle: {
        width:sr.w,
        alignItems: 'center',
        height:sr.h,
    },
    btnText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontFamily: 'STHeitiSC-Medium',
    },
    bottomContainer: {
        width: sr.w - 60,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bannerTouch: {
        width: 160,
        height: 50,
        marginTop: 550,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    bannerOther: {
        width: 160,
        height: 50,
        marginTop: 290,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
});
