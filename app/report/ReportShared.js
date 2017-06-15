/**
 * Created by DonYau on 2017/3/9.
 */

import React, {Component} from  'React';

import {
    View,
    Text,
    Image,
    ListView,
    StyleSheet,
    NativeModules,
    Platform,
    ScrollView
} from 'react-native';

//固定值

var ScreenWidth = 320;

var ReportCorderView = require('./ReportCordeView');

var ReportShared = React.createClass({

    getInitialState(){
        console.log("初始化属性", this.props);
        return {
            avaterImg: '',
            measureTime: '',
            account: '',
            gender: '1',
            score: 0,
            bodyShapeStr: '',
            description: '',
            isShareFlag: '',
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 !== r2
            })
        }
    },

    componentWillMount(){
        this.fetchReportData();
    },

    async fetchReportData(){
        console.log('====' + this.props.themeColor);
        if (Platform.OS === 'ios') {
            try {
                var event = await  NativeModules.QNAnalysisReportModule.fetchSharedReport(this.props.dataId)
                console.log(event);
                this.setState({
                    avaterImg: event.header.avater,
                    measureTime: event.header.measureTime,
                    account: event.header.account,
                    score: event.header.score,
                    bodyShapeStr: event.header.bodyShape,
                    description: event.header.description,
                    gender: event.header.gender,
                    isShareFlag: event.header.isShareFlag,
                    dataSource: this.state.dataSource.cloneWithRows(event.cell)
                })
            } catch (e) {
                console.log(e)
            }
        } else {
            NativeModules.QNReport.fetchReportDataWithDataId(this.props.reportType + "", this.props.dataId + "").then(event => {
                console.log(event)
                this.setState({
                    avaterImg: event.user.avatar,
                    measureTime: event.measureDate,
                    account: event.user.username,
                    score: event.score,
                    gender: event.user.gender,
                    bodyShapeStr: event.bodyshape,
                    description: event.description,
                    isShareFlag: event.isShareFlag,
                    dataSource: this.state.dataSource.cloneWithRows(event.list)
                })
            }).catch(e => {
                console.log(e)
            })
        }
    },

    render(){
        return (
            <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderCell}
                    renderHeader={this.renderHeader}
                    style={{width: 320, backgroundColor: 'white', height: this.props.height}}
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                    pageSize={15}
                    onLayout={(e) => this.onLayout(e)}
                    renderFooter={this.renderFooter}
                />
            </ScrollView>
        )
    },

    //HeaderView
    renderHeader(){
        var f = this.state.score.toFixed(1) * 10;
        const scoreString = f + "分";
        const bigScore = scoreString.substr(0, scoreString.length - 2);
        const smallScore = "." + scoreString.substr(scoreString.length - 2, scoreString.length);

        var scoreView = (<View style={styles.scoreStyle}>
            <Text style={[styles.scoreLeftStyle, {color: this.props.themeColor}]}>{bigScore}</Text>
            <Text style={[styles.scoreRightStyle, {color: this.props.themeColor}]}> {smallScore}</Text>
        </View>);

        return (
            <View style={styles.headerViewStyle}>
                {/* 背景 */}
                <Image style={styles.backgroudImageStyle} source={require('../imgs/report_head.png')}/>
                {/* 二维码 */}
                <View style={styles.coderStyle}>
                    <Image style={styles.coderImageStyle} source={require('../imgs/qr_code_app.png')}/>
                    <Text style={styles.coderTitleStyle}>轻牛APP</Text>
                </View>
                <View style={styles.personMsgStyle}>
                    {/*头像*/}
                    <Image style={styles.avaterStyle} source={this.getUserAvater()}/>
                    <View>
                        {/*昵称*/}
                        <Text style={styles.accountStyle}>{this.state.account}</Text>
                        {/*测量时间*/}
                        <Text style={styles.measureTimeStyle}>{this.state.measureTime}</Text>
                    </View>
                </View>
                <View style={styles.measureMsgStyle}>
                    {/*分数*/}
                    {scoreView}
                    {/*体型*/}
                    {this.getBodyShapeImg(this.state.bodyShapeStr)}
                </View>
                {/*描述*/}
                <Text style={styles.descriptionStyle}>{this.state.description}</Text>
            </View>
        )
    },

    //cell
    renderCell(data, sectionId, rowId){
        var topDis = 0;
        var secHeight = 49;
        if (rowId == 0) {
            topDis = -1;
            secHeight = 50;
        } else {
            topDis = 0;
            secHeight = 49;
        }
        return (
            <View style={styles.cellViewStyle}>
                {/*图标*/}
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    height: 50,
                    backgroundColor: 'rgb(230, 230, 230)'
                }}>
                    <View style={{
                        width: 42,
                        backgroundColor: 'white',
                        height: 50,
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        <Image source={this.getScaleIcon(data.title)} style={styles.scaleIconStyle}/>
                    </View>
                    <View style={{
                        height: secHeight,
                        backgroundColor: 'white',
                        width: ScreenWidth - 42,
                        marginTop: topDis
                    }}>
                        <View style={{flexDirection: 'row', alignItems: 'center', height: secHeight}}>
                            {/*指标名称*/}
                            <Text style={[styles.scaleTitleStyle, {flex: 4}]}>{data.title}</Text>
                            {/*指标数值*/}
                            <View style={{flex: 3, flexDirection: 'row'}}>
                                <Text style={styles.scaleValueStyle}>{data.scaleValue}</Text>
                                <Text style={styles.saleUnitStyle}>{data.unit}</Text>
                            </View>
                            {/*指标的判断*/}
                            <View style={{flex: 3, flexDirection: 'row-reverse'}}><Text
                                style={[styles.rsTypeStyle, {color: this.getColor(data.rsType)}, {borderColor: this.getColor(data.rsType)}]}>{data.rsType}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        )
    },

    renderFooter(){
        return (
            <ReportCorderView
                showCode={this.state.isShareFlag}
            />
        )
    },

    //高度
    onLayout(e){
        const {width, height} =  e.nativeEvent.layout;
        if (height > 200) {
            if (Platform.OS === 'ios') {
                NativeModules.QNUI.onGetAnalysisReport(width, height)
            } else {
                NativeModules.QNUI.onGetViewSize(width, height)
            }
        }
    },

    //获取头像
    getUserAvater(){
        if (this.state.avaterImg == "") {
            if (this.state.gender == "1") {
                return require('../imgs/avatar_man.png')
            } else {
                return require('../imgs/avatar_woman.png')
            }
        } else {
            console.log(this.state.avaterImg);
            return {uri: this.state.avaterImg}
        }
    },

    //获取体型
    getBodyShapeImg(bodyShape){
        console.log(bodyShape)
        var bgImg = "";
        var frImg = "";
        switch (bodyShape) {
            case "隐形肥胖型": {
                bgImg = require("../imgs/bodyshape/invisible_fat_1.png");
                frImg = require("../imgs/bodyshape/invisible_fat_2.png");
                break;
            }
            case "偏胖型": {
                bgImg = require("../imgs/bodyshape/pianpang_1.png");
                frImg = require("../imgs/bodyshape/pianpang_2.png");
                break;
            }
            case "肥胖型": {
                bgImg = require("../imgs/bodyshape/fat_1.png");
                frImg = require("../imgs/bodyshape/fat_2.png");
                break;
            }
            case "偏瘦肌肉型": {
                bgImg = require("../imgs/bodyshape/pianmuscle_1.png");
                frImg = require("../imgs/bodyshape/pianmuscle_2.png");
                break;
            }
            case "标准型": {
                bgImg = require("../imgs/bodyshape/standard_1.png");
                frImg = require("../imgs/bodyshape/standard_2.png");
                break;
            }
            case "非常肌肉型": {
                bgImg = require("../imgs/bodyshape/more_muscle_1.png");
                frImg = require("../imgs/bodyshape/more_muscle_2.png");
                break;
            }
            case "偏瘦型": {
                bgImg = require("../imgs/bodyshape/pianshou_1.png");
                frImg = require("../imgs/bodyshape/pianshou_2.png");
                break;
            }
            case "标准肌肉型": {
                bgImg = require("../imgs/bodyshape/standard_muscle_1.png");
                frImg = require("../imgs/bodyshape/standard_muscle_2.png");
                break;
            }
            case "运动不足型": {
                bgImg = require("../imgs/bodyshape/lack_sport_1.png");
                frImg = require("../imgs/bodyshape/lack_sport_2.png");
                break;
            }
        }
        if (bgImg !== "") {
            return (
                <View style={styles.bodyShapeStyle}>
                    <View style={{right: 0, flexDirection: 'row', justifyContent: 'center'}}>
                        <Image style={{tintColor: this.props.themeColor}}
                               source={require('../imgs/report_bodyshape_name_bg.png')}/>
                        <Text style={styles.bodyShapeTitleStyle}>{this.state.bodyShapeStr}</Text>
                    </View>
                    <View>
                        <Image style={styles.bodyShapeBgStyle} source={bgImg}/>
                        <Image style={[styles.bodyShapeFrStyle, {tintColor: this.props.themeColor}]} source={frImg}/>
                    </View>
                </View>
            )
        }
    },

    getColor(target){
        var color;
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
        } else if (target === "重度肥胖") {
            color = '#AC271E'
        } else if (target === "中度肥胖") {
            color = '#E74C3C'
        } else if (target === "轻度肥胖") {
            color = '#F7931E'
        } else if (target === "超重") {
            color = '#FFC028'
        } else if (target === "肥胖") {
            color = '#FFC028'
        } else if (target === "正常") {
            color = '#AACC1D'
        } else {
            color = '#AACC1D'
        }
        return color
    },


    //根据指标名查找指标的标志图片
    getScaleIcon(scaleName){
        var icon;
        switch (scaleName) {
            case "体重":
                icon = require('../imgs/scaleIcon/weight_icon.png')
                break
            case "BMI":
                icon = require('../imgs/scaleIcon/bmi_icon.png')
                break
            case "体脂率":
                icon = require('../imgs/scaleIcon/bodyfat_icon.png')
                break
            case "去脂体重":
                icon = require('../imgs/scaleIcon/fat_free_weight_icon.png')
                break
            case "皮下脂肪率":
                icon = require('../imgs/scaleIcon/subfat_icon.png')
                break
            case "内脏脂肪等级":
                icon = require('../imgs/scaleIcon/visfat_icon.png')
                break
            case "体水分":
                icon = require('../imgs/scaleIcon/water_icon.png')
                break
            case "骨骼肌率":
                icon = require('../imgs/scaleIcon/muscle_icon.png')
                break
            case "肌肉量":
                icon = require('../imgs/scaleIcon/sinew_icon.png')
                break
            case "骨量":
                icon = require('../imgs/scaleIcon/bone_icon.png')
                break
            case "蛋白质":
                icon = require('../imgs/scaleIcon/protein_icon.png')
                break
            case "基础代谢率":
                icon = require('../imgs/scaleIcon/bmr_icon.png')
                break
            case "体年龄":
                icon = require('../imgs/scaleIcon/bodyage_icon.png')
                break
            case "腰臀比":
                icon = require('../imgs/scaleIcon/whr_icon.png')
        }
        return icon
    }

});


const styles = StyleSheet.create({
    //头部
    headerViewStyle: {},

    backgroudImageStyle: {
        position: 'absolute',
    },
    //二维码
    coderStyle: {
        position: 'absolute',
        height: 65,
        width: 50,
        marginTop: 10,
        marginLeft: ScreenWidth - 60,
    },
    //二维码中的图片
    coderImageStyle: {
        width: 50,
        height: 50,
    },
    //二维码中的文字
    coderTitleStyle: {
        fontSize: 10,
        textAlign: 'center',
        color: "#999999"
    },
    //个人信息
    personMsgStyle: {
        flexDirection: "row",
    },
    //头像
    avaterStyle: {
        height: 60,
        width: 60,
        marginLeft: 20,
        marginTop: 40,
        borderRadius: 30,
    },
    //昵称
    accountStyle: {
        height: 20,
        marginLeft: 10,
        marginTop: 52,
        lineHeight: 20,
        fontSize: 20,
        backgroundColor: 'transparent'
    },
    //测量时间
    measureTimeStyle: {
        marginLeft: 10,
        marginTop: 6,
        color: 'rgb(179, 179, 179)'
    },
    //测量信息
    measureMsgStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    //分数
    scoreStyle: {
        backgroundColor: 'transparent',
        flexDirection: 'row',
        marginTop: 10,
    },
    //分数的左半部分
    scoreLeftStyle: {
        fontSize: 40,
        marginLeft: 25,
    },
    //分数的右半部分
    scoreRightStyle: {
        fontSize: 25,
        marginTop: 15
    },
    //分数单位
    scoreUnitStyle: {
        fontSize: 20,
        marginTop: 20
    },

    //体型
    bodyShapeStyle: {
        flexDirection: 'row-reverse',
        right: 10,
    },

    //体型灰色背景
    bodyShapeBgStyle: {},
    //体型icon
    bodyShapeFrStyle: {
        position: 'absolute',
    },
    //体型文字显示
    bodyShapeTitleStyle: {
        backgroundColor: 'transparent',
        color: 'white',
        fontSize: 10,
        position: 'absolute',
        top: Platform.OS == 'ios' ? 5 : 3,
        textAlign: 'center',
        alignSelf: 'center',
        width: 67,
    },

    //描述
    descriptionStyle: {
        color: 'rgb(179, 179, 179)',
        marginTop: 15,
        marginLeft: 20,
        marginRight: 20,
        fontSize: 13,
        marginBottom: 20,
    },
    //cell
    cellViewStyle: {
        height: 50,
    },
    //指标icon
    scaleIconStyle: {
        marginLeft: 10,
        resizeMode: Image.resizeMode.contain
    },
    //指标名称
    scaleTitleStyle: {
        color: '#333333'
    },
    //数值
    scaleValueStyle: {
        fontSize: 18,
        color: '#333333'

    },
    //单位
    saleUnitStyle: {
        fontSize: 10,
        marginTop: 8,
        color: '#333333'

    },
    //判断值
    rsTypeStyle: {
        borderRadius: 9,
        borderWidth: 1,
        lineHeight: 10,
        fontSize: 10,
        paddingRight: 7,
        paddingLeft: 7,
        paddingTop: 3,
        paddingBottom: 2,
        marginRight: 10,
        textAlign: 'center'
    },
});

module.exports = ReportShared;
