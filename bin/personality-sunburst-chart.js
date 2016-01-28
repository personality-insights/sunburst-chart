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

 /**
  * Renders the sunburst visualization. The parameter is the tree as returned
  * from the Personality Insights JSON API.
  */

var chartRenderer = require('./personality-chart-renderer');


// Dependencies check

var dependencies = {
  'd3' : 'D3js',
  '$'  : 'JQuery'
};

Object.keys(dependencies).forEach(function(dependency) {
  if (typeof window[dependency] === 'undefined') {
    throw new Error(dependencies[dependency] + ' is not present. Personality Sunburst Chart can\'t render without it.');
  }
});


// Module

module.exports=(function () {
  'use strict';

  var PersonalitySunburstChart = function (containerId, options) {

    options = options || {};
    var visualizationWidth  = options.width  || '100%';
    var visualizationHeight = options.height || '100%';
    var width  = ((1/options.scale || 1) * 45) * 16.58;
    var height = ((1/options.scale || 1) * 45) * 16.58;

    var self = {
      containerId : containerId,
      container   : $('#' + containerId),
      d3Container : d3.select('#' + containerId),

      width : width, dimW : width,
      height : height, dimH : height,

      visualizationWidth  : visualizationWidth || "100%",
      visualizationHeight : visualizationHeight || "100%",
      d3vis : undefined,
      touchDiv : undefined,
      data : undefined,
      id : 'SystemUWidget',
      COLOR_PALLETTE: ['#1b6ba2', '#488436', '#d52829', '#F53B0C', '#972a6b', '#8c564b', '#dddddd'],
      loadingDiv: 'dummy',
    };

    /**
     * Renders the sunburst visualization. The parameter is the tree as returned
     * from the Personality Insights JSON API.
     * It uses the arguments widgetId, widgetWidth, widgetHeight and personImageUrl
     * declared on top of this script.
     */
    function showVizualization(theProfile, personImageUrl) {
      console.debug('showVizualization()');

      var widgetId = self.containerId;

      $('#' + widgetId).empty();
      var d3vis = d3.select('#' + widgetId).append('svg:svg');
      var widget = {
        d3vis: d3vis,
        data: theProfile,
        loadingDiv: 'dummy',
        switchState: function() {
          console.debug('[switchState]');
        },
        _layout: function() {
          console.debug('[_layout]');
        },
        showTooltip: function() {
          console.debug('[showTooltip]');
        },
        id: 'SystemUWidget',
        COLOR_PALLETTE: ['#1b6ba2', '#488436', '#d52829', '#F53B0C', '#972a6b', '#8c564b', '#dddddd'],
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

      widget.dimH = self.height;
      widget.dimW = self.width;
      widget.d3vis.attr('width', self.visualizationWidth).attr('height', self.visualizationHeight);
      widget.d3vis.attr('viewBox', '0 -30 ' + widget.dimW + ', ' + widget.dimH);
      chartRenderer.render.call(widget);
      widget.expandAll.call(widget);
      if (personImageUrl)
        widget.addPersonImage.call(widget, personImageUrl);
    }

    self.clean = function () {
      self.container.empty();
    };

    self.show = showVizualization;

    return self;
  };

  return PersonalitySunburstChart;
}());
