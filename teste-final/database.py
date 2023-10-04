import psycopg2

#Função para se conectar ao servidor da AWS
def conectar_banco():
    conn = psycopg2.connect(
        host="localhost",
        database="postgres",
        port=5432,
        user="postgres",
        password="pedropaulo"
    )
    return conn

#Função de criação de tabela
def criar_tabela(tabela):
    try:
        conn = conectar_banco()
        cursor = conn.cursor()

        print(f"Tentando criar a tabela {tabela}")  # Adicione esta linha

        if tabela == '1':
            cursor.execute('CREATE TABLE IF NOT EXISTS usuario ('
                           'id SERIAL PRIMARY KEY, '
                           'nome_usuario VARCHAR(255) NOT NULL, '
                           'email VARCHAR(255) NOT NULL UNIQUE, '
                           'senha VARCHAR(255) NOT NULL, '
                           'whatsapp VARCHAR(20) UNIQUE, '
                           'twitter VARCHAR(255) UNIQUE, '
                           'instagram VARCHAR(255) UNIQUE)')

        
        elif tabela == '2':
            cursor.execute('CREATE TABLE IF NOT EXISTS musica ('
                        'id SERIAL PRIMARY KEY, '
                        'titulo_musica VARCHAR(255) NOT NULL, '
                        'nome_artista VARCHAR(255) NOT NULL, '
                        'titulo_album VARCHAR(255) NOT NULL)')
        
        elif tabela == '3':
            cursor.execute('CREATE TABLE IF NOT EXISTS artista ('
                        'id SERIAL PRIMARY KEY, '
                        'nome_artista VARCHAR(255) NOT NULL, '
                        'genero_musical VARCHAR(255))')
        
        elif tabela == '4':
            cursor.execute('CREATE TABLE IF NOT EXISTS album ('
                        'id SERIAL PRIMARY KEY, '
                        'titulo_album VARCHAR(255) NOT NULL, '
                        'nome_artista VARCHAR(255) NOT NULL, '
                        'data DATE NOT NULL)')

        conn.commit()
        
    except Exception as e:
        print(f"Erro ao criar tabela: {e}")
        conn.rollback()  # Em caso de erro, faz um rollback para desfazer alterações
        
    finally:
        cursor.close()
        conn.close()

#Função para verificar se a tabela já existe
def verificar_tabela_existente(conn, tabela):
    cursor = conn.cursor()

    # Consulta para verificar se a tabela existe
    cursor.execute("SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = %s);", (tabela,))
    tabela_existe = cursor.fetchone()[0]

    if tabela_existe:
        # Consulta para obter os nomes das colunas da tabela
        cursor.execute(f"SELECT column_name FROM information_schema.columns WHERE table_name = %s;", (tabela,))
        colunas = [row[0] for row in cursor.fetchall()]

    cursor.close()

    return tabela_existe, colunas

#Funções de inserção
def inserir_usuario(conn, nome, email, senha, whatsapp, twitter, instagram):
    try:
        cursor = conn.cursor()
        cursor.execute("INSERT INTO usuario (nome_usuario, email, senha, whatsapp, twitter, instagram) VALUES (%s, %s, %s, %s, %s, %s)",
                    (nome, email, senha, whatsapp, twitter, instagram))
        conn.commit()
    except Exception as e:
        print(f"Erro ao inserir usuário: {e}")
    finally:
        cursor.close()

def inserir_musica(conn, titulo_musica, nome_artista, titulo_album):
    try:
        cursor = conn.cursor()
        cursor.execute("INSERT INTO musica (titulo_musica, nome_artista, titulo_album) VALUES (%s, %s, %s)",
                       (titulo_musica, nome_artista, titulo_album))
        conn.commit()
    except Exception as e:
        print(f"Erro ao inserir música: {e}")
    finally:
        cursor.close()

def inserir_artista(conn, nome_artista, genero_musical):
    try:
        cursor = conn.cursor()
        cursor.execute("INSERT INTO artista (nome_artista, genero_musical) VALUES (%s, %s)",
                       (nome_artista, genero_musical))
        conn.commit()
    except Exception as e:
        print(f"Erro ao inserir artista: {e}")
    finally:
        cursor.close()

def inserir_album(conn, titulo_album, nome_artista, data):
    try:
        cursor = conn.cursor()
        cursor.execute("INSERT INTO album (titulo_album, nome_artista, data) VALUES (%s, %s, %s)",
                       (titulo_album, nome_artista, data))
        conn.commit()
    except Exception as e:
        print(f"Erro ao inserir álbum: {e}")
    finally:
        cursor.close()

#Funções de Update
def atualizar_usuario(conn, id, nome_usuario, email, senha, whatsapp, twitter, instagram):
    try:
        cursor = conn.cursor()
        cursor.execute("UPDATE usuario SET nome_usuario = %s, email = %s, senha = %s, whatsapp = %s, twitter = %s, instagram = %s WHERE id = %s",
                       (nome_usuario, email, senha, whatsapp, twitter, instagram, id))
        conn.commit()
    except Exception as e:
        print(f"Erro ao atualizar usuário: {e}")
    finally:
        cursor.close()

def atualizar_musica(conn, id, titulo_musica, nome_artista, titulo_album):
    try:
        cursor = conn.cursor()
        cursor.execute("UPDATE musica SET titulo_musica = %s, nome_artista = %s, titulo_album = %s WHERE id = %s",
                       (titulo_musica, nome_artista, titulo_album, id))
        conn.commit()
    except Exception as e:
        print(f"Erro ao atualizar música: {e}")
    finally:
        cursor.close()

def atualizar_artista(conn, id, nome_artista, genero_musical):
    try:
        cursor = conn.cursor()
        cursor.execute("UPDATE artista SET nome_artista = %s, genero_musical = %s WHERE id = %s",
                       (nome_artista, genero_musical, id))
        conn.commit()
    except Exception as e:
        print(f"Erro ao atualizar artista: {e}")
    finally:
        cursor.close()

def atualizar_album(conn, id, titulo_album, nome_artista, data):
    try:
        cursor = conn.cursor()
        cursor.execute("UPDATE album SET titulo_album = %s, nome_artista = %s, data = %s WHERE id = %s",
                       (titulo_album, nome_artista, data, id))
        conn.commit()
    except Exception as e:
        print(f"Erro ao atualizar álbum: {e}")
    finally:
        cursor.close()