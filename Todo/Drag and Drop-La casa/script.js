// Función para permitir el arrastre
function allowDrop(ev) {
    ev.preventDefault();
}

// Función para iniciar el arrastre
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

// Función para manejar la colocación de elementos
function drop(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");
    const draggedElement = document.getElementById(data);
    const dropArea = ev.target.closest('.drop-area');
    const errorCountElement = document.getElementById('errorCount');
    let errorCount = parseInt(errorCountElement.textContent);

    if (dropArea && dropArea.children.length === 0) {
        const draggedPair = draggedElement.getAttribute("data-pair");
        const dropPair = dropArea.getAttribute("data-pair");

        if (draggedPair === dropPair) {
            dropArea.appendChild(draggedElement);
            draggedElement.style.width = '100%';
            draggedElement.style.height = '100%';
            draggedElement.style.objectFit = 'cover';
            dropArea.classList.add('correct');
            setTimeout(() => dropArea.classList.remove('correct'), 2000);
            checkSectionCompletion(dropArea.parentNode.id);
        } else {
            errorCount++;
            errorCountElement.textContent = errorCount;
            dropArea.classList.add('incorrect');
            setTimeout(() => dropArea.classList.remove('incorrect'), 2000);
        }
    }
}

// Función para verificar si se completó la sección
function checkSectionCompletion(sectionId) {
    const dropAreas = document.querySelectorAll(`#${sectionId} .drop-area`);
    const allFilled = Array.from(dropAreas).every(area => area.children.length > 0);

    if (allFilled) {
        if (sectionId === 'dropContainer1') {
            document.getElementById('nextButton').style.display = 'block';
        } else {
            document.getElementById('finalMessageOverlay').style.display = 'flex';
            startConfetti();
        }
    }
}

// Función para ir a la siguiente sección
function goToNextSection() {
    document.getElementById('section1').style.display = 'none';
    document.getElementById('section2').style.display = 'block';
    document.getElementById('nextButton').style.display = 'none';
}

// Función para reiniciar el juego
function resetGame() {
    location.reload(); // Recarga la página
}

// Función para inicializar el juego
function initializeGame() {
    console.log("Inicializando el juego...");
    const dropContainer1 = document.getElementById('dropContainer1');
    const referenceContainer1 = document.getElementById('referenceContainer1');
    const dropContainer2 = document.getElementById('dropContainer2');
    const referenceContainer2 = document.getElementById('referenceContainer2');

    dropContainer1.innerHTML = '';
    referenceContainer1.innerHTML = '';
    dropContainer2.innerHTML = '';
    referenceContainer2.innerHTML = '';

    const itemsSection1 = [
        { id: 'Baño-drop', pair: 'BAÑO', src: 'img/BAÑO.gif' },
        { id: 'Casa-drop', pair: 'CASA', src: 'img/CASA.gif' },
        { id: 'Cocina-drop', pair: 'COCINA', src: 'img/COCINA.gif' },
        { id: 'Comedor-drop', pair: 'COMEDOR', src: 'img/COMEDOR.gif' },
        { id: 'Licuadora-drop', pair: 'LICUADORA', src: 'img/LICUADORA.gif' }
    ];

    const itemsSection2 = [
        { id: 'Puerta-drop', pair: 'PUERTA', src: 'img/PUERTA.gif' },
        { id: 'Refrigerador-drop', pair: 'REFRIGERADOR', src: 'img/REFRIGERADOR.gif' },
        { id: 'Silla-drop', pair: 'SILLA', src: 'img/SILLA.gif' },
        { id: 'Televisor-drop', pair: 'TELEVISOR', src: 'img/TELEVISOR.gif' },
        { id: 'Ventana-drop', pair: 'VENTANA', src: 'img/VENTANA.gif' }
    ];

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Agregar elementos para la sección 1
    shuffle(itemsSection1).forEach(item => {
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
        img.draggable = true;
        img.ondragstart = drag;
        referenceContainer1.appendChild(img);
    });

    // Agregar elementos para la sección 2
    shuffle(itemsSection2).forEach(item => {
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
        img.draggable = true;
        img.ondragstart = drag;
        referenceContainer2.appendChild(img);
    });
}

// Función para iniciar el efecto de confeti
function startConfetti() {
    if (typeof confetti === 'undefined') {
        console.error('Confetti library not loaded');
        return;
    }

    // Crear un intervalo para que el confeti siga apareciendo
    const duration = 10 * 1000; // Duración total en milisegundos (10 segundos)
    const end = Date.now() + duration;

    const colors = ['#ff0000', '#ff8000', '#ffff00', '#80ff00', '#00ff80', '#00ffff', '#0080ff', '#ff00ff']; // Colores más vibrantes
    
    (function frame() {
        // Generar confeti concentrado en el centro
        confetti({
            particleCount: 20, // Aumentar el número de partículas
            startVelocity: 30, // Velocidad inicial más rápida
            spread: 100, // Hacer que el confeti se disperse más
            origin: { x: 0.5, y: 0.5 }, // Origen en el centro de la pantalla
            colors: colors,
            scalar: 1.2, // Tamaño de las partículas más grande para que resalten más
            zIndex: 20 // Asegurarse de que el confeti esté por encima del overlay oscuro
        });

        // Seguir lanzando confeti mientras no haya terminado la duración
        if (Date.now() < end) {
            requestAnimationFrame(frame);
        } else {
            // Mantener el confeti en la pantalla hasta que se reinicie el juego
            setInterval(() => {
                confetti({
                    particleCount: 10, // Menos partículas en los intervalos repetidos
                    spread: 120, // Espacio amplio de dispersión
                    origin: { x: 0.5, y: 0.5 }, // Desde el centro
                    colors: colors,
                    scalar: 1.2,
                    zIndex: 20 // Asegurarse de que el confeti esté por encima del overlay oscuro
                });
            }, 500);
        }
    }());
}

// Inicializar el juego al cargar la página
window.onload = initializeGame;
