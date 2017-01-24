'use strict';

var React = require('react');var ReactNative = require('react-native');
var {
    View,
    Text,
    Image,
    ListView,
    StyleSheet,
    ScrollView,
    TextInput,
    RefreshControl,
    TouchableOpacity,
} = ReactNative;

var {Button} = COMPONENTS;

const addressDisplayArray = [
    {title:'家庭地址',img:app.img.mall_home_address_icon},
    {title:'公司地址',img:app.img.mall_company_address_icon},
    {title:'常用地址',img:app.img.mall_common_address_icon},
    {title:'其他地址',img:app.img.mall_other_address_icon},
];
var addressSubArray = [];
module.exports = React.createClass({
    statics: {
        title: '地址管理',
    },
    getInitialState() {
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return {
            addressList:addressSubArray,
            selectAddNo:null,
        };
    },
    componentDidMount() {
        this.getMyAddress();
    },
    getMyAddress() {
        var param = {
            userID: app.personal.info.userID,
        };
        POST(app.route.ROUTE_GET_MY_ADDR, param, this.getMyAddressSuccess, true);
    },
    getMyAddressSuccess(data) {
        if (data.success) {
            let addressList = data.context.addressList||[];
            addressSubArray = addressList.concat();
            for (var item in addressSubArray) {
                if (addressSubArray[item].isSelectAddr == 1) {
                    this.setState({addressList: addressList, selectAddNo:item});
                }
            }
            this.setState({addressList});
        } else {
            Toast(data.msg);
        }
    },
    submitMyAddress() {
        if (this.state.selectAddNo == null) {
            Toast('请选择一个收货地址');
            return;
        }
        if (addressSubArray[this.state.selectAddNo].name == '' || addressSubArray[this.state.selectAddNo].name == null
            && addressSubArray[this.state.selectAddNo].phone == '' || addressSubArray[this.state.selectAddNo].phone == null
            && addressSubArray[this.state.selectAddNo].addr == '' || addressSubArray[this.state.selectAddNo].addr == null) {
            Toast('选择的地址不能为空');
            return;
        }
        if (!app.utils.checkPhone(addressSubArray[this.state.selectAddNo].phone)) {
            Toast('手机号码不是有效的手机号码');
            return;
        }
        var param = {
            userID: app.personal.info.userID,
            selectAddNo:this.state.selectAddNo,
            addrInfo:addressSubArray,
        };
        var orderData = null;
        for (var item in addressSubArray) {
            if (addressSubArray[item].addNo == this.state.selectAddNo) {
                orderData = {
                    addNo: addressSubArray[item].addNo,
                    name: addressSubArray[item].name,
                    addr: addressSubArray[item].addr,
                    phone: addressSubArray[item].phone,
                };
            }
        }
        POST(app.route.ROUTE_SUBMIT_MY_ADDR, param, this.submitMyAddressSuccess.bind(null, orderData), true);
    },
    submitMyAddressSuccess(orderData, data) {
        if (data.success) {
            this.props.updateAddr({orderData:orderData});
            app.navigator.pop();
        } else {
            Toast(data.msg);
        }
    },
    changeSelectAddNo(value) {
        for (var item in addressSubArray) {
            if (addressSubArray[item].addNo == value) {
                addressSubArray[item].isSelectAddr = 1;
            } else {
                addressSubArray[item].isSelectAddr = 0;
            }
        }
        this.setState({selectAddNo:value});
    },
    renderSeparator() {
        return (
            <View style={styles.separator}/>
        );
    },
    renderRow(obj, sectionID, rowID) {
        return (
         <View style={styles.itemContainer}>
             <View style={styles.itemLeftContainer}>
             <Image
                 resizeMode='cover'
                 source={addressDisplayArray[obj.addNo].img}
                 style={styles.itemTopImage}
                 />
             <Text style={styles.leftItemContent}>{addressDisplayArray[obj.addNo].title}</Text>
                 <TouchableOpacity onPress={this.changeSelectAddNo.bind(this,obj.addNo)}>
                     <Image
                         resizeMode='cover'
                         source={this.state.selectAddNo==obj.addNo?app.img.common_check:app.img.common_no_check}
                         style={styles.itemCheckBox}
                         />
                 </TouchableOpacity>
             </View>
             <View style={styles.Vline}></View>
             <View style={styles.itemRightContainer}>
                 <TextInput
                     placeholder='暂无数据，请输入联系人姓名'
                     onChangeText={(text) => {addressSubArray[obj.addNo].name= text}}
                     defaultValue={addressSubArray[obj.addNo].name}
                     style={styles.rightItemContent}
                     />
                 <View style={styles.Hline}></View>
                 <TextInput
                     placeholder='暂无数据，请输入联系电话'
                     onChangeText={(text) => {addressSubArray[obj.addNo].phone= text}}
                     defaultValue={addressSubArray[obj.addNo].phone}
                     style={styles.rightItemContent}
                     />
                 <View style={styles.Hline}></View>
                 <TextInput
                     placeholder='暂无数据，请输入联系地址'
                     multiline={true}
                     numberOfLines={2}
                     onChangeText={(text) => {addressSubArray[obj.addNo].addr= text}}
                     defaultValue={addressSubArray[obj.addNo].addr}
                     style={styles.rightItemContent2}
                     />
             </View>
         </View>
        )
    },
    render() {
        return (
            <View style={styles.container}>
                <ListView                    initialListSize={1}
                    enableEmptySections={true}
                    dataSource={this.ds.cloneWithRows(this.state.addressList)}
                    renderRow={this.renderRow}
                    renderSeparator={this.renderSeparator}
                    />
                <Button onPress={this.submitMyAddress} style={styles.contentButton}>确{'  '}定</Button>
            </View>
        )
    },
});
var styles = StyleSheet.create({
    container: {
        flex: 1,
        width: sr.w,
        height: sr.h,
        backgroundColor: '#FFFFFF',
    },
    itemContainer: {
        width: sr.w,
        flexDirection: 'row',
        height:150,
        borderWidth:1,
        borderColor:'#EEEEEE',
    },
    itemLeftContainer: {
        flex:1,
        height:150,
        padding:10,
        flexDirection: 'column',
    },
    itemTopImage: {
        width:22,
        height:22,
        flexDirection: 'column',
    },
    leftItemContent: {
        width:22,
        textAlign:'center',
        marginVertical:5,
        flexDirection: 'column',
    },
    itemCheckBox: {
        width:22,
        height:22,
        flexDirection: 'column',
    },
    itemRightContainer: {
        flex:9,
        height:150,
        flexDirection: 'column',
        marginHorizontal:5,
        marginVertical:6,
    },
    rightItemContent: {
        height:35,
        paddingLeft: 10,
        fontSize:13,
        textAlign:'left',
        backgroundColor: '#FFFFFF',
    },
    Hline: {
        height: 1,
        backgroundColor:'#EEEEEE',
    },
    Vline: {
        width: 1,
        backgroundColor:'#EEEEEE',
    },
    rightItemContent2: {
        height:70,
        paddingLeft: 10,
        paddingVertical:10,
        fontSize:13,
        textAlign:'left',
        textAlignVertical: 'top',
        backgroundColor: '#FFFFFF',
    },
    contentButton: {
        width:sr.w,
        height:50,
        borderRadius:3,
        backgroundColor:'#54C1E7',
    },
    separator: {
        height:5,
        backgroundColor: '#CCC'
    },
});
