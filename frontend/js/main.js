const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);


/* =========================================
   ELEMENTOS
========================================= */

const music = $('#music');

const playBtn = $('#playBtn');
const prevBtn = $('#prevBtn');
const nextBtn = $('#nextBtn');

const playerTitle = $('#playerTitle');
const playerCounter = $('#playerCounter');

const progress = $('#progress');
const currentTime = $('#currentTime');
const duration = $('#duration');

const volume = $('#volume');

const playlistElement = $('#playlist');


/* =========================================
   VARIÁVEIS DO PLAYER
========================================= */

let playlist = [];

let currentIndex = -1;


/* =========================================
   LOADER
========================================= */

window.addEventListener('load', () => {

    setTimeout(() => {

        $('#loader').style.opacity = '0';

        setTimeout(() => {

            $('#loader').remove();

        }, 800);

    }, 700);

});


/* =========================================
   BOTÃO ENTRAR
========================================= */

$('#enterBtn').addEventListener('click', () => {

    document
        .querySelector('#linha')
        .scrollIntoView({
            behavior: 'smooth'
        });

});


/* =========================================
   NAV
========================================= */

window.addEventListener('scroll', () => {

    $('.nav').classList.toggle(
        'scrolled',
        scrollY > 40
    );

});


/* =========================================
   DADOS DO PROJETO
========================================= */

fetch('/api/data')

    .then(response => {

        if (!response.ok) {
            throw new Error('Erro ao carregar os dados.');
        }

        return response.json();

    })

    .then(data => {

        $('#timeline').innerHTML =
            data.memories
                .slice(0, 5)
                .map((memory) => `

                    <article class="event reveal">

                        <time>
                            ${memory.date}
                        </time>

                        <h3>
                            ${memory.title}
                        </h3>

                        <p>
                            ${memory.text}
                        </p>

                    </article>

                `)
                .join('');


        $('#memoryGrid').innerHTML =
            data.memories
                .slice(5)
                .map((memory) => `

                    <article class="memory reveal">

                        <small>
                            ${memory.date}
                        </small>

                        <h3>
                            ${memory.title}
                        </h3>

                        <p>
                            ${memory.text}
                        </p>

                    </article>

                `)
                .join('');


        $('#nickKelly').innerHTML =
            data.nicknames.kelly_for_franz
                .map(name => `

                    <span class="chip">
                        ${name}
                    </span>

                `)
                .join('');


        $('#nickFranz').innerHTML =
            data.nicknames.franz_for_kelly
                .map(name => `

                    <span class="chip">
                        ${name}
                    </span>

                `)
                .join('');


        observe();

    })

    .catch(error => {

        console.error(error);

    });


/* =========================================
   ANIMAÇÕES
========================================= */

function observe() {

    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add('show');

                    }

                });

            },
            {
                threshold: .12
            }
        );


    $$('.reveal').forEach(element => {

        observer.observe(element);

    });

}


/* =========================================
   CARREGAR MÚSICAS AUTOMATICAMENTE
========================================= */

async function loadPlaylist() {

    try {

        const response =
            await fetch('/api/audio');

        if (!response.ok) {

            throw new Error(
                'Não foi possível encontrar as músicas.'
            );

        }


        playlist =
            await response.json();


        renderPlaylist();


        if (playlist.length > 0) {

            selectSong(0, false);

        } else {

            playerTitle.textContent =
                'Nenhuma música encontrada';

            playerCounter.textContent =
                '0 / 0';

            playlistElement.innerHTML = `

                <div style="opacity:.5;padding:15px;">

                    Coloque arquivos MP3 na pasta
                    <br><br>

                    <strong>
                        frontend/assets/audio
                    </strong>

                </div>

            `;

        }

    }

    catch (error) {

        console.error(error);

        playerTitle.textContent =
            'Erro ao carregar músicas';

        playlistElement.innerHTML = `

            <div style="opacity:.5;padding:15px;">

                Não foi possível carregar a playlist.

            </div>

        `;

    }

}


/* =========================================
   MOSTRAR PLAYLIST
========================================= */

function renderPlaylist() {

    playlistElement.innerHTML =
        playlist
            .map((song, index) => `

                <div
                    class="playlist-item ${index === currentIndex ? 'active' : ''}"
                    data-index="${index}"
                >

                    <span class="playlist-number">
                        ${String(index + 1).padStart(2, '0')}
                    </span>

                    <span class="playlist-name">
                        ${song.name}
                    </span>

                    <span class="playlist-playing">

                        ${index === currentIndex ? '♫' : ''}

                    </span>

                </div>

            `)
            .join('');


    $$('.playlist-item').forEach(item => {

        item.addEventListener('click', () => {

            const index =
                Number(item.dataset.index);

            selectSong(index, true);

        });

    });

}


/* =========================================
   SELECIONAR MÚSICA
========================================= */

function selectSong(index, autoPlay = true) {

    if (
        index < 0 ||
        index >= playlist.length
    ) {
        return;
    }


    currentIndex = index;


    const song =
        playlist[currentIndex];


    music.src = song.url;


    playerTitle.textContent =
        song.name;


    playerCounter.textContent =
        `${currentIndex + 1} / ${playlist.length}`;


    progress.value = 0;


    currentTime.textContent =
        '0:00';


    duration.textContent =
        '0:00';


    renderPlaylist();


    if (autoPlay) {

        playCurrentSong();

    }

}


/* =========================================
   PLAY
========================================= */

async function playCurrentSong() {

    try {

        await music.play();

        playBtn.textContent = '❚❚';

    }

    catch (error) {

        console.error(error);

        alert(
            'O navegador bloqueou a reprodução. Clique novamente no botão de play.'
        );

    }

}


/* =========================================
   PLAY / PAUSE
========================================= */

playBtn.addEventListener(
    'click',
    async () => {

        if (!playlist.length) {
            return;
        }


        if (currentIndex === -1) {

            selectSong(0, true);

            return;

        }


        if (music.paused) {

            await playCurrentSong();

        } else {

            music.pause();

            playBtn.textContent = '▶';

        }

    }
);


/* =========================================
   PRÓXIMA
========================================= */

nextBtn.addEventListener(
    'click',
    () => {

        if (!playlist.length) {
            return;
        }


        let nextIndex =
            currentIndex + 1;


        if (nextIndex >= playlist.length) {

            nextIndex = 0;

        }


        selectSong(nextIndex, true);

    }
);


/* =========================================
   ANTERIOR
========================================= */

prevBtn.addEventListener(
    'click',
    () => {

        if (!playlist.length) {
            return;
        }


        let previousIndex =
            currentIndex - 1;


        if (previousIndex < 0) {

            previousIndex =
                playlist.length - 1;

        }


        selectSong(previousIndex, true);

    }
);


/* =========================================
   QUANDO A MÚSICA TERMINAR
========================================= */

music.addEventListener(
    'ended',
    () => {

        if (!playlist.length) {
            return;
        }


        let nextIndex =
            currentIndex + 1;


        if (nextIndex >= playlist.length) {

            nextIndex = 0;

        }


        selectSong(nextIndex, true);

    }
);


/* =========================================
   PROGRESSO
========================================= */

music.addEventListener(
    'loadedmetadata',
    () => {

        if (!isNaN(music.duration)) {

            duration.textContent =
                formatTime(music.duration);

        }

    }
);


music.addEventListener(
    'timeupdate',
    () => {

        if (!music.duration) {
            return;
        }


        const percentage =
            (music.currentTime / music.duration) * 100;


        progress.value =
            percentage;


        currentTime.textContent =
            formatTime(music.currentTime);

    }
);


/* =========================================
   CLICAR NA BARRA
========================================= */

progress.addEventListener(
    'input',
    () => {

        if (!music.duration) {
            return;
        }


        const time =
            (progress.value / 100) *
            music.duration;


        music.currentTime = time;

    }
);


/* =========================================
   VOLUME
========================================= */

volume.addEventListener(
    'input',
    () => {

        music.volume =
            Number(volume.value);

    }
);


music.volume = .8;


/* =========================================
   FORMATAR TEMPO
========================================= */

function formatTime(seconds) {

    if (
        !seconds ||
        isNaN(seconds)
    ) {

        return '0:00';

    }


    const minutes =
        Math.floor(seconds / 60);


    const secs =
        Math.floor(seconds % 60);


    return `${minutes}:${String(secs).padStart(2, '0')}`;

}


/* =========================================
   BOTÃO ANTIGO DA NAV
========================================= */

const musicBtn = $('#musicBtn');

musicBtn.addEventListener(
    'click',
    async () => {

        if (!playlist.length) {
            return;
        }


        if (music.paused) {

            await playCurrentSong();

            musicBtn.textContent = '❚❚';

        } else {

            music.pause();

            musicBtn.textContent = '♫';

        }

    }
);


music.addEventListener(
    'play',
    () => {

        playBtn.textContent = '❚❚';

        musicBtn.textContent = '❚❚';

    }
);


music.addEventListener(
    'pause',
    () => {

        playBtn.textContent = '▶';

        musicBtn.textContent = '♫';

    }
);


/* =========================================
   GALERIA
========================================= */

/* =========================================
   GALERIA AUTOMÁTICA
========================================= */

let photos = [];
let currentPhoto = 0;

async function loadPhotos() {
    try {
        const response = await fetch('/api/photos');

        if (!response.ok) {
            throw new Error('Erro ao carregar fotos');
        }

        photos = await response.json();

        const gallery = $('#photoGallery');
        gallery.innerHTML = '';

        photos.forEach((photo, index) => {
            const button = document.createElement('button');
            button.className = 'photo';
            button.type = 'button';

            const img = document.createElement('img');
            img.src = photo.url;
            img.alt = `Memória ${index + 1}`;
            img.loading = 'lazy';

            button.appendChild(img);
            button.addEventListener('click', () => openPhoto(index));

            gallery.appendChild(button);
        });

    } catch (error) {
        console.error('Erro na galeria:', error);
    }
}

function openPhoto(index) {
    if (!photos.length) return;

    currentPhoto = (index + photos.length) % photos.length;

    $('#lightImg').src = photos[currentPhoto].url;

    $('#photoCounter').textContent =
        `${currentPhoto + 1} / ${photos.length}`;

    $('#lightbox').classList.add('open');
}

function closePhoto() {
    $('#lightbox').classList.remove('open');
}

$('#closeLight').addEventListener('click', closePhoto);

$('#prevPhoto').addEventListener('click', () => {
    openPhoto(currentPhoto - 1);
});

$('#nextPhoto').addEventListener('click', () => {
    openPhoto(currentPhoto + 1);
});

$('#lightbox').addEventListener('click', event => {
    if (event.target.id === 'lightbox') {
        closePhoto();
    }
});

document.addEventListener('keydown', event => {
    if (!$('#lightbox').classList.contains('open')) return;

    if (event.key === 'Escape') closePhoto();
    if (event.key === 'ArrowLeft') openPhoto(currentPhoto - 1);
    if (event.key === 'ArrowRight') openPhoto(currentPhoto + 1);
});

loadPhotos();




loadPlaylist();