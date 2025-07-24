# CalDef - Calorie Deficit Tracking Website

A modern, responsive, and accessible calorie deficit tracking website that supports multi-language usage, daily intake reminders, progress tracking, and personalized calorie management.

## 🌟 Features

### 📘 User Calorie Goal Setup
- **Personal Profile Input**: Gender, age, height, weight, target weight, activity level
- **Smart Calorie Calculation**: Uses Mifflin-St Jeor formula for accurate BMR calculation
- **Goal-Based Adjustments**: Automatically adjusts calories for weight loss/gain goals
- **Multi-Unit Support**: Supports both metric (kg, cm) and imperial (lbs, in) units

### 🌍 Multi-Language Support
- **8 Languages**: English, Spanish, Japanese, Filipino, Hindi, French, German, Chinese
- **Dynamic Translation**: All interface elements translate in real-time
- **Persistent Language**: Selected language is saved and remembered
- **Native Scripts**: Proper display of non-Latin scripts (Japanese, Hindi, Chinese)

### 🍱 Dynamic Food Tracker
- **Comprehensive Food Database**: 8 food categories with multiple preparation methods
- **Smart Calorie Calculation**: Automatic calorie calculation based on food type and quantity
- **Flexible Units**: Support for grams, kilograms, pieces, cups, tablespoons
- **Meal Organization**: Track breakfast, lunch, dinner, and snacks separately

### 📊 Live Progress Tracking
- **Real-Time Updates**: Instant calorie tracking and progress visualization
- **Visual Progress Bar**: Color-coded progress indication (under/on/over target)
- **Daily Summary**: Target vs consumed vs remaining calories
- **Smart Alerts**: Visual feedback for calorie intake status

### 🔔 Daily Reminders
- **Persistent Reminder**: Always-visible daily calorie reminder
- **Goal Motivation**: Encouraging messages to stay on track

### 🌙 Theme & Accessibility
- **Dark/Light Mode**: Toggle between themes with persistent preference
- **Fully Responsive**: Optimized for mobile, tablet, and desktop
- **Accessibility Features**: 
  - High contrast mode support
  - Keyboard navigation
  - Screen reader friendly
  - Focus indicators
  - Reduced motion support

### 📁 Daily Logging & Notes
- **Meal Grouping**: Entries organized by meal type
- **Daily Notes**: Personal journal for symptoms, observations
- **Data Persistence**: All data saved locally in browser
- **Entry Management**: Add, view, and delete food entries

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server setup required - runs entirely in the browser

### Installation
1. Download or clone the project files
2. Open `index.html` in your web browser
3. Start tracking your calories!

### File Structure
```
CalDef/
├── index.html          # Main HTML structure
├── styles.css          # CSS styling with theme support
├── script.js           # Main application logic
├── translations.js     # Multi-language translations
├── foodData.js         # Food database and calculations
└── README.md           # This file
```

## 🎯 How to Use

### 1. Initial Setup
1. Select your preferred language from the dropdown
2. Fill in your personal information (gender, age, height, weight)
3. Set your target weight and activity level
4. Click "Calculate My Goals" to get your daily calorie target

### 2. Daily Tracking
1. Navigate to the Tracker page
2. Select meal type (breakfast, lunch, dinner, snack)
3. Choose food category and specific type
4. Enter quantity and unit
5. Click "Add Entry" to log the food

### 3. Progress Monitoring
- View your daily progress in the summary card
- Check the color-coded progress bar
- Monitor remaining calories for the day

### 4. Notes & Journaling
- Add daily notes in the notes section
- Track symptoms, mood, or observations
- Notes are saved automatically

## 🍎 Food Database

The app includes a comprehensive food database with:

- **Eggs**: Boiled, scrambled, fried, poached, raw, whites, yolks
- **Bread**: White, whole wheat, sourdough, rye, multigrain, bagel, pita, naan
- **Chicken**: Breast/thigh/wing (grilled/fried), drumstick, roasted
- **Potatoes**: Boiled, baked, mashed, fries, roasted, chips, sweet potato
- **Fruits**: Apple, banana, orange, grapes, berries, mango, pineapple, etc.
- **Pasta**: Spaghetti, penne, macaroni, lasagna, fettuccine, ravioli
- **Rice**: White, brown, jasmine, basmati, wild rice, fried rice
- **Vegetables**: Broccoli, carrot, spinach, tomato, cucumber, lettuce, etc.

## 🔧 Technical Features

### Calorie Calculation
- Uses Mifflin-St Jeor equation for BMR calculation
- Accounts for activity level multipliers
- Adjusts for weight loss/gain goals
- Minimum safe calorie threshold (1200 calories)

### Data Storage
- Local storage for user preferences
- Daily entries stored by date
- Persistent theme and language settings
- No server required - all data stays on your device

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Touch-friendly interface
- Optimized for all screen sizes

## 🌐 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🔒 Privacy

- All data is stored locally in your browser
- No data is sent to external servers
- No tracking or analytics
- Complete privacy and data ownership

## 🤝 Contributing

Contributions are welcome! Areas for improvement:
- Additional food items and categories
- More language translations
- Enhanced nutritional information
- Export/import functionality
- Meal planning features

## 📱 Future Enhancements

- Progressive Web App (PWA) capabilities
- Offline functionality
- Push notifications for reminders
- Barcode scanning for packaged foods
- Integration with fitness trackers
- Social sharing features
- Meal planning and recipes

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Font Awesome for icons
- Google Fonts for typography
- Modern CSS features for responsive design
- Web standards for accessibility

---

**Start your calorie tracking journey today with CalDef!** 🎯