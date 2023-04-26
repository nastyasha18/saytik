let TABLE_WIDTH = prompt("Введите ширину таблицы (не более 100):");
while (TABLE_WIDTH > 100) 
{
  TABLE_WIDTH = prompt("Ширина таблицы не может быть больше 100. Пожалуйста, введите значение еще раз:");
}

let TABLE_HEIGHT = prompt("Введите высоту таблицы (не более 100):");
while (TABLE_HEIGHT > 100) 
{
  TABLE_HEIGHT = prompt("Высота таблицы не может быть больше 100. Пожалуйста, введите значение еще раз:");
}

let startCell = null; // Установить начальную и целевую ячейки в null и разрешить редактирование таблицы
let targetCell = null;
let canEditTable = true;

let ACTIONS = {ADD_WALL: 0, REMOVE_WALL: 1, ADD_START: 2, ADD_END: 3, SELECTED: 0}; // Устанавливаеиъм доступные действия (добавление стен, удаление стен, добавление начальной или конечной точек)

let Class = { // Установить классы для каждого типа ячеек
    STRONG_WALL: 'metal',
    WALL: 'wall',
    START_POINT: 'start',
    END_POINT: 'end',
    OPEN: 'open',
    CLOSED: 'closed',
    PATH: 'path'
};

let tableElements = []; // Инициализация массива для элементов таблицы (кнопки и т.д.)

let table = document.querySelector("#table"); // Выбираем таблицу и кнопки из HTML
let runBtn = document.querySelector('#run')
let clearBtn = document.querySelector('#clear')

tableElements.push(runBtn); // Добавляем кнопки в массив tableElements
tableElements.push(clearBtn);

(function prepareRadio() {

    let elementsByName = document.getElementsByName('action'); // Получаем все элементы с именем action

    let addWall = document.querySelector('#addWall'); // Создаем кнопку «addWall» и установите выбранное действие на ADD_WALL
    addWall.onclick = () => ACTIONS.SELECTED = ACTIONS.ADD_WALL
    addWall.checked = true;

    tableElements.push(...elementsByName); // Добавляем переключатели в массив tableElements

    document.querySelector('#removeWall').onclick = () => ACTIONS.SELECTED = ACTIONS.REMOVE_WALL; // Устанавливаем выбранное действие по щелчку
    document.querySelector('#addStart').onclick = () => ACTIONS.SELECTED = ACTIONS.ADD_START;
    document.querySelector('#addEnd').onclick = () => ACTIONS.SELECTED = ACTIONS.ADD_END;
})();


// заполнить таблицу и добавить ячейку
(function fillTableAndAddListeners() {

    let mouseDown = false;
    document.addEventListener('mousedown', () => mouseDown = true);
    document.addEventListener('mouseup', () => mouseDown = false);

    for (let i = 0; i < TABLE_HEIGHT; i++) { // Перебираем строки и столбцы для создания ячеек таблицы
        let newRow = table.insertRow();
        for (let j = 0; j < TABLE_WIDTH; j++) {
            let cell = newRow.insertCell();

            let classList = cell.classList;

            if (i === 0 || i === TABLE_HEIGHT - 1 || j === 0 || j === TABLE_WIDTH - 1) { // Устанавливаем класс 'metal' в ячейки на границах таблицы
                classList.add("metal");
            }

            cell.onmousedown = () => { // Добавляем действия для обработки mousedown и mouseover
                if (canEditTable) {
                    fillCell(cell)
                }
                return false;
            }

            cell.onmouseover = () => {
                if (mouseDown && canEditTable) {
                    fillCell(cell)
                }
            }
        }
    }

    function fillCell(cell) { //
        let classList = cell.classList
        switch (ACTIONS.SELECTED) {

            case ACTIONS.ADD_WALL: {
                if (cell.className === '') {
                    classList.add('wall')
                }
                break;
            }
            case ACTIONS.ADD_END: {
                if (cell.className === '') {
                    if (targetCell !== null) {
                        targetCell.classList.remove('end');
                    }
                    classList.add('end')
                    targetCell = cell;
                }

                break;
            }
            case ACTIONS.ADD_START: {
                if (cell.className === '') {
                    if (startCell !== null) {
                        startCell.classList.remove('start');
                    }
                    classList.add('start')
                    startCell = cell;
                }
                break;
            }
            case ACTIONS.REMOVE_WALL: {
                if (classList.contains('wall')) {
                    classList.remove('wall')
                }
                break;
            }
        }
    }
}());

function checkStartIsPossible() {
    return startCell != null && targetCell != null;
}


class Point {

    constructor(value, x, y) {
        this.inOpenList = false;
        this.inClossedList = false;
        this.startPoint = false;
        this.endPoint = false;
        this.parent = this;
        this.h = 0;
        this.g = 0;
        this.f = 0;
        this.Name = value;
        this.x = x;
        this.y = y;
        // this.value = 2000000;
    }

    setValue(value) {
        this.value = value;
    }

    getG() {
        return this.g;
    }

    getParent() {
        return this.parent;
    }

    setParent(parent) {
        this.parent = parent;
    }

    getF() {
        return this.f;
    }

    isStartPoint() {
        return this.startPoint;
    }

    setStartPoint() {
        this.startPoint = true;
    };

    isEndPoint() {
        return this.endPoint;
    }

    setEndPoint() {
        this.endPoint = true;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    getName() {
        return this.Name;
    };

    setHGF(h, g) {
        this.h = h * 10;
        this.g = g + this.parent.g;
        this.f = this.h + this.g;
    };

    addOpenList() {
        this.inOpenList = true;
    };

    isInOpenList() {
        return this.inOpenList;
    };

    moveToClosedList() {
        this.inClossedList = true;
        this.inOpenList = false;
    };

    inClosedList() {
        return this.inClossedList;
    };

}


function blockAll(flag) {
    canEditTable = !flag;
    for (let val in tableElements) {
        tableElements[val].disabled = flag;
    }
}


runBtn.onclick = function () {

    if (!checkStartIsPossible()) {
        alert("Вам нужно добавить ячейки «начало» и «конец» в таблицу");
        return;
    }

    blockAll(true);

    let delay = 10;


    let openList = [];
    let closedList = [];
    let targetPoint;
    let parentPoint;
    let array = [TABLE_HEIGHT];

    for (let row = 0; row < TABLE_HEIGHT; row++) {
        array[row] = [TABLE_WIDTH];
        for (let col = 0; col < TABLE_WIDTH; col++) {
            let tmp = table.rows[row].cells[col];
            if (tmp.className === Class.STRONG_WALL || tmp.className === Class.WALL) {
                array[row][col] = new Point('#', col, row);
            } else if (tmp.className === Class.START_POINT) {
                let point = new Point('S', col, row);
                point.setStartPoint();
                point.setValue(0);
                array[row][col] = point;
                openList.push(point);
            } else if (tmp.className === Class.END_POINT) {
                let point = new Point('E', col, row);
                point.setEndPoint();
                targetPoint = point;
                array[row][col] = point;
            } else {
                array[row][col] = new Point('0', col, row);
            }
        }
    }


    let timer = setInterval(function () {
        if (openList.length !== 0 && targetPointNotInOpenList()) {
            parentPoint = popMinElementFromOpenList();

            if (parentPoint === null) {
                alert('Path not found');
                clearInterval(timer);
            }

            addInClosedList(parentPoint);
            checkPoint(-1, 0);
            checkPoint(-1, -1);
            checkPoint(0, -1);
            checkPoint(1, -1);
            checkPoint(1, 0);
            checkPoint(1, 1);
            checkPoint(0, 1);
            checkPoint(-1, 1);
        } else {
            clearInterval(timer);
            printAStar();
        }
    }, delay);


    function printAStar() {
        if (targetPointNotInOpenList()) {
            alert("Путь не найден");
            clearBtn.disabled = false;
            return;
        }
        let parent = targetPoint.getParent();

        while (!parent.isStartPoint()) {
            table.rows[parent.getY()].cells[parent.getX()].className = Class.PATH;
            targetPoint = parent;
            parent = targetPoint.getParent();
        }
        clearBtn.disabled = false;
    }


    function targetPointNotInOpenList() {
        for (let property in openList) {
            if (openList[property].isEndPoint()) {
                return false;
            }
        }
        return true;
    }


    function popMinElementFromOpenList() {
        let minF = Infinity;
        let minElementIndex = null;

        for (let index in openList) {
            if (minF > openList[index].getF()) {
                minF = openList[index].getF();
                minElementIndex = index;
            }
        }

        let result = openList[minElementIndex];
        openList.splice(minElementIndex, 1);

        return result;
    }


    function checkPoint(x, y) {
        let tmpX = parentPoint.getX() + x;
        let tmpY = parentPoint.getY() + y;
        let verifiablePoint = array[tmpY][tmpX];
        if (verifiablePoint.getName() !== '#' && !verifiablePoint.inClosedList()) {
            let currG = x !== 0 && y !== 0 ? 14 : 10;
            let h = Math.abs(tmpX - targetPoint.getX()) + Math.abs(tmpY - targetPoint.getY());
            if (verifiablePoint.isInOpenList()) {
                // стоимость от новой закрытой точки
                let newG = parentPoint.getG() + currG;
                // прыдущая стоимость
                let oldG = verifiablePoint.getG();
                if (newG <= oldG) {
                    verifiablePoint.setParent(parentPoint);
                    verifiablePoint.setHGF(h, currG);
                }
            } else {
                verifiablePoint.setParent(parentPoint);

                verifiablePoint.setHGF(h, currG);
                addInOpenList(verifiablePoint);
            }
        }
    }

    function setPointClass(point, clazz) {
        let curTD = table.rows[point.getY()].cells[point.getX()];
        if (curTD.className !== Class.START_POINT && curTD.className !== Class.END_POINT) {
            curTD.className = clazz;
        }
    }


    function addInOpenList(point) {
        setPointClass(point, Class.OPEN)
        point.addOpenList();
        openList.push(point);
    }


    function addInClosedList(point) {
        setPointClass(point, Class.CLOSED)
        point.moveToClosedList();
        closedList.push(point);
    }


}


clearBtn.onclick = function () {
    for (let i = 0; i < TABLE_HEIGHT; i++) {
        for (let j = 0; j < TABLE_WIDTH; j++) {
            let curTD = table.rows[i].cells[j];
            if (curTD.className === Class.OPEN || curTD.className === Class.CLOSED || curTD.className === Class.PATH) {
                curTD.className = '';
            }
        }
    }
    blockAll(false);
}