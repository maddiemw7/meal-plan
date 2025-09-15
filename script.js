import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// Firebase config (optional)
const firebaseConfig = {
  apiKey: "AIzaSyD0sXMvHR87u20GyXjQkzY86g7XVMw73GQ",
  authDomain: "mealplan-9fca6.firebaseapp.com",
  projectId: "mealplan-9fca6",
  storageBucket: "mealplan-9fca6.appspot.com",
  messagingSenderId: "487594153255",
  appId: "1:487594153255:web:e3007313257787f95cc502",
  measurementId: "G-0W6857KB92"
};

// firebase initialize
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Load custom recipes from Firebase
async function loadCustomRecipes() {
  const container = document.getElementById("customRecipes");
  
  try {
    const recipesQuery = query(collection(db, "customRecipes"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(recipesQuery);
    
    container.innerHTML = ""; // Clear loading text
    
    if (querySnapshot.empty) {
      container.innerHTML = "<p>No custom recipes yet. Add your first recipe above!</p>";
      return;
    }
    
    querySnapshot.forEach((doc) => {
      const recipe = doc.data();
      const card = document.createElement("div");
      card.className = "recipe-card custom-recipe";
      card.innerHTML = `
        <img src="${recipe.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}" alt="${recipe.name}">
        <h3>${recipe.name}</h3>
        <div class="details">
          <p><strong>Category:</strong> ${recipe.category || 'N/A'}</p>
          <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
          <p><strong>Instructions:</strong> ${recipe.instructions}</p>
        </div>
      `;
      
      // Navigate to recipe detail page on click
      card.addEventListener("click", () => {
        window.location.href = `recipe-detail.html?custom=true&id=${doc.id}`;
      });
      
      container.appendChild(card);
    });
    
  } catch (err) {
    console.error("Error loading custom recipes:", err);
    container.innerHTML = "<p>Failed to load custom recipes.</p>";
  }
}

// Handle form submission for adding custom recipes
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("addRecipeForm");
  
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const recipeData = {
      name: formData.get("name"),
      category: formData.get("category") || "Custom",
      imageUrl: formData.get("imageUrl") || "",
      ingredients: formData.get("ingredients"),
      instructions: formData.get("instructions"),
      createdAt: new Date()
    };
    
    try {
      await addDoc(collection(db, "customRecipes"), recipeData);
      form.reset();
      alert("Recipe added successfully!");
      loadCustomRecipes(); // Reload the custom recipes
    } catch (error) {
      console.error("Error adding recipe:", error);
      alert("Failed to add recipe. Please try again.");
    }
  });
  
  // Load both public and custom recipes
  loadPublicRecipes();
  loadCustomRecipes();
});

// Load public recipes from TheMealDB API
async function loadPublicRecipes() {
  const container = document.getElementById("publicRecipes");

  try {
    const response = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=chicken");
    const data = await response.json();

    container.innerHTML = ""; // clear loading text

    if (!data.meals) {
      container.innerHTML = "<p>No recipes found.</p>";
      return;
    }

    data.meals.forEach(meal => {
      const card = document.createElement("div");
      card.className = "recipe-card";
      card.innerHTML = `
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <h3>${meal.strMeal}</h3>
        <div class="details">
          <p><strong>Category:</strong> ${meal.strCategory || 'N/A'}</p>
          <p><strong>Area:</strong> ${meal.strArea || 'N/A'}</p>
          <p><strong>Instructions:</strong> ${meal.strInstructions}</p>
        </div>
      `;

      // Navigate to recipe detail page on click
      card.addEventListener("click", () => {
        window.location.href = `recipe-detail.html?id=${meal.idMeal}`;
      });

      container.appendChild(card);
    });

  } catch (err) {
    console.error("Error loading recipes:", err);
    container.innerHTML = "<p>Failed to load recipes.</p>";
  }
}