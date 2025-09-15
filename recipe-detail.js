import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD0sXMvHR87u20GyXjQkzY86g7XVMw73GQ",
  authDomain: "mealplan-9fca6.firebaseapp.com",
  projectId: "mealplan-9fca6",
  storageBucket: "mealplan-9fca6.appspot.com",
  messagingSenderId: "487594153255",
  appId: "1:487594153255:web:e3007313257787f95cc502",
  measurementId: "G-0W6857KB92"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get recipe ID and type from URL parameters
function getRecipeParamsFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    id: urlParams.get('id'),
    isCustom: urlParams.get('custom') === 'true'
  };
}

// Load and display recipe details
document.addEventListener("DOMContentLoaded", async () => {
  const { id: recipeId, isCustom } = getRecipeParamsFromUrl();
  const container = document.getElementById("recipeDetail");

  if (!recipeId) {
    container.innerHTML = "<p>No recipe ID provided.</p>";
    return;
  }

  try {
    let recipeData;
    
    if (isCustom) {
      // Load custom recipe from Firebase
      const docRef = doc(db, "customRecipes", recipeId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        container.innerHTML = "<p>Custom recipe not found.</p>";
        return;
      }
      
      recipeData = docSnap.data();
      
      // Create detailed recipe display for custom recipe
      container.innerHTML = `
        <div class="recipe-detail-container">
          <div class="recipe-detail-header">
            <h1>${recipeData.name}</h1>
            <div class="recipe-meta">
              <span class="category">${recipeData.category || 'Custom'}</span>
            </div>
          </div>
          
          <div class="recipe-detail-content">
            <div class="recipe-image">
              <img src="${recipeData.imageUrl || 'https://via.placeholder.com/500x300?text=No+Image'}" alt="${recipeData.name}" style="width: 100%; max-width: 500px; border-radius: 10px;">
            </div>
            
            <div class="recipe-info">
              <h2>Instructions</h2>
              <p class="instructions">${recipeData.instructions}</p>
              
              <h2>Ingredients</h2>
              <div class="ingredients-text">${recipeData.ingredients}</div>
            </div>
          </div>
          
          <div class="recipe-actions">
            <button class="button" onclick="window.history.back()">← Back to Recipes</button>
          </div>
        </div>
      `;
      
    } else {
      // Load public recipe from TheMealDB API
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`);
      const data = await response.json();

      if (!data.meals || data.meals.length === 0) {
        container.innerHTML = "<p>Recipe not found.</p>";
        return;
      }

      const meal = data.meals[0];
      
      // Create detailed recipe display for public recipe
      container.innerHTML = `
        <div class="recipe-detail-container">
          <div class="recipe-detail-header">
            <h1>${meal.strMeal}</h1>
            <div class="recipe-meta">
              <span class="category">${meal.strCategory || 'N/A'}</span>
              <span class="area">${meal.strArea || 'N/A'}</span>
            </div>
          </div>
          
          <div class="recipe-detail-content">
            <div class="recipe-image">
              <img src="${meal.strMealThumb}" alt="${meal.strMeal}" style="width: 100%; max-width: 500px; border-radius: 10px;">
            </div>
            
            <div class="recipe-info">
              <h2>Instructions</h2>
              <p class="instructions">${meal.strInstructions}</p>
              
              <h2>Ingredients</h2>
              <ul class="ingredients-list">
                ${getIngredientsList(meal)}
              </ul>
            </div>
          </div>
          
          <div class="recipe-actions">
            <button class="button" onclick="window.history.back()">← Back to Recipes</button>
          </div>
        </div>
      `;
    }

  } catch (err) {
    console.error("Error loading recipe:", err);
    container.innerHTML = "<p>Failed to load recipe details.</p>";
  }
});

// Helper function to extract ingredients and measures
function getIngredientsList(meal) {
  let ingredientsHtml = '';
  
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    
    if (ingredient && ingredient.trim() !== '') {
      ingredientsHtml += `<li><strong>${measure || ''}</strong> ${ingredient}</li>`;
    }
  }
  
  return ingredientsHtml || '<li>No ingredients listed</li>';
}
