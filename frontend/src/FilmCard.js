import React from "react"

import "./FilmCard.css"
import starEmpty from './star-empty.png'
import starFilled from './star-filled.png'

export default function FilmCard(props) {
    return (
        <div className="card-container">
            <img src={props.img_url} className="card-img" alt={props.title + " poster"} />
            <div className="card-body">
                <h1 className="card-title">{props.title}</h1>
                <div className="card-byline">
                    <h2 className="card-year">{props.year}</h2>
                    <h3 className="card-runtime">{props.runtime + "m"}</h3>
                </div>
                {props.show_desc ?
                    <p onClick={() => props.toggle_desc(props.id)} className="card-description">{props.description}</p>
                    :
                    <div/>
                }
                <div className="card-footer">
                    <div className="card-rating">
                    {[...Array(5)].map((e,i) => (
                        <img
                            src={(props.rating < i+1 ? starEmpty : starFilled)}
                            alt={(props.rating < i+1 ? "star-empty" : "star-filled")}
                            className="card-star"
                            key={i}
                            id={i+1}
                            onClick={event => props.set_rating(event,props.id)}
                        />
                    ))}
                    </div>
                    <div onClick={() => props.toggle_desc(props.id)} className="card-description-toggle">{props.show_desc ? "▲" : "▼"}</div>
                    <button onClick={props.delete}>
                        <img 
                            src="https://cdn-icons-png.flaticon.com/512/3031/3031307.png"
                            className="card-footer-delete"
                            alt="delete"
                        />
                    </button>
                </div>
            </div>
        </div>
    )
}
