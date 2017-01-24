'use strict';

var React = require('react');var ReactNative = require('react-native');
var {
    StyleSheet,
    View,
    ListView,
    Animated,
    Navigator,
    Text,
    Image,
} = ReactNative;

var {Button} = COMPONENTS;

module.exports = React.createClass({
    getInitialState() {
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return {
            lineHeight: 0,
            dataSource: this.ds.cloneWithRows(this.props.logisticsList),
            opacity: new Animated.Value(0)
        };
    },
    componentDidMount() {
        Animated.timing(this.state.opacity, {
                toValue: 1,
                duration: 500,
            }
        ).start();
    },
    closeModal() {
        Animated.timing(this.state.opacity, {
                toValue: 0,
                duration: 500,
            }
        ).start(()=>{
            app.closeModal();
        });
    },
    render() {
        return (
            <Animated.View style={[styles.overlayContainer, {opacity: this.state.opacity}]}>
                <View style={styles.container}>
                    <ListView                        initialListSize={1}
                        enableEmptySections={true}
                        style={styles.list}
                        dataSource={this.state.dataSource}
                        renderRow={this.renderRow}
                    />
                  <Button onPress={this.closeModal} style={styles.contentButton}>确{'  '}定</Button>
                </View>
            </Animated.View>
        );
    },
    _measureLineHeight(e) {
        if (!this.state.lineHeight) {
            this.setState({lineHeight: e.nativeEvent.layout.height + 40});
        }
    },
    renderRow(obj) {
        var strContent = obj.status;
        return(
            <View style={styles.rowViewStyle}>
                <View style={styles.columnViewStyle}>
                  <Image
                      resizeMode='cover'
                      source={app.img.task_point_1}
                      style={styles.pointStyle} />
                  <Image
                      resizeMode='stretch'
                      source={app.img.task_axis_1}
                      style={{alignSelf: 'center', width: 8, height: this.state.lineHeight}} />
                </View>
                <View style={styles.columnFlexViewStyle}>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={styles.leftTime}>{obj.time}</Text>
                    </View>
                    <View onLayout={this._measureLineHeight} style={styles.detailsListVeiw}>
                        <Text style={styles.detailsTextContent}>{strContent}</Text>
                    </View>
                </View>
            </View>
        )
    },
});

var styles = StyleSheet.create({
    container: {
        width:sr.w*10/11,
        height:sr.h*6/7,
        top: sr.totalNavHeight,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'white',
        borderRadius:10,
        position: 'absolute',
        left: sr.w*1/20,
    },
    list: {
        marginTop: 5,
        width:sr.w*10/11,
        height:sr.h*6/7-50,
    },
    contentButton: {
        width:sr.w*10/11,
        height:50,
        borderRadius:3,
        backgroundColor:'#54C1E7',
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
    right_Container: {
      marginLeft: 10,
    },
    pointStyle: {
      width: 28,
      height: 27,
    },
    rowViewStyle: {
      marginLeft: 10,
      flexDirection: 'row',
    },
    columnViewStyle: {
      flexDirection: 'column',
    },
    columnFlexViewStyle: {
      flexDirection: 'column',
      flex: 1,
    },
    leftTime: {
      fontSize: 17,
      marginLeft: 5,
      marginTop: 2,
      color: '#239fdb',
      alignSelf: 'flex-start',
    },
    detailsListVeiw: {
      flexDirection: 'column',
      marginTop: 10,
      marginBottom: 10,
      marginRight: 25,
    },
    detailsTextContent: {
      color: '#000000',
      marginLeft: 15,
      marginTop: 5,
      marginBottom: 20,
    },
});
