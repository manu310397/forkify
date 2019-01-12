import axios from "axios";

import { key, proxy } from "../config";

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const res = await axios(
        `${proxy}http://food2fork.com/api/get?key=${key}&rId=${this.id}`
      );
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.image = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;
      console.log("Ingredients");
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  }

  calcTime() {
    const numIng = this.ingredients.length;
    const periods = Math.ceil(numIng / 3);
    this.time = periods * 15;
  }

  calcServings() {
    this.servings = 4;
  }

  parseIngredients() {
    const unitsLong = [
      "tablespoons",
      "tablespoon",
      "ounces",
      "ounce",
      "teaspoons",
      "teaspoon",
      "cups",
      "pounds"
    ];
    const unitsShort = [
      "tbsp",
      "tbsp",
      "oz",
      "oz",
      "tsp",
      "tsp",
      "cup",
      "pound"
    ];

    const newIngredients = this.ingredients.map(ingredient => {
      let newIngredient = ingredient.toLowerCase();
      console.log(newIngredient);
      unitsLong.forEach((unitLong, i) => {
        newIngredient = newIngredient.replace(unitLong, unitsShort[i]);
      });

      //remove parenthisis
      newIngredient = newIngredient.replace(/ *\([^)]*\) */g, " ");

      const arrIng = newIngredient.split(" ");
      const unitIndex = arrIng.findIndex(el2 => unitsShort.includes(el2));

      let objIngredient = {};
      if (unitIndex > -1) {
        const arrCount = arrIng.slice(0, unitIndex);
        let count;
        if (arrCount.length === 1) {
          count = eval(arrIng[0].replace("-", "+"));
        } else {
          count = eval(arrIng.slice(0, 2).join("+"));
        }

        objIngredient = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(" ")
        };
      } else if (parseInt(arrIng[0])) {
        //no unit but 1st element is number
        objIngredient = {
          count: parseInt(arrIng[0]),
          unit: "",
          newIngredient: arrIng.slice(1).join(" ")
        };
      } else if (unitIndex == -1) {
        //no unit and no number
        objIngredient = {
          count: 1,
          unit: "",
          newIngredient
        };
      }
      console.log(objIngredient);
      return objIngredient;
    });

    this.ingredients = newIngredients;
  }
}
