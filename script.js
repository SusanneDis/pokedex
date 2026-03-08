let offset = 0;
let limit = 50;
let maxPokemons = 200;

let pokemonList = [];
let pokemonDetails = [];

let currentIndex = 0;

async function init() {
  showSpinner();
  await fetchPokemonList();
  await fetchPokemonDetails();
  hideSpinner();
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
    for (let index=pokemonDetails.length; index < pokemonList.length; index++) {
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


function hideSpinner() {
  document.getElementById("loading-spinner").classList.add("hidden");
}