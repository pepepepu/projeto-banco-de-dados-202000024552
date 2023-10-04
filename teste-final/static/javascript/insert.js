document.addEventListener('DOMContentLoaded', function() {
    //Criando as variáveis
    var blocoOpcoes = document.querySelector('.bloco_opcoes');
    var opcaoCriar = document.querySelector('.botao-opcao:nth-of-type(1)');
    var opcaoInserir = document.querySelector('.botao-opcao:nth-of-type(2)');
    var campos = document.querySelectorAll('.campos');
    var botaoCriar = document.getElementById('campo_botao-criar');
    var botaoInserir = document.getElementById('campo_botao-inserir');
    var selectTabelas = document.getElementById('tabelas');
    var blocoSubtitulo = document.querySelector('.bloco_subtitulo');
    var opcoesCheckBox = document.querySelector('.opcoes_criacao-tabelas');

    //Ocultando as opções checkbox
    opcoesCheckBox.style.display = 'none';

    //Ocultando o select
    selectTabelas.style.display = 'none';

    //Ocultando os botões de inserir e criar
    botaoCriar.style.display = 'none';
    botaoInserir.style.display = 'none';

    //Ocultando todos os campos
    campos.forEach(function(campo) {
        campo.style.display = 'none';
    });

    //Manipulação da exibição conforme uma opção da tabela for selecionada -- Essa parte do código está correta
    selectTabelas.addEventListener('change', function(){
        var valorSelecionado = this.value; //Pega os valores do select

        //Oculta os campos e o botão "Inserir"
        campos.forEach(function(campo){
            campo.style.display = 'none';
            botaoInserir.style.display = 'none';
        });

        //Se alguma opção for selecionada, serão exibidos os campos relacionados à opção selecionada e o botão
        if (valorSelecionado !== '0') {
             var campoExibido = document.querySelector('.campos_' + valorSelecionado);
             campoExibido.style.display = 'flex';
             botaoInserir.style.display = 'flex';
        }
    });

    //Quando o botão Criar tabelas for clicado: -- Essa parte do código está correta
    opcaoCriar.addEventListener('click', function() {
        blocoOpcoes.style.display = 'none'; //Oculta os botões depois que eles são selecionados

        opcoesCheckBox.style.display = 'flex'; //Exibe os checkboxes

        blocoSubtitulo.textContent = "Escolha qual(quais) tabela(s) deseja criar"; //Muda o texto do subtítulo
        botaoCriar.style.display = 'flex'; //Exibe o botão
    });

    //Quando o botão Criar tabela(s) for clicado: -- Essa parte do código está correta
    botaoCriar.addEventListener('click', function(){
        console.log('Botão clicado!');
        var checkboxesSelecionadas = document.querySelectorAll('.opcao-tabela:checked');
        console.log('Checkboxes selecionados:', checkboxesSelecionadas); // Adicione esta linha

        var formData = new FormData();
    
        checkboxesSelecionadas.forEach(function(checkbox) {
            formData.append('tabelas', checkbox.value);
            console.log('Checkbox value:', checkbox.value); // Adicione esta linha
        });
    
        fetch('/insert/criar-tabelas', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            console.log(response); // Adicione esta linha
            if (response.status === 409) {
                // Se as tabelas já existem, exibir mensagem
                return response.text().then(message => {
                    console.log('Erro:', message);
                });
            } else {
                console.log('Status da resposta:', response.status);
                return response.text().then(data => {
                    console.log('Resposta do servidor:', data);
                });
            }
        })
        .catch(error => console.error('Error:', error));
    });
    
    //Quando o botão Inserir dados for clicado: -- Essa parte do código está correta
    opcaoInserir.addEventListener('click', function(){
        blocoOpcoes.style.display = 'none'; //Oculta os botões depois que eles são selecionados

        blocoSubtitulo.textContent = "Escolha onde deseja inserir as informações e em seguida preencha os campos abaixo"; //Muda o texto do subtítulo

        selectTabelas.style.display = 'block'; //Exibe o select

        campos.forEach(function(campo){
            campo.style.display = 'none';
        }); //Mantém os campos ocultos

        selectTabelas.value = '0'; //Define o select com valor padrão
    });
    
    
    //Quando o botão Inserir informações for clicado:
    botaoInserir.addEventListener('click', function(event){
        event.preventDefault(); // Para evitar o comportamento padrão do formulário
    
        var tabelaSelecionada = document.getElementById('tabelas').value;
        var formularioId = 'formulario_inserir_' + tabelaSelecionada;
        var formulario = document.getElementById(formularioId);
        var formData = new FormData(formulario);
    
        // Mapeia as tabelas aos campos obrigatórios correspondentes
        var camposObrigatoriosPorTabela = {
            usuario: ['nome_usuario', 'email', 'senha'],
            musica: ['titulo_musica', 'nome_artista', 'titulo_album'],
            artista: ['nome_artista1', 'genero_musical'],
            album: ['titulo_album1', 'nome_artista2', 'data']
        };
    
        var camposObrigatorios = camposObrigatoriosPorTabela[tabelaSelecionada];
        
        var camposVazios = camposObrigatorios.filter(function(campo) {
            return campo !== 'whatsapp' && campo !== 'twitter' && campo !== 'instagram' && formData.get(campo) === '';
        });
    
        if (camposVazios.length > 0) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
    
        fetch('/insert/inserir-dados', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            console.log('Resposta do servidor:', data);
            formulario.reset(); 
        })
        .catch(error => console.error('Error:', error));
    });
    
});