const apiKey = 'c383279cd1b4c3cedfc5e021186453e6'; 
let correctMedia;
let options = [];
let isMovieRound = true;

// Função para obter filme aleatório
function getRandomMedia() {
    if (isMovieRound) {
        // Gera um número aleatório de página entre 1 e 500 pois o máximo de páginas é 500
        const randomPage = Math.floor(Math.random() * 500) + 1; // Garante que o número será entre 1 e 500

        // Faz a requisição para a API com a página aleatória
        fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=pt-BR&page=${randomPage}`)
            .then(response => response.json())
            .then(data => {
                // Escolhe um filme aleatório dos resultados da página
                const randomIndex = Math.floor(Math.random() * data.results.length);
                correctMedia = data.results[randomIndex];
                options = [correctMedia];
                overview = correctMedia.overview

                // Adiciona mais 3 opções aleatórias
                while (options.length < 4) {
                    const randomOption = data.results[Math.floor(Math.random() * data.results.length)];
                    if (!options.includes(randomOption)) {
                        options.push(randomOption);
                    }
                }

                // Embaralha as opções
                options.sort(() => Math.random() - 0.5);
                displayQuestion();
            })
            .catch(error => console.error('Erro ao buscar filmes:', error));
    }

    // Alterna entre filme e série para a próxima rodada
    isMovieRound = !isMovieRound;
}

// Função para exibir a questão
function displayQuestion() {
    // document.getElementById('question').innerHTML = `<p>Qual é o filme ou série?</p>`;
    
    // Verifica se o filme tem imagem de pôster
    const posterPath = correctMedia.poster_path
        ? `https://image.tmdb.org/t/p/w500${correctMedia.poster_path}`
        : 'https://via.placeholder.com/500x750?text=Sem+Imagem'; // Imagem padrão caso não tenha pôster
    
    document.getElementById('mediaImage').src = posterPath;
    document.getElementById('mediaImage').style.width = '200px';
    document.getElementById('mediaImage').style.height = 'auto'; // Mostra a imagem cortada
    document.getElementById('mediaImage').style.display = 'block';
    document.getElementById('mediaImage').style.filter = 'blur(8px)';
    
    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';
    
    const overview_html = document.querySelector("#overview");
    overview_html.innerHTML = overview;

    // Cria botões para as opções
    options.forEach(option => {
        const button = document.createElement('button');
        button.innerText = option.title || option.name; // 'title' para filmes, 'name' para séries
        button.onclick = () => checkAnswer(option);
        optionsDiv.appendChild(button);
    });
}

// Função para verificar a resposta
function checkAnswer(selected) {
    const resultDiv = document.getElementById('result');
    
    if (selected.id === correctMedia.id) {
        resultDiv.innerHTML = '<p>Correto!</p>';
    } else {
        resultDiv.innerHTML = `<p>Incorreto! O filme ou série era: ${correctMedia.title || correctMedia.name}</p>`;
    }
    document.getElementById('mediaImage').style.filter = 'blur(0px)';
    document.getElementById('mediaImage').style.height = 'auto';
    document.getElementById('mediaImage').style.objectPosition = 'center';
    
    // Exibe o botão "Próximo"
    document.getElementById('nextButton').style.display = 'block';
}

// Função para ir para a próxima pergunta
document.getElementById('nextButton').onclick = () => {
    document.getElementById('result').innerHTML = '';
    document.getElementById('nextButton').style.display = 'none';
    
    getRandomMedia();
};

// Inicia o jogo
getRandomMedia();
