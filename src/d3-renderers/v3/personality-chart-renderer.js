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
const d3 = require('d3');
Object.assign(d3,
  require('d3-color')
);

const d3SvgSingleArc = require('../svg-single-arc');
const utils = require('../utils');

function renderChart(widget) {
  console.debug('personality-chart-renderer: defining renderChart');
  if (!widget.data) {
    console.debug('personality-chart-renderer: data not defined.');
    return;
  }

  var dummyData = false;
  var tree = widget.data ? (widget.data.tree ? widget.data.tree : widget.data) : null;
  if (!tree || !tree.children || !tree.children.length) {
    return;
  }

  if (!widget.loadingDiv) {
    alert('Widget is not fully initialized, cannot render BarsWidget');
    return;
  }

  widget.switchState(1);
  widget._layout();

  var sector_right_pad = dummyData ? 0.0001 : 0.04 * 2 * Math.PI,
    sector_bottom_pad = 5.0;
  //Render a sector with two adjcent arcs in a style of odometor
  function twoArcsRender() {
    // For each small multiple
    function twoArcs(g) {
      g.each(function(d) {
        g = d3.select(this);
        widget.createParts(g, d);

        var right_pad = d.depth > 0 ? sector_right_pad / (3 * d.depth) : sector_right_pad;
        var score = widget.getScore(d);

        if (!d.children) {
          var bar_length_factor = 10 / (d.depth - 2);

          //different bar_length factors
          if (d.parent) {
            if (d.parent.parent) {
              if (utils.getValue(d.parent.parent, 'id') === 'needs' || utils.getValue(d.parent.parent, 'id') === 'values') {
                bar_length_factor = 1;
              }
              if (d.parent.parent.parent)
                if (utils.getValue(d.parent.parent.parent, 'id') === 'personality') bar_length_factor = 1;
            } else {
              console.debug(d.name + ': Parent is null!');
            }
          }

          var inner_r = sector_bottom_pad + d.y;
          var out_r = sector_bottom_pad + d.y + bar_length_factor * Math.abs(score) * d.dy;

          var _bar = d3.svg.arc()
            .startAngle(d.x)
            .endAngle(d.x + d.dx)
            .innerRadius(inner_r)
            .outerRadius(out_r); // Draw leaf arcs

          widget._childElements.parts[widget.getUniqueId(d, 'bar')]
            .attr('d', _bar);

          //add label;
          var rotate = 0,
            lbl_anchor = 'start',
            dy_init = 0;

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

          if ((7.5 + 15 * Math.PI * d.dx) > max_label_size) {
            lable_size = max_label_size;
          }

          widget._childElements.parts[widget.getUniqueId(d, 'sector_leaf_text')]
            .attr('dy', dy_init)
            .attr('font-size', lable_size)
            .attr('text-anchor', lbl_anchor)
            .attr('transform', 'translate(' + (out_r + 5) * Math.sin(d.x) + ',' + (-(out_r + 5) * Math.cos(d.x)) + ') ' + 'rotate(' + rotate + ')');
        } else {
          var arc1_extend = (Math.abs(score) * d.dx - right_pad) > 0 ? (Math.abs(score) * d.dx - right_pad) : 0;
          //Regular renders
          var arc1 = d3.svg.arc()
            .startAngle(function(d) {
              return d.x;
            }) //x:startangle,
            .endAngle(function(d) {
              return d.x + arc1_extend;
            }) //dx: endangle,
            .innerRadius(function(d) {
              return sector_bottom_pad + d.y;
            })
            .outerRadius(function(d) {
              return d.y + d.dy;
            });
          widget._childElements.parts[widget.getUniqueId(d, 'arc1')]
            .attr('d', arc1);

          var arc2 = d3.svg.arc()
            .startAngle(function(d) {
              return d.x + arc1_extend;
            }) //x:startangle,
            .endAngle(function(d) {
              return d.x + d.dx - right_pad;
            }) //dx: endangle,
            .innerRadius(function(d) {
              return sector_bottom_pad + d.y;
            })
            .outerRadius(function(d) {
              return d.y + d.dy;
            });
          widget._childElements.parts[widget.getUniqueId(d, 'arc2')]
            .attr('d', arc2);

          //used for label path
          var bottom = utils.isLocatedBottom(d);
          var arc_for_label, arc_for_label_number;
          var arc_label_radius, arc_label_number_radius;
          if (d.depth === 1 && bottom) {
            arc_label_radius = d.y + d.dy - (d.y + d.dy - sector_bottom_pad - d.y) / 6;
            arc_label_number_radius = d.y + d.dy - (d.y + d.dy - sector_bottom_pad - d.y) / 8;
          } else {
            arc_label_radius = sector_bottom_pad + d.y + (d.y + d.dy - sector_bottom_pad - d.y) * 5 / 12;
            arc_label_number_radius = d.y + d.dy - (d.y + d.dy - sector_bottom_pad - d.y) / 7;
          }
          if (bottom) {
            //special reversed label for bottom data
            arc_for_label = utils.arc(d.x + d.dx - right_pad - Math.PI / 2, d.x - Math.PI / 2, arc_label_radius);
            arc_for_label_number = utils.arc(d.x + d.dx - right_pad - Math.PI / 2, d.x - Math.PI / 2, arc_label_number_radius);
          } else {
            arc_for_label = d3SvgSingleArc()
              .startAngle(function(d) {
                return d.x;
              })
              .endAngle(function(d) {
                return d.x + d.dx - right_pad;
              })
              .radius(function(d) {
                return d.depth === 1 ? d.y + d.dy - (d.y + d.dy - sector_bottom_pad - d.y) / 3 : sector_bottom_pad + d.y + (d.y + d.dy - sector_bottom_pad - d.y) * 3 / 5;
              });

            arc_for_label_number = d3SvgSingleArc()
              .startAngle(function(d) {
                return d.x;
              })
              .endAngle(function(d) {
                return d.x + d.dx - right_pad;
              })
              .radius(function(d) {
                return d.depth === 1 ? d.y + d.dy - (d.y + d.dy - sector_bottom_pad - d.y) / 3 : sector_bottom_pad + d.y + (d.y + d.dy - sector_bottom_pad - d.y) / 5;
              });
          }

          widget._childElements.parts[widget.getUniqueId(d, 'arc_for_label')]
            .attr('d', arc_for_label);

          //draw label number
          //path used for label number
          if (d.depth > 1) {
            widget._childElements.parts[widget.getUniqueId(d, 'arc_for_label_number')]
              .attr('d', arc_for_label_number);
          }
        }
      });
    }

    return twoArcs;
  }

  var width = widget.dimW,
    height = widget.dimH;
  // The flower had a radius of 640 / 1.9 = 336.84 in the original.
  var radius = Math.min(width, height) / 3.2;
  var sector = twoArcsRender(radius);

  // Center the graph of 'g'
  widget.vis = widget.d3vis.append('g')
    .attr('transform', 'translate(' + (width / 2) + ',' + height / 2 + ')')
    .append('g');

  var profile = {
    children: tree.children.filter(function (child) {
      return widget.exclude.indexOf(child.id) === -1;
    })
  };

  var partition = d3.layout.partition()
    .sort(null)
    .size([2 * Math.PI, radius])
    .value(function(d) {
      if (!d.hasOwnProperty('size') && !d.hasOwnProperty('children')) return 1;
      return d.size;
    });

  var g = widget.vis.data([profile]).selectAll('g')
    .data(partition.nodes)
    .enter().append('g')
    .attr('class', 'sector')
    .attr('visibility', function(d) {
      return d.depth === 2 || d.forceVisible ? 'visible' : 'hidden';
    }) // hide non-first level rings
    .call(sector)
    .each(function(d) {
      d.expand = 1;
    })
    .on('click', function(d) {
      utils.expandOrFoldSector(g, d, d3.select(this));
    })
    .on('mouseover', function(d) {
      widget.showTooltip(d, this);
    })
    .on('mouseout', function() {
      widget.showTooltip();
    });

  widget.updateText();
}

module.exports = {
  render: renderChart,
  d3: d3
};
