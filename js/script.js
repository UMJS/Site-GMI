// *** INÍCIO DA PROTEÇÃO DE ROTA ***
// Verifica se o "token" de login não existe na sessão
if (sessionStorage.getItem('isLoggedIn') !== 'true') {
    // Se não existir, redireciona o usuário de volta para a tela de login
    window.location.href = 'login.html';
}
// *** FIM DA PROTEÇÃO DE ROTA ***


// Executa o código quando o HTML da página estiver pronto
document.addEventListener('DOMContentLoaded', function() {
            
    // --- LISTA DE ALUNOS ---
    const morningStudents = [
        "ALEX GABRIEL ALEXANDRINO CORSINO", "ALEXANDRE DOS SANTOS SOUSA", "ANA PAULA DUARTE",
        "AYALLA SOPHIA ALMEIDA BRITO", "AYAN LUIGGI DOS SANTOS LIMA", "CRISMILE NUNES DO ESPIRITO SANTO SOUZA",
        "DANIEL GONÇALVES MAIA BRANDÃO", "DOUGLAS SOUZA SILVA", "ESTER ANDRADE MOTA DUARTE",
        "GABRIEL CERQUEIRA DA COSTA RAMOS", "IBSON SOUZA CAPINAM DE BRITO", "JARISSON VITOR SANTOS DAS MERCES",
        "JOÃO FRANCISCO GRAMOSA DA SILVA", "LUNNA CLARA CORSINO ROSAS", "NAUANNE GABRIELLE ALMEIDA BRITO",
        "PAULA VITORIA ARAUJO PEREIRA DOS SANTOS", "RAVI LUCCA SANTOS FALCK", "RICHARD ALLAN MAGALHÃES DOS ANJOS",
        "SAMUEL ARAUJO SANTOS", "SERGIO ALESSANDRO DUARTE MERCES DOS PRAZERES", "SOPHIA ARAUJO SANTOS",
        "VITOR JUNIOR DOS SANTOS CERQUEIRA", "MARINA JÚLIA F. DOS SANTOS", "LOHAN CORSINO ROSAS"
    ];

    const afternoonStudents = [
        "AILANA RAFAEL SANTANA BATISTA DO NASCIMENTO", "ALANDERSSON SOUSA SILVA", "ALESSANDRA VITÓRIA DE SOUZA ALMEIDA",
        "ANA CLARA ALMEIDA PAIM", "ANDREY EMANUEL VIEIRA DOS SANTOS", "ARTHUR NASCIMENTO BARRETO",
        "DANDARA JULIA DA BOA MORTE SEVERO", "DANILO GONÇALVES MAIA BRANDÃO", "DENISSON DA HORA DOS SANTOS FILHO",
        "EDUARDA VITORIA DOS SANTOS TELES", "ELLANO DOS SANTOS PINTO", "FERNANDO LUIS SANTOS DA SILVA",
        "GABRIEL DA SILVA BARRETO", "GUSTAVO CARVALHO DOS SANTOS", "LARA KELLY CORSINO DE JESUS",
        "MATHEUS DOS SANTOS ALVES", "PAULA VITÓRIA SOUZA LIMA", "REBECA VITÓRIA DE SOUZA LIMA",
        "RICHARLYSON DOS SANTOS NATIVIDADE", "SARA DA COSTA RAMOS", "THAIAN HENRIQUE SANTOS NATIVIDADE",
        "THAIANA CRISTINA SANTOS NATIVIDADE", "YURI BARRETO NASCIMENTO", "THAISSA HELENA S. DA MOTA",
        "PÉROLA BONTIM DE ALMEIDA", "JÚLIA BONFIM DE ALMEIDA", "ANDREIA JÚLIA DOS CERQUEIRA", "JENIFFER BARROSO C. SOUZA"
    ];

    // --- DATAS DAS AULAS ---
    const classDates = [
        { value: "2023-10-01", label: "01/out - AULA 1" },
        { value: "2023-10-08", label: "08/out - AULA 2" },
        { value: "2023-10-15", label: "15/out - AULA 3" },
        { value: "2023-10-22", label: "22/out - AULA 4" }
    ];

    // --- ORDENAÇÃO ALFABÉTICA ---
    morningStudents.sort();
    afternoonStudents.sort();

    // --- ELEMENTOS DO HTML ---
    const morningGrid = document.getElementById('morning-grid');
    const afternoonGrid = document.getElementById('afternoon-grid');
    const dateSelect = document.getElementById('date-select');
    const prevDateBtn = document.getElementById('prev-date');
    const nextDateBtn = document.getElementById('next-date');
    const viewTableBtn = document.getElementById('view-table');
    const saveDataBtn = document.getElementById('save-data');
    const resetDataBtn = document.getElementById('reset-data');
    const tableModal = document.getElementById('table-modal');
    const closeModal = document.getElementById('close-modal');
    const modalTableContent = document.getElementById('modal-table-content');

    // --- VARIÁVEIS GLOBAIS ---
    let currentDateIndex = 0;
    let attendanceData = {};

    // --- INICIALIZAÇÃO ---
    function initialize() {
        loadAttendanceData();
        updateDateSelector();
        updateNavigationButtons();
        createStudentCards();
    }

    // --- FUNÇÕES DE DATA ---
    function updateDateSelector() {
        dateSelect.innerHTML = '';
        classDates.forEach((date, index) => {
            const option = document.createElement('option');
            option.value = date.value;
            option.textContent = date.label;
            if (index === currentDateIndex) {
                option.selected = true;
            }
            dateSelect.appendChild(option);
        });
    }

    function updateNavigationButtons() {
        prevDateBtn.disabled = currentDateIndex === 0;
        nextDateBtn.disabled = currentDateIndex === classDates.length - 1;
    }

    // --- FUNÇÕES DE DADOS ---
    function loadAttendanceData() {
        const savedData = localStorage.getItem('protetorMirimAttendance');
        if (savedData) {
            attendanceData = JSON.parse(savedData);
            initializeAttendanceData(true); 
        } else {
            initializeAttendanceData(false);
        }
    }

    function initializeAttendanceData(merge = false) {
        if (!merge) {
            attendanceData = {};
        }
        
        classDates.forEach(date => {
            if (!attendanceData[date.value]) {
                attendanceData[date.value] = { morning: {}, afternoon: {} };
            }
            
            morningStudents.forEach(student => {
                if (attendanceData[date.value].morning[student] === undefined) {
                    attendanceData[date.value].morning[student] = true; 
                }
            });
            
            afternoonStudents.forEach(student => {
                if (attendanceData[date.value].afternoon[student] === undefined) {
                    attendanceData[date.value].afternoon[student] = true; 
                }
            });
        });
    }

    function saveAttendanceData() {
        localStorage.setItem('protetorMirimAttendance', JSON.stringify(attendanceData));
        alert('Dados salvos com sucesso!');
    }

    function resetAttendanceData() {
        if (confirm('Tem certeza que deseja limpar todos os dados de presença? Esta ação não pode ser desfeita.')) {
            localStorage.removeItem('protetorMirimAttendance');
            initializeAttendanceData(false);
            createStudentCards();
            alert('Dados resetados com sucesso!');
        }
    }

    // --- FUNÇÃO PARA CRIAR OS CARDS ---
    function createStudentCards() {
        morningGrid.innerHTML = '';
        afternoonGrid.innerHTML = '';
        
        const currentDate = classDates[currentDateIndex].value;
        
        morningStudents.forEach(name => {
            const isPresent = attendanceData[currentDate].morning[name];
            createStudentCard(name, morningGrid, isPresent, 'morning');
        });
        
        afternoonStudents.forEach(name => {
            const isPresent = attendanceData[currentDate].afternoon[name];
            createStudentCard(name, afternoonGrid, isPresent, 'afternoon');
        });
    }

    function createStudentCard(name, gridElement, isPresent, shift) {
        
        // Caminho da pasta "img/" e extensão ".jpg"
        const imageFile = `img/${name}.jpg`;
        
        const card = document.createElement('div');
        card.className = `student-card ${isPresent ? '' : 'is-absent'}`;
        card.dataset.name = name;
        card.dataset.shift = shift;

        const img = document.createElement('img');
        img.src = imageFile;
        img.alt = name;

        // Fallback da Imagem
        img.onerror = function() {
            this.onerror = null; 
            this.src = 'img/PAM.png';
            this.style.objectFit = 'contain';
        };

        const nameEl = document.createElement('div');
        nameEl.className = 'name';
        nameEl.textContent = name;

        card.onclick = function() {
            const currentDate = classDates[currentDateIndex].value;
            const studentName = this.dataset.name;
            const studentShift = this.dataset.shift;
            
            attendanceData[currentDate][studentShift][studentName] = 
                !attendanceData[currentDate][studentShift][studentName];
            
            this.classList.toggle('is-absent');
        };

        card.appendChild(img);
        card.appendChild(nameEl);
        gridElement.appendChild(card);
    }

    // --- FUNÇÃO PARA EXIBIR A TABELA COMPLETA ---
    function showAttendanceTable() {
        let tableHTML = `<table class="attendance-table"><thead><tr><th>ALUNO</th>`;
        
        classDates.forEach(date => {
            tableHTML += `<th>${date.label.replace(' - ', '<br>')}</th>`;
        });
        
        tableHTML += `<th>PRESENÇAS</th><th>FALTAS</th></tr></thead><tbody>`;
        
        const generateTableRows = (students, shift) => {
            let rowsHTML = '';
            students.forEach(student => {
                rowsHTML += `<tr><td>${student}</td>`;
                
                let presences = 0;
                let absences = 0;
                
                classDates.forEach(date => {
                    const isPresent = attendanceData[date.value][shift][student];
                    rowsHTML += `<td class="${isPresent ? 'present' : 'absent'}">${isPresent ? 'P' : 'F'}</td>`;
                    
                    if (isPresent) {
                        presences++;
                    } else {
                        absences++;
                    }
                });
                
                rowsHTML += `<td>${presences}</td><td>${absences}</td></tr>`;
            });
            return rowsHTML;
        };

        tableHTML += `<tr><td colspan="${classDates.length + 3}" style="background-color: #f0f0f0; text-align:center; font-weight:bold;">TURNO DA MANHÃ</td></tr>`;
        tableHTML += generateTableRows(morningStudents, 'morning');

        tableHTML += `<tr><td colspan="${classDates.length + 3}" style="background-color: #f0f0f0; text-align:center; font-weight:bold;">TURNO DA TARDE</td></tr>`;
        tableHTML += generateTableRows(afternoonStudents, 'afternoon');
        
        tableHTML += `</tbody></table>`;
        
        modalTableContent.innerHTML = tableHTML;
        tableModal.style.display = 'block';
    }

    // --- EVENT LISTENERS ---
    dateSelect.addEventListener('change', function() {
        currentDateIndex = classDates.findIndex(date => date.value === this.value);
        createStudentCards();
        updateNavigationButtons();
    });

    prevDateBtn.addEventListener('click', function() {
        if (currentDateIndex > 0) {
            currentDateIndex--;
            updateDateSelector();
            updateNavigationButtons();
            createStudentCards();
        }
    });

    nextDateBtn.addEventListener('click', function() {
        if (currentDateIndex < classDates.length - 1) {
            currentDateIndex++;
            updateDateSelector();
            updateNavigationButtons();
            createStudentCards();
        }
    });

    viewTableBtn.addEventListener('click', showAttendanceTable);
    saveDataBtn.addEventListener('click', saveAttendanceData);
    resetDataBtn.addEventListener('click', resetAttendanceData);

    closeModal.addEventListener('click', function() {
        tableModal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === tableModal) {
            tableModal.style.display = 'none';
        }
    });

    // --- INICIA A PÁGINA ---
    initialize();
});