/**
 * Created by ysq on 17/3/6.
 */

import React, {Component} from 'react'
import MeasureHttp from "../http/MeasureHttpClient";
import Api from "../http/api";
import * as Storage  from "../utils/Storage";
import NavigationBar from "../component/NavigationBar";
import commonStyles from '../styles/common';
import QNButton from '../component/QNButton';
import LoadingView from '../component/LoadingView';
import Icon from 'react-native-vector-icons/FontAwesome';

import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    Button,
    PixelRatio,
    BackAndroid,
    Platform,
    ListView,
    Alert,
} from 'react-native'

var dateFormat = require('dateformat');

export default class UnMeasureData extends Component {
    constructor(props) {
        super(props);

        this.listData = [];

        this.weightUnit = '';

        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => {
                return r1 !== r2
            }
        });

        this.state = {
            animateFlag: true,
            isSelectFlag: false,
            dataSource: ds,
        };
    }

    componentDidMount() {
        MeasureHttp.fetchUnknownMeasure(this.props.userid, this.props.lastSynTime, this.props.previousDataTime)
            .then(data => {
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(data.slice(0)),
                    animateFlag: false
                });
                this.listData = data;
            })
            .catch(e => {
                console.log("ysq请求失败", e.message)
            })
    }

    componentWillMount() {
        if (Platform.OS === 'android') {
            BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);
        }

        console.log("打印传过来的值：" + this.props.weightUnit + this.props.cellphone_type);

        this.weightUnit = this.props.weightUnit;

        Api.saveSessionKey(this.props.sessionKey);
        Storage.saveSessionKey(this.props.sessionKey);
        Storage.saveThemeColor(this.props.themeColor);
    }

    componentWillUnmount() {
        if (Platform.OS === 'android') {
            BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid);
        }
    }

    onBackAndroid = () => {
        if (this.state.isSelectFlag) {
            this.onPressCancel();
            return true;
        }
        return false;
    };


    _renderHeader() {
        return (
            <View style={styles.header}>
                <Text style={{fontSize: 15, color: '#999999'}}>分配数据到 {this.props.username} </Text>
            </View>
        );
    }

    _pressRow(rowData, sectionID, rowID) {
        var newRowData = Object.assign({}, rowData, {isSelected: !rowData.isSelected});
        var listData = this.listData.slice();
        listData[rowID] = newRowData;
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(listData),
        });
        this.listData = listData;
    }

    _renderRow(rowData, sectionID, rowID) {
        const themeColor = this.props.themeColor;
        var weight;
        if (this.weightUnit === '斤') {
            weight = rowData.weight * 2
        } else
            weight = rowData.weight;

        console.log("打印rowData.isSelected  " + rowID + "  --  " + rowData.isSelected)

        var checkView;
        if (rowData.isSelected) {
            checkView = (<View style={styles.checkView}>
                    <Icon name={'check-circle'}
                          size={PixelRatio.getPixelSizeForLayoutSize(12)}
                          color="#00B4F7"></Icon>
                </View>
            )
        } else {
            checkView = null
        }

        var dataRowView = (<View style={{backgroundColor: 'white', flexDirection: 'row', height: 50}}>
            <View style={{flex: 1}}>
                <View style={{flexDirection: 'row', marginLeft: 20, marginTop: 5}}>
                    <Text style={{color: 'black', fontSize: 16}}> {weight} </Text>
                    <Text> {this.weightUnit} </Text>
                </View>
                <Text style={styles.textLeft}>
                    {this.stringToFormatString(rowData.local_updated_at)}
                </Text>
            </View>
            {checkView}
            <View style={styles.lineStyle}/>
        </View>);

        var view;
        if (this.state.isSelectFlag) {
            view = (<TouchableOpacity style={{flex: 1}}
                                      onPress={() => this._pressRow(rowData, sectionID, rowID)}>
                {dataRowView}
            </TouchableOpacity>)
        } else {
            view = (<View >{dataRowView}</View>)
        }

        return (<View style={{flex: 1}}>
            {view}
        </View>);
    }

    onPressAllSelect() {
        var allSelected = this.listData.findIndex(item => !item.isSelected) == -1

        this.listData = this.listData.map(item => Object.assign({}, item, {isSelected: !allSelected}))

        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.listData)
        });
    }

    onPressSelectData() {
        this.listData = this.listData.map(item => Object.assign({}, item, {isSelected: false}))
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.listData),
        });

        this.setState({
            isSelectFlag: true,
        })
    }

    onPressBack() {
        BackAndroid.exitApp();
    }

    onPressCancel() {
        this.listData = this.listData.map(item => Object.assign({}, item, {isSelected: false}))

        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.listData),
        });

        this.setState({
            isSelectFlag: false,
        });
    }

    onPressDelete() {
        this.onPressSelect(true)
    }

    onPressSave() {
        this.onPressSelect(false)
    }

    onPressSelect(deleteFlag) {
        var string = '';
        let flag = false
        if (this.listData.findIndex(item => item.isSelected == true) == -1) {
            Alert.alert('温馨提醒', '没有选中任何数据');
            return;
        } else {
            var length = this.listData.length;

            for (var i = 0; i < this.listData.length; i++) {
                if (this.listData[i].isSelected) {
                    var value = this.listData[i].data_id;
                    if (i < this.listData.length - 1) {
                        if (flag)
                            string = string + "," + value
                        else {
                            flag = true
                            string = string + value
                        }
                    } else {
                        if (flag)
                            string = string + "," + value
                        else
                            string = string + value
                    }
                }
            }
        }

        if (deleteFlag) {
            console.log("删除最后的值", string)
            MeasureHttp.deleteInvalidData(string)
                .then(flag => {
                    console.log("打印删除之后的值", flag)
                    this.updateData();
                })
                .catch(e => {
                    console.log("请求失败", e)
                });

        } else {
            console.log("配对最后的值", string)
            MeasureHttp.assignInvalidData(this.props.userid, string)
                .then(data => {
                    this.updateData();
                })
                .catch(e => {
                    console.log("请求失败", e)
                });
        }

    }

    updateData() {
        MeasureHttp.fetchUnknownMeasure(this.props.userid, this.props.lastSynTime, this.props.previousDataTime)
            .then(data => {
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(data.slice(0)),
                });
                this.listData = data;
            })
            .catch(e => {
                console.log("ysq请求失败", e.message)
            })
    }

    stringToFormatString(dateStr) {
        var temp = dateStr.replace(/-/g, "/");
        var date = new Date(Date.parse(temp));
        var time = dateFormat(date, "yyyy年mm月dd日  HH:MM")
        return time;
    }

    render() {
        const {dataSource} = this.state;

        if (this.state.animateFlag) {
            return <LoadingView animateFlag={this.state.animateFlag}/>;
        }

        var view;
        if (this.state.isSelectFlag) {
            view = (<View style={[commonStyles.main, commonStyles.wrapper]}>
                <NavigationBar title={'未知测量'} leftTitle={'取消'}
                               leftAction={this.onPressCancel.bind(this)}
                               rightTitle={'全选'}
                               rightAction={this.onPressAllSelect.bind(this)}/>
                <View
                    style={styles.container}>
                    <ListView
                        dataSource={dataSource}
                        renderHeader={this._renderHeader.bind(this)}
                        renderRow={this._renderRow.bind(this)}/>
                </View>

                <View style={styles.bottomButton}>
                    <QNButton btnStyle={styles.deleteButton} color={'#ffffff'}
                              textColor={this.props.themeColor}
                              title={'删除'}
                              width={Dimensions.get('window').width / 3}
                              onPress={this.onPressDelete.bind(this)}/>

                    <QNButton btnStyle={styles.saveButton}
                              color={this.props.themeColor}
                              title={'分配'}
                              width={Dimensions.get('window').width / 3}
                              onPress={this.onPressSave.bind(this)}/>
                </View>

            </View>);
        } else {
            view = (<View style={[commonStyles.main, commonStyles.wrapper]}>
                <NavigationBar title={'未知测量'} rightTitle={'选取'}
                               leftAction={this.onPressBack.bind(this)}
                               rightAction={this.onPressSelectData.bind(this)}/>
                <View
                    style={styles.container}>
                    <ListView
                        dataSource={dataSource}
                        renderRow={this._renderRow.bind(this)}/>
                </View>
            </View>);
        }

        return (
            <View style={[commonStyles.main, commonStyles.wrapper]}>
                {view}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 10,
        marginTop: 5,
    },

    checkView: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginRight: 10,
        height: 50,
        position: 'relative'
    },

    textLeft: {
        marginLeft: 20,
        bottom: 5,
        marginTop: 5,
    },

    bottomButton: {
        height: 50,
        backgroundColor: '#F4F4F4',
        flexDirection: 'row',
        alignItems: 'flex-end',
        bottom: 5,
        justifyContent: 'center'
    },

    deleteButton: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#999999',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
        marginRight: 5,
    },

    saveButton: {
        flex: 1,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        marginLeft: 5,
    },

    lineStyle: {
        flex: 1,
        position: 'absolute',
        backgroundColor: 'rgb(230,230,230)',
        width: Dimensions.get('window').width,
        height: 1,
        bottom: 1,
        marginLeft: 20,
    },

});
