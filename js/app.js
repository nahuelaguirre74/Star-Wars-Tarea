//URL base de la API

const API_URL = 'https://swapi.dev/api/';

// Declarar elementos para acceder al DOM (una buena practica sería declarar los const en orden alfabetico)

const content = document.getElementById('content');
const buttons = document.querySelectorAll('nav button');
const itemSelector = document.getElementById('item-selector');
const selectorContainer = document.getElementById('selector-container');

//Funcion para obtener los datos API

async function fetchData(endpoint) {
    try {
        const response = await fetch(API_URL + endpoint);
        if (!response.ok){
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(`Fetched data from ${endpoint}`, data);
        return data.results;

    } catch (error){
    console.error('Error fetching data: ', error);
    return [];
    }
}

//Card para personajes

function createCharacterCard(character){
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
    <h2>${character.name}</h2>
    <p>Altura: ${character.height} cm</p>
    <p>Peso: ${character.mass} kg</p>
    <p>Año de Nacimiento: ${character.birth_year}</p>
    <p>Genero: ${character.gender}</p>
    `;
    return card;
}

//Card parar planetas
function createPlanetsCard(planetas){
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
    <h2>${planetas.name}</h2>
    <p>Rotación: ${planetas.rotation_period}Horas</p>
    <p>Órbita: ${planetas.orbital_period}Días</p>
    <p>Diámetro: ${planetas.diameter}Km2</p>
    <p>Clima: ${planetas.climate}</p>
    `;
    return card;
}

//Card parar naves
function createStarShipCard(nave){
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
    <h2>${nave.name}</h2>
    <p>Modelo: ${nave.model}</p>
    <p>Manofactura: ${nave.manufacturer}</p>
    <p>Costo de la Nave: ${nave.cost_in_credits}Créditos</p>
    <p>Tamaño: ${nave.length}mts</p>
    `;
    return card;
}

//Funcion para mostras los datos

async function displayData(type) {
    content.innerHTML = '';
    itemSelector.style.display = 'block';
    itemSelector.innerHTML = '<option value="" disabled selected>Seleccione un item </option>';

    const endpoint = type === 'character' ? 'people' : type;
    console.log(`Fetching data for endpoint: ${endpoint}`);

    const data = await fetchData(endpoint);
     if (data.length === 0){
        itemSelector.innerHTML = '<option value="" disabled>No se encontraron datos</option>';
        return; 
     }
     data.forEach(item =>{
        const option = document.createElement('option');
        option.value = item.url;
        option.textContent = item.name || item.title;
        itemSelector.appendChild(option);
     });

    itemSelector.onchange = async function(){
        const url = this.value;
        const response = await fetch(url);
        const item = await response.json();
        content.innerHTML = '';

        let card;
        if (type === 'character'){
            card = createCharacterCard(item);
        } else if (type === 'planets'){
            card = createPlanetsCard(item);
        } else if (type === 'starships'){
            card = createStarShipCard(item);
        }
        if (card) {
            content.appendChild(card);
         }else{
            console.error('Error: Card undefined');
         }
    }
             
}

//Agregar eventos a los botones
buttons.forEach(button =>{
    button.addEventListener('click', (event)=>{
        const type = event.target.id === 'character' ? 'people': event.target.id;
        displayData(type);
    })
})

 buttons.forEach(button =>{
     button.addEventListener('click', (event)=>{
         const type = event.target.id === 'planetas' ? 'planets': event.target.id;
         displayData(type);
     })
 })

 buttons.forEach(button =>{
     button.addEventListener('click', (event)=>{
         const type = event.target.id === 'nave' ? 'starships': event.target.id;
         displayData(type);
     })
 })