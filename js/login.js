// Aguarda o HTML carregar
document.addEventListener('DOMContentLoaded', function() {

    // --- BANCO DE DADOS DE USUÁRIOS ---
    // (As chaves aqui devem ser com letra maiúscula, como "Ubaldo")
    const users = {
        "Bartolomeu": "71987534811",
        "Alex": "71982338858",
        "Cleia": "71987397443",
        "Javane": "71994011021",
        "Ubaldo": "71988337790"
    };

    // --- ELEMENTOS DO HTML ---
    const usernameSelect = document.getElementById('username'); // Agora é um <select>
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('login-button');
    const userPhoto = document.getElementById('user-photo');
    const errorMessage = document.getElementById('error-message');

    // --- NOVA FUNÇÃO: Preenche o <select> com os usuários ---
    function populateUserSelect() {
        const userNames = Object.keys(users); // Pega a lista de nomes: ["Bartolomeu", "Alex", ...]

        userNames.forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            
            // Define "Bartolomeu" como o usuário padrão
            if (name === "Bartolomeu") {
                option.selected = true;
            }
            
            usernameSelect.appendChild(option);
        });
    }

    // --- FUNÇÃO MODIFICADA: ATUALIZAR A FOTO ---
    function updateUserPhoto() {
        const username = usernameSelect.value; // Pega o valor do usuário selecionado

        userPhoto.onerror = function() {
            this.onerror = null; 
            this.src = 'img/PAM.png'; 
        };

        // *** IMPORTANTE ***
        // Com base no seu arquivo "UBALDO.jpg", esta lógica assume que
        // TODOS os arquivos de foto de usuário estão em MAIÚSCULAS.
        const photoName = username.toUpperCase(); // Converte "Ubaldo" para "UBALDO"
        userPhoto.src = `img/${photoName}.jpg`; // Procura por "img/UBALDO.jpg"
    }

    // --- FUNÇÃO MODIFICADA: TENTAR FAZER LOGIN ---
    function attemptLogin() {
        const username = usernameSelect.value; // Pega o valor do <select>
        const password = passwordInput.value;

        // A verificação agora é direta, sem precisar capitalizar
        if (users[username] && users[username] === password) {
            // SUCESSO
            sessionStorage.setItem('isLoggedIn', 'true');
            window.location.href = 'index.html';
        } else {
            // FALHA
            errorMessage.textContent = 'Senha inválida.';
            errorMessage.style.display = 'block';
        }
    }

    // --- EVENTOS MODIFICADOS ---
    
    // 1. (NOVO) Atualiza a foto quando o usuário *muda* a seleção
    usernameSelect.addEventListener('change', updateUserPhoto);

    // 2. Tenta fazer login ao clicar no botão (sem mudança)
    loginButton.addEventListener('click', attemptLogin);

    // 3. Tenta fazer login ao apertar "Enter" (sem mudança)
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            attemptLogin();
        }
    });

    // --- INICIALIZAÇÃO ---
    // (NOVO) Preenche o dropdown e carrega a foto do usuário padrão (Bartolomeu)
    populateUserSelect();
    updateUserPhoto(); 

});