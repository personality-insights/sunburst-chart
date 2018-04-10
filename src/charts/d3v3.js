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

const pick = require('lodash.pick');
const colors = require('../utilities/colors');
const ChartRendererV3 = require('../d3-renderers/v3/personality-chart-renderer');
const D3PersonalityProfileV2 = require('../d3-profile-wrappers/v2/index');
const D3PersonalityProfileV3 = require('../d3-profile-wrappers/v3/index');
const PersonalityTraitNamesV2 = require('personality-trait-names/lib/index-v2');
const PersonalityTraitNamesV3 = require('personality-trait-names/lib/index-v3');
const PersonalitySunburstChartImpl = require('../personality-sunburst-chart');

const DEFAULT_OPTIONS = {
  locale: 'en',
  version: 'v2',
  d3version: 'v3',
  colors: colors
};

class PersonalitySunburstChart extends PersonalitySunburstChartImpl {

  constructor(options) {
    const _options = Object.assign({}, DEFAULT_OPTIONS, pick(options, ['element', 'selector', 'version', 'locale', 'colors', 'exclude']));
    super(_options, _options.version === 'v2' ? D3PersonalityProfileV2 : D3PersonalityProfileV3, ChartRendererV3, _options.version === 'v2' ? PersonalityTraitNamesV2 : PersonalityTraitNamesV3);
  }

  defaultOptions() {
    return DEFAULT_OPTIONS;
  }
}

module.exports = PersonalitySunburstChart;
