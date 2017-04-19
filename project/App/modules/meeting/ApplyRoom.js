'use strict';

const React = require('react');const ReactNative = require('react-native');
const {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    ScrollView,
} = ReactNative;

const moment = require('moment');
const { Button, MessageBox, Picker } = COMPONENTS;

const InputItem = React.createClass({
    render () {
        const { keyboardType, ...other } = this.props;
        return (
            <View style={styles.inputContainer}>
                <TextInput
                    {...other}
                    underlineColorAndroid='transparent'
                    keyboardType={keyboardType || 'default'}
                    style={styles.text_input}
                    />
            </View>
        );
    },
});

module.exports = React.createClass({
    statics: {
        title: '创建房间',
    },
    getInitialState () {
        this.isToday = true;
        return {
            theme: '',
            company: '',
            totalNumber: 30,
            position: '',
            password: '',
            startTime: moment(),
            endTime: moment().add(3, 'hour'),
            overlayShow: false,
            pickerData: [''],
            defaultSelectValue: '',
        };
    },
    onWillHide() {
        Picker.hide();
    },
    showDataPicker (index) {
        let date = index === 0 ? this.state.startTime : this.state.endTime;
        const now = moment();
        if (date.isBefore(now)) {
            date = now;
        }
        this.pickerType = index === 0 ? 'startDate' : 'endDate';
        let pickerData = app.utils.createDateData(now);
        let defaultSelectValue = [date.year() + '年', (date.month() + 1) + '月', date.date() + '日'];
        Picker(pickerData, defaultSelectValue, '').then((value)=>{
            this.setChooseValue(value);
        });
    },
    showTimePicker (index) {
        let time = index === 0 ? this.state.startTime : this.state.endTime;
        const now = moment();
        if (time.isBefore(now)) {
            time = now;
        }
        this.pickerType = index === 0 ? 'startTime' : 'endTime';
        let _now = new moment();
        const ih = _now.hour(), it = _now.minute();
        let hour = time.hour(), minute = time.minute();
        if (this.isToday) {
            hour = (ih > hour) ? ih : hour;
            minute = (it > minute) ? it : minute;
        }
        let pickerData = this.createTimeData(_now);
        let defaultSelectValue = [hour + '时', minute + '分'];
        Picker(pickerData, defaultSelectValue, '').then((value)=>{
            this.setChooseValue(value);
        });
    },
    createTimeData (now) {
        const time = []
        const ih = now.hour(), it = now.minute();
        const iih = this.isToday ? ih : 0;
        for (let h = iih; h < 24; h++) {
            const minute = [];
            const iit = (this.isToday && h == ih) ? it : 0;
            for (let t = iit; t < 60; t++) {
                minute.push(t + '分');
            }
            let _time = {};
            _time[h + '时'] = minute;
            time.push(_time);
        }
        return time;
    },
    getDateText (date) {
        return moment(date).format('YYYY年MM月DD日');
    },
    getTimeText (date) {
        return moment(date).format('HH时mm分');
    },
    setChooseValue (value) {
        const type = this.pickerType;
        if (type === 'startDate') {
            const date = moment(value, 'YYYY年MM月DD日');
            this.isToday = date.isSame(moment().startOf('day'));
            if (this.isToday) {
                const now = new moment();
                const ih = now.hour(), it = now.minute();
                date.add(ih, 'hour').add(it, 'minute');
            }
            let endTime = this.state.endTime;
            if (endTime.isBefore(date)) {
                endTime = date;
            }
            this.setState({ startTime: date, endTime:endTime });
        } else if (type === 'endDate') {
            const date = moment(value, 'YYYY年MM月DD日');
            this.isToday = date.isSame(moment().startOf('day'));
            if (this.isToday) {
                const now = new moment();
                const ih = now.hour(), it = now.minute();
                date.add(ih, 'hour').add(it, 'minute');
            }
            let startTime = this.state.startTime;
            if (startTime.isAfter(date)) {
                startTime = date;
            }
            this.setState({ startTime: startTime, endTime:date });
        } else if (type === 'startTime') {
            const time = moment(value, 'HH时mm分');
            const startTime = this.state.startTime;
            const date = moment(startTime.year() + '年' + (startTime.month() + 1) + '月' +
                startTime.date() + '日' + time.hour() + '时' + time.minute() + '分', 'YYYY年MM月DD日HH时mm分');
            let endTime = this.state.endTime;
            if (endTime.isBefore(date)) {
                endTime = date;
            }
            this.setState({ startTime: date, endTime:endTime });
        } else if (type === 'endTime') {
            const time = moment(value, 'HH时mm分');
            const endTime = this.state.endTime;
            const date = moment(endTime.year() + '年' + (endTime.month() + 1) + '月' +
                endTime.date() + '日' + time.hour() + '时' + time.minute() + '分', 'YYYY年MM月DD日HH时mm分');
            let startTime = this.state.startTime;
            if (startTime.isAfter(date)) {
                startTime = date;
            }
            this.setState({ startTime: startTime, endTime:date });
        }
    },
    getStringlen (s) {
        let l = 0;
        const a = s.split('');
        for (let i = 0; i < a.length; i++) {
            if (a[i].charCodeAt(0) < 299) {
                l++;
            } else {
                l += 2;
            }
        }
        return l;
    },
    applyRoom () {
        let {
            theme,
            company,
            position,
            password,
            startTime,
            endTime,
        } = this.state;

        theme = theme.trim();
        if (!theme) {
            Toast('房间名称不能为空');
            return;
        }
        if (this.getStringlen(theme) > 32) {
            Toast('房间名称长度大于16--' + this.getStringlen(theme));
            return;
        }
        company = company.trim();
        if (!company) {
            Toast('公司不能为空');
            return;
        }
        position = position.trim();
        if (!position) {
            Toast('职位不能为空');
            return;
        }

        const param = {
            theme,
            company,
            position,
            startTime: startTime.format('YYYY-MM-DD HH:mm:ss'),
            userID:app.personal.info.userID,
        };
        POST(app.route.ROUTE_APPLY_ROOM, param, this.applyRoomSuccess, true);
    },
    applyRoomSuccess (data) {
        if (data.success) {
            this.setState({ overlayShow: true });
        } else {
            Toast(data.msg);
        }
    },
    doConfirm () {
        this.setState({ overlayShow: false });
        this.props.refresh();
        app.navigator.pop();
    },
    render () {
        return (
            <View style={{ flex:1 }}>
                <ScrollView style={styles.container}>
                    <InputItem
                        placeholder='请输入房间名称(16字以内)'
                        onChangeText={(text) => this.setState({ theme: text })}
                        defaultValue={this.state.theme}
                        />
                    <InputItem
                        placeholder='请输入公司名称'
                        onChangeText={(text) => this.setState({ company: text })}
                        defaultValue={this.state.company}
                        />
                    <InputItem
                        placeholder='请输入公司职位'
                        onChangeText={(text) => this.setState({ position: text })}
                        defaultValue={this.state.position}
                        />
                    <View style={styles.timeContainer}>
                        <Text style={styles.plainText}>
                            房间使用开始时间:{'  '}
                        </Text>
                        <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={this.showDataPicker.bind(null, 0)}
                            style={styles.timeTextContainer}
                            >
                            <Text style={styles.timeText}>
                                {this.getDateText(this.state.startTime)}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={this.showTimePicker.bind(null, 0)}
                            style={[styles.timeTextContainer, { marginLeft: 10 }]}
                            >
                            <Text style={styles.timeText}>
                                {this.getTimeText(this.state.startTime)}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.btnContainer}>
                        <Button
                            style={styles.btn}
                            textStyle={styles.btnText}
                            onPress={this.applyRoom}>
                            创  建
                        </Button>
                    </View>
                </ScrollView>
                {
                    this.state.overlayShow &&
                    <MessageBox
                        content={'创建房间成功'}
                        doConfirm={this.doConfirm}
                        />
                }
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
    },
    inputContainer: {
        height: 45,
        marginTop: 2,
        borderColor: '#D7D7D7',
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        overflow: 'hidden',
        alignItems:'center',
    },
    text_input: {
        marginLeft: 10,
        height: 40,
        width: 320,
        paddingVertical: -5,
        fontSize:16,
        alignSelf: 'center',
        backgroundColor: '#FFFFFF',
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems:'center',
        marginTop: 30,
        marginHorizontal: 10,
    },
    timeTextContainer: {
        height: 40,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#D7D7D7',
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems:'center',
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    timeText: {
        fontSize: 14,
        backgroundColor: '#FFFFFF',
    },
    plainText: {
        fontSize: 14,
        color:'#8C8D8E',
    },
    btnContainer: {
        marginVertical: 30,
        height: 45,
    },
    btn: {
        marginTop: 10,
        height: 40,
        marginHorizontal: 10,
        borderRadius: 3,
    },
    btnText: {
        fontSize: 16,
        fontWeight: '400',
    },
});
