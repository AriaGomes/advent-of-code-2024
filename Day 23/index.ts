import fs from 'fs';

const data = fs.readFileSync('./data.txt', 'utf-8');
const lines = data.trim().split('\n').map(line => line.split('-'));

interface Graph {
    [key: string]: Set<string>;
}

type Edge = [string, string];

const main = () => {
    const buildGraph = (edges: Edge[]): Graph => {
        const graph: Graph = {};
        for (const [a, b] of edges) {
            if (!graph[a]) graph[a] = new Set();
            if (!graph[b]) graph[b] = new Set();
            graph[a].add(b);
            graph[b].add(a);
        }
        return graph;
    };

    const findTriangles = (graph: Graph) => {
        const triangles = new Set();

        for (const node1 in graph) {
            for (const node2 of graph[node1]) {
                for (const node3 of graph[node2]) {
                    if (graph[node3] && graph[node3].has(node1)) {
                        const triangle = [node1, node2, node3].sort().join(',');
                        triangles.add(triangle);
                    }
                }
            }
        }

        return triangles;
    };

    interface TriangleSet extends Set<string> { }

    const countTrianglesWithT = (triangles: TriangleSet): number => {
        let count = 0;
        for (const triangle of triangles) {
            if (triangle.split(',').some(node => node.startsWith('t'))) {
                count++;
            }
        }
        return count;
    };

    const graph = buildGraph(lines as Edge[]);
    const triangles = findTriangles(graph) as TriangleSet;
    const result = countTrianglesWithT(triangles);
    return result;
};

const main2 = () => {
    const buildGraph = (edges: Edge[]): Graph => {
        const graph: Graph = {};
        for (const [a, b] of edges) {
            if (!graph[a]) graph[a] = new Set();
            if (!graph[b]) graph[b] = new Set();
            graph[a].add(b);
            graph[b].add(a);
        }
        return graph;
    };

    // Recursive backtracking to find the largest clique
    const findLargestClique = (graph: Graph): string[] => {
        const nodes = Object.keys(graph);
        let largestClique: string[] = [];

        const isClique = (subset: string[]): boolean => {
            for (let i = 0; i < subset.length; i++) {
                for (let j = i + 1; j < subset.length; j++) {
                    if (!graph[subset[i]].has(subset[j])) {
                        return false;
                    }
                }
            }
            return true;
        };

        const backtrack = (currentClique: string[], remainingNodes: string[]) => {
            if (currentClique.length > largestClique.length) {
                largestClique = [...currentClique];
            }

            for (let i = 0; i < remainingNodes.length; i++) {
                const node = remainingNodes[i];
                const nextClique = [...currentClique, node];
                if (isClique(nextClique)) {
                    backtrack(nextClique, remainingNodes.slice(i + 1));
                }
            }
        };

        backtrack([], nodes);
        return largestClique;
    };

    const graph = buildGraph(lines as Edge[]);
    const largestClique = findLargestClique(graph);
    const password = largestClique.sort().join(',');
    return password;

}

console.log(main2());
