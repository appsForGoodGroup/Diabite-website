const header = document.querySelector("header");
const menuBtn = document.getElementById("menu-btn");
const closeBtn = document.getElementById("close-btn");

menuBtn.addEventListener("click", () => {
  header.classList.toggle("show-menu");
});
closeBtn.addEventListener("click", () => {
  menuBtn.click();
});

//Ingredients Pop Up
// Keep a global ingredients list available on window for other scripts / console
window.ingredientsList = window.ingredientsList || [];
let ingredientsList = window.ingredientsList;
function IngredientsPopUp() {
  const input = prompt(
    "Please enter the ingredients you have at home, separated by commas. For example: eggs, milk, bread"
  );
  if (!input) return;
  alert(
    "Thank you! We will now generate a meal plan based on your ingredients."
  );

  // Parse input into array of trimmed, non-empty items
  const newItems = input
    .split(",")
    .map((i) => i.trim())
    .filter((i) => i.length > 0);

  // Load existing saved ingredients into the global ingredientsList if present
  const saved = localStorage.getItem("userIngredients");
  if (saved) {
    try {
      ingredientsList = JSON.parse(saved) || [];
    } catch (e) {
      console.error("Failed to parse saved ingredients", e);
      ingredientsList = [];
    }
  }

  // Merge new items into ingredientsList
  newItems.forEach((item) => {
    const exists = ingredientsList.some(
      (i) => i.toLowerCase() === item.toLowerCase()
    );
    if (!exists) ingredientsList.push(item);
  });

  // Ensure the global copy is updated and persist
  window.ingredientsList = ingredientsList;
  localStorage.setItem("userIngredients", JSON.stringify(ingredientsList));
  console.log("User Ingredients:", ingredientsList);

  const inactiveP = document.querySelector(".add-ingredients .inactive");
  const ingredientsUl = document.querySelector(".ingredients-list");
  if (inactiveP) inactiveP.classList.remove("inactive");
  if (!ingredientsUl) return;

  ingredientsUl.innerHTML = "";
  ingredientsList.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    li.classList.add("ingredient-item");
    ingredientsUl.appendChild(li);
  });
  if (typeof runMatchingAndLog === "function") runMatchingAndLog();
}

function loadSavedIngredients() {
  const saved = localStorage.getItem("userIngredients");
  if (!saved) return;
  let parsed;
  try {
    parsed = JSON.parse(saved);
  } catch (e) {
    console.error("Failed to parse saved ingredients", e);
    return;
  }

  // Update the global ingredients list so other scripts see it
  window.ingredientsList = Array.isArray(parsed) ? parsed : [];
  ingredientsList = window.ingredientsList;

  const inactiveP = document.querySelector(".add-ingredients .inactive");
  const ingredientsUl = document.querySelector(".ingredients-list");
  if (inactiveP) inactiveP.classList.remove("inactive");
  if (!ingredientsUl) return;

  ingredientsUl.innerHTML = "";
  ingredientsList.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    li.classList.add("ingredient-item");
    ingredientsUl.appendChild(li);
  });
  // Run matching after loading saved ingredients
  if (typeof runMatchingAndLog === "function") runMatchingAndLog();
}

// Run on page load
document.addEventListener("DOMContentLoaded", () => {
  loadSavedIngredients();
});

function clearIngredients() {
  if (!confirm()) return;
  localStorage.removeItem("userIngredients");
  ingredientsList = [];
  const ingredientsUl = document.querySelector(".ingredients-list");
  if (ingredientsUl) ingredientsUl.innerHTML = "";
  const inactiveP = document.querySelector(".add-ingredients .toggle");
  if (inactiveP) inactiveP.classList.add("inactive");
  if (typeof runMatchingAndLog === "function") runMatchingAndLog();
}

document
  .querySelector(".ingredients-list")
  .addEventListener("click", removeOneIngredient);

function removeOneIngredient(e) {
  if (e.target.classList.contains("ingredient-item")) {
    let item = e.target;
    let text = item.textContent;
    console.log("Removing ingredient:", text);
    ingredientsList.splice(ingredientsList.indexOf(text), 1);
    console.log(ingredientsList);
    item.remove();
    localStorage.setItem("userIngredients", JSON.stringify(ingredientsList));
    const ingredientsUl = document.querySelector(".ingredients-list");
    if (ingredientsUl) ingredientsUl.innerHTML = "";
    loadSavedIngredients();
    if (typeof runMatchingAndLog === "function") runMatchingAndLog();
  }
}

//matching algorithm
// Helper: normalize an ingredient string (remove brackets/quotes, lowercase, trim)
function normalizeIngredient(str) {
  if (!str) return "";
  return str
    .replace(/^[\[\]\"]+/g, "")
    .replace(/[\[\]\"]+$/g, "")
    .replace(/'/g, "")
    .toLowerCase()
    .trim();
}

//matching algorithm
function findMatchingRecipes(userIngredients, allRecipes) {
  if (!Array.isArray(userIngredients) || !Array.isArray(allRecipes)) return [];

  // Normalize user ingredients once
  const userSet = new Set(
    userIngredients.map((u) => normalizeIngredient(u)).filter((x) => x)
  );

  const matches = allRecipes.filter((recipe) => {
    if (!recipe || !recipe.Ingredients) return false; // Skip if no ingredients listed

    // Get recipe ingredients as array of normalized strings
    let rIngredients = [];
    if (Array.isArray(recipe.Ingredients)) {
      rIngredients = recipe.Ingredients.map((i) => normalizeIngredient(i));
    } else if (typeof recipe.Ingredients === "string") {
      rIngredients = recipe.Ingredients.split(",").map((i) =>
        normalizeIngredient(i)
      );
    }

    // A match when every recipe ingredient exists in userSet
    return (
      rIngredients.length > 0 && rIngredients.every((ri) => userSet.has(ri))
    );
  });

  return matches;
}

// Run matching and log results (exposed for external use)
function runMatchingAndLog() {
  try {
    const matches = findMatchingRecipes(
      window.ingredientsList || [],
      window.recipes || []
    );
    console.log("Matched recipes:", matches);
    return matches;
  } catch (e) {
    console.error("Error running matching:", e);
    return [];
  }
}

// expose function
window.findMatchingRecipes = findMatchingRecipes;
window.runMatchingAndLog = runMatchingAndLog;

//search
// Keep recipes global as well so other scripts can access them
window.recipes = window.recipes || [];
let recipes = window.recipes;

fetch("recipes/recipes.json")
  .then((res) => res.json())
  .then((data) => {
    // update global recipes reference and run matching
    window.recipes = data;
    recipes = window.recipes;
    console.log("Loaded recipes:", recipes.length);
    if (typeof runMatchingAndLog === "function") runMatchingAndLog();
    console.log(ingredientsList);
    console.log(recipes);
  });