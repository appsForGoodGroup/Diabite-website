import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCRkAPdVFibsd2ZhWA-imn68qggH0NVdMA",
    authDomain: "diabite-42b51.firebaseapp.com",
    projectId: "diabite-42b51",
    storageBucket: "diabite-42b51.appspot.com",
    messagingSenderId: "1048048222722",
    appId: "1:1048048222722:web:9d30ff38e4f83e4e0d1d1b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.makeAPopUp = function () {
    const name = prompt("Please enter a recipe name:");
    if (!name) return;

    const ingredients = prompt("Enter ingredients (comma separated):");
    if (!ingredients) return;

    const instructions = prompt("Enter instructions:");
    if (!instructions) return;

    const tags = prompt("Enter tags (comma separated):");
    if (!tags) return;
    const estimatedSugar = prompt("Enter estimated sugar content (in grams):");

    const publication = confirm("Do you want to publish this recipe?");
    const recipe = {
        name: name,
        ingredients: ingredients.split(',').map(i => i.trim()),
        instructions: instructions,
        tags: tags.split(',').map(t => t.trim()),
        publication: publication,
        sugar: estimatedSugar ? parseFloat(estimatedSugar) : 0,
        createdAt: new Date()
    };

    console.log("Uploading recipe:", recipe);
    uploadRecipe(recipe);
};


async function uploadRecipe(recipe) {
    try {
        await addDoc(collection(db, "recipes"), recipe);
        console.log("Recipe successfully uploaded!");
    } catch (error) {
        console.error("Error uploading recipe:", error);
    }
}
