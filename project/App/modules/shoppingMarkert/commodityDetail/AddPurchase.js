'use strict';

const React = require('react');const ReactNative = require('react-native');
const ReactBase = require('react');
const {
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    Animated,
    Navigator,
} = ReactNative;

const { Button } = COMPONENTS;

module.exports = React.createClass({
    getInitialState () {
        const defaultArray = [];
        this.dataKeys = [];
        _.map(this.props.merchandisingData.data, (item) => {
            _.mapValues(item, (value, key) => {
                defaultArray.push(value.default);
                this.dataKeys.push(key);
            });
        });
        return {
            goodsID:this.props.goodsID,
            opacity: new Animated.Value(0),
            goodsNum: 1,
            selectArray: defaultArray,
        };
    },
    componentWillMount () {
        Animated.timing(this.state.opacity, {
            toValue: 1,
            duration: 500,
        }
        ).start();
    },
    doClose () {
        Animated.timing(this.state.opacity, {
            toValue: 0,
            duration: 500,
        }
        ).start(() => {
            this.props.doClose();
        });
    },
    doConfirm () {
        this.closeModal(() => {
            const tempSelectArray = this.state.selectArray;
            const totalPrice = this.getPrice(this.state.selectArray) * this.state.goodsNum;
            tempSelectArray.push(this.state.goodsNum);
            this.props.gotoWriteOrderView(tempSelectArray, totalPrice.toFixed(2));
            this.state.selectArray = [];
        });
    },
    closeModal (callback) {
        Animated.timing(this.state.opacity, {
            toValue: 0,
            duration: 500,
        }
        ).start(() => {
            callback();
        });
    },
    doAdd () {
        const goodsNum = this.state.goodsNum + 1;
        this.setState({ goodsNum: goodsNum });
    },
    doSubtract () {
        let goodsNum = this.state.goodsNum;
        if (goodsNum == 1) {
            return;
        }
        goodsNum--;
        this.setState({ goodsNum: goodsNum });
    },
    changeTab (tabIndex) {
        this.setState({ tabIndex });
    },
    getPrice (arr) {
        let price = this.props.merchandisingData.price;
        _.forEach(arr, (item) => {
            price = price[item];
        });
        return price;
    },
    onPropsItemPress (row, col) {
        const { selectArray } = this.state;
        const key = this.dataKeys[row];
        const data = this.props.merchandisingData.data[row];
        const allValue = data[key].allValue;
        selectArray[row] = allValue[col];
        this.setState({ selectArray: selectArray });
    },
    render () {
        const selectArray = this.state.selectArray;
        const { stock, code, goodsImg, data } = this.props.merchandisingData;
        return (
            <Animated.View style={[styles.overlayContainer, { opacity: this.state.opacity }]}>
                <View style={styles.container}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={styles.detailContainer}>
                            <Text style={[styles.detailText, { color: '#ff3c30' }]}>{'￥:' + (this.getPrice(selectArray) * this.state.goodsNum).toFixed(2)}</Text>
                            <Text style={[styles.detailText, { color: '#666666' }]}>{'库存:' + stock}</Text>
                            <Text style={[styles.detailText, { color: '#666666' }]}>{'请选择包装规格'}</Text>
                        </View>
                        <TouchableOpacity onPress={this.doClose}>
                            <Image
                                resizeMode='stretch'
                                source={app.img.mall_close_normal}
                                style={styles.closeIcon} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={styles.scrollContainer}>
                        {
                          _.map(data, (value, row) => {
                              const key = this.dataKeys[row];
                              const allValue = value[key].allValue;
                              return (
                                  <View key={row}>
                                      <View style={[styles.choiceContainer, { marginTop: 10 }]}>
                                          <Text style={{ fontSize: 16 }}>{code[key]}</Text>
                                          <View style={styles.tabContainer}>
                                              {
                                                  allValue.map((item, col) => {
                                                      const isSelect = selectArray[row] === item;
                                                      return (
                                                          <TouchableOpacity
                                                              key={col}
                                                              onPress={this.onPropsItemPress.bind(null, row, col)}
                                                              style={[styles.tabButton, isSelect ? { backgroundColor:'#4FC1E9' } : { backgroundColor: '#e1e4e9' }]}
                                                           >
                                                              <Text
                                                                  style={[styles.tabText, isSelect ? { color:'#FFFFFF' } : { color: '#666666' }]}
                                                            >
                                                                  {code[item]}
                                                              </Text>
                                                          </TouchableOpacity>
                                                      );
                                                  })
                                              }
                                          </View>
                                          <View style={styles.separator} />
                                      </View>
                                  </View>
                              );
                          })
                      }
                        <View style={styles.choiceNumContainer}>
                            <Text style={styles.numContainerTitle}>{'购买数量'}</Text>
                            <View style={styles.numContainer}>
                                <TouchableOpacity onPress={this.doSubtract}>
                                    <Image
                                        resizeMode='stretch'
                                        source={app.img.mall_reduce_normal}
                                        style={styles.numIcon} />
                                </TouchableOpacity>
                                <View style={{ alignSelf: 'center', flex: 1 }}>
                                    <Text style={{ fontSize: 14, alignSelf: 'center' }}>{this.state.goodsNum}</Text>
                                </View>
                                <TouchableOpacity onPress={this.doAdd}>
                                    <Image
                                        resizeMode='stretch'
                                        source={app.img.mall_increase_normal}
                                        style={styles.numIcon} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.separator} />
                        <View style={{ height: 50, flex: 1 }} />
                    </ScrollView>
                    <Button onPress={this.doConfirm} style={styles.submitBtn}>
                        {'确' + '        ' + '定'}
                    </Button>
                </View>
                <Image
                    resizeMode='cover'
                    defaultSource={app.img.login_logo}
                    source={{ uri: goodsImg }}
                    style={styles.iconStyle} />
            </Animated.View>
        );
    },
});

const styles = StyleSheet.create({
    overlayContainer: {
        alignItems:'center',
        justifyContent: 'center',
        width:sr.w,
        height:sr.ch,
        position:'absolute',
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    container: {
        width:sr.w,
        height:sr.h * 3 / 4,
        backgroundColor: 'white',
        position: 'absolute',
        bottom: 0,
    },
    iconStyle: {
        width: 110,
        height: 110,
        borderRadius:10,
        position: 'absolute',
        top: 0,
        left: 20,
        borderColor:'#4FC1E9',
        borderWidth:8,
    },
    detailContainer: {
        marginTop: 10,
        marginLeft: 150,
        flex: 1,
    },
    detailText: {
        marginTop: 10,
    },
    closeIcon: {
        width: 30,
        height: 30,
        marginRight: 10,
        marginTop: 10,
    },
    scrollContainer: {
        flex: 1,
        marginVertical:20,
    },
    choiceContainer: {
        marginBottom: 10,
        marginHorizontal: 20,
    },
    btnStyle: {
        height: 40,
        width: 60,
        borderRadius: 6,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#4FC1E9',
    },
    separator: {
        marginTop: 5,
        height: 1,
        width: sr.w,
        backgroundColor: '#b4b4b4',
    },
    choiceNumContainer: {
        height:30,
        width: sr.w - 40,
        marginVertical: 10,
        marginHorizontal: 20,
        flexDirection: 'row',
    },
    numContainerTitle: {
        flex: 1,
        fontSize: 16,
        alignSelf: 'center',
    },
    numContainer: {
        height:30,
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    numIcon: {
        flex: 1,
        width: 30,
        height: 30,
    },
    submitBtn: {
        width: sr.w,
        height: 50,
        bottom: 0,
        borderRadius: 0,
        position: 'absolute',
        backgroundColor: '#4FC1E9',
    },
    tabContainer: {
        height: 35,
        marginTop: 10,
        flexDirection: 'row',
        overflow: 'hidden',
    },
    tabButton: {
        justifyContent:'center',
        borderRadius: 6,
        marginRight: 10,
    },
    tabText: {
        fontSize: 14,
        marginHorizontal: 10,
    },
});
