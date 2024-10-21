import "./css/bootstrap.min.css";
import "./js/bootstrap.bundle.min";

const container = document.getElementById("container");
const spinnerContainer = document.querySelector(".spinner-container");
const alertContainer = document.querySelector(".alert");

const baseUrl = import.meta.env.VITE_RAPIDAPI_HOST
const apiKey = import.meta.env.VITE_RAPIDAPI_KEY;

const fetchData = async (query) => {
  const url = `${baseUrl}/search/${encodeURIComponent(query)}/page/1`;
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': apiKey,
      'x-rapidapi-host': 'steam2.p.rapidapi.com'
    }
  };

  try {
    showSpinner();
    hideAlert();
    const response = await fetch(url, options);
    // console.log(response);

    if (!response.ok) {
      const errorText = await response.text();
      showAlert("No results found for this query.");
      return;
    }

    const json = await response.json();

    handleData(json);
  } catch (error) {
    showAlert("An error occurred while fetching data.");
  } finally {
    hideSpinner();
  }
};

function handleData(data) {
  const dynamicDataContainer = document.querySelector(".dynamic_data");
  dynamicDataContainer.innerHTML = "";
  

  if (data.length) {
    data.forEach((game) => {
      console.log(game);
      
      const gameName = game.title;
      const gameImage = game.imgUrl;
      const gameLink = game.url;

      dynamicDataContainer.innerHTML += `
        <div class="col">
          <article class="card">
            <img src="${gameImage}" class="card-img-top" alt="${gameName}">
            <div class="card-body">
              <h5 class="card-title">${gameName}</h5>
              <a href="${gameLink}" class="btn btn-primary" target="_blank">View on Steam</a>
            </div>
          </article>
        </div>
      `;
    });
  } else {
    showAlert("No games found");
  }
}

function showSpinner() {
  spinnerContainer.classList.remove("d-none");
}

function hideSpinner() {
  spinnerContainer.classList.add("d-none");
}

function showAlert(message) {
  alertContainer.textContent = message;
  alertContainer.classList.remove("d-none");
}

function hideAlert() {
  alertContainer.classList.add("d-none");
}

document.getElementById('searchButton').addEventListener('click', () => {
  const query = document.getElementById('searchInput').value.trim();
  if (query) {
    fetchData(query);
  } else {
    showAlert("Please enter a search term");
  }
});
