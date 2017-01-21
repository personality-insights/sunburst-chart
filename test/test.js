'use strict';
/* eslint-disable no-console */

const PersonalityProfileV2 = require('../d3-profile-wrappers/v2/index');
const PersonalityProfileV3 = require('../d3-profile-wrappers/v3/index');

const v2ProfileWithBehaviors = require('../examples/profiles/en_v2');
const v3ProfileWithBehaviors = require('../examples/profiles/en_v3');

var d3ProfileWithBehaviorsV2 = new PersonalityProfileV2(v2ProfileWithBehaviors);
var d3ProfileWithBehaviorsV3 = new PersonalityProfileV3(v3ProfileWithBehaviors);

console.log(JSON.stringify(d3ProfileWithBehaviorsV2.d3Json()));
console.log(JSON.stringify(d3ProfileWithBehaviorsV3.d3Json()));
