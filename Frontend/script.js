document.addEventListener("DOMContentLoaded", () => {
    // Only run this if we're on the movie page
    if (!document.body.classList.contains("movie-page")) return;
  
    // ----- USERNAME / PROFILE DISPLAY -----
    const storedName = localStorage.getItem("seenitUsername");
  
    // If no username stored, force user back to main page
    if (!storedName) {
      window.location.href = "mainpage.html";
      return;
    }
  
    const profileNameEl = document.getElementById("profileName");
    if (profileNameEl) {
      profileNameEl.textContent = storedName;
    }
  
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        // "Log out" = clear current user and go back
        localStorage.removeItem("seenitUsername");
        window.location.href = "mainpage.html";
      });
    }
  
    // ----- MOVIE LIST LOGIC -----
  
    const movies = [];
    let nextId = 1;
    let editingId = null;
    const currentUsername = localStorage.getItem("seenitUsername");
    const API_BASE = "http://localhost:3000";

    async function loadMoviesFromServer() {
  if (!currentUsername) return;
  try {
    const res = await fetch(
      `${API_BASE}/movies?username=${encodeURIComponent(currentUsername)}`
    );
    const data = await res.json();

    movies.length = 0; 
    data.forEach((m) => movies.push(m));

    nextId = movies.reduce((max, m) => Math.max(max, m.id), 0) + 1;
    renderMovies();
  } catch (err) {
    console.error("Error loading movies from server", err);
  }
}

async function saveMovieToServer(movie) {
  try {
    const res = await fetch(`${API_BASE}/movies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: currentUsername,
        name: movie.name,
        actor: movie.actor,
        director: movie.director,
        rating: movie.rating,
      }),
    });
    const saved = await res.json();
    return saved;
  } catch (err) {
    console.error("Error saving movie to server", err);
    return null;
  }
}

    const searchInput = document.getElementById("searchInput");
    const movieListEl = document.getElementById("movieList");
  
    function buildLetterFilters(containerId, type) {
      const container = document.getElementById(containerId);
      const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
      letters.forEach((letter) => {
        const label = document.createElement("label");
        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.value = letter;
        cb.className = "filter-checkbox";
        cb.dataset.type = type;
        label.appendChild(cb);
        label.appendChild(document.createTextNode(" " + letter));
        container.appendChild(label);
      });
    }
  
    function getSelectedLetters(type) {
      return Array.from(
        document.querySelectorAll(
          '.filter-checkbox[data-type="' + type + '"]:checked'
        )
      ).map((cb) => cb.value);
    }
  
    function getFilteredMovies() {
      const text = searchInput.value.trim().toLowerCase();
      const movieLetters = getSelectedLetters("movie");
      const actorLetters = getSelectedLetters("actor");
      const directorLetters = getSelectedLetters("director");
  
      return movies.filter((m) => {
          // 🔎 NEW: search across movie name, actor, and director
          const fullSearch = (
              m.name + " " +
              m.actor + " " +
              m.director
          ).toLowerCase();
  
          if (text && !fullSearch.includes(text)) return false;
  
          // LETTER FILTERS
          if (movieLetters.length) {
              const first = (m.name[0] || "").toUpperCase();
              if (!movieLetters.includes(first)) return false;
          }
  
          if (actorLetters.length) {
              const first = (m.actor[0] || "").toUpperCase();
              if (!actorLetters.includes(first)) return false;
          }
  
          if (directorLetters.length) {
              const first = (m.director[0] || "").toUpperCase();
              if (!directorLetters.includes(first)) return false;
          }
  
          return true;
      });
    }
  
  
    function renderMovies() {
      const filtered = getFilteredMovies();
      movieListEl.innerHTML = "";
  
      if (!filtered.length) {
        const empty = document.createElement("li");
        empty.textContent = "No movies yet. Add one with 'Add to List'.";
        empty.style.borderBottom = "none";
        movieListEl.appendChild(empty);
        return;
      }
  
      filtered.forEach((movie) => {
        const li = document.createElement("li");
        li.dataset.id = movie.id;
  
        const info = document.createElement("div");
        info.className = "movie-info";
  
        const title = document.createElement("span");
        title.className = "movie-title";
        title.textContent = movie.name;
  
        const meta = document.createElement("span");
        meta.className = "movie-meta";
        meta.textContent =
          "Actor: " +
          movie.actor +
          " | Director: " +
          movie.director +
          (movie.rating ? " | Rating: " + movie.rating : "");
  
        info.appendChild(title);
        info.appendChild(meta);
  
        const editBtn = document.createElement("button");
        editBtn.className = "edit-btn";
        editBtn.textContent = "Add Info";
        editBtn.type = "button";
  
        li.appendChild(info);
        li.appendChild(editBtn);
        movieListEl.appendChild(li);
      });
    }
  
    // ----- MODAL HANDLING -----
    const modalBackdrop = document.getElementById("modalBackdrop");
    const movieForm = document.getElementById("movieForm");
    const modalTitle = document.getElementById("modalTitle");
  
    const movieNameInput = document.getElementById("movieName");
    const movieActorInput = document.getElementById("movieActor");
    const movieDirectorInput = document.getElementById("movieDirector");
    const movieRatingInput = document.getElementById("movieRating");
  
    function openModal(movie) {
      if (movie) {
        modalTitle.textContent = "Edit Movie Info";
        movieNameInput.value = movie.name;
        movieActorInput.value = movie.actor;
        movieDirectorInput.value = movie.director;
        movieRatingInput.value = movie.rating || "";
      } else {
        modalTitle.textContent = "Add Movie";
        movieNameInput.value = "";
        movieActorInput.value = "";
        movieDirectorInput.value = "";
        movieRatingInput.value = "";
      }
      modalBackdrop.style.display = "flex";
      movieNameInput.focus();
    }
  
    function closeModal() {
      modalBackdrop.style.display = "none";
      editingId = null;
    }
  
    document.getElementById("addMovieBtn").addEventListener("click", () => {
      editingId = null;
      openModal(null);
    });
  
    document.getElementById("cancelModalBtn").addEventListener("click", () => {
      closeModal();
    });
  
    movieListEl.addEventListener("click", (e) => {
      if (e.target.classList.contains("edit-btn")) {
        const li = e.target.closest("li");
        const id = Number(li.dataset.id);
        const movie = movies.find((m) => m.id === id);
        if (movie) {
          editingId = id;
          openModal(movie);
        }
      }
    });
  
    movieForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = movieNameInput.value.trim();
  const actor = movieActorInput.value.trim();
  const director = movieDirectorInput.value.trim();
  const rating = movieRatingInput.value.trim();

  if (!name || !actor || !director) {
    alert("Please fill in Movie Name, Actor, and Director.");
    return;
  }

  if (editingId == null) {
    const toSave = {
      id: nextId,
      name,
      actor,
      director,
      rating: rating || null,
    };

    const saved = await saveMovieToServer(toSave);
    if (!saved || !saved.id) {
      alert("Could not save movie to database.");
      return;
    }

    movies.push(saved);
    nextId = Math.max(nextId + 1, saved.id + 1);
  } else {
    const movie = movies.find((m) => m.id === editingId);
    if (movie) {
      movie.name = name;
      movie.actor = actor;
      movie.director = director;
      movie.rating = rating || null;
      // (later you can add an UPDATE API if needed)
    }
  }

  closeModal();
  renderMovies();
});

  
    // Search and filters
    searchInput.addEventListener("input", renderMovies);
    document.body.addEventListener("change", (e) => {
      if (e.target.classList && e.target.classList.contains("filter-checkbox")) {
        renderMovies();
      }
    });
  
    // Init filters and some starter data
    buildLetterFilters("movieLetters", "movie");
    buildLetterFilters("actorLetters", "actor");
    buildLetterFilters("directorLetters", "director");

        loadMoviesFromServer();
  });
