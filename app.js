// Fetch data for Bar Chart from the 'http://localhost:1337/data' endpoint
fetch("https://questionnaire-jeunesse-server.vercel.app/categories")
  .then((response) => response.json())
  .then((data) => {
    // Prepare data for the bar chart: premier, deuxième, troisième, and quatrième per category
    const categoryLabels = data.map((category) => category.name); // Assuming the property 'name' represents the category name

    // Initialize arrays for the different series (premier, deuxième, etc.)
    const premierValues = [];
    const deuxiemeValues = [];
    const troisiemeValues = [];
    const quatriemeValues = [];

    // Loop through each category to extract values for premier, deuxième, etc.
    data.forEach((category) => {
      premierValues.push(category.premier); // Assuming the JSON has a 'premier' field for each category
      deuxiemeValues.push(category.deuxieme); // Assuming a 'deuxieme' field
      troisiemeValues.push(category.troisieme); // Assuming a 'troisieme' field
      quatriemeValues.push(category.quatrieme); // Assuming a 'quatrieme' field
    });

    // Create Bar Chart: showing premier, deuxième, troisième, and quatrième for each category
    const ctx1 = document.getElementById("myBarChart").getContext("2d");
    new Chart(ctx1, {
      type: "bar",
      data: {
        labels: categoryLabels, // Category names (e.g., Sport, Culture, etc.)
        datasets: [
          {
            label: "Premier",
            data: premierValues,
            backgroundColor: "rgba(255, 99, 132, 0.6)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
          {
            label: "Deuxième",
            data: deuxiemeValues,
            backgroundColor: "rgba(54, 162, 235, 0.6)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
          {
            label: "Troisième",
            data: troisiemeValues,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
          {
            label: "Quatrième",
            data: quatriemeValues,
            backgroundColor: "rgba(153, 102, 255, 0.6)",
            borderColor: "rgba(153, 102, 255, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  })
  .catch((error) => console.error("Error fetching data for Bar Chart:", error));

// Fetch data for Pie Charts from the '/questions' endpoint
fetch("https://questionnaire-jeunesse-server.vercel.app/questions")
  .then((response) => response.json())
  .then((data) => {
    // Generate a pie chart for each category
    data.forEach((category, index) => {
      // Create a unique canvas element for each pie chart
      const pieCanvasId = `pieChart-${index}`; // Unique canvas ID for each pie chart

      // Dynamically create a new div and canvas element for each category
      const pieContainer = document.createElement("div");
      pieContainer.classList.add("chart-container");
      pieContainer.innerHTML = `
                <h2>Distribution des réponses: ${category.category}</h2>
                <canvas id="${pieCanvasId}" class="canvas" responsive="false" ></canvas>
            `;
      document.body.appendChild(pieContainer);

      const ctx2 = document.getElementById(pieCanvasId).getContext("2d");
      const questionLabels = category.questions.map((q) => q.question); // Question names
      const questionCounts = category.questions.map((q) => q.count); // Response counts

      // Create a Pie Chart for each category
      new Chart(ctx2, {
        type: "bar",
        data: {
          labels: questionLabels, // Question names
          datasets: [
            {
              label: `Responses for ${category.category}`,
              data: questionCounts, // Corresponding counts
              backgroundColor: [
                "rgba(255, 99, 132, 0.6)",
                "rgba(54, 162, 235, 0.6)",
                "rgba(255, 206, 86, 0.6)",
                "rgba(75, 192, 192, 0.6)",
                "rgba(153, 102, 255, 0.6)",
                "rgba(255, 159, 64, 0.6)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            tooltip: {
              enabled: true,
            },
          },
        },
      });
    });
  })
  .catch((error) =>
    console.error("Error fetching data for Pie Charts:", error)
  );

// Fonction pour récupérer et afficher les graphiques supplémentaires
fetch("https://questionnaire-server.vercel.app/utilisateurs")
  .then((response) => response.json())
  .then((users) => {
    afficherGraphique(users, "genre", "Genre");
    afficherGraphique(users, "age", "Âge");
    afficherGraphique(users, "annee", "Année");
    afficherGraphique(users, "ecole", "École");
  })
  .catch((error) => console.error("Erreur récupération utilisateurs:", error));

// Fonction générique pour créer les graphiques
function afficherGraphique(data, propriete, titre) {
  // Regrouper les données par propriété
  const groupes = {};
  data.forEach((utilisateur) => {
    const valeur = utilisateur[propriete];
    groupes[valeur] = (groupes[valeur] || 0) + 1;
  });

  const labels = Object.keys(groupes);
  const valeurs = Object.values(groupes);

  const canvasId = `chart-${propriete}`;

  const container = document.createElement("div");
  container.classList.add("chart-container");
  container.innerHTML = `
  <h2>Répartition par ${titre}</h2>
  <canvas id="${canvasId}" class="canvas"></canvas>
`;
  document.body.appendChild(container);

  const ctx = document.getElementById(canvasId).getContext("2d");
  new Chart(ctx, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          label: titre,
          data: valeurs,
          backgroundColor: [
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(75, 192, 192, 0.6)",
            "rgba(153, 102, 255, 0.6)",
            "rgba(255, 159, 64, 0.6)",
            "rgba(199, 199, 199, 0.6)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
            "rgba(159, 159, 159, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "top" },
        tooltip: { enabled: true },
      },
    },
  });
}
