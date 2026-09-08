const CalDefCalculator = (() => {
  const KCAL_PER_KG = 7700;
  const MAX_DAILY_DEFICIT = 1000;
  const MAX_DEFICIT_RATIO = 0.3;
  const MIN_CALORIES = {
    female: 1200,
    male: 1500
  };

  const timeGoalDays = {
    '4': 30,
    '8': 60,
    '12': 90,
    '24': 180,
    '52': 365,
    '1month': 30,
    '2months': 60,
    '3months': 90,
    '6months': 180,
    '1year': 365
  };

  function toKg(weight, unit) {
    return unit === 'lbs' ? weight * 0.453592 : weight;
  }

  function fromKg(weightKg, unit) {
    return unit === 'lbs' ? weightKg / 0.453592 : weightKg;
  }

  function toCm(height, unit) {
    return unit === 'in' ? height * 2.54 : height;
  }

  function getTimelineDays(timeGoal) {
    return timeGoalDays[timeGoal] || 84;
  }

  function calculateBmr(profile) {
    const weightKg = toKg(profile.currentWeight, profile.weightUnit);
    const heightCm = toCm(profile.height, profile.heightUnit);
    const genderOffset = profile.gender === 'male' ? 5 : -161;
    return Math.round((10 * weightKg) + (6.25 * heightCm) - (5 * profile.age) + genderOffset);
  }

  function addDays(date, days) {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next;
  }

  function calculatePlan(profile, now = new Date()) {
    const currentWeightKg = toKg(profile.currentWeight, profile.weightUnit);
    const targetWeightKg = toKg(profile.targetWeight, profile.targetWeightUnit || profile.weightUnit);
    const selectedTimelineDays = getTimelineDays(profile.timeGoal);
    const weightChangeKg = currentWeightKg - targetWeightKg;

    if (!Number.isFinite(weightChangeKg) || weightChangeKg <= 0) {
      throw new Error('For a calorie deficit plan, target weight must be lower than current weight.');
    }

    const bmr = calculateBmr(profile);
    const maintenanceCalories = Math.round(bmr * profile.activityLevel);
    const totalDeficitNeeded = weightChangeKg * KCAL_PER_KG;
    const requiredDailyDeficit = totalDeficitNeeded / selectedTimelineDays;
    const minCalories = MIN_CALORIES[profile.gender] || MIN_CALORIES.female;
    const maximumRecommendedDeficit = Math.min(MAX_DAILY_DEFICIT, Math.round(maintenanceCalories * MAX_DEFICIT_RATIO));
    const floorAllowedDeficit = Math.max(0, maintenanceCalories - minCalories);
    const roundedRequiredDailyDeficit = Math.round(requiredDailyDeficit);
    const actualDailyDeficit = Math.round(Math.min(requiredDailyDeficit, maximumRecommendedDeficit, floorAllowedDeficit));
    const targetCalories = Math.max(minCalories, maintenanceCalories - actualDailyDeficit);
    const realisticTimelineDays = actualDailyDeficit > 0
      ? Math.ceil(totalDeficitNeeded / actualDailyDeficit)
      : selectedTimelineDays;
    const isAdjustedForSafety = actualDailyDeficit < roundedRequiredDailyDeficit;
    const floorApplied = Math.round(targetCalories) <= minCalories;
    const limitingFactor = floorAllowedDeficit <= maximumRecommendedDeficit ? 'minimum calorie floor' : 'recommended deficit limit';
    const projectedLossKg = (actualDailyDeficit * selectedTimelineDays) / KCAL_PER_KG;
    const projectedWeightAtSelectedTimelineKg = Math.max(targetWeightKg, currentWeightKg - projectedLossKg);

    return {
      bmr,
      dailyCalories: maintenanceCalories,
      maintenanceCalories,
      targetCalories: Math.round(targetCalories),
      dailyCalorieAdjustment: actualDailyDeficit,
      requiredDailyDeficit: roundedRequiredDailyDeficit,
      maxRecommendedDeficit: maximumRecommendedDeficit,
      minimumCalories: minCalories,
      floorApplied,
      belowMinimumFloor: false,
      limitingFactor,
      selectedTimelineDays,
      realisticTimelineDays,
      daysRemaining: selectedTimelineDays,
      totalDeficitNeeded: Math.round(totalDeficitNeeded),
      currentWeightKg,
      targetWeightKg,
      projectedWeightAtSelectedTimelineKg,
      currentWeightDisplay: fromKg(currentWeightKg, profile.weightUnit),
      targetWeightDisplay: fromKg(targetWeightKg, profile.targetWeightUnit || profile.weightUnit),
      projectedWeightDisplay: fromKg(projectedWeightAtSelectedTimelineKg, profile.targetWeightUnit || profile.weightUnit),
      targetDate: addDays(now, realisticTimelineDays).toISOString(),
      selectedTimelineDate: addDays(now, selectedTimelineDays).toISOString(),
      isAdjustedForSafety
    };
  }

  return {
    calculatePlan,
    calculateBmr,
    getTimelineDays,
    toKg,
    fromKg,
    toCm
  };
})();

window.CalDefCalculator = CalDefCalculator;
