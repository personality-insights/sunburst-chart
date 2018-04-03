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

const utils = require('./d3-renderers/utils');

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
    this.loadingDiv = 'dummy';
    this.d3vis = null;
    this.vis = null;
    this.data = null;
    this._colors = options.colors;
    this._d3version = options.d3version;
    this._element = null;
    this._childElements = {
      icondefs: null,
      image: null,
      pattern: null,
      circle: null,
      parts: {}
    };
  }

  setElement(element) {
    this._element = element;
  }

  setData(data) {
    this.data = data;
  }

  clearData() {
    this.data = null;
  }

  hasData() {
    return this.data !== null;
  }

  setColors(colors) {
    if (colors) {
      this._colors = colors;
    }
  }

  switchState() {}

  _layout() {}

  showTooltip() {}

  init() {
    if (!this.d3vis) {
      this.d3vis = this.d3.select(this._element).append('svg:svg');
    }

    this.d3vis
      .attr('width', this.visualizationWidth)
      .attr('height', this.visualizationHeight)
      .attr('viewBox', '0 0 ' + this.dimH + ', ' + this.dimW);
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
      if (self._childElements.parts[self.getUniqueId(child, 'sector_label_path')]) {
        self._childElements.parts[self.getUniqueId(child, 'sector_label_path')].text(self.getNameLabelText(child));
      }

      child.children.forEach(function(category) {
        if (self._childElements.parts[self.getUniqueId(category, 'sector_label_path')]) {
          self._childElements.parts[self.getUniqueId(category, 'sector_label_path')].text(category.name);
        }
        if (self._childElements.parts[self.getUniqueId(category, 'sector_label_number_path')]) {
          self._childElements.parts[self.getUniqueId(category, 'sector_label_number_path')].text(self.getScoreLabelText(category));
        }

        category.children.forEach(function(trait) {
          if (trait.category === 'personality') {
            // personality traits
            if (self._childElements.parts[self.getUniqueId(trait, 'sector_label_path')]) {
              self._childElements.parts[self.getUniqueId(trait, 'sector_label_path')].text(trait.name);
            }
            if (self._childElements.parts[self.getUniqueId(trait, 'sector_label_number_path')]) {
              self._childElements.parts[self.getUniqueId(trait, 'sector_label_number_path')].text(self.getScoreLabelText(trait));
            }

            trait.children.forEach(function(facet) {
              if (self._childElements.parts[self.getUniqueId(facet, 'sector_leaf_text')]) {
                self._childElements.parts[self.getUniqueId(facet, 'sector_leaf_text')].text(self.getNameLabelText(facet));
              }
            });
          } else {
            if (self._childElements.parts[self.getUniqueId(trait, 'sector_leaf_text')]) {
              self._childElements.parts[self.getUniqueId(trait, 'sector_leaf_text')].text(self.getNameLabelText(trait));
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
    var self = this;
    this.d3vis.selectAll(_class).each(function(d) {
      var d3this = self.d3.select(this);
      var curNd = d3this.node();
      var text = d3this.text();
      if (text && text.length > 0) {
        var position = self.d3.select(this).attr('position-in-sector');
        var frac = position === 'center' ? 0.5 : position === 'outer' ? 2 / 3 : 1 / 3;
        var sector_length = self._d3version === 'v3' ?
          (d.y + d.dy * frac) * d.dx :
          (d.y0 + (d.y1 - d.y0) * frac) * (d.x1 - d.x0);
        var text_length = curNd.getComputedTextLength();
        var cur_font_size = self.d3.select(this).attr('font-size');
        var new_font_size = cur_font_size * sector_length / text_length;

        if (new_font_size > max_font_size_base / (0.4 * d.depth + 0.6)) {
          new_font_size = max_font_size_base / (0.4 * d.depth + 0.6);
        }

        self.d3.select(this).attr('font-size', new_font_size);
        //set new offset:
        self.d3.select(this).attr('startOffset', (sector_length - curNd.getComputedTextLength()) / 2);
      }
    });
  }

  updateColors() {
    var self = this;
    this.d3vis.selectAll('.arc2').each(function(d) {
      self.updatePartColor(d);
    });
    this.d3vis.selectAll('.arc1').each(function(d) {
      self.updatePartColor(d);
    });
    this.d3vis.selectAll('._bar').each(function(d) {
      self.updatePartColor(d);
    });
  }

  updatePartColor(d) {
    var colors = this.getColors(d);
    var arc1color = d.depth < 2 ? this.d3.color(colors.innerRingLightColor) : this.d3.color(colors.innerRingDarkColor);
    var strokecolor = arc1color;

    if (!d.children) {
      this._childElements.parts[this.getUniqueId(d, 'bar')]
        .style('stroke', '#EEE')
        .style('fill', this.d3.color(colors.outerRingColor));
    } else {
      this._childElements.parts[this.getUniqueId(d, 'arc1')]
        .style('stroke', strokecolor)
        .style('fill', arc1color);

      this._childElements.parts[this.getUniqueId(d, 'arc2')]
        .style('stroke', strokecolor)
        .style('fill', arc1color)
        .style('fill-opacity', 0.15);
    }
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

      var radius = Math.min(this.dimW, this.dimH) / 16.58;
      var scaled_w = radius * 2;

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
        .attr('x', 0)
        .attr('y', 0)
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
    var score = utils.getValue(d, 'score');
    var name = utils.getValue(d, 'name');
    if (typeof score === 'undefined' || typeof name === 'undefined') {
      score = 0;
    } else {
      if (score === null) {
        score = 0.99;
      } else if (score >= 1) {
        score = 0.99;
      } else if (score <= -1) {
        score = -0.99;
      }
    }

    return score;
  }

  getScoreLabelText(d) {
    var score = utils.getValue(d, 'score');
    return score === null || isNaN(score) ? '' : ' (' + (this.getScore(d) * 100).toFixed(0) + '%)';
  }

  getNameLabelText(d) {
    var name = utils.getValue(d, 'name');
    if (!name) {
      return '';
    }

    var score = this.getScore(d);
    var id = utils.getValue(d, 'id');
    var category = utils.getValue(d, 'category');
    var label = name;

    if (id === 'sbh_dom' || id === 'sbh_parent'){
      label = name;
    } else if (category === 'values') {
      label = name + ((score * 100).toFixed(0) === 'NaN' || isNaN(score) ? '' : ' (' + (score * 100).toFixed(0) + '%)');
    } else {
      label = name + ((score * 100).toFixed(0) === 'NaN' || isNaN(score) ? '' : ' (' + (score * 100).toFixed(0) + '%)');

      if ((Math.round(parseFloat(score) * 100) / 100) === 0) {
        label = name;
      }
    }

    return label;
  }

  getUniqueId(d, _class) {
    var uid = this.id + '_' + utils.getValue(d, 'id');
    if (_class) {
      uid += '.' + _class;
    }
    return uid;
  }

  getColors(d) {
    d.coloridx = (d.depth === 1 || d.depth === 0) ? utils.getValue(d, 'id') : d.parent.coloridx;
    if (d.coloridx === 'personality') {
      return {
        innerRingDarkColor: this._colors.traits_dark,
        innerRingLightColor: this._colors.traits_light,
        outerRingColor: this._colors.facet
      };
    } else if (d.coloridx === 'needs') {
      return {
        innerRingDarkColor: this._colors.needs_dark,
        innerRingLightColor: this._colors.needs_light,
        outerRingColor: this._colors.need
      };
    } else if (d.coloridx === 'values') {
      return {
        innerRingDarkColor: this._colors.values_dark,
        innerRingLightColor: this._colors.values_light,
        outerRingColor: this._colors.value
      };
    } else {
      return {
        innerRingDarkColor: this._colors.traits_dark,
        innerRingLightColor: this._colors.traits_light,
        outerRingColor: this._colors.facet
      };
    }
  }

  createParts(g, d) {
    var self = this;
    var uid;
    var bottom = utils.isLocatedBottom(d);

    if (!d.children) {
      uid = this.getUniqueId(d, 'bar');
      if (!this._childElements.parts[uid]) {
        this._childElements.parts[uid] = g.append('path')
          .attr('class', '_bar');
      }

      uid = this.getUniqueId(d, 'sector_leaf_text');
      if (!this._childElements.parts[uid]) {
        this._childElements.parts[uid] = g.append('text')
          .attr('class', 'sector_leaf_text');
      }
    } else {
      uid = this.getUniqueId(d, 'arc1');
      if (!this._childElements.parts[uid]) {
        this._childElements.parts[uid] = g.append('path')
          .attr('class', 'arc1');
      }

      uid = this.getUniqueId(d, 'arc2');
      if (!this._childElements.parts[uid]) {
        this._childElements.parts[uid] = g.append('path')
          .attr('class', 'arc2');
      }

      uid = this.getUniqueId(d, 'arc_for_label');
      if (!this._childElements.parts[uid]) {
        this._childElements.parts[uid] = g.append('path')
          .attr('class', 'arc_for_label')
          .attr('id', function(d) {
            return self.getUniqueId(d, 'arc_for_label');
          })
          .style('stroke-opacity', 0)
          .style('fill-opacity', 0);
      }

      uid = this.getUniqueId(d, 'sector_label_path');
      if (!this._childElements.parts[uid]) {
        this._childElements.parts[uid] = g.append('text')
          .attr('class', 'sector_label')
          .attr('visibility', function(d) {
            return d.depth === 1 ? 'visible' : null;
          })
          .attr('class', 'sector_nonleaf_text')
          .append('textPath')
          .attr('class', 'sector_label_path')
          .attr('position-in-sector', d.depth <= 1 ? 'center' : (bottom ? 'inner' : 'outer')) // Since both text lines share the same 'd', this class annotation tells where is the text, helping to determine the real arc length
          .attr('font-size', function(d) {
            return 30 / Math.sqrt(d.depth + 1);
          })
          .attr('xlink:href', function(d) {
            return '#' + self.getUniqueId(d, 'arc_for_label');
          });
      }

      if (d.depth > 1) {
        uid = this.getUniqueId(d, 'arc_for_label_number');
        if (!this._childElements.parts[uid]) {
          this._childElements.parts[uid] = g.append('path')
            .attr('class', 'arc_for_label_number')
            .attr('id', function(d) {
              return self.getUniqueId(d, 'arc_for_label_number');
            })
            .style('stroke-opacity', 0)
            .style('fill-opacity', 0);
        }

        uid = this.getUniqueId(d, 'sector_label_number_path');
        if (!this._childElements.parts[uid]) {
          this._childElements.parts[uid] = g.append('text')
            .attr('class', 'sector_label_number ')
            .attr('visibility', function(d) {
              return d.depth === 1 ? 'visible' : null;
            })
            .attr('class', 'sector_nonleaf_text')
            .append('textPath')
            .attr('class', 'sector_label_number_path')
            .attr('position-in-sector', bottom ? 'outer' : 'inner') // Since both text lines share the same 'd', this class annotation tells where is the text, helping to determine the real arc length
            .attr('font-size', function() {
              return 10;
            })
            .attr('xlink:href', function(d) {
              return '#' + self.getUniqueId(d, 'arc_for_label_number');
            });
        }
      }
    }
  }
}

module.exports = SunburstWidget;
