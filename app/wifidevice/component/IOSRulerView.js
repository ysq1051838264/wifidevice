/**
 * Created by DonYau on 2017/6/15.
 */
//

import React, {Component, PropTypes} from 'react';
import {
  StyleSheet,
  requireNativeComponent,
  View,
  Dimensions,
} from 'react-native';


class IOSRulerView extends React.Component {
  constructor() {
    super();
    this._onChange = this._onChange.bind(this);
  }
  _onChange(event) {
    if (!this.props.onChange) {
      return;
    }
    this.props.onChange(event.nativeEvent.weight);
  }
  render() {
    return <RCTIOSRulerView {...this.props} onChange={this._onChange} />;
  }
}

IOSRulerView.propTypes = {
  onChange: React.PropTypes.func,
};

var RCTIOSRulerView = requireNativeComponent('RNWeightInput', IOSRulerView,{
  nativeOnly: { onChange: true }
});

module.exports = IOSRulerView;