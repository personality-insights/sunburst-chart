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

const SunburstWidget = require('./widget');

class PersonalitySunburstChartImpl {

  constructor(options, D3PersonalityProfile, ChartRenderer, PersonalityTraitNames) {
    this.D3PersonalityProfile = D3PersonalityProfile;
    this.ChartRenderer = ChartRenderer;
    this._options = options;
    this._selector = options.selector;
    this._element = options.element;
    this._locale = options.locale;
    this._colors = options.colors;
    this._imageUrl = '';
    this._profile = null;
    this._widget = null;
    this._traitNames = new PersonalityTraitNames({ locale: this._locale });
  }

  setLocale(locale, render = true) {
    if (this._locale !== locale) {
      this._locale = locale;
      this._traitNames.setLocale(locale);

      if (this._profile && this._widget) {
        const d3Profile = new this.D3PersonalityProfile(this._profile, this._traitNames);
        this._widget.setData(d3Profile.d3Json());

        if (render) {
          this._widget.updateText();
        }
      }
    }
  }

  setImage(url, render = true) {
    if (this._imageUrl !== url) {
      this._imageUrl = url;

      if (this._widget && render) {
        this._widget.changeImage(url);
      }
    }
  }

  setProfile(profile, render = true) {
    if (this._profile !== profile) {
      this._profile = profile;

      if (this._widget) {
        if (this._profile) {
          const d3Profile = new this.D3PersonalityProfile(this._profile, this._traitNames);
          this._widget.setData(d3Profile.d3Json());
        } else {
          this._widget.clearData();
        }
      }
    } else if (this._widget && this._profile && !this._widget.hasData()) {
      // initilize data
      const d3Profile = new this.D3PersonalityProfile(this._profile, this._traitNames);
      this._widget.setData(d3Profile.d3Json());
    }

    if (render) {
      this.render();
    }
  }

  setColors(colors, render = true) {
    if (!colors) {
      return;
    }
    this._colors = colors;
    if (this._widget) {
      this._widget.setColors(this._colors);

      if (render) {
        this._widget.updateColors();
      }
    }
  }

  render() {
    if (this._widget) {
      this._widget.init();

      // Render widget
      this._widget.render();
      this._widget.updateText();
      this._widget.updateColors();

      // Expand all sectors of the sunburst chart - sectors at each level can be hidden
      this._widget.expandAll();

      // Add an image of the person for whom the profile was generated
      if (this._imageUrl) {
        this._widget.addImage(this._imageUrl);
      }
    } else {
      this.show();
    }
  }

  /**
   * Renders the sunburst visualization. The parameter is the tree as returned
   * from the Personality Insights JSON API.
   * It uses the arguments widgetId, widgetWidth, widgetHeight and personImageUrl
   * declared on top of this script.
   */
  show(theProfile, personImageUrl, colors) {
    if (!this._widget) {
      // Create widget
      this._widget = new SunburstWidget(this._options, this.ChartRenderer);
      const element = this._element || document.querySelector(this._selector);
      this._widget.setElement(element);
    }

    // Clear DOM element that will display the sunburst chart
    this._widget.clear();

    this.setProfile(theProfile || this._profile, false);
    this.setImage(personImageUrl || this._imageUrl, false);
    this.setColors(colors || this._colors, false);

    // Render widget
    this.render();
  }

}

module.exports = PersonalitySunburstChartImpl;
