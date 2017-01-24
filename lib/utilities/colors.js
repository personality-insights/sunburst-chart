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

class Colors {

  constructor() {

    // Colors for V3 are from the IBM Design PI Color Wheel
    // XColorDark is the color to be used on the inner rings to show the score for the trait, need or value
    // XColorLight is the color used on the inner rings and has a value of (1 - score)
    // XColor is the color used for an individual facet, need or value

    // Colors for personality (traits)
    this._traitsColorDark = '#5aaafa';
    this._traitsColorLight = '#c0e6ff';
    this._facetColor = '#4178be';

    // Colors for needs
    this._needsColorDark = '#41d6c3';
    this._needsColorLight = '#a7fae6';
    this._needColor = '#008571';

    // Colors for values
    this._valuesColorDark = '#ba8ff7';
    this._valuesColorLight = '#eed2ff';
    this._valueColor = '#9855d4';
  }


  colorPallette(){
    return {
      traits_light: this._traitsColorLight,
      traits_dark: this._traitsColorDark,
      facet: this._facetColor,
      needs_light: this._needsColorLight,
      needs_dark: this._needsColorDark,
      need: this._needColor,
      values_light: this._valuesColorLight,
      values_dark: this._valuesColorDark,
      value: this._valueColor
    };
  }
}

module.exports = Colors;
