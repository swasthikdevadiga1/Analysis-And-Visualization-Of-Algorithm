function createEdgeMatrix() {
    const numNodes = parseInt(document.getElementById('numNodes').value);
    let edgeMatrixHTML = '<label>Enter the edge matrix:</label><br>';
    for (let i = 0; i < numNodes; i++) {
        for (let j = 0; j < numNodes; j++) {
            edgeMatrixHTML += `<input type="number" id="node${i}-${j}" placeholder="node${i}-${j}">`;
        }
        edgeMatrixHTML += '<br>';
    }
    edgeMatrixHTML += '<button onclick="calculateShortestPaths()">Calculate Shortest Paths</button>';
    document.getElementById('edgeMatrix').innerHTML = edgeMatrixHTML;
}

function calculateShortestPaths() {
    const numNodes = parseInt(document.getElementById('numNodes').value);
    const edgeMatrix = [];
    for (let i = 0; i < numNodes; i++) {
        edgeMatrix.push([]);
        for (let j = 0; j < numNodes; j++) {
            edgeMatrix[i].push(parseInt(document.getElementById(`node${i}-${j}`).value));
        }
    }

    const shortestPaths = dijkstra(edgeMatrix, 0);
    displayShortestPaths(shortestPaths);
    visualizeGraph(edgeMatrix);
}

function dijkstra(graph, start) {
    const numNodes = graph.length;
    const dist = new Array(numNodes).fill(Infinity);
    const visited = new Set();

    dist[start] = 0;

    while (visited.size < numNodes) {
        let minDist = Infinity;
        let minNode = null;

        for (let i = 0; i < numNodes; i++) {
            if (!visited.has(i) && dist[i] < minDist) {
                minDist = dist[i];
                minNode = i;
            }
        }

        visited.add(minNode);

        for (let i = 0; i < numNodes; i++) {
            if (!visited.has(i) && graph[minNode][i] !== 0) {
                const newDist = dist[minNode] + graph[minNode][i];
                if (newDist < dist[i]) {
                    dist[i] = newDist;
                }
            }
        }
    }

    return dist;
}

function displayShortestPaths(shortestPaths) {
    const numNodes = shortestPaths.length;
    let shortestPathsHTML = '<h2>Shortest Paths</h2><ul>';
    for (let i = 0; i < numNodes; i++) {
        shortestPathsHTML += `Distance from Source Node To Node ${i+1}: Distance = ${shortestPaths[i]}<br>`;
    }
    shortestPathsHTML += '</ul>';
    document.getElementById('shortestPaths').innerHTML = shortestPathsHTML;
}

function visualizeGraph(edgeMatrix) {
    const numNodes = edgeMatrix.length;
    const links = [];
    for (let i = 0; i < numNodes; i++) {
        for (let j = i + 1; j < numNodes; j++) {
            if (edgeMatrix[i][j] !== 0) {
                links.push({ source: i, target: j, weight: edgeMatrix[i][j] });
            }
        }
    }

    const width = 800; // Adjust width
    const height = 600; // Adjust height

    const svg = d3.select("#graph").append("svg")
        .attr("width", width)
        .attr("height", height);

    const simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(d => d.index))
        .force("charge", d3.forceManyBody().strength(-300))
        .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.selectAll(".link")
        .data(links)
        .enter().append("line")
        .attr("class", "link")
        .attr("stroke-width", d => Math.sqrt(d.weight))
        .text(d => d.weight);

    const node = svg.selectAll(".node")
        .data(d3.range(numNodes))
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", 15)
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    const linkText = svg.selectAll(".link-text")
        .data(links)
        .enter().append("text")
        .attr("class", "link-text")
        .attr("dy", -5)
        .text(d => d.weight);

    simulation
        .nodes(d3.range(numNodes).map(d => ({ index: d })))
        .on("tick", ticked);

    simulation.force("link")
        .links(links);

    function ticked() {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);

        linkText
            .attr("x", d => (d.source.x + d.target.x) / 2)
            .attr("y", d => (d.source.y + d.target.y) / 2);
    }

    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
}

