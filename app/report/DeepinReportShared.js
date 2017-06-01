/**
 * Created by yons on 2017/3/28.
 */
import React, {Component, PropTypes, FattyLiverRisk} from 'react'
import{
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    Platform,
    NativeModules,
} from 'react-native'

var ReportCorderView = require('./ReportCordeView');

/*获取屏幕宽高*/
var screenWidth = 320;


/*注册文件*/
export default class DeepinReportShared extends Component {

    /*构造函数*/
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            user: {}, //用户信息
            BMIType: 0,
            baselMetabolicRateType: 0,
            bodyAgeType: 0,
            bodyFatType: 0,
            bodyType: 0,
            bodyfat: "",
            fatControl: "",
            fatWeight: "",
            healthLevel: 0,
            healthScore: "0",
            hipType: 0,
            idealWeight: "",
            localUpdatedAt: "",
            muscaleControl: "4.0",
            muscle: "56.5",
            muscleMass: "47.4",
            muscleType: "",
            proteinType: 0,
            saltType: 0,
            visfat: 0,
            weight: "",
            weightControl: "",
            isShareFlag: 0,
            isShowFattyLiverRisk: 0,
            weightControl: '',
            weightUnit: '公斤',
        }
        ;
    }

    /*将要呈现*/
    componentWillMount() {
        this._loadData();
    }

    /*加载数据*/
    _loadData() {
        if (Platform.OS === 'ios') {
            NativeModules.QNAnalysisDeepinReportModule.fetchDeepinReportDataWithDataDic(this.props.dataDic ).then(e => {
                console.log('打印出来的：', e);
                this.setState(e);
            }).catch(error => {
                console.log(error);
            });
        } else {
            NativeModules.QNReport.fetchReportDataWithDataId(this.props.reportType + "", this.props.dataId + "").then(e => {
                console.log('ysq打印出来的：list的值是', e);
                this.setState(e);
            }).catch(error => {
                console.log(error);
            });
        }
    }

    //高度
    onLayout(e) {
        const {width, height} =  e.nativeEvent.layout;
        if (height > 350) {
            if (Platform.OS === 'ios') {
                NativeModules.QNUI.onGetAnalysisDeepinReport(width, height)
            } else {
                NativeModules.QNUI.onGetViewSize(width, height)
            }
        }
    }

    /*标题view*/
    renderTitleView(title) {

        return (
            <View style={styles.titleView}>
                <View style={[styles.titleView_icon, {backgroundColor: this.props.themeColor}]}></View>
                <Text style={styles.titleView_text}>{title}</Text>
            </View>
        )
    }

    /*体重信息subview*/
    renderUserInfoView() {

        if (this.props.shieldUserInfo == 1){
            return (
                <View style={{height:1}}/>
            )
        }else  {
            /*处理用户头像*/
            const avatarUrl = this.state.user.avatar;
            if (avatarUrl == "") {
                var icon = this.state.user.gender == 1 ? require("../imgs/avatar_man.png") : require("../imgs/avatar_man.png");
            }
            return (
                <View style={styles.userInfoView}>
                    <Image source={require('../imgs/report_head.png')} style={styles.userInfoView_baseImage}>
                        <Image source={(avatarUrl == "" ? icon : {uri: avatarUrl}) }
                               style={styles.userInfoView_userIcon}/>
                        <View style={ styles.userInfoView_baseTextView}>
                            <Text style={styles.userInfoView_userNameText}>{this.state.user.username}</Text>
                            <Text style={styles.userInfoView_userTimeText}>{this.state.localUpdatedAt}</Text>
                        </View>
                        <View style={styles.coderStyle}>
                            <Image style={styles.coderImageStyle} source={require('../imgs/qr_code_app.png')}/>
                            <Text style={styles.coderTitleStyle}>轻牛APP</Text>
                        </View>
                    </Image>
                </View>
            )
        }

    }

    /*体重信息subview*/
    renderWeightInfoSubview(title, text) {


        var unit;
        var font;
        if (title == "体重") {
            unit = this.state.weightUnit;
            font = 11;
        } else {
            unit = "%";
            font = 12;
        }
        return (
            <View style={styles.weightInfoSubview}>
                <View style={{
                    flexDirection: 'row', backgroundColor: '#FFFFFF00',
                    alignItems: 'center'
                }}>
                    <Text style={styles.weightInfoSubview_text}>{text}</Text>
                    <Text style={[styles.weightInfoSubview_textUnit, {fontSize: font}]}>{unit}</Text>
                </View>
                <Text style={[styles.weightInfoSubview_title]}>{title}</Text>
            </View>
        )
    }


    /*体重控制subview*/
    renderWeightControlSubview(index, text) {


        var showStr;
        var unitStr;
        if (text == "无需控制") {

            showStr = "";
            unitStr ="";
        } else {

            if (text > 0) {

                showStr = "增加";

            } else if (text < 0){

                showStr = "减少";
                text = text.substr(1, text.length);
            }
            unitStr =this.state.weightUnit;
        }
        var icon;
        var title;
        switch (index) {
            case 0: {
                icon = require("../imgs/deepinReport_fatWeight.png");
                title = "脂肪重量";
                showStr = "";
                break;
            }
            case 1: {
                icon = require("../imgs/deepinReport_weightControl.png");
                title = "体重控制";
                break;
            }
            case 2: {
                icon = require("../imgs/deepinReport_fatControl.png");
                title = "脂肪控制";
                break;
            }
            case 3: {
                icon = require("../imgs/deepinReport_muscaleControl.png");
                title = "肌肉控制";
                break;
            }
        }
        return (

            <View style={styles.weightControlSubview}>
                <View style={styles.weightControlSubview_titleView}>
                    <Image source={icon}
                           style={[styles.weightControlSubview_icon, {tintColor: this.props.themeColor,}]}/>
                    <Text style={styles.weightControlSubview_title}>{title}</Text>
                </View>
                <View style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                }}>
                    <Text style={styles.weightControlSubview_showStr}>{showStr}</Text>
                    <Text style={styles.weightControlSubview_text}>{text}</Text>
                    <Text style={styles.weightControlSubview_showStr}>{unitStr}</Text>
                </View>
            </View>
        )
    }

    /*肌肉控制subview*/
    renderMuscleControlSubview(text) {
        var icon;
        if (text == "肌肉比率低") {
            icon = require('../imgs/deepinReport_muscle_status_0.png');

        } else if (text == "肌肉比率标准") {
            icon = require('../imgs/deepinReport_muscle_status_1.png');
        } else {
            icon = require('../imgs/deepinReport_muscle_status_2.png');
        }

        return (
            <View style={styles.muscleControlView}>
                {this.renderTitleView("肌肉控制")}
                <View style={styles.muscleInfoView}>
                    <View style={{width: 45, height: 100}}/>
                    <Image source={icon}
                           style={styles.muscleInfoView_icon}>
                        <Text
                            style={[styles.muscleInfoView_icon_text, {color: this.props.themeColor}]}>{text}</Text>
                    </Image>
                    <View style={{width: 25, height: 100}}/>
                    <View style={styles.threeView_View}>
                        <View style={styles.muscleInfoView_textView}>
                            <Text style={styles.muscleInfoView_title}>体重：</Text>
                            <Text style={styles.muscleInfoView_text}>{this.state.weight}</Text>
                            <Text
                                style={[styles.muscleInfoView_textUnit, {fontSize: 11}]}>{this.state.weightUnit}</Text>
                        </View>
                        <View style={styles.muscleInfoView_textView}>
                            <Text style={styles.muscleInfoView_title}>肌肉量：</Text>
                            <Text style={styles.muscleInfoView_text}>{this.state.muscleMass}</Text>
                            <Text
                                style={[styles.muscleInfoView_textUnit, {fontSize: 11}]}>{this.state.weightUnit}</Text>
                        </View>
                        <View style={styles.muscleInfoView_textView}>
                            <Text style={styles.muscleInfoView_title}>骨骼肌率：</Text>
                            <Text style={styles.muscleInfoView_text}>{this.state.muscle}</Text>
                            <Text style={styles.muscleInfoView_textUnit}>%</Text>
                        </View>

                    </View>
                </View>
            </View>
        )
    }

    /*营养状况SubView*/
    renderNutritionInfoSubview(title, index) {

        var color;
        var textStr;
        if (index == 0 || index == 1) {//级别0  通常表示严重偏低  级别1  通常表示偏低
            if (title === "基础代谢量") {
                textStr = "低";
                color = "#A98CE9";
            } else if (title === "身体年龄") {
                textStr = "高";
                color = "#E74C3C";

            } else {
                textStr = "缺乏";
                color = "#A98CE9";
            }

        } else if (index == 2) {//级别2  通常表示正常
            textStr = "正常";
            color = '#AACC1D';
        } else if (index == 3 || index == 4) {//级别3  通常表示偏高 //级别4  通常表示严重偏高
            if (title === "蛋白质" || title === "无机盐" || title === "基础代谢量") {
                color = '#AACC1D';
                textStr = "正常";
            } else {
                textStr = "过量";
                color = "#E74C3C";
            }

        }
        return (
            <View>
                <View style={styles.nutritionInfoSubview}>
                    <View style={[styles.nutritionInfoSubview_base, {backgroundColor: color + '33'}] }>
                        <View style={[styles.nutritionInfoSubview_subview, {backgroundColor: "white"}]}>
                            <Text style={[styles.nutritionInfoSubview_text, {color: color}]}>{textStr}</Text>
                        </View>
                    </View>
                </View>
                <Text style={[styles.nutritionInfoSubview_title, {top: 5}]}>{title}</Text>
            </View>
        )
    }

    /*BMR 状况View*/
    renderBMRInfoView(index) {

        // index = 0;
        var color;
        var textStr;
        var show_Y;
        var index_Y;
        if (index == 0 || index == 1) {//级别0  通常表示严重偏低  级别1  通常表示偏低
            textStr = "低";
            color = "#A98CE9";
            show_Y = 62;
            index_Y = 57;
        } else if (index == 2) {//级别2  通常表示正常
            textStr = "正常";
            color = '#AACC1D';
            show_Y = 45;
            index_Y = 40;
        } else if (index == 3 || index == 4) {//级别3  通常表示偏高 //级别4  通常表示严重偏高
            color = '#AACC1D';
            textStr = "正常";
            show_Y = 45;
            index_Y = 40;
        }
        return (
            <View style={styles.bmrInfoView_base}>
                <Image source={require("../imgs/deepinReport_BMR_0.png")}
                       style={styles.bmrInfoView_icon_one}/>
                <Image source={require("../imgs/deepinReport_BMR_1.png")}
                       style={[styles.bmrInfoView_icon_two, {top: show_Y}]}/>
                <Image source={require("../imgs/deepinReport_ energy_index.png")}
                       style={[styles.bmrInfoView_icon_three, {tintColor: color, top: index_Y}]}>
                    <Text style={[styles.bmrInfoView_icon_ShowText, {color: color}]}>{textStr}</Text>
                </Image>
                <Text style={styles.bmrInfoView_title}>基础代谢率</Text>
            </View>
        )
    }

    /*体年龄 状况View*/
    renderBodyAgeInfoView(index) {
        // index = 1;
        var color;
        var textStr;
        var index_Y;
        if (index == 0 || index == 1) {
            textStr = "高";
            color = "#E74C3C";
            index_Y = 12;
        } else {
            color = '#AACC1D';
            textStr = "正常";
            index_Y = 40;
        }
        return (

            <View style={styles.bodyAgeInfoView_base}>
                <Image source={require("../imgs/deepinReport_bodyAge.png")}
                       style={styles.bodyAgeInfoView_icon_one}/>
                <Image source={require("../imgs/deepinReport_ energy_index.png")}
                       style={[styles.bodyAgeInfoView_icon_two, {tintColor: color, top: index_Y}]}>
                    <Text style={[styles.bodyAgeInfoView_icon_ShowText, {color: color}]}>{textStr}</Text>
                </Image>
                <Text style={styles.bodyAgeInfoView_title}>身体年龄</Text>
            </View>
        )
    }

    /*肥胖状况 subView*/
    renderBMIAndBodyfatInfoView(BMIindex, bodyfatIndex) {

        // BMIindex = 3
        // bodyfatIndex = 1;
        var bmiWidth;
        var bmiColor;
        var bmiTitleW;

        if (BMIindex == 1) {
            bmiWidth = 35;
            bmiTitleW = 35;
            bmiColor = "#A98CE9";
        } else if (BMIindex == 2) {
            bmiWidth = 122;
            bmiTitleW = 122;
            bmiColor = '#AACC1D';
        } else {
            bmiWidth = 209;
            bmiTitleW = 209;
            bmiColor = "#F1C43C";
        }

        var bodyFatWidth;
        var bodyFatColor;
        var bodyFatTitleW;
        if (bodyfatIndex == 1) {
            bodyFatWidth = 35;
            bodyFatTitleW = 35;
            bodyFatColor = "#A98CE9";
        } else if (bodyfatIndex == 2) {
            bodyFatWidth = 122;
            bodyFatTitleW = 122;
            bodyFatColor = '#AACC1D';
        } else {
            bodyFatWidth = 209;
            bodyFatTitleW = 209;
            bodyFatColor = "#F1C43C";
        }
        if (bodyFatWidth == bmiWidth) {
            bmiTitleW = bmiWidth - 25;
            bodyFatTitleW = bodyFatWidth - 25;
        } else {
            bmiTitleW = bmiWidth - 10;
            bodyFatTitleW = bodyFatWidth - 45;
        }

        return (

            <View style={styles.BMIAndBodyfatInfoView}>
                <View style={{
                    width: 260,
                    height: 18,
                    backgroundColor: 'rgba(255, 255, 255, 0.0)',
                    flexDirection: 'row',
                }}>
                    <Text
                        style={[styles.BMIAndBodyfatInfoView_title, {left: bmiTitleW}, {color: bmiColor}, {fontSize: 13}, {paddingTop: -2}]}>BMI</Text>
                    <Text
                        style={[styles.BMIAndBodyfatInfoView_title, {color: bodyFatColor}, {left: bodyFatTitleW}]}>体脂肪</Text>
                </View>
                <View style={styles.BMIAndBodyfatInfoView_base}>

                    <Image source={require('../imgs/deepinReport_fat_level.png')}
                           style={styles.BMIAndBodyfatInfoView_icon_line}>
                    </Image>
                    <Image source={require('../imgs/deepinReport_fat_indicator.png')}
                           style={[styles.BMIAndBodyfatInfoView_icon_show, {left: bmiWidth}, {tintColor: bmiColor}]}>
                        <View style={{width: 8, height: 8, borderRadius: 4, backgroundColor: "white", top: -1}}></View>

                    </Image>
                    <Image source={require('../imgs/deepinReport_fat_indicator.png')}
                           style={[styles.BMIAndBodyfatInfoView_icon_show, {left: bodyFatWidth}, {tintColor: bodyFatColor}]}>
                        <View style={{width: 8, height: 8, borderRadius: 4, backgroundColor: "white", top: -1}}></View>
                    </Image>
                    <View style={styles.BMIAndBodyfatInfoView_icon_view}>
                        <Text style={styles.BMIAndBodyfatInfoView_icon_text}>偏低</Text>
                        <Text style={styles.BMIAndBodyfatInfoView_icon_text}>正常</Text>
                        <Text style={styles.BMIAndBodyfatInfoView_icon_text}>偏高</Text>
                    </View>

                </View>

            </View>
        )
    }

    /*腰臀围类型 subview*/
    renderWaistlineAndHipSubView(index) {

        var bodyIcon;
        var color;
        var title;

        if (index == 1) {
            color = "#A98CE9";
            title = "梨型";
            bodyIcon = require("../imgs/deepinReport_fat_hip_level_2.png");
        } else if (index == 2) {
            color = '#AACC1D';
            title = "正常";
            bodyIcon = require("../imgs/deepinReport_fat_hip_level_1.png");
        } else if (index == 3) {
            color = "#F1C43C";
            title = "苹果型";
            bodyIcon = require("../imgs/deepinReport_fat_hip_level_0.png");
        }
        return (

            <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.0)',
                alignItems: 'center',
                top: 22,
            }}>
                <Image source={(bodyIcon)} style={{width: 27, height: 27}}/>
                <Text style={{
                    fontSize: 12,
                    color: color, left: 5, width: 60,
                }}>{title}</Text>
            </View>
        )
    }

    renderWaistlineAndHipView(index) {

        if (index == 0) {
            return (
                <View style={{flexDirection: "row", alignItems: 'center', top: 20}}>
                    <Text style={{
                        fontSize: 12,
                        width: 85,
                        textAlign: 'center', color: "#999999", top: 22,
                    }}>腰臀围类型：</Text>
                    <Text style={{
                        fontSize: 12,
                        textAlign: 'center', color: this.props.themeColor, top: 22,
                    }}>请在个人信息界面输入腰臀围</Text>
                </View>
            )
        } else {
            return (
                <View style={{flexDirection: "row", alignItems: 'center', top: 20}}>
                    <Text style={{
                        fontSize: 12,
                        width: 85,
                        textAlign: 'center', color: "#999999", top: 22,
                    }}>腰臀围类型：</Text>
                    {this.renderWaistlineAndHipSubView(index)}
                </View>
            )
        }
        return
    }

    /*脂肪肝风险等级 view*/
    renderFattyLiverRiskView(visfat) {


        if (this.state.isShowFattyLiverRisk) {
            var color;
            var titleStr;
            var index;

            if (visfat > 0 && visfat < 8) {
                color = '#47C943';
                titleStr = '0级:暂⽆肥胖性脂肪肝风险。';
                index = 1;
            } else if (visfat >= 8 && visfat < 10) {
                color = '#FFA93C';
                titleStr = 'I级:存在患上脂肪肝的风险。';
                index = 2;
            } else if (visfat >= 10 && visfat < 13) {
                color = '#FFA93C';
                titleStr = 'II级:存在轻度脂肪肝的风险。';
                index = 3;
            } else if (visfat >= 13 && visfat < 15) {
                color = '#E41237';
                titleStr = 'III级:存在中度脂肪肝的风险。';
                index = 4;
            } else if (visfat >= 15) {
                color = '#E41237';
                titleStr = 'IV:存在重度脂肪肝的风险。';
                index = 5;
            }

            return (
                <View style={{
                    height: 140,
                    width: screenWidth,
                    backgroundColor: '#F4F4F4',
                }}>
                    <View style={styles.fattyLiverRiskView}>
                        {this.renderTitleView("脂肪肝风险等级")}
                        <View>
                            <View style={{
                                flexDirection: "row",
                                justifyContent: 'center',
                                width: screenWidth - 20,
                                alignItems: 'center',
                                height: 60
                            }}>
                                {this.renderFattyLiverRiskSubview("0级", 1, index, color)}
                                {this.renderFattyLiverRiskSubview("Ⅰ级", 2, index, color)}
                                {this.renderFattyLiverRiskSubview("Ⅱ级", 3, index, color)}
                                {this.renderFattyLiverRiskSubview("Ⅲ级", 4, index, color)}
                                {this.renderFattyLiverRiskSubview("Ⅳ级", 5, index, color)}
                            </View>
                            <Text style={{
                                textAlign: 'center',
                                fontSize: 12,
                                color: "rgba(153, 153, 153, 1.0)",
                                top: 22,
                            }}>{titleStr}</Text>
                        </View>
                    </View>
                </View>
            )
        } else {
            return <View style={{height: 1, backgroundColor: '#F4F4F4'}}/>
        }

    }

    /*脂肪肝风险等级 subview*/
    renderFattyLiverRiskSubview(title, index, indexType, bgColor) {

        var color;
        if (index == indexType) {
            color = bgColor;
        } else {

            color = "rgba(222, 222, 222, 1.0)";
        }
        return (
            <View style={styles.fattyLiverRiskSubview}>
                <View style={[styles.fattyLiverRiskSubview_base, {backgroundColor: color}]}>
                    <Text style={styles.fattyLiverRiskSubview_txet}>{title}</Text>
                </View>
            </View>
        )
    }


    /*体型判断 subview*/
    renderBodyShapeSubView(index) {

        var bgImg;
        var frImg;
        var title;
        var showStr;
        switch (index) {
            case 0: {
                bgImg = require("../imgs/bodyshape/invisible_fat_1.png");
                frImg = require("../imgs/bodyshape/invisible_fat_2.png");
                title = "您的体型属于隐形肥胖型，得多进行有氧运动，否则很容易成为真胖子了！";
                showStr = "隐形肥胖型";
                break;
            }
            case 1: {
                bgImg = require("../imgs/bodyshape/pianpang_1.png");
                frImg = require("../imgs/bodyshape/pianpang_2.png");
                title = "您的体型属于偏胖型，控制饮食和加强有氧运动能够助您降低脂肪！";
                showStr = "偏胖型";
                break;
            }
            case 2: {
                bgImg = require("../imgs/bodyshape/fat_1.png");
                frImg = require("../imgs/bodyshape/fat_2.png");
                title = "您的体型属于肥胖型，控制饮食和加强有氧运动能够助您降低脂肪！";
                showStr = "肥胖型";
                break;
            }
            case 3: {
                bgImg = require("../imgs/bodyshape/pianmuscle_1.png");
                frImg = require("../imgs/bodyshape/pianmuscle_2.png");
                title = "您的体型属于偏瘦肌肉型，继续保持！";
                showStr = "偏瘦肌肉型";
                break;
            }
            case 4: {
                bgImg = require("../imgs/bodyshape/standard_1.png");
                frImg = require("../imgs/bodyshape/standard_2.png");
                title = "您的体型属于标准型，继续保持！";
                showStr = "标准型";
                break;
            }
            case 5: {
                bgImg = require("../imgs/bodyshape/more_muscle_1.png");
                frImg = require("../imgs/bodyshape/more_muscle_2.png");
                title = "您的体型属于非常肌肉型，继续保持！";
                showStr = "非常肌肉型";
                break;
            }
            case 6: {
                bgImg = require("../imgs/bodyshape/pianshou_1.png");
                frImg = require("../imgs/bodyshape/pianshou_2.png");
                title = "您的体型属于偏瘦型，需要加强营养了！";
                showStr = "偏瘦型";
                break;
            }
            case 7: {
                bgImg = require("../imgs/bodyshape/standard_muscle_1.png");
                frImg = require("../imgs/bodyshape/standard_muscle_2.png");
                title = "您的体型属于标准肌肉型，继续保持！";
                showStr = "标准肌肉型";
                break;
            }
            case 8: {
                bgImg = require("../imgs/bodyshape/lack_sport_1.png");
                frImg = require("../imgs/bodyshape/lack_sport_2.png");
                title = "您的体型属于运动不足型，需要运动起来了！";
                showStr = "运动不足型";
                break;
            }
        }
        return (
            <View style={{flexDirection: 'row', width: 100, alignItems: 'center', top: 19,}}>
                <Text style={{width: 210, left: 25, fontSize: 14, color: "#808080"}}>{title}</Text>
                <View style={{width:10}}/>
                <View style={styles.bodyShapeSubView}>
                    <Image style={styles.bodyShapeSubView_icon } source={(bgImg)}>
                        <Image style={[styles.bodyShapeSubView_icon, {tintColor: this.props.themeColor}] }
                               source={(frImg)}/>
                    </Image>
                    <Text style={{fontSize: 10, color: this.props.themeColor, paddingTop: 3}}>{showStr}</Text>
                </View>
            </View>
        )
    }

    /*健康评估 */
    renderScoreView(score) {

        var scoreIcon;
        if (score < 60) {
            scoreIcon = require("../imgs/deepinReport_health_assessment_level_3.png");
        } else if (score >= 60 && score < 80) {
            scoreIcon = require("../imgs/deepinReport_health_assessment_level_2.png");
        } else if (score >= 80 && score < 90) {
            scoreIcon = require("../imgs/deepinReport_health_assessment_level_1.png");
        } else if (score >= 90) {
            scoreIcon = require("../imgs/deepinReport_health_assessment_level_0.png");
        }
        const scoreString = score + "分";
        const  integerStr =String( Math.floor(score));
        const bigScore = integerStr + " " + scoreString.substr(integerStr.length, 1) + " ";
        const smallScore = scoreString.substr(integerStr.length + 1, scoreString.length - integerStr.length - 2) + " " + scoreString.substr(scoreString.length - 1, 1);
        console.log(bigScore,integerStr.length);
        return (
            <View style={{flexDirection: 'row', alignItems: 'center', height: 125, left: 35}}>
                <Text style={{
                    fontSize: 50,
                    color: this.props.themeColor,
                    paddingTop: -5,
                    fontWeight: "300"
                }}>{bigScore}</Text>
                <Text style={{
                    fontSize: 25,
                    color: this.props.themeColor,
                    paddingTop: 8,
                    fontWeight: "400"
                }}>{smallScore}</Text>
                <Image style={{left: -30, width: 123, height: 123}} source={(scoreIcon)}/>
            </View>
        )
    }

    /*尾部显示*/
    renderFooterView(){

        if (this.props.shieldUserInfo == 1){
            return (
                <View style={{height:20}}/>
            )
        }else  {
            console.log('yyyyyyyy')
            return (
                <ReportCorderView
                    isShareFlag={this.state.isShareFlag}
                    themeColor={this.props.themeColor}
                />
            )
        }
    }

    /*绘制view*/
    render() {

        return (
            <ScrollView showsVerticalScrollIndicator={false} style={{backgroundColor: '#F4F4F4'}}>
                <View style={{backgroundColor: '#F4F4F4'}} onLayout={(e) => this.onLayout(e)}>
                    {/*用户资料*/}
                    {this.renderUserInfoView()}
                    {/*体重脂肪骨骼肌*/}
                    <View style={styles.weightInfoView}>
                        {this.renderWeightInfoSubview("体重", this.state.weight)}
                        <View style={{width: 1, height: 30, backgroundColor: "#F4F4F4"}}></View>
                        {this.renderWeightInfoSubview("体脂率", this.state.bodyfat)}
                        <View style={{width: 1, height: 30, backgroundColor: "#F4F4F4"}}></View>
                        {this.renderWeightInfoSubview("骨骼肌率", this.state.muscle)}
                    </View>
                    {/*体重控制*/}
                    <View style={{
                        height: 200,
                        width: screenWidth,
                        backgroundColor: '#F4F4F4',
                    }}>
                        <View style={styles.weightControlView}>
                            {this.renderTitleView("体重控制")}
                            <View style={{top: 30}}>
                                <View style={styles.weightControlView_base}>
                                    {this.renderWeightControlSubview(0, this.state.fatWeight)}
                                    {this.renderWeightControlSubview(1, this.state.weightControl)}
                                </View>
                                <View style={styles.weightControlView_base}>
                                    {this.renderWeightControlSubview(2, this.state.fatControl)}
                                    {this.renderWeightControlSubview(3, this.state.muscaleControl)}
                                </View>
                            </View>
                        </View>
                    </View>

                    {/*肌肉控制*/}
                    <View style={{
                        height: 180,
                        width: screenWidth,
                        backgroundColor: '#F4F4F4',
                    }}>
                        {this.renderMuscleControlSubview(this.state.muscleType)}
                    </View>

                    {/*营养状况*/}
                    <View style={{
                        height: 160,
                        width: screenWidth,
                        backgroundColor: '#F4F4F4',
                    }}>
                        <View style={styles.nutritionInfoView}>
                            {this.renderTitleView("营养状况")}
                            <View style={{flexDirection: "row", alignItems: 'center'}}>
                                <View style={{width: 30, height: 90}}/>
                                {this.renderNutritionInfoSubview('蛋白质', this.state.proteinType)}
                                {this.renderNutritionInfoSubview('无机盐', this.state.saltType)}
                                {this.renderNutritionInfoSubview('体脂肪', this.state.bodyFatType)}
                            </View>
                        </View>
                    </View>

                    {/*肥胖状况*/}
                    <View style={{
                        height: 190,
                        width: screenWidth,
                        backgroundColor: '#F4F4F4',
                    }}>
                        <View style={styles.fatInfoView}>
                            {this.renderTitleView("肥胖状况")}
                            <View style={{flexDirection: "row", alignItems: 'center'}}>
                                <View style={{width: 20, height: 90}}/>
                                <View >
                                    {this.renderBMIAndBodyfatInfoView(this.state.BMIType, this.state.bodyFatType)}
                                    {this.renderWaistlineAndHipView(this.state.hipType)}
                                </View>
                            </View>
                        </View>
                    </View>

                    {/*能量消耗*/}
                    <View style={{
                        height: 180,
                        width: screenWidth,
                        backgroundColor: '#F4F4F4',
                    }}>
                        <View style={styles.energyInfoView}>
                            {this.renderTitleView("能量消耗状态")}
                            <View style={styles.bmrAndbodyAgeInfoView}>
                                {this.renderBMRInfoView(this.state.baselMetabolicRateType)}
                                {this.renderBodyAgeInfoView(this.state.bodyAgeType)}
                            </View>
                        </View>
                    </View>
                    {/*脂肪肝风险等级*/}
                    {this.renderFattyLiverRiskView(this.state.visfat)}

                    {/*体形判断*/}
                    <View style={{
                        height: 140,
                        width: screenWidth,
                        backgroundColor: '#F4F4F4',
                    }}>
                        <View style={styles.bodyShapeView}>
                            {this.renderTitleView("体形判断")}
                            {this.renderBodyShapeSubView(this.state.bodyType)}
                        </View>
                    </View>
                    {/*健康评估*/}
                    <View style={{
                        height: 150,
                        width: screenWidth,
                        backgroundColor: '#F4F4F4',
                    }}>
                        <View style={styles.healthScoreView}>
                            {this.renderTitleView("健康评估")}
                            {this.renderScoreView(this.state.healthScore)}
                        </View>
                    </View>

                    {/*尾部view*/}
                    {this.renderFooterView()}

                </View>
            </ScrollView>
        )
    }
}
/*组件 style*/
const styles = StyleSheet.create({

    /*用户信息view style*/
    userInfoView: {
        width: screenWidth,
        height: 90,
        backgroundColor: 'white',
        flexDirection: 'row',//主轴水平
        alignItems: 'center',
    },
    userInfoView_baseImage: {
        width: screenWidth,
        height: 90,
        backgroundColor: 'white',
        flexDirection: 'row',//主轴水平
        alignItems: 'center',
    },
    userInfoView_userIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        left: 15,
        top: 10,
    },
    userInfoView_baseTextView: {
        width: 190,
        height: 90,
        backgroundColor: 'rgba(15,190,240,0.0)',
        alignItems: 'center',
        justifyContent: 'center',
        top: 10,
    },
    userInfoView_userNameText: {
        width: 140,
        backgroundColor: 'rgba(15,190,240,0.0)',
        fontSize: 22,

    },
    userInfoView_userTimeText: {
        width: 150,
        backgroundColor: 'rgba(15,190,240,0.0)',
        fontSize: 14,
        top: 5,
    },


    //二维码
    coderStyle: {
        position: 'absolute',
        height: 65,
        width: 50,
        marginTop: 10,
        marginLeft: screenWidth - 60,
    },
    coderImageStyle: {
        width: 50,
        height: 50,
    },
    coderTitleStyle: {
        fontSize: 10,
        textAlign: 'center',
        color: "#999999"
    },


    /*标题view style*/
    titleView: {
        width: screenWidth - 20,
        height: 20,
        backgroundColor: 'white',
        flexDirection: 'row',//主轴水平
        alignItems: 'center',
        top: 16,
    },
    titleView_icon: {
        width: 4,
        height: 20,
    },
    titleView_text: {
        width: 150,
        fontSize: 14,
        left: 10,
        color: "#4D4D4D",
    },


    /*体重信息 Style*/
    weightInfoView: {//第一部分体重脂肪骨骼
        width: screenWidth,
        height: 92,
        backgroundColor: 'white',
        flexDirection: 'row',//主轴水平
        alignItems: 'center',
    },
    weightInfoSubview: {
        width: screenWidth / 3,
        backgroundColor: 'white',
        alignItems: 'center',
    },
    weightInfoSubview_text: {
        fontSize: 18,
        textAlign: 'center',
        color: "#333333",
        paddingTop: -4,
    },
    weightInfoSubview_textUnit: {
        textAlign: 'center',
        color: "#333333",
        paddingTop: -1,
    },
    weightInfoSubview_title: {
        width: screenWidth / 3,
        fontSize: 14,
        textAlign: 'center',
        color: "#999999",
        paddingTop: 4,
    },


    /*体重控制 style*/
    weightControlView: {
        height: 190,
        width: screenWidth - 20,
        top: 10,
        left: 10,
        borderRadius: 5,
        backgroundColor: 'white',
    },
    weightControlView_base: {//第二部分体重控制
        width: screenWidth - 20,
        height: 68,
        backgroundColor: "white",
        flexDirection: "row",
        alignItems: 'center',
    },
    weightControlSubview: {
        width: (screenWidth - 20) / 2,
        height: 68,
        backgroundColor: 'white',
        alignItems: 'center',
        flexDirection: 'column',
    },
    weightControlSubview_titleView: {
        width: (screenWidth - 20) / 2,
        backgroundColor: 'white',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        // top:22,
        // position: 'absolute',
    },
    weightControlSubview_icon: {
        width: 15,
        height: 15,
    },
    weightControlSubview_text: {
        fontSize: 17,
        color: "#333333",
        paddingTop: 10,
    },
    weightControlSubview_showStr: {
        fontSize: 11,
        color: "#333333",
        paddingTop: 13,
    },
    weightControlSubview_title: {

        fontSize: 12,
        color: "#999999",
        paddingLeft: 5,
    },


    /*肌肉控制 style*/
    muscleControlView: {
        height: 170,
        width: screenWidth - 20,
        top: 10,
        left: 10,
        borderRadius: 5,
        backgroundColor: 'white',
    },
    muscleInfoView: {
        width: screenWidth - 20,
        height: 110,
        backgroundColor: "white",
        flexDirection: "row",
        alignItems: 'center',
        top: 25,
    },
    muscleInfoView_icon: {
        width: 88,
        height: 110,
        backgroundColor: "white",
        flexDirection: "column",
        justifyContent: 'center',
        alignItems: 'flex-start',
        resizeMode: 'cover',
    },
    muscleInfoView_textView: {
        backgroundColor: "white",
        flexDirection: "row",
        alignItems: 'center',
    },
    muscleInfoView_icon_text: {
        width: 88,
        backgroundColor: "#FFFFFF00",
        textAlign: 'center',
        fontSize: 14,
    },
    muscleInfoView_text: {
        fontSize: 18,
        color: "#333333",
        paddingTop: 6,
        paddingBottom: 10,
    },
    muscleInfoView_textUnit: {
        fontSize: 12,
        color: "#333333",
        paddingTop: 10,
        paddingBottom: 10,
    },
    muscleInfoView_title: {
        fontSize: 12,
        color: "#999999",
        paddingTop: 10,
        paddingBottom: 10,
    },


    /*营养状况*/
    nutritionInfoView: {
        height: 145,
        width: screenWidth - 20,
        top: 10,
        left: 10,
        borderRadius: 5,
        backgroundColor: 'white',
    },
    nutritionInfoSubview: {

        width: 80,
        height: 90,
        justifyContent: 'center',
        alignItems: 'center',
    },
    nutritionInfoSubview_base: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        top: 15,
    },
    nutritionInfoSubview_subview: {
        width: 41,
        height: 41,
        borderRadius: 20.5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    nutritionInfoSubview_text: {
        width: 80,
        textAlign: 'center',
        fontSize: 12,
        backgroundColor: "#FFFFFF00",
    },
    nutritionInfoSubview_title: {
        width: 80,
        fontSize: 12,
        textAlign: 'center',
        color: "#999999",
        // top:-5,
    },


    /*肥胖状况*/
    fatInfoView: {
        height: 180,
        width: screenWidth - 20,
        top: 10,
        left: 10,
        borderRadius: 5,
        backgroundColor: 'white',
    },
    BMIAndBodyfatInfoView: {
        width: screenWidth - 20,
        height: 55,
        justifyContent: 'center',
        top: 22,
    },
    BMIAndBodyfatInfoView_title: {
        fontSize: 11,
        width: 35,
        textAlign: 'center',
    },
    BMIAndBodyfatInfoView_base: {
        width: 260,
        height: 25,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    BMIAndBodyfatInfoView_icon_show: {
        width: 13,
        height: 15,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    BMIAndBodyfatInfoView_icon_line: {
        width: 260,
        height: 3,
        borderRadius: 1.5,
        flexDirection: 'row',
        top: 6,
    },
    BMIAndBodyfatInfoView_icon_view: {
        width: 260,
        height: 30,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.0)',
        alignItems: 'center',
    },
    BMIAndBodyfatInfoView_icon_text: {
        width: 87,
        top: 3,
        textAlign: 'center',
        fontSize: 10,
        color: "#999999",
        paddingTop: 5,

    },
    waistlineAndHipSubView: { //腰臀围类型baseView
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    waistlineAndHipSubView_icon: { //腰臀围图片
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },


    /*能量消耗状况*/
    energyInfoView: {
        height: 170,
        width: screenWidth - 20,
        top: 10,
        left: 10,
        borderRadius: 5,
        backgroundColor: 'white',
    },
    bmrAndbodyAgeInfoView: {
        width: screenWidth - 20,
        height: 120,
        justifyContent: 'center',
        flexDirection: 'row',
        top: 17,
    },
    bmrInfoView_base: {//bmr底层view
        width: (screenWidth - 20) * 0.5,
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bmrInfoView_icon_one: {//bmr显示图片一（条）
        width: 5,
        height: 71,
    },
    bmrInfoView_icon_two: {//bmr显示图片二（圈）
        left: (screenWidth - 20) * 0.25 - 9.5,
        width: 19,
        height: 19,
        position: 'absolute',
    },
    bmrInfoView_icon_three: {//bmr显示图片三（气泡）
        left: (screenWidth - 20) * 0.25 + 18,
        width: 43,
        height: 27,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bmrInfoView_icon_ShowText: {//bmr指示文本
        backgroundColor: "#FFFFFF00",
        fontSize: 12,
        textAlign: 'center',
        left: 2,
    },
    bmrInfoView_title: {//bmr
        fontSize: 12,
        color: '#999999',
        top: 15,
    },
    bodyAgeInfoView_base: {//体年龄底层view
        width: (screenWidth - 20) * 0.5,
        height: 120,
        justifyContent: 'center',
    },
    bodyAgeInfoView_icon_one: {//体年龄显示图片一（
        width: 49.5,
        height: 71,
        left: 20,
    },
    bodyAgeInfoView_icon_two: {//体年龄显示图片二（气泡）
        left: (screenWidth - 20) * 0.25 + 2,
        width: 43,
        height: 27,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bodyAgeInfoView_icon_ShowText: {//体年龄指示文本
        backgroundColor: "#FFFFFF00",
        fontSize: 12,
        textAlign: 'center',
        left: 2,
    },
    bodyAgeInfoView_title: {//体年龄
        fontSize: 12,
        color: '#999999',
        top: 15,
        left: 20,
        backgroundColor: "#FFFFFF00",
    },


    /*脂肪肝等级*/
    fattyLiverRiskView: {
        height: 130,
        width: screenWidth - 20,
        top: 10,
        left: 10,
        borderRadius: 5,
        backgroundColor: 'white',
    },
    fattyLiverRiskSubview: {
        width: 41,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "rgba(255, 255, 255, 1.0)",
        top: 22,
    },
    fattyLiverRiskSubview_base: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fattyLiverRiskSubview_txet: {
        width: 41,
        fontSize: 14,
        textAlign: "center",
        backgroundColor: 'rgba(255, 255, 255, 0.0)',
        color: "rgba(255, 255, 255, 1.0)",
    },


    /*体型判断subView*/
    bodyShapeView: {
        height: 130,
        width: screenWidth - 20,
        top: 10,
        left: 10,
        borderRadius: 5,
        backgroundColor: 'white',

    },

    bodyShapeSubView: {

        width: 65,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        top: -10,
    },
    bodyShapeSubView_icon: {
        width: 29,
        height: 63,
        resizeMode: 'contain',
    },

    /*健康评估*/
    healthScoreView: {
        height: 140,
        width: screenWidth - 20,
        top: 10,
        left: 10,
        borderRadius: 5,
        backgroundColor: 'white',
    },

});

