document.addEventListener("DOMContentLoaded", function () {
    const dropContainer1 = document.getElementById('dropContainer1');
    const referenceContainer1 = document.getElementById('referenceContainer1');
    const dropContainer2 = document.getElementById('dropContainer2');
    const referenceContainer2 = document.getElementById('referenceContainer2');
    const errorCountElement = document.getElementById('errorCount');
    const congratulationsContainer = document.getElementById('congratulationsContainer');
    const nextButton = document.getElementById('nextButton');
    let errorCount = 0;

    const itemsSection1 = [
        { id: 'Acido-drop', pair: 'ACIDO', src: 'Images/ACIDO.gif' },
        { id: 'Contento-drop', pair: 'CONTENTO', src: 'Images/CONTENTO.gif' },
        { id: 'Dulce-drop', pair: 'DULCE', src: 'Images/DULCE.gif' },
        { id: 'Gustar-drop', pair: 'GUSTAR', src: 'Images/GUSTAR.gif' },
        { id: 'Oido-drop', pair: 'OIDO', src: 'Images/OIDO.gif' }
    ];

    const itemsSection2 = [
        { id: 'Oler-drop', pair: 'OLER', src: 'Images/OLER.gif' },
        { id: 'Salado-drop', pair: 'SALADO', src: 'Images/SALADO.gif' },
        { id: 'Tacto-drop', pair: 'TACTO', src: 'Images/TACTO.gif' },
        { id: 'Triste-drop', pair: 'TRISTE', src: 'Images/TRISTE.gif' },
        { id: 'Ver-drop', pair: 'VER', src: 'Images/VER.gif' }
    ];

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function initializeGame() {
        dropContainer1.innerHTML = '';
        referenceContainer1.innerHTML = '';
        dropContainer2.innerHTML = '';
        referenceContainer2.innerHTML = '';

        // Mezclar los items
        const shuffledItemsSection1 = shuffle([...itemsSection1]);
        const shuffledItemsSection2 = shuffle([...itemsSection2]);

        // Agregar las áreas de colocación y las imágenes de referencia para la sección 1
        shuffledItemsSection1.forEach(item => {
            const dropArea = document.createElement('div');
            dropArea.className = 'drop-area';
            dropArea.id = item.id;
            dropArea.setAttribute('data-pair', item.pair);
            dropArea.setAttribute('ondrop', 'drop(event)');
            dropArea.setAttribute('ondragover', 'allowDrop(event)');
            dropContainer1.appendChild(dropArea);

            const img = document.createElement('img');
            img.src = item.src;
            img.setAttribute('data-pair', item.pair);
            referenceContainer1.appendChild(img);
        });

        // Agregar las áreas de colocación y las imágenes de referencia para la sección 2
        shuffledItemsSection2.forEach(item => {
            const dropArea = document.createElement('div');
            dropArea.className = 'drop-area';
            dropArea.id = item.id;
            dropArea.setAttribute('data-pair', item.pair);
            dropArea.setAttribute('ondrop', 'drop(event)');
            dropArea.setAttribute('ondragover', 'allowDrop(event)');
            dropContainer2.appendChild(dropArea);

            const img = document.createElement('img');
            img.src = item.src;
            img.setAttribute('data-pair', item.pair);
            referenceContainer2.appendChild(img);
        });
    }

    initializeGame();
});

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");
    const draggedElement = document.getElementById(data);
    const dropArea = ev.target.closest('.drop-area');
    const errorCountElement = document.getElementById('errorCount');
    let errorCount = parseInt(errorCountElement.textContent);

    // Asegurarse de que el área de colocación esté vacía antes de soltar y verificar la coincidencia de pares
    if (dropArea && dropArea.children.length === 0) {
        const draggedPair = draggedElement.getAttribute("data-pair");
        const dropPair = dropArea.getAttribute("data-pair");

        if (draggedPair === dropPair) {
            dropArea.appendChild(draggedElement);
            draggedElement.style.width = '100%';
            draggedElement.style.height = '100%';
            draggedElement.style.objectFit = 'contain';

            // Verificar si la sección se ha completado
            checkSectionCompletion(dropArea.parentNode.id);
        } else {
            // Incrementar y mostrar el contador de errores
            errorCount++;
            errorCountElement.textContent = errorCount;
        }
    }
}

function checkSectionCompletion(sectionId) {
    const dropAreas = document.querySelectorAll(`#${sectionId} .drop-area`);
    const allFilled = Array.from(dropAreas).every(area => area.children.length > 0);

    if (allFilled) {
        if (sectionId === 'dropContainer1') {
            document.getElementById('nextButton').style.display = 'block';
        } else {
            const congratulationsContainer = document.getElementById('congratulationsContainer');
            congratulationsContainer.style.display = 'block';
            showFireworks();
        }
    }
}

function goToNextSection() {
    document.getElementById('section1').style.display = 'none';
    document.getElementById('section2').style.display = 'block';
    document.getElementById('nextButton').style.display = 'none';
}

function showFireworks() {
    const fireworksContainer = document.getElementById('fireworks-container');

    const fireworks = new Fireworks(fireworksContainer, {
        hue: { min: 0, max: 360 },
        startDelay: 0,
        minDelay: 20,
        maxDelay: 40,
        speed: 2,
        acceleration: 1.05,
        friction: 0.97,
        gravity: 1.5,
        particles: 50,
        trace: 3,
        explosion: 5,
        boundaries: {
            x: 0,
            y: 0,
            width: fireworksContainer.clientWidth,
            height: fireworksContainer.clientHeight,
        },
        sound: {
            enable: false,
        },
        autoresize: true,
    });

    fireworks.start();

    setTimeout(() => {
        fireworks.stop();
        fireworksContainer.innerHTML = ''; // Eliminar el contenido del contenedor de fuegos artificiales
    }, 6000);
}
