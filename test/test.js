'use strict';
/* eslint-disable no-console */

const PersonalityProfileV2 = require('../profiles/v2/index');
const PersonalityProfileV3 = require('../profiles/v3/index');

const v2Profile = require('../examples/resources/profile');
const v3Profile = require('../examples/resources/profile_with_behaviors_v3');

var d3ProfileV2 = new PersonalityProfileV2(v2Profile);
var d3ProfileV3 = new PersonalityProfileV3(v3Profile);

//console.log(JSON.stringify(profileV2.traits(),2,null));
//console.log(profileV2.values());
//console.log(profileV2.valuesTree());
console.log(d3ProfileV3.d3Json());
