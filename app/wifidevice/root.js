import React, {Component} from 'react';
import {Navigator} from 'react-native';
import * as Storage from './utils/Storage';
import UserInfo from './utils/UserInfo';
import WifiConfigSecond from './pages/WifiConfigSecond';
import WifiConfigFirst from './pages/WifiConfigFirst';
import Api from './http/api';

export default class root extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        Api.saveSessionKey(this.props.sessionKey);
        Api.savePublicParams(this.props);
        UserInfo.saveUserId(this.props);
        Storage.saveSessionKey(this.props.sessionKey);
        Storage.saveThemeColor(this.props.themeColor);
    }

    renderScene(route, navigator) {
        let Component = route.component;
        return <Component {...route.params} navigator={navigator}/>
    }

    configureScene(route) {
        return Navigator.SceneConfigs.FloatFromRight; // 右侧弹出
    }

    render() {
        var view;
        if(this.props.isWiFiFlag){
            view = (<Navigator
                ref={view => this.navigator = view}
                initialRoute={{
                    component: WifiConfigSecond,
                    name: 'wifi_config_second',
                    params: {
                        themeColor: this.props.themeColor,
                    }
                }}
                configureScene={this.configureScene.bind(this)}
                renderScene={this.renderScene.bind(this)}
            />);
        } else{
            view = (<Navigator
                ref={view => this.navigator = view}
                initialRoute={{
                    component: WifiConfigFirst,
                    name: 'wifi_config_first',
                    params: {
                        themeColor: this.props.themeColor,
                    }
                }}
                configureScene={this.configureScene.bind(this)}
                renderScene={this.renderScene.bind(this)}
            />);
        }
        return (view);
    }
}

