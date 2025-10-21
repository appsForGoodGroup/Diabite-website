const header = document.querySelector("header");
const menuBtn = document.getElementById("menu-btn");
const closeBtn = document.getElementById("close-btn");

menuBtn.addEventListener("click", () => {
  header.classList.toggle("show-menu");
});
closeBtn.addEventListener("click", () => {
  menuBtn.click();
});



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
        r.Ingredients.split("',").forEach((i) => {
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