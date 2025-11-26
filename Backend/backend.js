const express = require('express');
const oracledb = require('oracledb');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); 

const dbConfig = {
  user: 'SYSTEM',
  password: '3450project',
  connectString: 'localhost/XE',
};

function splitName(fullName) {
  const parts = fullName.trim().split(' ');
  if (parts.length === 1) {
    return { first: parts[0], last: '' };
  }
  const first = parts[0];
  const last = parts.slice(1).join(' ');
  return { first, last };
}

async function findOrCreateUser(conn, username) {
  const sel = await conn.execute(
    `SELECT username FROM USERS WHERE username = :u`,
    { u: username }
  );
  if (sel.rows.length > 0) return username;

  await conn.execute(
    `INSERT INTO USERS (username) VALUES (:u)`,
    { u: username }
  );
  return username;
}

async function findOrCreateDirector(conn, fullName) {
  const { first, last } = splitName(fullName);
  const sel = await conn.execute(
    `SELECT director_id
       FROM DIRECTORS
      WHERE first_name = :f AND last_name = :l`,
    { f: first, l: last }
  );
  if (sel.rows.length > 0) return sel.rows[0][0];

  const ins = await conn.execute(
    `INSERT INTO DIRECTORS (first_name, last_name)
     VALUES (:f, :l)
     RETURNING director_id INTO :id`,
    {
      f: first,
      l: last,
      id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
    }
  );
  return ins.outBinds.id[0];
}

async function findOrCreateActor(conn, fullName) {
  const { first, last } = splitName(fullName);
  const sel = await conn.execute(
    `SELECT actor_id
       FROM ACTORS
      WHERE first_name = :f AND last_name = :l`,
    { f: first, l: last }
  );
  if (sel.rows.length > 0) return sel.rows[0][0];

  const ins = await conn.execute(
    `INSERT INTO ACTORS (first_name, last_name)
     VALUES (:f, :l)
     RETURNING actor_id INTO :id`,
    {
      f: first,
      l: last,
      id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
    }
  );
  return ins.outBinds.id[0];
}

app.get('/test', (req, res) => {
  res.send('Backend is running ✅');
});

app.get('/db-test', async (req, res) => {
  try {
    const conn = await oracledb.getConnection(dbConfig);
    const result = await conn.execute('SELECT movie_id, title, rating FROM MOVIES');
    await conn.close();
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/movies', async (req, res) => {
  const username = req.query.username;
  if (!username) {
    return res.status(400).json({ error: 'username is required' });
  }

  let conn;
  try {
    conn = await oracledb.getConnection(dbConfig);
    const result = await conn.execute(
      `SELECT m.movie_id,
              m.title,
              m.rating,
              d.first_name, d.last_name,
              a.first_name, a.last_name
         FROM USER_MOVIE um
         JOIN MOVIES m       ON um.movie_id = m.movie_id
         LEFT JOIN DIRECTORS d ON m.director_id = d.director_id
         LEFT JOIN MOVIE_ACTOR ma ON ma.movie_id = m.movie_id
         LEFT JOIN ACTORS a   ON ma.actor_id = a.actor_id
        WHERE um.username = :u
        ORDER BY m.movie_id`,
      { u: username }
    );

    const movies = result.rows.map(row => ({
      id: row[0],
      name: row[1],
      rating: row[2],
      director: [row[3], row[4]].filter(Boolean).join(' '),
      actor: [row[5], row[6]].filter(Boolean).join(' '),
    }));

    await conn.close();
    res.json(movies);
  } catch (err) {
    console.error('Error in GET /movies', err);
    if (conn) await conn.close();
    res.status(500).json({ error: 'Error fetching movies' });
  }
});

app.post('/movies', async (req, res) => {
  const { username, name, actor, director, rating } = req.body;

  if (!username || !name || !actor || !director) {
    return res.status(400).json({
      error: 'username, name, actor, director are required',
    });
  }

  let conn;
  try {
    conn = await oracledb.getConnection(dbConfig);
    await conn.execute('BEGIN NULL; END;'); 


    const userKey = await findOrCreateUser(conn, username);

 
    const directorId = await findOrCreateDirector(conn, director);


    const insMovie = await conn.execute(
      `INSERT INTO MOVIES (title, rating, director_id)
       VALUES (:t, :r, :d)
       RETURNING movie_id INTO :id`,
      {
        t: name,
        r: rating || null,
        d: directorId,
        id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      }
    );
    const movieId = insMovie.outBinds.id[0];

 
    const actorId = await findOrCreateActor(conn, actor);

    await conn.execute(
      `INSERT INTO MOVIE_ACTOR (movie_id, actor_id)
       VALUES (:m, :a)`,
      { m: movieId, a: actorId }
    );

    await conn.execute(
      `INSERT INTO USER_MOVIE (username, movie_id)
       VALUES (:u, :m)`,
      { u: userKey, m: movieId }
    );

    await conn.commit();

    await conn.close();

    res.status(201).json({
      id: movieId,
      name,
      rating: rating || null,
      actor,
      director,
    });
  } catch (err) {
    console.error('Error in POST /movies', err);
    if (conn) {
      try { await conn.rollback(); } catch {}
      await conn.close();
    }
    res.status(500).json({ error: 'Error inserting movie' });
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
