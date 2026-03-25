let offset = 0;
let limit = 20;
let maxPokemons = 150;

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
    //moves every single pokemon into pokemonlist-array without array in array
    console.log(pokemonList);
    offset += limit;

  } catch (error) {
    console.error("Pokemon-Liste konnte nicht geladen werden:", error);
    throw error;
  }
}

// array with all pokemons
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

function renderAllPokemons(list = pokemonDetails) {  //normaly list = pokemonDetails, if (filtered) is transmitted then list = filtered 
  const container = document.getElementById("pokecard-container");
  const btn = document.getElementById("load-btn");

  btn.disabled = true;

  container.innerHTML = "";
  let html ="";

  for (let pokemonindex = 0; pokemonindex < list.length; pokemonindex++) {
    const pokemon = list[pokemonindex];

    const originalIndex = pokemonDetails.findIndex(p => p.id === pokemon.id); // index = id

    const typeClass = `type-${pokemon.types[0].type.name}`;

    html += getPokemonCardTemplate(pokemon, originalIndex, typeClass);
  }
  container.innerHTML = html;
  btn.disabled = false;
}

function getPokemonTypesHTML(pokemon) {
  let typesHTML = "";

  for (let typesIndex = 0; typesIndex < pokemon.types.length; typesIndex++) {
    const type = pokemon.types[typesIndex].type.name;

    typesHTML += getPokemonTypesTemplate(type);
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
  renderAllPokemons(pokemonDetails);
  updateLoadButton();
  hideSpinner();
}

//dialog-section

function openDialog(pokemonindex) {
  currentIndex = pokemonindex;
  const pokemon = pokemonDetails[pokemonindex];
  const dialogRef = document.getElementById("pokemon-dialog");

  const typeClass = `type-${pokemon.types[0].type.name}`;

  const content = document.getElementById("dialog-content");
  content.innerHTML = getDialogTemplate(pokemon, typeClass);

  showMain();

  dialogRef.showModal();
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
    abilities += pokemonAbility.ability.name;
    if (index < pokemon.abilities.length - 1) {
      abilities += ", ";
    }
  }
  details.innerHTML = getShowMainTemplate(pokemon, height, weight, abilities);
  resetDetailsBox();
  setActiveTab("show-main");
}

function resetDetailsBox() {
  const details = document.getElementById("details-box");
  details.classList.remove("change-details-box");
  details.classList.add("details-box");
}

function setActiveTab(activeId) {
  const tabs = document.querySelectorAll(".pokemon-details > button");

  for (let index = 0; index < tabs.length; index++) {
    const dialogTabs = tabs[index];
    dialogTabs.classList.remove("active");
  }
  document.getElementById(activeId).classList.add("active");
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
    const percent = Math.min((statValue / 255) * 100, 100);

    statsHTML += getShowStatsTemplate(statName, statValue, percent);
  }

  details.innerHTML = statsHTML;

  resetDetailsBox();
  setActiveTab("show-stats");
}

async function fetchSpecies() {
  try {
    const pokemon = pokemonDetails[currentIndex];

    const speciesResponse = await fetch(pokemon.species.url);

    if (!speciesResponse.ok) {
      throw new Error("Pokémon species could not be loaded");
    }
    const speciesData = await speciesResponse.json();
    console.log(speciesData)

    fetchEvoChain(speciesData);

  } catch (error) {
    console.error("Pokémon species could not be loaded:", error);
    throw error;
  }
}

async function fetchEvoChain(speciesData) {
  try {
    const evoResponse = await fetch(speciesData.evolution_chain.url);

    if (!evoResponse.ok) {
      throw new Error("Pokemon evolution chain could not be loaded");
    }
    const evoData = await evoResponse.json();
    console.log(evoData);
    renderEvo(evoData);

  } catch (error) {
    console.error("Pokemon evolution chain could not be loaded:", error);
    throw error;
  }
}

function collectEvolutionNames(evoData) {
  let evolutions = [];

  function collect(current) { // current = first evoData.chain, later evovlves_to[index]
    evolutions.push(current.species.name);

    for (let index = 0; index < current.evolves_to.length; index++) {
      collect(current.evolves_to[index]);
    }
  }
  collect(evoData.chain); // start point
  console.log(evolutions);
  return evolutions;
}

function renderEvo(evoData) {
  const details = document.getElementById("details-box");
  details.classList.add("change-details-box");
  details.innerHTML = "";
  const evolutions = collectEvolutionNames(evoData);
  let html = "";

  for (let index = 0; index < evolutions.length; index++) {
    const name = evolutions[index];

    const pokemon = pokemonDetails.find(p => p.name === name);

    if (pokemon) {
      html += getPokemonEvoTemplate(pokemon);
    }
    if (pokemon && index < evolutions.length - 1) {
      html += getEvoArrowTemplate();
    }
  }
  details.innerHTML = html;

  setActiveTab("show-evo");
}

function searchPokemon(event) {
  event.preventDefault(); //prevents site reload

  const input = document.getElementById("search-pokemon");
  const value = input.value.toLowerCase().trim();

  if (value.length < 3) {
    return;
  }

  const filtered = pokemonDetails.filter(p => p.name.includes(value));
  renderAllPokemons(filtered);

  document.getElementById("load-btn-div").classList.add("d-none");
  document.getElementById("return-btn-div").classList.remove("d-none");

  const note = document.getElementById("return-note")

  if (filtered.length === 0) {
    note.textContent = "no pokémon found";
  } else {
    note.textContent = "";
  }
}

function returnToList() {
  renderAllPokemons();
  document.getElementById("load-btn-div").classList.remove("d-none");
  document.getElementById("return-btn-div").classList.add("d-none");
  document.getElementById("search-pokemon").value = "";
  document.getElementById("return-note").textContent = "";
}

function filterPokemonType(type) {
  const filtered = pokemonDetails.filter(p => p.types.some(t => t.type.name === type)
  );
  renderAllPokemons(filtered);

  document.getElementById("load-btn-div").classList.add("d-none");
  document.getElementById("return-btn-div").classList.remove("d-none");

  const note = document.getElementById("return-note")

  if (filtered.length === 0) {
    note.textContent = "no pokémon found";
  } else {
    note.textContent = "";
  }
}