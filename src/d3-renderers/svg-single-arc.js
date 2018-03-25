function d3_svg_singleArcRadius(d) {
  return d.radius;
}

function d3_svg_singleArcStartAngle(d) {
  return d.startAngle;
}

function d3_svg_singleArcEndAngle(d) {
  return d.endAngle;
}

function functor(v) {
  return typeof v === 'function' ? v : function() { return v; };
}

function singleArc() {
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
    return 'M' + r0 * c0 + ',' + r0 * s0 + 'A' + r0 + ',' +
      r0 + ' 0 ' + df + ',1 ' + r0 * c1 + ',' + r0 * s1;
  }

  arc.radius = function(v) {
    if (!arguments.length) return radius;
    radius = functor(v);
    return arc;
  };

  arc.startAngle = function(v) {
    if (!arguments.length) return startAngle;
    startAngle = functor(v);
    return arc;
  };

  arc.endAngle = function(v) {
    if (!arguments.length) return endAngle;
    endAngle = functor(v);
    return arc;
  };

  arc.centroid = function() {
    var r = radius.apply(this, arguments),
      a = (startAngle.apply(this, arguments) +
        endAngle.apply(this, arguments)) / 2 + d3_svg_arcOffset;
    return [Math.cos(a) * r, Math.sin(a) * r];
  };

  return arc;
}

module.exports = singleArc;
