/**
 * Copyright 2014-2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var pick = require('lodash.pick');
var ChartRendererV3 = require('../d3-renderers/v3/personality-chart-renderer');
var ChartRendererV4 = require('../d3-renderers/v4/personality-chart-renderer');
var D3PersonalityProfileV2 = require('../d3-profile-wrappers/v2/index');
var D3PersonalityProfileV3 = require('../d3-profile-wrappers/v3/index');
var PersonalityTraitNamesV2 = require('personality-trait-names/lib/index-v2');
var PersonalityTraitNamesV3 = require('personality-trait-names/lib/index-v3');
var PersonalitySunburstChartImpl = require('../personality-sunburst-chart');

var DEFAULT_OPTIONS = {
  locale: 'en',
  version: 'v2',
  d3version: 'v3'
};

var PersonalitySunburstChart = function (_PersonalitySunburstC) {
  _inherits(PersonalitySunburstChart, _PersonalitySunburstC);

  function PersonalitySunburstChart(options) {
    _classCallCheck(this, PersonalitySunburstChart);

    var _options = Object.assign({}, DEFAULT_OPTIONS, pick(options, ['element', 'selector', 'version', 'd3version', 'locale']));
    return _possibleConstructorReturn(this, (PersonalitySunburstChart.__proto__ || Object.getPrototypeOf(PersonalitySunburstChart)).call(this, _options, _options.version === 'v2' ? D3PersonalityProfileV2 : D3PersonalityProfileV3, _options.d3version === 'v3' ? ChartRendererV3 : ChartRendererV4, _options.version === 'v2' ? PersonalityTraitNamesV2 : PersonalityTraitNamesV3));
  }

  _createClass(PersonalitySunburstChart, [{
    key: 'defaultOptions',
    value: function defaultOptions() {
      return DEFAULT_OPTIONS;
    }
  }]);

  return PersonalitySunburstChart;
}(PersonalitySunburstChartImpl);

module.exports = PersonalitySunburstChart;