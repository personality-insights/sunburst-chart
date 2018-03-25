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

d3.svg.singleArc = require('../svg-single-arc');
const visutil = require('../visutil');

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

  function stash(d) {
    d.x0 = d.x;
    d.dx0 = d.dx;
    if (!d.hasOwnProperty('size') && !d.hasOwnProperty('children')) d.size0 = 1;
    else d.size0 = d.size;
    if (d.depth === 0 || d.depth === 1) {
      d.expand = 1;
    } else {
      d.expand = 0;
    }
  }

  var sector_right_pad = dummyData ? 0.0001 : 0.04 * 2 * Math.PI,
    sector_bottom_pad = 5.0;
  //Render a sector with two adjcent arcs in a style of odometor
  function twoArcsRender() {
    // For each small multiple
    function twoArcs(g) {
      g.each(function(d) {
        g = d3.select(this);
        var right_pad = d.depth > 0 ? sector_right_pad / (3 * d.depth) : sector_right_pad;

        var score = widget.getScore(d),
          score2 = 1; //for score sentiment data. it is the score of positive+netural

        //special render perception sector
        if (d.perc_neu !== null && ((d.score + d.perc_neu) * d.dx < d.dx - sector_right_pad / (3 * d.depth))) {
          score2 = d.score + d.perc_neu;

          d3.svg.arc()
            .startAngle(function(d) {
              return d.x + Math.abs(score2) * d.dx;
            }) //x:startangle,
            .endAngle(function(d) {
              return d.x + d.dx - sector_right_pad / (3 * d.depth);
            }) //dx: endangle,
            .innerRadius(function(d) {
              return sector_bottom_pad + d.y;
            })
            .outerRadius(function(d) {
              return d.y + d.dy;
            });

          right_pad = 0;
        }

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

        var arc2 = d3.svg.arc()
          .startAngle(function(d) {
            return d.x + arc1_extend;
          }) //x:startangle,
          .endAngle(function(d) {
            return d.x + Math.abs(score2) * d.dx - right_pad;
          }) //dx: endangle,
          .innerRadius(function(d) {
            return sector_bottom_pad + d.y;
          })
          .outerRadius(function(d) {
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

          arc_for_label = d3.svg.singleArc()
            .startAngle(function(d) {
              return d.x;
            })
            .endAngle(function(d) {
              return d.x + d.dx - right_pad;
            })
            .radius(function(d) {
              return d.depth === 1 ? d.y + d.dy - (d.y + d.dy - sector_bottom_pad - d.y) / 3 : sector_bottom_pad + d.y + (d.y + d.dy - sector_bottom_pad - d.y) * 3 / 5;
            });

          arc_for_label_number = d3.svg.singleArc()
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

        d.coloridx = (d.depth === 1 || d.depth === 0) ? d.id : d.parent.coloridx;
        var arc1color;
        var outerRingColor, innerRingLightColor, innerRingDarkColor;

        if (d.coloridx === 'personality'){
          innerRingDarkColor = widget.COLOR_PALLETTE.traits_dark;
          innerRingLightColor = widget.COLOR_PALLETTE.traits_light;
          outerRingColor = widget.COLOR_PALLETTE.facet;
        }

        if (d.coloridx === 'needs') {
          innerRingDarkColor = widget.COLOR_PALLETTE.needs_dark;
          innerRingLightColor = widget.COLOR_PALLETTE.needs_light;
          outerRingColor = widget.COLOR_PALLETTE.need;
        }
        if (d.coloridx === 'values') {
          innerRingDarkColor = widget.COLOR_PALLETTE.values_dark;
          innerRingLightColor = widget.COLOR_PALLETTE.values_light;
          outerRingColor = widget.COLOR_PALLETTE.value;
        }

        arc1color = d.depth < 2 ? d3.color(innerRingLightColor) : d3.color(innerRingDarkColor);
        var strokecolor = arc1color;

        //if (!d.children && d.id !== 'srasrt' && d.id !== 'srclo' && d.id !== 'srdom') {
        if (!d.children) {
          var bar_length_factor = 10 / (d.depth - 2);

          //different bar_length factors
          if (d.parent) {
            if (d.parent.parent) {
              if (d.parent.parent.id === 'needs' || d.parent.parent.id === 'values') {
                bar_length_factor = 1;
              }
              if (d.parent.parent.parent)
                if (d.parent.parent.parent.id === 'personality') bar_length_factor = 1;
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

          if (!widget._childElements.paths[widget.getUniqueId(d, 'bar')]) {
            widget._childElements.paths[widget.getUniqueId(d, 'bar')] = g.append('path');
          }
          widget._childElements.paths[widget.getUniqueId(d, 'bar')]
            .attr('class', '_bar')
            .attr('d', _bar)
            .style('stroke', '#EEE')
            .style('fill', function() {
              return d3.color(outerRingColor);
            });

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

          if (!widget._childElements.texts[widget.getUniqueId(d, 'sector_leaf_text')]) {
            widget._childElements.texts[widget.getUniqueId(d, 'sector_leaf_text')] = g.append('text');
          }
          widget._childElements.texts[widget.getUniqueId(d, 'sector_leaf_text')]
            .attr('dy', dy_init)
            .attr('class', 'sector_leaf_text')
            .attr('font-size', lable_size)
            .attr('text-anchor', lbl_anchor)
            .attr('transform', 'translate(' + (out_r + 5) * Math.sin(d.x) + ',' + (-(out_r + 5) * Math.cos(d.x)) + ') ' + 'rotate(' + rotate + ')');
        } else {
          //non-bar/non-leaf sector
          if (!widget._childElements.paths[widget.getUniqueId(d, 'arc1')]) {
            widget._childElements.paths[widget.getUniqueId(d, 'arc1')] = g.append('path');
          }
          widget._childElements.paths[widget.getUniqueId(d, 'arc1')]
            .attr('class', 'arc1')
            .attr('d', arc1)
            .style('stroke', strokecolor) // was: arc1color
            .style('fill', arc1color);

          if (!widget._childElements.paths[widget.getUniqueId(d, 'arc2')]) {
            widget._childElements.paths[widget.getUniqueId(d, 'arc2')] = g.append('path');
          }
          widget._childElements.paths[widget.getUniqueId(d, 'arc2')]
            .attr('class', 'arc2')
            .attr('d', arc2)
            .style('stroke', strokecolor) // was: arc1color
            .style('fill', arc1color)
            .style('fill-opacity', 0.15);

          //draw label:
          //path used for label
          if (!widget._childElements.paths[widget.getUniqueId(d, 'arc_for_label')]) {
            widget._childElements.paths[widget.getUniqueId(d, 'arc_for_label')] = g.append('path');
          }
          widget._childElements.paths[widget.getUniqueId(d, 'arc_for_label')]
            .attr('class', 'arc_for_label')
            // NOTE HB: adding widget.id so we to avoid name clashing
            .attr('id', function(d) {
              return widget.getUniqueId(d, 'arc_for_label');
            })
            .attr('d', arc_for_label)
            .style('stroke-opacity', 0)
            .style('fill-opacity', 0);

          //add label
          if (!widget._childElements.texts[widget.getUniqueId(d, 'sector_label_path')]) {
            widget._childElements.texts[widget.getUniqueId(d, 'sector_label_path')] = g.append('text')
              .attr('class', 'sector_label')
              .attr('visibility', function(d) {
                return d.depth === 1 ? 'visible' : null;
              })
              .attr('class', 'sector_nonleaf_text')
              .append('textPath');
          }
          widget._childElements.texts[widget.getUniqueId(d, 'sector_label_path')]
            .attr('class', 'sector_label_path')
            .attr('position-in-sector', d.depth <= 1 ? 'center' : (bottom ? 'inner' : 'outer')) // Since both text lines share the same 'd', this class annotation tells where is the text, helping to determine the real arc length
            .attr('font-size', function(d) {
              return 30 / Math.sqrt(d.depth + 1);
            })
            // NOTE HB: Why do we need this xlink:href? In any case, adding widget.id so we to avoid name clashing
            .attr('xlink:href', function(d) {
              return '#' + widget.getUniqueId(d, 'arc_for_label');
            });

          //draw label number
          //path used for label number
          if (d.depth > 1) {
            if (!widget._childElements.paths[widget.getUniqueId(d, 'arc_for_label_number')]) {
              widget._childElements.paths[widget.getUniqueId(d, 'arc_for_label_number')] = g.append('path');
            }
            widget._childElements.paths[widget.getUniqueId(d, 'arc_for_label_number')]
              .attr('class', 'arc_for_label_number')
              // NOTE HB: adding widget.id so we to avoid name clashing
              .attr('id', function(d) {
                return widget.getUniqueId(d, 'arc_for_label_number');
              })
              .attr('d', arc_for_label_number)
              .style('stroke-opacity', 0)
              .style('fill-opacity', 0);

            //add label
            if (!widget._childElements.texts[widget.getUniqueId(d, 'sector_label_number_path')]) {
              widget._childElements.texts[widget.getUniqueId(d, 'sector_label_number_path')] = g.append('text')
                .attr('class', 'sector_label_number ')
                .attr('visibility', function(d) {
                  return d.depth === 1 ? 'visible' : null;
                })
                //.attr('font-family','sans-serif')
                .attr('class', 'sector_nonleaf_text')
                //.attr('fill', d3.rgb(arc1color).darker(2))
                .append('textPath');
            }
            widget._childElements.texts[widget.getUniqueId(d, 'sector_label_number_path')]
              .attr('class', 'sector_label_number_path')
              .attr('position-in-sector', bottom ? 'outer' : 'inner') // Since both text lines share the same 'd', this class annotation tells where is the text, helping to determine the real arc length
              .attr('font-size', function() {
                return 10;
              })
              // NOTE HB: Why do we need this xlink:href? In any case, adding widget.id so we to avoid name clashing
              .attr('xlink:href', function(d) {
                return '#' + widget.getUniqueId(d, 'arc_for_label_number');
              });
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

  var partition = d3.layout.partition()
    .sort(null)
    .size([2 * Math.PI, radius])
    .value(function(d) {
      if (!d.hasOwnProperty('size') && !d.hasOwnProperty('children')) return 1;
      return d.size;
    });

  var profile = {
    children: tree.children
  };

  // exclude specified sectors
  var exclude = widget.exclude;
  profile.children = profile.children.filter(function (child) {
    return exclude.indexOf(child.id) === -1;
  });

  var g = widget.vis.data([profile]).selectAll('g')
    .data(partition.nodes)
    .enter().append('g')
    .attr('class', 'sector')
    .attr('visibility', function(d) {
      return d.depth === 2 || d.forceVisible ? 'visible' : 'hidden';
    }) // hide non-first level rings
    .call(sector)
    .each(stash)
    .on('click', function(d) {
      visutil.expandOrFoldSector(d3, g, d);
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
