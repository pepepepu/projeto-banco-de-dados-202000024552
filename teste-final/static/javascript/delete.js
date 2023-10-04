document.addEventListener('DOMContentLoaded', function() {
    //Criandos as variáveis
    var blocoOpcoes = document.querySelector('.bloco_opcoes');
    var botaoDTabela = document.getElementById('btDeletarTabela');
    var botaoDLinha = document.getElementById('btDeletarLinha');
    var campos = document.querySelectorAll('.campos');
    var botaoDeletarTabela = document.getElementById('botao-deletarTabela');
    var botaoBuscar = document.getElementById('botao-realizarBusca');
    var botaoDeletarLinha = document.getElementById('botao-deletarLinha');
    var selectTabelas = document.getElementById('tabelas');
    var blocoSubtitulo = document.querySelector('.bloco_subtitulo');

    //Ocultando o select
    selectTabelas.style.display = 'none'

    //Ocultando os botões de exibição
    botaoDeletarTabela.style.display = 'none';
    botaoDeletarLinha.style.display = 'none';
    botaoBuscar.style.display = 'none';

    //Ocultando todos os campos
    campos.forEach(function(campo) {
        campo.style.display = 'none';
    });

    //Quando o Deletar tabela total for clicado: -- Essa parte do código está correta
    botaoDTabela.addEventListener('click', function() {
        blocoOpcoes.style.display = 'none'; //Oculta os botões depois que eles são selecionados

        selectTabelas.style.display = 'flex'; //Exibe o select pra seleção

        blocoSubtitulo.textContent = "Escolha onde deseja deletar as informações e em seguida preencha os campos correspondentes"; //Altera o texto do subtítulo

        selectTabelas.value = '0'; //Define o valor do select para ser 0 por padrão

        selectTabelas.addEventListener('change', function(){
            var valorSelecionado = this.value;
            if (valorSelecionado !== '0') {
                //Exibe o botão caso seja escolhida alguma opção que não seja 0
                botaoDeletarTabela.style.display = 'flex';
            } else {
                //Esconde o botão se a opção for 0
                botaoDeletarTabela.style.display = 'none';
                
                //Limpa a área de resultados
                var resultado = document.getElementById('resultado');
                resultado.innerHTML = '';
            }
        });
    });

    //Quando o Detetar linha específica total for clicado: -- Essa parte do código está correta
    botaoDLinha.addEventListener('click', function() {
        blocoOpcoes.style.display = 'none'; //Oculta os botões depois que eles são selecionados

        selectTabelas.style.display = 'flex'; //Exibe o select para seleção

        blocoSubtitulo.textContent = "Escolha onde deseja deletar as informações";

        selectTabelas.value = '0'; //Define o select para o valor 0 (default)

        //Manipulação da exibição dos campos conforme uma opção da tabela for selecionada 
        selectTabelas.addEventListener('change', function(){
            var valorSelecionado = this.value; //Pega os valores do select

            //Mantém os campos ocultos assim como o botão de exibição até que algum valor seja escolhido
            campos.forEach(function(campo){
                campo.style.display = 'none';
                botaoBuscar.style.display = 'none';
            });

            //Se o valor for diferente de 0 (valor default), ele exibirá os campos conforme a opção selecionada
            if (valorSelecionado !== '0') {
                var campoExibido = document.querySelector('.campos_' + valorSelecionado);
                campoExibido.style.display = 'flex';
                botaoBuscar.style.display = 'flex';
            }
        });
    });

     // Adiciona um evento de clique no botão "Deletar tabela"
     botaoDeletarTabela.addEventListener('click', function() {
        // Obtém o valor selecionado no elemento 'selectTabelas'
        var valorSelecionado = selectTabelas.value;
        // Verifica se o valor selecionado é diferente de '0'
        if (valorSelecionado !== '0') {
            // Envia uma requisição para deletar a tabela utilizando o valor selecionado
            fetch(`/delete/tabela/${valorSelecionado}`)
                // Trata a resposta como JSON
                .then(response => response.json())
                // Executa esta função quando a resposta é recebida com sucesso
                .then(data => {
                    // Exibe uma mensagem com o conteúdo da resposta
                    alert(data.message);
                })
                // Captura erros caso ocorra algum problema na requisição
                .catch(error => {
                    // Exibe uma mensagem de erro
                    alert('Erro ao deletar tabela');
                });
        } else {
            // Exibe uma mensagem pedindo ao usuário para selecionar uma tabela
            alert('Por favor, selecione uma tabela');
        }
    });

    // Adiciona um evento de clique no botão "Realizar busca"

    document.getElementById('botao-realizarBusca').addEventListener('click', function() {
        try {
            var tabelaSelecionada = document.getElementById('tabelas').value;
            var dadosForm = new FormData();
    
            var camposEspecificos = document.querySelectorAll('.campos_' + tabelaSelecionada + ' input');
    
            camposEspecificos.forEach(function(campo) {
                dadosForm.append(campo.name, campo.value);
            });
    
            console.log('Dados do formulário:');
            for (var pair of dadosForm.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }
    
            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/read/exibir-selecionada/' + tabelaSelecionada, true);
    
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        var dados = JSON.parse(xhr.responseText);
    
                        if (dados.length > 0) {
                            console.log('Dados recebidos do servidor:', dados);
    
                            exibirDadosNaTabela(dados, tabelaSelecionada);
    
                            // Certifique-se de que botaoDeletarLinha está definido antes de tentar acessá-lo
                            if (typeof botaoDeletarLinha !== 'undefined' && botaoDeletarLinha !== null) {
                                botaoDeletarLinha.style.display = 'flex';
                            } else {
                                console.log('botaoDeletarLinha não está definido.');
                            }
    
                        } else {
                            var resultado = document.getElementById('resultado');
                            resultado.innerHTML = '<div class="minha-tabela-container">Nenhum dado encontrado.</div>';
                        }
                    } else {
                        alert('Erro ao buscar dados da tabela.');
                    }
                }
            };
    
            xhr.send(dadosForm);
    
        } catch (error) {
            console.error('Ocorreu um erro:', error);
        }
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

    document.getElementById('botao-deletarLinha').addEventListener('click', function() {
        var tabelaSelecionada = document.getElementById('tabelas').value;
        var dadosForm = new FormData();
    
        // Encontre os campos específicos para a tabela selecionada
        var camposEspecificos = document.querySelectorAll('.campos_' + tabelaSelecionada + ' input');
    
        // Adicione os campos específicos ao objeto FormData
        camposEspecificos.forEach(function(campo) {
            dadosForm.append(campo.name, campo.value);
        });
    
        // Realiza uma requisição AJAX POST para excluir a linha
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/delete/linha/' + tabelaSelecionada, true);
    
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var data = JSON.parse(xhr.responseText);
                    if (data.message === 'Linha excluída com sucesso') {
                        alert(data.message);
                    } else {
                        alert(data.message);
                    }
                } else {
                    alert('Erro ao excluir linha.');
                }
            }
        };
        xhr.send(dadosForm);
    });
    
            
});
