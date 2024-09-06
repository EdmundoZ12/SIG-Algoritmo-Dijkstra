using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Backend_Dijkstra.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend_Dijkstra.Controllers.DTO;

namespace Backend_Dijkstra.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GrafoController : ControllerBase
    {
        private readonly Grafo _grafo;

        // Inyección del grafo a través del constructor
        public GrafoController(Grafo grafo)
        {
            this._grafo = grafo;
        }

        // Método POST para insertar nodos en el grafo
        [HttpPost("insertar-nodos")]
        public async Task<IActionResult> InsertarNodos([FromBody] Dictionary<string, List<Dictionary<string, int>>> grafoData)
        {
            // Llamada para inicializar el grafo con los datos recibidos
            _grafo.InitializeGraph(grafoData);

            return StatusCode(StatusCodes.Status200OK, new { message = "Nodos insertados correctamente en el grafo" });
        }

        // Método GET para devolver todos los nodos con sus conexiones y pesos
        [HttpGet("nodos")]
        public async Task<IActionResult> ObtenerNodos()
        {
            var nodos = _grafo.GetAllNodesWithConnections();
            return StatusCode(StatusCodes.Status200OK, nodos);
        }

        // Método POST para calcular el camino más corto usando el algoritmo de Dijkstra
        [HttpPost("dijkstra")]
        public async Task<IActionResult> Dijkstra([FromBody] DijkstraRequest request)
        {
            var (path, distance) = _grafo.Dijkstra(request.Origen, request.Destino);

            return StatusCode(StatusCodes.Status200OK, new
            {
                Path = path,
                Distance = distance
            });
        }

        // Método POST para encontrar todos los caminos posibles entre dos nodos
        [HttpPost("todos-caminos")]
        public async Task<IActionResult> TodosCaminos([FromBody] DijkstraRequest request)
        {
            var caminos = _grafo.FindAllPaths(request.Origen, request.Destino);

            return StatusCode(StatusCodes.Status200OK, new
            {
                Caminos = caminos
            });
        }
    }
}
