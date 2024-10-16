let selectedPokemon = [];

document.getElementById('loadButton').addEventListener('click', function () {
    // Fetch the first 10 Pokémon from the PokeAPI
    fetch('https://pokeapi.co/api/v2/pokemon?limit=10')
        .then(response => response.json()) // Convert the response to JSON
        .then(data => {
            const pokemonContainer = document.getElementById('pokemonDisplay');
            pokemonContainer.innerHTML = ''; // Clear previous Pokémon

            // Loop through the list of Pokémon received from the API
            data.results.forEach(pokemon => {
                fetch(pokemon.url)
                    .then(response => response.json())
                    .then(pokeData => {
                        // Create a new div element to display each Pokémon's details
                        const pokemonElement = document.createElement('div');
                        pokemonElement.className = 'pokemon';
                        pokemonElement.innerHTML = `
                            <h3>${pokeData.name}</h3>
                            <img src="${pokeData.sprites.front_default}" alt="${pokeData.name}">
                            <p>Type: ${pokeData.types.map(type => type.type.name).join(', ')}</p>
                        `;

                         // Append the new Pokémon element to the container
                        pokemonContainer.appendChild(pokemonElement);

                        // Add a click event to select the Pokémon for the battle
                        pokemonElement.addEventListener('click', () => {
                            // Allow selecting only up to 2 Pokémon, and avoid selecting the same Pokémon twice
                            if (selectedPokemon.length < 2 && !selectedPokemon.includes(pokeData)) {
                                pokemonElement.classList.add('selected');
                                selectedPokemon.push(pokeData);
                                // When 2 Pokémon are selected, start the battle
                                if (selectedPokemon.length === 2) {
                                    startBattle(selectedPokemon);
                                }
                            }
                        });
                    });
            });
        });
});

// Function to handle the Pokémon battle logic
function startBattle(selectedPokemon) {
    const modal = document.getElementById('modal'); // Get the modal element
    const battleResultText = document.getElementById('battleResultText'); // Text container for battle result
    const closeButton = document.querySelector('.close'); // Button to close the modal
    const playAgainButton = document.getElementById('playAgainButton'); // Button to reset the game

    // Add a visual indication that the selected Pokémon are fighting
    document.querySelectorAll('.selected').forEach(elem => elem.classList.add('fighting'));
    
     // Simulate battle delay (1 second)
    setTimeout(() => {
        document.querySelectorAll('.selected').forEach(elem => elem.classList.remove('fighting'));

        // Calculate the total stats of each Pokémon by summing their base stats
        const [pokemon1, pokemon2] = selectedPokemon;
        const stats1 = pokemon1.stats.reduce((total, stat) => total + stat.base_stat, 0);
        const stats2 = pokemon2.stats.reduce((total, stat) => total + stat.base_stat, 0);

        // Determine the winner based on total stats
        let winner, reason;
        if (stats1 > stats2) {
            winner = pokemon1.name;
            reason = `${pokemon1.name} has stronger overall stats than ${pokemon2.name}.`;
        } else if (stats2 > stats1) {
            winner = pokemon2.name;
            reason = `${pokemon2.name} has stronger overall stats than ${pokemon1.name}.`;
        } else {
            reason = "It's a draw!";
        }

            // Prepare detailed stats comparison for the modal
        const detailReason = `
            <p>${pokemon1.name} Stats: ${pokemon1.stats.map(stat => stat.stat.name + ": " + stat.base_stat).join(', ')}</p>
            <p>${pokemon2.name} Stats: ${pokemon2.stats.map(stat => stat.stat.name + ": " + stat.base_stat).join(', ')}</p>
            ${winner ? `<p>Winner is ${winner}! ${reason}</p>` : `<p>${reason}</p>`}
        `;

        // Display the battle result in the modal
        battleResultText.innerHTML = detailReason;
        modal.style.display = "block";

        // Close the modal and reset the game when the close button is clicked
        closeButton.onclick = function () {
            modal.style.display = "none";
            resetGame();
        };

        playAgainButton.onclick = function () {
            modal.style.display = "none";
            resetGame();
        };
    }, 1000); // Battle duration
}

function resetGame() {
    selectedPokemon = []; // Reset for next battle
    document.querySelectorAll('.pokemon').forEach(p => p.classList.remove('selected'));
}