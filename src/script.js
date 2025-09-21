//Logica de matrices
//! Funcion estrellas
window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('estrellas-bg');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');
  const estrellas = [];
  for (let i = 0; i < 120; i++) {
    estrellas.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.5,
      baseX: 0,
      baseY: 0,
      alpha: Math.random() * 0.7 + 0.3,
      fase: Math.random() * Math.PI * 2
    });
  }
  estrellas.forEach(e => {
    e.baseX = e.x;
    e.baseY = e.y;
  });

  function animar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    estrellas.forEach(e => {
      // Temblor suave
      e.x = e.baseX + Math.sin(Date.now() / 400 + e.fase) * 1.2;
      e.y = e.baseY + Math.cos(Date.now() / 400 + e.fase) * 1.2;
      ctx.globalAlpha = e.alpha;
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.r, 0, 2 * Math.PI);
      ctx.fillStyle = 'white';
      ctx.fill();
    });
    requestAnimationFrame(animar);
  }
  animar();
});

//! Funcion para eliminar la barra scroll en windows
window.addEventListener('DOMContentLoaded', () => {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const matrizContainer = document.getElementById('matriz-container');
  if (matrizContainer && !isMac) {
    matrizContainer.classList.add('ocultar-scroll');
    console.log("es mac");
  }
});

//! Funciones de navegacion
document.getElementById('suma')?.addEventListener('click', () => {
    window.electron.navegarASuma();
});
document.getElementById('multi')?.addEventListener('click', () => {
    window.electron.navegarAMultiplicacion();
});
document.getElementById('inversa')?.addEventListener('click', () => {
    window.electron.navegarAInversa();
});
document.getElementById('volver')?.addEventListener('click', () => {
    window.electron.volverAIndex();
});

//! Guardado de matrices
const arrayMatrices = []; 

//! Logiica sumar M 
document.getElementById('enviar-suma')?.addEventListener('click', (e) => {
    e.preventDefault();
    let filas = document.getElementById('filas-sumas');
    let columnas = document.getElementById('columnas-sumas');
    let error = document.querySelector('.error-texto');

    const filasVal = Number(filas.value);
    const columnasVal = Number(columnas.value);

    if (filasVal < 1 || columnasVal < 1 || !Number.isInteger(filasVal) || !Number.isInteger(columnasVal)) {
        error.classList.add('show');
        filas.value = '';
        columnas.value = '';
    } else {
        console.log("Se ingresaron bien las columnas y filas");
        window.electron.navegarALlenado({
            filas: filas.value,
            columnas: columnas.value
        });

    }
})

if (window.location.pathname.endsWith('llenadoMatrices.html')) {
    const titulo = document.getElementById('titulo-llenado');
    const matrizContainer = document.getElementById('matriz-container');

    function sumarMatrices() {
        titulo.textContent = 'El resultado de la suma es';
        const resultado = arrayMatrices.map(obj => obj.matriz).reduce((acc, curr) => window.mathAPI.add(acc, curr));
        
        //! Para probar con valores altos
        //const resultado = Array.from({length:45}, () => Array.from({length:45}, () => Math.floor(Math.random()*100)+1));

        let tableWidth = '90%';
        let fontSize = '16px';
        let cellPadding = '8px 16px';
        let marginLeft = 'auto';
        let marginRight = 'auto';
        const numCols = resultado[0].length;

        if (numCols <= 6) {
            fontSize = '22px';
            cellPadding = '16px 32px';
        } else if (numCols <= 12) {
            fontSize = '18px';
            cellPadding = '8px 10px';
        } else if (numCols < 17) {
            fontSize = '15px';
            cellPadding = '8px 10px';
        } else {
            matrizContainer.style.justifyContent = 'normal';
            tableWidth = '100%'
            fontSize = '13px';
            cellPadding = '4px 6px';
        }

        let html = `<table style="margin-left:${marginLeft};margin-right:${marginRight};border-collapse:collapse;width:${tableWidth};">`;
        resultado.forEach(fila => {
            html += '<tr>';
            fila.forEach(valor => {
                html += `<td style="border:1px solid #fff;padding:${cellPadding};text-align:center;color:white;font-size:${fontSize};">${valor}</td>`;
            });
            html += '</tr>';
        });
        html += '</table>';
        matrizContainer.innerHTML = html;
    }
    function generarFormularioMatriz1() {
        if (window.matrizDatos) {
            const filas = parseInt(window.matrizDatos.filas);
            const columnas = parseInt(window.matrizDatos.columnas);
            titulo.textContent = 'Ingrese los datos para la 1° matriz';
            const form = document.createElement('form');
            form.id = 'form-matriz';

            const MAX_INPUTS_PER_ROW = 5;

            for (let i = 1; i <= filas; i++) {
            let colActual = 1;
            let separador = document.createElement('hr');
            while (colActual <= columnas) {
                const filaDiv = document.createElement('div');
                filaDiv.className = 'fila-matriz';
                const inputsEnEstaFila = Math.min(MAX_INPUTS_PER_ROW, columnas - colActual + 1);
                for (let k = 0; k < inputsEnEstaFila; k++) {
                const j = colActual + k;
                const input = document.createElement('input');
                input.type = 'number';
                input.placeholder = `Fila ${i}, Columna ${j}`;
                input.name = `A_${i}_${j}`;
                input.required = true;
                filaDiv.appendChild(input);
                }
                form.appendChild(filaDiv);
                if (columnas > 5){
                    form.appendChild(separador);
                }
                colActual += inputsEnEstaFila;
            }
            }

            const submitBtn = document.createElement('button');
            submitBtn.type = 'submit';
            submitBtn.textContent = 'Guardar matriz';
            form.appendChild(submitBtn);

            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const matriz = [];
                
                for (let i = 1; i <= filas; i++) {
                    const fila = [];
                    for (let j = 1; j <= columnas; j++) {
                        const valor = form[`A_${i}_${j}`].value;
                        fila.push(Number(valor));
                    }
                    matriz.push(fila);
                }

                console.log('Matriz:', matriz);
                arrayMatrices.push({
                    id: arrayMatrices.length + 1,
                    matriz: matriz
                })

                for (let i = 1; i <= filas; i++){
                    for(let j = 1; j <= columnas; j++){
                        form[`A_${i}_${j}`].value = '';
                    }
                }
                matrizContainer.innerHTML = '';
                generarFormularioMatriz();
            });

            matrizContainer.appendChild(form);
        }
    }

    let cantidad = 2;

    function generarFormularioMatriz() {
        if (window.matrizDatos) {
            const filas = parseInt(window.matrizDatos.filas);
            const columnas = parseInt(window.matrizDatos.columnas);
            titulo.textContent = `Ingrese los datos para la ${cantidad}° matriz`;
            const form = document.createElement('form');
            form.id = 'form-matriz';

            const MAX_INPUTS_PER_ROW = 5;

            for (let i = 1; i <= filas; i++) {
            let colActual = 1;
            let separador = document.createElement('hr');
            while (colActual <= columnas) {
                const filaDiv = document.createElement('div');
                filaDiv.className = 'fila-matriz';
                const inputsEnEstaFila = Math.min(MAX_INPUTS_PER_ROW, columnas - colActual + 1);
                for (let k = 0; k < inputsEnEstaFila; k++) {
                const j = colActual + k;
                const input = document.createElement('input');
                input.type = 'number';
                input.placeholder = `Fila ${i}, Columna ${j}`;
                input.name = `A_${i}_${j}`;
                input.required = true;
                filaDiv.appendChild(input);
                }
                form.appendChild(filaDiv);
                if (columnas > 5){
                    form.appendChild(separador);
                }
                colActual += inputsEnEstaFila;
            }
            }

            const submitBtn = document.createElement('button');
            submitBtn.type = 'submit';
            submitBtn.textContent = 'Guardar matriz';
            form.appendChild(submitBtn);

            if (cantidad > 2){
                const sumarBtn = document.createElement('button');
                sumarBtn.type = "button";
                sumarBtn.id = "boton_para_sumar";
                sumarBtn.textContent = 'Sumar';
                sumarBtn.onclick = sumarMatrices;
                form.appendChild(sumarBtn);
            }

            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const matriz = [];
                
                for (let i = 1; i <= filas; i++) {
                    const fila = [];
                    for (let j = 1; j <= columnas; j++) {
                        const valor = form[`A_${i}_${j}`].value;
                        fila.push(Number(valor));
                    }
                    matriz.push(fila);
                }

                console.log('Matriz:', matriz);
                arrayMatrices.push({
                    id: arrayMatrices.length + 1,
                    matriz: matriz
                })

                for (let i = 1; i <= filas; i++){
                    for(let j = 1; j <= columnas; j++){
                        form[`A_${i}_${j}`].value = '';
                    }
                }
                cantidad++;
                matrizContainer.innerHTML = '';
                generarFormularioMatriz();
            });
            matrizContainer.appendChild(form);
        }
    }

    window.addEventListener('DOMContentLoaded', generarFormularioMatriz1);
    window.addEventListener('matriz-datos', (e) => {
        window.matrizDatos = e.detail;
        generarFormularioMatriz1();
    });
}

//! Logica multiplicar M
document.getElementById('enviar-multi')?.addEventListener('click', (e) => {
    e.preventDefault();
    let filas = document.getElementById('filas-multi');
    let filcol = document.getElementById('filcol-multi');
    let columnas = document.getElementById('columnas-multi');
    let error = document.querySelector('.error-texto');

    const filasVal = Number(filas.value);
    const columnasVal = Number(columnas.value);
    const filcolVal = Number(filcol.value);

    if (filasVal < 1 || columnasVal < 1 || filcolVal < 1 || !Number.isInteger(filcolVal) || !Number.isInteger(filasVal) || !Number.isInteger(columnasVal)){
        error.classList.add('show');
        filas.value = '';
        columnas.value = '';
        filcol.value = '';
    } else {
        console.log('Se ingresaron los datos para la multiplicacion');
        window.electron.navegarALlenadoMulti({
            filas: filas.value,
            filcol: filcol.value,
            columnas: columnas.value,
        })
    }
})

if (window.location.pathname.endsWith('llenadoMulti.html')) {
    const titulo = document.getElementById('titulo-llenado');
    const matrizContainer = document.getElementById('matriz-container');

    function multiplicarMatrices() {
            titulo.textContent = 'El resultado de la multiplicacion es';
            const resultado = arrayMatrices.map(obj => obj.matriz).reduce((acc, curr) => window.mathAPI.multiply(acc, curr));
            
            //! Para probar con valores altos
            //const resultado = Array.from({length:45}, () => Array.from({length:45}, () => Math.floor(Math.random()*100)+1));

            let tableWidth = '90%';
            let fontSize = '16px';
            let cellPadding = '8px 16px';
            let marginLeft = 'auto';
            let marginRight = 'auto';
            const numCols = resultado[0].length;

            if (numCols <= 6) {
                fontSize = '22px';
                cellPadding = '16px 32px';
            } else if (numCols <= 12) {
                fontSize = '18px';
                cellPadding = '8px 10px';
            } else if (numCols < 17) {
                fontSize = '15px';
                cellPadding = '8px 10px';
            } else {
                matrizContainer.style.justifyContent = 'normal';
                tableWidth = '100%'
                fontSize = '13px';
                cellPadding = '4px 6px';
            }

            let html = `<table style="margin-left:${marginLeft};margin-right:${marginRight};border-collapse:collapse;width:${tableWidth};">`;
            resultado.forEach(fila => {
                html += '<tr>';
                fila.forEach(valor => {
                    html += `<td style="border:1px solid #fff;padding:${cellPadding};text-align:center;color:white;font-size:${fontSize};">${valor}</td>`;
                });
                html += '</tr>';
            });
            html += '</table>';
            matrizContainer.innerHTML = html;
    }

    function generarFormularioMatrizA() {
        if (window.multiData) {
            const filas = parseInt(window.multiData.filas);
            const columnas = parseInt(window.multiData.filcol)

            titulo.textContent = `Ingrese los datos de la matriz A`;
            matrizContainer.innerHTML = '';

            const form = document.createElement('form');
            form.id = 'form-matriz';

            const MAX_INPUTS_PER_ROW = 5;

            for (let i = 1; i <= filas; i++) {
            let colActual = 1;
            let separador = document.createElement('hr');
            while (colActual <= columnas) {
                const filaDiv = document.createElement('div');
                filaDiv.className = 'fila-matriz';
                const inputsEnEstaFila = Math.min(MAX_INPUTS_PER_ROW, columnas - colActual + 1);
                for (let k = 0; k < inputsEnEstaFila; k++) {
                const j = colActual + k;
                const input = document.createElement('input');
                input.type = 'number';
                input.placeholder = `Fila ${i}, Columna ${j}`;
                input.name = `A_${i}_${j}`;
                input.required = true;
                filaDiv.appendChild(input);
                }
                form.appendChild(filaDiv);
                if (columnas > 5){
                    form.appendChild(separador);
                }
                colActual += inputsEnEstaFila;
            }
            }

            const submitBtn = document.createElement('button');
            submitBtn.type = 'submit';
            submitBtn.textContent = 'Guardar matriz';
            form.appendChild(submitBtn);

            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const matriz = [];
                
                for (let i = 1; i <= filas; i++) {
                    const fila = [];
                    for (let j = 1; j <= columnas; j++) {
                        const valor = form[`A_${i}_${j}`].value;
                        fila.push(Number(valor));
                    }
                    matriz.push(fila);
                }
                console.log('Matriz:', matriz);
                arrayMatrices.push({
                    id: arrayMatrices.length + 1,
                    matriz: matriz
                })

                matrizContainer.innerHTML = '';
                generarFormularioMatrizB();
            });


            matrizContainer.appendChild(form);
        }
    }

    function generarFormularioMatrizB() {
        if (window.multiData) {
            const filas = parseInt(window.multiData.filcol);
            const columnas = parseInt(window.multiData.columnas)

            titulo.textContent = `Ingrese los datos de la matriz B`;

            const form = document.createElement('form');
            form.id = 'form-matriz';

            const MAX_INPUTS_PER_ROW = 5;

            for (let i = 1; i <= filas; i++) {
            let colActual = 1;
            let separador = document.createElement('hr');
            while (colActual <= columnas) {
                const filaDiv = document.createElement('div');
                filaDiv.className = 'fila-matriz';
                const inputsEnEstaFila = Math.min(MAX_INPUTS_PER_ROW, columnas - colActual + 1);
                for (let k = 0; k < inputsEnEstaFila; k++) {
                const j = colActual + k;
                const input = document.createElement('input');
                input.type = 'number';
                input.placeholder = `Fila ${i}, Columna ${j}`;
                input.name = `A_${i}_${j}`;
                input.required = true;
                filaDiv.appendChild(input);
                }
                form.appendChild(filaDiv);
                if (columnas > 5){
                    form.appendChild(separador);
                }
                colActual += inputsEnEstaFila;
            }
            }

            const multiBtn = document.createElement('button');
            multiBtn.type = "submit";
            multiBtn.id = "boton_para_multi";
            multiBtn.textContent = 'Multiplicar';
            form.appendChild(multiBtn);

            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const matriz = [];
                
                for (let i = 1; i <= filas; i++) {
                    const fila = [];
                    for (let j = 1; j <= columnas; j++) {
                        const valor = form[`A_${i}_${j}`].value;
                        fila.push(Number(valor));
                    }
                    matriz.push(fila);
                }
                console.log('Matriz:', matriz);
                arrayMatrices.push({
                    id: arrayMatrices.length + 1,
                    matriz: matriz
                })

                matrizContainer.innerHTML = '';
                multiplicarMatrices();
            });


            matrizContainer.appendChild(form);
        }
    }

    window.addEventListener('DOMContentLoaded', generarFormularioMatrizA);

    window.addEventListener('multi-data', (e) => {
        window.multiData = e.detail;
        generarFormularioMatrizA();
    });
}

//! Logica inversa M
document.getElementById('enviar-inversa')?.addEventListener('click', (e) => {
    e.preventDefault();
    let filas = document.getElementById('filas-inversa');
    let columnas = document.getElementById('columnas-inversa');
    let error = document.querySelector('.error-texto');

    const filasVal = Number(filas.value);
    const columnasVal = Number(columnas.value);

    if (filasVal < 1 || columnasVal < 1 || !Number.isInteger(filasVal) || !Number.isInteger(columnasVal)) {
        error.classList.add('show');
        error.textContent = 'Recuerde que solo se permiten numeros pertenecientes al conjunto de los naturales'
        filas.value = '';
        columnas.value = '';
    } else if (filasVal != columnasVal){
        error.classList.add('show');
        error.textContent = 'Recuerde que la matriz tiene que ser cuadrada'
        filas.value = '';
        columnas.value = '';
    } else {
        console.log("Se ingresaron bien las columnas y filas");
        window.electron.navegarALlenadoInversa({
            filas: filas.value,
            columnas: columnas.value
        });

    }
})

if (window.location.pathname.endsWith('llenadoInversa.html')) {
    const titulo = document.getElementById('titulo-llenado');
    const matrizContainer = document.getElementById('matriz-container');

    function inversaMatriz() {
            titulo.textContent = 'La matriz inversa es';
            let determinante = window.mathAPI.det(arrayMatrices[0].matriz);
            let resultado = null;

            if (determinante != 0) {
                resultado = window.mathAPI.inv(arrayMatrices[0].matriz);
                
                let tableWidth = '90%';
                let fontSize = '16px';
                let cellPadding = '8px 16px';
                let marginLeft = 'auto';
                let marginRight = 'auto';
                const numCols = resultado[0].length;

                if (numCols <= 6) {
                    fontSize = '22px';
                    cellPadding = '16px 32px';
                } else if (numCols <= 12) {
                    fontSize = '18px';
                    cellPadding = '8px 10px';
                } else if (numCols < 17) {
                    fontSize = '15px';
                    cellPadding = '8px 10px';
                } else {
                    matrizContainer.style.justifyContent = 'normal';
                    tableWidth = '100%'
                    fontSize = '13px';
                    cellPadding = '4px 6px';
                }

                let html = `<table style="margin-left:${marginLeft};margin-right:${marginRight};border-collapse:collapse;width:${tableWidth};">`;
                resultado.forEach(fila => {
                    html += '<tr>';
                    fila.forEach(valor => {
                        html += `<td style="border:1px solid #fff;padding:${cellPadding};text-align:center;color:white;font-size:${fontSize};">${valor}</td>`;
                    });
                    html += '</tr>';
                });
                html += '</table>';
                matrizContainer.innerHTML = html;
            } else {
                let contenedorMensaje = document.createElement('div');
                contenedorMensaje.style.display = 'flex';
                contenedorMensaje.style.flexDirection = 'column';
                contenedorMensaje.style.justifyContent = 'center';
                contenedorMensaje.style.alignItems = 'center';

                let mensajeInv = '<img src="./assets/catsad.gif" alt="gif gato" style="margin:auto; width:250px; height:auto; display:inline-block;">';
                mensajeInv += '<h1 style="font-size: 18px;margin: 30px auto;text-align: center;">La matriz es singular, por lo que no es posible calcular la inversa :(</h1>';
                contenedorMensaje.innerHTML = mensajeInv;
                matrizContainer.innerHTML = '';
                matrizContainer.appendChild(contenedorMensaje);
            }
    }

    function generarFormularioMatrizInversa() {
        if (window.inversaData) {
            const filas = parseInt(window.inversaData.filas);
            const columnas = parseInt(window.inversaData.columnas)

            titulo.textContent = "Ingrese los datos de la matriz";

            const form = document.createElement('form');
            form.id = 'form-matriz';

            const MAX_INPUTS_PER_ROW = 5;

            for (let i = 1; i <= filas; i++) {
            let colActual = 1;
            let separador = document.createElement('hr');
            while (colActual <= columnas) {
                const filaDiv = document.createElement('div');
                filaDiv.className = 'fila-matriz';
                const inputsEnEstaFila = Math.min(MAX_INPUTS_PER_ROW, columnas - colActual + 1);
                for (let k = 0; k < inputsEnEstaFila; k++) {
                const j = colActual + k;
                const input = document.createElement('input');
                input.type = 'number';
                input.placeholder = `Fila ${i}, Columna ${j}`;
                input.name = `A_${i}_${j}`;
                input.required = true;
                filaDiv.appendChild(input);
                }
                form.appendChild(filaDiv);
                if (columnas > 5){
                    form.appendChild(separador);
                }
                colActual += inputsEnEstaFila;
            }
            }

            const submitBtn = document.createElement('button');
            submitBtn.type = 'submit';
            submitBtn.textContent = 'Calcular';
            form.appendChild(submitBtn);

            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const matriz = [];
                
                for (let i = 1; i <= filas; i++) {
                    const fila = [];
                    for (let j = 1; j <= columnas; j++) {
                        const valor = form[`A_${i}_${j}`].value;
                        fila.push(Number(valor));
                    }
                    matriz.push(fila);
                }
                console.log('Matriz:', matriz);
                arrayMatrices.push({
                    id: arrayMatrices.length + 1,
                    matriz: matriz
                })

                matrizContainer.innerHTML = '';
                inversaMatriz();
            });
            matrizContainer.appendChild(form);
        }
    }

    window.addEventListener('DOMContentLoaded', generarFormularioMatrizInversa);

    window.addEventListener('inversa-data', (e) => {
        window.inversaData = e.detail;
        generarFormularioMatrizInversa();
    });
}