'use strict';

var React = require('react');var ReactNative = require('react-native');
var {
    StyleSheet,
    View,
    Text,
    ListView,
    Image,
    TouchableHighlight,
    TouchableOpacity,
} = ReactNative;

var moment = require('moment');
var fs = require('react-native-fs');
var TrainSelfPlay = require('./TrainSelfPlay.js');
var {MessageBox} =  COMPONENTS;

module.exports = React.createClass({
    mixins: [SceneMixin],
    statics: {
        title: '历史记录',
        rightButton: {image: app.img.common_delete, handler: ()=>{app.scene.toggleDeletePanel()} },
    },
    getInitialState: function() {
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.list = app.audioFileMgr.list[this.props.trainingCode]||[];
        this.selects = [false];
        this.list.reverse() // 倒序排列
        return {
            dataSource: this.ds.cloneWithRows(this.list),
            showDeleteMessageBox: false,
            showDeletePanel: false,
        };
    },
    toggleDeletePanel() {
        var showDeletePanel = !this.state.showDeletePanel;
        this.setState({
            dataSource: this.ds.cloneWithRows(this.list),
            showDeletePanel: showDeletePanel,
        });
    },
    renderSeparator(sectionID, rowID) {
        return (
            <View
                style={styles.separator}
                key={rowID}/>
        );
    },
    selectDelete(sectionID, rowID) {
        this.selects[rowID] = !this.selects[rowID];
        this.setState({
            dataSource: this.ds.cloneWithRows(this.list),
        });
    },
    selectAll() {
        var flag = _.every(this.selects, (i)=>!!i);
        this.selects = this.list.map(()=>!flag),
        this.setState({
            dataSource: this.ds.cloneWithRows(this.list),
        });
    },
    doCancel() {
        this.setState({showDeleteMessageBox: false});
    },
    doDelete() {
        var flag = _.every(this.selects, (i)=>!i);
        if (flag) {
            Toast('请选择需要删除的记录');
        } else {
            this.setState({showDeleteMessageBox: true});
        }
    },
    doConfirmDelete() {
        var deleteList = _.filter(this.list, (o, i)=>this.selects[i]);
        this.list = _.reject(this.list, (o, i)=>this.selects[i]);
        app.audioFileMgr.list[this.props.trainingCode] = this.list;
        app.audioFileMgr.set(app.audioFileMgr.list);
        this.selects = [false];
        this.setState({
            dataSource: this.ds.cloneWithRows(this.list),
            showDeleteMessageBox: false,
        });
        _.forEach(deleteList, async(item)=> {
            fs.unlink(item.filepath);
        });
    },
    playRecord(obj, sectionID, rowID) {
        if (this.state.showDeletePanel) {
            this.selects[rowID] = !this.selects[rowID];
            this.setState({
                dataSource: this.ds.cloneWithRows(this.list),
            });
        } else {
            app.navigator.push({
                component: TrainSelfPlay,
                passProps: {filepath: obj.filepath}
            });
        }
    },
    renderFooter() {
          var status = null;
          if (this.list.length === 0) {
            status = '暂无数据';
          } else {
            status = '没有更多数据';
          }
          return (
              <View style={styles.listFooterContainer}>
                  <Text style={styles.listFooter}>{status}
                  </Text>
              </View>
          )
      },
    renderRow(obj, sectionID, rowID, onRowHighlighted) {
        return (
            <TouchableHighlight
                onPress={this.playRecord.bind(null, obj, sectionID, rowID)}
                underlayColor="#EEB422">
                <View style={styles.row}>
                    {this.state.showDeletePanel&&
                        <TouchableOpacity
                            onPress={this.selectDelete.bind(null, sectionID, rowID)}>
                            <Image
                                resizeMode='stretch'
                                source={this.selects[rowID]?app.img.common_delete:app.img.common_no_delete}
                                style={styles.deleteStyle} />
                        </TouchableOpacity>
                    }
                    <Text style={this.state.showDeletePanel?styles.title1:styles.title} >
                        {obj.name}
                    </Text>
                    <Text style={styles.time} >
                        {moment(new Date(obj.time)).format('MM-DD HH:mm:ss')}
                    </Text>
                    {
                        !this.state.showDeletePanel &&
                        <TouchableOpacity
                            style={styles.playButton}
                            onPress={this.playRecord.bind(null, obj)}>
                            <View style={styles.playButtonContainer}>
                                <Image
                                    resizeMode='stretch'
                                    source={app.img.play_play}
                                    style={styles.playButtonImage} />
                            </View>
                        </TouchableOpacity>
                    }
                </View>
            </TouchableHighlight>
        )
    },
    render: function() {
        return (
            <View style={styles.container}>
                <ListView                    initialListSize={1}
                    enableEmptySections={true}
                    style={this.state.showDeletePanel ? styles.listWithMarginBottom : styles.list}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
                    renderFooter={this.renderFooter}
                    renderSeparator={this.renderSeparator}
                    />
                <View style={this.state.showDeletePanel ? styles.bottomStyle : styles.bottomStyle2}>
                    <Text style={styles.bottomLine}>
                    </Text>
                    <View style={styles.bottomChildStyle}>
                        <TouchableHighlight
                            onPress={this.selectAll}
                            underlayColor="#a0d468"
                            style={styles.bottomSelectAllStyle}>
                            <Text style={styles.bottomSelectAllText}>全选</Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            onPress={this.doDelete}
                            style={styles.bottomDeleteStyle}
                            underlayColor="#A62045">
                            <Text style={{color:'#FFFFFF'}}>删除</Text>
                        </TouchableHighlight>
                    </View>
                </View>
                {
                    this.state.showDeleteMessageBox &&
                    <MessageBox
                        content="是否删除已选中项?"
                        doCancel={this.doCancel}
                        doConfirm={this.doConfirmDelete}
                        />
                }
            </View>
        );
    }
});


var styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    row: {
        height:60,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    list: {
        alignSelf: 'stretch',
    },
    listWithMarginBottom: {
        alignSelf: 'stretch',
        marginBottom: 60,
    },
    title: {
        marginLeft: 10,
    },
    title1: {
    },
    time: {
        right: 0,
        marginRight: 50,
    },
    separator: {
        height: 1,
        backgroundColor: '#CCC'
    },
    arrow: {
    },
    deleteStyle: {
        marginLeft: 10,
        height: 25,
        width: 25,
        alignSelf: 'center',
    },
    bottomStyle: {
        position:'absolute',
        bottom: 0,
        left: 0,
        flexDirection: 'column',
    },
    bottomStyle2: {
        position:'absolute',
        bottom: -60,
        left: 0,
        flexDirection: 'column',
    },
    bottomLine: {
        backgroundColor: '#DDDDDD',
        height: 1,
        width: sr.w,
    },
    bottomChildStyle: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        height: 50,
        width: sr.w,
    },
    bottomSelectAllStyle: {
        flex: 1,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
    },
    bottomDeleteStyle: {
        flex: 1,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#A62045',
    },
    playButton: {
        position: 'absolute',
        right: 10,
        top: 20,
    },
    playButtonContainer: {
        height: 20,
        width: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'gray',
    },
    playButtonImage: {
        height: 10,
        width: 10,
        left:2,
    },
    listFooter: {
          color: 'gray',
          fontSize: 14,
      },
      listFooterContainer: {
          height: 60,
          alignItems: 'center',
      },
});
