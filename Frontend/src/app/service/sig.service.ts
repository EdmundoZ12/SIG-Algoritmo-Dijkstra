import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SigService {

  private url:String='http://localhost:5127/api/Grafo'
  constructor(
    private  _http: HttpClient
  ) { 

    }

    EnviarNodo(data:any):Observable<any>{
      let headers= new HttpHeaders({'Content-Type':'application/json'})
      return this._http.post(this.url+'/insertar-nodos',data,{headers:headers})

    }

    calcularCaminoMasCorto(data:any):Observable<any>{
      let headers= new HttpHeaders({'Content-Type':'application/json'})
      return this._http.post(this.url+'/dijkstra',data,{headers:headers})
    }

    calcularCaminoPosible(data:any):Observable<any>{
      let headers= new HttpHeaders({'Content-Type':'application/json'})
      return this._http.post(this.url+'/todos-caminos',data,{headers:headers})
    }

    
}
