'use strict';

var React = require('react');var ReactNative = require('react-native');
var {
    StyleSheet,
    Text,
    Animated,
    View,
    Picker,
} = ReactNative;


var TimerMixin = require('react-timer-mixin');
import PickerAndroid from 'react-native-picker-android';
if (app.isandroid) {
    Picker = PickerAndroid;
}
var {Button} = COMPONENTS;
var {ScoreSelect} = COMPONENTS;

module.exports = React.createClass({
    mixins: [TimerMixin],
    doConfirm() {
        if (this.timeoutID != null) {
            this.clearTimeout(this.timeoutID);
            this.timeoutID = null;
        }
        Animated.timing(this.state.opacity, {
            toValue: 0,
            duration: 500,
        }).start(()=>{
            var garde = this.state.gradeScore + 6;
            this.props.doConfirm(garde.toString());
        });
    },
    getInitialState() {
        return {
            opacity: new Animated.Value(0),
            gradeScore: 0,
        };
    },
    componentDidMount() {
        Animated.timing(this.state.opacity, {
            toValue: 1,
            duration: 500,
        }).start();
        this.timeoutID = this.setTimeout(()=>{
            this.doConfirm();
        }, 10000);
    },
    afterChange(gradeScore) {
        this.setState({gradeScore});
    },
    render() {
        var competitor = this.props.competitor;
        const {gradeScore} = this.state;
        return (
            <Animated.View style={[styles.overlayContainer, {opacity: this.state.opacity}]}>
                <View style={styles.container}>
                    <View style={styles.drawHeaderImage}>
                        <Text style={styles.title}>本次演讲结束</Text>
                        <Text style={styles.drawContent}>
                            {'请给 '+competitor.userInfo.userName+' 本次的演讲打个分吧～'}
                        </Text>
                    </View>
                    <View style={styles.drawButtonView}>
                        <ScoreSelect
                            width={sr.tw/3}
                            height={sr.ws(100)}
                            afterChange={this.afterChange}
                            >
                            {
                                [6, 7, 8, 9, 10].map((n, i)=>{
                                    return (
                                        <View style={styles.itemContainer} key={i}>
                                            <View style={gradeScore==i?styles.selectedScoreContainer:styles.scoreContainer}>
                                                <Text style={gradeScore==i?styles.selectedScore:styles.score}>{n}</Text>
                                            </View>
                                        </View>
                                    )
                                })
                            }
                        </ScoreSelect>
                    </View>
                    <Button
                        onPress={this.doConfirm}
                        style={styles.drawButton}>确定</Button>
                </View>
            </Animated.View>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: 'white',
        width:sr.w*5/6,
    },
    drawHeaderImage: {
        width:sr.w*5/6,
        backgroundColor:'white',
        alignItems:'center',
        justifyContent:'center',
    },
    drawButtonView: {
        width:sr.w*5/6,
        height: 110,
        marginVertical: 50,
        backgroundColor: 'white',
    },
    drawButton: {
        width:sr.w*5/6,
        height:50,
        borderRadius: 0,
        marginHorizontal:4
    },
    title: {
        marginTop:30,
        color: 'black',
        fontSize: 24,
        overflow: 'hidden',
    },
    drawContent: {
        flex:1,
        marginVertical:15,
        color: 'black',
        fontSize: 14,
        textAlign:'center',
        fontWeight: '100',
        overflow: 'hidden',
    },
    tipContent: {
        flex:1,
        color: 'black',
        backgroundColor:'white',
        fontSize: 18,
        textAlign:'center',
        fontWeight: '100',
        overflow: 'hidden',
    },
    overlayContainer: {
        position:'absolute',
        bottom: 0,
        alignItems:'center',
        justifyContent: 'center',
        width:sr.w,
        height:sr.h,
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
    },
    itemContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scoreContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedScoreContainer: {
        width: 80,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#A62045',
        borderWidth: 2,
        borderRadius: 80,
    },
    score: {
        fontSize: 30,
        color: '#A62045',
    },
    selectedScore: {
        fontSize: 40,
        color: 'black',
    },
});
