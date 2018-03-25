function expandOrFoldSector(g, d, d3elem) {
  if (d.expand !== null && d.depth > 1) {
    //ignore root node and first level sectors
    if (d.expand === 0) {
      if (d.children) d3elem.attr('opacity', 1);
      g.filter(function(a) {
        if (a.parent)
          return getValue(a.parent, 'id') === getValue(d, 'id');
      })
        .attr('visibility', 'visible');
      d.expand = 1;
    } else {
      //if the sector is expanded
      if (d.children)
        d3elem.attr('opacity', 1);
      hideSector(d, g);
    }
  }
}

function hideSector(d, g) {
  g.filter(function(a) {
    if (a.parent)
      return getValue(a.parent, 'id') === getValue(d, 'id');
  })
    .attr('visibility', 'hidden')
    .attr('opacity', 1)
    .each(function(a) {
      if (a.children)
        hideSector(a, g);
    });
  d.expand = 0;
}

function arc(start, end, r0) {
  var c0 = Math.cos(start),
    s0 = Math.sin(start),
    c1 = Math.cos(end),
    s1 = Math.sin(end);
  return 'M' + r0 * c0 + ',' + r0 * s0 + 'A' + r0 + ',' + r0 + ' 0' + ' 0 , 0 ' + r0 * c1 + ',' + r0 * s1;
}

function isLocatedBottom(d) {
  var x0 = d.x ? d.x : d.x0;
  var x1 = d.x ? (d.x + d.dx) : d.x1;
  var bottom = (x0 > Math.PI / 2 && x1 < 5.0);
  return bottom;
}

function getValue(d, prop) {
  return d.data ? d.data[prop] : d[prop];
}

function getBarLengthFactor(d) {
  var bar_length_factor = 10 / (d.depth - 2);

  //different bar_length factors
  if (d.parent) {
    if (d.parent.parent) {
      if (getValue(d.parent.parent, 'id') === 'needs' || getValue(d.parent.parent, 'id') === 'values') {
        bar_length_factor = 1;
      }
      if (d.parent.parent.parent) {
        if (getValue(d.parent.parent.parent, 'id') === 'personality') {
          bar_length_factor = 1;
        }
      }
    }
  }

  return bar_length_factor;
}

module.exports = {
  isLocatedBottom: isLocatedBottom,
  arc: arc,
  expandOrFoldSector: expandOrFoldSector,
  getValue: getValue,
  getBarLengthFactor: getBarLengthFactor
};
