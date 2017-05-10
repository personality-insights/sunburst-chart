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
/**
  * Renders the sunburst visualization. The parameter is the tree as returned
  * from the Personality Insights JSON API.
  */

'use strict';

const extend = require('extend');
const pick = require('object.pick');

const ChartRenderer = require('./personality-chart-renderer');
const D3PersonalityProfileV2 = require('./d3-profile-wrappers/v2/index');
const D3PersonalityProfileV3 = require('./d3-profile-wrappers/v3/index');
const colors = require('./utilities/colors');
const d3 = require('d3');
const d3Color = require('d3-color');
Object.assign(d3, d3Color);

class PersonalitySunburstChart {

  constructor(options) {
    this._options = extend({}, this.defaultOptions(), pick(options, ['element', 'selector', 'version']));
    this._version = this._options.version;
    this._selector = this._options.selector;
    this._element = this._options.element;
    this.visualizationWidth  = this._options.width  || '100%';
    this.visualizationHeight = this._options.height || '100%';
    this.width  = ((1/this._options.scale || 1) * 45) * 16.58;
    this.height = ((1/this._options.scale || 1) * 45) * 16.58;
    this.exclude = this._options.exclude || [];
    this.d3Container = d3.select(this._selector),
    this.dimW = this.width,
    this.dimH = this.height,
    this.d3vis = undefined,
    this.touchDiv = undefined,
    this.data = undefined,
    this.id = 'SystemUWidget',
    this.COLOR_PALLETTE = colors,
    this.loadingDiv = 'dummy';
  }

  defaultOptions() {
    return {
      version: 'v2'
    };
  }

  /**
   * Renders the sunburst visualization. The parameter is the tree as returned
   * from the Personality Insights JSON API.
   * It uses the arguments widgetId, widgetWidth, widgetHeight and personImageUrl
   * declared on top of this script.
   */
  show(theProfile, personImageUrl) {
    const self = this;
    const d3Profile = self._version === 'v3' ? new D3PersonalityProfileV3(theProfile) : new D3PersonalityProfileV2(theProfile);
    const element = self._element || document.querySelector(self._selector);

    // Clear DOM element that will display the sunburst chart
    element.innerHTML = null;

    // Create widget
    const widget = {
      d3vis: d3.select(element)
        .append('svg:svg')
        .attr('width', self.visualizationWidth)
        .attr('height', self.visualizationHeight)
        .attr('viewBox', '0 -30 ' + self.height + ', ' + self.width),
      data: d3Profile.d3Json(),
      dimH: self.height,
      dimW: self.width,
      id: self.id,
      exclude: self.exclude,
      COLOR_PALLETTE: colors,
      loadingDiv: self.loadingDiv,
      switchState: function() {
      },
      _layout: function() {
      },
      showTooltip: function() {
      },
      expandAll: function() {
        this.vis.selectAll('g').each(function() {
          var g = d3.select(this);
          if (g.datum().parent && // Isn't the root g object.
            g.datum().parent.parent && // Isn't the feature trait.
            g.datum().parent.parent.parent) { // Isn't the feature dominant trait.
            g.attr('visibility', 'visible');
          }
        });
      },
      collapseAll: function() {
        this.vis.selectAll('g').each(function() {
          var g = d3.select(this);
          if (g.datum().parent !== null && // Isn't the root g object.
            g.datum().parent.parent !== null && // Isn't the feature trait.
            g.datum().parent.parent.parent !== null) { // Isn't the feature dominant trait.
            g.attr('visibility', 'hidden');
          }
        });
      },
      addPersonImage: function(url) {
        if (!this.vis || !url) {
          return;
        }
        var icon_defs = this.vis.append('defs');
        var width = this.dimW,
          height = this.dimH;

        // The flower had a radius of 640 / 1.9 = 336.84 in the original, now is 3.2.
        var radius = Math.min(width, height) / 16.58; // For 640 / 1.9 -> r = 65
        var scaled_w = radius * 2.46; // r = 65 -> w = 160

        var id = 'user_icon_' + this.id;
        icon_defs.append('pattern')
          .attr('id', id)
          .attr('height', 1)
          .attr('width', 1)
          .attr('patternUnits', 'objectBoundingBox')
          .append('image')
          .attr('width', scaled_w)
          .attr('height', scaled_w)
          .attr('x', radius - scaled_w / 2) // r = 65 -> x = -25
          .attr('y', radius - scaled_w / 2)
          .attr('xlink:href', url)
          .attr('opacity', 1.0)
          .on('dblclick.zoom', null);
        this.vis.append('circle')
          .attr('r', radius)
          .attr('stroke-width', 0)
          .attr('fill', 'url(#' + id + ')');
      }
    };

    // Render widget
    ChartRenderer.render.call(widget);

    // Expand all sectors of the sunburst chart - sectors at each level can be hidden
    widget.expandAll.call(widget);

    // Add an image of the person for whom the profile was generated
    if (personImageUrl) {
      widget.addPersonImage.call(widget, personImageUrl);
    }
  }

}

module.exports = PersonalitySunburstChart;
