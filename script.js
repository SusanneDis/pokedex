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
    console.error("Pokemon-Liste konnte nicht geladen werden:", error);
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
    note.textContent = "Alle Pokémon sind geladen"
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

//dialogue-section

function openDialog(pokemonindex) {
  currentIndex = pokemonindex;
  const pokemon = pokemonDetails[pokemonindex];
  const dialogRef = document.getElementById("pokemon-dialog");

  const typeClass = `type-${pokemon.types[0].type.name}`;

  const content = document.getElementById("dialog-content");
  content.innerHTML = getDialogTemplate(pokemon, typeClass);

  dialogRef.showModal();
}

function getDialogTemplate(pokemon, typeClass) {
  return `
    <div class="navigation">
        <button class="x-dialog" aria-label="Dialog schliessen" onclick="closeDialog()">
          <span>&#215;</span>
        </button>
    </div>

    <h2 class="center-dialog-name">${pokemon.name}</h2>

    <div class="poke-img-div center-dialog-img ${typeClass}">
        <img class="dialog-img" src="${pokemon.sprites.other["official-artwork"].front_default}">
    </div>

    <p class="center-dialog-id">#${pokemon.id}</p>

    <div class="pokemon-details">
        <div tabindex="0" onclick="showMain()">main</div>
        <div tabindex="0" onclick="showStats()">stats</div>
        <div tabindex="0" onclick="fetchSpecies()">evo chain</div>
    </div>

    <div class="details-container">
        <div id="details-box" class="details-box"></div>
    </div>

    <div class="buttons-left-right">
        <button class="arrow" aria-label="Vorheriges Pokémon" onclick="prevPokemon()">
            <span>&#10094;</span>
        </button>
        <button class="arrow" aria-label="Nächstes Pokémon" onclick="nextPokemon()">
            <span>&#10095;</span>
        </button>
    </div>  
    `;
}

function closeDialog() {
  document.getElementById("pokemon-dialog").close();
}

function nextPokemon() {
  currentIndex++;

  if (currentIndex >= pokemonDetails.length) {
    currentIndex = 0;
  }
  openDialog(currentIndex);
}

function prevPokemon() {
  currentIndex--;

  if (currentIndex < 0) {
    currentIndex = pokemonDetails.length - 1
  }
  openDialog(currentIndex);
}


function showMain() {
  const pokemon = pokemonDetails[currentIndex];
  const details = document.getElementById("details-box");
  details.innerHTML = "";

  const height = pokemon.height / 10;
  const weight = pokemon.weight / 10;

  let abilities = "";

  for (let index = 0; index < pokemon.abilities.length; index++) {
    const pokemonAbility = pokemon.abilities[index];
    abilities += pokemonAbility.ability.name + ", ";
  }
  details.innerHTML = getShowMainTemplate(pokemon, height, weight, abilities);
}

function getShowMainTemplate(pokemon, height, weight, abilities) {
  return `
      <p><strong>height:</strong> ${height} m</p>
      <p><strong>weight:</strong> ${weight} kg</p>
      <p><strong>base experience:</strong> ${pokemon.base_experience}</p>
      <p><strong>abilities:</strong> ${abilities}</p>
      `
}

function showStats() {
  const pokemon = pokemonDetails[currentIndex];
  const details = document.getElementById("details-box");
  details.innerHTML = "";

  let statsHTML = "";

  for (let index = 0; index < pokemon.stats.length; index++) {
    const pokemonStat = pokemon.stats[index];

    const statName = pokemonStat.stat.name;
    const statValue = pokemonStat.base_stat;

    statsHTML += `
        <p>${statName}</p>
        <div class="progress mb-1">
          <div class="progress-bar" 
               role="progressbar"
               aria-label="${statName}" 
               aria-valuenow="${statValue}"
               aria-valuemin="0" 
               aria-valuemax="255"
               style="width: ${statValue / 2}%;
               --bs-progress-bar-bg: rgb(227, 32, 38);">
            ${statValue}
          </div>
        </div>
     `
  }
  details.innerHTML = statsHTML;
}

async function fetchSpecies() {
  try {
    const pokemon = pokemonDetails[currentIndex];

    const speciesResponse = await fetch(pokemon.species.url);

    if (!speciesResponse.ok) {
      throw new Error("Pokemon-Spezies konnte nicht geladen werden");
    }
    const speciesData = await speciesResponse.json();
    console.log(speciesData)

    fetchEvoChain(speciesData);

  } catch (error) {
    console.error("Pokemon-Spezies konnte nicht geladen werden:", error);
    throw error;
  }
}

async function fetchEvoChain(speciesData) {
  try {
    const evoResponse = await fetch(speciesData.evolution_chain.url);

    if (!evoResponse.ok) {
      throw new Error("Pokemon-Evolution-Chain konnte nicht geladen werden");
    }
      const evoData = await evoResponse.json();
      console.log(evoData);
      renderEvo(evoData);
    
  } catch (error) {
    console.error("Pokemon-Evolution-Chain konnte nicht geladen werden:", error);
    throw error;
  }
}

function renderEvo(evoData) {
  const details = document.getElementById("details-box");
  details.innerHTML = "";

  console.log(evoData.chain.evolves_to)

  
  
}