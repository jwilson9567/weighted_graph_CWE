import Graph from 'graphology';
import Sigma from 'sigma';
import forceAtlas2 from 'graphology-layout-forceatlas2';
import data from './mapping_out_1.json';

// Create a new graph
const graph = new Graph();

// Create a copy of the original data
const originalData = JSON.parse(JSON.stringify(data));

// Keep track of the number of edges added for each node
const edgeCounts: Record<string, number> = {};

// Add the nodes and edges to the graph
for (const [source, targets] of Object.entries(data)) {
  // Add the source node to the graph if it doesn't already exist
  if (!graph.hasNode(source)) {
    graph.addNode(source, { label: source });
  }

  // Initialize the edge count for the source node
  if (!edgeCounts.hasOwnProperty(source)) {
    edgeCounts[source] = 0;
  }

  for (const [target, weight] of Object.entries(targets as Record<string, number>)) {
    // Add the target node to the graph if it doesn't already exist
    if (!graph.hasNode(target)) {
      graph.addNode(target, { label: target });
    }

    // Initialize the edge count for the target node
    if (!edgeCounts.hasOwnProperty(target)) {
      edgeCounts[target] = 0;
    }

    // Only add an edge if both nodes have fewer than 10 edges
    if (edgeCounts[source] < 10 && edgeCounts[target] < 10) {
      // Add an edge between the source and target nodes with the specified weight
      graph.addEdge(source, target, { weight });

      // Increment the edge counts for both nodes
      edgeCounts[source]++;
      edgeCounts[target]++;
    }
  }
}

// Set fixed initial 'x' and 'y' values for the nodes
let i = 0;
for (const node of graph.nodes()) {
  graph.setNodeAttribute(node, 'x', Math.cos(i * 2 * Math.PI / graph.order));
  graph.setNodeAttribute(node, 'y', Math.sin(i * 2 * Math.PI / graph.order));
  i++;
}

// Run the ForceAtlas2 layout algorithm
const positions = forceAtlas2(graph, { iterations: 10 });

// Update the positions of the nodes in the graph
for (const node of graph.nodes()) {
  const position = positions[node];
  graph.setNodeAttribute(node, 'x', position.x);
  graph.setNodeAttribute(node, 'y', position.y);

  // Log the values of the 'x' and 'y' attributes for node 1
  if (node === '1') {
    console.log(`Node 1: x=${position.x}, y=${position.y}`);
  }
}

// Render the graph using sigma.js
const container = document.getElementById('container');
if (container) {
  const renderer = new Sigma(graph, container);

  // Handle clicks on nodes
  renderer.on('clickNode', ({ node }) => {
    // Remove all edges from the graph
    for (const edge of graph.edges()) {
      graph.dropEdge(edge);
    }

    // Restore all connections for the clicked node
    for (const [target, weight] of Object.entries(originalData[node])) {
      graph.addEdge(node, target, { weight });
    }

    // Refresh the renderer to show the updated graph data
    renderer.refresh();
  });
} else {
  console.error('Could not find container element');
}








