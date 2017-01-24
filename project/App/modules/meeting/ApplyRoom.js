'use strict';

var React = require('react');var ReactNative = require('react-native');
var {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    ScrollView,
} = ReactNative;

import Picker from 'react-native-picker';
var moment = require('moment');
var {Button, MessageBox} = COMPONENTS;

var InputItem = React.createClass({
    render() {
        var {keyboardType, ...other} = this.props;
        return (
            <View style={styles.inputContainer}>
                <TextInput
                    {...other}
                    keyboardType={keyboardType||'default'}
                    style={styles.text_input}
                    />
            </View>
        )
    }
});

module.exports = React.createClass({
    statics: {
        title: '创建房间',
    },
    getInitialState() {
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
    showDataPicker(index) {
        var date = index===0?this.state.startTime:this.state.endTime;
        var now = moment();
        if (date.isBefore(now)) {
            date = now;
        }
        if (!this.picker.isPickerShow()) {
            this.pickerType = index===0?'startDate':'endDate';
            this.setState({
                defaultSelectValue: [date.year()+'年', (date.month()+1)+'月', date.date()+'日'],
                pickerData: app.utils.createDateData(now),
            });
            this.picker.show();
        } else {
            this.picker.hide();
        }
    },
    showTimePicker(index) {
        var time = index===0?this.state.startTime:this.state.endTime;
        var now = moment();
        if (time.isBefore(now)) {
            time = now;
        }
        if (!this.picker.isPickerShow()) {
            this.pickerType = index===0?'startTime':'endTime';
            let now = new moment();
            let ih = now.hour(), it = now.minute();
            let hour = time.hour(), minute = time.minute();
            if (this.isToday) {
                hour = (ih > hour) ? ih : hour;
                minute = (it > minute) ? it : minute;
            }
            this.setState({
                defaultSelectValue: [hour+'时', minute+'分'],
                pickerData: this.createTimeData(now),
            });
            this.picker.show();
        } else {
            this.picker.hide();
        }
    },
    createTimeData(now) {
        let time = {};
        let ih = now.hour(), it = now.minute();
        let iih = this.isToday ? ih : 0;
        for(let h = iih; h < 24; h++) {
            let minute = [];
            let iit = (this.isToday && h==ih) ? it : 0;
            for(let t = iit; t < 60; t++) {
                minute.push(t+'分');
            }
            time[h+'时'] = minute;
        }
        return time;
    },
    getDateText(date) {
        return moment(date).format('YYYY年MM月DD日');
    },
    getTimeText(date) {
        return moment(date).format('HH时mm分');
    },
    setChooseValue(value) {
        var type = this.pickerType;
        if (type === 'startDate') {
            var date = moment(value, 'YYYY年MM月DD日');
            this.isToday = date.isSame(moment().startOf('day'));
            if (this.isToday) {
                var now = new moment();
                let ih = now.hour(), it = now.minute();
                date.add(ih, 'hour').add(it, 'minute');
            }
            var endTime = this.state.endTime;
            if (endTime.isBefore(date)) {
                endTime = date;
            }
            this.setState({startTime: date, endTime:endTime});
        } else if (type === 'endDate') {
            var date = moment(value, 'YYYY年MM月DD日');
            this.isToday = date.isSame(moment().startOf('day'));
            if (this.isToday) {
                var now = new moment();
                let ih = now.hour(), it = now.minute();
                date.add(ih, 'hour').add(it, 'minute');
            }
            var startTime = this.state.startTime;
            if (startTime.isAfter(date)) {
                startTime = date;
            }
            this.setState({startTime: startTime, endTime:date});
        } else if (type === 'startTime') {
            var time = moment(value, 'HH时mm分');
            var startTime = this.state.startTime;
            var date = moment(startTime.year()+'年'+(startTime.month()+1)+'月'+
                startTime.date()+'日'+time.hour()+'时'+time.minute()+'分', 'YYYY年MM月DD日HH时mm分');
            var endTime = this.state.endTime;
            if (endTime.isBefore(date)) {
                endTime = date;
            }
            this.setState({startTime: date, endTime:endTime});
        } else if (type === 'endTime') {
            var time = moment(value, 'HH时mm分');
            var endTime = this.state.endTime;
            var date = moment(endTime.year()+'年'+(endTime.month()+1)+'月'+
                endTime.date()+'日'+time.hour()+'时'+time.minute()+'分', 'YYYY年MM月DD日HH时mm分');
            var startTime = this.state.startTime;
            if (startTime.isAfter(date)) {
                startTime = date;
            }
            this.setState({startTime: startTime, endTime:date});
        }
    },
    getStringlen(s) {
        var l = 0;
        var a = s.split("");
        for (var i=0;i<a.length;i++) {
            if (a[i].charCodeAt(0)<299) {
                l++;
            } else {
                l+=2;
            }
        }
        return l;
    },
    applyRoom() {
        var {
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
            Toast('房间名称长度大于16--'+this.getStringlen(theme));
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

        var param = {
            theme,
            company,
            position,
            startTime: startTime.format('YYYY-MM-DD HH:mm:ss'),
            userID:app.personal.info.userID
        };
        POST(app.route.ROUTE_APPLY_ROOM, param, this.applyRoomSuccess, true);
    },
    applyRoomSuccess(data) {
        if (data.success) {
            this.setState({overlayShow: true});
        } else {
            Toast(data.msg);
        }
    },
    doConfirm() {
        this.setState({overlayShow: false});
        this.props.refresh();
        app.navigator.pop();
    },
    render() {
        return (
            <View style={{flex:1}}>
                <ScrollView style={styles.container}>
                    <InputItem
                        placeholder='请输入房间名称(16字以内)'
                        onChangeText={(text) => this.setState({theme: text})}
                        defaultValue={this.state.theme}
                        />
                    <InputItem
                        placeholder='请输入公司名称'
                        onChangeText={(text) => this.setState({company: text})}
                        defaultValue={this.state.company}
                        />
                    <InputItem
                        placeholder='请输入公司职位'
                        onChangeText={(text) => this.setState({position: text})}
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
                            style={[styles.timeTextContainer, {marginLeft: 10}]}
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
                <View style={{position:'absolute', bottom: 0, left: 0,}}>
                    <Picker
                        style={{height: sr.th/3,}}
                        ref={picker => this.picker = picker}
                        showDuration={500}
                        showMask={false}
                        pickerBtnText={'确  定'}
                        pickerCancelBtnText={'取  消'}
                        selectedValue={this.state.defaultSelectValue}
                        pickerData={this.state.pickerData}
                        onPickerDone={(value) => this.setChooseValue(value)}
                        />
                </View>
                {
                    this.state.overlayShow &&
                    <MessageBox
                        content={"创建房间成功"}
                        doConfirm={this.doConfirm}
                        />
                }
            </View>
        );
    }
});


var styles = StyleSheet.create({
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
