const moment = require('moment');

module.exports = {
    until (test, iterator, callback) {
        if (!test()) {
            iterator((err) => {
                if (err) {
                    return callback(err);
                }
                this.until(test, iterator, callback);
            });
        } else {
            callback();
        }
    },
    chineseWeekDay (day) {
        return ['日', '一', '二', '三', '四', '五', '六'][day];
    },
    chineseNumber (n) {
        return ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'][n - 1] || n;
    },
    numberFormat (n) {
        return (n < 10 ? '0' : '') + n;
    },
    timeFormat (hour, minute, second) {
        if (second === undefined) { second = minute; minute = hour; hour = undefined; }
        return (hour === undefined ? '' : (hour < 10 ? '0' : '') + hour + ':') + (minute < 10 ? '0' : '') + minute + ':' + (second < 10 ? '0' : '') + second;
    },
    createDateData (now) {
        const date = [];
        const iy = now.year(), im = now.month() + 1, id = now.date();
        for (let y = iy; y <= iy + 1; y++) {
            let month = [];
            for(let j = 1;j<13;j++){
                let day = [];
                if(j === 2){
                    let leapMonth = (!(y % 4) & (!!(y % 100))) | (!(y % 400)) ? 29 : 28;
                    for(let k=1;k<=leapMonth;k++){
                        day.push(k+'日');
                    }
                }
                else if(j in {1:1, 3:1, 5:1, 7:1, 8:1, 10:1, 12:1}){
                    for(let k=1;k<32;k++){
                        day.push(k+'日');
                    }
                }
                else{
                    for(let k=1;k<31;k++){
                        day.push(k+'日');
                    }
                }
                let _month = {};
                _month[j+'月'] = day;
                month.push(_month);
            }
            let _date = {};
            _date[y+'年'] = month;
            date.push(_date);
        }
        return date;
    },
    // 获取生日
    createBirthdayData (now) {
        const date = {};
        const iy = now.year(), im = now.month() + 1, id = now.date();
        for (let y = 1916; y <= iy; y++) {
            const month = {};
            const mm = [0, 31, (!(y % 4) & (!!(y % 100))) | (!(y % 400)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            const iim = (y == iy) ? im : 12;
            for (let m = 1; m <= iim; m++) {
                const day = [];
                const iid = (y == iy && m == im) ? id : mm[m];
                for (let d = 1; d <= iid; d++) {
                    day.push(d + '日');
                }
                month[m + '月'] = day;
            }
            date[y + '年'] = month;
        }
        return date;
    },
    createDateDataPicker(now){
        let date = [];
        const iy = now.year(), im = now.month() + 1, id = now.date();
        for(let i=1916;i<=iy;i++){
            let month = [];
            for(let j = 1;j<13;j++){
                let day = [];
                if(j === 2){
                    let leapMonth = (!(i % 4) & (!!(i % 100))) | (!(i % 400)) ? 29 : 28;
                    for(let k=1;k<=leapMonth;k++){
                        day.push(k+'日');
                    }
                }
                else if(j in {1:1, 3:1, 5:1, 7:1, 8:1, 10:1, 12:1}){
                    for(let k=1;k<32;k++){
                        day.push(k+'日');
                    }
                }
                else{
                    for(let k=1;k<31;k++){
                        day.push(k+'日');
                    }
                }
                let _month = {};
                _month[j+'月'] = day;
                month.push(_month);
            }
            let _date = {};
            _date[i+'年'] = month;
            date.push(_date);
        }
        return date;
    },
    getVisibleText (text, n) {
        let realLength = 0, len = text.length, preLen = -1, charCode = -1, needCut = false;
        for (let i = 0; i < len; i++) {
            charCode = text.charCodeAt(i);
            if (charCode >= 0 && charCode <= 128) {
                realLength += 1;
            } else {
                realLength += 2;
            }
            if (preLen === -1 && realLength >= n) {
                preLen = i + 1;
            } else if (realLength > n + 2) {
                needCut = true;
                break;
            }
        }
        if (needCut) {
            text = text.substr(0, preLen) + '..';
        }
        return text;
    },
    cutLimitText (text, n) {
        let realLength = 0, len = text.length, preLen = -1, charCode = -1, needCut = false;
        for (let i = 0; i < len; i++) {
            charCode = text.charCodeAt(i);
            if (charCode >= 0 && charCode <= 128) {
                realLength += 1;
            } else {
                realLength += 2;
            }
            if (preLen === -1 && realLength >= n) {
                preLen = i + 1;
            } else if (realLength > n) {
                needCut = true;
                break;
            }
        }
        if (needCut) {
            text = text.substr(0, preLen);
        }
        return text;
    },
    getCurrentDateString () {
        return moment().format('YYYY年MM月DD日');
    },
    getCurrentTimeString () {
        return moment().format('YYYY-MM-DD HH:mm:ss');
    },
    getJetlagString (str) {
        const now = moment();
        const time = moment(str);
        let sec = now.diff(time, 'seconds');
        let ret;
        if (sec < 3600 * 24) {
            let min = Math.floor(sec / 60);
            sec -= min * 60;
            const hour = Math.floor(min / 60);
            min -= hour * 60;
            ret = ((hour ? hour + '小时' : '') + (min ? min + '分钟前' : '')) || '刚刚';
        } else {
            ret = time.format('YYYY-MM-DD HH:mm:ss');
        }
        return ret;
    },
    getCustomTimeDisplayString (str) {
        const now = moment();
        const time = moment(str);
        const hours = now.diff(time, 'hours');
        const mut = now.diff(time, 'minutes');
        const sec = now.diff(time, 'seconds');
        console.log(hours, mut, sec);
        if (hours >= 0 && hours < 6) {
            if (hours == 0) {
                return mut == 0 ? '刚刚' : (mut + '分钟前');
            } else {
                return (hours + '小时前');
            }
        } else if (hours >= 6 && hours < 24) {
            const hs = time.hours();
            if (hs >= 0 && hs < 12) {
                return ('上午' + time.format('hh:mm'));
            } else {
                return ('下午' + time.format('hh:mm'));
            }
        } else if (hours > 24 && hours < 48) {
            return ('昨天' + time.format('hh:mm'));
        } else {
            return (time.format('DD日hh:mm'));
        }
    },
    getStrlen (str) {
        let len = 0;
        for (let i = 0; i < str.length; i++) {
            const c = str.charCodeAt(i);
            // 单字节加1
            if ((c >= 0x0001 && c <= 0x007e) || (c >= 0xff60 && c <= 0xff9f)) {
                len++;
            } else {
                len += 2;
            }
        }
        return len;
    },
    checkPhone (phone) {
        return /^1\d{10}$/.test(phone);
    },
    checkPassword (pwd) {
        return /^[\d\w_]{6,20}$/.test(pwd);
    },
    checkVerificationCode (code) {
        return /^\d{6}$/.test(code);
    },
    checkNumberCode (code) {
        return /^(0|[1-9][0-9]{0,9})(\.[0-9]{1,2})?$/.test(code);
    },
    checkBankCardCode (code) {
        return /^(\d{16}|\d{19})$/.test(code);
    },
    checkEmailCode (code) {
        const re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
        if (re.test(code)) {
            return true;
        } else {
            return false;
        }
    },
};
