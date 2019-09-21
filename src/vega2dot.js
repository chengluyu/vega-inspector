const markTypes = {
  datajoin: 1,
  encode: 1,
  mark: 1,
  bound: 1,
  overlap: 1,
  sortitems: 1,
  render: 1,
  viewlayout: 1,
};

function array(a) {
  return Array.isArray(a) ? a : [a];
}

function nodeLabel(node) {
  return node.signal
    ? node.signal
    : node.scale
    ? node.scale
    : node.root
    ? 'root'
    : node.type === 'collect' && node.data
    ? node.data
    : node.type;
}

function nodeFillColor(node, stamp) {
  return stamp && node.value.stamp < stamp
    ? '#ffffff'
    : node.signal
    ? '#dddddd'
    : node.scale
    ? '#ccffcc'
    : node.data
    ? '#ffcccc'
    : node.type === 'axisticks' || node.type === 'legendentries'
    ? '#ffcccc'
    : node.isMark || node.root
    ? '#ccccff'
    : '#ffffff';
}

function nodeColor(node, stamp) {
  return stamp && node.value.stamp < stamp ? '#dddddd' : '#000000';
}

function nodeFontColor(node, stamp) {
  return stamp && node.value.stamp < stamp ? '#cccccc' : '#000000';
}

function edgeColor(edge, nodes, stamp) {
  const n = edge.nodes;
  return stamp && nodes[n[0]].value.stamp < stamp ? '#dddddd' : edge.param !== 'pulse' ? '#aaaaaa' : '#000000';
}

function edgeLabelColor(edge, nodes, stamp) {
  const n = edge.nodes;
  return stamp && nodes[n[0]].value.stamp < stamp ? '#dddddd' : '#000000';
}

function edgeWeight(edge, nodes) {
  const n = edge.nodes;
  return edge.param !== 'pulse' ? 1 : nodes[n[0]].isMark && nodes[n[1]].isMark ? 100 : 2;
}

function argop(t, s) {
  if (t._argops)
    for (const v of t._argops) {
      if (v.op === s) return v.name;
    }
  return '';
}

export function view2dot(view, stamp) {
  const rt = view._runtime,
    ops = rt.nodes,
    keys = Object.keys(ops);

  const signals = Object.keys(rt.signals).reduce((lut, name) => {
    lut[rt.signals[name].id] = name;
    return lut;
  }, {});

  const scales = Object.keys(rt.scales).reduce((lut, name) => {
    lut[rt.scales[name].id] = name;
    return lut;
  }, {});

  const data = Object.keys(rt.data).reduce((lut, name) => {
    const sets = rt.data[name];
    if (sets.input) lut[sets.input.id] = name;
    if (sets.output) lut[sets.output.id] = name;
    return lut;
  }, {});

  // build node objects
  const nodes = keys.map(key => {
    const op = ops[key];
    const node = {
      id: op.id,
      type: op.constructor.name.toLowerCase(),
      stamp: op.stamp,
      value: op,
    };
    if (markTypes[node.type]) node.isMark = true;
    if (signals[op.id]) node.signal = signals[op.id];
    if (scales[op.id]) node.scale = scales[op.id];
    if (data[op.id]) node.data = data[op.id];
    if (rt.root === op) node.root = true;
    return node;
  });

  const ids = nodes.reduce((lut, node) => {
    lut[node.id] = node;
    return lut;
  }, {});

  // build edge objects
  const edges = [];
  keys.forEach(key => {
    const op = ops[key];
    if (op._targets)
      op._targets.forEach(t => {
        if (!ids[t.id]) return;
        edges.push({
          nodes: [op.id, t.id],
          param: t.source === op ? 'pulse' : argop(t, op),
        });
        if (t.source === op && ids[op.id].isMark) {
          const node = ids[t.id];
          if (node.type === 'collect') {
            // annotate post-datajoin collect operators as mark-processing
            node.isMark = true;
          }
        }
      });
  });

  return `digraph {
  rankdir = LR;
  node [style=filled];
  ${nodes
    .map(node => {
      return (
        node.id +
        ' [label="' +
        nodeLabel(node) +
        '"]' +
        ' [color="' +
        nodeColor(node, stamp) +
        '"]' +
        ' [fillcolor="' +
        nodeFillColor(node, stamp) +
        '"]' +
        ' [fontcolor="' +
        nodeFontColor(node, stamp) +
        '"]'
      );
    })
    .join(';\n  ')};
  ${edges
    .map(e => {
      return (
        e.nodes.join(' -> ') +
        ' [label="' +
        (e.param === 'pulse' ? '' : e.param) +
        '"]' +
        ' [color="' +
        edgeColor(e, ids, stamp) +
        '"]' +
        ' [fontcolor="' +
        edgeLabelColor(e, ids, stamp) +
        '"]' +
        ' [weight="' +
        edgeWeight(e, ids) +
        '"]'
      );
    })
    .join(';\n  ')};
}`;
}

function visitScene(visitor, node, parent, index) {
  visitor(parent, node, index);
  const items = node.items;
  const n = (items && items.length) || 0;
  for (let i = 0; i < n; ++i) {
    visitScene(visitor, items[i], node, i);
  }
}

export function scene2dot(view) {
  const nodes = [];
  const edges = [];
  const lut = new Map();

  function visitor(parent, node, index) {
    const n = {
      id: nodes.length + 1,
      type: node.marktype,
      role: node.role,
      index: index,
    };
    nodes.push(n);
    lut.set(node, n);

    if (parent) {
      edges.push(lut.get(parent).id + ' -- ' + n.id);
    }
  }

  visitScene(visitor, view.scenegraph().root);

  return `graph {
  rankdir = TB;
  ${nodes
    .map(
      n =>
        n.id +
        ' [label="' +
        (n.type ? n.type + ':' + n.role : n.index) +
        '"]' +
        ' [shape="' +
        (n.type ? 'rect' : 'circle') +
        '"]',
    )
    .join(';\n  ')};
  ${edges.join(';\n  ')};
}`;
}