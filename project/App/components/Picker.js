'use strict';

import Picker from '@remobile/react-native-picker';

module.exports = (pickerData, selectedValue, title)=>
{
    return new Promise(async(resolve)=>{
        Picker.isPickerShow((show)=>{
            if (show) {
                Picker.hide();
            } else {
                Picker.init({
                    pickerConfirmBtnText: '完成',
                    pickerConfirmBtnColor: [50,50,50,50],
                    pickerCancelBtnText: '取消',
                    pickerCancelBtnColor: [50,50,50,50],
                    pickerTitleText: title||'',
                    pickerTitleColor: [255, 255, 255, 1],
                    pickerToolBarBg: [232, 232, 232, 1],
                    pickerBg: [207, 207, 207, 1],
                    pickerFontColor: [0, 0, 0, 1],
                    pickerToolBarFontSize: 16,
                    pickerFontSize: 16,
                    pickerData,
                    selectedValue,
                    onPickerConfirm: (value)=>{resolve(value)},
                });
                Picker.show();
            }
        });
    });
};
module.exports.hide = ()=>{
    Picker.isPickerShow((show)=>{
        Picker.hide();
    });
};
