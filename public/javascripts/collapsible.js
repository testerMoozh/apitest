(function() {
  var ready;

  ready = function() {
    var click, diagonal, duration, height, i, margin, root, svg, tree, update, width;
    margin = {
      top: 20,
      right: 120,
      bottom: 20,
      left: 120
    };
    width = $('#chart').innerWidth() - margin.right - margin.left;
    height = 900 - margin.top - margin.bottom;
    root = null;
    i = 0;
    duration = 750;
    tree = d3.layout.tree().size([height, width]);
    diagonal = d3.svg.diagonal().projection(function(d) {
      return [d.y, d.x];
    });
    svg = d3.select('#chart').append('svg').attr('width', width + margin.right + margin.left).attr('height', height + margin.top + margin.bottom).append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    click = (function(d) {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
      return update(d);
    });
    update = (function(source) {
      var link, links, node, nodeEnter, nodeExit, nodeUpdate, nodes;
      nodes = tree.nodes(root).reverse();
      links = tree.links(nodes);
      nodes.forEach(function(d) {
        return d.y = d.depth * 300;
      });
      node = svg.selectAll('g.node').data(nodes, function(d) {
        return d.id || (d.id = ++i);
      });
      nodeEnter = node.enter().append('g').attr('class', 'node').attr('transform', function(d) {
        return 'translate(' + source.y0 + ',' + source.x0 + ')';
      }).on('click', click);
      nodeEnter.append('circle').attr('r', 1e-6).style('fill', function(d) {
        if (d._children) {
          return '#606060';
        } else {
          return '#fff';
        }
      });
      nodeEnter.append('text').attr('x', function(d) {
        if (d.children || d._children) {
          return -10;
        } else {
          return 10;
        }
      }).attr('dy', '.35em').attr('text-anchor', function(d) {
        if (d.children || d._children) {
          return 'end';
        } else {
          return 'start';
        }
      }).text(function(d) {
        return d.name;
      }).style('fill-opacity', 1e-6);
      nodeUpdate = node.transition().duration(duration).attr('transform', function(d) {
        return 'translate(' + d.y + ',' + d.x + ')';
      });
      nodeUpdate.select('circle').attr('r', 3).style('fill', function(d) {
        if (d._children) {
          return '#606060';
        } else {
          return '#fff';
        }
      });
      nodeUpdate.select('text').style('fill-opacity', 1);
      nodeExit = node.exit().transition().duration(duration).attr('transform', function(d) {
        return 'translate(' + source.y + ',' + source.x + ')';
      }).remove();
      nodeExit.select('circle').attr('r', 1e-6);
      nodeExit.select('text').style('fill-opacity', 1e-6);
      link = svg.selectAll('path.link').data(links, function(d) {
        return d.target.id;
      });
      link.enter().insert('path', 'g').attr('class', 'link').attr('d', function(d) {
        var o;
        o = {
          x: source.x0,
          y: source.y0
        };
        return diagonal({
          source: o,
          target: o
        });
      });
      link.transition().duration(duration).attr('d', diagonal);
      link.exit().transition().duration(duration).attr('d', function(d) {
        var o;
        o = {
          x: source.x,
          y: source.y
        };
        return diagonal({
          source: o,
          target: o
        });
      }).remove();
      return nodes.forEach(function(d) {
        d.x0 = d.x;
        return d.y0 = d.y;
      });
    });
    return d3.json('data.json', function(error, data) {
      var collapse;
      root = data;
      root.x0 = height / 2;
      root.y0 = 0;
      collapse = (function(d) {
        if (d.children) {
          d._children = d.children;
          d._children.forEach(collapse);
          return d.children = null;
        }
      });
      root.children.forEach(collapse);
      return update(root);
    });
  };

  $(document).ready(ready);

}).call(this);