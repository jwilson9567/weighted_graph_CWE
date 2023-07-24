import Graph from 'graphology';
import Sigma from 'sigma';

// Create a new graph
const graph = new Graph();

// Add some nodes and edges to the graph
graph.addNode('A', { label: 'Node A', x: 0, y: 0 });
graph.addNode('B', { label: 'Node B', x: 1, y: 1 });
graph.addNode('C', { label: 'Node C', x: 2, y: 2 });
graph.addEdge('A', 'B');
graph.addEdge('B', 'C');

// Render the graph using sigma.js
const container = document.getElementById('container');
if (container) {
  const renderer = new Sigma(graph, container);

  // Add an event listener for node clicks
  renderer.on('clickNode', (event) => {
    // Get the clicked node
    const node = event.node;

    // Change the color of the clicked node
    graph.setNodeAttribute(node, 'color', '#ff0000');

    // Refresh the renderer to show the updated node color
    renderer.refresh();
  });
} else {
  console.error('Could not find container element');
}




