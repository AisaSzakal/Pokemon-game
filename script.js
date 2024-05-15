let selectedPokemon = [];

document.getElementById('loadButton').addEventListener('click', function () {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=10')
        .then(response => response.json())
        .then(data => {
            const pokemonContainer = document.getElementById('pokemonDisplay');
            pokemonContainer.innerHTML = ''; // Clear previous Pokémon
            data.results.forEach(pokemon => {
                fetch(pokemon.url)
                    .then(response => response.json())
                    .then(pokeData => {
                        const pokemonElement = document.createElement('div');
                        pokemonElement.className = 'pokemon';
                        pokemonElement.innerHTML = `
                            <h3>${pokeData.name}</h3>
                            <img src="${pokeData.sprites.front_default}" alt="${pokeData.name}">
                            <p>Type: ${pokeData.types.map(type => type.type.name).join(', ')}</p>
                        `;

                        pokemonContainer.appendChild(pokemonElement);

                        pokemonElement.addEventListener('click', () => {
                            if (selectedPokemon.length < 2 && !selectedPokemon.includes(pokeData)) {
                                pokemonElement.classList.add('selected');
                                selectedPokemon.push(pokeData);
                                if (selectedPokemon.length === 2) {
                                    startBattle(selectedPokemon);
                                }
                            }
                        });
                    });
            });
        });
});

function startBattle(selectedPokemon) {
    const modal = document.getElementById('modal');
    const battleResultText = document.getElementById('battleResultText');
    const closeButton = document.querySelector('.close');
    const playAgainButton = document.getElementById('playAgainButton');

    document.querySelectorAll('.selected').forEach(elem => elem.classList.add('fighting'));
    
    setTimeout(() => {
        document.querySelectorAll('.selected').forEach(elem => elem.classList.remove('fighting'));

        const [pokemon1, pokemon2] = selectedPokemon;
        const stats1 = pokemon1.stats.reduce((total, stat) => total + stat.base_stat, 0);
        const stats2 = pokemon2.stats.reduce((total, stat) => total + stat.base_stat, 0);

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

        const detailReason = `
            <p>${pokemon1.name} Stats: ${pokemon1.stats.map(stat => stat.stat.name + ": " + stat.base_stat).join(', ')}</p>
            <p>${pokemon2.name} Stats: ${pokemon2.stats.map(stat => stat.stat.name + ": " + stat.base_stat).join(', ')}</p>
            ${winner ? `<p>Winner is ${winner}! ${reason}</p>` : `<p>${reason}</p>`}
        `;

        battleResultText.innerHTML = detailReason;
        modal.style.display = "block";

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