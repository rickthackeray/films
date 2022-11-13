from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
import requests

import queries

app = FastAPI()

origins = [
    "http://127.0.0.1",
]

app.add_middleware(
    CORSMiddleware,
    # allow_origins=origins,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", response_class=HTMLResponse)
async def root():
    return "<html><body><h1><a href='/docs'>HERE</a></h1></body></html>"

@app.get("/films")
def get_allfilms():
    return queries.get_allfilms()

@app.post("/films/add")
def add_film(
    title: str,
    description: str,
    year: int,
    runtime: int,
    img_url: str,
    tmdb_id: int
):
    return queries.add_film(title, description, year, runtime, img_url, tmdb_id)

@app.post("/films/add/id")
def add_film_by_id(id: int):
    response = requests.get(f"""https://api.themoviedb.org/3/movie/{id}?api_key=304a64452db36f43df22a6f20c4cfa5b""")
    title = response.json()["title"].replace("'", "").replace('"', '')
    desc = response.json()["overview"].replace("'", "").replace('"', '')
    runtime = response.json()["runtime"]
    img_url = "https://image.tmdb.org/t/p/w400" + response.json()["poster_path"]
    year = response.json()["release_date"][0:4]
    return queries.add_film(title, desc, year, runtime, img_url, id)


@app.delete("/films/remove")
def delete_film(id: int):
    return queries.delete_film(id)
