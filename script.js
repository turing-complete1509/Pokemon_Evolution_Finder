// script.js
async function getEvolution() {
    const name = document.getElementById('pokemonInput').value.toLowerCase().trim();
    if (!name) return;
  
    const container = document.getElementById('evolutionChain');
    container.innerHTML = 'Loading...';
  
    try {
      const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`);
      const speciesData = await speciesRes.json();
      const evoUrl = speciesData.evolution_chain.url;
  
      const evoRes = await fetch(evoUrl);
      const evoData = await evoRes.json();
  
      const evoChain = [];
      let evo = evoData.chain;
  
      do {
        evoChain.push(evo.species.name);
        evo = evo.evolves_to[0];
      } while (evo && evo.species);
  
      container.innerHTML = ''; // Clear loading
  
      for (let i=0; i < evoChain.length; i++) {
        const mon = evoChain[i];

        const pokeRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${mon}`);
        const pokeData = await pokeRes.json();
        const imgUrl = pokeData.sprites.other["official-artwork"].front_default;
        
        let stageLabel = '';
        if(i === 0) stageLabel = 'Base';
        else stageLabel = `Stage ${i}`;

        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          <h4 class="stage-label">${stageLabel}</h4>
          <h3>${mon.charAt(0).toUpperCase() + mon.slice(1)}</h3>
          <img src="${imgUrl}" alt="${mon}" />
        `;

        card.addEventListener("click",() => {
            showStatsModal(mon, pokeData);
        });

        container.appendChild(card);
      }

      const description = speciesData.form_descriptions;
      console.log(description);
  
    } catch (err) {
      container.innerHTML = 'Error fetching data. Make sure the Pokémon name is correct.';
      console.error(err);
    }
}

function showStatsModal(name, data) {
  const modal = document.createElement("div");
  modal.classList.add("modal");
  document.body.appendChild(modal);

  let modal_content = document.createElement("div");
  modal_content.classList.add("modal-content");
  modal.appendChild(modal_content);

  let span = document.createElement("span");
  span.classList.add("close-button");
  modal_content.appendChild(span);
  span.innerText = "×";
  span.addEventListener("click", () => {
      modal.remove();
  })

  let modal_heading = document.createElement("h2");
  modal_heading.innerText = `${name.charAt(0).toUpperCase() + name.slice(1)}'s Stats`;
  modal_content.appendChild(modal_heading);

  let stats_list = document.createElement("ul");
  modal_content.appendChild(stats_list);
  for(stat of data.stats){
    let list_item = document.createElement("li");
    stats_list.appendChild(list_item);
    list_item.innerHTML = `<b>${stat.stat.name}:</b>${stat.base_stat}`;
  }
}
  