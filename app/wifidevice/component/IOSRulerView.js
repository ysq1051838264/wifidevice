/**
 * Created by DonYau on 2017/6/15.
 */
//

import React, { Component, PropTypes } from 'react';
import { requireNativeComponent } from 'react-native';

var IOSRulerView = requireNativeComponent('RNWeightInput', RNWeightInput);

export default class RNWeightInput extends Component {

  render() {
    return <IOSRulerView {...this.props} />;
  }

}

IOSRulerView.propTypes = {
  onChange: React.PropTypes.func,
};

module.exports = IOSRulerView;


// var { requireNativeComponent } = require('react-native');
//
//
// module.exports = requireNativeComponent('RNWeightInput', null);

