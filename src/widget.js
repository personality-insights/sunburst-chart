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

'use strict';

const colors = require('./utilities/colors');

class SunburstWidget {

  constructor(options, d3) {
    this.d3 = d3;
    this.visualizationWidth = options.width  || '100%';
    this.visualizationHeight = options.height || '100%';
    this.dimW  = ((1/options.scale || 1) * 45) * 16.58;
    this.dimH = ((1/options.scale || 1) * 45) * 16.58;
    this.id = 'SystemUWidget_' + Math.random().toString().replace('0.','');
    this.exclude = options.exclude || [];
    this.COLOR_PALLETTE = colors;
    this.loadingDiv = 'dummy';
    this._element = null;
    this._childElements = {
      icondefs: null,
      image: null,
      pattern: null,
      circle: null
    };
  }

  setElement(element) {
    this._element = element;
  }

  setData(data) {
    this.data = data;
  }

  switchState() {}

  _layout() {}

  showTooltip() {}

  init() {
    this.d3vis = this.d3.select(this._element)
      .append('svg:svg')
      .attr('width', this.visualizationWidth)
      .attr('height', this.visualizationHeight)
      .attr('viewBox', '0 -30 ' + this.dimH + ', ' + this.dimW);
  }

  clear() {
    this._element.innerHTML = null;
  }

  expandAll() {
    if (!this.vis) {
      return;
    }
    
    var self = this;
    this.vis.selectAll('g').each(function() {
      var g = self.d3.select(this);
      if (g.datum().parent && // Isn't the root g object.
        g.datum().parent.parent && // Isn't the feature trait.
        g.datum().parent.parent.parent) { // Isn't the feature dominant trait.
        g.attr('visibility', 'visible');
      }
    });
  }

  collapseAll() {
    if (!this.vis) {
      return;
    }

    var self = this;
    this.vis.selectAll('g').each(function() {
      var g = self.d3.select(this);
      if (g.datum().parent !== null && // Isn't the root g object.
        g.datum().parent.parent !== null && // Isn't the feature trait.
        g.datum().parent.parent.parent !== null) { // Isn't the feature dominant trait.
        g.attr('visibility', 'hidden');
      }
    });
  }

  addImage(url) {
    if (!this.vis || !url) {
      if (this.hasImage()) {
        this.removeImage();
      }
      return;
    }

    if (!this.hasImage()) {
      this._childElements.icondefs = this.vis.append('defs');

      // The flower had a radius of 640 / 1.9 = 336.84 in the original, now is 3.2.
      var radius = Math.min(this.dimW, this.dimH) / 16.58; // For 640 / 1.9 -> r = 65
      var scaled_w = radius * 2.46; // r = 65 -> w = 160

      var id = 'user_icon_' + this.id;
      const pattern = this._childElements.icondefs.append('pattern');
      pattern
        .attr('id', id)
        .attr('height', 1)
        .attr('width', 1)
        .attr('patternUnits', 'objectBoundingBox');

      this._childElements.image = pattern.append('image');

      this._childElements.image
        .attr('width', scaled_w)
        .attr('height', scaled_w)
        .attr('x', radius - scaled_w / 2) // r = 65 -> x = -25
        .attr('y', radius - scaled_w / 2)
        .attr('opacity', 1.0)
        .on('dblclick.zoom', null);

      this._childElements.circle = this.vis.append('circle');

      this._childElements.circle
        .attr('r', radius)
        .attr('stroke-width', 0)
        .attr('fill', 'url(#' + id + ')');
    }

    this.changeImage(url);
  }

  changeImage(url) {
    if (!url) {
      this.removeImage();
    } else {
      if (!this.hasImage()) {
        this.addImage(url);
      } else {
        this._childElements.image.attr('xlink:href', url);
      }
    }
  }

  removeImage() {
    if (this._childElements.icondefs) {
      this._childElements.icondefs.remove();
      this._childElements.icondefs = null;
      this._childElements.image = null;
    }
    if (this._childElements.circle) {
      this._childElements.circle.remove();
      this._childElements.circle = null;
    }
  }

  hasImage() {
    return this._childElements.icondefs !== null;
  }
}

module.exports = SunburstWidget;
