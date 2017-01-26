(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.PersonalitySunburstChart = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/germana/workspace/sunburst-chart/lib/d3-profile-wrappers/v2/index.js":[function(require,module,exports){
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
/* eslint-disable no-console */

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PersonalityProfile = function () {
  function PersonalityProfile(profile) {
    _classCallCheck(this, PersonalityProfile);

    this._traits = profile.tree.children[0].children[0];
    this._needs = profile.tree.children[1].children[0];
    this._values = profile.tree.children[2].children[0];
  }

  /**
  * Creates a tree object matching the format used by D3 tree visualizations:
  *   each node in the tree must have a 'name' and 'children' attribute except leaf nodes
  *   which only require a 'name' attribute
  **/


  _createClass(PersonalityProfile, [{
    key: 'd3Json',
    value: function d3Json() {
      return {
        tree: {
          children: [{
            name: 'Big 5',
            id: 'personality',
            children: [this.traitsTree()]
          }, {
            name: 'Values',
            id: 'values',
            children: [this.valuesTree()]
          }, {
            name: 'Needs',
            id: 'needs',
            children: [this.needsTree()]
          }]
        }
      };
    }
  }, {
    key: 'traitsTree',
    value: function traitsTree() {
      return {
        name: this.traitWithHighestScore().name,
        id: this.traitWithHighestScore().id,
        category: this.traitWithHighestScore().category,
        score: this.traitWithHighestScore().percentage,
        children: this._traits.children.map(function (t) {
          return {
            name: t.name,
            id: t.id,
            category: t.category,
            score: t.percentage,
            children: t.children.map(function (f) {
              return {
                name: f.name,
                id: f.id,
                category: f.category,
                score: f.percentage
              };
            })
          };
        })
      };
    }
  }, {
    key: 'needsTree',
    value: function needsTree() {
      return {
        name: this.needWithHighestScore().name,
        id: this.needWithHighestScore().id,
        category: this.needWithHighestScore().category,
        score: this.needWithHighestScore().percentage,
        children: this._needs.children.map(function (n) {
          return {
            name: n.name,
            id: n.id,
            category: n.category,
            score: n.percentage
          };
        })
      };
    }
  }, {
    key: 'valuesTree',
    value: function valuesTree() {
      return {
        name: this.valueWithHighestScore().name,
        id: this.valueWithHighestScore().id,
        category: this.valueWithHighestScore().category,
        score: this.valueWithHighestScore().percentage,
        children: this._values.children.map(function (v) {
          return {
            name: v.name,
            id: v.id,
            category: v.category,
            score: v.percentage
          };
        })
      };
    }
  }, {
    key: 'traitWithHighestScore',
    value: function traitWithHighestScore() {
      return this._traits;
    }
  }, {
    key: 'needWithHighestScore',
    value: function needWithHighestScore() {
      return this._needs;
    }
  }, {
    key: 'valueWithHighestScore',
    value: function valueWithHighestScore() {
      return this._values;
    }
  }]);

  return PersonalityProfile;
}();

module.exports = PersonalityProfile;

},{}],"/Users/germana/workspace/sunburst-chart/lib/d3-profile-wrappers/v3/index.js":[function(require,module,exports){
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
/* eslint-disable no-console */

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PersonalityProfile = function () {
  function PersonalityProfile(profile) {
    _classCallCheck(this, PersonalityProfile);

    this._traits = profile.personality;
    this._needs = profile.needs;
    this._values = profile.values;
  }

  /**
  * Creates a tree object matching the format used by D3 tree visualizations:
  *   each node in the tree must have a 'name' and 'children' attribute except leaf nodes
  *   which only require a 'name' attribute
  **/


  _createClass(PersonalityProfile, [{
    key: 'd3Json',
    value: function d3Json() {
      return {
        tree: {
          children: [{
            name: 'Big 5',
            id: 'personality',
            children: [this.traitsTree()]
          }, {
            name: 'Values',
            id: 'values',
            children: [this.valuesTree()]
          }, {
            name: 'Needs',
            id: 'needs',
            children: [this.needsTree()]
          }]
        }
      };
    }
  }, {
    key: 'traitsTree',
    value: function traitsTree() {
      var mostSignificantTrait = this.mostSignificantChild(this._traits);
      return {
        name: mostSignificantTrait.name,
        id: mostSignificantTrait.trait_id + '_parent',
        category: mostSignificantTrait.category,
        score: mostSignificantTrait.percentile,
        children: this._traits.map(function (t) {
          return {
            name: t.name,
            id: t.trait_id,
            category: t.category,
            score: t.percentile,
            children: t.children.map(function (f) {
              return {
                name: f.name,
                id: f.trait_id,
                category: f.category,
                score: f.percentile
              };
            })
          };
        })
      };
    }
  }, {
    key: 'needsTree',
    value: function needsTree() {
      var mostSignificantNeed = this.mostSignificantChild(this._needs);
      return {
        name: mostSignificantNeed.name,
        id: mostSignificantNeed.trait_id + '_parent',
        category: mostSignificantNeed.category,
        score: mostSignificantNeed.percentile,
        children: this._needs.map(function (n) {
          return {
            name: n.name,
            id: n.trait_id,
            category: n.category,
            score: n.percentile
          };
        })
      };
    }
  }, {
    key: 'valuesTree',
    value: function valuesTree() {
      var mostSignificantValue = this.mostSignificantChild(this._values);
      return {
        name: mostSignificantValue.name,
        id: mostSignificantValue.trait_id + '_parent',
        category: mostSignificantValue.category,
        score: mostSignificantValue.percentile,
        children: this._values.map(function (v) {
          return {
            name: v.name,
            id: v.trait_id,
            category: v.category,
            score: v.percentile
          };
        })
      };
    }
  }, {
    key: 'mostSignificantChild',
    value: function mostSignificantChild(children) {
      var threshold = 0.5;
      var farthestDistance = 0;
      var childWithScoreFarthestFromThreshold = {};

      for (var i = 0; i < children.length; i++) {
        var distance = Math.abs(children[i].percentile - threshold);
        if (distance >= farthestDistance) {
          childWithScoreFarthestFromThreshold = children[i];
          farthestDistance = distance;
        }
      }
      return childWithScoreFarthestFromThreshold;
    }
  }]);

  return PersonalityProfile;
}();

module.exports = PersonalityProfile;

},{}],"/Users/germana/workspace/sunburst-chart/lib/index.js":[function(require,module,exports){
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
/* global window, document */
/**
 * Renders the sunburst visualization. The parameter is the tree as returned
 * from the Personality Insights JSON API.
 */

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var extend = require('extend');
var pick = require('object.pick');

var ChartRenderer = require('./personality-chart-renderer');
var D3PersonalityProfileV2 = require('./d3-profile-wrappers/v2/index');
var D3PersonalityProfileV3 = require('./d3-profile-wrappers/v3/index');
var colors = require('./utilities/colors');

// Dependencies check
var dependencies = {
  'd3': 'D3js'
};

Object.keys(dependencies).forEach(function (dependency) {
  if (typeof window[dependency] === 'undefined') {
    throw new Error(dependencies[dependency] + ' is not present. Personality Sunburst Chart can\'t render without it.');
  }
});

var PersonalitySunburstChart = function () {
  function PersonalitySunburstChart(options) {
    _classCallCheck(this, PersonalitySunburstChart);

    this._options = extend({}, this.defaultOptions(), pick(options, ['selector', 'version']));
    this._version = this._options.version;
    this._selector = this._options.selector;
    this.visualizationWidth = this._options.width || '100%';
    this.visualizationHeight = this._options.height || '100%';
    this.width = (1 / this._options.scale || 1) * 45 * 16.58;
    this.height = (1 / this._options.scale || 1) * 45 * 16.58;
    this.exclude = this._options.exclude || [];
    this.d3Container = d3.select(this._selector), this.dimW = this.width, this.dimH = this.height, this.d3vis = undefined, this.touchDiv = undefined, this.data = undefined, this.id = 'SystemUWidget', this.COLOR_PALLETTE = colors, this.loadingDiv = 'dummy';
  }

  _createClass(PersonalitySunburstChart, [{
    key: 'defaultOptions',
    value: function defaultOptions() {
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

  }, {
    key: 'show',
    value: function show(theProfile, personImageUrl) {
      var self = this;
      var d3Profile = self._version === 'v3' ? new D3PersonalityProfileV3(theProfile) : new D3PersonalityProfileV2(theProfile);
      var widgetId = self._selector;

      // Clear DOM element that will display the sunburst chart
      document.querySelector(widgetId).innerHTML = null;

      // Create widget
      var widget = {
        d3vis: d3.select(widgetId).append('svg:svg').attr('width', self.visualizationWidth).attr('height', self.visualizationHeight).attr('viewBox', '0 -30 ' + self.height + ', ' + self.width),
        data: d3Profile.d3Json(),
        dimH: self.height,
        dimW: self.width,
        id: self.id,
        exclude: self.exclude,
        COLOR_PALLETTE: colors,
        loadingDiv: self.loadingDiv,
        switchState: function switchState() {},
        _layout: function _layout() {},
        showTooltip: function showTooltip() {},
        expandAll: function expandAll() {
          this.vis.selectAll('g').each(function () {
            var g = d3.select(this);
            if (g.datum().parent && // Isn't the root g object.
            g.datum().parent.parent && // Isn't the feature trait.
            g.datum().parent.parent.parent) {
              // Isn't the feature dominant trait.
              g.attr('visibility', 'visible');
            }
          });
        },
        collapseAll: function collapseAll() {
          this.vis.selectAll('g').each(function () {
            var g = d3.select(this);
            if (g.datum().parent !== null && // Isn't the root g object.
            g.datum().parent.parent !== null && // Isn't the feature trait.
            g.datum().parent.parent.parent !== null) {
              // Isn't the feature dominant trait.
              g.attr('visibility', 'hidden');
            }
          });
        },
        addPersonImage: function addPersonImage(url) {
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
          icon_defs.append('pattern').attr('id', id).attr('height', 1).attr('width', 1).attr('patternUnits', 'objectBoundingBox').append('image').attr('width', scaled_w).attr('height', scaled_w).attr('x', radius - scaled_w / 2) // r = 65 -> x = -25
          .attr('y', radius - scaled_w / 2).attr('xlink:href', url).attr('opacity', 1.0).on('dblclick.zoom', null);
          this.vis.append('circle').attr('r', radius).attr('stroke-width', 0).attr('fill', 'url(#' + id + ')');
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
  }]);

  return PersonalitySunburstChart;
}();

module.exports = PersonalitySunburstChart;

},{"./d3-profile-wrappers/v2/index":"/Users/germana/workspace/sunburst-chart/lib/d3-profile-wrappers/v2/index.js","./d3-profile-wrappers/v3/index":"/Users/germana/workspace/sunburst-chart/lib/d3-profile-wrappers/v3/index.js","./personality-chart-renderer":"/Users/germana/workspace/sunburst-chart/lib/personality-chart-renderer.js","./utilities/colors":"/Users/germana/workspace/sunburst-chart/lib/utilities/colors.js","extend":"/Users/germana/workspace/sunburst-chart/node_modules/extend/index.js","object.pick":"/Users/germana/workspace/sunburst-chart/node_modules/object.pick/index.js"}],"/Users/germana/workspace/sunburst-chart/lib/personality-chart-renderer.js":[function(require,module,exports){
/**
 * Copyright 2014-2015 IBM Corp. All Rights Reserved.
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
/* global alert */
'use strict';

var d3SvgSingleArc = function d3SvgSingleArc() {
  var radius = d3_svg_singleArcRadius,
      startAngle = d3_svg_singleArcStartAngle,
      endAngle = d3_svg_singleArcEndAngle,
      d3_svg_arcOffset = -Math.PI / 2;

  function arc() {
    var r0 = radius.apply(this, arguments),
        a0 = startAngle.apply(this, arguments) + d3_svg_arcOffset,
        a1 = endAngle.apply(this, arguments) + d3_svg_arcOffset,
        da = (a1 < a0 && (da = a0, a0 = a1, a1 = da), a1 - a0),
        df = da < Math.PI ? '0' : '1',
        c0 = Math.cos(a0),
        s0 = Math.sin(a0),
        c1 = Math.cos(a1),
        s1 = Math.sin(a1);
    return 'M' + r0 * c0 + ',' + r0 * s0 + 'A' + r0 + ',' + r0 + ' 0 ' + df + ',1 ' + r0 * c1 + ',' + r0 * s1;
  }

  arc.radius = function (v) {
    if (!arguments.length) return radius;
    radius = d3.functor(v);
    return arc;
  };

  arc.startAngle = function (v) {
    if (!arguments.length) return startAngle;
    startAngle = d3.functor(v);
    return arc;
  };

  arc.endAngle = function (v) {
    if (!arguments.length) return endAngle;
    endAngle = d3.functor(v);
    return arc;
  };

  arc.centroid = function () {
    var r = radius.apply(this, arguments),
        a = (startAngle.apply(this, arguments) + endAngle.apply(this, arguments)) / 2 + d3_svg_arcOffset;
    return [Math.cos(a) * r, Math.sin(a) * r];
  };

  return arc;
};

function d3_svg_singleArcRadius(d) {
  return d.radius;
}

function d3_svg_singleArcStartAngle(d) {
  return d.startAngle;
}

function d3_svg_singleArcEndAngle(d) {
  return d.endAngle;
}

var visutil = {
  isLocatedBottom: function isLocatedBottom(d) {
    // Before fixing #128: return (d.x>Math.PI/2&&(d.x+d.dx)<Math.PI*5/3);
    var bottom = d.x > Math.PI / 2 && d.x + d.dx < 5.0;
    return bottom;
  },

  arc: function arc(start, end, r0) {
    var c0 = Math.cos(start),
        s0 = Math.sin(start),
        c1 = Math.cos(end),
        s1 = Math.sin(end);
    return 'M' + r0 * c0 + ',' + r0 * s0 + 'A' + r0 + ',' + r0 + ' 0' + ' 0 , 0 ' + r0 * c1 + ',' + r0 * s1;
  }
};

var renderChart = function renderChart() {
  console.debug('personality-chart-renderer: defining renderChart');
  if (!this.data) {
    console.debug('personality-chart-renderer: data not defined.');
    return;
  }
  if (this.vis) {
    console.error('Cannot render: Already rendered (this.vis)');
    return;
  }

  var _this = this;
  var dummyData = false;
  var tree = this.data ? this.data.tree ? this.data.tree : this.data : null;
  if (!tree || !tree.children || !tree.children.length) {
    return;
  }

  var _widget = this;
  if (!this.loadingDiv) {
    alert('Widget is not fully initialized, cannot render BarsWidget');
    return;
  }

  this.switchState(1);
  this._layout();

  function stash(d) {
    d.x0 = d.x;
    d.dx0 = d.dx;
    if (!d.hasOwnProperty('size') && !d.hasOwnProperty('children')) d.size0 = 1;else d.size0 = d.size;
    if (d.depth === 0 || d.depth === 1) {
      d.expand = 1;
    } else {
      d.expand = 0;
    }
  }

  function expandOrFoldSector(d) {
    if (d.expand !== null && d.depth > 1) {
      //ignore root node and first level sectors
      if (d.expand === 0) {
        if (d.children) d3.select(this).attr('opacity', 1);
        g.filter(function (a) {
          if (a.parent) return a.parent.id === d.id;
        }).attr('visibility', 'visible');
        d.expand = 1;
      } else {
        //if the sector is expanded
        if (d.children) d3.select(this).attr('opacity', 1);
        hideSector(d);
      }
    }
  }

  function hideSector(d) {
    g.filter(function (a) {
      if (a.parent) return a.parent.id === d.id;
    }).attr('visibility', 'hidden').attr('opacity', 1).each(function (a) {
      if (a.children) hideSector(a);
    });
    d.expand = 0;
  }

  var sector_right_pad = dummyData ? 0.0001 : 0.04 * 2 * Math.PI,
      sector_bottom_pad = 5.0;
  //Render a sector with two adjcent arcs in a style of odometor
  function twoArcsRender() {
    // For each small multiple
    function twoArcs(g) {
      g.each(function (d) {
        g = d3.select(this);
        g.selectAll('path').remove();
        g.selectAll('text').remove();

        var right_pad = d.depth > 0 ? sector_right_pad / (3 * d.depth) : sector_right_pad;

        var score = d.score,
            score2 = 1; //for score sentiment data. it is the score of positive+netural

        //if score is null, then give 1
        if (score === null) score = 1;
        if (d.score_lbl === null) d.score_lbl = '';
        var label,
            label_name = d.name,
            label_score = d.score === null || isNaN(d.score) ? '' : ' (' + (d.score * 100).toFixed(0) + '%)';

        if (d.depth === 1) label = d.name;
        if (d.depth > 1) {
          if (d.id === 'sbh_dom' || d.id === 'sbh_parent') {
            label = d.name;
          } else if (d.category === 'values') {
            label = d.name + ((score * 100).toFixed(0) === 'NaN' || isNaN(score) ? '' : ' (' + (score * 100).toFixed(0) + '%)');
          } else {
            if (score >= 1) {
              score = 0.99;
              console.debug('score is over 1!' + d.name);
            } else if (score <= -1) {
              score = -0.99;
              console.debug('score is below -1!' + d.name);
            }
            label = d.name + ((score * 100).toFixed(0) === 'NaN' || isNaN(score) ? '' : ' (' + (score * 100).toFixed(0) + '%)');

            if (Math.round(parseFloat(score) * 100) / 100 === 0) {
              label = d.name;
            }
          }
        }

        //for request without any result
        if (d.name === '') {
          score = 0;
          label = '';
        }

        //special render perception sector
        if (d.perc_neu !== null && (d.score + d.perc_neu) * d.dx < d.dx - sector_right_pad / (3 * d.depth)) {
          score2 = d.score + d.perc_neu;

          d3.svg.arc().startAngle(function (d) {
            return d.x + Math.abs(score2) * d.dx;
          }) //x:startangle,
          .endAngle(function (d) {
            return d.x + d.dx - sector_right_pad / (3 * d.depth);
          }) //dx: endangle,
          .innerRadius(function (d) {
            return sector_bottom_pad + d.y;
          }).outerRadius(function (d) {
            return d.y + d.dy;
          });

          right_pad = 0;
        }

        var arc1_extend = Math.abs(score) * d.dx - right_pad > 0 ? Math.abs(score) * d.dx - right_pad : 0;
        //Regular renders
        var arc1 = d3.svg.arc().startAngle(function (d) {
          return d.x;
        }) //x:startangle,
        .endAngle(function (d) {
          return d.x + arc1_extend;
        }) //dx: endangle,
        .innerRadius(function (d) {
          return sector_bottom_pad + d.y;
        }).outerRadius(function (d) {
          return d.y + d.dy;
        });

        var arc2 = d3.svg.arc().startAngle(function (d) {
          return d.x + arc1_extend;
        }) //x:startangle,
        .endAngle(function (d) {
          return d.x + Math.abs(score2) * d.dx - right_pad;
        }) //dx: endangle,
        .innerRadius(function (d) {
          return sector_bottom_pad + d.y;
        }).outerRadius(function (d) {
          return d.y + d.dy;
        });

        //used for label path
        var arc_for_label, arc_for_label_number;
        var arc_label_radius, arc_label_number_radius;
        if (d.depth === 1 && visutil.isLocatedBottom(d)) {
          arc_label_radius = d.y + d.dy - (d.y + d.dy - sector_bottom_pad - d.y) / 6;
          arc_label_number_radius = d.y + d.dy - (d.y + d.dy - sector_bottom_pad - d.y) / 8;
        } else {
          arc_label_radius = sector_bottom_pad + d.y + (d.y + d.dy - sector_bottom_pad - d.y) * 5 / 12;
          arc_label_number_radius = d.y + d.dy - (d.y + d.dy - sector_bottom_pad - d.y) / 7;
        }

        var bottom = visutil.isLocatedBottom(d);
        if (bottom) {
          //special reversed label for bottom data
          arc_for_label = visutil.arc(d.x + d.dx - right_pad - Math.PI / 2, d.x - Math.PI / 2, arc_label_radius);
          arc_for_label_number = visutil.arc(d.x + d.dx - right_pad - Math.PI / 2, d.x - Math.PI / 2, arc_label_number_radius);
        } else {

          arc_for_label = d3.svg.singleArc().startAngle(function (d) {
            return d.x;
          }).endAngle(function (d) {
            return d.x + d.dx - right_pad;
          }).radius(function (d) {
            return d.depth === 1 ? d.y + d.dy - (d.y + d.dy - sector_bottom_pad - d.y) / 3 : sector_bottom_pad + d.y + (d.y + d.dy - sector_bottom_pad - d.y) * 3 / 5;
          });

          arc_for_label_number = d3.svg.singleArc().startAngle(function (d) {
            return d.x;
          }).endAngle(function (d) {
            return d.x + d.dx - right_pad;
          }).radius(function (d) {
            return d.depth === 1 ? d.y + d.dy - (d.y + d.dy - sector_bottom_pad - d.y) / 3 : sector_bottom_pad + d.y + (d.y + d.dy - sector_bottom_pad - d.y) / 5;
          });
        }

        d.coloridx = d.depth === 1 || d.depth === 0 ? d.id : d.parent.coloridx;
        var arc1color;
        var outerRingColor, innerRingLightColor, innerRingDarkColor;

        if (d.coloridx === 'personality') {
          innerRingDarkColor = _widget.COLOR_PALLETTE.traits_dark;
          innerRingLightColor = _widget.COLOR_PALLETTE.traits_light;
          outerRingColor = _widget.COLOR_PALLETTE.facet;
        }

        if (d.coloridx === 'needs') {
          innerRingDarkColor = _widget.COLOR_PALLETTE.needs_dark;
          innerRingLightColor = _widget.COLOR_PALLETTE.needs_light;
          outerRingColor = _widget.COLOR_PALLETTE.need;
        }
        if (d.coloridx === 'values') {
          innerRingDarkColor = _widget.COLOR_PALLETTE.values_dark;
          innerRingLightColor = _widget.COLOR_PALLETTE.values_light;
          outerRingColor = _widget.COLOR_PALLETTE.value;
        }

        arc1color = d.depth < 2 ? d3.color(innerRingLightColor) : d3.color(innerRingDarkColor);
        var strokecolor = arc1color;

        //if (!d.children && d.id !== 'srasrt' && d.id !== 'srclo' && d.id !== 'srdom') {
        if (!d.children) {
          label = d.name;
          score = d.score;
          var bar_length_factor = 10 / (d.depth - 2);

          //different bar_length factors
          if (d.parent) if (d.parent.parent) {
            if (d.parent.parent.id === 'needs' || d.parent.parent.id === 'values') {
              bar_length_factor = 1;
            }
            if (d.parent.parent.parent) if (d.parent.parent.parent.id === 'personality') bar_length_factor = 1;
          } else {
            console.debug(d.name + ': Parent is null!');
          }

          var inner_r = sector_bottom_pad + d.y;
          var out_r = sector_bottom_pad + d.y + bar_length_factor * Math.abs(score) * d.dy;
          if (d.score_lbl === 'Low') out_r = sector_bottom_pad + d.y + bar_length_factor * 0.2 * d.dy;

          var _bar = d3.svg.arc().startAngle(d.x).endAngle(d.x + d.dx).innerRadius(inner_r).outerRadius(out_r); // Draw leaf arcs

          g.append('path').attr('class', '_bar').attr('d', _bar).style('stroke', '#EEE').style('fill', function () {
            return d3.color(outerRingColor);
          });

          //add label;

          var rotate = 0,
              lbl_anchor = 'start',
              dy_init = 0;

          label = d.name;

          if (d.x > Math.PI) {
            rotate = d.x * 180 / Math.PI + 90;
            lbl_anchor = 'end';
            dy_init = -d.dx * 20 * Math.PI;
          } else {
            rotate = d.x * 180 / Math.PI - 90;
            lbl_anchor = 'start';
            dy_init = 5 + d.dx * 20 * Math.PI;
          }

          var max_label_size = 13,
              lable_size = 10;

          if (7.5 + 15 * Math.PI * d.dx > max_label_size) {
            lable_size = max_label_size;
          }

          label = label + ((score * 100).toFixed(0) === 'NaN' || isNaN(score) ? '' : ' (' + (score * 100).toFixed(0) + '%)');

          g.append('text').attr('dy', dy_init).attr('class', 'sector_leaf_text').attr('font-size', lable_size).attr('text-anchor', lbl_anchor).attr('transform', 'translate(' + (out_r + 5) * Math.sin(d.x) + ',' + -(out_r + 5) * Math.cos(d.x) + ') ' + 'rotate(' + rotate + ')').text(label);
        } else {
          //non-bar/non-leaf sector
          g.append('path').attr('class', 'arc1').attr('d', arc1).style('stroke', strokecolor) // was: arc1color
          .style('fill', arc1color);

          g.append('path').attr('class', 'arc2').attr('d', arc2).style('stroke', strokecolor) // was: arc1color
          .style('fill', arc1color).style('fill-opacity', 0.15);

          //draw label:
          //path used for label
          g.append('path').attr('class', 'arc_for_label')
          // NOTE HB: adding widget.id so we to avoid name clashing
          .attr('id', function (d) {
            return _this.id + '_' + d.id + '.arc_for_label';
          }).attr('d', arc_for_label).style('stroke-opacity', 0).style('fill-opacity', 0);

          //add label
          g.append('text').attr('class', 'sector_label').attr('visibility', function (d) {
            return d.depth === 1 ? 'visible' : null;
          }).attr('class', 'sector_nonleaf_text').append('textPath').attr('class', 'sector_label_path').attr('position-in-sector', d.depth <= 1 ? 'center' : bottom ? 'inner' : 'outer') // Since both text lines share the same 'd', this class annotation tells where is the text, helping to determine the real arc length
          .attr('font-size', function (d) {
            return 30 / Math.sqrt(d.depth + 1);
          })
          // NOTE HB: Why do we need this xlink:href? In any case, adding widget.id so we to avoid name clashing
          .attr('xlink:href', function (d) {
            return '#' + _this.id + '_' + d.id + '.arc_for_label';
          }).text(label_name);

          //draw label number
          //path used for label number
          if (d.depth > 1) {
            g.append('path').attr('class', 'arc_for_label_number')
            // NOTE HB: adding widget.id so we to avoid name clashing
            .attr('id', function (d) {
              return _this.id + '_' + d.id + '.arc_for_label_number';
            }).attr('d', arc_for_label_number).style('stroke-opacity', 0).style('fill-opacity', 0);

            //add label
            g.append('text').attr('class', 'sector_label_number ').attr('visibility', function (d) {
              return d.depth === 1 ? 'visible' : null;
            })
            //.attr('font-family','sans-serif')
            .attr('class', 'sector_nonleaf_text')
            //.attr('fill', d3.rgb(arc1color).darker(2))
            .append('textPath').attr('class', 'sector_label_number_path').attr('position-in-sector', bottom ? 'outer' : 'inner') // Since both text lines share the same 'd', this class annotation tells where is the text, helping to determine the real arc length
            .attr('font-size', function () {
              return 10;
            })
            // NOTE HB: Why do we need this xlink:href? In any case, adding widget.id so we to avoid name clashing
            .attr('xlink:href', function (d) {
              return '#' + _this.id + '_' + d.id + '.arc_for_label_number';
            }).text(label_score);
          }
        }
      });
    }

    return twoArcs;
  }

  function updateLabelLayout() {
    updateLabelLayoutWithClass('.sector_label_path');
    updateLabelLayoutWithClass('.sector_label_number_path');
  }

  function updateLabelLayoutWithClass(_class) {
    var max_font_size_base = 16;

    _this.d3vis.selectAll(_class).each(function (d) {
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

  var width = this.dimW,
      height = this.dimH;
  // The flower had a radius of 640 / 1.9 = 336.84 in the original.
  var radius = Math.min(width, height) / 3.2;
  var sector = twoArcsRender(radius);

  // Center the graph of 'g'
  var vis = this.d3vis.append('g').attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')').append('g');
  this.vis = vis;

  var partition = d3.layout.partition().sort(null).size([2 * Math.PI, radius]).value(function (d) {
    if (!d.hasOwnProperty('size') && !d.hasOwnProperty('children')) return 1;
    return d.size;
  });

  var profile = {
    children: tree.children
  };

  // exclude specified sectors
  var exclude = this.exclude;
  profile.children = profile.children.filter(function (child) {
    return exclude.indexOf(child.id) === -1;
  });

  var g = vis.data([profile]).selectAll('g').data(partition.nodes).enter().append('g').attr('class', 'sector').attr('visibility', function (d) {
    return d.depth === 2 || d.forceVisible ? 'visible' : 'hidden';
  }) // hide non-first level rings
  .call(sector).each(stash).on('click', expandOrFoldSector).on('mouseover', function (d) {
    _this.showTooltip(d, this);
  }).on('mouseout', function () {
    _this.showTooltip();
  });

  // Shift the text pieces clockwise (to somewhat center them).
  updateLabelLayout();
};

function setupD3() {
  d3.svg.singleArc = d3SvgSingleArc;
}

function setupAndRender() {
  setupD3();
  renderChart.call(this);
}

module.exports = {
  render: setupAndRender
};

},{}],"/Users/germana/workspace/sunburst-chart/lib/utilities/colors.js":[function(require,module,exports){
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

},{}],"/Users/germana/workspace/sunburst-chart/node_modules/extend/index.js":[function(require,module,exports){
'use strict';

var hasOwn = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;

var isArray = function isArray(arr) {
	if (typeof Array.isArray === 'function') {
		return Array.isArray(arr);
	}

	return toStr.call(arr) === '[object Array]';
};

var isPlainObject = function isPlainObject(obj) {
	if (!obj || toStr.call(obj) !== '[object Object]') {
		return false;
	}

	var hasOwnConstructor = hasOwn.call(obj, 'constructor');
	var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
	// Not own constructor property must be Object
	if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for (key in obj) {/**/}

	return typeof key === 'undefined' || hasOwn.call(obj, key);
};

module.exports = function extend() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0],
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if (typeof target === 'boolean') {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	} else if ((typeof target !== 'object' && typeof target !== 'function') || target == null) {
		target = {};
	}

	for (; i < length; ++i) {
		options = arguments[i];
		// Only deal with non-null/undefined values
		if (options != null) {
			// Extend the base object
			for (name in options) {
				src = target[name];
				copy = options[name];

				// Prevent never-ending loop
				if (target !== copy) {
					// Recurse if we're merging plain objects or arrays
					if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && isArray(src) ? src : [];
						} else {
							clone = src && isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[name] = extend(deep, clone, copy);

					// Don't bring in undefined values
					} else if (typeof copy !== 'undefined') {
						target[name] = copy;
					}
				}
			}
		}
	}

	// Return the modified object
	return target;
};


},{}],"/Users/germana/workspace/sunburst-chart/node_modules/isobject/index.js":[function(require,module,exports){
/*!
 * isobject <https://github.com/jonschlinkert/isobject>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var isArray = require('isarray');

module.exports = function isObject(val) {
  return val != null && typeof val === 'object' && isArray(val) === false;
};

},{"isarray":"/Users/germana/workspace/sunburst-chart/node_modules/isobject/node_modules/isarray/index.js"}],"/Users/germana/workspace/sunburst-chart/node_modules/isobject/node_modules/isarray/index.js":[function(require,module,exports){
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],"/Users/germana/workspace/sunburst-chart/node_modules/object.pick/index.js":[function(require,module,exports){
/*!
 * object.pick <https://github.com/jonschlinkert/object.pick>
 *
 * Copyright (c) 2014-2015 Jon Schlinkert, contributors.
 * Licensed under the MIT License
 */

'use strict';

var isObject = require('isobject');

module.exports = function pick(obj, keys) {
  if (!isObject(obj) && typeof obj !== 'function') {
    return {};
  }

  var res = {};
  if (typeof keys === 'string') {
    if (keys in obj) {
      res[keys] = obj[keys];
    }
    return res;
  }

  var len = keys.length;
  var idx = -1;

  while (++idx < len) {
    var key = keys[idx];
    if (key in obj) {
      res[key] = obj[key];
    }
  }
  return res;
};

},{"isobject":"/Users/germana/workspace/sunburst-chart/node_modules/isobject/index.js"}]},{},["/Users/germana/workspace/sunburst-chart/lib/index.js"])("/Users/germana/workspace/sunburst-chart/lib/index.js")
});