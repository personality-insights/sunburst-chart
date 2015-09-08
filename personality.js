/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
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


exportModule("PersonalityChartImpl", function () {
  'use strict';

  var self = {},
    logger = {
      debug: function (message) { console.debug("[PersonalityChartImpl] " + message); }
    };

  var visutil = {
    isLocatedBottom: function(d) {
      // Before fixing #128: return (d.x>Math.PI/2&&(d.x+d.dx)<Math.PI*5/3);
      var bottom = (d.x > Math.PI / 2 && (d.x + d.dx) < 5.0);
      return bottom;
    },

    arc: function(start, end, r0) {
      var c0 = Math.cos(start),
        s0 = Math.sin(start),
        c1 = Math.cos(end),
        s1 = Math.sin(end);
      return 'M' + r0 * c0 + ',' + r0 * s0 + 'A' + r0 + ',' + r0 + ' 0' + ' 0 , 0 ' + r0 * c1 + ',' + r0 * s1;
    }
  };

  function _redraw() {
    var _this = this;
    if (_this.vis) {
      var transformvalue="";
      var x = //((_this.translate && _this.translate.x) || 0) +
        ((_this.touchTranslate && _this.touchTranslate.x) || 0) + ((_this.endTranslate && _this.endTranslate.x) || 0);
      var y = //((_this.translate && _this.translate.y) || 0) +
        ((_this.touchTranslate && _this.touchTranslate.y) || 0) + ((_this.endTranslate && _this.endTranslate.y) || 0);
      transformvalue="translate(" + x + "," + y + ")";
      var scale = (_this.d3scale || 1.0) * (_this.endScale || 1.0) * (_this.touchScale || 1.0);
      transformvalue += "scale(" +scale + ")";
      _this.vis.attr("transform",transformvalue);
    }
  }

  var renderChart = function() {
    if (!this.data) {
      console.error('Cannot render: Profile data not supplied to Personality Sunburst Chart');
      return;
    }
    if (this.vis) {
      console.error('Cannot render: Already rendered (this.vis)');
      return;
    }

    var _this = this;
    var dummyData = false;
    var d3Helper = new PersonalityChartD3(_this, visutil, dummyData);

    var tree = this.data ? (this.data.tree ? this.data.tree : this.data) : null;
    if (!tree || !tree.children || !tree.children.length) {
      return;
    }

    var _widget = this;
    if (!this.loadingDiv) {
      alert('Widget is not fully initialized, cannot render BarsWidget');
      return;
    }

    //this.initializeSVGandResize(); // In case this method was not yet called. It does nothing if already invoked

    // Layout changes the height of the main div to what is left from the other legends/headers/footers
    this._layout();

    // Helper functions
    // Stash the old values for transition.
    function stash(d) {
      d.x0 = d.x;
      d.dx0 = d.dx;
        if (!d.hasOwnProperty('size') && !d.hasOwnProperty('children')) d.size0=1;
        else d.size0=d.size;
      //set the expand flag
      if (d.depth==0 || d.depth==1) {
        d.expand=1;
      } else {
        d.expand=0;
      }
    }

    // click expand or fold their children
    function expandOrFoldSector(d) {

      if (d.expand != null && d.depth > 1) {
        //ignore root node and first level sectors
        if (d.expand==0) {

          if(d.children)
            d3.select(this).attr("opacity",1);

          g.filter(function(a) {
            if (a.parent)
              return  a.parent.id==d.id;
          })
            .attr("visibility","visible");
          d.expand=1;

        } else {

          if(d.children)
            d3.select(this).attr("opacity",1);

          hideSector(d);

        }
      }
    }

    function hideSector(d){
      g.filter(function(a) {
        if (a.parent)
          return  a.parent.id==d.id;
        })
       .attr("visibility","hidden")
       .attr("opacity",1)
       .each(function(a){
         if (a.children)
           hideSector(a);
        });
      d.expand=0;
    }

    function updateLabelLayout() {
      updateLabelLayoutWithClass('.sector_label_path');
      updateLabelLayoutWithClass('.sector_label_number_path');
    }

    function updateLabelLayoutWithClass(_class) {
      var max_font_size_base=16;
      var min_font_size_base=9;
      var margin=10;
      _this.d3vis.selectAll(_class).each(function(d) {
        var d3this = d3.select(this);
        var curNd = d3this.node();
        var text = d3this.text();
        if(text && text.length>0) {
          var position = d3.select(this).attr('position-in-sector'); // 'inner' or 'outer'
          var frac = position=='center' ? 0.5 : position=='outer' ? 2/3 : 1/3;
          var sector_length=(d.y+d.dy*frac)*d.dx;
          var text_length=curNd.getComputedTextLength(); //+margin;
          var cur_font_size=d3.select(this).attr("font-size");
          var new_font_size=cur_font_size*sector_length/text_length;
          var new_text_length = text_length * new_font_size/cur_font_size;

          if(new_font_size>max_font_size_base/(0.4*d.depth+0.6)) {
            new_font_size=max_font_size_base/(0.4*d.depth+0.6);
          }

          d3.select(this).attr("font-size",new_font_size);
          //set new offset:
          d3.select(this).attr("startOffset", (sector_length-curNd.getComputedTextLength())/2);
          //d3.select(this).attr("startOffset",0); //(sector_length-curNd.getComputedTextLength())/2);
        }
      });
    }

    function adjustSectorWidth(d) {
      //alert(d.name);
      if (!d.anglefactor) d.anglefactor=1;
      if (d3.event.sourceEvent.type == 'DOMMouseScroll' && d3.event.sourceEvent.ctrlKey) {
        //ctrl+mousewheel to adjust sector width
        if (d3.event.sourceEvent.detail <0) {
          //Increase angle
          d.anglefactor+=angle_factor_increment;
        } else {
          //Decrease angle
           d.anglefactor=(d.anglefactor-angle_factor_increment)> angle_factor_min ? d.anglefactor-angle_factor_increment: angle_factor_min;
        }

        update_anglefactor(d, d.anglefactor);
        g.data(partition.value(function(a) {
          if (!a.hasOwnProperty('size') && !a.hasOwnProperty('children')) return 1;
            return a.size;
        })).call(sector);
        updateLabelLayout();
      }
    }

    function _zoomevent() {
      console.log("Personality._zoomevent called");
      if(!d3.event.sourceEvent.ctrlKey) {
        //without pressing ctrl, then zoom
        this.d3scale = d3.event.scale;
        _redraw();
      }
    }

    var
      width = this.dimW,
      height = this.dimH;

    // The flower had a radius of 640 / 1.9 = 336.84 in the original.
    var radius = Math.min(width, height) / 3.2;
    var sector = d3Helper.twoArcsRender(radius);

    var vis = this.d3vis.append("g")
      .attr("transform", "translate(" + (width / 2)+ "," + height / 2 + ")") //center the graph of "g"
      .append("g")
      //DISABLED FOR TOUCH EVENTS .call(d3.behavior.drag().on("drag", dojo.hitch(this, this._dragpanevent)))
      //.call(d3.behavior.zoom().on("zoom", _zoomevent.bind(this)))
      .on("dblclick.zoom", null);
    this.vis = vis; // HACK! Keeping a reference both to d3vis and vis (svg and g objects)

    var partition = d3.layout.partition()
      .sort(null)
      .size([2 * Math.PI, radius])
      .value(function(d) {
        if (!d.hasOwnProperty('size') &&
            !d.hasOwnProperty('children'))
          return 1;

        return d.size;
      });

    var profile = tree;

    var g = vis.data([profile]).selectAll("g")
      .data(partition.nodes)
      .enter().append("g")
      .attr("class", "sector")
      .attr("visibility", function(d) { return d.depth == 2 ? "visible" : "hidden"; }) // hide non-first level rings
      .call(sector)
      .each(stash)
      .on("click", expandOrFoldSector, false)
      .on("mouseover", function(d) {
         _this.showTooltip(d, this);
       })
      .on("mouseout", function(d) {
         _this.showTooltip();
       })
      .call(d3.behavior.zoom().on("zoom", adjustSectorWidth));

    // Shift the text pieces clockwise (to somewhat center them).
    updateLabelLayout();
    this.expandAll();
  };

  function resize() {
    if (this.redrawTimer) {
      clearTimeout(this.redrawTimer);
    }
    this.redrawTimer = setTimeout(this._redrawAfterResize.bind(this), 150);
  }

  function _redrawAfterResize() {
    if (!this.data) {
      return;
    }

    // Grab the displayed sectors.
    var displayed = [];
    this.d3vis.selectAll("g.sector")[0].forEach(function (d) {
      if(d.getAttribute("visibility") == "visible") {
        displayed.push(d.__data__.id);
      }
    });

    this._nukeChart();
    this.renderChart();

    // Show the previously selected sectors.
    this.d3vis.selectAll("g.sector")[0].forEach(function (d) {
      if(displayed.indexOf(d.__data__.id) != -1) {
        d.setAttribute("visibility", "visible");
      }
    });
  }

  function zoomIn() {
   if (this.touchScale== null)
     this.touchScale=1;
    this.touchScale =this.touchScale + 0.5;
    this._redraw();
  }

  function zoomOut() {
   if (this.touchScale== null)
     this.touchScale=1;
   if (this.touchScale > 0.5){
     this.touchScale = this.touchScale - 0.5;
     this._redraw();
   }
  }

  function _redrawAfterResize() {
    if (!this.data) {
      return;
    }

    // Grab the displayed sectors.
    var displayed = [];
    this.d3vis.selectAll("g.sector")[0].forEach(function(d) {
      if(d.getAttribute("visibility") == "visible") {
        displayed.push(d.__data__.id);
      }
    });

    this._nukeChart();
    this.renderChart();

    // Show the previously selected sectors.
    this.d3vis.selectAll("g.sector")[0].forEach(function(d) {
      if(displayed.indexOf(d.__data__.id) != -1) {
        d.setAttribute("visibility", "visible");
      }
    });
  }

  function _nukeChart() {
    if (this.vis) {
      this.vis.remove();
      this.vis = null;
    }
    // There is an nested "g" still to be removed
    this.d3vis.select("g").remove();
  }

  function setUpTouch (_this) {
    _this.touch = new Hammer(_this.touchDiv);

    //var singleTap = new Hammer.Tap({ event: 'singletap' });
    //var doubleTap = new Hammer.Tap({ event: 'doubletap', taps: 2 });
    //this.touch.add([doubleTap, singleTap]);

    //doubleTap.recognizeWith(singleTap);
    //singleTap.requireFailure([doubleTap]);

    _this.touch.get('pinch').set({ enable: true });

    var ix=0, cols=["red","green","blue","yellow"];

    // other gestures: singletap doubletap
    _this.touch.on("pan pancancel panend tap press pressup pinch pinchend rotate", function (ev) {
      //_this.svgDiv.style["border"]="2px solid "+(cols[(ix++)%4]);
      var str="gesture="+ev.type+
        (ev.center ? (", center="+ev.center.x+","+ev.center.y) : "")+
        ", rotation="+ev.rotation+
        ", scale="+Math.floor(ev.scale*100)+
        //+", first="+ev.isFirst+", final="+ev.isFinal
        ", touchScale="+Math.floor(_this.touchScale*100)+
        ", endScale="+Math.floor(_this.endScale*100)
        //", touchTranslate="+(_this.touchTranslate&&_this.touchTranslate.x)+","+(_this.touchTranslate&&_this.touchTranslate.y)
        ;

      //allways check if there is a tooltip shown and hide it
      if (_this.tooltip) {
        popup.close(_this.tooltip);
      }

      if (ev.type=="pan") {
        logger.debug("Translate to (" + ev.deltaX + ", " + ev.deltaY + ")");
        _this.touchTranslate = {
            x: ev.deltaX,
            y: ev.deltaY };
        _this._redraw();

      } else if (ev.type=="tap") {
        //hack to handle taps and presses on sunburst svg view:
        //hide overlay, locate the object, expand, show overlay again
        var overlay = document.elementFromPoint(ev.center.x, ev.center.y);
        if (overlay.className== "touchOverlay"){
          overlay.style.display = 'none';
          var obj = document.elementFromPoint(ev.center.x, ev.center.y);
          var d = obj.__data__;
          var g = _this.vis.data([_this.profile]).selectAll("g");
          var gthis = obj.parentElement;
          if (obj.localName == "path" || obj.localName == "textPath")
            _this.expandOrFoldSectorTouch(d, g, gthis, _this);
          //make overlay apear again
          overlay.style.display = 'block';
        }

      } else if (ev.type=="panend" || ev.type=="pancancel") {
            _this.endTranslate = {
              x: ((_this.endTranslate && _this.endTranslate.x) || 0) + ev.deltaX,
              y: ((_this.endTranslate && _this.endTranslate.y) || 0) + ev.deltaY
            };
            _this.touchTranslate = null;
            _this._redraw();

      } else if (ev.type=="press") {
        //hide overlay, locate the object, expand, show overlay again
        var overlay = document.elementFromPoint(ev.center.x, ev.center.y);
        if (overlay.className== "touchOverlay"){
          overlay.style.display = 'none';
          var obj = document.elementFromPoint(ev.center.x, ev.center.y);
          var d = obj.__data__;
          var gthis = obj.parentElement;
          if (obj.localName == "path" || obj.localName == "textPath")
            _this.showTooltipTouch(d, gthis, _this);
          //make overlay apear again
          overlay.style.display = 'block';
        }

      } else if (ev.type=="pressup"){
            if (_this.tooltip)
          popup.close(_this.tooltip);

        } else if (ev.type=="doubletap") {
        //locate all the overlays and hide
      //var touchOverlays = document.getElementsByClassName("touchOverlay");
        //for (var i = 0; i < touchOverlays.length; i++) {
        //  console.log(touchOverlays[i]);
        //    touchOverlays[i].style.display = 'none';
        //}
        //make overlay(s) apear again
        //for (var i = 0; i < touchOverlays.length; i++) {
        //    touchOverlays[i].style.display = 'block';
        //}

            } else if (ev.type=="pinch") {
                   _this.touchScale = ev.scale;
                    _this._redraw();

                } else if (ev.type=="pinchend") {
      _this.endScale = (_this.endScale || 1.0) * ev.scale;
      _this.touchScale = null;
          _this._redraw();

      } else if (ev.type=="rotate"){

      }
      //console.log(str, ev);
      //_this.debugGesture && (_this.debugGesture.innerHTML = str);
    });
  }

  function initialize() {
    setUpTouch(this);
    $(window).resize(resize.bind(this));
    logger.debug("Initialized");
    this._redraw = _redraw;
  }

  /* API */

  self.initialize = initialize;
  self.renderChart = renderChart;
  self.resize = resize;

  return self;

});
