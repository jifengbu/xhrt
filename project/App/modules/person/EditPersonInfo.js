'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    Image,
    Text,
    StyleSheet,
    TextInput,
    View,
    TouchableOpacity,
    ScrollView,
    LayoutAnimation,
} = ReactNative;

const dismissKeyboard = require('dismissKeyboard');
const CityData = require('../../data/city.js');
const moment = require('moment');
const EditPosition = require('./EditPosition.js');
const EditInformationBox = require('./EditInformationBox.js');
const PersonalInfoMgr = require('../../manager/PersonalInfoMgr.js');
const Subscribable = require('Subscribable');
const Camera = require('@remobile/react-native-camera');

const { DImage, ActionSheet, Picker } = COMPONENTS;

const createAreaData = (area) => {
    let data = [];
    let len = area.length;
    for(let i=0;i<len;i++){
        let city = [];
        for(let j=0,cityLen=area[i]['city'].length;j<cityLen;j++){
            let _city = {};
            _city[area[i]['city'][j]['name']] = area[i]['city'][j]['area'];
            city.push(_city);
        }

        let _data = {};
        _data[area[i]['name']] = city;
        data.push(_data);
    }
    return data;
};
const createTimeData = () => {
    const data = app.utils.createDateDataPicker(moment());
    return data;
};
const getAddressFullName = (values) => {
    if (values[0] === values[1]) {
        return values[0] + '市' + values[2];
    }
    return values[0] + '省' + values[1] + '市' + values[2];
};
const DATA = {
    sex: ['男', '女'],
    age: createTimeData(),
    city: createAreaData(CityData),
};
const DEFAULT_OPACITY = 0.5;

const arrayTemp = [];

module.exports = React.createClass({
    mixins: [Subscribable.Mixin, SceneMixin],
    statics: {
        title: '个人信息',
        leftButton: { image: app.img.common_back2, handler: () => { app.scene.goBack(); } },
        rightButton: { title: '编辑', delayTime:1, handler: () => { app.scene.toggleEdit(); } },
    },
    componentWillMount () {
        this.addListenerOn(PersonalInfoMgr, 'USER_HEAD_CHANGE_EVENT', (param) => {
            this.setState({ headImgSource: { uri: param.head } });
        });
    },
    goBack () {
        app.navigator.pop();
    },
    toggleEdit () {
        Picker.hide();
        dismissKeyboard();
        if (this.state.isEditStatus) {
            const { headImg, name, email, sex, trade, company, post, city, birthday } = app.personal.info;
            const ageText = this.state.ageText;
            const birth = this.formatDateLoad(ageText);
            let tempSex = 0;
            if (this.state.sex[0] === '男') {
                tempSex = 1;
            } else {
                tempSex = 0;
            }
            if (name != this.state.name || sex != tempSex || email != this.state.email || headImg != this.state.headImgSource.uri || trade != this.state.trade || company != this.state.company || post != this.state.post || city != this.state.city || birthday != birth) {
                this.updatePersnalInfo();
            } else {
                this.setState({ isEditStatus: false });
                app.getCurrentRoute().leftButton = { image: app.img.common_back2, handler: () => { app.scene.goBack(); } };
                app.getCurrentRoute().rightButton = { title: '编辑', delayTime:1, handler: () => { app.scene.toggleEdit(); } };
                app.forceUpdateNavbar();
            }
        } else {
            this.setState({ isEditStatus: true });
            app.getCurrentRoute().leftButton = { title: '取消', delayTime:1, handler: () => { app.scene.showBox&&app.scene.showBox(); } };
            app.getCurrentRoute().rightButton = { title: '完成', delayTime:1, handler: () => { app.scene.toggleEdit(); } };
            app.forceUpdateNavbar();
        }
    },
    showBox () {
        dismissKeyboard();
        const { headImg, name, email, sex, trade, company, post, city, birthday } = app.personal.info;
        const ageText = this.state.ageText;
        const birth = this.formatDateLoad(ageText);
        let tempSex = 0;
        if (this.state.sex[0] === '男') {
            tempSex = 1;
        } else {
            tempSex = 0;
        }
        if (name != this.state.name || sex != tempSex || email != this.state.email || headImg != this.state.headImgSource.uri || trade != this.state.trade || company != this.state.company || post != this.state.post || city != this.state.city || birthday != birth) {
            this.showConfirmBox();
        } else {
            app.navigator.pop();
        }
    },
    showConfirmBox () {
        app.showModal(
            <EditInformationBox
                doConfirm={this.doConfirm}
                title={'是否放弃对资料的修改'}
                />
        );
    },
    getStateFromPersonalInfo () {
        const info = app.personal.info;
        const post = info.post;
        const trade = info.trade;
        const company = info.company;
        const email = info.email;
        const name = info.name;
        const city = info.city;
        const birthday = info.birthday;

        let sex = '男';
        const ageText = this.restoreDate(birthday);
        if (info.sex === 0) {
            sex = '女';
        }
        let headImgSource = info.sex === 1 ? app.img.personal_sex_male : app.img.personal_sex_female;
        if (info.headImg) {
            headImgSource = { uri: info.headImg };
        }
        return {
            sex: sex,
            city: city,
            name: name,
            post: post,
            trade: trade,
            company: company,
            email: email,
            ageText: ageText,
            actionSheetVisible: false,
            headImgSource: headImgSource,
        };
    },
    getInitialState () {
        return Object.assign({
            showSuccessToast: false,
            overlayShow: false,
            isEditStatus: false,
        }, this.getStateFromPersonalInfo());
    },
    onWillHide() {
        Picker.hide();
    },
    setPersonalInfo () {
        const info = app.personal.info;
        info.sex = this.state.sex;
        info.post = this.state.post;
        info.trade = this.state.trade;
        info.company = this.state.company;
        info.email = this.state.email;
        info.name = this.state.name;
        info.city = this.state.city;
        info.headImg = this.state.headImgSource.uri || '';
        if (this.state.sex[0] === '男') {
            info.sex = 1;
        } else {
            info.sex = 0;
        }
        const ageText = this.state.ageText;
        info.birthday = this.formatDateLoad(ageText);
        app.personal.set(info);
    },
    editPosition () {
        Picker.hide();
        app.navigator.push({
            title: '职业',
            component: EditPosition,
            passProps: { getPosition: this.getPosition },
        });
    },
    getPosition (trade) {
        this.setState({ trade });
    },
    _onPressHandle (type) {
        this.pickerType = type;
        let birthday = [''];
        let { sex, ageText, city } = this.state;
        if (city) {
            city = city.split(/市|省/);
            if (city.length === 2) {
                city = [city[0]].concat(city);
            } else if (city.length === 1) {
                city = ['北京', '北京', '东城区'];
            }
        } else {
            city = ['北京', '北京', '东城区'];
        }
        if (ageText.length !== 0) {
            birthday = ageText;
        } else {
            const date = moment();
            birthday = [date.year() + '年', (date.month() + 1) + '月', date.date() + '日'];
        }
        let defaultSelectValue, pickerData;
        if (type === 'sex') {
            defaultSelectValue = [sex];
            pickerData = DATA.sex;
        } else if (type === 'age') {
            defaultSelectValue = birthday;
            pickerData = DATA.age;
        } else if (type === 'city') {
            defaultSelectValue = city;
            pickerData = DATA.city;
        }
        Picker(pickerData, defaultSelectValue, '').then((value)=>{
            this.setChooseValue(value);
        });
    },
    setChooseValue (value) {
        const type = this.pickerType;
        if (type === 'sex') {
            if (!this.state.headImgSource.uri) {
                if (value[0] === '男') {
                    this.setState({ headImgSource: app.img.personal_sex_male });
                } else {
                    this.setState({ headImgSource: app.img.personal_sex_female });
                }
            }
            this.setState({ sex: value });
        } else if (type === 'age') {
            this.setState({ ageText: value });
        } else if (type === 'city') {
            this.setState({ city: getAddressFullName(value) });
        }
    },
    setEmailText (text) {
        this.setState({ email: text });
    },
    onTextInputFocus () {
        Picker.hide();
    },
    doConfirm () {
        app.navigator.pop();
    },
    restoreDate (dateStr) {
        let dateArr = [];
        let newArr = [];
        let newStr = '';
        if (dateStr) {
            dateArr = dateStr.split('-');
            dateArr.splice(1, 0, '年/');
            dateArr.splice(3, 0, '月/');
            dateArr.splice(5, 0, '日');
            newStr = dateArr.join('');
            newArr = newStr.split('/');
        }
        return newArr;
    },
    formatDate (date) {
        let dateStr = '';
        let dateArr = [];
        let newStr = '';
        if (date) {
            dateStr = date.join('');
            const str = dateStr.substring(0, dateStr.length - 1);
            dateArr = str.split(/[年月]/);
            newStr = dateArr.join('/');
        }
        return newStr;
    },
    formatDateLoad (date) {
        let dateStr = '';
        let dateArr = [];
        let newStr = '';
        if (date) {
            dateStr = date.join('');
            const str = dateStr.substring(0, dateStr.length - 1);
            dateArr = str.split(/[年月]/);
            newStr = dateArr.join('-');
        }
        return newStr;
    },
    formatCity (city) {
        let cityStr = '';
        if (city) {
            cityStr = city.replace('市', '市-');
            cityStr = cityStr.replace('省', '省-');
        }
        return cityStr;
    },
    updatePersnalInfo () {
        const detailsMap = this.setData();
        const isEmail = app.utils.checkEmailCode(detailsMap.email);
        if (!isEmail) {
            Toast('请输入正确的邮箱格式');
            return;
        }
        if (detailsMap.name == '') {
            Toast('名称不能为空');
            return;
        }
        const param = {
            userID: app.personal.info.userID,
            detail: detailsMap,
        };
        POST(app.route.ROUTE_UPDATE_PERSONAL_INFO, param, this.updatePersnalInfoSuccess, this.updatePersnalInfoError, true);
    },
    updatePersnalInfoSuccess (data) {
        if (data.success) {
            this.setPersonalInfo();
            this.setState({ isEditStatus: false, showSuccessToast: true });
            app.getCurrentRoute().leftButton = { handler: () => { app.scene.goBack(); } };
            app.getCurrentRoute().rightButton = { title: '编辑', handler: () => { app.scene.toggleEdit(); } };
            app.forceUpdateNavbar();
            setTimeout(() => {
                this.setState({ showSuccessToast: false });
            }, 2000);
        } else {
            Toast(data.msg);
        }
    },
    updatePersnalInfoError (error) {
    },
    onFocus () {
        Picker.hide();
    },
    setData () {
        let sexCode = 0;
        const sexText = this.state.sex + '';
        if (sexText === '男') {
            sexCode = 1;
        }
        let ageGroup = 0;
        const birthday = this.formatDateLoad(this.state.ageText);
        const detailsMap = {};
        detailsMap['name'] = _.trim(this.state.name);
        detailsMap['sex'] = sexCode;
        detailsMap['city'] = this.state.city;
        detailsMap['post'] = this.state.post;
        detailsMap['trade'] = this.state.trade;
        detailsMap['company'] = this.state.company;
        detailsMap['email'] = this.state.email;
        detailsMap['birthday'] = birthday;
        detailsMap['headImg'] = this.state.headImgSource.uri || '';
        return detailsMap;
    },
    doCloseActionSheet () {
        this.setState({ actionSheetVisible:false });
    },
    doShowActionSheet () {
        this.setState({ actionSheetVisible:true });
    },
    selectPicture () {
        this.doCloseActionSheet();
        const options = {
            quality: 30,
            targetWidth: 240,
            targetHeight: 240,
            allowEdit: true,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        };
        Camera.getPicture((filePath) => {
            this.uploadUserHead(filePath);
        }, () => {
            Toast('操作失败');
        }, options);
    },
    takePicture () {
        this.doCloseActionSheet();
        const options = {
            quality: 30,
            allowEdit: true,
            targetWidth: 240,
            targetHeight: 240,
            cameraDirection: Camera.Direction.FRONT,
            destinationType: Camera.DestinationType.FILE_URI,
        };
        Camera.getPicture((filePath) => {
            this.uploadUserHead(filePath);
        }, () => {
            Toast('操作失败');
        }, options);
    },
    uploadUserHead (filePath) {
        this.setState({ headImgSource: { uri: filePath } });
        const options = {};
        options.fileKey = 'file';
        options.fileName = filePath.substr(filePath.lastIndexOf('/') + 1);
        options.mimeType = 'image/jpeg';
        options.params = {
            userID:app.personal.info.userID,
        };
        this.uploadOn = true;
        UPLOAD(filePath, app.route.ROUTE_UPDATE_FILE, options, (progress) => console.log(progress),
        this.uploadSuccessCallback, this.uploadErrorCallback, true);
    },
    uploadSuccessCallback (data) {
        if (data.success) {
            const context = data.context;
            app.personal.setUserHead(context.url);
        } else {
            Toast('上传失败');
            this.setState({ headImgSource: { uri: app.personal.info.headImg } });
        }
        this.uploadOn = false;
    },
    uploadErrorCallback () {
        this.uploadOn = false;
        this.setState({ headImgSource: { uri: app.personal.info.headImg } });
    },
    render () {
        return (
            <View style={{ flex: 1 }}>
                <ScrollView>
                    <View style={styles.containerStyle}>
                        <TouchableOpacity
                            onPress={this.state.isEditStatus ? this.doShowActionSheet : null}
                            activeOpacity={!this.state.isEditStatus ? 1 : DEFAULT_OPACITY}
                            style={styles.headStyle} >
                            <Text style={styles.headText}>{'头像'}</Text>
                            <View style={styles.itemView}>
                                <DImage
                                    resizeMode='cover'
                                    defaultSource={app.img.personal_head}
                                    source={this.state.headImgSource}
                                    style={styles.headIcon} />
                                {
                                    this.state.isEditStatus &&
                                    <Image
                                        resizeMode='contain'
                                        source={app.img.common_go}
                                        style={styles.goIcon} />
                                }
                            </View>
                        </TouchableOpacity>
                        <Text style={styles.lowSeprator} />
                        <View style={styles.itemBgStyle} >
                            <Text style={styles.headText}>名称</Text>
                            { !this.state.isEditStatus ?
                                <Text style={styles.contentText}>{this.state.name ? this.state.name : '请输入您的名称'}</Text>
                                :
                                <TextInput
                                    onChangeText={(text) => this.setState({ name: text })}
                                    onFocus={this.onTextInputFocus}
                                    underlineColorAndroid={'transparent'}
                                    defaultValue={this.state.name}
                                    placeholder={'请输入您的名称'}
                                    placeholderTextColor={'#BABABA'}
                                    style={styles.text_input} />
                            }
                        </View>
                        <Text style={styles.lowSeprator} />
                        <View style={styles.itemBgStyle}>
                            <Text style={styles.headText}>邮箱</Text>
                            { !this.state.isEditStatus ?
                                <Text style={styles.contentText}>{this.state.email ? this.state.email : '请输入您的邮件'}</Text>
                                :
                                <TextInput
                                    onChangeText={this.setEmailText}
                                    onFocus={this.onTextInputFocus}
                                    underlineColorAndroid={'transparent'}
                                    defaultValue={this.state.email}
                                    placeholderTextColor={'#BABABA'}
                                    placeholder={'请输入您的邮箱'}
                                    style={styles.text_input} />
                            }
                        </View>
                        <Text style={styles.lowSeprator} />
                        <TouchableOpacity
                            activeOpacity={!this.state.isEditStatus ? 1 : DEFAULT_OPACITY}
                            onPress={this.state.isEditStatus ? this._onPressHandle.bind(this, 'sex') : null}>
                            <View style={styles.itemBgStyle}>
                                <Text style={styles.headText}>性别</Text>
                                <View style={styles.itemView}>
                                    <Text style={styles.contentText}>
                                        {this.state.sex}
                                    </Text>
                                    {
                                        this.state.isEditStatus &&
                                        <Image
                                            resizeMode='contain'
                                            source={app.img.common_go}
                                            style={styles.goIcon} />
                                    }
                                </View>
                            </View>
                        </TouchableOpacity>
                        <Text style={styles.lowSeprator} />
                        <TouchableOpacity
                            activeOpacity={!this.state.isEditStatus ? 1 : DEFAULT_OPACITY}
                            onPress={this.state.isEditStatus ? this.editPosition : null}>
                            <View style={styles.itemBgStyle}>
                                <Text style={styles.headText}>职业</Text>
                                <View style={styles.itemView}>
                                    <Text style={styles.contentText}>
                                        {this.state.trade ? this.state.trade : '请选择您的当前职业'}
                                    </Text>
                                    {
                                        this.state.isEditStatus &&
                                        <Image
                                            resizeMode='contain'
                                            source={app.img.common_go}
                                            style={styles.goIcon} />
                                    }
                                </View>
                            </View>
                        </TouchableOpacity>
                        <Text style={styles.lowSeprator} />
                        <View style={styles.itemBgStyle} >
                            <Text style={styles.headText}>公司</Text>
                            { !this.state.isEditStatus ?
                                <Text style={styles.contentText}>{this.state.company ? this.state.company : '请填写您的公司'}</Text>
                                :
                                <TextInput
                                    onChangeText={(text) => this.setState({ company: text })}
                                    onFocus={this.onTextInputFocus}
                                    underlineColorAndroid={'transparent'}
                                    defaultValue={this.state.company}
                                    placeholder={'请输入您的公司'}
                                    placeholderTextColor={'#BABABA'}
                                    style={styles.text_input} />
                            }
                        </View>
                        <Text style={styles.lowSeprator} />
                        <View style={styles.itemBgStyle} >
                            <Text style={styles.headText}>职位</Text>
                            { !this.state.isEditStatus ?
                                <Text style={styles.contentText}>{this.state.post ? this.state.post : '请填写您的职位'}</Text>
                                :
                                <TextInput
                                    onChangeText={(text) => this.setState({ post: text })}
                                    onFocus={this.onTextInputFocus}
                                    underlineColorAndroid={'transparent'}
                                    defaultValue={this.state.post}
                                    placeholder={'请输入您的职位'}
                                    placeholderTextColor={'#BABABA'}
                                    style={styles.text_input} />
                            }
                        </View>
                        <Text style={styles.lowSeprator} />
                        <TouchableOpacity
                            activeOpacity={!this.state.isEditStatus ? 1 : DEFAULT_OPACITY}
                            onPress={this.state.isEditStatus ? this._onPressHandle.bind(this, 'city') : null}>
                            <View style={styles.itemBgStyle}>
                                <Text style={styles.headText}>所在城市</Text>
                                <View style={styles.itemView}>
                                    <Text numberOfLines={1} style={styles.contentText}>
                                        {this.state.city ? this.formatCity(this.state.city) : '请选择您所在城市'}
                                    </Text>
                                    {
                                        this.state.isEditStatus &&
                                        <Image
                                            resizeMode='contain'
                                            source={app.img.common_go}
                                            style={styles.goIcon} />
                                    }
                                </View>
                            </View>
                        </TouchableOpacity>
                        <Text style={styles.lowSeprator} />
                        <TouchableOpacity
                            activeOpacity={!this.state.isEditStatus ? 1 : DEFAULT_OPACITY}
                            onPress={this.state.isEditStatus ? this._onPressHandle.bind(this, 'age') : null}>
                            <View style={styles.itemBgStyle}>
                                <Text style={styles.headText}>生日</Text>
                                <View style={styles.itemView}>
                                    <Text style={styles.contentText}>
                                        {this.state.ageText.length !== 0 ? this.formatDate(this.state.ageText) : '请选择您的生日'}
                                    </Text>
                                    {
                                        this.state.isEditStatus &&
                                        <Image
                                            resizeMode='contain'
                                            source={app.img.common_go}
                                            style={styles.goIcon} />
                                    }
                                </View>
                            </View>
                        </TouchableOpacity>
                        <Text style={styles.lowSeprator} />
                    </View>
                </ScrollView>
                <ActionSheet
                    visible={this.state.actionSheetVisible}
                    cancelText='取  消'
                    onCancel={this.doCloseActionSheet} >
                    <ActionSheet.Button onPress={this.takePicture}>拍    照</ActionSheet.Button>
                    <ActionSheet.Button onPress={this.selectPicture}>从相册选择照片</ActionSheet.Button>
                </ActionSheet>
                {
                    this.state.showSuccessToast &&
                    <View style={styles.successToastContainer}>
                        <Text style={styles.successToastText}>修改成功</Text>
                    </View>
                }
            </View>
        );
    },
});

const styles = StyleSheet.create({
    containerStyle: {
        height: sr.h - 55,
        width: sr.w,
        flexDirection: 'column',
        backgroundColor: '#F0EFF5',
    },
    lowSeprator: {
        width: sr.w,
        height: 1,
        backgroundColor: '#F7F7F7',
    },
    headStyle: {
        width: sr.w,
        height: 45,
        marginTop: 5,
        flexDirection: 'row',
        backgroundColor: 'white',
    },
    headText: {
        width: 74,
        fontSize: 16,
        marginLeft: 33,
        fontFamily: 'STHeitiSC-Medium',
        color: '#747474',
        alignSelf : 'center',
    },
    contentText: {
        fontSize: 16,
        marginLeft: 20,
        width: 217,
        fontFamily: 'STHeitiSC-Medium',
        color: '#BABABA',
        alignSelf : 'center',
    },
    headIcon: {
        height: 40,
        width: 40,
        borderRadius: 20,
        marginLeft: 20,
        alignSelf : 'center',
    },
    text_input: {
        height: 40,
        width: 233,
        fontSize: 16,
        fontFamily: 'STHeitiSC-Medium',
        marginLeft: 20,
        paddingLeft: 0,
        color: '#BABABA',
        alignSelf: 'center',
    },
    itemBgStyle: {
        width: sr.w,
        height: 45,
        flexDirection: 'row',
        backgroundColor: 'white',
    },
    itemView: {
        height: 40,
        width: 253,
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    goIcon: {
        width: 16,
        height: 16,
        backgroundColor: 'white',
    },
    successToastContainer: {
        position: 'absolute',
        bottom: 30,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        width: sr.w,
    },
    successToastText: {
        backgroundColor: '#616161',
        color: 'white',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
});
