INSERT INTO USERS (username) VALUES ('user2');
INSERT INTO USERS (username) VALUES ('user3');
INSERT INTO USERS (username) VALUES ('user4');

INSERT INTO DIRECTORS (first_name, last_name) VALUES ('Denis', 'Villeneuve');
INSERT INTO DIRECTORS (first_name, last_name) VALUES ('Bong', 'Joon-ho');
INSERT INTO DIRECTORS (first_name, last_name) VALUES ('Rian', 'Johnson');
INSERT INTO DIRECTORS (first_name, last_name) VALUES ('Jordan', 'Peele');

INSERT INTO ACTORS (first_name, last_name) VALUES ('Timothee', 'Chalamet');
INSERT INTO ACTORS (first_name, last_name) VALUES ('Rebecca', 'Ferguson');
INSERT INTO ACTORS (first_name, last_name) VALUES ('Song', 'Kang-ho');
INSERT INTO ACTORS (first_name, last_name) VALUES ('Choi', 'Woo-shik');
INSERT INTO ACTORS (first_name, last_name) VALUES ('Daniel', 'Craig');
INSERT INTO ACTORS (first_name, last_name) VALUES ('Ana', 'de Armas');
INSERT INTO ACTORS (first_name, last_name) VALUES ('Daniel', 'Kaluuya');
INSERT INTO ACTORS (first_name, last_name) VALUES ('Allison', 'Williams');

INSERT INTO MOVIES (title, rating, director_id) VALUES ('Dune', 8.3, 1);
INSERT INTO MOVIES (title, rating, director_id) VALUES ('Parasite', 8.6, 2);
INSERT INTO MOVIES (title, rating, director_id) VALUES ('Knives Out', 7.9, 3);
INSERT INTO MOVIES (title, rating, director_id) VALUES ('Get Out', 7.8, 4);

INSERT INTO MOVIE_ACTOR (movie_id, actor_id) VALUES (1, 1);
INSERT INTO MOVIE_ACTOR (movie_id, actor_id) VALUES (1, 2);
INSERT INTO MOVIE_ACTOR (movie_id, actor_id) VALUES (2, 3);
INSERT INTO MOVIE_ACTOR (movie_id, actor_id) VALUES (2, 4);
INSERT INTO MOVIE_ACTOR (movie_id, actor_id) VALUES (3, 5);
INSERT INTO MOVIE_ACTOR (movie_id, actor_id) VALUES (3, 6);
INSERT INTO MOVIE_ACTOR (movie_id, actor_id) VALUES (4, 7);
INSERT INTO MOVIE_ACTOR (movie_id, actor_id) VALUES (4, 8);

INSERT INTO USER_MOVIE (username, movie_id) VALUES ('user2', 1);
INSERT INTO USER_MOVIE (username, movie_id) VALUES ('user2', 2);
INSERT INTO USER_MOVIE (username, movie_id) VALUES ('user3', 3);
INSERT INTO USER_MOVIE (username, movie_id) VALUES ('user4', 4);
INSERT INTO USER_MOVIE (username, movie_id) VALUES ('user4', 1);
