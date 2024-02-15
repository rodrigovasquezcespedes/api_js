const selector = document.querySelector("#selectOptions");
const boton = document.querySelector("#boton");
const total = document.querySelector("#resultado");
const input = document.querySelector("#input");
const apiUrl = 'https://mindicador.cl/api';

// Función para cargar opciones desde la API
const cargarOpcionesDesdeAPI = async () => {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        selector.innerHTML = "";
        selector.innerHTML = "<option value='0'>Seleccione una opción</option>";
        for (const indice in data) {
            const indicador = data[indice];
            if (indicador.nombre !== undefined) {
                const optionElement = document.createElement("option");
                optionElement.value = indicador.valor;
                optionElement.textContent = indicador.nombre + "  ( valor " + indicador.valor + ") ";
                selector.appendChild(optionElement);
            }
        }
    } catch (error) {
        console.error('Error al obtener datos desde la API:', error);
        selectElement.innerHTML = "<option value=''>Error al cargar opciones</option>";
    }
};

const separarPorPuntos = (numero) => {
    return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const calcular = () => {
    const valor1 = input.value;
    const valor2 = selector.value;
    const resultado = valor1 * valor2;
    total.innerHTML = 'Total $ ' + separarPorPuntos(resultado.toFixed(0));
}

const borrar=()=>{
    input.value = "";
    cargarOpcionesDesdeAPI();
    total.innerHTML=" ";
}

boton.addEventListener('click', calcular);
input.addEventListener("focus",borrar);
cargarOpcionesDesdeAPI();
