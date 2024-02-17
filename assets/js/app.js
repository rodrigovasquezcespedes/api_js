const selector = document.querySelector("#selectOptions");
const boton = document.querySelector("#boton");
const total = document.querySelector("#resultado");
const input = document.querySelector("#input");
const apiUrl = `https://mindicador.cl/api`;

// Función para recuperar datos de la API
const cargarOpcionesDesdeAPI = async () => {
    try {
        const { value: indicador } = selector;
        const respuesta = await fetch(`${apiUrl}/${indicador}`);
        const data = await respuesta.json();
        return data;
    } catch (error) {
        console.error('Error al obtener datos desde la API:', error);
        selectElement.innerHTML = "<option value=''>Error al cargar opciones</option>";
    }
};

//carga el select con la informacion recuperada de la api
const cargarselect = async () => {
    const datos = await cargarOpcionesDesdeAPI();
    selector.innerHTML = "<option value='0'>Seleccione una opción</option>";
    for (const indice in datos) {
        const indicador = datos[indice];
        if (indicador.nombre !== undefined){
            const optionElement = document.createElement("option");
            optionElement.value = indicador.codigo;
            optionElement.textContent = indicador.nombre + "  ( valor " + indicador.valor + ") ";
            selector.appendChild(optionElement);
        }
    }
}

//formatea los valores del input
const formatearValor = () => {
    if (!isNaN(input.value)) {
        const valor = input.value;
        const valorFormateado = valor.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        input.value = valorFormateado;
    } else {
        input.value = "";
        cargarOpcionesDesdeAPI();
        total.innerHTML = " ";
    }
}

//calcula el valor del tipo de cambio
const calcular = async () => {
    try {

       if(input.value!==""){
        const opciones = await cargarOpcionesDesdeAPI();
        const { value: monto } = input;
        const resultado = monto.replace(/\./g, '') / opciones.serie[0].valor;
        const tipo = selector.value;
        total.innerHTML = `${tipo} $ ${resultado.toFixed(2)}`;
        inicializarGrafico();
        //destruye el grafico
        if (myChart) {
            myChart.destroy();
        }
    }
    } catch (error) {
        console.error('Error al calcular:', error);
    }
};
// obtiene los de los ultimos 10 dias 
const obtenerDatosUltimos10Dias = async () => {
    try {
        const data = await cargarOpcionesDesdeAPI();
        const ultimos10Dias = data.serie.slice(-10);
        return ultimos10Dias;
    } catch (error) {
        console.error('Error al obtener datos desde la API:', error);
        return [];
    }
};
//crea el grafico con la informacion entregada de los ultimos 
const inicializarGrafico = async () => {
    const indicador = selector.value;
    const datos = await obtenerDatosUltimos10Dias(indicador);
    const fechas = datos.map(entry => entry.fecha);
    const valores = datos.map(entry => entry.valor);
    const ctx = document.getElementById('myChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: fechas,
            datasets: [{
                label: `Últimos 10 días de ${indicador.toUpperCase()}`,
                data: valores,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        }
    });
};
//limpia el input y el select
const borrar = () => {
    input.value = "";
    cargarOpcionesDesdeAPI();
    total.innerHTML = "";
}

boton.addEventListener('click', calcular);
input.addEventListener("input", formatearValor);
input.addEventListener("focus",borrar)
cargarselect();


