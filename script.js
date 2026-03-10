let offset = 0;
let limit = 30;
let maxPokemons = 60;

let pokemonList = [];
let pokemonDetails = [];

let currentIndex = 0;

async function init() {
  showSpinner();
  await fetchPokemonList();
  await fetchPokemonDetails();
  renderAllPokemons();
  hideSpinner();
  showLoadButton();
  updateLoadButton();
}

function showSpinner() {
  document.getElementById("loading-spinner").classList.remove("hidden");
}

async function fetchPokemonList() {
  try {
    const url = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Pokemon-Liste konnte nicht geladen werden");
    }
    const data = await response.json();

    pokemonList.push(...data.results);
    console.log(pokemonList);
    //moves every single pokemon into pokemonlist-array without array in array
    offset += limit;

  } catch (error) {
    console.error("POkemon-Liste konnte nicht geladen werden:", error);
    throw error;
  }
}

async function fetchPokemonDetails() {
  try {
    for (let index = pokemonDetails.length; index < pokemonList.length; index++) {
      const response = await fetch(pokemonList[index].url);

      if (!response.ok) {
        throw new Error("Pokemon-Details konnten nicht geladen werden");
      }
      const data = await response.json();
      pokemonDetails.push(data);
    }
    console.log(pokemonDetails);
  } catch (error) {
    console.error("Pokemon-Details konnten nicht geladen werden", error);
    throw error;
  }
}

function renderAllPokemons() {
  const container = document.getElementById("pokecard-container");
  const btn = document.getElementById("load-btn");

  btn.disabled = true;

  container.innerHTML = "";

  for (let pokemonindex = 0; pokemonindex < pokemonDetails.length; pokemonindex++) {
    const pokemon = pokemonDetails[pokemonindex];
    const typeClass = `type-${pokemon.types[0].type.name}`;

    container.innerHTML += getPokemonCardTemplate(pokemon, pokemonindex, typeClass);
  }
  btn.disabled = false;
}

function getPokemonCardTemplate(pokemon, pokemonindex, typeClass) {
  return `
  <li class="poke-card" tabindex="0" onclick="openDialog(${pokemonindex})">
      <p class="poke-id">#${pokemon.id}</p>
      <div class="poke-img-div ${typeClass}">
          <img class="poke-img" src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}">
      </div>
      <h3 class="poke-name">${pokemon.name}</h3>
      <div class="poke-types">
      ${getPokemonTypesHTML(pokemon)}
      </div>
  </li>
  `
}

function getPokemonTypesHTML(pokemon) {
  let typesHTML = "";

  for (let typesIndex = 0; typesIndex < pokemon.types.length; typesIndex++) {
    const type = pokemon.types[typesIndex].type.name;

    typesHTML += `
      <img
         class="type-icon"
         src="./assets/icons/pokemon-types/${type}.svg"
         alt="${type}"
         title="${type}"
       >
      `;
  }
  return typesHTML;
}

function hideSpinner() {
  document.getElementById("loading-spinner").classList.add("hidden");
}

function showLoadButton() {
  document.getElementById("load-btn-div").classList.remove("d-none");
}

function updateLoadButton() {
  const btn = document.getElementById("load-btn");
  const note = document.getElementById("note");
  
  if (pokemonDetails.length >= maxPokemons) {
    btn.disabled = true;
    btn.classList.add("btn-disabled");
    note.textContent="Alle Pokémon sind geladen"
    } else {
      btn.disabled = false;
      btn.classList.remove("btn-disabled")
      note.textContent = "";
    }
}

async function loadMorePokemons() {
  showSpinner();
  await fetchPokemonList();
  await fetchPokemonDetails();
  renderAllPokemons();
  updateLoadButton(); 
  hideSpinner(); 
  }
