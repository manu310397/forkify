import Search from "./models/Search";
import Recipe from "./models/Recipe";
import { elements, renderLoader, clearLoader } from "./views/base";
import * as searchView from "./views/SearchView";

const state = {};

const controlSearch = async () => {
  const query = searchView.getInput();
  //const query = "pizza";

  if (query) {
    state.search = new Search(query);

    searchView.clearInput();
    searchView.clearresults();
    renderLoader(elements.searchRes);
    try {
      await state.search.getResults();

      clearLoader();
      searchView.renderResults(state.search.recipes);

      console.log(state.search.recipes);
    } catch (error) {
      alert("Error processing search");
      clearLoader();
    }
  }
};

elements.searchForm.addEventListener("submit", e => {
  e.preventDefault();
  controlSearch();
});

//testing
// window.addEventListener("load", e => {
//   e.preventDefault();
//   controlSearch();
// });

elements.searchResPages.addEventListener("click", e => {
  const btn = e.target.closest(".btn-inline");
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);

    searchView.clearresults();
    searchView.renderResults(state.search.recipes, goToPage);
    console.log(goToPage);
  }
});

const controlRecipe = async () => {
  const id = window.location.hash.replace("#", "");
  console.log(id);
  if (id) {
    state.recipe = new Recipe(id);
    //testing
    //window.r = state.recipe;
    try {
      await state.recipe.getRecipe();
      console.log(state.recipe.ingredients);
      state.recipe.parseIngredients();

      state.recipe.calcServings();
      state.recipe.calcTime();
      console.log("Recipe " + state.recipe);
    } catch (error) {
      alert("Error processing recipe");
    }
  }
};

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

["hashchange", "load"].forEach(event =>
  window.addEventListener(event, controlRecipe)
);
