// Main application logic
class CalorieTracker {
  constructor() {
    this.currentPage = 'setupPage';
    this.currentProfileKey = localStorage.getItem('currentProfileKey') || null;
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
    this.updateLanguage();
    this.updateUI();
    this.displayExistingProfiles();
    
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
        this.updateLanguage();
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

    // Profile management event listeners
    const createNewProfileBtn = document.getElementById('createNewProfileBtn');
    if (createNewProfileBtn) {
      createNewProfileBtn.addEventListener('click', () => this.handleCreateNewProfile());
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

  // Profile management
  generateProfileKey(formData) {
    // Create a unique key based on user details
    const keyData = {
      name: formData.name.toLowerCase().trim(),
      gender: formData.gender,
      age: formData.age,
      height: formData.height,
      heightUnit: formData.heightUnit,
      currentWeight: formData.currentWeight,
      weightUnit: formData.weightUnit
    };
    
    // Create a hash-like string from the key data
    const keyString = JSON.stringify(keyData);
    let hash = 0;
    for (let i = 0; i < keyString.length; i++) {
      const char = keyString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return `profile_${Math.abs(hash)}`;
  }

  findExistingProfile(profileKey) {
    const profileData = localStorage.getItem(profileKey);
    return profileData ? JSON.parse(profileData) : null;
  }

  getAllProfiles() {
    const profiles = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('profile_') && !key.includes('_entries_') && !key.includes('_notes_')) {
        try {
          const profile = JSON.parse(localStorage.getItem(key));
          profiles.push({ key, profile });
        } catch (e) {
          // Skip invalid profiles
        }
      }
    }
    return profiles;
  }

  switchToProfile(profileKey) {
    this.currentProfileKey = profileKey;
    localStorage.setItem('currentProfileKey', profileKey);
    this.userProfile = this.loadUserProfile();
    this.dailyEntries = this.loadDailyEntries();
    this.dailyNotes = this.loadDailyNotes();
    this.targetCalories = this.userProfile.targetCalories || 0;
    this.updateUI();
  }

  // Display existing profiles on the setup page
    displayExistingProfiles() {
        const profiles = this.getAllProfiles();
        const profileList = document.getElementById('profileList');
        const profileSection = document.getElementById('profileSection');
        
        if (profiles.length > 0) {
            profileSection.style.display = 'block';
            profileList.innerHTML = '';
            
            profiles.forEach(({ key, profile }) => {
                const profileItem = document.createElement('div');
                profileItem.className = 'profile-item';
                profileItem.innerHTML = `
                    <div class="profile-info">
                        <strong>${profile.name}</strong> - ${profile.age} years, ${profile.height}${profile.heightUnit}, ${profile.weight}${profile.weightUnit}
                        <br><small>Goal: ${profile.targetWeight}${profile.weightUnit} in ${this.getTimeGoalText(profile.timeGoal)}</small>
                    </div>
                    <button class="switch-profile-btn" onclick="calorieTracker.switchToProfile('${key}')">
                        ${translationManager.translate('switch_profile')}
                    </button>
                `;
                profileList.appendChild(profileItem);
            });
        } else {
            profileSection.style.display = 'none';
        }
    }

  // Get time goal text for display
  getTimeGoalText(timeGoal) {
    const timeGoalMap = {
      '2': '2 weeks',
      '4': '1 month',
      '8': '2 months',
      '12': '3 months',
      '24': '6 months',
      '52': '1 year'
    };
    return timeGoalMap[timeGoal] || `${timeGoal} weeks`;
  }

  // Handle create new profile button
  handleCreateNewProfile() {
    const profileSection = document.getElementById('profileSection');
    if (profileSection) {
      profileSection.style.display = 'none';
    }
    document.getElementById('setupForm').scrollIntoView({ behavior: 'smooth' });
  }

  // Setup form handling
  handleSetupSubmit(e) {
    e.preventDefault();
    
    const formData = {
      name: document.getElementById('userName').value,
      gender: document.getElementById('gender').value,
      age: parseInt(document.getElementById('age').value),
      height: parseFloat(document.getElementById('height').value),
      heightUnit: document.getElementById('heightUnit').value,
      currentWeight: parseFloat(document.getElementById('currentWeight').value),
      weightUnit: document.getElementById('weightUnit').value,
      targetWeight: parseFloat(document.getElementById('targetWeight').value),
      timeGoal: document.getElementById('timeGoal').value,
      activityLevel: parseFloat(document.getElementById('activityLevel').value)
    };

    // Generate profile key and check for existing profile
    const profileKey = this.generateProfileKey(formData);
    const existingProfile = this.findExistingProfile(profileKey);
    
    if (existingProfile) {
      // Load existing profile
      this.switchToProfile(profileKey);
      this.showNotification(`Welcome back, ${existingProfile.name}!`);
      this.showPage('trackerPage');
      return;
    }

    // Calculate BMR and daily calories
    const bmr = this.calculateBMR(formData);
    const dailyCalories = Math.round(bmr * formData.activityLevel);
    
    // Adjust for weight goal based on user's selected timeline
    const currentWeightKg = this.convertToKg(formData.currentWeight, formData.weightUnit);
    const targetWeightKg = this.convertToKg(formData.targetWeight, formData.weightUnit);
    const weightDifference = Math.abs(targetWeightKg - currentWeightKg);
    const isWeightLoss = currentWeightKg > targetWeightKg;
    
    // Calculate required daily calorie deficit/surplus based on timeline
    // 1 kg of fat = approximately 7700 calories
    const totalCaloriesNeeded = weightDifference * 7700;
    const weeksToTarget = parseInt(formData.timeGoal); // timeGoal is in weeks
    const daysToTarget = weeksToTarget * 7; // Convert weeks to days
    const dailyCalorieAdjustment = totalCaloriesNeeded / daysToTarget;
    
    let targetCalories = dailyCalories;
    if (isWeightLoss) {
      // Weight loss: create deficit
      targetCalories = dailyCalories - dailyCalorieAdjustment;
      // Ensure minimum safe calories (1200 for women, 1500 for men)
      const minCalories = formData.gender === 'female' ? 1200 : 1500;
      targetCalories = Math.max(targetCalories, minCalories);
      
      // If the required deficit is too extreme, recommend higher activity level
      if (dailyCalorieAdjustment > 1000) {
        // Suggest very active lifestyle for aggressive goals
        const recommendedActivity = 1.725;
        const newDailyCalories = Math.round(bmr * recommendedActivity);
        targetCalories = Math.max(newDailyCalories - dailyCalorieAdjustment, minCalories);
        formData.recommendedActivity = recommendedActivity;
      }
    } else if (weightDifference > 0) {
      // Weight gain: create surplus
      targetCalories = dailyCalories + dailyCalorieAdjustment;
      // Cap maximum surplus at 1000 calories for safety
      targetCalories = Math.min(targetCalories, dailyCalories + 1000);
    }

    formData.bmr = bmr;
    formData.dailyCalories = dailyCalories;
    formData.targetCalories = Math.round(targetCalories);
    formData.dailyCalorieAdjustment = Math.round(dailyCalorieAdjustment);
    formData.createdAt = new Date().toISOString();
    
    // Save new profile
    this.currentProfileKey = profileKey;
    localStorage.setItem('currentProfileKey', profileKey);
    this.userProfile = formData;
    this.targetCalories = formData.targetCalories;
    this.saveUserProfile();
    
    // Initialize empty data for new profile
    this.dailyEntries = [];
    this.dailyNotes = '';
    this.saveDailyEntries();
    
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

    // Add default "Select specific type" option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = translationManager.translate('select_specific_type');
    specificType.appendChild(defaultOption);

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

    if (!foodCategory || !specificType || !quantity || !unit) {
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
    document.getElementById('unit').value = ''; // Reset to "Select type"
    
    this.showNotification(translationManager.translate('entry_added'));
  }

  deleteEntry(entryId) {
    this.dailyEntries = this.dailyEntries.filter(entry => entry.id !== entryId);
    this.saveDailyEntries();
    this.updateUI();
    this.showNotification(translationManager.translate('entry_deleted'));
  }

  editEntry(entryId) {
    const entry = this.dailyEntries.find(e => e.id === entryId);
    if (!entry) return;

    // Populate form with entry data
    document.getElementById('mealType').value = entry.mealType;
    document.getElementById('foodCategory').value = entry.foodCategory;
    document.getElementById('quantity').value = entry.quantity;
    document.getElementById('unit').value = entry.unit;

    // Update specific types dropdown
    this.updateSpecificTypes(entry.foodCategory);
    
    // Wait for dropdown to populate, then set the specific type
    setTimeout(() => {
      document.getElementById('specificType').value = entry.specificType;
    }, 100);

    // Remove the entry being edited
    this.dailyEntries = this.dailyEntries.filter(e => e.id !== entryId);
    this.saveDailyEntries();
    this.updateUI();

    // Scroll to form
    document.querySelector('.food-entry-card').scrollIntoView({ behavior: 'smooth' });
    
    this.showNotification('Entry loaded for editing. Make changes and add again.');
  }

  // UI Updates
  updateUI() {
    this.updateDailySummary();
    this.updateFoodLog();
    this.updateProgressChart();
  }

  updateDailySummary() {
    const targetCaloriesEl = document.getElementById('calorieGoalDisplay');
    const consumedCaloriesEl = document.getElementById('caloriesConsumed');
    const remainingCaloriesEl = document.getElementById('caloriesRemaining');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');

    if (!targetCaloriesEl) return;

    // Check if goals have been calculated
    if (!this.userProfile || !this.userProfile.targetCalories) {
      // Show "0" for all values when no goals calculated
      targetCaloriesEl.textContent = '0';
      consumedCaloriesEl.textContent = '0';
      remainingCaloriesEl.textContent = '0';
      
      if (progressFill) {
        progressFill.style.width = '0%';
        progressFill.className = 'progress-fill';
      }
      
      if (progressText) {
        progressText.textContent = '0%';
      }
      return;
    }

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

  updateProgressChart() {
    const canvas = document.getElementById('progressCanvas');
    const placeholder = document.querySelector('.chart-placeholder p');
    
    if (!canvas) return;
    
    // Check if goals have been calculated (targetCalories exists)
    if (!this.userProfile || !this.userProfile.targetCalories) {
      // Show placeholder and hide canvas when no goals calculated
      canvas.style.display = 'none';
      if (placeholder) placeholder.style.display = 'block';
      return;
    }
    
    // Get weight history from localStorage
    let weightHistory = JSON.parse(localStorage.getItem('weightHistory')) || [];
    
    // Add current weight if not already added today and user profile exists
    const today = this.getTodayKey();
    const todayEntry = weightHistory.find(entry => entry.date === today);
    
    if (!todayEntry && this.userProfile && this.userProfile.currentWeight) {
      weightHistory.push({
        date: today,
        weight: this.userProfile.currentWeight,
        unit: this.userProfile.weightUnit || 'kg'
      });
      localStorage.setItem('weightHistory', JSON.stringify(weightHistory));
    }
    
    // Show chart if we have user profile with calculated goals
    if (this.userProfile && this.userProfile.currentWeight && this.userProfile.targetWeight) {
      // Show canvas and hide placeholder
      canvas.style.display = 'block';
      if (placeholder) placeholder.style.display = 'none';
      
      this.drawProgressChart(canvas, weightHistory);
    } else {
      // Show placeholder and hide canvas
      canvas.style.display = 'none';
      if (placeholder) placeholder.style.display = 'block';
    }
  }
  
  drawProgressChart(canvas, weightHistory) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const padding = 80;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Set styles
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-primary');
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
    ctx.lineWidth = 2;
    ctx.font = '12px Inter, sans-serif';
    
    // Simple chart showing only current and target weight
    if (this.userProfile && this.userProfile.weight && this.userProfile.targetWeight) {
      const currentWeight = parseFloat(this.userProfile.weight);
      const targetWeight = parseFloat(this.userProfile.targetWeight);
      
      // Create simple two-point data
      const chartData = [
        { label: 'Current Weight', weight: currentWeight, x: 0.25 },
        { label: 'Target Weight', weight: targetWeight, x: 0.75 }
      ];
      
      // Set weight range for chart
      const minWeight = Math.min(currentWeight, targetWeight) - 5;
      const maxWeight = Math.max(currentWeight, targetWeight) + 5;
      const weightRange = maxWeight - minWeight;
      
      // Draw chart background
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg-secondary');
      ctx.fillRect(padding, padding, width - 2 * padding, height - 2 * padding);
      
      // Draw grid lines
      ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border-color');
      ctx.lineWidth = 1;
      for (let i = 1; i <= 4; i++) {
        const y = padding + (i / 5) * (height - 2 * padding);
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
      }
      
      // Draw connection line between points
      ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
      ctx.lineWidth = 3;
      ctx.beginPath();
      
      chartData.forEach((data, index) => {
        const x = padding + data.x * (width - 2 * padding);
        const y = height - padding - ((data.weight - minWeight) / weightRange) * (height - 2 * padding);
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();
      
      // Draw data points and labels
      chartData.forEach((data, index) => {
        const x = padding + data.x * (width - 2 * padding);
        const y = height - padding - ((data.weight - minWeight) / weightRange) * (height - 2 * padding);
        
        // Draw point
        if (index === 1) { // Target weight
          ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--success-color');
        } else { // Current weight
          ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
        }
        
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw weight labels
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-primary');
        ctx.textAlign = 'center';
        ctx.font = 'bold 14px Inter, sans-serif';
        ctx.fillText(`${data.weight.toFixed(1)}kg`, x, y - 15);
        
        // Draw category labels
        ctx.font = '12px Inter, sans-serif';
        ctx.fillText(data.label, x, height - padding + 20);
      });
      
      // Draw weight difference
      const weightDiff = Math.abs(targetWeight - currentWeight);
      const diffText = currentWeight > targetWeight ? 
        `${weightDiff.toFixed(1)}kg to lose` : 
        `${weightDiff.toFixed(1)}kg to gain`;
      
      ctx.textAlign = 'center';
      ctx.font = '13px Inter, sans-serif';
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary');
      ctx.fillText(diffText, width / 2, height - padding + 40);
      
      // Draw title
      ctx.textAlign = 'center';
      ctx.font = 'bold 16px Inter, sans-serif';
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-primary');
      ctx.fillText('Weight Progress', width / 2, 30);
      
    } else {
      // Show placeholder if no profile data
      ctx.textAlign = 'center';
      ctx.font = '14px Inter, sans-serif';
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary');
      ctx.fillText('Complete your profile to see weight progress', width / 2, height / 2);
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

    // Add action menu event listeners
    foodEntriesContainer.querySelectorAll('.action-menu-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const entryId = e.target.getAttribute('data-id') || e.target.parentElement.getAttribute('data-id');
        const menu = foodEntriesContainer.querySelector(`.action-menu[data-id="${entryId}"]`);
        
        // Close all other menus
        foodEntriesContainer.querySelectorAll('.action-menu').forEach(m => {
          if (m !== menu) m.classList.remove('show');
        });
        
        // Toggle current menu
        menu.classList.toggle('show');
      });
    });

    // Add delete event listeners
    foodEntriesContainer.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const entryId = parseInt(e.target.getAttribute('data-id') || e.target.parentElement.getAttribute('data-id'));
        this.deleteEntry(entryId);
        // Close menu after action
        foodEntriesContainer.querySelectorAll('.action-menu').forEach(m => m.classList.remove('show'));
      });
    });

    // Add edit event listeners
    foodEntriesContainer.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const entryId = parseInt(e.target.getAttribute('data-id') || e.target.parentElement.getAttribute('data-id'));
        this.editEntry(entryId);
        // Close menu after action
        foodEntriesContainer.querySelectorAll('.action-menu').forEach(m => m.classList.remove('show'));
      });
    });

    // Close menus when clicking outside
    document.addEventListener('click', () => {
      foodEntriesContainer.querySelectorAll('.action-menu').forEach(m => m.classList.remove('show'));
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
    // Format time from timestamp
    const timeString = entry.timestamp ? new Date(entry.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '';
    
    return `
      <div class="food-item">
        <div class="food-details">
          <div class="food-name">${entry.foodName}</div>
          <div class="food-quantity">${entry.quantity} ${entry.unit}${timeString ? ` • ${timeString}` : ''}</div>
        </div>
        <div class="food-calories">${entry.calories} cal</div>
        <div class="food-actions">
          <button class="action-menu-btn" data-id="${entry.id}" title="Options">
            <i class="fas fa-ellipsis-h"></i>
          </button>
          <div class="action-menu" data-id="${entry.id}">
            <button class="action-item edit-btn" data-id="${entry.id}">
              <i class="fas fa-edit"></i> Edit
            </button>
            <button class="action-item delete-btn" data-id="${entry.id}">
              <i class="fas fa-trash"></i> Remove
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // Notes management
  saveNotes() {
    const notesTextarea = document.getElementById('dailyNotes');
    if (notesTextarea && this.currentProfileKey) {
      this.dailyNotes = notesTextarea.value;
      const key = `${this.currentProfileKey}_notes_${this.getTodayKey()}`;
      localStorage.setItem(key, this.dailyNotes);
      
      // Also save to profile-specific notes history
      const today = this.getTodayKey();
      const historyKey = `${this.currentProfileKey}_notesHistory`;
      let notesHistory = JSON.parse(localStorage.getItem(historyKey)) || {};
      notesHistory[today] = this.dailyNotes;
      localStorage.setItem(historyKey, JSON.stringify(notesHistory));
      
      this.showNotification(translationManager.translate('notes_saved'));
      
      // Reset the input field to placeholder text
      notesTextarea.value = '';
      notesTextarea.placeholder = translationManager.translate('notes_placeholder');
    }
  }

  // Show notes history
  showNotesHistory() {
    if (!this.currentProfileKey) return;
    
    const historyKey = `${this.currentProfileKey}_notesHistory`;
    const notesHistory = JSON.parse(localStorage.getItem(historyKey)) || {};
    
    // Get all unique dates from both notes and food entries
    const allDates = new Set();
    Object.keys(notesHistory).forEach(date => allDates.add(date));
    
    // Add dates from food entries
    for (let i = 0; i < 30; i++) { // Check last 30 days
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      const entriesKey = `${this.currentProfileKey}_entries_${dateKey}`;
      const foodEntries = localStorage.getItem(entriesKey);
      if (foodEntries && JSON.parse(foodEntries).length > 0) {
        allDates.add(dateKey);
      }
    }
    
    const historyEntries = Array.from(allDates)
      .sort((a, b) => new Date(b) - new Date(a))
      .slice(0, 10); // Show last 10 entries
    
    let historyHtml = '<div class="notes-history-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center;">';
    historyHtml += '<div style="background: var(--bg-primary); padding: 2rem; border-radius: var(--border-radius); max-width: 600px; max-height: 80vh; overflow-y: auto; width: 90%;">';
    historyHtml += '<h3>Daily History</h3>';
    
    if (historyEntries.length === 0) {
      historyHtml += '<p>No history found.</p>';
    } else {
      historyEntries.forEach(date => {
        const formattedDate = new Date(date).toLocaleDateString();
        const notes = notesHistory[date] || '';
        const entriesKey = `${this.currentProfileKey}_entries_${date}`;
        const foodEntries = JSON.parse(localStorage.getItem(entriesKey) || '[]');
        
        historyHtml += `<div style="margin-bottom: 1.5rem; padding: 1rem; background: var(--bg-secondary); border-radius: var(--border-radius);">`;
        historyHtml += `<strong style="font-size: 1.1rem; color: var(--primary-color);">${formattedDate}</strong><br>`;
        
        // Food Log Section
        if (foodEntries.length > 0) {
          historyHtml += '<div style="margin-top: 1rem;">';
          historyHtml += '<h4 style="margin: 0.5rem 0; color: var(--text-primary); font-size: 0.9rem;">🍽️ Food Log:</h4>';
          let totalCalories = 0;
          foodEntries.forEach(entry => {
            totalCalories += entry.calories;
            historyHtml += `<div style="margin: 0.25rem 0; font-size: 0.8rem; color: var(--text-secondary);">`;
            historyHtml += `• ${entry.foodName} (${entry.quantity}${entry.unit}) - ${entry.calories} cal`;
            historyHtml += '</div>';
          });
          historyHtml += `<div style="margin-top: 0.5rem; font-weight: bold; font-size: 0.85rem;">Total: ${totalCalories} calories</div>`;
          historyHtml += '</div>';
        }
        
        // Notes Section
        if (notes) {
          historyHtml += '<div style="margin-top: 1rem;">';
          historyHtml += '<h4 style="margin: 0.5rem 0; color: var(--text-primary); font-size: 0.9rem;">📝 Notes:</h4>';
          historyHtml += `<p style="margin: 0; font-size: 0.85rem; line-height: 1.4; color: var(--text-secondary);">${notes}</p>`;
          historyHtml += '</div>';
        }
        
        if (foodEntries.length === 0 && !notes) {
          historyHtml += '<p style="margin-top: 0.5rem; font-style: italic; color: var(--text-secondary); font-size: 0.85rem;">No entries for this day</p>';
        }
        
        historyHtml += '</div>';
      });
    }
    
    historyHtml += '<button onclick="document.querySelector(\'.notes-history-modal\').remove()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: var(--primary-color); color: white; border: none; border-radius: var(--border-radius); cursor: pointer;">Close</button>';
    historyHtml += '</div></div>';
    
    document.body.insertAdjacentHTML('beforeend', historyHtml);
  }

  // Data persistence
  saveUserProfile() {
    if (this.currentProfileKey) {
      localStorage.setItem(this.currentProfileKey, JSON.stringify(this.userProfile));
    }
  }

  loadUserProfile() {
    if (this.currentProfileKey) {
      const saved = localStorage.getItem(this.currentProfileKey);
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  }

  saveDailyEntries() {
    if (this.currentProfileKey) {
      const key = `${this.currentProfileKey}_entries_${this.getTodayKey()}`;
      localStorage.setItem(key, JSON.stringify(this.dailyEntries));
      
      // Also save to history for long-term storage
      this.saveDailyHistory();
    }
  }

  saveDailyHistory() {
    if (this.currentProfileKey) {
      const today = this.getTodayKey();
      const historyKey = `${this.currentProfileKey}_history`;
      
      // Get existing history
      const existingHistory = JSON.parse(localStorage.getItem(historyKey) || '{}');
      
      // Update today's entry
      existingHistory[today] = {
        entries: [...this.dailyEntries],
        notes: this.loadDailyNotes(),
        timestamp: new Date().toISOString()
      };
      
      // Save updated history
      localStorage.setItem(historyKey, JSON.stringify(existingHistory));
    }
  }

  loadDailyHistory() {
    if (this.currentProfileKey) {
      const historyKey = `${this.currentProfileKey}_history`;
      return JSON.parse(localStorage.getItem(historyKey) || '{}');
    }
    return {};
  }

  loadDailyEntries() {
    if (this.currentProfileKey) {
      const key = `${this.currentProfileKey}_entries_${this.getTodayKey()}`;
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  }

  loadDailyNotes() {
    if (this.currentProfileKey) {
      const key = `${this.currentProfileKey}_notes_${this.getTodayKey()}`;
      return localStorage.getItem(key) || '';
    }
    return '';
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

  // Update language elements
  updateLanguage() {
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
      const key = element.getAttribute('data-translate');
      if (translationManager.translate(key) !== key) {
        element.textContent = translationManager.translate(key);
      }
    });
    
    // Update placeholders
    const placeholderElements = document.querySelectorAll('[data-translate-placeholder]');
    placeholderElements.forEach(element => {
      const key = element.getAttribute('data-translate-placeholder');
      if (translationManager.translate(key) !== key) {
        element.placeholder = translationManager.translate(key);
      }
    });
    
    // Update welcome message if user name exists
    if (this.userProfile && this.userProfile.name) {
      const welcomeTitle = document.querySelector('[data-translate="welcome_title"]');
      if (welcomeTitle) {
        const welcomeText = translationManager.translate('welcome_user');
        if (welcomeText.includes('{name}')) {
          welcomeTitle.textContent = welcomeText.replace('{name}', this.userProfile.name);
        }
      }
    }
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
  // Show splash screen for 2.5 seconds
  setTimeout(() => {
    const splashScreen = document.getElementById('splashScreen');
    const appContainer = document.querySelector('.app-container');
    
    // Remove splash screen immediately without fade
    splashScreen.style.display = 'none';
    appContainer.classList.add('loaded');
    
    // Initialize the app after splash screen is hidden
    window.calorieTracker = new CalorieTracker();
    // Ensure we land on setup page
    window.calorieTracker.showPage('setupPage');
  }, 2500); // Show splash for 2.5 seconds
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