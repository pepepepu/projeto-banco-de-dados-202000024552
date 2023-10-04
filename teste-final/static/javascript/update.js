document.addEventListener('DOMContentLoaded', function() {
    //Criando as variáveis
    var resultadoTabela = document.getElementById('resultado');
    var tabela = document.getElementById('tabelas');
    var campos = document.querySelectorAll('.campos');
    var botaoPesquisar = document.getElementById('btPesquisar');
    var botaoSelecionar = document.getElementById('btSelecionar');
    var botaoAtualizar = document.getElementById('btAtualizar');
    var campoIndice = document.getElementById('campo-indice');

    //Ocultando os botões
    botaoPesquisar.style.display = 'flex';
    botaoSelecionar.style.display = 'none';
    botaoAtualizar.style.display = 'none';
    campoIndice.style.display = 'none';

    //Ocultando os campos
    campos.forEach(function(campo) {
        campo.style.display = 'none';
    });

    //Quando o Botão de Exibir tudo for clicado: -- Essa parte do código está correta
    document.getElementById('btPesquisar').addEventListener('click', function() {
        // Obtém o valor selecionado do elemento com o ID 'tabelas'
        var tabelaSelecionada = document.getElementById('tabelas').value;
    
        // Verifica se a tabela selecionada é válida (se é diferente de '0')
        if (tabelaSelecionada === '0') {
            alert('Por favor, selecione uma tabela válida.');
            return; // Encerra a execução da função
        }
    
        // Cria um objeto XMLHttpRequest para fazer uma requisição AJAX
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/read/exibir-tudo/' + tabelaSelecionada, true);
    
        // Define uma função que será chamada quando o estado da requisição mudar
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                // Se a requisição for bem-sucedida (estado 4 e status 200)
                // Converte a resposta do servidor (que é em JSON) em um objeto JavaScript
                var dados = JSON.parse(xhr.responseText);
                // Chama a função para exibir os dados na tabela
                exibirDadosNaTabela(dados, tabelaSelecionada);
                campoIndice.style.display = 'flex';
                botaoPesquisar.style.display = 'none';
                botaoSelecionar.style.display = 'flex';
            } else if (xhr.status !== 200) {
                // Se houver algum erro na requisição, exibe um alerta
                alert('Erro ao buscar dados da tabela.');
            }
        };
    
        // Envia a requisição
        xhr.send();
    });

    //Função de criação de tabela e organização da mesma: -- Essa parte do código está correta
    function exibirDadosNaTabela(dados, tabelaSelecionada) {
        var ordemDasColunas;
    
        // Define a ordem das colunas para cada tabela
        switch (tabelaSelecionada) {
            case 'usuario':
                ordemDasColunas = ['id', 'nome_usuario', 'email', 'senha', 'whatsapp', 'twitter', 'instagram'];
                break;
            case 'musica':
                ordemDasColunas = ['id', 'titulo_musica', 'nome_artista', 'titulo_album'];
                break;
            case 'artista':
                ordemDasColunas = ['id', 'nome_artista', 'genero_musical'];
                break;
            case 'album':
                ordemDasColunas = ['id', 'titulo_album', 'nome_artista', 'data'];
                break;
            default:
                alert('Tabela inválida');
                return;
        }
    
        var tabela = '<table class="minha-tabela">';
        tabela += '<tr class="minha-linha-header">';
    
        // Adiciona os cabeçalhos de acordo com a ordem definida
        for (var i = 0; i < ordemDasColunas.length; i++) {
            tabela += '<th class="minha-celula-header">' + ordemDasColunas[i] + '</th>';
        }
    
        tabela += '</tr>';
    
        for (var i = 0; i < dados.length; i++) {
            tabela += '<tr class="minha-linha">';
            for (var j = 0; j < ordemDasColunas.length; j++) {
                var coluna = ordemDasColunas[j];
                tabela += '<td class="minha-celula">' + dados[i][coluna] + '</td>';
            }
            tabela += '</tr>';
        }
    
        tabela += '</table>';
    
        var resultado = document.getElementById('resultado');
        resultado.innerHTML = '<div class="minha-tabela-container">' + tabela + '</div>';
    }

    document.getElementById('btSelecionar').addEventListener('click', function() {
        var tabelaSelecionada = document.getElementById('tabelas').value;
        campos.forEach(function(campo){
            campo.style.display = 'none';
        });

        //Se o valor for diferente de 0 (valor default), ele exibirá os campos conforme a opção selecionada
        if (tabelaSelecionada !== '0') {
            var campoExibido = document.querySelector('.campos_' + tabelaSelecionada);
            campoExibido.style.display = 'flex';
            tabela.style.display = 'none';
            campoIndice.style.display = 'none';
            botaoSelecionar.style.display = 'none';
            resultadoTabela.style.display = 'none';
            botaoAtualizar.style.display = 'flex';
        }
    });

    botaoAtualizar.addEventListener('click', function(event) {
        event.preventDefault();
    
        var tabelaSelecionada = document.getElementById('tabelas').value;
        var id = campoIndice.value;
    
        if (tabelaSelecionada === '0' || id === '') {
            alert('Por favor, selecione uma tabela e insira um índice válido.');
            return;
        }
    
        var formularioId = 'formulario_atualizar_' + tabelaSelecionada;
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
            return formData.get(campo) === '';
        });
    
        if (camposVazios.length > 0) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
    
        formData.append('id', id);
    
        fetch(`/update/atualizar-${tabelaSelecionada}`, {
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

