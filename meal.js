// ----------------------
// Page Initialization
// ----------------------
document.addEventListener('DOMContentLoaded', function() {
    // Load saved meal plan when page loads
    loadMealPlan();
    
    // Add event listeners for all inputs
    const mealInputs = document.querySelectorAll('.meal-input');
    mealInputs.forEach(input => {
        input.addEventListener('input', saveMealPlan);
        input.addEventListener('blur', saveMealPlan);
    });

    // Save button 
    const saveBtn = document.getElementById('saveMealPlan');
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            saveMealPlan();
            showNotification('💾 Meal plan saved!', 'success');
        });
    }

    // Clear button (if exists)
    const clearBtn = document.getElementById('clearMealPlan');
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to clear all? This cannot be undone.')) {
                clearMealPlan();
                showNotification('🗑️ All cleared!', 'info');
            }
        });
    }

    // Notes support (if notesArea exists)
    const notesArea = document.getElementById('notesArea');
    if (notesArea) {
        notesArea.addEventListener('input', function() {
            localStorage.setItem('mealPlanNotes', this.value);
        });

        const savedNotes = localStorage.getItem('mealPlanNotes');
        if (savedNotes) {
            notesArea.value = savedNotes;
        }
    }
});


// ----------------------
// Save & Load Functions
// ----------------------
function saveMealPlan() {
    const mealPlan = {};
    const mealInputs = document.querySelectorAll('.meal-input');
    
    mealInputs.forEach(input => {
        const day = input.dataset.day;
        const meal = input.dataset.meal;

        if (!mealPlan[day]) {
            mealPlan[day] = {};
        }
        mealPlan[day][meal] = input.value;
    });

    localStorage.setItem('mealPlan', JSON.stringify(mealPlan));
}

function loadMealPlan() {
    const savedMealPlan = localStorage.getItem('mealPlan');
    if (savedMealPlan) {
        const mealPlan = JSON.parse(savedMealPlan);

        Object.keys(mealPlan).forEach(day => {
            Object.keys(mealPlan[day]).forEach(meal => {
                const input = document.querySelector(`[data-day="${day}"][data-meal="${meal}"]`);
                if (input) {
                    input.value = mealPlan[day][meal];
                }
            });
        });
    }
}

function clearMealPlan() {
    const mealInputs = document.querySelectorAll('.meal-input');
    mealInputs.forEach(input => {
        input.value = '';
    });

    localStorage.removeItem('mealPlan');
    localStorage.removeItem('mealPlanNotes');

    const notesArea = document.getElementById('notesArea');
    if (notesArea) notesArea.value = '';
}


// ----------------------
// Notifications
// ----------------------
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
        ${type === 'success' ? 'background-color: navy;' : ''}
        ${type === 'info' ? 'background-color: #2196F3;' : ''}
        ${type === 'error' ? 'background-color: navy;' : ''}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 100);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}


// ----------------------
// Keyboard Shortcuts
// ----------------------
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveMealPlan();
        showNotification('💾 Meal plan saved!', 'success');
    }
});
