import React, {Component} from 'react';
import {Navigator} from 'react-native';
import * as Storage from './utils/Storage';
import MainPage from './pages/main';
import WifiConfigSecond from './pages/WifiConfigSecond';
import Api from './http/api';

export default class root extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        Api.saveSessionKey(this.props.sessionKey);
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
                    name: 'main-page',
                    component: MainPage,
                    params: {
                        isWiFiFlag: this.props.isWiFiFlag,
                    }
                }}
                configureScene={this.configureScene.bind(this)}
                renderScene={this.renderScene.bind(this)}
            />);
        }
        return (view);
    }
}

