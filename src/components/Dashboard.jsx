import React, { useState, useEffect } from "react";
import styles from "./Dashboard.module.css";

function Dashboard() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [quote, setQuote] = useState("Loading...");
  const [joke, setJoke] = useState("Loading...");
  const [meal, setMeal] = useState({ name: "Loading...", image: "", instructions: "" });
  const [cocktail, setCocktail] = useState({ name: "Loading...", image: "", instructions: "" });

  const fetchQuote = async () => {
    try {
      // First try the primary API
      const response = await fetch("https://api.quotable.io/random");
      if (!response.ok) {
        throw new Error('First API Failed');
      }
      const data = await response.json();
      setQuote(data.content);
    } catch (error) {
      try {
        // Fallback to backup API
        const response = await fetch("https://api.goprogram.ai/inspiration");
        const data = await response.json();
        setQuote(data.quote);
      } catch (backupError) {
        // If both APIs fail, set a default quote
        setQuote("Life is what happens while you are busy making other plans. - John Lennon");
        console.error("Both quote APIs failed:", backupError);
      }
    }
  };

  useEffect(() => {
    // Time update
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    // Fetch quote with retry mechanism
    fetchQuote();

    // Fetch joke
    fetch("https://v2.jokeapi.dev/joke/Any?type=single")
      .then((res) => res.json())
      .then((data) => setJoke(data.joke))
      .catch(error => {
        console.error("Joke API failed:", error);
        setJoke("Why don't scientists trust atoms? Because they make up everything!");
      });

    // Fetch random meal
    fetch("https://www.themealdb.com/api/json/v1/1/random.php")
      .then((res) => res.json())
      .then((data) => {
        const mealData = data.meals[0];
        setMeal({
          name: mealData.strMeal,
          image: mealData.strMealThumb,
          instructions: mealData.strInstructions
        });
      })
      .catch(error => {
        console.error("Meal API failed:", error);
        setMeal({
          name: "Classic Spaghetti",
          image: "https://via.placeholder.com/200x200?text=Meal",
          instructions: "API currently unavailable. Please try again later."
        });
      });

    // Fetch random cocktail
    fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php")
      .then((res) => res.json())
      .then((data) => {
        const cocktailData = data.drinks[0];
        setCocktail({
          name: cocktailData.strDrink,
          image: cocktailData.strDrinkThumb,
          instructions: cocktailData.strInstructions
        });
      })
      .catch(error => {
        console.error("Cocktail API failed:", error);
        setCocktail({
          name: "Basic Mojito",
          image: "https://via.placeholder.com/200x200?text=Cocktail",
          instructions: "API currently unavailable. Please try again later."
        });
      });

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.header}>Welcome to the our site Dashboard</h1>
      <div className={styles.widgetContainer}>
        <div className={styles.widget}>
          <strong>Current Time:</strong> <br /> {time}
        </div>
        <div className={styles.widget}>
          <strong>Quote of the Day:</strong> <br /> {quote}
          {quote === "Loading..." && (
            <button 
              onClick={fetchQuote} 
              className={styles.retryButton}
            >
              Retry Loading Quote
            </button>
          )}
        </div>
        <div className={styles.widget}>
          <strong>Joke of the Day:</strong> <br /> {joke}
        </div>
        <div className={`${styles.widget} ${styles.foodWidget}`}>
          <strong>Meal of the Day:</strong>
          <h3>{meal.name}</h3>
          {meal.image && <img src={meal.image} alt={meal.name} className={styles.foodImage} />}
          <p className={styles.instructions}>{meal.instructions}</p>
        </div>
        <div className={`${styles.widget} ${styles.foodWidget}`}>
          <strong>Cocktail of the Day:</strong>
          <h3>{cocktail.name}</h3>
          {cocktail.image && (
            <img src={cocktail.image} alt={cocktail.name} className={styles.foodImage} />
          )}
          <p className={styles.instructions}>{cocktail.instructions}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;