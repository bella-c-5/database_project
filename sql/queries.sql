SELECT username
FROM USERS;

SELECT movie_id, title, rating
FROM MOVIES;

SELECT title, rating
FROM MOVIES
WHERE rating > 8;

SELECT m.title,
       d.first_name,
       d.last_name
FROM MOVIES   m
JOIN DIRECTORS d ON m.director_id = d.director_id;

SELECT a.first_name,
       a.last_name,
       m.title
FROM ACTORS      a
JOIN MOVIE_ACTOR ma ON a.actor_id = ma.actor_id
JOIN MOVIES      m  ON ma.movie_id = m.movie_id;

SELECT u.username,
       m.title,
       m.rating
FROM USER_MOVIE um
JOIN USERS      u ON um.username = u.username
JOIN MOVIES     m ON um.movie_id = m.movie_id
WHERE u.username = 'user2';

SELECT u.username,
       COUNT(um.movie_id) AS movies_watched
FROM USERS      u
LEFT JOIN USER_MOVIE um ON u.username = um.username
GROUP BY u.username;

SELECT d.first_name,
       d.last_name,
       COUNT(m.movie_id) AS movie_count
FROM DIRECTORS d
LEFT JOIN MOVIES m ON d.director_id = m.director_id
GROUP BY d.first_name, d.last_name;

SELECT m.movie_id,
       m.title
FROM MOVIES m
LEFT JOIN MOVIE_ACTOR ma ON m.movie_id = ma.movie_id
WHERE ma.actor_id IS NULL;

SELECT m.title,
       COUNT(ma.actor_id) AS actor_count
FROM MOVIES m
JOIN MOVIE_ACTOR ma ON m.movie_id = ma.movie_id
GROUP BY m.title
HAVING COUNT(ma.actor_id) >= 2;

SELECT AVG(rating) AS average_rating
FROM MOVIES;

SELECT DISTINCT d.first_name,
       d.last_name
FROM USER_MOVIE um
JOIN MOVIES     m ON um.movie_id = m.movie_id
JOIN DIRECTORS  d ON m.director_id = d.director_id
WHERE um.username = 'user4';
