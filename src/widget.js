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

  constructor(options, renderer) {
    this.renderer = renderer;
    this.d3 = renderer.d3;
    this.visualizationWidth = options.width  || '100%';
    this.visualizationHeight = options.height || '100%';
    this.dimW  = ((1/options.scale || 1) * 45) * 16.58;
    this.dimH = ((1/options.scale || 1) * 45) * 16.58;
    this.id = 'SystemUWidget_' + Math.random().toString().replace('0.','');
    this.exclude = options.exclude || [];
    this.COLOR_PALLETTE = colors;
    this.loadingDiv = 'dummy';
    this.d3vis = null;
    this.vis = null;
    this.data = null;
    this._element = null;
    this._childElements = {
      icondefs: null,
      image: null,
      pattern: null,
      circle: null,
      namelabels: {},
      scorelabels: {}
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

  render() {
    this.renderer.render(this);
    this.updateText();
  }

  updateText() {
    if (!this.vis) {
      return;
    }

    var tree = this.data ? (this.data.tree ? this.data.tree : this.data) : null;
    if (!tree || !tree.children || !tree.children.length) {
      return;
    }

    var self = this;
    tree.children.forEach(function(child) {
      if (self._childElements.namelabels[child.id]) {
        self._childElements.namelabels[child.id].text(self.getNameLabelText(child));
      }

      child.children.forEach(function(category) {
        if (self._childElements.namelabels[category.id]) {
          self._childElements.namelabels[category.id].text(category.name);
        }
        if (self._childElements.scorelabels[category.id]) {
          self._childElements.scorelabels[category.id].text(self.getScoreLabelText(category));
        }

        category.children.forEach(function(trait) {
          if (trait.category === 'personality') {
            // personality traits
            if (self._childElements.namelabels[trait.id]) {
              self._childElements.namelabels[trait.id].text(trait.name);
            }
            if (self._childElements.scorelabels[trait.id]) {
              self._childElements.scorelabels[trait.id].text(self.getScoreLabelText(trait));
            }

            trait.children.forEach(function(facet) {
              if (self._childElements.namelabels[facet.id]) {
                self._childElements.namelabels[facet.id].text(self.getNameLabelText(facet));
              }
            });
          } else {
            if (self._childElements.namelabels[trait.id]) {
              self._childElements.namelabels[trait.id].text(self.getNameLabelText(trait));
            }
          }
        });
      });
    });

    this.updateLabelLayout();
  }

  updateLabelLayout() {
    this.updateLabelLayoutWithClass('.sector_label_path');
    this.updateLabelLayoutWithClass('.sector_label_number_path');
  }

  updateLabelLayoutWithClass(_class) {
    if (!this.d3vis) {
      return;
    }

    var max_font_size_base = 16;
    var d3 = this.d3;
    this.d3vis.selectAll(_class).each(function(d) {
      var d3this = d3.select(this);
      var curNd = d3this.node();
      var text = d3this.text();
      if (text && text.length > 0) {
        var position = d3.select(this).attr('position-in-sector'); // 'inner' or 'outer'
        var frac = position === 'center' ? 0.5 : position === 'outer' ? 2 / 3 : 1 / 3;
        var sector_length = (d.y + d.dy * frac) * d.dx;
        var text_length = curNd.getComputedTextLength(); //+margin;
        var cur_font_size = d3.select(this).attr('font-size');
        var new_font_size = cur_font_size * sector_length / text_length;

        if (new_font_size > max_font_size_base / (0.4 * d.depth + 0.6)) {
          new_font_size = max_font_size_base / (0.4 * d.depth + 0.6);
        }

        d3.select(this).attr('font-size', new_font_size);
        //set new offset:
        d3.select(this).attr('startOffset', (sector_length - curNd.getComputedTextLength()) / 2);
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

  getScore(d) {
    var score = d.score;
    if (score === null) score = 1;
    if (score >= 1) {
      score = 0.99;
    } else if (score <= -1) {
      score = -0.99;
    }

    //for request without any result
    if (d.name === '') {
      score = 0;
    }

    return score;
  }

  getScoreLabelText(d) {
    return d.score === null || isNaN(d.score) ? '' : ' (' + (this.getScore(d) * 100).toFixed(0) + '%)';
  }

  getNameLabelText(d) {
    if (!d.name) {
      return '';
    }
    var label = d.name, score = this.getScore(d);

    if (d.id === 'sbh_dom' || d.id === 'sbh_parent'){
      label = d.name;
    } else if (d.category === 'values') {
      label = d.name + ((score * 100).toFixed(0) === 'NaN' || isNaN(score) ? '' : ' (' + (score * 100).toFixed(0) + '%)');
    } else {
      label = d.name + ((score * 100).toFixed(0) === 'NaN' || isNaN(score) ? '' : ' (' + (score * 100).toFixed(0) + '%)');

      if ((Math.round(parseFloat(score) * 100) / 100) === 0) {
        label = d.name;
      }
    }

    return label;
  }
}

module.exports = SunburstWidget;
