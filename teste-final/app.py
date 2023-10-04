from flask import Flask, request, render_template, jsonify
import database
import logging

logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)

#Definindo as rotas das páginas
@app.route('/')
@app.route('/main')
def main():
    return render_template('index.html')

@app.route('/page1')
def page1():
    return render_template('page1.html')

@app.route('/insert')
def insert():
    return render_template('insert.html')

@app.route('/read')
def read():
    return render_template('read.html')

@app.route('/update')
def update():
    return render_template('update.html')

@app.route('/delete')
def delete():
    return render_template('delete.html')

@app.route('/insert/criar-tabelas', methods=['POST'])
def criar_tabelas():
    try:
        tabelas_selecionadas = request.form.getlist('tabelas')

        for tabela in tabelas_selecionadas:
            database.criar_tabela(tabela)

        return "Tabelas criadas com sucesso!"
    
    except Exception as e:
        print(f"Erro ao criar tabelas: {e}")
        return "Erro ao criar tabelas"

@app.route('/insert/inserir-dados', methods=['POST'])
def inserir_dados():
    try:
        tabela = request.form.get('tabela')  # Nome da tabela para inserir os dados

        # Adicione estas linhas para imprimir os valores recebidos
        print(f'tabela: {tabela}')
        print(f'request.form: {request.form}')

        conn = database.conectar_banco()  # Conectar ao banco de dados

        if tabela == 'usuario':
            nome = request.form.get('nome_usuario')
            email = request.form.get('email')
            senha = request.form.get('senha')
            whatsapp = request.form.get('whatsapp')
            twitter = request.form.get('twitter')
            instagram = request.form.get('instagram')
            database.inserir_usuario(conn, nome, email, senha, whatsapp, twitter, instagram)

        elif tabela == 'musica':
            titulo_musica = request.form.get('titulo_musica')
            nome_artista = request.form.get('nome_artista')
            titulo_album = request.form.get('titulo_album')
            database.inserir_musica(conn, titulo_musica, nome_artista, titulo_album)

        elif tabela == 'artista':
            nome_artista = request.form.get('nome_artista1')
            genero_musical = request.form.get('genero_musical')
            database.inserir_artista(conn, nome_artista, genero_musical)
            
        elif tabela == 'album':
            titulo_album = request.form.get('titulo_album1')
            nome_artista = request.form.get('nome_artista2')
            data = request.form.get('data')
            database.inserir_album(conn, titulo_album, nome_artista, data)

        return "Dados inseridos com sucesso!"
    
    except Exception as e:
        print(f"Erro ao inserir dados: {e}")
        return "Erro ao inserir dados"

@app.route('/read/exibir-tudo/<tabela>', methods=['GET'])
def exibir_tudo(tabela):
    try:
        conn = database.conectar_banco()
        cursor = conn.cursor()

        # Verifique se a tabela existe
        if not database.verificar_tabela_existente(conn, tabela):
            return jsonify({'error': 'A tabela não existe'})

        # Execute uma consulta SQL para selecionar todos os dados da tabela
        cursor.execute(f'SELECT * FROM {tabela}')
        dados = cursor.fetchall()

        # Transforme os resultados em um formato adequado para JSON
        colunas = [desc[0] for desc in cursor.description]
        dados_formatados = [dict(zip(colunas, linha)) for linha in dados]

        return jsonify(dados_formatados)
    
    except Exception as e:
        print(f"Erro ao buscar dados da tabela: {e}")
        return jsonify({'error': 'Erro ao buscar dados da tabela'})
    finally:
        cursor.close()
        conn.close()

@app.route('/read/exibir-selecionada/<tabela>', methods=['POST'])
def exibir_selecionada(tabela):
    try:
        conn = database.conectar_banco()
        cursor = conn.cursor()

        if not database.verificar_tabela_existente(conn, tabela):
            return jsonify({'error': 'A tabela não existe'})

        # Obtém os dados do formulário
        dados_formulario = request.form

        # Cria a consulta SQL baseada nos dados do formulário
        consulta = f'SELECT * FROM {tabela} WHERE '
        parametros = []

        for campo, valor in dados_formulario.items():
            consulta += f'{campo} = %s AND '
            parametros.append(valor)

        consulta = consulta.rstrip('AND ')

        cursor.execute(consulta, tuple(parametros))
        dados = cursor.fetchall()

        colunas = [desc[0] for desc in cursor.description]
        dados_formatados = [dict(zip(colunas, linha)) for linha in dados]

        return jsonify(dados_formatados)
    
    except Exception as e:
        print(f"Erro ao buscar dados da tabela: {e}")
        return jsonify({'error': 'Erro ao buscar dados da tabela'})
    finally:
        cursor.close()
        conn.close()

@app.route('/delete/tabela/<tabela>', methods=['GET'])
def deletar_tabela(tabela):
    try:
        conn = database.conectar_banco()
        cursor = conn.cursor()

        # Verifique se a tabela existe
        if not database.verificar_tabela_existente(conn, tabela)[0]:
            return jsonify({'error': 'A tabela não existe'})

        # Execute a consulta SQL para deletar a tabela
        cursor.execute(f'DROP TABLE {tabela}')
        conn.commit()

        return jsonify({'message': f'Tabela {tabela} deletada com sucesso'})
    
    except Exception as e:
        print(f"Erro ao deletar tabela: {e}")
        return jsonify({'error': 'Erro ao deletar tabela'})
    finally:
        cursor.close()
        conn.close()

@app.route('/delete/linha/<tabela>', methods=['POST'])
def excluir_linha(tabela):
    try:
        conn = database.conectar_banco()
        cursor = conn.cursor()

        if not database.verificar_tabela_existente(conn, tabela):
            return jsonify({'error': 'A tabela não existe'})

        dados_formulario = request.form

        consulta = f'DELETE FROM {tabela} WHERE '
        parametros = []

        for campo, valor in dados_formulario.items():
            consulta += f'{campo} = %s AND '
            parametros.append(valor)

        consulta = consulta.rstrip('AND ')

        cursor.execute(consulta, tuple(parametros))
        conn.commit()

        return jsonify({'message': 'Linha excluída com sucesso!'})
    
    except Exception as e:
        print(f"Erro ao excluir linha da tabela: {e}")
        return jsonify({'error': 'Erro ao excluir linha da tabela'})
    finally:
        cursor.close()
        conn.close()

@app.route('/read/buscar-dados/<tabela>', methods=['POST'])
def buscar_dados(tabela):
    try:
        conn = database.conectar_banco()
        cursor = conn.cursor()

        if not database.verificar_tabela_existente(conn, tabela):
            return jsonify({'error': 'A tabela não existe'})

        dados_formulario = request.form

        consulta = f'SELECT * FROM {tabela} WHERE '
        parametros = []

        for campo, valor in dados_formulario.items():
            consulta += f'{campo} = %s AND '
            parametros.append(valor)

        consulta = consulta.rstrip('AND ')

        cursor.execute(consulta, tuple(parametros))
        dados = cursor.fetchall()

        colunas = [desc[0] for desc in cursor.description]
        dados_formatados = [dict(zip(colunas, linha)) for linha in dados]

        return jsonify(dados_formatados)
    
    except Exception as e:
        print(f"Erro ao buscar dados da tabela: {e}")
        return jsonify({'error': 'Erro ao buscar dados da tabela'})
    finally:
        cursor.close()
        conn.close()

@app.route('/update/atualizar-usuario', methods=['POST'])
def atualizar_usuario():
    try:
        conn = database.conectar_banco()
        cursor = conn.cursor()

        id = request.form.get('id')
        nome_usuario = request.form.get('nome_usuario')
        email = request.form.get('email')
        senha = request.form.get('senha')
        whatsapp = request.form.get('whatsapp')
        twitter = request.form.get('twitter')
        instagram = request.form.get('instagram')

        database.atualizar_usuario(conn, id, nome_usuario, email, senha, whatsapp, twitter, instagram)

        return jsonify({'success': True, 'message': 'Dados atualizados com sucesso!'})
    
    except Exception as e:
        print(f"Erro ao atualizar dados do usuário: {e}")
        return jsonify({'error': 'Erro ao atualizar dados do usuário'})
    finally:
        cursor.close()
        conn.close()

@app.route('/update/atualizar-musica', methods=['POST'])
def atualizar_musica():
    try:
        conn = database.conectar_banco()
        cursor = conn.cursor()

        id = request.form.get('id')
        titulo_musica = request.form.get('titulo_musica')
        nome_artista = request.form.get('nome_artista')
        titulo_album = request.form.get('titulo_album')

        database.atualizar_musica(conn, id, titulo_musica, nome_artista, titulo_album)

        return jsonify({'success': True, 'message': 'Dados atualizados com sucesso!'})
    
    except Exception as e:
        print(f"Erro ao atualizar dados da música: {e}")
        return jsonify({'error': 'Erro ao atualizar dados da música'})
    finally:
        cursor.close()
        conn.close()

@app.route('/update/atualizar-artista', methods=['POST'])
def atualizar_artista():
    try:
        conn = database.conectar_banco()
        cursor = conn.cursor()

        id = request.form.get('id')
        nome_artista = request.form.get('nome_artista')
        genero_musical = request.form.get('genero_musical')

        database.atualizar_artista(conn, id, nome_artista, genero_musical)

        return jsonify({'success': True, 'message': 'Dados atualizados com sucesso!'})
    
    except Exception as e:
        print(f"Erro ao atualizar dados do artista: {e}")
        return jsonify({'error': 'Erro ao atualizar dados do artista'})
    finally:
        cursor.close()
        conn.close()

@app.route('/update/atualizar-album', methods=['POST'])
def atualizar_album():
    try:
        conn = database.conectar_banco()
        cursor = conn.cursor()

        id = request.form.get('id')
        titulo_album = request.form.get('titulo_album')
        nome_artista = request.form.get('nome_artista')
        data = request.form.get('data')

        database.atualizar_album(conn, id, titulo_album, nome_artista, data)

        return jsonify({'success': True, 'message': 'Dados atualizados com sucesso!'})
    
    except Exception as e:
        print(f"Erro ao atualizar dados do álbum: {e}")
        return jsonify({'error': 'Erro ao atualizar dados do álbum'})
    finally:
        cursor.close()
        conn.close()

if __name__ == '__main__':
    app.run(debug=True)
