// Comprehensive food database with calorie information
const foodDatabase = {
  // Proteins
  egg: {
    name: "Egg",
    types: {
      boiled: { name: "Boiled", calories_per_100g: 155 },
      scrambled: { name: "Scrambled", calories_per_100g: 168 },
      fried: { name: "Fried", calories_per_100g: 196 },
      poached: { name: "Poached", calories_per_100g: 143 },
      raw: { name: "Raw", calories_per_100g: 143 },
      egg_white: { name: "Egg White Only", calories_per_100g: 52 },
      egg_yolk: { name: "Egg Yolk Only", calories_per_100g: 322 },
      omelet: { name: "Omelet", calories_per_100g: 154 },
      deviled: { name: "Deviled Egg", calories_per_100g: 158 },
      benedict: { name: "Eggs Benedict", calories_per_100g: 230 }
    }
  },
  chicken: {
    name: "Chicken",
    types: {
      breast_grilled: { name: "Breast (Grilled)", calories_per_100g: 165 },
      breast_fried: { name: "Breast (Fried)", calories_per_100g: 246 },
      thigh_grilled: { name: "Thigh (Grilled)", calories_per_100g: 209 },
      thigh_fried: { name: "Thigh (Fried)", calories_per_100g: 280 },
      wing_grilled: { name: "Wing (Grilled)", calories_per_100g: 203 },
      wing_fried: { name: "Wing (Fried)", calories_per_100g: 290 },
      drumstick: { name: "Drumstick", calories_per_100g: 172 },
      roasted: { name: "Roasted Chicken", calories_per_100g: 239 },
      nuggets: { name: "Chicken Nuggets", calories_per_100g: 296 },
      teriyaki: { name: "Teriyaki Chicken", calories_per_100g: 180 },
      parmesan: { name: "Chicken Parmesan", calories_per_100g: 320 },
      curry: { name: "Chicken Curry", calories_per_100g: 210 }
    }
  },
  beef: {
    name: "Beef",
    types: {
      sirloin_steak: { name: "Sirloin Steak", calories_per_100g: 271 },
      ground_beef: { name: "Ground Beef", calories_per_100g: 250 },
      ribeye: { name: "Ribeye Steak", calories_per_100g: 291 },
      tenderloin: { name: "Beef Tenderloin", calories_per_100g: 348 },
      brisket: { name: "Beef Brisket", calories_per_100g: 217 },
      roast_beef: { name: "Roast Beef", calories_per_100g: 245 },
      meatballs: { name: "Beef Meatballs", calories_per_100g: 227 },
      burger_patty: { name: "Burger Patty", calories_per_100g: 254 },
      stir_fry: { name: "Beef Stir Fry", calories_per_100g: 213 },
      stew: { name: "Beef Stew", calories_per_100g: 201 }
    }
  },
  pork: {
    name: "Pork",
    types: {
      chop: { name: "Pork Chop", calories_per_100g: 231 },
      tenderloin: { name: "Pork Tenderloin", calories_per_100g: 143 },
      bacon: { name: "Bacon", calories_per_100g: 541 },
      ham: { name: "Ham", calories_per_100g: 145 },
      sausage: { name: "Pork Sausage", calories_per_100g: 301 },
      ribs: { name: "Pork Ribs", calories_per_100g: 277 },
      pulled_pork: { name: "Pulled Pork", calories_per_100g: 250 },
      carnitas: { name: "Carnitas", calories_per_100g: 265 },
      schnitzel: { name: "Pork Schnitzel", calories_per_100g: 340 },
      char_siu: { name: "Char Siu", calories_per_100g: 280 }
    }
  },
  fish: {
    name: "Fish",
    types: {
      salmon: { name: "Salmon", calories_per_100g: 208 },
      tuna: { name: "Tuna", calories_per_100g: 144 },
      cod: { name: "Cod", calories_per_100g: 105 },
      tilapia: { name: "Tilapia", calories_per_100g: 128 },
      mackerel: { name: "Mackerel", calories_per_100g: 305 },
      sardines: { name: "Sardines", calories_per_100g: 208 },
      halibut: { name: "Halibut", calories_per_100g: 140 },
      mahi_mahi: { name: "Mahi Mahi", calories_per_100g: 109 },
      sea_bass: { name: "Sea Bass", calories_per_100g: 124 },
      trout: { name: "Trout", calories_per_100g: 190 }
    }
  },
  seafood: {
    name: "Seafood",
    types: {
      shrimp: { name: "Shrimp", calories_per_100g: 99 },
      crab: { name: "Crab", calories_per_100g: 97 },
      lobster: { name: "Lobster", calories_per_100g: 89 },
      scallops: { name: "Scallops", calories_per_100g: 137 },
      mussels: { name: "Mussels", calories_per_100g: 172 },
      oysters: { name: "Oysters", calories_per_100g: 68 },
      clams: { name: "Clams", calories_per_100g: 148 },
      crawfish: { name: "Crawfish", calories_per_100g: 87 },
      squid: { name: "Squid", calories_per_100g: 92 },
      octopus: { name: "Octopus", calories_per_100g: 82 }
    }
  },
  
  // Carbohydrates
  bread: {
    name: "Bread",
    types: {
      white: { name: "White Bread", calories_per_100g: 265 },
      whole_wheat: { name: "Whole Wheat", calories_per_100g: 247 },
      sourdough: { name: "Sourdough", calories_per_100g: 289 },
      rye: { name: "Rye Bread", calories_per_100g: 259 },
      multigrain: { name: "Multigrain", calories_per_100g: 265 },
      bagel: { name: "Bagel", calories_per_100g: 257 },
      pita: { name: "Pita Bread", calories_per_100g: 275 },
      naan: { name: "Naan", calories_per_100g: 310 },
      croissant: { name: "Croissant", calories_per_100g: 406 },
      baguette: { name: "Baguette", calories_per_100g: 272 },
      focaccia: { name: "Focaccia", calories_per_100g: 271 }
    }
  },
  pasta: {
    name: "Pasta",
    types: {
      spaghetti_cooked: { name: "Spaghetti (Cooked)", calories_per_100g: 131 },
      spaghetti_dry: { name: "Spaghetti (Dry)", calories_per_100g: 371 },
      penne_cooked: { name: "Penne (Cooked)", calories_per_100g: 131 },
      penne_dry: { name: "Penne (Dry)", calories_per_100g: 371 },
      macaroni_cooked: { name: "Macaroni (Cooked)", calories_per_100g: 131 },
      lasagna: { name: "Lasagna", calories_per_100g: 135 },
      fettuccine: { name: "Fettuccine", calories_per_100g: 131 },
      ravioli: { name: "Ravioli", calories_per_100g: 175 },
      gnocchi: { name: "Gnocchi", calories_per_100g: 131 },
      linguine: { name: "Linguine", calories_per_100g: 131 },
      carbonara: { name: "Pasta Carbonara", calories_per_100g: 540 },
      bolognese: { name: "Pasta Bolognese", calories_per_100g: 151 }
    }
  },
  rice: {
    name: "Rice",
    types: {
      white_cooked: { name: "White Rice (Cooked)", calories_per_100g: 130 },
      white_dry: { name: "White Rice (Dry)", calories_per_100g: 365 },
      brown_cooked: { name: "Brown Rice (Cooked)", calories_per_100g: 111 },
      brown_dry: { name: "Brown Rice (Dry)", calories_per_100g: 370 },
      jasmine: { name: "Jasmine Rice", calories_per_100g: 130 },
      basmati: { name: "Basmati Rice", calories_per_100g: 121 },
      wild_rice: { name: "Wild Rice", calories_per_100g: 101 },
      fried_rice: { name: "Fried Rice", calories_per_100g: 163 },
      risotto: { name: "Risotto", calories_per_100g: 166 },
      sushi_rice: { name: "Sushi Rice", calories_per_100g: 130 },
      coconut_rice: { name: "Coconut Rice", calories_per_100g: 180 },
      pilaf: { name: "Rice Pilaf", calories_per_100g: 158 }
    }
  },
  potato: {
    name: "Potato",
    types: {
      boiled: { name: "Boiled", calories_per_100g: 87 },
      baked: { name: "Baked", calories_per_100g: 93 },
      mashed: { name: "Mashed", calories_per_100g: 113 },
      french_fries: { name: "French Fries", calories_per_100g: 365 },
      roasted: { name: "Roasted", calories_per_100g: 149 },
      chips: { name: "Potato Chips", calories_per_100g: 536 },
      sweet_potato: { name: "Sweet Potato", calories_per_100g: 86 },
      hash_browns: { name: "Hash Browns", calories_per_100g: 326 }
    }
  },
  
  // Fruits
  fruit: {
    name: "Fruit",
    types: {
      apple: { name: "Apple", calories_per_100g: 52 },
      banana: { name: "Banana", calories_per_100g: 89 },
      orange: { name: "Orange", calories_per_100g: 47 },
      grapes: { name: "Grapes", calories_per_100g: 62 },
      strawberry: { name: "Strawberry", calories_per_100g: 32 },
      blueberry: { name: "Blueberry", calories_per_100g: 57 },
      mango: { name: "Mango", calories_per_100g: 60 },
      pineapple: { name: "Pineapple", calories_per_100g: 50 },
      watermelon: { name: "Watermelon", calories_per_100g: 30 },
      avocado: { name: "Avocado", calories_per_100g: 160 },
      kiwi: { name: "Kiwi", calories_per_100g: 61 },
      peach: { name: "Peach", calories_per_100g: 39 },
      pear: { name: "Pear", calories_per_100g: 57 },
      cherry: { name: "Cherry", calories_per_100g: 63 },
      coconut: { name: "Coconut", calories_per_100g: 354 }
    }
  },
  
  // Vegetables
  vegetable: {
    name: "Vegetable",
    types: {
      broccoli: { name: "Broccoli", calories_per_100g: 34 },
      carrot: { name: "Carrot", calories_per_100g: 41 },
      spinach: { name: "Spinach", calories_per_100g: 23 },
      tomato: { name: "Tomato", calories_per_100g: 18 },
      cucumber: { name: "Cucumber", calories_per_100g: 16 },
      lettuce: { name: "Lettuce", calories_per_100g: 15 },
      bell_pepper: { name: "Bell Pepper", calories_per_100g: 31 },
      onion: { name: "Onion", calories_per_100g: 40 },
      corn: { name: "Corn", calories_per_100g: 86 },
      peas: { name: "Peas", calories_per_100g: 81 },
      garlic: { name: "Garlic", calories_per_100g: 149 },
      cabbage: { name: "Cabbage", calories_per_100g: 25 },
      cauliflower: { name: "Cauliflower", calories_per_100g: 25 },
      mushroom: { name: "Mushroom", calories_per_100g: 22 },
      zucchini: { name: "Zucchini", calories_per_100g: 17 }
    }
  },
  
  // Beverages
  coffee: {
    name: "Coffee",
    types: {
      black_coffee: { name: "Black Coffee", calories_per_100g: 2 },
      espresso: { name: "Espresso", calories_per_100g: 9 },
      americano: { name: "Americano", calories_per_100g: 15 },
      latte: { name: "Latte", calories_per_100g: 190 },
      cappuccino: { name: "Cappuccino", calories_per_100g: 120 },
      macchiato: { name: "Macchiato", calories_per_100g: 13 },
      mocha: { name: "Mocha", calories_per_100g: 290 },
      frappuccino: { name: "Frappuccino", calories_per_100g: 240 },
      cold_brew: { name: "Cold Brew", calories_per_100g: 5 },
      iced_coffee: { name: "Iced Coffee", calories_per_100g: 5 }
    }
  },
  tea: {
    name: "Tea",
    types: {
      green_tea: { name: "Green Tea", calories_per_100g: 2 },
      black_tea: { name: "Black Tea", calories_per_100g: 2 },
      oolong_tea: { name: "Oolong Tea", calories_per_100g: 2 },
      white_tea: { name: "White Tea", calories_per_100g: 2 },
      herbal_tea: { name: "Herbal Tea", calories_per_100g: 2 },
      chai_tea: { name: "Chai Tea", calories_per_100g: 50 },
      earl_grey: { name: "Earl Grey", calories_per_100g: 2 },
      jasmine_tea: { name: "Jasmine Tea", calories_per_100g: 2 },
      matcha: { name: "Matcha", calories_per_100g: 5 },
      milk_tea: { name: "Milk Tea", calories_per_100g: 250 }
    }
  },
  juice: {
    name: "Juice",
    types: {
      orange_juice: { name: "Orange Juice", calories_per_100g: 112 },
      apple_juice: { name: "Apple Juice", calories_per_100g: 114 },
      grape_juice: { name: "Grape Juice", calories_per_100g: 152 },
      cranberry_juice: { name: "Cranberry Juice", calories_per_100g: 116 },
      tomato_juice: { name: "Tomato Juice", calories_per_100g: 41 },
      carrot_juice: { name: "Carrot Juice", calories_per_100g: 94 },
      pineapple_juice: { name: "Pineapple Juice", calories_per_100g: 132 },
      grapefruit_juice: { name: "Grapefruit Juice", calories_per_100g: 96 },
      pomegranate_juice: { name: "Pomegranate Juice", calories_per_100g: 134 },
      lemon_juice: { name: "Lemon Juice", calories_per_100g: 22 }
    }
  },
  
  // Dairy
  milk: {
    name: "Milk",
    types: {
      whole_milk: { name: "Whole Milk", calories_per_100g: 61 },
      skim_milk: { name: "Skim Milk", calories_per_100g: 34 },
      two_percent_milk: { name: "2% Milk", calories_per_100g: 50 },
      almond_milk: { name: "Almond Milk", calories_per_100g: 17 },
      soy_milk: { name: "Soy Milk", calories_per_100g: 33 },
      coconut_milk: { name: "Coconut Milk", calories_per_100g: 230 },
      oat_milk: { name: "Oat Milk", calories_per_100g: 47 },
      rice_milk: { name: "Rice Milk", calories_per_100g: 47 },
      goat_milk: { name: "Goat Milk", calories_per_100g: 69 },
      buttermilk: { name: "Buttermilk", calories_per_100g: 40 }
    }
  },
  cheese: {
    name: "Cheese",
    types: {
      cheddar: { name: "Cheddar Cheese", calories_per_100g: 403 },
      mozzarella: { name: "Mozzarella", calories_per_100g: 300 },
      swiss: { name: "Swiss Cheese", calories_per_100g: 380 },
      parmesan: { name: "Parmesan", calories_per_100g: 431 },
      brie: { name: "Brie", calories_per_100g: 334 },
      goat_cheese: { name: "Goat Cheese", calories_per_100g: 364 },
      feta: { name: "Feta Cheese", calories_per_100g: 264 },
      blue_cheese: { name: "Blue Cheese", calories_per_100g: 353 },
      cream_cheese: { name: "Cream Cheese", calories_per_100g: 342 },
      cottage_cheese: { name: "Cottage Cheese", calories_per_100g: 98 }
    }
  },
  
  // Snacks & Desserts
  snacks: {
    name: "Snacks",
    types: {
      nuts_mixed: { name: "Mixed Nuts", calories_per_100g: 607 },
      almonds: { name: "Almonds", calories_per_100g: 579 },
      peanuts: { name: "Peanuts", calories_per_100g: 567 },
      cashews: { name: "Cashews", calories_per_100g: 553 },
      walnuts: { name: "Walnuts", calories_per_100g: 654 },
      pistachios: { name: "Pistachios", calories_per_100g: 560 },
      trail_mix: { name: "Trail Mix", calories_per_100g: 462 },
      granola_bar: { name: "Granola Bar", calories_per_100g: 471 },
      protein_bar: { name: "Protein Bar", calories_per_100g: 456 },
      crackers: { name: "Crackers", calories_per_100g: 502 },
      potato_chips: { name: "Potato Chips", calories_per_100g: 536 },
      tortilla_chips: { name: "Tortilla Chips", calories_per_100g: 489 },
      popcorn: { name: "Popcorn", calories_per_100g: 387 },
      pretzels: { name: "Pretzels", calories_per_100g: 380 },
      rice_cakes: { name: "Rice Cakes", calories_per_100g: 387 }
    }
  },
  dessert: {
    name: "Dessert",
    types: {
      ice_cream: { name: "Ice Cream", calories_per_100g: 207 },
      chocolate_cake: { name: "Chocolate Cake", calories_per_100g: 371 },
      cheesecake: { name: "Cheesecake", calories_per_100g: 321 },
      cookies: { name: "Cookies", calories_per_100g: 502 },
      donut: { name: "Donut", calories_per_100g: 452 },
      muffin: { name: "Muffin", calories_per_100g: 377 },
      pie: { name: "Pie", calories_per_100g: 237 },
      brownie: { name: "Brownie", calories_per_100g: 466 },
      pudding: { name: "Pudding", calories_per_100g: 155 },
      gelato: { name: "Gelato", calories_per_100g: 160 },
      sorbet: { name: "Sorbet", calories_per_100g: 134 },
      frozen_yogurt: { name: "Frozen Yogurt", calories_per_100g: 127 },
      mochi: { name: "Mochi", calories_per_100g: 96 },
      tiramisu: { name: "Tiramisu", calories_per_100g: 240 },
      macaron: { name: "Macaron", calories_per_100g: 300 }
    }
  },
  
  // Main Dishes
  pizza: {
    name: "Pizza",
    types: {
      margherita: { name: "Margherita Pizza", calories_per_100g: 266 },
      pepperoni: { name: "Pepperoni Pizza", calories_per_100g: 298 },
      supreme: { name: "Supreme Pizza", calories_per_100g: 315 },
      hawaiian: { name: "Hawaiian Pizza", calories_per_100g: 285 },
      meat_lovers: { name: "Meat Lovers Pizza", calories_per_100g: 340 },
      veggie: { name: "Veggie Pizza", calories_per_100g: 235 },
      bbq_chicken: { name: "BBQ Chicken Pizza", calories_per_100g: 290 },
      white_sauce: { name: "White Sauce Pizza", calories_per_100g: 280 },
      buffalo_chicken: { name: "Buffalo Chicken Pizza", calories_per_100g: 305 },
      four_cheese: { name: "Four Cheese Pizza", calories_per_100g: 320 }
    }
  },
  sandwich: {
    name: "Sandwich",
    types: {
      blt: { name: "BLT Sandwich", calories_per_100g: 250 },
      club: { name: "Club Sandwich", calories_per_100g: 280 },
      grilled_cheese: { name: "Grilled Cheese", calories_per_100g: 350 },
      turkey: { name: "Turkey Sandwich", calories_per_100g: 220 },
      ham: { name: "Ham Sandwich", calories_per_100g: 240 },
      tuna: { name: "Tuna Sandwich", calories_per_100g: 260 },
      chicken_salad: { name: "Chicken Salad Sandwich", calories_per_100g: 290 },
      pbj: { name: "Peanut Butter & Jelly", calories_per_100g: 380 },
      reuben: { name: "Reuben Sandwich", calories_per_100g: 320 },
      philly_cheesesteak: { name: "Philly Cheesesteak", calories_per_100g: 340 }
    }
  },
  soup: {
    name: "Soup",
    types: {
      chicken_noodle: { name: "Chicken Noodle Soup", calories_per_100g: 62 },
      tomato: { name: "Tomato Soup", calories_per_100g: 74 },
      vegetable: { name: "Vegetable Soup", calories_per_100g: 48 },
      minestrone: { name: "Minestrone", calories_per_100g: 36 },
      clam_chowder: { name: "Clam Chowder", calories_per_100g: 95 },
      split_pea: { name: "Split Pea Soup", calories_per_100g: 118 },
      mushroom: { name: "Mushroom Soup", calories_per_100g: 85 },
      french_onion: { name: "French Onion Soup", calories_per_100g: 57 },
      beef_stew: { name: "Beef Stew", calories_per_100g: 201 },
      chicken_broth: { name: "Chicken Broth", calories_per_100g: 38 }
     }
   },
   
   // International Cuisines
   all_over_the_cuisines: {
     name: "All Over the Cuisines",
     types: {
       fried_rice: { name: "Fried Rice", calories_per_100g: 163, recipe: "Stir-fry cooked rice with vegetables, eggs, and soy sauce" },
       pad_thai: { name: "Pad Thai", calories_per_100g: 153, recipe: "Thai stir-fried rice noodles with shrimp, tofu, bean sprouts, and tamarind sauce" },
       sushi: { name: "Sushi", calories_per_100g: 142, recipe: "Vinegared rice with raw fish, vegetables, and nori seaweed" },
       ramen: { name: "Ramen", calories_per_100g: 436, recipe: "Japanese noodle soup with broth, meat, and vegetables" },
       dim_sum: { name: "Dim Sum", calories_per_100g: 250, recipe: "Chinese small plates including dumplings, buns, and rolls" },
       pho: { name: "Pho", calories_per_100g: 62, recipe: "Vietnamese noodle soup with beef or chicken broth" },
       bibimbap: { name: "Bibimbap", calories_per_100g: 121, recipe: "Korean mixed rice bowl with vegetables, meat, and gochujang" },
       curry: { name: "Asian Curry", calories_per_100g: 180, recipe: "Spiced curry with coconut milk, vegetables, and protein" },
       spring_rolls: { name: "Spring Rolls", calories_per_100g: 140, recipe: "Fresh or fried rolls with vegetables and protein" },
       teriyaki: { name: "Teriyaki", calories_per_100g: 180, recipe: "Grilled meat or fish glazed with sweet soy-based sauce" },
       hamburger: { name: "Hamburger", calories_per_100g: 295, recipe: "Ground beef patty with lettuce, tomato, onion on a bun" },
       hot_dog: { name: "Hot Dog", calories_per_100g: 290, recipe: "Grilled sausage in a bun with mustard and ketchup" },
       bbq_ribs: { name: "BBQ Ribs", calories_per_100g: 277, recipe: "Slow-cooked pork ribs with barbecue sauce" },
       mac_cheese: { name: "Mac and Cheese", calories_per_100g: 164, recipe: "Macaroni pasta with cheese sauce" },
       fried_chicken: { name: "Fried Chicken", calories_per_100g: 320, recipe: "Chicken pieces coated in seasoned flour and deep-fried" },
       apple_pie: { name: "Apple Pie", calories_per_100g: 237, recipe: "Pastry crust filled with spiced apples" },
       pancakes: { name: "Pancakes", calories_per_100g: 227, recipe: "Fluffy breakfast cakes served with syrup" },
       buffalo_wings: { name: "Buffalo Wings", calories_per_100g: 290, recipe: "Chicken wings tossed in spicy buffalo sauce" },
       coleslaw: { name: "Coleslaw", calories_per_100g: 152, recipe: "Shredded cabbage and carrots with mayonnaise dressing" },
       cornbread: { name: "Cornbread", calories_per_100g: 307, recipe: "Sweet bread made with cornmeal" },
       hummus: { name: "Hummus", calories_per_100g: 166, recipe: "Chickpea dip with tahini, olive oil, and garlic" },
       greek_salad: { name: "Greek Salad", calories_per_100g: 150, recipe: "Tomatoes, cucumbers, olives, feta cheese with olive oil" },
       falafel: { name: "Falafel", calories_per_100g: 333, recipe: "Deep-fried chickpea balls with herbs and spices" },
       moussaka: { name: "Moussaka", calories_per_100g: 180, recipe: "Layered casserole with eggplant, meat, and béchamel sauce" },
       tzatziki: { name: "Tzatziki", calories_per_100g: 133, recipe: "Greek yogurt dip with cucumber, garlic, and dill" },
       paella: { name: "Paella", calories_per_100g: 172, recipe: "Spanish rice dish with saffron, seafood, and vegetables" },
       tabbouleh: { name: "Tabbouleh", calories_per_100g: 36, recipe: "Parsley salad with tomatoes, mint, and bulgur" },
       baklava: { name: "Baklava", calories_per_100g: 307, recipe: "Layered pastry with nuts and honey syrup" },
       dolmas: { name: "Dolmas", calories_per_100g: 180, recipe: "Grape leaves stuffed with rice and herbs" },
       spanakopita: { name: "Spanakopita", calories_per_100g: 259, recipe: "Greek spinach and feta pie in phyllo pastry" },
       tacos: { name: "Tacos", calories_per_100g: 226, recipe: "Corn or flour tortillas filled with meat, vegetables, and salsa" },
       burritos: { name: "Burritos", calories_per_100g: 206, recipe: "Large flour tortilla wrapped around rice, beans, and meat" },
       quesadillas: { name: "Quesadillas", calories_per_100g: 281, recipe: "Grilled tortillas filled with cheese and other ingredients" },
       guacamole: { name: "Guacamole", calories_per_100g: 160, recipe: "Mashed avocado dip with lime, onion, and cilantro" },
       enchiladas: { name: "Enchiladas", calories_per_100g: 200, recipe: "Rolled tortillas filled with meat and covered in sauce" },
       nachos: { name: "Nachos", calories_per_100g: 346, recipe: "Tortilla chips topped with cheese, jalapeños, and toppings" },
       salsa: { name: "Salsa", calories_per_100g: 36, recipe: "Fresh tomato sauce with onions, peppers, and cilantro" },
       churros: { name: "Churros", calories_per_100g: 312, recipe: "Fried dough pastry rolled in cinnamon sugar" },
       pozole: { name: "Pozole", calories_per_100g: 85, recipe: "Traditional soup with hominy, meat, and chili peppers" },
       mole: { name: "Mole", calories_per_100g: 150, recipe: "Complex sauce with chocolate, chili peppers, and spices" },
       pizza_margherita: { name: "Pizza Margherita", calories_per_100g: 266, recipe: "Pizza with tomato sauce, mozzarella, and fresh basil" },
       spaghetti_carbonara: { name: "Spaghetti Carbonara", calories_per_100g: 540, recipe: "Pasta with eggs, cheese, pancetta, and black pepper" },
       lasagna: { name: "Lasagna", calories_per_100g: 135, recipe: "Layered pasta with meat sauce, cheese, and béchamel" },
       risotto: { name: "Risotto", calories_per_100g: 166, recipe: "Creamy rice dish cooked with broth and cheese" },
       bruschetta: { name: "Bruschetta", calories_per_100g: 195, recipe: "Grilled bread topped with tomatoes, garlic, and basil" },
       tiramisu: { name: "Tiramisu", calories_per_100g: 240, recipe: "Coffee-flavored dessert with mascarpone and ladyfingers" },
       minestrone: { name: "Minestrone", calories_per_100g: 36, recipe: "Vegetable soup with beans, pasta, and herbs" },
       osso_buco: { name: "Osso Buco", calories_per_100g: 200, recipe: "Braised veal shanks with vegetables and wine" },
       gelato: { name: "Gelato", calories_per_100g: 160, recipe: "Italian ice cream with intense flavors and smooth texture" },
       pesto: { name: "Pesto", calories_per_100g: 263, recipe: "Sauce made with basil, garlic, pine nuts, and olive oil" },
       chicken_curry: { name: "Chicken Curry", calories_per_100g: 210, recipe: "Chicken cooked in spiced tomato and onion gravy" },
       biryani: { name: "Biryani", calories_per_100g: 200, recipe: "Fragrant rice dish with meat, vegetables, and spices" },
       naan: { name: "Naan", calories_per_100g: 310, recipe: "Leavened flatbread baked in a tandoor oven" },
       dal: { name: "Dal", calories_per_100g: 116, recipe: "Lentil curry with turmeric, cumin, and other spices" },
       samosa: { name: "Samosa", calories_per_100g: 308, recipe: "Fried pastry filled with spiced potatoes and peas" },
       tandoori_chicken: { name: "Tandoori Chicken", calories_per_100g: 190, recipe: "Chicken marinated in yogurt and spices, cooked in tandoor" },
       masala_chai: { name: "Masala Chai", calories_per_100g: 50, recipe: "Spiced tea with milk, cardamom, cinnamon, and ginger" },
       paneer_tikka: { name: "Paneer Tikka", calories_per_100g: 250, recipe: "Grilled cottage cheese cubes with spices" },
       raita: { name: "Raita", calories_per_100g: 60, recipe: "Yogurt-based side dish with cucumber and mint" },
       gulab_jamun: { name: "Gulab Jamun", calories_per_100g: 387, recipe: "Sweet milk dumplings in sugar syrup" },
       croissant: { name: "Croissant", calories_per_100g: 406, recipe: "Buttery, flaky pastry made with laminated dough" },
       coq_au_vin: { name: "Coq au Vin", calories_per_100g: 180, recipe: "Chicken braised in wine with mushrooms and onions" },
       ratatouille: { name: "Ratatouille", calories_per_100g: 32, recipe: "Vegetable stew with eggplant, zucchini, and tomatoes" },
       bouillabaisse: { name: "Bouillabaisse", calories_per_100g: 90, recipe: "Traditional fish stew from Marseille" },
       quiche_lorraine: { name: "Quiche Lorraine", calories_per_100g: 243, recipe: "Savory tart with eggs, cream, and bacon" },
       crème_brûlée: { name: "Crème Brûlée", calories_per_100g: 340, recipe: "Custard dessert with caramelized sugar top" },
       french_onion_soup: { name: "French Onion Soup", calories_per_100g: 57, recipe: "Onion soup topped with cheese and bread" },
       escargot: { name: "Escargot", calories_per_100g: 90, recipe: "Snails cooked in garlic butter and herbs" },
       beef_bourguignon: { name: "Beef Bourguignon", calories_per_100g: 201, recipe: "Beef stewed in red wine with vegetables" },
       macarons: { name: "Macarons", calories_per_100g: 300, recipe: "Delicate sandwich cookies with ganache filling" }
     }
   }
 };

// Unit conversion factors (to grams)
const unitConversions = {
  g: 1,
  kg: 1000,
  pcs: {
    // Average weights for common items in grams
    egg: 50,
    bread: 25, // slice
    apple: 182,
    banana: 118,
    orange: 154,
    potato: 150, // medium
    chicken_breast: 174,
    default: 100
  },
  cup: {
    // Cup measurements in grams (varies by food type)
    rice_cooked: 195,
    rice_dry: 185,
    pasta_cooked: 140,
    pasta_dry: 100,
    flour: 120,
    sugar: 200,
    milk: 240,
    water: 240,
    vegetables_chopped: 150,
    fruit_chopped: 150,
    default: 150
  },
  tbsp: {
    // Tablespoon measurements in grams
    oil: 14,
    butter: 14,
    sugar: 12,
    flour: 8,
    honey: 21,
    milk: 15,
    water: 15,
    default: 15
  }
};

// Food calculation utilities
class FoodCalculator {
  static getCalories(category, type, quantity, unit) {
    const food = foodDatabase[category];
    if (!food || !food.types[type]) {
      return 0;
    }

    const caloriesPerGram = food.types[type].calories_per_100g / 100;
    const weightInGrams = this.convertToGrams(quantity, unit, category, type);
    
    return Math.round(caloriesPerGram * weightInGrams);
  }

  static convertToGrams(quantity, unit, category = null, type = null) {
    if (unit === 'g') {
      return quantity;
    }
    
    if (unit === 'kg') {
      return quantity * 1000;
    }
    
    if (unit === 'pcs') {
      // Use specific weights for different food items
      let pieceWeight = unitConversions.pcs.default;
      
      if (category === 'egg') {
        pieceWeight = unitConversions.pcs.egg;
      } else if (category === 'bread') {
        pieceWeight = unitConversions.pcs.bread;
      } else if (category === 'fruit') {
        if (type === 'apple') pieceWeight = unitConversions.pcs.apple;
        else if (type === 'banana') pieceWeight = unitConversions.pcs.banana;
        else if (type === 'orange') pieceWeight = unitConversions.pcs.orange;
      } else if (category === 'potato') {
        pieceWeight = unitConversions.pcs.potato;
      } else if (category === 'chicken') {
        pieceWeight = unitConversions.pcs.chicken_breast;
      }
      
      return quantity * pieceWeight;
    }
    
    if (unit === 'cup') {
      let cupWeight = unitConversions.cup.default;
      
      if (category === 'rice') {
        cupWeight = type.includes('cooked') ? 
          unitConversions.cup.rice_cooked : unitConversions.cup.rice_dry;
      } else if (category === 'pasta') {
        cupWeight = type.includes('cooked') ? 
          unitConversions.cup.pasta_cooked : unitConversions.cup.pasta_dry;
      } else if (category === 'vegetable') {
        cupWeight = unitConversions.cup.vegetables_chopped;
      } else if (category === 'fruit') {
        cupWeight = unitConversions.cup.fruit_chopped;
      }
      
      return quantity * cupWeight;
    }
    
    if (unit === 'tbsp') {
      return quantity * unitConversions.tbsp.default;
    }
    
    return quantity; // fallback
  }

  static getFoodTypes(category) {
    const food = foodDatabase[category];
    return food ? food.types : {};
  }

  static getAllCategories() {
    return Object.keys(foodDatabase);
  }

  static getFoodName(category, type) {
    const food = foodDatabase[category];
    if (food && food.types[type]) {
      return food.types[type].name;
    }
    return '';
  }

  static getCategoryName(category) {
    const food = foodDatabase[category];
    return food ? food.name : '';
  }

  // Get nutritional information (calories per 100g)
  static getNutritionalInfo(category, type) {
    const food = foodDatabase[category];
    if (food && food.types[type]) {
      return {
        calories_per_100g: food.types[type].calories_per_100g,
        name: food.types[type].name,
        category: food.name
      };
    }
    return null;
  }

  // Search foods by name
  static searchFoods(query) {
    const results = [];
    const searchTerm = query.toLowerCase();
    
    Object.keys(foodDatabase).forEach(category => {
      const food = foodDatabase[category];
      
      // Search in category name
      if (food.name.toLowerCase().includes(searchTerm)) {
        Object.keys(food.types).forEach(typeKey => {
          results.push({
            category,
            type: typeKey,
            name: food.types[typeKey].name,
            categoryName: food.name,
            calories_per_100g: food.types[typeKey].calories_per_100g
          });
        });
      } else {
        // Search in food type names
        Object.keys(food.types).forEach(typeKey => {
          const foodType = food.types[typeKey];
          if (foodType.name.toLowerCase().includes(searchTerm)) {
            results.push({
              category,
              type: typeKey,
              name: foodType.name,
              categoryName: food.name,
              calories_per_100g: foodType.calories_per_100g
            });
          }
        });
      }
    });
    
    return results;
  }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { foodDatabase, unitConversions, FoodCalculator };
}