import sqlite3


def run_query(statement):
    keys = []
    results = []
    conn = sqlite3.connect("films.db")
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

print(run_query("INSERT INTO films VALUES (NULL,'new10','A tifo Thei oblivion.','1999','139','550')"))
print(run_query("SELECT * FROM films"))