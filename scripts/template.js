
function getPokemonCardTemplate(pokemon, originalIndex, typeClass) {
  return `
  <li class="poke-card" tabindex="0" onclick="openDialog(${originalIndex})">
      <p class="poke-id">#${pokemon.id}</p>
      <div class="poke-img-div ${typeClass}">
          <img class="poke-img" src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}">
      </div>
      <h2 class="poke-name">${pokemon.name}</h2>
      <div class="poke-types">
      ${getPokemonTypesHTML(pokemon)}
      </div>
  </li>
  `
}


 function getPokemonTypesTemplate(type) {
    return `
      <img
         class="type-icon"
         src="./assets/icons/pokemon-types/${type}.svg"
         alt="${type}"
         title="${type}"
       >
      `;
      }


function getDialogTemplate(pokemon, typeClass) {
  return `
    <div class="navigation">
        <button class="x-dialog" aria-label="Dialog schliessen" onclick="closeDialog()">
          <span>&#215;</span>
        </button>
    </div>

    <h2 id="dialog-title" class="center-dialog-name">${pokemon.name}</h2>

    <div class="poke-img-div center-dialog-img ${typeClass}">
        <img class="dialog-img" src="${pokemon.sprites.other["official-artwork"].front_default}">
    </div>

    <p class="center-dialog-id">#${pokemon.id}</p>

    <div class="pokemon-details">
        <div id="show-main" tabindex="0" onclick="showMain()">main</div>
        <div id="show-stats" tabindex="0" onclick="showStats()">stats</div>
        <div id="show-evo" tabindex="0" onclick="fetchSpecies()">evo chain</div>
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


function getShowMainTemplate(pokemon, height, weight, abilities) {
  return `
      <p><strong>height:</strong> ${height} m</p>
      <p><strong>weight:</strong> ${weight} kg</p>
      <p><strong>base experience:</strong> ${pokemon.base_experience}</p>
      <p><strong>abilities:</strong> ${abilities}</p>
   `
}

function getShowStatsTemplate(statName, statValue, percent) {
    return `
        <p>${statName}</p>
        <div class="progress mb-1">
          <div class="progress-bar" 
               role="progressbar"
               aria-label="${statName}" 
               aria-valuenow="${statValue}"
               aria-valuemin="0" 
               aria-valuemax="255"
               style="width: ${percent}%;
               --bs-progress-bar-bg: rgb(227, 32, 38);">
            ${statValue}
          </div>
        </div>
     `
     }

function getPokemonEvoTemplate(pokemon) {
  return `
    <img 
      class="evo-img" 
        src="${pokemon.sprites.other['official-artwork'].front_default}" 
        alt="${pokemon.name}" title="${pokemon.name}"
    >`;
}

function getEvoArrowTemplate() {
    return `
        <span class="evo-arrow"> &gt; </span>
     `;      
}