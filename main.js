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

    canvases.forEach((canvas) => {
        const ctx = canvas.getContext('2d');

        function getMousePos(canvas, evt) {
            const rect = canvas.getBoundingClientRect();
            return {
                x: (evt.clientX - rect.left) * (canvas.width / rect.width),
                y: (evt.clientY - rect.top) * (canvas.height / rect.height)
            };
        }

        function isInsideExistingHighlight(canvasId, x, y) {
            return highlightedAreas[canvasId].some(area =>
                x >= area.x && x <= area.x + area.width &&
                y >= area.y && y <= area.y + area.height
            );
        }

        canvas.addEventListener('mousedown', (e) => {
            const pos = getMousePos(canvas, e);
            if (!isInsideExistingHighlight(canvas.id, pos.x, pos.y)) {
                isDrawing = true;
                startX = pos.x;
                startY = pos.y;
            }
        });

        canvas.addEventListener('mousemove', (e) => {
            if (isDrawing) {
                const pos = getMousePos(canvas, e);
                endX = pos.x;
                endY = pos.y;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                drawExistingHighlights(canvas.id);
                drawRect(ctx, startX, startY, endX - startX, endY - startY);
            }
        });

        canvas.addEventListener('mouseup', () => {
            if (isDrawing) {
                isDrawing = false;
                highlightedAreas[canvas.id].push({
                    x: startX, y: startY, width: endX - startX, height: endY - startY
                });
                drawExistingHighlights(canvas.id);
            }
        });

        function drawRect(ctx, x, y, width, height) {
            ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
            ctx.fillRect(x, y, width, height);
        }

        function drawExistingHighlights(canvasId) {
            highlightedAreas[canvasId].forEach(area => {
                drawRect(ctx, area.x, area.y, area.width, area.height);
            });
        }

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
        const checkLocation = document.getElementById('checkLocation').value;

        addTaskToTable(description, driverName, driverEmail, controllerName, controllerEmail, damageHistoryDate, responsibleName, checkLocation);
        appendNaamAndEmail(driverName, driverEmail);
        appendImages();
        document.getElementById('message').value = '';
        redrawHighlights();
    });

    function addTaskToTable(description, driverName, driverEmail, controllerName, controllerEmail, damageHistoryDate, responsibleName, checkLocation) {
        const newRow = dataTable.insertRow();
        newRow.innerHTML = `
            <td>
                <ul>
                    <li>${damageHistoryDate}</li>
                </ul>
            </td>
            <td>
                <ul>
                    <li>${responsibleName}</li>
                </ul>
            </td>
            <td>
                <ul>
                    <li>${controllerName}</li>
                    <br>
                    <li>${controllerEmail}</li>
                </ul>
            </td>
            <td>
                <ul>
                    <li>${description}</li>
                </ul>
            </td>
            <td>
                <ul>
                    <li>${checkLocation}</li>
                </ul>
            </td>
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
