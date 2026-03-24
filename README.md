# Pokédex Web App – Developer Documentation

This document provides a deeper insight into the architecture, data flow, and design decisions of the Pokédex project.

---

## 🧠 Project Overview

The Pokédex is a client-side web application built with vanilla JavaScript.  
It consumes data from the PokéAPI and renders dynamic UI components such as Pokémon cards, detail dialogs, and evolution chains.

The main focus of this project is:

- asynchronous data handling  
- DOM manipulation  
- clean separation of concerns  
- accessibility improvements  

---

## 🏗️ Architecture

The application follows a modular structure:

- **index.html** → base structure and layout  
- **script.js** → main logic (data fetching, state handling)  
- **template.js** → UI rendering (HTML templates as functions)  
- **styles/** → styling and layout  
- **assets/** → images and icons  

### Separation of Concerns

- Data fetching is handled in `script.js`  
- UI rendering is handled in `template.js`  
- State is managed via global variables (e.g. `pokemonList`, `pokemonDetails`, `currentIndex`)  

---

## 🔄 Data Flow

1. **Initialization**
   - `init()` is called on page load  
   - Fetches Pokémon list (basic data: name + URL)

2. **Data Enrichment**
   - Additional API calls fetch detailed Pokémon data  
   - Data is stored in `pokemonDetails`

3. **Rendering**
   - `renderAllPokemons()` generates card components  
   - Uses template functions to inject HTML into the DOM  

4. **User Interaction**
   - Clicking a card opens a dialog (`openDialog(index)`)  
   - Dialog content is dynamically rendered  

5. **Filtering & Search**
   - `filterPokemonType(type)` filters data  
   - `searchPokemon()` filters by name  

---

## 🧩 Rendering Strategy

UI is generated using template functions:

```js
getPokemonCardTemplate(pokemon, index, typeClass)