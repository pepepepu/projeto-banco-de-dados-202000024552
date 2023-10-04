document.addEventListener('DOMContentLoaded', function() {
    //Criando as variáveis
    var blocoOpcoes = document.querySelector('.bloco_opcoes');
    var botaoCEspecifica = document.getElementById('cEspecifica');
    var botaoCTotal = document.getElementById('cTotal');
    var campos = document.querySelectorAll('.campos');
    var botaoExibirTodos = document.getElementById('botao-tudo');
    var botaoExibirSelecionado = document.getElementById('botao-selecionada');
    var selectTabelas = document.getElementById('tabelas');
    var blocoSubtitulo = document.querySelector('.bloco_subtitulo');

    //Ocultando o select
    selectTabelas.style.display = 'none';

    //Ocultando os botões de exibição
    botaoExibirTodos.style.display = 'none';
    botaoExibirSelecionado.style.display = 'none';

    //Ocultando todos os campos
    campos.forEach(function(campo) {
        campo.style.display = 'none';
    });

    //Quando o Botão de consulta total for clicado: -- Essa parte do código está correta
    botaoCTotal.addEventListener('click', function() {
        blocoOpcoes.style.display = 'none'; //Oculta os botões depois que eles são selecionados

        selectTabelas.style.display = 'flex'; //Exibe o select pra seleção
        blocoSubtitulo.textContent = "Escolha qual tabela deseja exibir todo o conteúdo"; //Altera o texto do subtítulo
        selectTabelas.value = '0'; //Define o valor do select para ser 0 por padrão

        //Manipulação da exibição conforme uma opção da tabela for selecionada
        selectTabelas.addEventListener('change', function(){
            var valorSelecionado = this.value;
            if (valorSelecionado !== '0') {
                //Exibe o botão caso seja escolhida alguma opção que não seja 0
                botaoExibirTodos.style.display = 'flex';
            } else {
                //Esconde o botão se a opção for 0
                botaoExibirTodos.style.display = 'none';
                
                //Limpa a área de resultados
                var resultado = document.getElementById('resultado');
                resultado.innerHTML = '';
            }
        });
    });

    //Quando o Botão de Consulta específica for clicado: -- Essa parte do código está correta
    botaoCEspecifica.addEventListener('click', function(){
        blocoOpcoes.style.display = 'none'; //Oculta os botões depois que eles são selecionados

        selectTabelas.style.display = 'flex'; //Exibe o select para seleção
        blocoSubtitulo.textContent = "Escolha qual o conteúdo específico que deseja exibir"; //Altera o texto do sutítulo

        selectTabelas.value = '0'; //Define o select para o valor 0 (default)

        //Manipulação da exibição dos campos conforme uma opção da tabela for selecionada 
        selectTabelas.addEventListener('change', function(){
            var valorSelecionado = this.value; //Pega os valores do select

            //Mantém os campos ocultos assim como o botão de exibição até que algum valor seja escolhido
            campos.forEach(function(campo){
                campo.style.display = 'none';
                botaoExibirSelecionado.style.display = 'none';
            });

            //Se o valor for diferente de 0 (valor default), ele exibirá os campos conforme a opção selecionada
            if (valorSelecionado !== '0') {
                var campoExibido = document.querySelector('.campos_' + valorSelecionado);
                campoExibido.style.display = 'flex';
                botaoExibirSelecionado.style.display = 'flex';
            }
        });
    });

    //Quando o Botão de Exibir tudo for clicado: -- Essa parte do código está correta
    document.getElementById('botao-tudo').addEventListener('click', function() {
        // Obtém o valor selecionado do elemento com o ID 'tabelas'
        var tabelaSelecionada = document.getElementById('tabelas').value;
        // Torna o botão com o ID 'botaoExibirTodos' invisível
        botaoExibirTodos.style.display = 'none';
    
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

    document.getElementById('botao-selecionada').addEventListener('click', function() {
        var tabelaSelecionada = document.getElementById('tabelas').value;
        var dadosForm = new FormData();

        // Encontre os campos específicos para a tabela selecionada
        var camposEspecificos = document.querySelectorAll('.campos_' + tabelaSelecionada + ' input');

        // Adicione os campos específicos ao objeto FormData
        camposEspecificos.forEach(function(campo) {
            dadosForm.append(campo.name, campo.value);
        });

        // Debug - Adicione estas linhas
        console.log('Dados do formulário:');
        for (var pair of dadosForm.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

        // Realiza uma requisição AJAX POST
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/read/exibir-selecionada/' + tabelaSelecionada, true);

        // Define uma função para tratar a resposta do servidor
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var dados = JSON.parse(xhr.responseText);
        
                    if (dados.length > 0) {
                        // Debug - Adicione esta linha
                        console.log('Dados recebidos do servidor:', dados);
        
                        exibirDadosNaTabela(dados, tabelaSelecionada);

                    } else {
                        var resultado = document.getElementById('resultado');
                        resultado.innerHTML = '<div class="minha-tabela-container">Nenhum dado encontrado.</div>';
                    }
                } else {
                    alert('Erro ao buscar dados da tabela.');
                }
            }
        };

        // Envia os dados do formulário
        xhr.send(dadosForm);
    });
});

