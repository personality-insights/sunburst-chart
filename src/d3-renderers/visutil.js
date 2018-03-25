function expandOrFoldSector(d3, g, d) {
  if (d.expand !== null && d.depth > 1) {
    //ignore root node and first level sectors
    if (d.expand === 0) {
      if (d.children) d3.select(this).attr('opacity', 1);
      g.filter(function(a) {
        if (a.parent)
          return a.parent.id === d.id;
      })
        .attr('visibility', 'visible');
      d.expand = 1;
    } else {
      //if the sector is expanded
      if (d.children)
        d3.select(this).attr('opacity', 1);
      hideSector(d, g);

    }
  }
}

function hideSector(d, g) {
  g.filter(function(a) {
    if (a.parent)
      return a.parent.id === d.id;
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
  // Before fixing #128: return (d.x>Math.PI/2&&(d.x+d.dx)<Math.PI*5/3);
  var bottom = (d.x > Math.PI / 2 && (d.x + d.dx) < 5.0);
  return bottom;
}

module.exports = {
  isLocatedBottom: isLocatedBottom,
  arc: arc,
  expandOrFoldSector: expandOrFoldSector
};
