'use strict';

var React = require('react');var ReactNative = require('react-native');
var {
    Image,
    View,
} = ReactNative;

import Picker from 'react-native-picker';
var moment = require('moment');

module.exports = React.createClass({
    componentWillMount() {
        var date = this.props.queryTime||moment();
        this.dateData = this.createDateData();
        this.defaultSelectValue =[date.year()+'年', (date.month()+1)+'月', date.date()+'日'];
    },
    componentDidMount() {
        this.picker.show();
    },
    componentWillUnmount() {
        this.picker.hide();
    },
    createDateData() {
        let date = {};
        let now = moment();
        let iy = now.year(), im = now.month()+1, id = now.date();
        for(let y = iy-3; y <= iy; y++) {
            let month = {};
            let mm = [0, 31, (!(y%4)&(!!(y%100)))|(!(y%400))?29:28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            let iim = (y==iy) ? im : 12;
            for(let m = 1; m <= iim; m++) {
                let day = [];
                let iid = (y==iy && m==im) ? id : mm[m];
                for(let d = 1; d <= iid; d++) {
                    day.push(d+'日');
                }
                month[m+'月'] = day;
            }
            date[y+'年'] = month;
        }
        return date;
    },
    setChooseValue(value) {
        this.props.onSetDate(moment(value, 'YYYY年MM月DD日'));
        app.closeModal();
    },
    render() {
        return (
            <View style={{position:'absolute', bottom: 0, left: 0,}}>
                <Picker
                    style={{height: sr.th/3,}}
                    ref={picker => this.picker = picker}
                    showDuration={500}
                    showMask={false}
                    pickerBtnText={'确  定'}
                    pickerCancelBtnText={'取  消'}
                    selectedValue={this.defaultSelectValue}
                    pickerData={this.dateData}
                    onPickerDone={(value) => this.setChooseValue(value)}
                    onPickerCancel={() =>app.closeModal()}
                    />
            </View>
        )
    }
});
