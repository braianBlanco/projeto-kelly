from flask import Flask, jsonify, send_from_directory, render_template
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

app = Flask(
    __name__,
    static_folder=str(ROOT / 'frontend'),
    template_folder=str(ROOT / 'frontend')
)

DATA = {
    'relationship': {
        'start': '2024-09-27',
        'title': 'Nossa história',
        'subtitle': 'Uma história feita de pequenos momentos que ficaram grandes dentro de mim.'
    },

    'nicknames': {
        'kelly_for_franz': [
            'meu amor',
            'meu lindo',
            'mi niño hermoso',
            'minha vida',
            'amor da minha vida',
            'meu lindinho'
        ],

        'franz_for_kelly': [
            'meu amor',
            'minha princesa',
            'mi niña hermosa',
            'minha rainha',
            'minha vida',
            'minha gatinha linda',
            'minha gata'
        ]
    },

    'memories': [
        {
            'date': '27/09/2024',
            'title': 'O começo de tudo',
            'text': 'O dia que marcou o começo da nossa história. Um dia que eu nunca vou olhar como apenas uma data.'
        },

        {
            'date': 'Primeiro abraço',
            'title': 'O primeiro abraço',
            'text': 'Um daqueles momentos simples por fora, mas gigantes por dentro.'
        },

        {
            'date': 'Primeiro beijo',
            'title': 'O primeiro beijo',
            'text': 'Mais uma lembrança que ficou guardada como parte importante da nossa história.'
        },

        {
            'date': 'Primeiro “eu te amo”',
            'title': 'As primeiras palavras que mudaram tudo',
            'text': 'O primeiro “eu te amo” virou uma memória que eu carrego com carinho.'
        },

        {
            'date': 'A risada',
            'title': 'Você me ensinou a rir do jeito certo',
            'text': 'Eu escrevia ksksk. Você me ensinou o jeito certo: KSJSGDSAKSKLJDHAKKJDA. E até hoje essa lembrança me faz sorrir.'
        },

        {
            'date': 'Álvares de Azevedo',
            'title': 'Biblioteca Álvares de Azevedo',
            'text': 'A biblioteca estava fechada, a gente esperou e não abriu. Você comprou Coca-Cola em lata e bebemos juntos. Depois fomos ao Guilherme Cotching comprar coisas para a Sassy e você voltou para casa.'
        },

        {
            'date': 'Gauchita',
            'title': 'Padaria Gauchita',
            'text': 'Eu te acompanhei quase até a sua casa. Um caminho comum que ficou especial porque era com você.'
        },

        {
            'date': 'Atacadão',
            'title': 'Um dia inteiro juntos',
            'text': 'Te acompanhei até sua escola, depois fui para minha escola para o Industrial e mais tarde fui ao Atacadão te esperar. Fomos juntos comprar suas coisas, voltamos em direção à sua casa, passei pelo posto com você e depois precisei voltar para a escola.'
        }
    ],

    'songs': [
        'Y Te Vi',
        'Mi Corazón Es Tuyo',
        'Beat It — Michael Jackson',
        'Bad — Michael Jackson',
        'Dragon Ball GT — abertura em espanhol',
        'Lo Que Siento',
        'Alas — Soy Luna',
        'Tenta Acreditar'
    ],

    'fandoms': [
        {
            'name': 'Dragon Ball',
            'text': 'A gente discutia qual saga era melhor, preferia as versões em espanhol e combinamos de assistir todas as sagas juntos na nossa casinha meu amor.'
        },

        {
            'name': 'Marvel',
            'text': 'Loki, Iron Man, Spider-Man, Wanda e Peter Quill. Porque a marvel fez eles sofrerem tanto não tem motivo eu tenho muita dó do Peter quill.'
        },

        {
            'name': 'Toy Story',
            'text': 'Nós dois concordávamos que Andy não tinha que ter dado os brinquedos para a Bonnie. ela usou por 1 filme o Woody e depois deixou ele abandonou ele e o andy queria ter ficado com o woody e deu para ela CUIDAR passou o proximo filme ela deixou.'
        },

        {
            'name': 'Bob Esponja',
            'text': 'O Bob esponja não da apra prever o que ele vai fazer KAKKKSAKKDKAKDAK ele se parte em 2 dunada se multiplica o patrick ainda mais KSKAKKSDJFJAJFAJAKSK ele tem um irmao gemeo que mora na testa dele QUEEE KAJSAHAJLFAKJAKS'
        }
    ]
}


@app.get('/')
def home():
    return render_template('index.html')


@app.get('/api/data')
def data():
    return jsonify(DATA)


# NOVO:
# Procura automaticamente todas as músicas dentro de frontend/assets/audio
@app.get('/api/audio')
def audio():
    audio_folder = ROOT / 'frontend' / 'assets' / 'audio'

    extensions = {
        '.mp3',
        '.wav',
        '.ogg',
        '.m4a'
    }

    songs = []

    if audio_folder.exists():
        for file in audio_folder.iterdir():

            if file.is_file() and file.suffix.lower() in extensions:

                songs.append({
                    'name': file.stem,
                    'filename': file.name,
                    'url': f'/assets/audio/{file.name}'
                })

    songs.sort(key=lambda x: x['name'].lower())

    return jsonify(songs)

@app.get('/api/photos')
def photos():
    folder = ROOT / 'frontend' / 'assets' / 'photos'
    extensions = {'.jpg', '.jpeg', '.png', '.webp', '.gif'}

    images = []

    if folder.exists():
        for file in sorted(folder.iterdir()):
            if file.is_file() and file.suffix.lower() in extensions:
                images.append({
                    'name': file.name,
                    'url': f'/assets/photos/{file.name}'
                })

    return jsonify(images)


@app.get('/api/health')
def health():
    return jsonify({
        'status': 'ok',
        'project': 'Projeto Kelly V4',
        'version': '5.0',
        'audio': 'automatic playlist'
    })


@app.route('/<path:path>')
def static_files(path):
    return send_from_directory(app.static_folder, path)


if __name__ == '__main__':
    app.run(
        host='127.0.0.1',
        port=5000,
        debug=True
    )