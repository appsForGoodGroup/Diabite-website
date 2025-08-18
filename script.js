let recipes = [];

    fetch("recipes/recipes.json")
      .then((res) => res.json())
      .then((data) => {
        recipes = data;
        console.log("Loaded recipes:", recipes.length);
      });

document.querySelector(".searchbar").addEventListener("submit", function (event) {
    event.preventDefault();
    const searchTerm = document.querySelector(".search-input").value;
    let results;

    if (searchTerm) {
        results = recipes.filter(r => r.Title.toLowerCase().includes(searchTerm.toLowerCase()));
        console.log(results);
    }

    const cardHolder = document.querySelector(".result-holder");
    cardHolder.innerHTML = "";
    results.forEach(r => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
    <div class="container">
      <h4><b>${r.Title}</b></h4>
      <p><b>Ingredients:</b> ${r.Ingredients}</p>
      <p><b>Instructions:</b> ${r.Instructions}</p>
    </div>
  `;
  cardHolder.appendChild(card);
});

  });
