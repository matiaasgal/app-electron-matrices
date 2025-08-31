const { contextBridge, ipcRenderer } = require('electron');
const math = require("mathjs");

//! aca traigo los metodos de la libreria mathjs
contextBridge.exposeInMainWorld("mathAPI", {
  add: (a, b) => math.add(a, b),
  multiply: (a, b) => math.multiply(a,b),
  inv: (a) => math.inv(a),
  det: (a) => math.det(a),
});

//! metodos para navegar entre paginas (index.js)
contextBridge.exposeInMainWorld('electron', {
  navegarASuma: () => ipcRenderer.send('navegar-a-suma'),
  navegarAMultiplicacion: () => ipcRenderer.send('navegar-a-multiplicacion'),
  navegarAInversa: () => ipcRenderer.send('navegar-a-inversa'),
  navegarALlenado: (data) => ipcRenderer.send('navegar-a-llenado', data),
  navegarALlenadoMulti: (data) => ipcRenderer.send('navegar-a-llenado-multi', data),
  navegarALlenadoInversa: (data) => ipcRenderer.send('navegar-a-llenado-inversa', data),
  volverAIndex: () => ipcRenderer.send('volver-a-index')
});

//! manda la data entre paginas (index.js | script.js)
ipcRenderer.on('matriz-datos', (event, data) => {
  window.matrizDatos = data;
  window.dispatchEvent(new CustomEvent('matriz-datos', { detail: data }));
});
ipcRenderer.on('multi-data', (event, data) => {
  window.multiData = data;
  window.dispatchEvent(new CustomEvent('multi-data', { detail: data }));
});
ipcRenderer.on('inversa-data', (event, data) => {
  window.inversaData = data;
  window.dispatchEvent(new CustomEvent('inversa-data', { detail: data }));
});