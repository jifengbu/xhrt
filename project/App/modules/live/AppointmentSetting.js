'use strict';

var React = require('react');var ReactNative = require('react-native');
var {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    TextInput,
} = ReactNative;

var moment = require('moment');
import Picker from 'react-native-picker';
var LiveLaunch = require('./LiveLaunch.js');

var {Button} = COMPONENTS;

module.exports = React.createClass({
    statics: {
        title: '预备直播',
    },
    getInitialState() {
        const {title, speaker, startTime} = app.setting.data.liveAppointment||{};
        return {
            title: title||'',
            speaker: speaker||app.personal.info.name||'',
            startTime: moment(startTime),
            pickerData: [''],
            defaultSelectValue: '',
        };
    },
    showDataPicker() {
        var date = this.state.startTime;
        var now = moment();
        if (date.isBefore(now)) {
            date = now;
        }
        if (!this.picker.isPickerShow()) {
            this.pickerType = 'startDate';
            this.setState({
                defaultSelectValue: [date.year()+'年', (date.month()+1)+'月', date.date()+'日'],
                pickerData: app.utils.createDateData(now),
            });
            this.picker.show();
        } else {
            this.picker.hide();
        }
    },
    showTimePicker() {
        var time = this.state.startTime;
        var now = moment();
        if (time.isBefore(now)) {
            time = now;
        }
        if (!this.picker.isPickerShow()) {
            this.pickerType = 'startTime';
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
            } else {
                var time = this.state.startTime;
                time && date.add(time.hour(), 'hour').add(time.minute(), 'minute');
            }
            this.setState({startTime: date});
        } else if (type === 'startTime') {
            var time = moment(value, 'HH时mm分');
            var startTime = this.state.startTime;
            var date = moment(startTime.year()+'年'+(startTime.month()+1)+'月'+
                startTime.date()+'日'+time.hour()+'时'+time.minute()+'分', 'YYYY年MM月DD日HH时mm分');
            this.setState({startTime: date});
        }
    },
    doUpdateAppointment() {
        const {title, speaker, startTime} = this.state;
        if (!title) {
            Toast('请输入标题');
            return;
        }
        if (!speaker) {
            Toast('请输入主讲人');
            return;
        }
        if (!startTime) {
            Toast('请设置直播时间');
            return;
        }
        var param = {
            userID: app.personal.info.userID,
            launchPersonName: speaker,
            liveStartTime: startTime.format('YYYY-MM-DD HH:mm:ss'),
            liveTitle: title,
        };
        POST(app.route.ROUTE_APPOINTMENT_LIVE, param, this.doUpdateAppointmentSuccess, true);
    },
    doUpdateAppointmentSuccess(data) {
        if (data.success) {
            const {title, speaker, startTime} = this.state;
            app.setting.setLiveAppointment({title, speaker, startTime: startTime.format('YYYY-MM-DD HH:mm:ss')});
        } else {
            Toast(data.msg);
        }
    },
    doStartLive() {
        var param = {
            userID:  app.personal.info.userID,
        };
        POST(app.route.ROUTE_LAUNCH_LIVE, param, this.doStartLiveSuccess, true);

    },
    doStartLiveSuccess(data) {
        if (data.success) {
            const {roomID, accessToken} = data.context;
            app.navigator.push({
                component: LiveLaunch,
                passProps: {
                    videoId: roomID,
                    accessToken: accessToken,
                }
            });
        } else {
            Toast("预约有效期已结束，请重新预约");
        }
    },
    render() {
        const {title, startTime, speaker} = this.state;
        return (
            <View style={styles.container}>
                <View style={styles.bannerContainer}>
                    <Image
                        resizeMode='stretch'
                        source={app.img.live_photo}
                        style={styles.bannerImage}
                        />
                </View>
                <View style={styles.inputPanel}>
                    <Text style={styles.label}>
                        填写预告信息
                    </Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            placeholder='请输入直播主题'
                            onChangeText={(text) => this.setState({title: text})}
                            defaultValue={title}
                            style={styles.text_input}
                            />
                    </View>
                    {
                        !startTime ?
                        <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={this.showDataPicker}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.contentText}>
                                    请输入直播时间
                                </Text>
                            </View>
                        </TouchableOpacity>
                        :
                        <View style={styles.inputContainer}>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                style={styles.touchContainer}
                                onPress={this.showDataPicker}>
                                <Text style={styles.contentText}>
                                    {this.getDateText(this.state.startTime)}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                style={styles.touchContainer}
                                onPress={this.showTimePicker}>
                                <Text style={styles.contentText}>
                                    {this.getTimeText(this.state.startTime)}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    }
                    <View style={styles.inputContainer}>
                        <TextInput
                            placeholder='请输入主讲人'
                            onChangeText={(text) => this.setState({speaker: text})}
                            defaultValue={speaker}
                            style={styles.text_input}
                            />
                    </View>
                    <Button onPress={this.doUpdateAppointment} style={[styles.button, {backgroundColor: '#70BD98',}]} textStyle={styles.btnText}>更新直播</Button>
                    <View style={styles.bottomContainer}>
                        <View style={styles.sepratorContainer}>
                            <View style={styles.sepratorLine}></View>
                            <Text style={styles.sepratorText} >{app.isandroid?'    ':''}或者您也可以立即直播</Text>
                        </View>
                        <Button onPress={this.doStartLive} style={styles.button} textStyle={styles.btnText}>立即直播</Button>
                    </View>
                </View>
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
            </View>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bannerContainer: {
        height: 200,
    },
    bannerImage: {
        width: sr.w,
        height: 200,
    },
    inputPanel: {
        flex: 1,
    },
    label: {
        fontSize: 13,
        marginLeft: 20,
        marginVertical: 6,
        color: 'gray',
    },
    inputContainer: {
        height: 50,
        marginTop: 2,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        overflow: 'hidden',
        alignItems:'center',
    },
    touchContainer: {
        justifyContent: 'center',
        height: 50,
    },
    text_input: {
        paddingLeft: 10,
        height: 40,
        width: 320,
        marginLeft:10,
        alignSelf: 'center',
        fontSize:16,
        backgroundColor: '#FFFFFF',
    },
    contentText: {
        fontSize: 16,
        marginHorizontal: 20,
        color: '#C7C7C7',
    },
    button: {
      height: 45,
      width: (sr.w-30),
      marginTop: 10,
      marginLeft: 15,
      borderRadius: 5,
    },
    btnText: {
        fontSize: 15,
        fontWeight: '600',
    },
    bottomContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    sepratorContainer: {
        height: 30,
        marginBottom: 10,
        alignItems:'center',
        justifyContent: 'center',
    },
    sepratorLine: {
        top: 10,
        height: 1,
        width: sr.w-20,
        backgroundColor: '#C9C9C9',
    },
    sepratorText: {
        backgroundColor:'#EEEEEE',
        color: '#A3A3A4',
        paddingHorizontal: 10,
        fontSize: 13,
        fontStyle: 'italic',
    },
});
