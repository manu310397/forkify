import Search from "./models/Search";
import Recipe from "./models/Recipe";
import List from "./models/List";
import Likes from "./models/Likes";
import { elements, renderLoader, clearLoader } from "./views/base";
import * as recipeView from "./views/recepeView";
import * as searchView from "./views/SearchView";
import * as listView from "./views/listView";
import * as likesView from "./views/likesView";

const state = {};

window.state = state;

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
      // console.log(state.search.recipes);
      searchView.renderResults(state.search.recipes);

      
    } catch (error) {
      alert("Error processing search");
      clearLoader();
    }
  }
};

const controlList = () => {
  if(!state.list) state.list = new List();

  state.recipe.ingredients.forEach(el => {
    const newItem = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(newItem);
  })
}

const controlLike = () => {
  if(!state.likes) state.likes = new Likes();

  const {id, title, author, img} = state.recipe;

  if(!state.likes.isLiked(id)){
    const newLike = state.likes.addLike(id, title, author, img);
    likesView.toggleLikeButton(true);
    likesView.renderLike(newLike);
  } else {
    state.likes.deleteLike(id);
    likesView.toggleLikeButton(false);
    likesView.deleteLike(id);
  }
  likesView.toggleLikeMenu(state.likes.getTotalLikes());
}

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
    //console.log(goToPage);
  }
});

const controlRecipe = async () => {
  const id = window.location.hash.replace("#", "");
  // console.log(id);
  if (id) {
    recipeView.clearRecipe();
    renderLoader(elements.recipe);
    
    if(state.search) searchView.highlightSelected(id);

    state.recipe = new Recipe(id);
    //testing
    //window.r = state.recipe;
    try {
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();
      state.recipe.calcServings();
      state.recipe.calcTime();

      clearLoader();
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
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

elements.recipe.addEventListener('click', e=> {
  if(e.target.matches('.btn-decrease, .btn-decrease *')){
    if(state.recipe.servings > 1){
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if(e.target.matches('.btn-increase, .btn-increase *')){
      state.recipe.updateServings('inc');
      recipeView.updateServingsIngredients(state.recipe);
  } else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
      controlList();
  } else if(e.target.matches('.recipe__love, .recipe__love *')){
      controlLike();
  }
})

//window.list = new List();

elements.shoppingList.addEventListener('click', e => {
  const id = e.target.closest('.shopping__item').dataset.itemid;

  if(e.target.matches('.shopping__delete, .shopping__delete *')){
    state.list.deleteItem(id);
    listView.deleteItem(id);
  } else if(e.target.matches('.shopping__count--value')){
    const newCount = parseFloat(e.target.value, 10);
    state.list.updateCount(id,newCount);
  }

});

window.addEventListener('load', () => {
  state.likes = new Likes();
  state.likes.retrieveData();
  likesView.toggleLikeMenu(state.likes.getTotalLikes());
  state.likes.likes.forEach(like => likesView.renderLike(like));
})