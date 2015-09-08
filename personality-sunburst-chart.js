/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
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
exportModule("PersonalitySunburstChart", function () {
  'use strict';

  var klass = function (containerId, width, height, visualizationWidth, visualizationHeight) {

    var self = {
      containerId : containerId,
      container   : $('#' + containerId),
      d3Container : d3.select('#' + containerId),

      width : width, dimW : width,
      height : height, dimH : height,

      visualizationWidth : visualizationWidth || "100%",
      visualizationHeight : visualizationHeight || "100%",
      d3vis : undefined,
      touchDiv : undefined,
      data : undefined,
      id : 'SystemUWidget',
      COLOR_PALLETTE: ['#1b6ba2', '#488436', '#d52829', '#F53B0C', '#972a6b', '#8c564b', '#dddddd'],
      loadingDiv: 'dummy',
    };

    self.switchState = function () {
      console.log('[switchState]');
    };

    self._layout = function () {
      console.log('[_layout]');
      /*var cbox = dojo.contentBox(this.chartDiv);

      var fixedHeight = 0, svgDiv = this.svgDiv;
      var newSVGH = cbox.h - fixedHeight;
      var w = cbox.w, h = newSVGH;

      this.dimW = w; // Also needed in render()
      this.dimH = h; // Also needed in render()
      this.d3vis.attr("width", w).attr("height", h);*/
    };

    self.showTooltip = function () {
      console.log('[showTooltip]');
    };

    self.showTooltipTouch = function () {
      console.log('[showTooltipTouch]');
    }

    self.expandAll = function () {
      this.vis.selectAll('g').each(function () {
        var g = d3.select(this);
        if (g.datum().parent && // Isn't the root g object.
            g.datum().parent.parent && // Isn't the feature trait.
            g.datum().parent.parent.parent) { // Isn't the feature dominant trait.
          g.attr('visibility', 'visible');
        }
      });
    };

    self.collapseAll = function () {
      this.vis.selectAll('g').each(function () {
        var g = d3.select(this);
        if (g.datum().parent !== null && // Isn't the root g object.
            g.datum().parent.parent !== null && // Isn't the feature trait.
            g.datum().parent.parent.parent !== null) { // Isn't the feature dominant trait.
          g.attr('visibility', 'hidden');
        }
      });
    };

    self.addPersonImage = function (url) {
      if (!this.vis || !url) {
        return;
      }
      var
        icon_defs = this.vis.append('defs'),
        width_ = this.dimW,
        height_ = this.dimH,
        // The flower had a radius of 640 / 1.9 = 336.84 in the original, now is 3.2.
        radius = Math.min(width_, height_) / 16.58, // For 640 / 1.9 -> r = 65
        scaled_w = radius * 2.46, // r = 65 -> w = 160
        id = 'user_icon_' + this.id;

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
    };

    self.buildTouchDiv = function () {
      return $([
        '<div id="touchDiv" style="', [
          'width: 80%',
          'height: 80%',
          'overflow: auto',
          'position: absolute',
          'top: 10%',
          'left: 10%',
          'z-index:99'
        ].join(';')
        ,'"/>'
      ].join(' '));
    };

    self.showVizualization = function (profile, personImageUrl) {
      console.log('showVizualization()');

      self.container.empty();
      self.container.append(self.buildTouchDiv());
      self.touchDiv = self.container.find('#touchDiv').get(0);
      self.d3vis = self.d3Container.append('svg:svg');
      self.data = profile;
      self.d3vis.attr('width', self.visualizationWidth).attr('height', self.visualizationHeight);
      self.d3vis.attr('viewBox', "0 -30 " + self.dimW + ", " + self.dimH);
      PersonalityChartImpl.initialize.apply(self);
      PersonalityChartImpl.renderChart.apply(self);
      self.expandAll();
      if (personImageUrl) {
        self.addPersonImage(personImageUrl);
      }
    };

    self.show = self.showVizualization;

    return self;
  };

  return klass;
});
