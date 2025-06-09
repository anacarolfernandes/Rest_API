const form = document.getElementById("searchForm");
const resultBox = document.getElementById("result");
const termInput = document.getElementById("term");


const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion) {
  const phrases = ["e.g. cap", "e.g. sus", "e.g. no cap", "e.g. slay"];
  let i = 0;
  let j = 0;
  let currentPhrase = phrases[i];
  let isDeleting = false;
  let pauseCounter = 0;

  function typeEffect() {
    if (isDeleting) {
      termInput.placeholder = currentPhrase.substring(0, j--);
      if (j < 0) {
        isDeleting = false;
        i = (i + 1) % phrases.length;
        currentPhrase = phrases[i];
        pauseCounter = 0;
      }
    } else {
      termInput.placeholder = currentPhrase.substring(0, j++);
      if (j > currentPhrase.length) {
        if (pauseCounter < 15) {
          pauseCounter++;
          setTimeout(typeEffect, 250);
          return;
        }
        isDeleting = true;
      }
    }

    setTimeout(typeEffect, isDeleting ? 150 : 180);
  }

  typeEffect();
}

// Profanity filter
const sanitizeText = (text) => {
  const blacklist = ["fuck", "shit", "bitch", "ass", "bullshit", "motherfucker"];
  blacklist.forEach(word => {
    const regex = new RegExp(word, "gi");
    text = text.replace(regex, "****");
  });
  return text;
};

// Handle form submission
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const term = termInput.value.trim();
  if (!term) return;

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '9f70a1050amsh0da835f33ff1d51p1c2ec9jsndcd4f7a8077e',
      'X-RapidAPI-Host': 'mashape-community-urban-dictionary.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(`https://mashape-community-urban-dictionary.p.rapidapi.com/define?term=${term}`, options);
    const data = await response.json();
    const definition = data.list[0];

    if (definition) {
      resultBox.innerHTML = `
        <h2>${definition.word}</h2>
        <p>${sanitizeText(definition.definition)}</p>
        <strong>Example:</strong>
        <p>${sanitizeText(definition.example)}</p>
      `;
    } else {
      resultBox.innerHTML = `<p>No definitions found for "${term}". Try another word!</p>`;
    }
  } catch (error) {
    console.error("Fetch error:", error);
    resultBox.innerHTML = `<p>Oops! Something went wrong. Try again later.</p>`;
  }
});

// Dark mode toggle
document.getElementById("toggleMode").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});