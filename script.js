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

let ingredientsList = [];
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

  // Merge new items into ingredientsList (dedupe, case-insensitive)
  newItems.forEach((item) => {
    const exists = ingredientsList.some(
      (i) => i.toLowerCase() === item.toLowerCase()
    );
    if (!exists) ingredientsList.push(item);
  });

  // Persist and render
  localStorage.setItem("userIngredients", JSON.stringify(ingredientsList));
  console.log("User Ingredients:", ingredientsList);

  // Ensure the UI elements exist
  const inactiveP = document.querySelector(".add-ingredients .inactive");
  const ingredientsUl = document.querySelector(".ingredients-list");
  if (inactiveP) inactiveP.classList.remove("inactive");
  if (!ingredientsUl) return;

  // Clear any existing list to avoid duplicates, then render
  ingredientsUl.innerHTML = "";
  ingredientsList.forEach((it) => {
    const li = document.createElement("li");
    li.textContent = it;
    ingredientsUl.appendChild(li);
  });
}

// On load, populate ingredients from localStorage if present
function loadSavedIngredients() {
  const saved = localStorage.getItem("userIngredients");
  if (!saved) return;
  let ingredientsList;
  try {
    ingredientsList = JSON.parse(saved);
  } catch (e) {
    console.error("Failed to parse saved ingredients", e);
    return;
  }

  const inactiveP = document.querySelector(".add-ingredients .inactive");
  const ingredientsUl = document.querySelector(".ingredients-list");
  if (inactiveP) inactiveP.classList.remove("inactive");
  if (!ingredientsUl) return;

  ingredientsUl.innerHTML = "";
  ingredientsList.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    ingredientsUl.appendChild(li);
  });
}

// Run on page load
document.addEventListener("DOMContentLoaded", () => {
  loadSavedIngredients();
});

function clearIngredients() {
  if (
    !confirm()) return;
  localStorage.removeItem("userIngredients");
  ingredientsList = [];
  const ingredientsUl = document.querySelector(".ingredients-list");
  if (ingredientsUl) ingredientsUl.innerHTML = "";
  const inactiveP = document.querySelector(".add-ingredients .toggle");
  if (inactiveP) inactiveP.classList.add("inactive");
}

//search
let recipes = [];

fetch("recipes/recipes.json")
  .then((res) => res.json())
  .then((data) => {
    recipes = data;
    console.log("Loaded recipes:", recipes.length);
  });

document
  .querySelector(".searchbar")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const searchTerm = document.querySelector(".search-input").value;
    let results;

    if (searchTerm) {
      results = recipes.filter((r) =>
        r.Title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      console.log(results);
    }

    const cardHolder = document.querySelector(".result-holder");
    cardHolder.innerHTML = "";
    results.forEach((r) => {
      let ingredientsList = "<ul>";

      if (Array.isArray(r.Ingredients)) {
        r.Ingredients.forEach((i) => {
          ingredientsList += `<li>${i.replace(/^\[|'|\]$/g, "").trim()}</li>`;
        });
      } else if (typeof r.Ingredients === "string") {
        r.Ingredients.split(",").forEach((i) => {
          ingredientsList += `<li>${i.replace(/^\[|'|\]$/g, "").trim()}</li>`;
        });
      }

      ingredientsList += "</ul>";
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
    <div class="container">
      <h4><b>${r.Title}</b></h4>
      <b>Ingredients:</b> ${ingredientsList}
      <p><b>Instructions:</b> ${r.Instructions}</p>
    </div>
  `;
      cardHolder.appendChild(card);
    });
  });
