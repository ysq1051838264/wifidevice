/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {Component} from 'react';

import {
    AppRegistry,
} from 'react-native';

import ReportActivity from './app/report/report'
import ReportShared from './app/report/ReportShared'
import UnMeasureData from './app/wifidevice/pages/UnMeasureData';
import WifiDevice from './app/wifidevice/root';
import AppointMeasure from './app/wifidevice/pages/AppointMeasure';
import DeepinReportShared from './app/report/DeepinReportShared'
import ReportDataCompareShare from './app/report/ReportDataCompareShare'
import BindDeviceHelp from './app/measure/BindDeviceHelp'


export default class Main {
    register() {
        AppRegistry.registerComponent('QNReport', () => ReportActivity);

        AppRegistry.registerComponent('ReportShared', () => ReportShared);

        AppRegistry.registerComponent('UnKnownMeasure', () => UnMeasureData);

        AppRegistry.registerComponent('SetupWifiScale', () => WifiDevice);

        AppRegistry.registerComponent('AppointMeasure', () => AppointMeasure);

        AppRegistry.registerComponent('DeepinReportShared', () => DeepinReportShared);

        AppRegistry.registerComponent('CompareReportShare', () => ReportDataCompareShare);

        AppRegistry.registerComponent('BindDeviceHelp', () => BindDeviceHelp);
    }
}

