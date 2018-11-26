import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  resultado = [];
  cargando = true;

  API_KEY = 'TU_API_KEY';

  constructor(private http: HttpClient) {

  }

  ngOnInit() {
    this.actualizarEstaciones();
  }

  annadirEstacion(numero) {
    this.cargando = true;
    const estaciones = this.obtenerEstacionesGuardadas();
    estaciones.push(numero);
    localStorage.setItem('estaciones', JSON.stringify(estaciones));
    this.actualizarEstaciones();
  }

  eliminarEstacion(index) {
    this.cargando = true;
    const estaciones = this.obtenerEstacionesGuardadas();
    estaciones.splice(index, 1);
    localStorage.setItem('estaciones', JSON.stringify(estaciones));
    this.actualizarEstaciones();
  }

  obtenerEstacionesGuardadas() {
    const estacionesGuardadas = localStorage.getItem('estaciones');
    if (estacionesGuardadas) {
      return JSON.parse(estacionesGuardadas);
    }
    return [];
  }

  actualizarEstaciones() {
    this.resultado = [];
    const estaciones = this.obtenerEstacionesGuardadas();
    if (estaciones.length) {
      estaciones.forEach(estacion => {
        this.http.get(`https://api.jcdecaux.com/vls/v1/stations/${estacion}?contract=seville&apiKey=${this.API_KEY}`).subscribe(res => {
          this.resultado.push(res);
          this.cargando = this.resultado.length !== estaciones.length;
        });
      });
    } else {
      this.cargando = this.resultado.length !== estaciones.length;
    }
  }
}
