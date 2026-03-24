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

getPokemonCardTemplate(pokemon, index, typeClass)

## ⚡ Performance Considerations

- Batch loading using `offset` and `limit`  
- Avoids loading all Pokémon at once  
- Improves initial load time  

### Lazy rendering

- “Load more” button appends new Pokémon  
- Prevents DOM overload  

---

## ♿ Accessibility Considerations

The project includes several accessibility improvements:

- Replaced non-semantic clickable elements with `<button>`  
- Added ARIA attributes:
  - `aria-label`
  - `aria-live`
- Improved keyboard navigation  
- Added hidden labels for screen readers  
- Improved image alternative text  

---

## ⚠️ Known Limitations

- No full focus management in dialog yet  
- Uses inline `onclick` handlers (could be refactored)  
- No state management library (intentional for learning purposes)  

---

## 🚀 Possible Improvements

- Refactor to event listeners instead of inline handlers  
- Implement proper dialog focus trapping  
- Introduce component-based architecture  
- Add caching for API responses  
- Improve error handling and fallback UI  

---

## 🧪 Learning Goals

This project was built to practice:

- working with REST APIs  
- async/await and error handling  
- dynamic DOM rendering  
- structuring medium-sized frontend projects  
- accessibility fundamentals (WCAG, ARIA)  

---

## 📌 Conclusion

This Pokédex demonstrates how a fully functional, interactive web application can be built using only vanilla JavaScript while maintaining a clean structure and good accessibility practices.