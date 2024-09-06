using System.Collections.Generic;
using System.Linq;

namespace Backend_Dijkstra.Models
{
    public class Grafo
    {
        // Diccionario para representar el grafo
        public Dictionary<string, Dictionary<string, int>> Nodes { get; set; }

        // Constructor para inicializar el grafo
        public Grafo()
        {
            Nodes = new Dictionary<string, Dictionary<string, int>>();
        }

        // Método para inicializar el grafo con los datos recibidos
        public void InitializeGraph(Dictionary<string, List<Dictionary<string, int>>> graphData)
        {
            foreach (var node in graphData)
            {
                if (!Nodes.ContainsKey(node.Key))
                {
                    Nodes[node.Key] = new Dictionary<string, int>();
                }

                foreach (var neighbor in node.Value)
                {
                    foreach (var kvp in neighbor)
                    {
                        Nodes[node.Key][kvp.Key] = kvp.Value;
                    }
                }
            }
        }

        public Dictionary<string, Dictionary<string, int>> GetAllNodesWithConnections()
        {
            return Nodes;
        }

        // Método que implementa el algoritmo de Dijkstra
        public (string Path, int Distance) Dijkstra(string origen, string destino)
        {
            var distances = new Dictionary<string, int>();
            var previousNodes = new Dictionary<string, string>();
            var visited = new HashSet<string>();
            var priorityQueue = new SortedSet<(int Distance, string Node)>();

            foreach (var node in Nodes.Keys)
            {
                distances[node] = int.MaxValue;
                previousNodes[node] = null;
            }
            distances[origen] = 0;
            priorityQueue.Add((0, origen));

            while (priorityQueue.Count > 0)
            {
                var (currentDistance, currentNode) = priorityQueue.First();
                priorityQueue.Remove(priorityQueue.First());

                if (currentNode == destino)
                {
                    break;
                }

                visited.Add(currentNode);

                foreach (var neighbor in Nodes[currentNode])
                {
                    var neighborNode = neighbor.Key;
                    var edgeWeight = neighbor.Value;

                    if (visited.Contains(neighborNode))
                    {
                        continue;
                    }

                    var newDistance = currentDistance + edgeWeight;

                    if (newDistance < distances[neighborNode])
                    {
                        distances[neighborNode] = newDistance;
                        previousNodes[neighborNode] = currentNode;

                        priorityQueue.Add((newDistance, neighborNode));
                    }
                }
            }

            if (distances[destino] == int.MaxValue)
            {
                return ("No se encontró un camino", -1);
            }

            var pathSegments = new List<string>();
            var totalDistance = distances[destino];
            var current = destino;

            while (current != null && previousNodes[current] != null)
            {
                var prev = previousNodes[current];
                if (prev != null)
                {
                    pathSegments.Add($"{prev} - {Nodes[prev][current]} -> {current},");
                }
                current = previousNodes[current];
            }

            pathSegments.Reverse();
            var path = string.Join(" ", pathSegments);

            return (path, totalDistance);
        }

        // Método para encontrar todos los caminos posibles entre dos nodos
        public List<string> FindAllPaths(string start, string end)
        {
            var allPaths = new List<string>();
            var path = new List<string>();
            var visited = new HashSet<string>();

            void DFS(string currentNode, int currentWeight)
            {
                path.Add(currentNode);
                visited.Add(currentNode);

                if (currentNode == end)
                {
                    var pathString = string.Join(" -> ", path.Select((node, index) =>
                    {
                        if (index < path.Count - 1)
                        {
                            var nextNode = path[index + 1];
                            var edgeWeight = Nodes[node][nextNode];
                            return $"{node} - {edgeWeight}";
                        }
                        else
                        {
                            return node;
                        }
                    }));
                    allPaths.Add($"{pathString} Peso Total: {currentWeight}");
                }
                else
                {
                    if (Nodes.ContainsKey(currentNode))
                    {
                        foreach (var neighbor in Nodes[currentNode])
                        {
                            var neighborNode = neighbor.Key;
                            var edgeWeight = neighbor.Value;

                            if (!visited.Contains(neighborNode))
                            {
                                DFS(neighborNode, currentWeight + edgeWeight);
                            }
                        }
                    }
                }

                path.RemoveAt(path.Count - 1);
                visited.Remove(currentNode);
            }

            DFS(start, 0);
            return allPaths;
        }


    }
}
