'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
} = ReactNative;

const { Button, MessageBox } = COMPONENTS;

const Label = React.createClass({
    render () {
        const { multi } = this.props;
        const source = multi ? app.img.specopsNew_check_label : app.img.specopsNew_radio_label;
        return (
            <Image resizeMode='stretch' source={source} style={styles.label} />
        );
    },
});

const Option = React.createClass({
    render () {
        const { onPress, index, multi, checked, children, answer, showResult } = this.props;
        const source = multi ?
        (checked ? app.img.specopsNew_checked : app.img.specopsNew_unchecked)
        :
        (checked ? app.img.specopsNew_radioed : app.img.specopsNew_unradioed)
        ;
        if (!showResult) {
            return (
                <TouchableOpacity onPress={onPress}>
                    <View style={[styles.optionContianer, { backgroundColor: checked ? '#464748' : '#EDEEEF' }]}>
                        <Image resizeMode='stretch' source={source} style={styles.itemImage} />
                        <Text style={[styles.optionText, { width: sr.ws(sr.w - 90), color: checked ? '#FFFFFF' : '#2D2E30' }]}>{children}</Text>
                    </View>
                </TouchableOpacity>
            );
        }
        const right = multi ? _.includes(answer, index) : answer === index;
        const mark = right ? app.img.specopsNew_right : checked ? app.img.specopsNew_wrong : null;
        return (
            <View style={styles.row}>
                {
                    mark ?
                        <Image resizeMode='stretch' source={mark} style={right ? styles.markWrong : styles.markRight} />
                    :
                        <View style={styles.markWrong} />
                }
                <View style={[styles.optionMarkContianer, { backgroundColor: checked ? '#464748' : '#EDEEEF' }]}>
                    <Image resizeMode='stretch' source={source} style={styles.itemImage} />
                    <Text style={[styles.optionText, { width: sr.ws(sr.w - 110), color: checked ? '#FFFFFF' : '#2D2E30' }]}>{children}</Text>
                </View>
            </View>
        );
    },
});

const RadioItem = React.createClass({
    getInitialState: function () {
        return {
            checked: -1,
        };
    },
    onPress (i) {
        this.props.onChange(i);
        this.setState({ checked: i });
    },
    render () {
        const { index, options, answer, myanswer, showResult, title } = this.props;
        const { checked } = this.state;
        return (
            <View style={styles.itemContianer}>
                <View style={styles.itemTitleContianer}>
                    <Text>{index}</Text>
                    <Label />
                    <Text style={styles.itemTitleText}>{title}</Text>
                </View>
                {
                    options.map((item, i) => (
                        <Option
                            key={i}
                            index={i}
                            answer={answer}
                            showResult={showResult}
                            checked={showResult ? i === myanswer : i === checked}
                            onPress={this.onPress.bind(null, i)}>
                            {item}
                        </Option>
                    ))
                }
            </View>
        );
    },
});

const CheckItem = React.createClass({
    getInitialState: function () {
        return {
            checked: [],
        };
    },
    onPress (i) {
        const { checked } = this.state;
        let newChecked;
        if (_.includes(checked, i)) {
            newChecked = _.without(checked, i);
        } else {
            newChecked = checked.concat(i);
        }
        this.props.onChange(newChecked);
        this.setState({ checked: newChecked });
    },
    render () {
        const { index, options, answer, myanswer, showResult, title } = this.props;
        const { checked } = this.state;
        return (
            <View style={styles.itemContianer}>
                <View style={styles.itemTitleContianer}>
                    <Text>{index}</Text>
                    <Label multi />
                    <Text style={styles.itemTitleText}>{title}</Text>
                </View>
                {
                    options.map((item, i) => (
                        <Option
                            multi
                            key={i}
                            index={i}
                            answer={answer}
                            showResult={showResult}
                            checked={showResult ? _.includes(myanswer, i) : _.includes(checked, i)}
                            onPress={this.onPress.bind(null, i)}>
                            {item}
                        </Option>
                    ))
                }
            </View>
        );
    },
});

const SubjectItem = React.createClass({
    render () {
        const props = this.props;
        return props.multi ? <CheckItem {...props} /> : <RadioItem {...props} />;
    },
});

const ClassTest = React.createClass({
    mixins: [SceneMixin],
    statics: {
        leftButton: { handler: () => app.scene.goBack() },
    },
    goBack () {
        const routes = app.navigator.getCurrentRoutes();
        const { routeIndex } = this.props;
        if (routeIndex === undefined) {
            app.navigator.pop();
        } else {
            app.navigator.popToRoute(routes[routeIndex - 1]);
        }
    },
    getDefaultProps: function () {
        return {
            showResult: false,
            myanswers: {},
        };
    },
    getInitialState () {
        const { showResult, myanswers } = this.props;
        return {
            list: [],
            showResult,
            myanswers,
            message: [],
            showMessageBox: false,
            lastStudyProgress: this.props.lastStudyProgress,
        };
    },
    componentWillMount () {
        this.answers = {};
    },
    componentDidMount () {
        if (!this.props.list) {
            const param = {
                userID: app.personal.info.userID,
                videoID: this.props.videoId,
            };
            POST(app.route.ROUTE_GET_SUBJECT_ALL, param, this.getDataSuccess, true);
        } else {
            this.setState({ list: this.props.list });
        }
    },
    getDataSuccess (data) {
        if (data.success) {
            const subjects = data.context.answer || [];
            const message = data.context.message || [];
            let showResult = false, myanswers = {};
            const list = subjects.map((item, k) => {
                const newItem = {}, options = [];
                const { isOver, userOption, id, subject: { content, multi, option, answer } } = item;
                newItem.multi = multi;
                for (let i in answer) {
                    options.push(answer[i]);
                }
                newItem.options = options;
                newItem.title = content;
                newItem.answer = multi ? option.map((o) => o - 1) : option[0] - 1;
                newItem.answerId = id;
                showResult = showResult || isOver;
                myanswers[k] = multi ? userOption.map((o) => o - 1) : userOption[0] - 1; // 为了适应服务器端从1起始
                return newItem;
            });
            this.setState({ list, showResult, myanswers, message });
        } else {
            this.setState({ showMessageBox: true });
        }
    },
    doSubmit (showResult) {
        if (showResult) {
            this.doTestAgain();
        } else {
            this.doSubmitScore();
        }
    },
    doTestAgain () {
        // const {routeIndex, videoId} = this.props;
        // routeIndex = (routeIndex === undefined) ? app.navigator.getCurrentRoutes().length-1 : routeIndex;
        // app.navigator.replace({
        //     component: ClassTest,
        //     passProps: {
        //         routeIndex,
        //         videoId,
        //         list: this.state.list,
        //     },
        // })
        if (this.props.isFromMainPage) {
            app.navigator.push({
                component: require('./CoursePlayer.js'),
                passProps: {
                    lastStudyProgress: this.props.lastStudyProgress,
                },
            });
        } else {
            this.goBack();
        }
    },
    doSubmitScore () {
        const answers = this.answers;
        const { list } = this.state;
        for (let i = 0, len = list.length; i < len; i++) {
            if (answers[i] === undefined) {
                Toast('题目 ' + (i + 1) + ' 还没有完成, 不能提交');
                return;
            }
        }
        const answer = [];
        for (let i in answers) {
            const o = answers[i], k = list[i];
            answer.push({
                userID: app.personal.info.userID,
                answerId: k.answerId,
                userOption: o.length ? _.sortBy(o.map((m) => m + 1)) : [o + 1],
                isOver: true,
            });
        }
        const param = {
            answer,
        };
        POST(app.route.ROUTE_SUBMIT_ANSWER, param, this.doSubmitScoreSuccess, true);
    },
    doSubmitScoreSuccess (data) {
        let { routeIndex, videoId, lastStudyProgress } = this.props;
        routeIndex = (routeIndex === undefined) ? app.navigator.getCurrentRoutes().length - 1 : routeIndex;
        app.navigator.push({
            component: ClassTest,
            title: '完成测试',
            passProps: {
                // showResult: true,
                // myanswers: this.answers,
                // list: this.state.list,
                routeIndex,
                videoId,
                lastStudyProgress,
                isFromMainPage: this.props.isFromMainPage || false,
            },
        });
    },
    onChange (index, checked) {
        this.answers[index] = checked;
    },
    render () {
        const { showResult, myanswers, message } = this.state;
        const { list } = this.state;
        const { name } = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.lineView} />
                {
                    !!list.length &&
                    <ScrollView>
                        {
                            showResult ?
                                <View style={styles.resultContainer}>
                                    <Image resizeMode='stretch' source={app.img.specopsNew_wangyu} style={styles.wangyu} />
                                    <Image resizeMode='stretch' source={app.img.specopsNew_test_background} style={styles.test_background}>
                                        <Text style={styles.result_text1}>RESULTS</Text>
                                        {message[0] != null && <Text style={styles.result_text2}>{message[0]}</Text>}
                                        {message[1] != null && <Text style={styles.result_text3}>{message[1]}</Text>}
                                        {message[2] != null && <Text style={styles.result_text4}>{message[2]}</Text>}
                                        {message[3] != null && <Text style={styles.result_text5}>{message[3]}</Text>}
                                    </Image>
                                    <Image resizeMode='stretch' source={app.img.specopsNew_result_arrow} style={styles.result_arrow} />
                                    <Text style={styles.result_text}>测试结果</Text>
                                </View>
                            :
                                <View style={styles.titleContainer}>
                                    <View style={styles.titleText}>
                                        <Text style={styles.title}>{name}</Text>
                                    </View>
                                    <View style={styles.infoContainer}>
                                        <Text style={styles.infoText}>题数:{list.length}</Text>
                                        <Text style={styles.infoText}>总分数:{100}</Text>
                                        <Text style={styles.infoText}>及格:{60}</Text>
                                    </View>
                                </View>
                        }
                        {
                            list.map((item, i) => <SubjectItem {...item} myanswer={myanswers[i]} showResult={showResult} index={i + 1} onChange={this.onChange.bind(null, i)} key={i} />)
                        }
                        <View style={styles.buttonContainer}>
                            <Button onPress={this.doSubmit.bind(null, showResult)} style={styles.button} textStyle={styles.buttonText}>{showResult ? '继续学习' : '提         交'}</Button>
                        </View>
                    </ScrollView>
                }
                {
                    this.state.showMessageBox &&
                    <MessageBox
                        content='该视频没有随堂测试!'
                        doConfirm={() => { this.goBack(); }}
                        />
                }
            </View>
        );
    },
});

module.exports = ClassTest;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F0F7',
    },
    titleContainer: {
        height: 90,
        backgroundColor: '#FFFFFF',
    },
    titleText: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
    },
    resultContainer: {
        height: 280,
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    lineView: {
        height: 1,
        width: sr.w,
        backgroundColor: '#EFEFEF',
    },
    wangyu: {
        width: 100,
        height: 100,
    },
    test_background: {
        width: 200,
        height: 120,
        top: -6,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    result_arrow: {
        marginTop: 10,
        width: 16,
        height: 16,
    },
    result_text1: {
        fontSize: 12,
        color: '#FFFFFF',
        backgroundColor: 'transparent',
    },
    result_text2: {
        fontSize: 16,
        color: '#FFFFFF',
        backgroundColor: 'transparent',
    },
    result_text3: {
        fontSize: 12,
        color: '#FFFFFF',
        backgroundColor: 'transparent',
    },
    result_text4: {
        fontSize: 12,
        top: -4,
        color: '#FFFFFF',
        backgroundColor: 'transparent',
    },
    result_text5: {
        fontSize: 10,
        top: -2,
        color: '#FFFFFF',
        backgroundColor: 'transparent',
    },
    result_text: {
        fontSize: 12,
        marginTop: 10,
        color: 'gray',
    },
    infoContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    infoText: {
        color: '#BABBBC',
    },
    itemContianer: {
        marginVertical: 5,
        paddingBottom: 10,
        backgroundColor: '#FFFFFF',
    },
    itemTitleContianer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F4F5F6',
        marginBottom: 4,
    },
    itemTitleText: {
        width: sr.w - 85,
        fontSize: 14,
        marginVertical: 10,
    },
    label: {
        width: 22,
        height: 22,
        marginLeft: 6,
        marginRight: 18,
    },
    itemImage: {
        width: 14,
        height: 14,
        marginRight: 20,
    },
    optionContianer: {
        height: 40,
        marginHorizontal: 20,
        paddingLeft: 10,
        marginTop: 6,
        alignItems: 'center',
        flexDirection: 'row',
    },
    row: {
        flexDirection: 'row',
        width: sr.w,
        alignItems: 'center',
    },
    markWrong: {
        width: 16,
        height: 12,
        marginLeft: 20,
        marginRight: 10,
    },
    markRight: {
        width: 14,
        height: 14,
        marginLeft: 22,
        marginRight: 10,
    },
    optionMarkContianer: {
        height: 40,
        flex: 1,
        marginRight: 20,
        paddingLeft: 10,
        marginTop: 6,
        alignItems: 'center',
        flexDirection: 'row',
    },
    optionText: {
        fontSize: 14,
    },
    buttonContainer: {
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    button: {
        height: 40,
        width: (sr.w - 30),
        borderRadius: 2,
        backgroundColor: '#FB6567',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
    },
});
