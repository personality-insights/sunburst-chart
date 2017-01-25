/**
 * Copyright 2016 IBM Corp. All Rights Reserved.
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

// Default colors for V3 are from the IBM Design PI Color Wheel
// XColorDark is the color to be used on the inner rings to show the score for the trait, need or value
// XColorLight is the color used on the inner rings and has a value of (1 - score)
// XColor is the color used for an individual facet, need or value

var colors = {
  traits_dark: '#5aaafa',
  traits_light: '#c0e6ff',
  facet: '#4178be',
  needs_dark: '#41d6c3',
  needs_light: '#a7fae6',
  need: '#008571',
  values_dark: '#ba8ff7',
  values_light: '#eed2ff',
  value: '#9855d4'
};

module.exports = colors;
