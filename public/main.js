const form = document.getElementById("searchForm");
const resultBox = document.getElementById("result");

// Simple profanity filter
const sanitizeText = (text) => {
  const blacklist = ["fuck", "shit", "bitch", "ass", "bullshit", "motherfucker"];
  blacklist.forEach(word => {
    const regex = new RegExp(word, "gi");
    text = text.replace(regex, "****");
  });
  return text;
};

// Listen for form submission
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const term = document.getElementById("term").value.trim();
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