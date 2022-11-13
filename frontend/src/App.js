import React, {useState, useRef, useEffect} from "react"

import "./App.css"
import FilmCard from "./FilmCard"

function App() {
    const [films, setFilms] = useState([])

    useEffect(() => {
        loadFilms()
    },[])

    function loadFilms() {
        fetch('http://127.0.0.1:8000/films')
        .then(response => response.json())
        .then(data => {
            data = data.map(prev => {
                return {...prev, show_desc: false}
            })
            setFilms(data)
        })
    }
    
    function toggle_desc(id) {
        setFilms(prevFilms => {
            return prevFilms.map(film => {
                return film.film_id === id ? {...film, show_desc: !film.show_desc} : film
            })
        })
    }

    function deleteFilm(id) {
        fetch('http://127.0.0.1:8000/films/remove?id=' + id, {method: 'DELETE'})
        .then(console.log("deleETE"))
        setFilms(prevFilms => prevFilms.filter(film => film.film_id !== id))
    }

    const filmCards = films.map(film => (
        <FilmCard
            key={film.film_id}
            id={film.film_id}
            img_url={film.img_url}
            title={film.title}
            description={film.desc}
            show_desc={film.show_desc}
            toggle_desc={toggle_desc}
            year={film.year}
            runtime={film.runtime}
            delete={() => deleteFilm(film.film_id)}
        />
    ))

    return (
        <main className="main-container">
            <div className="films">{filmCards}</div>
        </main>
    )


}
export default App