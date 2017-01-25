/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const assert = require('chai').assert;
/* eslint-disable no-console */

const D3PersonalityProfileWrapperV2 = require('../d3-profile-wrappers/v2/index');
const D3PersonalityProfileWrapperV3 = require('../d3-profile-wrappers/v3/index');

const v2Profile = require('../examples/profiles/en_v2');
const v3Profile = require('../examples/profiles/en_v3');

const d3ProfileV2 = new D3PersonalityProfileWrapperV2(v2Profile);
const d3ProfileV3 = new D3PersonalityProfileWrapperV3(v3Profile);

console.log(JSON.stringify(d3ProfileV2.d3Json()));
console.log(JSON.stringify(d3ProfileV3.d3Json()));

describe('Text Summary Tests', () => {

  it('Default (V2, English) profile summary', () => {
    var d3ProfileWithBehaviorsV2 = new PersonalityProfileV2(d3ProfileV2);
    console.log(JSON.stringify(d3ProfileV2.d3Json()));
    //assert.equal(summary, 'You are shrewd, somewhat critical and particular.\nYou are self-controlled: you have control over your desires, which are not particularly intense. You are mild-tempered: it takes a lot to get you angry. And you are assertive: you tend to speak up and take charge of situations, and you are comfortable leading groups.\nYour choices are driven by a desire for organization.\nYou are relatively unconcerned with both taking pleasure in life and achieving success. You prefer activities with a purpose greater than just personal enjoyment. And you make decisions with little regard for how they show off your talents.');
  });


});
