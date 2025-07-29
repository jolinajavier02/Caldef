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

  // Show setup results
  showSetupResults(formData) {
    const setupResults = document.getElementById('setupResults');
    const setupCalorieGoal = document.getElementById('setupCalorieGoal');
    
    if (setupResults && setupCalorieGoal) {
      setupCalorieGoal.textContent = formData.targetCalories.toLocaleString();
      setupResults.style.display = 'block';
      
      // Generate weight progress graph
      this.generateSetupWeightProgressGraph(formData);
      
      // Scroll to results
      setupResults.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Generate weight progress graph for setup results
  generateSetupWeightProgressGraph(formData) {
    const canvas = document.getElementById('setupProgressCanvas');
    const placeholder = document.querySelector('#setupResults .chart-placeholder p');
    
    if (!canvas || !formData.currentWeight || !formData.targetWeight) return;
    
    // Show canvas and hide placeholder
    canvas.style.display = 'block';
    if (placeholder) placeholder.style.display = 'none';
    
    this.drawSetupProgressChart(canvas, formData);
  }

  // Draw weight progress chart for setup results
  drawSetupProgressChart(canvas, formData) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const padding = 60;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Set styles
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-primary');
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
    ctx.lineWidth = 3;
    ctx.font = '12px Inter, sans-serif';
    
    const currentWeight = parseFloat(formData.currentWeight);
    const targetWeight = parseFloat(formData.targetWeight);
    const timeGoalDays = this.getTimeGoalInDays(formData.timeGoal);
    
    // Create projected weight loss timeline
    const weightDiff = currentWeight - targetWeight;
    const isWeightLoss = weightDiff > 0;
    
    // Generate data points for the timeline
    const dataPoints = [];
    const steps = Math.min(timeGoalDays / 7, 20); // Weekly steps, max 20 points
    
    for (let i = 0; i <= steps; i++) {
      const progress = i / steps;
      const projectedWeight = currentWeight - (weightDiff * progress);
      dataPoints.push({
        day: Math.round((timeGoalDays * progress)),
        weight: projectedWeight,
        x: padding + (progress * (width - 2 * padding)),
        y: 0 // Will be calculated based on weight range
      });
    }
    
    // Calculate weight range for chart
    const minWeight = Math.min(currentWeight, targetWeight) - 2;
    const maxWeight = Math.max(currentWeight, targetWeight) + 2;
    const weightRange = maxWeight - minWeight;
    
    // Calculate Y positions
    dataPoints.forEach(point => {
      point.y = padding + ((maxWeight - point.weight) / weightRange) * (height - 2 * padding);
    });
    
    // Draw chart background
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg-secondary');
    ctx.fillRect(padding, padding, width - 2 * padding, height - 2 * padding);
    
    // Draw grid lines
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border-color');
    ctx.lineWidth = 1;
    
    // Horizontal grid lines (weight)
    for (let i = 0; i <= 4; i++) {
      const y = padding + (i / 4) * (height - 2 * padding);
      const weight = maxWeight - (i / 4) * weightRange;
      
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
      
      // Weight labels
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary');
      ctx.textAlign = 'right';
      ctx.fillText(weight.toFixed(1) + (formData.weightUnit || 'kg'), padding - 10, y + 4);
    }
    
    // Vertical grid lines (time)
    for (let i = 0; i <= 4; i++) {
      const x = padding + (i / 4) * (width - 2 * padding);
      const days = Math.round((i / 4) * timeGoalDays);
      
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
      
      // Time labels
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary');
      ctx.textAlign = 'center';
      ctx.fillText(days + 'd', x, height - padding + 20);
    }
    
    // Draw projected weight line
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    dataPoints.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.stroke();
    
    // Draw data points
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
    dataPoints.forEach(point => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });
    
    // Draw start and end labels
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-primary');
    ctx.font = 'bold 12px Inter, sans-serif';
    
    // Start weight
    ctx.textAlign = 'left';
    ctx.fillText(`Start: ${currentWeight}${formData.weightUnit || 'kg'}`, dataPoints[0].x + 10, dataPoints[0].y - 10);
    
    // Target weight
    const lastPoint = dataPoints[dataPoints.length - 1];
    ctx.textAlign = 'right';
    ctx.fillText(`Target: ${targetWeight}${formData.weightUnit || 'kg'}`, lastPoint.x - 10, lastPoint.y - 10);
  }

  // Get time goal in days
  getTimeGoalInDays(timeGoal) {
    const timeGoalMap = {
      '2weeks': 14,
      '1month': 30,
      '2months': 60,
      '3months': 90,
      '6months': 180,
      '1year': 365
    };
    return timeGoalMap[timeGoal] || 90;
  }

  // Update tracker history
  updateTrackerHistory() {
    // This function is kept for compatibility but no longer needed
    // since comprehensive history section was removed
  }

  // Update today's food log
  updateTodaysFoodLog() {
    const container = document.querySelector('.food-entries-container');
    const totalCaloriesElement = document.querySelector('.total-calories');
    
    if (!container || !totalCaloriesElement) return;
    
    // Get today's entries
    const todayEntries = this.dailyEntries || [];
    
    // Calculate total calories
    const totalCalories = todayEntries.reduce((sum, entry) => sum + entry.calories, 0);
    totalCaloriesElement.textContent = `${totalCalories} ${translationManager.translate('calories')}`;
    
    // Clear container
    container.innerHTML = '';
    
    if (todayEntries.length === 0) {
      // Show no entries message
      const noEntriesDiv = document.createElement('div');
      noEntriesDiv.className = 'no-entries-message';
      noEntriesDiv.textContent = translationManager.translate('no_entries');
      container.appendChild(noEntriesDiv);
      return;
    }
    
    // Display entries
    todayEntries.forEach(entry => {
      const entryDiv = document.createElement('div');
      entryDiv.className = 'food-entry';
      
      const foodInfo = document.createElement('div');
      foodInfo.className = 'food-info';
      
      const foodName = document.createElement('div');
      foodName.className = 'food-name';
      foodName.textContent = entry.food;
      
      const foodDetails = document.createElement('div');
      foodDetails.className = 'food-details';
      
      // Add time to food details
      const entryTime = entry.timestamp ? new Date(entry.timestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }) : '';
      
      const detailsText = entryTime ? 
        `${entry.quantity} ${entry.unit} • ${translationManager.translate(entry.mealType)} • ${entryTime}` :
        `${entry.quantity} ${entry.unit} • ${translationManager.translate(entry.mealType)}`;
      
      foodDetails.textContent = detailsText;
      
      foodInfo.appendChild(foodName);
      foodInfo.appendChild(foodDetails);
      
      const foodCalories = document.createElement('div');
      foodCalories.className = 'food-calories';
      foodCalories.textContent = `${entry.calories} ${translationManager.translate('calories')}`;
      
      entryDiv.appendChild(foodInfo);
      entryDiv.appendChild(foodCalories);
      
      container.appendChild(entryDiv);
    });
  }



  // Get all food entries from storage
  getAllFoodEntries() {
    const allEntries = [];
    const storageKeys = Object.keys(localStorage);
    
    storageKeys.forEach(key => {
      if (key.startsWith(`${this.currentProfileKey}_dailyEntries_`)) {
        try {
          const entries = JSON.parse(localStorage.getItem(key)) || [];
          allEntries.push(...entries);
        } catch (e) {
          console.error('Error parsing entries:', e);
        }
      }
    });
    
    return allEntries;
  }

  // Save daily notes
  saveNotes() {
    const notesTextarea = document.getElementById('dailyNotes');
    if (!notesTextarea) return;
    
    this.dailyNotes = notesTextarea.value;
    this.saveDailyNotes();
    
    // Also save to history
    const today = this.formatDateKey(new Date());
    this.saveNotesToHistory(today, this.dailyNotes);
    
    this.showNotification('Notes saved successfully!');
  }

  // Show notes history
  showNotesHistory() {
    const notesHistory = this.loadNotesHistory();
    
    if (notesHistory.length === 0) {
      this.showNotification('No notes history found.');
      return;
    }
    
    // Create modal for notes history
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content notes-history-modal">
        <div class="modal-header">
          <h3>Notes History</h3>
          <button class="close-btn" onclick="this.closest('.modal-overlay').remove()">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="notes-history-list">
            ${notesHistory.map(entry => `
              <div class="history-entry">
                <div class="entry-date">${new Date(entry.date).toLocaleDateString()}</div>
                <div class="entry-notes">${entry.notes}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }
  
  // Load notes history
  loadNotesHistory() {
    if (!this.currentProfileKey) return [];
    
    const historyKey = `${this.currentProfileKey}_notes_history`;
    const history = localStorage.getItem(historyKey);
    return history ? JSON.parse(history) : [];
  }
  
  // Save notes to history
  saveNotesToHistory(date, notes) {
    if (!this.currentProfileKey || !notes.trim()) return;
    
    const historyKey = `${this.currentProfileKey}_notes_history`;
    let history = this.loadNotesHistory();
    
    // Remove existing entry for the same date
    history = history.filter(entry => entry.date !== date);
    
    // Add new entry
    history.unshift({ date, notes });
    
    // Keep only last 30 entries
    history = history.slice(0, 30);
    
    localStorage.setItem(historyKey, JSON.stringify(history));
  }



  // Format date key for storage
  formatDateKey(date) {
    return date.toISOString().split('T')[0];
  }

  init() {
    this.setupEventListeners();
    this.initializeTheme();
    this.updateFoodCategoryOptions();
    this.updateLanguage();
    
    // Load daily data if profile exists
    if (this.currentProfileKey) {
      // Check for day rollover before loading data
      this.checkDayRollover();
      
      this.dailyEntries = this.loadDailyEntries();
      this.dailyNotes = this.loadDailyNotes();
      
      // Load notes into textarea
      const dailyNotesTextarea = document.getElementById('dailyNotes');
      if (dailyNotesTextarea) {
        dailyNotesTextarea.value = this.dailyNotes;
      }
    }
    
    // Update navigation visibility based on profile status
    this.updateNavigationVisibility();
    
    // Show appropriate page based on profile status
    if (this.userProfile && this.userProfile.targetCalories) {
      // User has a complete profile, show tracker page
      this.showPage('trackerPage');
      this.updateUI();
    } else {
      // No profile or incomplete profile, show setup page
      this.showPage('setupPage');
    }
  }

  setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const page = e.currentTarget.getAttribute('data-page');
        
        // Prevent direct access to tracker and history pages if setup is not completed
        if ((page === 'trackerPage' || page === 'historyPage') && (!this.userProfile || !this.userProfile.targetCalories)) {
          e.preventDefault();
          e.stopPropagation();
          this.showNotification('Need to setup the profile first.');
          return;
        }
        
        this.showPage(page);
      });
    });
    
    // Special handler for disabled tracker button
    const trackerNavItem = document.getElementById('navTracker');
    if (trackerNavItem) {
      trackerNavItem.addEventListener('click', (e) => {
        if (trackerNavItem.classList.contains('disabled')) {
          e.preventDefault();
          e.stopPropagation();
          this.showNotification('Need to setup the profile first.');
        }
      }, true); // Use capture phase to ensure it fires even with pointer-events: none
    }

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
    const saveNotesBtn = document.getElementById('saveNotesBtn');
    if (saveNotesBtn) {
      saveNotesBtn.addEventListener('click', () => this.saveNotes());
    }

    // Notes history button
    const notesHistoryBtn = document.getElementById('notesHistoryBtn');
    if (notesHistoryBtn) {
      notesHistoryBtn.addEventListener('click', () => this.showNotesHistory());
    }

    // Calculate My Foods button
    const calculateFoodsBtn = document.getElementById('calculateFoodsBtn');
    if (calculateFoodsBtn) {
      calculateFoodsBtn.addEventListener('click', () => {
        this.showPage('trackerPage');
        this.updateUI();
      });
    }

    // Tracker history period selector
    const trackerHistoryPeriod = document.getElementById('trackerHistoryPeriod');
    if (trackerHistoryPeriod) {
      trackerHistoryPeriod.addEventListener('change', () => this.updateTrackerHistory());
    }

    // Load saved notes
    const dailyNotesTextarea = document.getElementById('dailyNotes');
    if (dailyNotesTextarea) {
      dailyNotesTextarea.value = this.dailyNotes;
    }

    // Name history functionality
    const nameInput = document.getElementById('userName');
    if (nameInput) {
      nameInput.addEventListener('input', (e) => this.handleNameInput(e));
      nameInput.addEventListener('focus', (e) => this.handleNameFocus(e));
      nameInput.addEventListener('blur', (e) => this.handleNameBlur(e));
      nameInput.addEventListener('keydown', (e) => this.handleNameKeydown(e));
    }

    // History period selection
    const historyPeriod = document.getElementById('historyPeriod');
    if (historyPeriod) {
      historyPeriod.addEventListener('change', () => {
        if (this.currentPage === 'historyPage') {
          this.updateHistoryPage();
        }
      });
    }

    // Click outside to close autocomplete
    document.addEventListener('click', (e) => {
      const autocompleteContainer = document.querySelector('.autocomplete-container');
      if (autocompleteContainer && !autocompleteContainer.contains(e.target)) {
        this.hideAutocomplete();
      }
    });
  }

  // Update navigation visibility based on profile status
  updateNavigationVisibility() {
    const trackerNavItem = document.getElementById('navTracker');
    const historyNavItem = document.getElementById('navHistory');
    
    const isProfileComplete = this.userProfile && this.userProfile.targetCalories;
    
    // Handle tracker navigation
    if (trackerNavItem) {
      if (!isProfileComplete) {
        trackerNavItem.style.opacity = '0.5';
        trackerNavItem.style.pointerEvents = 'none';
        trackerNavItem.classList.add('disabled');
      } else {
        trackerNavItem.style.opacity = '1';
        trackerNavItem.style.pointerEvents = 'auto';
        trackerNavItem.classList.remove('disabled');
      }
    }
    
    // Handle history navigation
    if (historyNavItem) {
      if (!isProfileComplete) {
        historyNavItem.style.opacity = '0.5';
        historyNavItem.style.pointerEvents = 'none';
        historyNavItem.classList.add('disabled');
      } else {
        historyNavItem.style.opacity = '1';
        historyNavItem.style.pointerEvents = 'auto';
        historyNavItem.classList.remove('disabled');
      }
    }
  }

  // Page navigation
  showPage(pageId) {
    console.log('showPage called with:', pageId);
    console.log('Current userProfile:', this.userProfile);
    
    // Special handling for tracker and history pages
    if (pageId === 'trackerPage') {
      console.log('Handling tracker page navigation');
      // Check if we have a valid profile with calculated goals
      if (!this.userProfile || !this.userProfile.targetCalories) {
        console.log('Profile incomplete, redirecting to setup');
        // No valid profile, redirect to setup
        this.showNotification('Need to setup the profile first.');
        pageId = 'setupPage';
      } else {
        // Load existing daily data for the tracker page
        this.dailyEntries = this.loadDailyEntries();
        this.dailyNotes = this.loadDailyNotes();
        
        // Load notes into textarea
        const dailyNotesTextarea = document.getElementById('dailyNotes');
        if (dailyNotesTextarea) {
          dailyNotesTextarea.value = this.dailyNotes;
        }
      }
    } else if (pageId === 'historyPage') {
      console.log('Handling history page navigation');
      // Check if we have a valid profile with calculated goals
      if (!this.userProfile || !this.userProfile.targetCalories) {
        console.log('Profile incomplete, redirecting to setup');
        // No valid profile, redirect to setup
        this.showNotification('Need to setup the profile first.');
        pageId = 'setupPage';
      } else {
        // Load and display history data
        setTimeout(() => this.updateHistoryPage(), 100);
      }
    }

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

  // Name history management
  saveNameToHistory(name) {
    if (!name || name.trim() === '') return;
    
    const nameHistory = this.getNameHistory();
    const trimmedName = name.trim();
    
    // Remove if already exists to avoid duplicates
    const filteredHistory = nameHistory.filter(n => n.toLowerCase() !== trimmedName.toLowerCase());
    
    // Add to beginning of array
    filteredHistory.unshift(trimmedName);
    
    // Keep only last 10 names
    const limitedHistory = filteredHistory.slice(0, 10);
    
    localStorage.setItem('nameHistory', JSON.stringify(limitedHistory));
  }

  getNameHistory() {
    const saved = localStorage.getItem('nameHistory');
    return saved ? JSON.parse(saved) : [];
  }

  generateProfileKey(formData) {
    // Create a simple key based on current timestamp and name
    const timestamp = Date.now();
    const name = formData.name.toLowerCase().trim().replace(/\s+/g, '_');
    return `profile_${name}_${timestamp}`;
  }



  // Name autocomplete functionality
  handleNameInput(e) {
    const query = e.target.value.trim();
    const nameHistory = this.getNameHistory();
    
    if (query.length === 0) {
      // Show all names when input is empty
      if (nameHistory.length > 0) {
        this.showAutocomplete(nameHistory, '');
      } else {
        this.hideAutocomplete();
      }
      return;
    }

    const matchingNames = nameHistory.filter(name => 
      name.toLowerCase().includes(query.toLowerCase())
    );

    if (matchingNames.length > 0) {
      this.showAutocomplete(matchingNames, query);
    } else {
      this.hideAutocomplete();
    }
  }

  handleNameFocus(e) {
    // Show all available names when focusing on the input
    const nameHistory = this.getNameHistory();
    if (nameHistory.length > 0) {
      const query = e.target.value.trim();
      if (query.length === 0) {
        this.showAutocomplete(nameHistory, '');
      } else {
        const matchingNames = nameHistory.filter(name => 
          name.toLowerCase().includes(query.toLowerCase())
        );
        if (matchingNames.length > 0) {
          this.showAutocomplete(matchingNames, query);
        }
      }
    }
  }

  handleNameBlur(e) {
    // Delay hiding to allow clicking on autocomplete items
    setTimeout(() => {
      this.hideAutocomplete();
    }, 150);
  }

  handleNameKeydown(e) {
    const dropdown = document.getElementById('nameAutocomplete');
    if (!dropdown || dropdown.style.display === 'none') return;

    const items = dropdown.querySelectorAll('.autocomplete-item');
    let currentIndex = Array.from(items).findIndex(item => item.classList.contains('highlighted'));

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        currentIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        this.highlightAutocompleteItem(items, currentIndex);
        break;
      case 'ArrowUp':
        e.preventDefault();
        currentIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        this.highlightAutocompleteItem(items, currentIndex);
        break;
      case 'Enter':
        e.preventDefault();
        if (currentIndex >= 0 && items[currentIndex]) {
          const name = items[currentIndex].dataset.name;
          this.selectName(name);
        }
        break;
      case 'Escape':
        this.hideAutocomplete();
        break;
    }
  }

  showAutocomplete(names, query) {
    const dropdown = document.getElementById('nameAutocomplete');
    if (!dropdown) return;

    dropdown.innerHTML = '';
    
    names.forEach(name => {
      const item = document.createElement('div');
      item.className = 'autocomplete-item';
      item.dataset.name = name;
      
      // Highlight matching text
      const nameHtml = this.highlightText(name, query);
      
      item.innerHTML = `
        <div class="name-item">${nameHtml}</div>
      `;
      
      item.addEventListener('click', () => {
        this.selectName(name);
      });
      
      dropdown.appendChild(item);
    });
    
    dropdown.style.display = 'block';
  }

  hideAutocomplete() {
    const dropdown = document.getElementById('nameAutocomplete');
    if (dropdown) {
      dropdown.style.display = 'none';
    }
  }

  highlightAutocompleteItem(items, index) {
    items.forEach((item, i) => {
      item.classList.toggle('highlighted', i === index);
    });
  }

  highlightText(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<strong>$1</strong>');
  }

  selectName(name) {
    // Set the name in the input field
    document.getElementById('userName').value = name;
    
    // Hide autocomplete
    this.hideAutocomplete();
    
    // Check if a profile exists for this name
    const existingProfile = this.findProfileByName(name);
    if (existingProfile) {
      // Load the existing profile
      this.currentProfileKey = existingProfile.key;
      localStorage.setItem('currentProfileKey', this.currentProfileKey);
      this.userProfile = existingProfile.profile;
      this.targetCalories = this.userProfile.targetCalories || 0;
      
      // Load daily data for this profile
      this.dailyEntries = this.loadDailyEntries();
      this.dailyNotes = this.loadDailyNotes();
      
      // Update navigation visibility since we now have a profile
      this.updateNavigationVisibility();
      
      // Navigate to tracker page and update UI
      this.showPage('trackerPage');
      this.updateUI();
      
      this.showNotification(`Welcome back, ${name}!`);
    }
  }
  
  // Find existing profile by name
  findProfileByName(name) {
    const nameKey = name.toLowerCase().trim().replace(/\s+/g, '_');
    
    // Search through all localStorage keys for profiles with this name
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('profile_' + nameKey + '_')) {
        try {
          const profile = JSON.parse(localStorage.getItem(key));
          if (profile && profile.name && profile.targetCalories) {
            return { key, profile };
          }
        } catch (e) {
          // Skip invalid JSON
        }
      }
    }
    return null;
  }



  // Setup form handling
  handleSetupSubmit(e) {
    e.preventDefault();
    console.log('Form submitted - handleSetupSubmit called');
    
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
    
    console.log('Form data:', formData);

    // Save name to history
    this.saveNameToHistory(formData.name);

    // Generate profile key
    const profileKey = this.generateProfileKey(formData);

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
    
    console.log('About to show results on setup page');
    
    // Update navigation visibility
    this.updateNavigationVisibility();
    
    // Show results on setup page
    this.showSetupResults(formData);
    
    this.showNotification(translationManager.translate('goal_calculated'));
    console.log('handleSetupSubmit completed successfully');
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
    const specificTypeContainer = document.getElementById('specificType').parentElement;
    const oldElement = document.getElementById('specificType');
    
    if (!oldElement) return;

    // Remove old element
    oldElement.remove();
    
    if (!category) {
      // Create select dropdown for no category
      const select = document.createElement('select');
      select.id = 'specificType';
      select.required = true;
      select.onchange = () => this.displayRecipe(select.value);
      
      const option = document.createElement('option');
      option.value = '';
      option.textContent = translationManager.translate('select_category_first');
      select.appendChild(option);
      
      specificTypeContainer.appendChild(select);
      return;
    }

    if (category === 'international_cuisines') {
      // Create text input for International Cuisines
      const input = document.createElement('input');
      input.type = 'text';
      input.id = 'specificType';
      input.required = true;
      input.placeholder = 'Enter cuisine name (e.g., Pizza, Sushi, Tacos)';
      input.style.width = '100%';
      input.style.padding = '0.75rem';
      input.style.border = '1px solid var(--border-color)';
      input.style.borderRadius = 'var(--border-radius)';
      input.style.fontSize = '1rem';
      
      specificTypeContainer.appendChild(input);
    } else {
      // Create select dropdown for other categories
      const select = document.createElement('select');
      select.id = 'specificType';
      select.required = true;
      select.onchange = () => this.displayRecipe(select.value);
      
      // Add default "Select specific type" option
      const defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.textContent = translationManager.translate('select_specific_type');
      select.appendChild(defaultOption);

      const types = FoodCalculator.getFoodTypes(category);
      Object.keys(types).forEach(typeKey => {
        const option = document.createElement('option');
        option.value = typeKey;
        option.textContent = types[typeKey].name;
        select.appendChild(option);
      });
      
      specificTypeContainer.appendChild(select);
    }
    
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
    
    // Check if daily calorie limit is exceeded
    this.checkCalorieLimit();
    
    // Save to daily history
    this.saveDailyHistory();
    
    this.updateUI();
    
    // Reset form
    e.target.reset();
    
    // Reset specificType field properly
    const specificTypeElement = document.getElementById('specificType');
    if (specificTypeElement) {
      if (specificTypeElement.tagName === 'SELECT') {
        specificTypeElement.innerHTML = '<option value="">' + 
          translationManager.translate('select_category_first') + '</option>';
      } else if (specificTypeElement.tagName === 'INPUT') {
        specificTypeElement.value = '';
      }
    }
    
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

  // Calorie limit checking
  checkCalorieLimit() {
    if (!this.userProfile || !this.userProfile.targetCalories) return;
    
    const totalConsumed = this.dailyEntries.reduce((sum, entry) => sum + entry.calories, 0);
    const dailyGoal = this.userProfile.targetCalories;
    
    if (totalConsumed > dailyGoal) {
      const message = translationManager.translate('calorie_limit_exceeded').replace('{goal}', dailyGoal);
      this.showNotification(message, 'warning');
    }
  }

  // Daily history management
  saveDailyHistory() {
    if (!this.currentProfileKey) return;
    
    const today = this.getTodayKey();
    const totalConsumed = this.dailyEntries.reduce((sum, entry) => sum + entry.calories, 0);
    const dailyGoal = this.userProfile.targetCalories || 0;
    
    const historyKey = `${this.currentProfileKey}_history`;
    let history = JSON.parse(localStorage.getItem(historyKey)) || {};
    
    history[today] = {
      date: today,
      consumed: totalConsumed,
      goal: dailyGoal,
      entries: [...this.dailyEntries],
      notes: this.dailyNotes || '',
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem(historyKey, JSON.stringify(history));
  }

  loadDailyHistory() {
    if (!this.currentProfileKey) return {};
    
    const historyKey = `${this.currentProfileKey}_history`;
    return JSON.parse(localStorage.getItem(historyKey)) || {};
  }

  // History page functionality
  updateHistoryPage() {
    const historyPeriod = document.getElementById('historyPeriod');
    const period = historyPeriod ? parseInt(historyPeriod.value) : 60;
    
    const history = this.loadDailyHistory();
    const historyArray = Object.values(history);
    
    // Filter by selected period
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - period);
    
    const filteredHistory = historyArray.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= cutoffDate;
    });
    
    // Sort by date (newest first)
    filteredHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    this.updateHistorySummary(filteredHistory);
    this.updateHistoryTable(filteredHistory);
  }

  updateHistorySummary(historyData) {
    const totalConsumedEl = document.getElementById('totalConsumed');
    const avgDailyIntake = document.getElementById('avgDailyIntake');
    const daysRemainingEl = document.getElementById('daysRemaining');
    
    if (historyData.length === 0) {
      if (totalConsumedEl) totalConsumedEl.textContent = '0';
      if (avgDailyIntake) avgDailyIntake.textContent = '0';
      if (daysRemainingEl) daysRemainingEl.textContent = '0';
      return;
    }
    
    const totalConsumed = historyData.reduce((sum, day) => sum + day.consumed, 0);
    const avgIntake = Math.round(totalConsumed / historyData.length);
    
    // Calculate days remaining based on selected period
    const historyPeriod = document.getElementById('historyPeriod');
    const selectedPeriod = historyPeriod ? parseInt(historyPeriod.value) : 60;
    const daysRemaining = Math.max(0, selectedPeriod - historyData.length);
    
    if (totalConsumedEl) totalConsumedEl.textContent = totalConsumed.toLocaleString();
    if (avgDailyIntake) avgDailyIntake.textContent = avgIntake;
    if (daysRemainingEl) daysRemainingEl.textContent = daysRemaining;
  }

  updateHistoryTable(historyData) {
    const historyDetails = document.getElementById('history-details');
    if (!historyDetails) return;
    
    const container = historyDetails.querySelector('.history-details-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (historyData.length === 0) {
      const noDataDiv = document.createElement('div');
      noDataDiv.className = 'no-data-message';
      noDataDiv.textContent = this.translations.no_data || 'No data available';
      container.appendChild(noDataDiv);
      return;
    }
    
    historyData.forEach(day => {
      const dayCard = document.createElement('div');
      dayCard.className = 'history-day-card';
      
      // Day header with date and calories
      const header = document.createElement('div');
      header.className = 'history-day-header';
      
      const dateDiv = document.createElement('div');
      dateDiv.className = 'history-date';
      dateDiv.textContent = new Date(day.date).toLocaleDateString();
      
      const caloriesDiv = document.createElement('div');
      caloriesDiv.className = 'history-calories';
      caloriesDiv.textContent = `${day.consumed} / ${day.goal} cal`;
      
      header.appendChild(dateDiv);
      header.appendChild(caloriesDiv);
      dayCard.appendChild(header);
      
      // Food log section
      const foodLogDiv = document.createElement('div');
      foodLogDiv.className = 'history-food-log';
      
      const foodLogTitle = document.createElement('h4');
      foodLogTitle.innerHTML = '<i class="fas fa-utensils"></i> ' + (translationManager.translate('food_log') || 'Food Log');
      foodLogDiv.appendChild(foodLogTitle);
      
      // Load and display food entries for this day
      if (day.entries && day.entries.length > 0) {
        day.entries.forEach(entry => {
          const foodItem = document.createElement('div');
          foodItem.className = 'history-food-item';
          foodItem.textContent = `${entry.foodName} (${entry.quantity}${entry.unit}) - ${entry.calories} cal`;
          foodLogDiv.appendChild(foodItem);
        });
      } else {
        const noEntries = document.createElement('div');
        noEntries.className = 'history-food-item';
        noEntries.textContent = translationManager.translate('no_entries_day') || 'No entries for this day';
        noEntries.style.fontStyle = 'italic';
        foodLogDiv.appendChild(noEntries);
      }
      
      dayCard.appendChild(foodLogDiv);
      
      // Notes section
      const notesDiv = document.createElement('div');
      notesDiv.className = 'history-notes';
      
      const notesTitle = document.createElement('h4');
      notesTitle.innerHTML = '<i class="fas fa-sticky-note"></i> ' + (translationManager.translate('daily_notes') || 'Daily Notes');
      notesDiv.appendChild(notesTitle);
      
      // Load and display notes for this day
      const notesContent = document.createElement('div');
      notesContent.className = 'history-notes-content';
      
      if (day.notes && day.notes.trim()) {
        notesContent.textContent = day.notes;
      } else {
        notesContent.textContent = translationManager.translate('no_notes_day') || 'No notes for this day';
      }
      
      notesDiv.appendChild(notesContent);
      dayCard.appendChild(notesDiv);
      
      container.appendChild(dayCard);
    });
  }

  getCalorieStatus(consumed, goal) {
    if (consumed > goal) {
      return {
        class: 'status-exceeded',
        text: translationManager.translate('exceeded_goal')
      };
    } else if (consumed >= goal * 0.8) {
      return {
        class: 'status-within',
        text: translationManager.translate('within_goal')
      };
    } else {
      return {
        class: 'status-below',
        text: translationManager.translate('below_goal')
      };
    }
  }

  // Auto-rollover to next day
  checkDayRollover() {
    const today = this.getTodayKey();
    const lastActiveDate = localStorage.getItem(`${this.currentProfileKey}_lastActiveDate`);
    
    if (lastActiveDate && lastActiveDate !== today) {
      // New day detected, save yesterday's data and reset
      this.saveDailyHistory();
      this.dailyEntries = [];
      this.dailyNotes = '';
      this.saveDailyEntries();
      localStorage.setItem(`${this.currentProfileKey}_lastActiveDate`, today);
    } else if (!lastActiveDate) {
      localStorage.setItem(`${this.currentProfileKey}_lastActiveDate`, today);
    }
  }

  // UI Updates
  updateUI() {
    this.updateMetrics();
    this.updateDailyCalorieGoal();
    this.updateFoodLog();
    this.updateTodaysFoodLog();
    
    // Update tracker history if on tracker page
    if (this.currentPage === 'trackerPage') {
      this.updateTrackerHistory();
    }
    
    // Update history page if it's currently active
    if (this.currentPage === 'historyPage') {
      this.updateHistoryPage();
    }
  }

  // Update daily calorie goal display
  updateDailyCalorieGoal() {
    const goalValueEl = document.getElementById('trackerCalorieGoal');
    
    if (!goalValueEl) return;
    
    if (!this.userProfile || !this.userProfile.targetCalories) {
      goalValueEl.textContent = '0';
      return;
    }
    
    goalValueEl.textContent = this.userProfile.targetCalories.toLocaleString();
  }

  // Update metrics section
  updateMetrics() {
    const totalConsumedEl = document.getElementById('totalConsumedCalories');
    const daysConsumedEl = document.getElementById('daysConsumed');
    const daysRemainingEl = document.getElementById('daysRemaining');
    const calorieGoalEl = document.getElementById('calorieGoalAmount');
    
    if (!totalConsumedEl || !daysConsumedEl || !daysRemainingEl || !calorieGoalEl) return;
    
    // Check if goals have been calculated
    if (!this.userProfile || !this.userProfile.targetCalories) {
      totalConsumedEl.textContent = '0';
      daysConsumedEl.textContent = '0';
      daysRemainingEl.textContent = '0';
      calorieGoalEl.textContent = '0';
      return;
    }
    
    // Calculate total consumed calories from all history
    let totalConsumed = 0;
    let daysWithEntries = 0;
    
    // Get all stored daily entries for this profile
    const profilePrefix = `dailyEntries_${this.currentProfileKey}_`;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(profilePrefix)) {
        const dayEntries = JSON.parse(localStorage.getItem(key)) || [];
        if (dayEntries.length > 0) {
          const dayTotal = dayEntries.reduce((sum, entry) => sum + entry.calories, 0);
          totalConsumed += dayTotal;
          daysWithEntries++;
        }
      }
    }
    
    // Add today's entries if not already counted
    const todayKey = `dailyEntries_${this.currentProfileKey}_${this.getTodayKey()}`;
    const todayStored = localStorage.getItem(todayKey);
    if (!todayStored && this.dailyEntries.length > 0) {
      const todayTotal = this.dailyEntries.reduce((sum, entry) => sum + entry.calories, 0);
      totalConsumed += todayTotal;
      daysWithEntries++;
    }
    
    // Calculate days remaining based on time goal
    const timeGoalDays = this.getTimeGoalInDays(this.userProfile.timeGoal);
    const profileCreatedDate = new Date(this.userProfile.createdAt);
    const today = new Date();
    const daysSinceStart = Math.floor((today - profileCreatedDate) / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.max(0, timeGoalDays - daysSinceStart);
    
    // Update metric displays
    totalConsumedEl.textContent = totalConsumed.toLocaleString();
    daysConsumedEl.textContent = daysWithEntries.toString();
    daysRemainingEl.textContent = daysRemaining.toString();
    calorieGoalEl.textContent = this.userProfile.targetCalories.toLocaleString();
  }

  updateProgressChart() {
    const canvas = document.getElementById('progressCanvas');
    const placeholder = document.querySelector('.chart-placeholder p');
    
    if (!canvas) return;
    
    // Check if goals have been calculated (targetCalories exists)
    if (!this.userProfile || !this.userProfile.targetCalories) {
      // Show placeholder and hide canvas when no goals calculated
      canvas.style.display = 'none';
      if (placeholder) {
        placeholder.style.display = 'block';
        placeholder.textContent = 'Set up your profile first to see weight progress';
      }
      return;
    }
    
    // Check if there's any activity (daily entries)
    if (this.dailyEntries.length === 0) {
      // Show placeholder when no activity
      canvas.style.display = 'none';
      if (placeholder) {
        placeholder.style.display = 'block';
        placeholder.textContent = 'Start logging food to see your weight progress';
      }
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
    
    // Show chart if we have user profile with calculated goals and activity
    if (this.userProfile && this.userProfile.currentWeight && this.userProfile.targetWeight) {
      // Show canvas and hide placeholder
      canvas.style.display = 'block';
      if (placeholder) placeholder.style.display = 'none';
      
      this.drawProgressChart(canvas, weightHistory);
    } else {
      // Show placeholder and hide canvas
      canvas.style.display = 'none';
      if (placeholder) {
        placeholder.style.display = 'block';
        placeholder.textContent = 'Your weight progress will be displayed here as you track your journey';
      }
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
    if (this.userProfile && this.userProfile.currentWeight && this.userProfile.targetWeight) {
      const currentWeight = parseFloat(this.userProfile.currentWeight);
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
    if (!notesTextarea) return;
    
    // Ensure we have a current profile key
    if (!this.currentProfileKey) {
      this.showNotification('Please set up your profile first.');
      return;
    }
    
    this.dailyNotes = notesTextarea.value;
    const key = `${this.currentProfileKey}_notes_${this.getTodayKey()}`;
    localStorage.setItem(key, this.dailyNotes);
    
    // Also save to history
    this.saveDailyHistory();
    
    this.showNotification(translationManager.translate('notes_saved'));
    
    // Reset the input field to placeholder text
    notesTextarea.value = '';
    notesTextarea.placeholder = translationManager.translate('notes_placeholder');
  }

  // Show notes history
  showNotesHistory() {
    if (!this.currentProfileKey) {
      this.showNotification('Please set up your profile first.');
      return;
    }
    
    // Get unified history
    const history = this.loadDailyHistory();
    
    let historyHtml = '<div class="notes-history-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center;">';
    historyHtml += '<div style="background: var(--bg-primary); padding: 2rem; border-radius: var(--border-radius); max-width: 600px; max-height: 80vh; overflow-y: auto; width: 90%;">';
    historyHtml += '<h3>Daily History</h3>';
    
    const sortedDates = Object.keys(history).sort().reverse();
    
    if (sortedDates.length === 0) {
      historyHtml += '<p>No history found.</p>';
    } else {
      sortedDates.forEach(date => {
        const dayData = history[date];
        const formattedDate = new Date(date).toLocaleDateString();
        
        historyHtml += `<div style="margin-bottom: 1.5rem; padding: 1rem; background: var(--bg-secondary); border-radius: var(--border-radius);">`;
        historyHtml += `<strong style="font-size: 1.1rem; color: var(--primary-color);">${formattedDate}</strong><br>`;
        
        // Food Log Section
        if (dayData.entries && dayData.entries.length > 0) {
          historyHtml += '<div style="margin-top: 1rem;">';
          historyHtml += '<h4 style="margin: 0.5rem 0; color: var(--text-primary); font-size: 0.9rem;">🍽️ Food Log:</h4>';
          let totalCalories = 0;
          dayData.entries.forEach(entry => {
            totalCalories += entry.calories;
            historyHtml += `<div style="margin: 0.25rem 0; font-size: 0.8rem; color: var(--text-secondary);">`;
            historyHtml += `• ${entry.foodName} (${entry.quantity}${entry.unit}) - ${entry.calories} cal`;
            historyHtml += '</div>';
          });
          historyHtml += `<div style="margin-top: 0.5rem; font-weight: bold; font-size: 0.85rem;">Total: ${totalCalories} calories</div>`;
          historyHtml += '</div>';
        }
        
        // Notes Section
        if (dayData.notes) {
          historyHtml += '<div style="margin-top: 1rem;">';
          historyHtml += '<h4 style="margin: 0.5rem 0; color: var(--text-primary); font-size: 0.9rem;">📝 Notes:</h4>';
          historyHtml += `<p style="margin: 0; font-size: 0.85rem; line-height: 1.4; color: var(--text-secondary);">${dayData.notes}</p>`;
          historyHtml += '</div>';
        }
        
        if ((!dayData.entries || dayData.entries.length === 0) && !dayData.notes) {
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
  showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Set background color based on type
    let backgroundColor;
    switch (type) {
      case 'warning':
        backgroundColor = '#f59e0b';
        break;
      case 'error':
        backgroundColor = '#ef4444';
        break;
      case 'success':
      default:
        backgroundColor = '#10b981';
        break;
    }
    
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background-color: ${backgroundColor};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      z-index: 1000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      font-family: inherit;
      font-size: 0.875rem;
      max-width: 300px;
      word-wrap: break-word;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds (or 5 seconds for warnings/errors)
    const duration = type === 'warning' || type === 'error' ? 5000 : 3000;
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, duration);
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
    // The init() method will handle page navigation based on profile state
  }, 2500); // Show splash for 2.5 seconds
});

// Clean up any existing service worker registrations
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      registration.unregister();
    }
  });
}