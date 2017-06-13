/**
 * Created by ysq on 17/6/5.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    ListView,
    Text,
    Image,
    ScrollView,
    View,
    TouchableHighlight,
    NativeModules,
    Platform,
} from 'react-native'

const layoutWidth = 320;
const barHeight = 10;
var ReportCorderView = require('./ReportCordeView');

export default class ReportDataCompareShare extends Component {
    constructor(props) {
        super(props)

        this.state = {
            dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}),
            titleStatus: {},
            user: {},
            showCode: {},
            time: {},
            list: [],
        }
    }

    componentWillMount() {
        this.loadData()
    }

    loadData() {
        if (Platform.OS === 'ios') {
            NativeModules.QNReport.fetchReportDataWithDataId(this.props.dataId + "").then(e => {
                this.setState({
                    user: e.user,
                    titleStatus: e.titleStatus,
                    showCode: e.showCode,
                    time: e.date,
                    list: e.list,
                    dataSource: this.state.dataSource.cloneWithRows(e.list)
                });
            }).catch(error => {
                console.log(error);
            });
        } else {
            NativeModules.QNReport.fetchReport(this.props.dataId + "", this.props.compareDataId + "").then(e => {
                console.log("数据源:", e);
                this.setState({
                    user: e.user,
                    titleStatus: e.titleStatus,
                    showCode: e.showCode,
                    time: e.date,
                    list: e.list,
                    dataSource: this.state.dataSource.cloneWithRows(e.list)
                });
            }).catch(error => {
                console.log(error);
            });
        }
    }

    onLayout(e) {
        console.log("布局完成:", e.nativeEvent.layout);
        const {width, height} =  e.nativeEvent.layout;

        if (height > 200) {
            NativeModules.QNUI.onGetViewSize(width, height)
        }
    }

    static getStatusColor(target) {
        var color = 'black';
        if (target === "严重偏低") {
            color = '#A98CE9'
        } else if (target === "偏低") {
            color = '#39BEE7'
        } else if (target === "偏高") {
            color = '#FFC028'
        } else if (target === "严重偏高") {
            color = '#E74C3C'
        } else if (target === "充足") {
            color = '#53A505'
        } else if (target === "不达标") {
            color = '#FFC028'
        } else {
            color = '#AACC1D'
        }
        return color
    }

    renderItem(data) {
        let vsBgColor = ReportDataCompareShare.getStatusColor(data.vsRsType);
        let bgColor = ReportDataCompareShare.getStatusColor(data.rsType);

        var bodyshapeView;
        var vsBodyshapeView;
        if (data.title === "体型") {
            vsBodyshapeView =(<View style={{flexDirection: 'row-reverse', flex: 2, justifyContent: 'center'}}/>);
            bodyshapeView =(<View style={{flexDirection: 'row-reverse', flex: 2, justifyContent: 'center'}}/>);
        } else {
            vsBodyshapeView = (<View style={{flexDirection: 'row-reverse', flex: 2, justifyContent: 'center'}}>
                <Text style={[styles.rsTypeStyle, {color: vsBgColor}, {borderColor: vsBgColor}]}>{data.vsRsType}</Text>
            </View>);

            bodyshapeView = (<View style={{flexDirection: 'row-reverse', flex: 2}}>
                <Text style={[styles.rsTypeStyle, {color: bgColor}, {borderColor: bgColor}]}>{data.rsType}</Text>
            </View>);
        }

        return (
            <View style={{height: 40}}>
                <View style={{flexDirection: 'row', alignItems: 'center', height: 39, backgroundColor: 'white'}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        {/*指标名称*/}
                        <Text style={[styles.scaleTitleStyle, {flex: 3}]}>{data.title}</Text>
                        {/*指标数值*/}
                        <View style={{flexDirection: 'row', flex: 2}}>
                            <Text style={styles.scaleValueStyle}>{data.vsScaleValue}</Text>
                            <Text style={styles.saleUnitStyle}>{data.vsUnit}</Text>
                        </View>
                        {/*指标的判断*/}

                        {vsBodyshapeView}

                        <Image source={require('../imgs/compare_report_item_arrow@3x.png')}/>

                        {/*指标数值*/}
                        <View style={{flexDirection: 'row', flex: 2, marginLeft: 5}}>
                            <Text style={styles.scaleValueStyle}>{data.scaleValue}</Text>
                            <Text style={styles.saleUnitStyle}>{data.unit}</Text>
                        </View>
                        {bodyshapeView}
                    </View>
                </View>
            </View>
        )
    }

    render() {
        var avatarUrl = this.state.user.avatar;
        var status = this.state.titleStatus;
        var code = this.state.showCode;

        if (avatarUrl == "")
            var icon = this.state.user.gender == 1 ? require("../imgs/avatar_man@3x.png") : require("../imgs/avatar_woman@3x.png");

        return (<ScrollView style={styles.container}>
            <View onLayout={(e) => this.onLayout(e)} style={{width: layoutWidth}}>
                <View style={styles.rightTopQrImg}>
                    <Image source={require('../imgs/qr_code_app.png')}/>
                    <Text style={styles.rightTopQrImgText}>轻牛APP</Text>
                </View>

                <Image source={require('../imgs/report_head@3x.png')} style={styles.head}>
                    <View style={styles.userStyle}>
                        <Image source={(avatarUrl == "" ? icon : {uri: avatarUrl}) } style={styles.avatar}/>
                        <Text style={styles.username}> {this.state.user.username} </Text>
                    </View>

                    <View style={{flexDirection: 'row', width: layoutWidth}}>
                        <View style={styles.compareInclude}>
                            <Text style={styles.compareTitle}>{status.timeTitle}</Text>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={styles.compareTitleContext}>{status.timeName}</Text>
                                <View style={styles.compareTitleUnitContext}>
                                    <Text style={{color: '#333', fontSize: 10,}}>{status.timeUnit}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.compareInclude}>
                            <Text style={styles.compareTitle}>{status.weightTitle}</Text>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={styles.compareTitleContext}>{status.weightName}</Text>
                                <View style={styles.compareTitleUnitContext}>
                                    <Text style={{color: '#333', fontSize: 10,}}>{status.weightUnit}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.compareInclude}>
                            <Text style={styles.compareTitle}>{status.bodyFatTitle}</Text>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={styles.compareTitleContext}>{status.bodyFatName}</Text>
                                <View style={styles.compareTitleUnitContext}>
                                    <Text style={{color: '#333', fontSize: 10,}}>{status.bodyFatUnit}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </Image>

                <View style={{alignItems: 'center', justifyContent: 'center',}}>
                    <View style={styles.compareTime}>
                        <Text style={{
                            color: 'white',
                            marginLeft: 3,
                            marginRight: 3
                        }}>{this.state.time.vsMeasureDate}</Text>
                        <Image style={{tintColor: 'white',}}
                               source={require('../imgs/compare_report_item_arrow@3x.png')}/>
                        <Text
                            style={{color: 'white', marginLeft: 3, marginRight: 3}}>{this.state.time.measureDate}</Text>
                    </View>
                </View>

                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderItem}
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                    renderFooter={() => this.renderFoot(this.state.showCode)}/>
            </View>
        </ScrollView>);
    }

    renderFoot(showCode) {
        return (
            <ReportCorderView
                showCode={showCode}
            />);
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
        alignSelf: 'center',
        width: layoutWidth,
    },

    rightTopQrImg: {
        position: 'absolute',
        right: 5,
        top: 10,
        alignSelf: 'flex-end',
        alignItems: "center"
    },

    head: {
        paddingTop: 0,
        width: layoutWidth,
    },

    userStyle: {
        marginTop: 10,
        flexDirection: 'row',
        marginLeft: 20,
    },

    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },

    username: {
        marginLeft: 5,
        color: '#333',
        fontWeight: 'bold',
        backgroundColor: 'transparent',
        alignItems: "center",
        justifyContent: "center",
        marginTop: 12,
        fontSize: 16
    },

    compareInclude: {
        width: layoutWidth / 3,
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 15
    },

    compareTitle: {
        alignItems: 'center',
        justifyContent: 'center',
        color: '#999999'
    },

    compareTitleContext: {
        alignItems: 'center',
        justifyContent: 'center',
        color: '#333',
        fontSize: 18,
        fontWeight: 'bold',
    },

    compareTitleUnitContext: {
        alignItems: 'flex-end',
        justifyContent: 'flex-end'
    },

    compareTime: {
        borderRadius: 20,
        borderStyle: 'solid',
        backgroundColor: '#68D5F3',
        alignItems: 'center',
        width: 250,
        padding: 10,
        flexDirection: 'row'
    },


    scaleTitleStyle: {
        color: '#333333',
        fontSize: 12,
        marginLeft: 10
    },

    scaleValueStyle: {
        fontSize: 14,
        color: '#333333'

    },
    saleUnitStyle: {
        fontSize: 8,
        marginTop: 8,
        color: '#333333'

    },
    rsTypeStyle: {
        borderRadius: 9,
        borderWidth: 1,
        lineHeight: 8,
        fontSize: 8,
        paddingRight: 7,
        paddingLeft: 7,
        paddingTop: 3,
        paddingBottom: 2,
        marginRight: 5,
        textAlign: 'center'
    },

});