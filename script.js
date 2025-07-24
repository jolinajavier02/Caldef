// Main application logic
class CalorieTracker {
  constructor() {
    this.currentPage = 'setupPage';
    this.userProfile = this.loadUserProfile();
    this.dailyEntries = this.loadDailyEntries();
    this.dailyNotes = this.loadDailyNotes();
    this.targetCalories = this.userProfile.targetCalories || 0;
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initializeTheme();
    this.updateFoodCategoryOptions();
    this.updateUI();
    
    // Show tracker page if user profile exists
    if (this.userProfile.targetCalories) {
      this.showPage('trackerPage');
    }
  }

  setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const page = e.currentTarget.getAttribute('data-page');
        this.showPage(page);
      });
    });

    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    // Language selection
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
      languageSelect.addEventListener('change', (e) => {
        translationManager.setLanguage(e.target.value);
        this.updateFoodCategoryOptions();
      });
    }

    // Setup form
    const setupForm = document.getElementById('setupForm');
    if (setupForm) {
      setupForm.addEventListener('submit', (e) => this.handleSetupSubmit(e));
    }

    // Weight unit synchronization
    const weightUnit = document.getElementById('weightUnit');
    const targetWeightUnit = document.getElementById('targetWeightUnit');
    if (weightUnit && targetWeightUnit) {
      weightUnit.addEventListener('change', (e) => {
        targetWeightUnit.textContent = e.target.value;
      });
    }

    // Food form
    const foodForm = document.getElementById('foodForm');
    if (foodForm) {
      foodForm.addEventListener('submit', (e) => this.handleFoodSubmit(e));
    }

    // Food category change
    const foodCategory = document.getElementById('foodCategory');
    if (foodCategory) {
      foodCategory.addEventListener('change', (e) => this.updateSpecificTypes(e.target.value));
    }

    // Food type change for recipe display
    const specificType = document.getElementById('specificType');
    if (specificType) {
      specificType.addEventListener('change', (e) => this.displayRecipe(e.target.value));
    }

    // Notes saving
    const saveNotesBtn = document.getElementById('saveNotes');
    if (saveNotesBtn) {
      saveNotesBtn.addEventListener('click', () => this.saveNotes());
    }

    // Load saved notes
    const dailyNotesTextarea = document.getElementById('dailyNotes');
    if (dailyNotesTextarea) {
      dailyNotesTextarea.value = this.dailyNotes;
    }
  }

  // Page navigation
  showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
      page.classList.remove('active');
    });

    // Show selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
      targetPage.classList.add('active');
      this.currentPage = pageId;
    }

    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('data-page') === pageId) {
        item.classList.add('active');
      }
    });
  }

  // Theme management
  initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.setTheme(savedTheme);
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      const icon = themeToggle.querySelector('i');
      if (icon) {
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
      }
    }
  }

  // Setup form handling
  handleSetupSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const profile = {
      gender: document.getElementById('gender').value,
      age: parseInt(document.getElementById('age').value),
      height: parseFloat(document.getElementById('height').value),
      heightUnit: document.getElementById('heightUnit').value,
      currentWeight: parseFloat(document.getElementById('currentWeight').value),
      targetWeight: parseFloat(document.getElementById('targetWeight').value),
      weightUnit: document.getElementById('weightUnit').value,
      activityLevel: parseFloat(document.getElementById('activityLevel').value)
    };

    // Calculate BMR and daily calories
    const bmr = this.calculateBMR(profile);
    const dailyCalories = Math.round(bmr * profile.activityLevel);
    
    // Adjust for weight goal (deficit/surplus)
    const currentWeightKg = this.convertToKg(profile.currentWeight, profile.weightUnit);
    const targetWeightKg = this.convertToKg(profile.targetWeight, profile.weightUnit);
    const weightDifference = targetWeightKg - currentWeightKg;
    
    // Adjust calories based on goal (roughly 500 cal deficit/surplus per 0.5kg per week)
    let targetCalories = dailyCalories;
    if (weightDifference < 0) {
      // Weight loss: create deficit
      targetCalories = dailyCalories - 500;
    } else if (weightDifference > 0) {
      // Weight gain: create surplus
      targetCalories = dailyCalories + 300;
    }

    profile.bmr = bmr;
    profile.dailyCalories = dailyCalories;
    profile.targetCalories = Math.max(targetCalories, 1200); // Minimum safe calories
    
    this.userProfile = profile;
    this.targetCalories = profile.targetCalories;
    this.saveUserProfile();
    
    this.showNotification(translationManager.translate('goal_calculated'));
    this.showPage('trackerPage');
    this.updateUI();
  }

  // BMR calculation using Mifflin-St Jeor equation
  calculateBMR(profile) {
    const weightKg = this.convertToKg(profile.currentWeight, profile.weightUnit);
    const heightCm = this.convertToCm(profile.height, profile.heightUnit);
    
    let bmr;
    if (profile.gender === 'male') {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * profile.age + 5;
    } else {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * profile.age - 161;
    }
    
    return Math.round(bmr);
  }

  convertToKg(weight, unit) {
    return unit === 'lbs' ? weight * 0.453592 : weight;
  }

  convertToCm(height, unit) {
    return unit === 'in' ? height * 2.54 : height;
  }

  // Food tracking
  updateFoodCategoryOptions() {
    const foodCategory = document.getElementById('foodCategory');
    if (!foodCategory) return;

    // Clear existing options
    foodCategory.innerHTML = '<option value="">' + translationManager.translate('select_option') + '</option>';

    // Add translated category options
    FoodCalculator.getAllCategories().forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = translationManager.translate(category);
      foodCategory.appendChild(option);
    });
  }

  updateSpecificTypes(category) {
    const specificType = document.getElementById('specificType');
    if (!specificType) return;

    specificType.innerHTML = '';
    
    if (!category) {
      const option = document.createElement('option');
      option.value = '';
      option.textContent = translationManager.translate('select_category_first');
      specificType.appendChild(option);
      return;
    }

    const types = FoodCalculator.getFoodTypes(category);
    Object.keys(types).forEach(typeKey => {
      const option = document.createElement('option');
      option.value = typeKey;
      option.textContent = types[typeKey].name;
      specificType.appendChild(option);
    });
    
    // Clear recipe display when category changes
    this.displayRecipe('');
  }

  // Display recipe for selected food
  displayRecipe(foodType) {
    const categorySelect = document.getElementById('foodCategory');
    const selectedCategory = categorySelect.value;
    const recipeContainer = document.getElementById('recipeDisplay') || this.createRecipeContainer();
    
    if (selectedCategory && foodType && FoodCalculator.getFoodTypes(selectedCategory)[foodType]) {
      const foodItem = FoodCalculator.getFoodTypes(selectedCategory)[foodType];
      if (foodItem.recipe) {
        recipeContainer.innerHTML = `
          <div style="margin-top: 1rem; padding: 1rem; background: var(--bg-secondary); border-radius: var(--border-radius); border-left: 4px solid var(--primary-color);">
            <h4 style="margin: 0 0 0.5rem 0; color: var(--primary-color);">📝 Recipe</h4>
            <p style="margin: 0; font-size: 0.875rem; line-height: 1.4;">${foodItem.recipe}</p>
          </div>
        `;
        recipeContainer.style.display = 'block';
      } else {
        recipeContainer.style.display = 'none';
      }
    } else {
      recipeContainer.style.display = 'none';
    }
  }

  // Create recipe container if it doesn't exist
  createRecipeContainer() {
    const foodEntryCard = document.querySelector('.food-entry-card');
    if (!foodEntryCard) return null;
    
    const recipeContainer = document.createElement('div');
    recipeContainer.id = 'recipeDisplay';
    recipeContainer.style.display = 'none';
    foodEntryCard.appendChild(recipeContainer);
    return recipeContainer;
  }

  handleFoodSubmit(e) {
    e.preventDefault();
    
    const mealType = document.getElementById('mealType').value;
    const foodCategory = document.getElementById('foodCategory').value;
    const specificType = document.getElementById('specificType').value;
    const quantity = parseFloat(document.getElementById('quantity').value);
    const unit = document.getElementById('unit').value;

    if (!foodCategory || !specificType || !quantity) {
      return;
    }

    const calories = FoodCalculator.getCalories(foodCategory, specificType, quantity, unit);
    const foodName = FoodCalculator.getFoodName(foodCategory, specificType);
    
    const entry = {
      id: Date.now(),
      mealType,
      foodCategory,
      specificType,
      foodName,
      quantity,
      unit,
      calories,
      timestamp: new Date().toISOString()
    };

    this.dailyEntries.push(entry);
    this.saveDailyEntries();
    this.updateUI();
    
    // Reset form
    e.target.reset();
    document.getElementById('specificType').innerHTML = '<option value="">' + 
      translationManager.translate('select_category_first') + '</option>';
    
    this.showNotification(translationManager.translate('entry_added'));
  }

  deleteEntry(entryId) {
    this.dailyEntries = this.dailyEntries.filter(entry => entry.id !== entryId);
    this.saveDailyEntries();
    this.updateUI();
    this.showNotification(translationManager.translate('entry_deleted'));
  }

  // UI Updates
  updateUI() {
    this.updateDailySummary();
    this.updateFoodLog();
  }

  updateDailySummary() {
    const targetCaloriesEl = document.getElementById('targetCalories');
    const consumedCaloriesEl = document.getElementById('consumedCalories');
    const remainingCaloriesEl = document.getElementById('remainingCalories');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');

    if (!targetCaloriesEl) return;

    const totalConsumed = this.dailyEntries.reduce((sum, entry) => sum + entry.calories, 0);
    const remaining = this.targetCalories - totalConsumed;
    const percentage = Math.min((totalConsumed / this.targetCalories) * 100, 100);

    targetCaloriesEl.textContent = this.targetCalories;
    consumedCaloriesEl.textContent = totalConsumed;
    remainingCaloriesEl.textContent = Math.max(remaining, 0);
    
    if (progressFill) {
      progressFill.style.width = percentage + '%';
      
      // Update progress bar color based on status
      progressFill.className = 'progress-fill';
      if (percentage < 80) {
        progressFill.classList.add('under-target');
      } else if (percentage <= 110) {
        progressFill.classList.add('on-target');
      } else {
        progressFill.classList.add('over-target');
      }
    }
    
    if (progressText) {
      progressText.textContent = Math.round(percentage) + '%';
    }
  }

  updateFoodLog() {
    const foodEntriesContainer = document.getElementById('foodEntries');
    if (!foodEntriesContainer) return;

    if (this.dailyEntries.length === 0) {
      foodEntriesContainer.innerHTML = `
        <div class="no-entries">
          <p>${translationManager.translate('no_entries')}</p>
        </div>
      `;
      return;
    }

    // Group entries by meal type
    const groupedEntries = this.groupEntriesByMeal();
    
    foodEntriesContainer.innerHTML = '';
    
    Object.keys(groupedEntries).forEach(mealType => {
      const entries = groupedEntries[mealType];
      const totalCalories = entries.reduce((sum, entry) => sum + entry.calories, 0);
      
      const mealGroup = document.createElement('div');
      mealGroup.className = 'meal-group';
      
      mealGroup.innerHTML = `
        <div class="meal-header">
          <span>${translationManager.translate(mealType)}</span>
          <span>${totalCalories} ${translationManager.translate('calories')}</span>
        </div>
        <div class="meal-items">
          ${entries.map(entry => this.createFoodItemHTML(entry)).join('')}
        </div>
      `;
      
      foodEntriesContainer.appendChild(mealGroup);
    });

    // Add delete event listeners
    foodEntriesContainer.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const entryId = parseInt(e.target.getAttribute('data-id'));
        this.deleteEntry(entryId);
      });
    });
  }

  groupEntriesByMeal() {
    const grouped = {};
    
    this.dailyEntries.forEach(entry => {
      if (!grouped[entry.mealType]) {
        grouped[entry.mealType] = [];
      }
      grouped[entry.mealType].push(entry);
    });
    
    return grouped;
  }

  createFoodItemHTML(entry) {
    return `
      <div class="food-item">
        <div class="food-details">
          <div class="food-name">${entry.foodName}</div>
          <div class="food-quantity">${entry.quantity} ${entry.unit}</div>
        </div>
        <div class="food-calories">${entry.calories} cal</div>
        <button class="delete-btn" data-id="${entry.id}" title="${translationManager.translate('delete')}">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
  }

  // Notes management
  saveNotes() {
    const notesTextarea = document.getElementById('dailyNotes');
    if (notesTextarea) {
      this.dailyNotes = notesTextarea.value;
      localStorage.setItem('dailyNotes_' + this.getTodayKey(), this.dailyNotes);
      
      // Also save to notes history
      const today = this.getTodayKey();
      let notesHistory = JSON.parse(localStorage.getItem('notesHistory')) || {};
      notesHistory[today] = this.dailyNotes;
      localStorage.setItem('notesHistory', JSON.stringify(notesHistory));
      
      this.showNotification(translationManager.translate('notes_saved'));
    }
  }

  // Show notes history
  showNotesHistory() {
    const notesHistory = JSON.parse(localStorage.getItem('notesHistory')) || {};
    const historyEntries = Object.entries(notesHistory)
      .sort(([a], [b]) => new Date(b) - new Date(a))
      .slice(0, 10); // Show last 10 entries
    
    let historyHtml = '<div class="notes-history-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center;">';
    historyHtml += '<div style="background: var(--bg-primary); padding: 2rem; border-radius: var(--border-radius); max-width: 500px; max-height: 80vh; overflow-y: auto; width: 90%;">';
    historyHtml += '<h3>Notes History</h3>';
    
    if (historyEntries.length === 0) {
      historyHtml += '<p>No notes history found.</p>';
    } else {
      historyEntries.forEach(([date, notes]) => {
        const formattedDate = new Date(date).toLocaleDateString();
        historyHtml += `<div style="margin-bottom: 1rem; padding: 1rem; background: var(--bg-secondary); border-radius: var(--border-radius);">`;
        historyHtml += `<strong>${formattedDate}</strong><br>`;
        historyHtml += `<p style="margin-top: 0.5rem;">${notes || 'No notes for this day'}</p>`;
        historyHtml += '</div>';
      });
    }
    
    historyHtml += '<button onclick="document.querySelector(\'.notes-history-modal\').remove()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: var(--primary-color); color: white; border: none; border-radius: var(--border-radius); cursor: pointer;">Close</button>';
    historyHtml += '</div></div>';
    
    document.body.insertAdjacentHTML('beforeend', historyHtml);
  }

  // Data persistence
  saveUserProfile() {
    localStorage.setItem('userProfile', JSON.stringify(this.userProfile));
  }

  loadUserProfile() {
    const saved = localStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : {};
  }

  saveDailyEntries() {
    localStorage.setItem('dailyEntries_' + this.getTodayKey(), JSON.stringify(this.dailyEntries));
  }

  loadDailyEntries() {
    const saved = localStorage.getItem('dailyEntries_' + this.getTodayKey());
    return saved ? JSON.parse(saved) : [];
  }

  loadDailyNotes() {
    return localStorage.getItem('dailyNotes_' + this.getTodayKey()) || '';
  }

  getTodayKey() {
    return new Date().toISOString().split('T')[0];
  }

  // Notifications
  showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background-color: var(--success-color);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-lg);
      z-index: 1000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  // Export data to CSV
  exportToCSV() {
    const headers = ['Date', 'Meal Type', 'Food', 'Quantity', 'Unit', 'Calories'];
    const rows = this.dailyEntries.map(entry => [
      new Date(entry.timestamp).toLocaleDateString(),
      entry.mealType,
      entry.foodName,
      entry.quantity,
      entry.unit,
      entry.calories
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calorie-log-${this.getTodayKey()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.calorieTracker = new CalorieTracker();
});

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}