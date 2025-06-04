document.addEventListener('DOMContentLoaded', function() {
    const numCitiesInput = document.getElementById('numCities');
    const costMatrixDiv = document.getElementById('costMatrixDiv');
    const submitBtn = document.getElementById('submitBtn');
    const outputDiv = document.getElementById('output');
    const minCostOutput = document.getElementById('minCost');
    const optimalPathOutput = document.getElementById('optimalPath');

    let numCities;
    let costMatrix = [];

    numCitiesInput.addEventListener('input', function() {
        numCities = parseInt(numCitiesInput.value);
        generateCostMatrixInput();
    });

    function generateCostMatrixInput() {
        costMatrixDiv.innerHTML = '<h3>Enter Cost Matrix:</h3>';
        for (let i = 0; i < numCities; i++) {
            for (let j = 0; j < numCities; j++) {
                if (i !== j) {
                    costMatrixDiv.innerHTML += `
                        <input type="number" id="cost_${i}_${j}" placeholder="Cost ${i+1} to ${j+1}" required>
                    `;
                }
            }
        }
        costMatrixDiv.style.display = 'block';
    }

    submitBtn.addEventListener('click', function() {
        costMatrix = [];
        for (let i = 0; i < numCities; i++) {
            costMatrix.push([]);
            for (let j = 0; j < numCities; j++) {
                if (i !== j) {
                    const costInput = document.getElementById(`cost_${i}_${j}`);
                    costMatrix[i][j] = parseInt(costInput.value) || Infinity;
                } else {
                    costMatrix[i][j] = Infinity;
                }
            }
        }
        const sourceCity = 0; // Assuming the source city is always the first city
        const result = tsp(costMatrix, numCities, sourceCity);
        displayResult(result);
    });

    function displayResult(result) {
        minCostOutput.textContent = `Minimum Cost: ${result.minCost}`;
        optimalPathOutput.textContent = `Optimal Path: ${result.path.map(city => city + 1).join(' -> ')}`;
        outputDiv.style.display = 'block';
    }

    function tsp(cost, n, source) {
        const allVertices = (1 << n) - 1;
        const dp = Array.from({length: 1 << n}, () => Array(n + 1).fill(null));

        function computeCost(mask, pos) {
            if (mask === allVertices) {
                return { minCost: cost[pos][source], path: [pos, source] };
            }
            if (dp[mask][pos] !== null) {
                return dp[mask][pos];
            }

            let minCost = Infinity;
            let minPath = [];

            for (let city = 0; city < n; city++) {
                if ((mask & (1 << city)) === 0) {
                    const { minCost: newCost, path: newPath } = computeCost(mask | (1 << city), city);
                    const totalCost = cost[pos][city] + newCost;
                    if (totalCost < minCost) {
                        minCost = totalCost;
                        minPath = [pos, ...newPath];
                    }
                }
            }

            dp[mask][pos] = { minCost, path: minPath };
            return dp[mask][pos];
        }

        return computeCost(1 << source, source);
    }
});
