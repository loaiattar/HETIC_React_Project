import React, { useState, useEffect } from "react";
import styles from "./Dashboard.module.css";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [quote, setQuote] = useState("Loading...");
  const [joke, setJoke] = useState("Loading...");
  const [meal, setMeal] = useState({ name: "Loading...", image: "", instructions: "" });
  const [cocktail, setCocktail] = useState({ name: "Loading...", image: "", instructions: "" });
  const [documents, setDocuments] = useState([]);
  const [events, setEvents] = useState([]);
  const [location, setLocation] = useState({ city: "Loading...", country: "Loading..." });
  const navigate = useNavigate();

     // get your location API
  const fetchUserLocation = async () => {
    try {
      const res = await fetch("http://ip-api.com/json/");
      const data = await res.json();
      if (data.status === "success") {
        setLocation({ city: data.city, country: data.country });
      } else {
        throw new Error("Location API failed");
      }
    } catch (error) {
      console.error("Failed to fetch location", error);
      setLocation({ city: "Unknown", country: "Unknown" });
    }
  };
  

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
       // one function de handel all data API
    const fetchData = async () => {
      try {
        const quoteRes = await fetch('https://type.fit/api/quotes');
        if (!quoteRes.ok) throw new Error("Quote API Failed");
        const quoteData = await quoteRes.json();
        setQuote(`${quoteData.content} - ${quoteData.author}`);
      } catch (error) {
        console.warn("Quote API failed:", error);
        setQuote("Life is what happens while you are busy making other plans. - John Lennon");
      }
      try {
        const today = new Date();
        const month = today.getMonth() + 1;
        const day = today.getDate();
        const historyRes = await fetch(`https://byabbe.se/on-this-day/${month}/${day}/events.json`); // to get only day and month events
        if (!historyRes.ok) throw new Error("historical events API failed");
        const historyData = await historyRes.json();
        const selectedEvents = historyData.events.slice(0, 3).map(event => ({
          year: event.year,
          text: event.description
        }));
        setEvents(selectedEvents);
      } catch (error) {
        console.error("historical events API failed:", error);
        setEvents([{ year: "none", text: "failed to get historical events." }]);
      }


      try {
        // Joke API
        const jokeRes = await fetch("https://official-joke-api.appspot.com/random_joke");
        if (!jokeRes.ok) throw new Error("Joke API Failed");
        const jokeData = await jokeRes.json();
        setJoke(`${jokeData.setup} ${jokeData.punchline}`);
      } catch (error) {
        console.warn("joke API failed:", error);
        setJoke("Why don't scientists trust atoms? Because they make up everything!");
      }

      try {
        //meal API
        const mealRes = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
        if (!mealRes.ok) throw new Error("Meal API Failed");
        const mealData = await mealRes.json();
        setMeal({
          name: mealData.meals[0].strMeal,
          image: mealData.meals[0].strMealThumb,
          instructions: mealData.meals[0].strInstructions
        });
      } catch (error) {
        console.error("Meal API failed:", error);
        setMeal({
          name: "Classic Spaghetti",
          image: "https://via.placeholder.com/200x200?text=Meal",
          instructions: "API currently unavailable. Please try again later."
        });
      }

      try {
        //  cocktail API
        const listRes = await fetch("https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic");
        if (!listRes.ok) throw new Error("Cocktail List API Failed");
        const listData = await listRes.json();
        const randomDrink = listData.drinks[Math.floor(Math.random() * listData.drinks.length)];
        const detailRes = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${randomDrink.idDrink}`);
        if (!detailRes.ok) throw new Error("Cocktail Detail API Failed");
        const detailData = await detailRes.json();
        setCocktail({
          name: detailData.drinks[0].strDrink,
          image: detailData.drinks[0].strDrinkThumb,
          instructions: detailData.drinks[0].strInstructions || "Instructions not available"
        });
      } catch (error) {
        console.error("Cocktail API failed:", error);
        setCocktail({
          name: "Basic Mojito",
          image: "https://via.placeholder.com/200x200?text=Cocktail",
          instructions: "API currently unavailable. Please try again later."
        });
      }
    };
    fetchUserLocation();
    fetchData();

    return () => clearInterval(timer);
  }, []);

  function createFile() {
    const newDocumentTitle = prompt("Name your new file");
    if (newDocumentTitle) {
      setDocuments(prevDocs => [...prevDocs, newDocumentTitle]);

    }
  }

  function selectDocument(documentName) {
    navigate(`/editor/${documentName}`);
  }
  


  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.header}>Welcome to our site Dashboard <b>HETIC React project</b></h1>
      <div className={styles.widgetContainer}>
      <div className={styles.widget}>
          <div className={styles.widget}>
            <strong>Your Location</strong>
          </div>
          <p className={styles.widget}>
            <span className={styles.widget}>{location.city}</span>
            {location.country && (
              <>, <span className={styles.widget}>{location.country}</span></>
            )}
          </p>
        </div>
        <div className={styles.widget}>
          <strong>Current Time:</strong> <br /> {time}
        </div>
        <div className={styles.widget}>
          <strong>Quote of the Day:</strong> <br /> {quote}
        </div>
        <div className={styles.widget}>
          <strong>Joke of the Day:</strong> <br /> {joke}
        </div>
        <div className={styles.widget}>
          <strong>Historical Events on this Date:</strong>
          <ul>
            {events.map((event, index) => (
              <li key={index}>
                <strong>{event.year} :</strong> {event.text}
              </li>
            ))}
          </ul>
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
          {cocktail.image && <img src={cocktail.image} alt={cocktail.name} className={styles.foodImage} />}
          <p className={styles.instructions}>{cocktail.instructions}</p>
        </div>
      </div>
      <hr />
      <div className={styles.fileContainer}>
        <h2 className={styles.header}>Markdown File</h2>
        <button onClick={createFile} className={styles.btn}>New file</button>
        <ul className={styles.listContainer}>
          {documents.map((document, index) => (
            <li key={index}>
              <button onClick={selectDocument(document)} className={styles.btn}>{document}</button>
            </li>
          ))}
        </ul>
     </div>
    </div>
  );
}

export default Dashboard;

