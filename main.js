document.addEventListener('DOMContentLoaded', function () {
    const submitButton = document.getElementById('submitData');
    const dataTable = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
    const dataTableFooter = document.getElementById('dataTable').getElementsByTagName('tfoot')[0];
    let isDrawing = false;
    let startX, startY, endX, endY;

    const canvases = [
        document.getElementById('canvas'),
        document.getElementById('canvas1'),
        document.getElementById('canvas2'),
        document.getElementById('canvas3')
    ];

    const highlightedAreas = {
        canvas: [],
        canvas1: [],
        canvas2: [],
        canvas3: []
    };

    function getMousePos(canvas, evt) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: (evt.clientX - rect.left) * (canvas.width / rect.width),
            y: (evt.clientY - rect.top) * (canvas.height / rect.height)
        };
    }

    function handleStart(evt) {
        evt.preventDefault();
        const pos = getMousePos(this, evt);
        isDrawing = true;
        startX = pos.x;
        startY = pos.y;
    }

    function handleMove(evt) {
        evt.preventDefault();
        if (isDrawing) {
            const pos = getMousePos(this, evt);
            endX = pos.x;
            endY = pos.y;
            const ctx = this.getContext('2d');
            ctx.clearRect(0, 0, this.width, this.height);
            drawExistingHighlights(this.id);
            drawRect(ctx, startX, startY, endX - startX, endY - startY);
        }
    }

    function handleEnd(evt) {
        evt.preventDefault();
        if (isDrawing) {
            isDrawing = false;
            highlightedAreas[this.id].push({
                x: startX, y: startY, width: endX - startX, height: endY - startY
            });
            const ctx = this.getContext('2d');
            drawExistingHighlights(this.id);
        }
    }

    function drawRect(ctx, x, y, width, height) {
        ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
        ctx.fillRect(x, y, width, height);
    }

    function drawExistingHighlights(canvasId) {
        const canvas = document.getElementById(canvasId);
        const ctx = canvas.getContext('2d');
        highlightedAreas[canvasId].forEach(area => {
            drawRect(ctx, area.x, area.y, area.width, area.height);
        });
    }

    canvases.forEach((canvas) => {
        canvas.addEventListener('mousedown', handleStart);
        canvas.addEventListener('mousemove', handleMove);
        canvas.addEventListener('mouseup', handleEnd);

        canvas.addEventListener('touchstart', handleStart);
        canvas.addEventListener('touchmove', handleMove);
        canvas.addEventListener('touchend', handleEnd);

        drawExistingHighlights(canvas.id);
    });

    submitButton.addEventListener('click', () => {
        const controllerName = document.getElementById('controllerName').value;
        const controllerEmail = document.getElementById('controllerEmail').value;
        const description = document.getElementById('message').value;
        const driverName = document.getElementById('driverName').value;
        const driverEmail = document.getElementById('driverEmail').value;
        const damageHistoryDate = document.getElementById('damageHistoryDate').value || new Date().toLocaleDateString();
        const responsibleName = document.getElementById('responsibleName').value;

        addTaskToTable(description, driverName, driverEmail, controllerName, controllerEmail, damageHistoryDate, responsibleName);
        appendNaamAndEmail(driverName, driverEmail);
        appendImages();
        document.getElementById('message').value = '';
        redrawHighlights();
    });

    function addTaskToTable(description, driverName, driverEmail, controllerName, controllerEmail, damageHistoryDate, responsibleName) {
        const newRow = dataTable.insertRow();
        newRow.innerHTML = `
            <td>${damageHistoryDate}</td>
            <td>
                <ul>
                    <li>${responsibleName}</li>
                </ul>
            </td>
            <td>
                <ul>
                    <li>${controllerName}</li><br><li>${controllerEmail}</li>
                </ul>
            </td>
            <td>${description}</td>
        `;
    }

    function appendNaamAndEmail(driverName, driverEmail) {
        const lastRow = dataTableFooter.querySelector("tr:last-child");
        const lastCell = lastRow.querySelector("td");
        lastCell.innerHTML += `
            <ul>
                <li>${driverName}</li>
                <li>${driverEmail}</li>
            </ul>
        `;
    }

    function appendImages() {
        const imageInput = document.getElementById('imageInput');
        const files = imageInput.files;
        const imageContainer = dataTableFooter.querySelector("tr:last-child td");

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.type.startsWith('image/')) {
                const img = document.createElement("img");
                img.src = URL.createObjectURL(file);
                img.onload = function () {
                    const maxDimension = 300;
                    let { width, height } = img;
                    if (width > maxDimension || height > maxDimension) {
                        if (width > height) {
                            height *= maxDimension / width;
                            width = maxDimension;
                        } else {
                            width *= maxDimension / height;
                            height = maxDimension;
                        }
                    }
                    img.width = width;
                    img.height = height;
                    img.style.objectFit = 'cover';
                    imageContainer.appendChild(img);
                };
            }
        }
    }

    function redrawHighlights() {
        canvases.forEach((canvas) => {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawExistingHighlights(canvas.id);
        });
    }
});
