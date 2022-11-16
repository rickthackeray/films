import React, {useState, useRef, useEffect} from "react"

import "./App.css"
import FilmCard from "./FilmCard"

function App() {
    const [films, setFilms] = useState([])
    const [showAddFilmBox, setShowAddFilmBox] = useState(false)
    const [addFilmQuery, setAddFilmQuery] = useState("")
    const [addFilmResults, setAddFilmResults] = useState()

    const addFilmboxRef = useRef()
    const addFilmboxInputRef = useRef()


    useEffect(() => {
        loadFilms()
        let clickHandler = (event) => {
            if (!addFilmboxRef.current.contains(event.target)) {
                setShowAddFilmBox(false)
            }
        }

        document.addEventListener("mousedown", clickHandler)
        return () => {
            document.removeEventListener("mousedown", clickHandler)
        }
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
    
    function toggleDescription(id) {
        setFilms(prevFilms => {
            return prevFilms.map(film => {
                return film.film_id === id ? {...film, show_desc: !film.show_desc} : film
            })
        })
    }

    function setRating(event, id) {
        fetch('http://localhost:8000/films/setrating?id=' + id + '&rating=' + event.target.id, {method: 'PUT'})
        setFilms(prev => {
            return prev.map(film => {
                return film.film_id === id ? {...film, rating: event.target.id} : film
            })
        })
    }

    function deleteFilm(id) {
        fetch('http://127.0.0.1:8000/films/remove?id=' + id, {method: 'DELETE'})
        setFilms(prevFilms => prevFilms.filter(film => film.film_id !== id))
    }

    function handleAddFilmQuerySubmit(event) {
        event.preventDefault()
        const encodedQuery = encodeURI(addFilmQuery)
        fetch('http://127.0.0.1:8000/films/search?query=' + encodedQuery)
        .then(response => response.json())
        .then(data => setAddFilmResults(data))
    }

    function handleAddFilmResultClick(event) {
        fetch('http://127.0.0.1:8000/films/add/id?id=' + event.target.id, {method: 'POST'})
        .then(response => response.json())
        .then(data => {
            setFilms(prevFilms => [...prevFilms, ...data])
        })
        .then(window.scrollTo(0, document.body.scrollHeight))
        setShowAddFilmBox(false)
        setAddFilmQuery("")
        setAddFilmResults("")
    }

    const filmCards = films.map(film => {
        return <FilmCard
            key={film.film_id}
            id={film.film_id}
            img_url={film.img_url}
            title={film.title}
            rating={film.rating}
            set_rating={setRating}
            description={film.desc}
            show_desc={film.show_desc}
            toggle_desc={toggleDescription}
            year={film.year}
            runtime={film.runtime}
            delete={() => deleteFilm(film.film_id)}
        />
    })

    return (
        <main className="main-container">
            <div className="films">{filmCards}</div>
            <div className="addfilmbox-container" ref={addFilmboxRef}>
                <button className="addfilmbox-btn" onClick={() => {
                    setShowAddFilmBox(!showAddFilmBox)
                    addFilmboxInputRef.current.focus()
                }}>+</button>
                <div className={`addfilmbox ${showAddFilmBox? 'active' : 'inactive'}`}>
                    <form className="addfilmbox-inner" onSubmit={handleAddFilmQuerySubmit}>
                        <h4>Add a Film</h4>
                        <input
                            type="text"
                            ref={addFilmboxInputRef}
                            placeholder="Search for a title..."
                            onChange={(e) => setAddFilmQuery(e.target.value)}
                            value={addFilmQuery}
                        />
                    </form>
                    {addFilmResults && <ul className="addfilmbox-results">
                        {addFilmResults.map(result => (
                            <li
                                onClick={handleAddFilmResultClick}
                                key={result.tmdb_id}
                                id={result.tmdb_id}
                            >({result.year}) {result.title}
                            </li>
                        ))}
                    </ul>}
                </div>
            </div>
        </main>
    )


}
export default App