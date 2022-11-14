import datetime
import sqlite3

database = "film.db"

def run_query(statement):
    keys = []
    results = []
    conn = sqlite3.connect(database)
    cursor = conn.cursor()
    with conn:
        db = cursor.execute(statement)
        
        if (db.description):
            for item in db.description:
                keys.append(item[0])
            data = cursor.fetchall()
            for row in data:
                values = list(row)
                line = {keys[i]: values[i] for i in range(len(keys))}
                results.append(line)        
            return results
    

def date():
    date = datetime.datetime.now().strftime("%Y-%m-%d %X")
    return date

def add_film(title,description,year,runtime,img_url,tmdb_id):
    run_query(f"""
        INSERT INTO films
        VALUES (NULL,'{title}','{description}','{year}','{runtime}','{img_url}','{tmdb_id}', NULL)
    """)
    return run_query("SELECT * FROM films ORDER BY film_id DESC LIMIT 1")

def get_allfilms():
    return run_query("SELECT * FROM films")

def delete_film(id):
    run_query(f"""DELETE FROM films WHERE film_id={id}""")
    