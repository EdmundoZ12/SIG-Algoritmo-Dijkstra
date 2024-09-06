import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // Necesario para usar [(ngModel)]
import { SigService } from '../app/service/sig.service';

@Component({
  selector: 'app-sig',
  standalone: true,
  imports: [CommonModule, FormsModule],  // Agrega CommonModule y FormsModule
  templateUrl: './sig.component.html',
  styleUrls: ['./sig.component.css']  // Cambié `styleUrl` a `styleUrls` (es un array)
})
export class SigComponent {
  grafo: { [key: string]: { [key: string]: number }[] } = {};
  nuevoNodo: string = '';
  nodoOrigen: string = '';
  nodoDestino: string = '';
  peso: number | null = null;
  matrizIncidencia: number[][] = [];  // Aquí guardaremos la matriz de incidencia
  nodos: string[] = [];

  origenCamino: string = '';
  destinoCamino: string = '';
  caminoFormateado: string = '';
  caminosPosibles: string[] = [];
  
  constructor(
    private _sigService:SigService
  ){}

  

  // Método para crear un nodo
  agregarNodo() {
    if (this.nuevoNodo && !this.grafo[this.nuevoNodo]) {
      this.grafo[this.nuevoNodo] = [];
      this.nodos.push(this.nuevoNodo);
      this.nuevoNodo = '';

    } else {
      alert('El nodo ya existe o el nombre es inválido.');
    }
    this.generarMatrizIncidencia();
  }

  // Método para asignar peso entre dos nodos
  agregarPeso() {
    if (
      this.nodoOrigen && this.nodoDestino && 
      this.peso !== null && 
      this.grafo[this.nodoOrigen] && this.grafo[this.nodoDestino]
    ) {
      this.grafo[this.nodoOrigen].push({ [this.nodoDestino]: this.peso });
      this.grafo[this.nodoDestino].push({ [this.nodoOrigen]: this.peso });
      this.peso = null;
    } else {
      alert('Verifica los nodos o el peso.');
    }
    this.generarMatrizIncidencia();
  }

  generarMatrizIncidencia() {
    const size = this.nodos.length;
    this.matrizIncidencia = Array(size).fill(null).map(() => Array(size).fill(0));

    this.nodos.forEach((nodo, i) => {
      this.grafo[nodo].forEach((conexion) => {
        const destino = Object.keys(conexion)[0];
        const peso = conexion[destino];
        const j = this.nodos.indexOf(destino);

        if (j !== -1) {
          this.matrizIncidencia[i][j] = peso;
        }
      });
    });
  }

  // Método para enviar el grafo al backend como JSON
  enviarGrafo() {
    const grafoJson = JSON.stringify(this.grafo);
    this._sigService.EnviarNodo(grafoJson).subscribe(
      response=>{
        if(response.data != undefined){
          console.log(response)

        }else{
          console.log("errr")
        }
      },
    )
      // Aquí deberías hacer la petición HTTP
  }


   // Aquí deberías hacer la petición HTTP
  



   calcularCaminoMasCorto() {
    if (this.origenCamino && this.destinoCamino) {
      const caminoRequest = {
        origen: this.origenCamino,
        destino: this.destinoCamino
      };

      console.log('Camino Más Corto de', this.origenCamino, 'a', this.destinoCamino);

      this._sigService.calcularCaminoMasCorto(caminoRequest).subscribe(
        response => {
          this.formatearCamino(response);
        },
        error => {
          console.error('Error al calcular el camino:', error);
        }
      );
    } else {
      alert('Especifica los nodos de origen y destino.');
    }
  }

  formatearCamino(response: { path: string, distance: number }) {
    // Quitamos la última coma del 'path' y añadimos el peso total
    const pathFormateado = response.path.replace(/,$/, ''); // Elimina la coma final
    this.caminoFormateado = `${pathFormateado} Peso Total: ${response.distance}`;
  }

  calcularCaminosPosibles() {
    if (this.origenCamino && this.destinoCamino) {
      const caminoRequest = {
        origen: this.origenCamino,
        destino: this.destinoCamino
      };

      console.log('Camino Más Corto de', this.origenCamino, 'a', this.destinoCamino);

      this._sigService.calcularCaminoPosible(caminoRequest).subscribe(
        response => {
          this.caminosPosibles = response.caminos;
        },
        error => {
          console.error('Error al calcular el camino:', error);
        }
      );
    } else {
      alert('Especifica los nodos de origen y destino.');
    }
  }
}