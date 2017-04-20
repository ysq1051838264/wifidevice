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
    ToastAndroid,
    AlertIOS,
    Alert,
    NativeModules,
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
            isSelectFlag: true,
            loadingFlag: true ,
            dataSource: ds,
        };
    }

    componentDidMount() {
        MeasureHttp.fetchUnknownMeasure(this.props.userid, this.props.lastSynTime, this.props.previousDataTime)
            .then(data => {
                console.log('未知测量数据请求成功', data);
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(data.slice(0)),
                    loadingFlag: false,
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
        this.weightUnit = this.props.weightUnit;

        Api.saveSessionKey(this.props.sessionKey);
        Api.savePublicParams(this.props);

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

        var checkView;
        if (rowData.isSelected) {
            checkView = (<View style={styles.checkView}>
                    <Icon name={'check-circle'}
                          size={PixelRatio.getPixelSizeForLayoutSize(12)}
                          color={themeColor}></Icon>
                </View>
            )
        } else {
            checkView = null
        }

        var dataRowView = (<View style={{backgroundColor: 'white', flexDirection: 'row', height: 54}}>
            <View style={{flex: 1}}>
                <View style={{flexDirection: 'row', marginLeft: 15, marginTop: 3}}>
                    <Text style={{color: 'black', fontSize: 20,}}> {weight} </Text>
                    <Text style={{marginTop: 8, color: 'black', fontSize: 11}}> {this.weightUnit} </Text>
                </View>
                <Text style={styles.textLeft}>{this.stringToFormatString(rowData.local_updated_at)}</Text>
            </View>
            {checkView}
            <View style={styles.lineStyle}/>
        </View>);

        var view;
        if (this.state.isSelectFlag) {
            view = (<TouchableOpacity style={{flex: 1}}
                                      activeOpacity={0.5}
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
        if (Platform.OS == 'ios') {
            NativeModules.QNUI.popViewController();
        } else {
            BackAndroid.exitApp();
        }
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
            Platform.OS === 'android' ? ToastAndroid.show("亲，您未选中任何数据哦~", ToastAndroid.SHORT) : AlertIOS.alert("亲，您未选中任何数据哦~");
            return;
        } else {
            var length = this.listData.length;

            for (var i = 0; i < this.listData.length; i++) {
                if (this.listData[i].isSelected) {
                    var value = this.listData[i].data_id;
                    if (i < this.listData.length - 1) {
                        if (flag)
                            string = string + "," + value;
                        else {
                            flag = true
                            string = string + value
                        }
                    } else {
                        if (flag)
                            string = string + "," + value;
                        else
                            string = string + value
                    }
                }
            }
        }

        if (deleteFlag) {
            console.log("删除最后的值", string);
            if (Platform.OS == 'ios'){
              AlertIOS.alert(
                '',
                '您确定要删除么？',
                [
                  {text: '取消',onPress: () => console.log("点击取消")},
                  {text: '确定', onPress: () => {this.deleteUnKnow(string)}},
                ]
              )
            }else{
              NativeModules.QNUI.onMessageDailog("您确定要删除么？")
                .then(data => {
                    if (data.tipsFlag) {
                        this.setState({
                            loadingFlag: true,
                        });

                        MeasureHttp.deleteInvalidData(string)
                            .then(flag => {
                                this.updateData();
                            })
                            .catch(e => {
                                console.log("请求失败", e)
                            });

                    }
                }).catch(e => {
                console.log(e.message)
              });
            }
        } else {
            console.log("配对最后的值", string);
            this.setState({
                loadingFlag: true,
            });
            MeasureHttp.assignInvalidData(this.props.userid, string)
                .then(data => {
                    this.updateData();
                })
                .catch(e => {
                    console.log("请求失败", e)
                });
        }

    }
    cancelDeleteUnKnow(){
    console.log('取消')
    }

    deleteUnKnow(dataId){
        console.log('开始删除请求');
      this.setState({
        loadingFlag: true,
      });

      MeasureHttp.deleteInvalidData(dataId)
        .then(flag => {
          this.updateData();
        })
        .catch(e => {
          console.log("请求失败", e)
        });
    }

    updateData() {
        MeasureHttp.fetchUnknownMeasure(this.props.userid, this.props.lastSynTime, this.props.previousDataTime)
            .then(data => {
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(data.slice(0)),
                    loadingFlag: false,
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

        var view;
        if (this.state.isSelectFlag) {
            view = (<View style={[commonStyles.main, commonStyles.wrapper]}>
                <NavigationBar title={'未知测量'} leftTitle={'取消'}
                               color={this.props.themeColor}
                               leftAction={this.onPressCancel.bind(this)}
                               rightTitle={'全选'}
                               animateFlag={this.state.loadingFlag}
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
                               color={this.props.themeColor}
                               leftAction={this.onPressBack.bind(this)}
                               rightAction={this.onPressSelectData.bind(this)}/>
                <View style={styles.container}>
                    <ListView
                        dataSource={dataSource}
                        renderRow={this._renderRow.bind(this)}/>
                </View>
            </View>);
        }

        return (
            <View style={[commonStyles.main, commonStyles.wrapper, {backgroundColor: 'white'}]}>
                {view}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
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
        marginRight: 15,
        height: 50,
        position: 'relative'
    },

    textLeft: {
        marginLeft: 20,
        bottom: 5,
        marginTop: 4,
        color: '#999999'
    },

    bottomButton: {
        height: 50,
        backgroundColor: '#F4F4F4',
        flexDirection: 'row',
        justifyContent: 'center'
    },

    deleteButton: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 23,
        borderWidth: 0.5,
        borderColor: '#999999',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
        marginRight: 8,
        height: Platform.OS == 'ios' ? 40 : 45,
        marginTop: Platform.OS == 'ios' ? 5 : 3,
    },

    saveButton: {
        flex: 1,
        borderRadius: 23,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        marginLeft: 8,
        height: Platform.OS == 'ios' ? 40 : 45,
        marginTop: Platform.OS == 'ios' ? 5 : 3,
    },

    lineStyle: {
        flex: 1,
        position: 'absolute',
        backgroundColor: '#E6E6E6',
        width: Dimensions.get('window').width,
        height: 0.5,
        bottom: 1,
        marginLeft: 20,
    },

});
