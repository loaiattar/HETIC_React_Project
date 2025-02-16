import React, { useState, useEffect } from "react";
import styles from "./Dashboard.module.css";
import { useNavigate } from "react-router";

function Dashboard() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [quote, setQuote] = useState("Loading...");
  const [joke, setJoke] = useState("Loading...");
  const [meal, setMeal] = useState({
    name: "Loading...",
    image: "",
    instructions: "",
    category: "",
    area: ""
  });
  const [cocktail, setCocktail] = useState({
    name: "Loading...",
    image: "",
    instructions: "",
    category: "",
    glass: ""
  });
  const [documents, setDocuments] = useState([]);
  const navigate = useNavigate();

  const fetchQuote = async () => {
    try {
      const response = await fetch("https://api.quotable.io/random");
      if (!response.ok) throw new Error('First API Failed');
      const data = await response.json();
      setQuote(`${data.content} - ${data.author}`);
    } catch (error) {
      try {
        const response = await fetch("https://api.goprogram.ai/inspiration");
        const data = await response.json();
        setQuote(data.quote);
      } catch (backupError) {
        setQuote("Life is what happens while you are busy making other plans. - John Lennon");
        console.error("Quote APIs failed:", backupError);
      }
    }
  };

  useEffect(() => {
    // Time update
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    // Fetch quote
    fetchQuote();

    // Fetch joke
    fetch("https://v2.jokeapi.dev/joke/Programming,Miscellaneous,Pun?type=single")
      .then((res) => res.json())
      .then((data) => setJoke(data.joke))
      .catch(error => {
        console.error("Joke API failed:", error);
        setJoke("Why do programmers prefer dark mode? Because light attracts bugs!");
      });

    // Fetch random meal
    fetch("https://www.themealdb.com/api/json/v1/1/random.php")
      .then((res) => res.json())
      .then((data) => {
        const mealData = data.meals[0];
        setMeal({
          name: mealData.strMeal,
          image: mealData.strMealThumb,
          instructions: mealData.strInstructions,
          category: mealData.strCategory,
          area: mealData.strArea
        });
      })
      .catch(error => {
        console.error("Meal API failed:", error);
        setMeal({
          name: "Classic Margherita Pizza",
          image: "https://via.placeholder.com/300x300?text=Meal",
          instructions: "API currently unavailable. Please try again later.",
          category: "Pizza",
          area: "Italian"
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
          instructions: cocktailData.strInstructions,
          category: cocktailData.strCategory,
          glass: cocktailData.strGlass
        });
      })
      .catch(error => {
        console.error("Cocktail API failed:", error);
        setCocktail({
          name: "Classic Mojito",
          image: "https://via.placeholder.com/300x300?text=Cocktail",
          instructions: "API currently unavailable. Please try again later.",
          category: "Cocktail",
          glass: "Highball glass"
        });
      });

    return () => clearInterval(timer);
  }, []);

  function createFile() {
    const newDocumentTitle = prompt('Enter the name for your new file:');
    if (newDocumentTitle?.trim()) {
      setDocuments(prev => [...prev, newDocumentTitle.trim()]);
    }
  }

  function selectDocument() {
    navigate('/editor');
  }

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.header}>Welcome to the Dashboard</h1>

      <div className={styles.widgetContainer}>
        {/* Time Widget */}
        <div className={`${styles.widget} ${styles.timeWidget}`}>
          <h2 className={styles.widgetTitle}>Current Time</h2>
          <div className={styles.timeDisplay}>{time}</div>
        </div>

        {/* Quote Widget */}
        <div className={`${styles.widget} ${styles.quoteWidget}`}>
          <h2 className={styles.widgetTitle}>Quote of the Day</h2>
          <p className={styles.quoteText}>{quote}</p>
          {quote === "Loading..." && (
            <button onClick={fetchQuote} className={styles.retryButton}>
              Retry Loading Quote
            </button>
          )}
        </div>

        {/* Joke Widget */}
        <div className={`${styles.widget} ${styles.jokeWidget}`}>
          <h2 className={styles.widgetTitle}>Joke of the Day</h2>
          <p className={styles.jokeText}>{joke}</p>
        </div>

        {/* Meal Widget */}
        <div className={`${styles.widget} ${styles.foodWidget}`}>
          <h2 className={styles.widgetTitle}>Meal of the Day</h2>
          <div className={styles.recipeName}>{meal.name}</div>
          {meal.image && (
            <div className={styles.imageContainer}>
              <img src={meal.image} alt={meal.name} className={styles.foodImage} />
              <div className={styles.foodMeta}>
                <span>{meal.category}</span>
                {meal.area && <span>{meal.area} Cuisine</span>}
              </div>
            </div>
          )}
          <div className={styles.instructions}>{meal.instructions}</div>
        </div>

        {/* Cocktail Widget */}
        <div className={`${styles.widget} ${styles.foodWidget}`}>
          <h2 className={styles.widgetTitle}>Cocktail of the Day</h2>
          <div className={styles.recipeName}>{cocktail.name}</div>
          {cocktail.image && (
            <div className={styles.imageContainer}>
              <img src={cocktail.image} alt={cocktail.name} className={styles.foodImage} />
              <div className={styles.foodMeta}>
                <span>{cocktail.category}</span>
                {cocktail.glass && <span>Served in: {cocktail.glass}</span>}
              </div>
            </div>
          )}
          <div className={styles.instructions}>{cocktail.instructions}</div>
        </div>
      </div>

      <div className={styles.fileContainer}>
        <div className={styles.fileHeader}>
          <h2>Markdown Files</h2>
          <button onClick={createFile} className={styles.newFileBtn}>
            New File
          </button>
        </div>
        {documents.length > 0 ? (
          <ul className={styles.fileList}>
            {documents.map((document, index) => (
              <li key={index} className={styles.fileItem}>
                <button onClick={selectDocument} className={styles.fileBtn}>
                  {document}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.noFiles}>No files created yet. Create your first file!</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;