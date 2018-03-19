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

/* global document */
'use strict';

const PersonalityTraitNames = require('personality-trait-names');
const SunburstWidget = require('./widget');

class PersonalitySunburstChartImpl {

  constructor(options, D3PersonalityProfile, ChartRenderer) {
    this.D3PersonalityProfile = D3PersonalityProfile;
    this.ChartRenderer = ChartRenderer;
    this._options = options;
    this._version = options.version;
    this._d3version = options.d3version;
    this._selector = options.selector;
    this._element = options.element;
    this._locale = options.locale;
    this._imageUrl = '';
    this._profile = null;
    this._widget = null;
  }

  setLocale(locale) {
    if (this._locale !== locale) {
      this._locale = locale;
      if (this._widget) {
        this.render(this._profile);
      }
    }
  }

  setImage(url) {
    if (this._imageUrl !== url) {
      this._imageUrl = url;
      if (this._widget) {
        this._widget.changeImage(url);
      }
    }
  }

  setProfile(profile) {
    if (this._profile !== profile) {
      this._profile = profile;

      if (this._widget) {
        if (this._profile) {
          const traitNames = new PersonalityTraitNames({ locale: this._locale, version: this._version });
          const d3Profile = new this.D3PersonalityProfile(this._profile, traitNames);
          this._widget.setData(d3Profile.d3Json());

          // Render widget
          this.ChartRenderer.render.call(this._widget);

          // Expand all sectors of the sunburst chart - sectors at each level can be hidden
          this._widget.expandAll();
        } else {
          // Clear DOM element that will display the sunburst chart
          this._widget.clear();
        }
      }
    }
  }

  /**
   * Renders the sunburst visualization. The parameter is the tree as returned
   * from the Personality Insights JSON API.
   * It uses the arguments widgetId, widgetWidth, widgetHeight and personImageUrl
   * declared on top of this script.
   */
  show(theProfile, personImageUrl) {
    const element = this._element || document.querySelector(this._selector);

    // Create widget
    this._widget = new SunburstWidget(this._options, this.ChartRenderer.d3);
    this._widget.setElement(element);

    // Render widget
    this.setProfile(theProfile || this._profile);

    // Add an image of the person for whom the profile was generated
    this.setImage(personImageUrl || this._imageUrl);
  }

}

module.exports = PersonalitySunburstChartImpl;
