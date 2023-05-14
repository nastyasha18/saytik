// вкладка ввода размеров поля консольки
let TABLE_WIDTH = parseInt(prompt("Введите ширину таблицы (не более 100):"));
while (isNaN(TABLE_WIDTH) || TABLE_WIDTH > 100)
{
TABLE_WIDTH = parseInt(prompt("Ширина таблицы должна быть числом и не может быть больше 100. Пожалуйста, введите значение еще раз:"));
}

let TABLE_HEIGHT = parseInt(prompt("Введите высоту таблицы (не более 100):"));
while (isNaN(TABLE_HEIGHT) || TABLE_HEIGHT > 100)
{
TABLE_HEIGHT = parseInt(prompt("Высота таблицы должна быть числом и не может быть больше 100. Пожалуйста, введите значение еще раз:"));
}


let startCell = null; // Установить начальную и целевую ячейки в null и разрешить редактирование таблицы
let targetCell = null;
let canEditTable = true;

let ACTIONS = {ADD_WALL: 0, REMOVE_WALL: 1, ADD_START: 2, ADD_END: 3, SELECTED: 0}; // Устанавливаеиъм доступные действия (добавление стен, удаление стен, добавление начальной или конечной точек)

let Class = { // Установить классы для каждого типа ячеек
   
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

    function fillCell(cell) { //Эта функция заполняет ячейку 
        let classList = cell.classList
        switch (ACTIONS.SELECTED) {

            // Добавление класса 'wall' к ячейке, если у нее его еще нет
            case ACTIONS.ADD_WALL: {
                if (cell.className === '') {
                    classList.add('wall')
                }
                break;
            }
            // Добавление класса 'end' к следующей ячейке и удаление его из предыдущей целевой ячейки.
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
            // Добавление класса 'start' к ячейке, если у нее его еще нет, и его удаление из предыдущей стартовой ячейки.
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
            // Удаление класса 'wall' из ячейки, если он у нее есть.
            case ACTIONS.REMOVE_WALL: {
                if (classList.contains('wall')) {
                    classList.remove('wall')
                }
                break;
            }
        }
    }
}());

/*Эта функция проверяет, возможно ли начать поиск пути. Она возвращает значение true, 
если переменные startCell и targetCell не равны null, иначе - false.*/

function checkStartIsPossible() {
    return startCell != null && targetCell != null;
}


class Point {
    /* Конструктор класса инициализирует различные свойства точки, такие как ее координаты, 
    значение, флаги для начальной и конечной точек, а также свойства для работы с алгоритмом поиска пути*/
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

    }

    setValue(value) // Метод setValue устанавливает значение точки
    {
        this.value = value;
    }

    getG() // Метод getG возвращает значение g
    {
        return this.g;
    }

    getParent() // Метод getParent возвращает родительскую точку
    {
        return this.parent;
    }

    setParent(parent) // Метод setParent устанавливает родительскую точку
    {
        this.parent = parent;
    }

    getF() // Метод getF возвращает значение f
    {
        return this.f;
    }

    isStartPoint() // Метод isStartPoint возвращает true, если точка является начальной
    {
        return this.startPoint;
    }

    setStartPoint() // Метод setStartPoint устанавливает флаг начальной точки
    {
        this.startPoint = true;
    };

    isEndPoint() // Метод isEndPoint возвращает true, если точка является конечной
    {
        return this.endPoint;
    }

    setEndPoint() // Метод setEndPoint устанавливает флаг конечной точки.
    {
        this.endPoint = true;
    }

    getX() // Метод getX возвращает координату x точки
    {
        return this.x;
    }

    getY() // Метод getY возвращает координату y точки
    {
        return this.y;
    }

    getName() // Метод getName возвращает имя точки
    {
        return this.Name;
    };

    setHGF(h, g) // Метод setHGF устанавливает значения h, g и f для точки
    {
        this.h = h * 10;
        this.g = g + this.parent.g;
        this.f = this.h + this.g;
    };

    addOpenList() // Метод addOpenList добавляет точку в открытый список.
    {
        this.inOpenList = true;
    };

    isInOpenList() // Метод isInOpenList возвращает true, если точка находится в открытом списке
    {
        return this.inOpenList;
    };

    moveToClosedList() // Метод moveToClosedList перемещает точку в закрытый список
    {
        this.inClossedList = true;
        this.inOpenList = false;
    };

    inClosedList() // Метод inClosedList возвращает true, если точка находится в закрытом списке
    {
        return this.inClossedList;
    };

}

/* // Эта функция блокирует или разблокирует все элементы таблицы.Она принимает флаг в качестве параметра,
 который определяет, нужно ли заблокировать элементы таблицы. Если флаг равен true, то переменная canEditTable
  устанавливается в false, что означает, что таблицу нельзя редактировать и наоборот */
function blockAll(flag) {
    canEditTable = !flag;
    for (let val in tableElements) {
        tableElements[val].disabled = flag;
    }
}


runBtn.onclick = function () {

    // Проверяем наличие ячеек "начало" и "конец"
    if (!checkStartIsPossible()) {
        alert("Вам нужно добавить ячейки «начало» и «конец» в таблицу");
        return;
    }
    
    // Блокируем все кнопки на время поиска пути
    blockAll(true);

    // Задержка между итерациями в миллисекундах
    let delay = 10;

    // Создаем пустые массивы для списка открытых и закрытых вершин
    let openList = [];
    let closedList = [];

    // Целевая точка и точка-родитель
    let targetPoint;
    let parentPoint;

    // Создаем двумерный массив "array" состоящий из объектов Point 
    let array = [TABLE_HEIGHT];
    for (let row = 0; row < TABLE_HEIGHT; row++) {
        array[row] = [TABLE_WIDTH];
        for (let col = 0; col < TABLE_WIDTH; col++) {

            let tmp = table.rows[row].cells[col];
            
            // Создаем объекты Point для ячеек соответствующих стенам, начальной и конечной точкам
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


    let timer = setInterval(function () // Создаем интервал, который запускает функцию поиска пути в заданный интервал времени 
    {
        // Проверяем, что список открытых вершин не пуст и целевая точка не находится в нем
        if (openList.length !== 0 && targetPointNotInOpenList())
         {
            // Получаем вершину родителя с минимальной стоимостью из списка открытых вершин
            parentPoint = popMinElementFromOpenList(); 

            // Если родительская вершина не найдена, выводим сообщение, что путь не найден и останавливаем интервал
            if (parentPoint === null) {
                alert('Path not found');
                clearInterval(timer);
            }

            // Добавляем вершину в список закрытых вершин и проверяем соседние ячейки родительской вершины
            checkPoint(-1, 0);
            addInClosedList(parentPoint);
            checkPoint(-1, 0);
            checkPoint(-1, -1);
            checkPoint(0, -1);
            checkPoint(1, -1);
            checkPoint(1, 0);
            checkPoint(1, 1);
            checkPoint(0, 1);
            checkPoint(-1, 1);
        } 
        
         // Если список открытых вершин пуст или целевая точка найдена, выводим путь и останавливаем интервал
        else {
            clearInterval(timer);
            printAStar();
        }
    }, delay); 


    function printAStar() //Функция printAStar() отвечает за вывод пути найденного алгоритмом А* 
    {
        /* Если целевая точка не находится в списке открытых вершин, выводится сообщение "Путь не найден" 
        и кнопка "Очистить" становится доступной.*/

        if (targetPointNotInOpenList()) {
            alert("Путь не найден");
            clearBtn.disabled = false;
            return;
        }
        let parent = targetPoint.getParent();

        /*Если путь найден, функция проходит по родительской цепочке от целевой точки до стартовой 
        и выделяет ячейки на HTML-странице, чередуя классы для перекраски взависимости от типа ячейки 
        (старт, финиш, препятствие, путь).*/

        while (!parent.isStartPoint()) {
            table.rows[parent.getY()].cells[parent.getX()].className = Class.PATH;
            targetPoint = parent;
            parent = targetPoint.getParent();
        }
        clearBtn.disabled = false;
    }

    //Функция targetPointNotInOpenList() проверяет находится ли конечная точка пути в списке открытых вершин
    function targetPointNotInOpenList() {
        for (let property in openList) {
            if (openList[property].isEndPoint()) {
                return false;
            }
        }
        return true;
    }
    /*(Для этого функция проходится по свойствам объекта openList, и если встречает свойство, 
    соответствующее конечной точке, то она возвращает false. Если конечная точка не найдена в openList, 
    функция возвращает true)*/


    function popMinElementFromOpenList() 
    {
        //Объявляются переменные,где minF инициализируется значением Infinity, а minElementIndex равен null
        let minF = Infinity;
        let minElementIndex = null;
        
        /*. Если значение функции f текущего элемента меньше, чем значение в переменной minF, то текущее 
        значение функции f присваивается в minF, а индекс текущей вершины записывается в minElementIndex*/
        for (let index in openList) {
            if (minF > openList[index].getF()) {
                minF = openList[index].getF();
                minElementIndex = index;
            }
        }
        //Запись переменной result с наименьшим значением функции f и его удаление из массива openList методом splice
        let result = openList[minElementIndex];
        openList.splice(minElementIndex, 1);

        return result;
    }

    //Функция cпроверяет вершину по переданным координатам x и y
    function checkPoint(x, y) {
        let tmpX = parentPoint.getX() + x;
        let tmpY = parentPoint.getY() + y;
        let verifiablePoint = array[tmpY][tmpX]; //координаты родительских вершин со смищением
        if (verifiablePoint.getName() !== '#' && !verifiablePoint.inClosedList()) {
            let currG = x !== 0 && y !== 0 ? 14 : 10;
            let h = Math.abs(tmpX - targetPoint.getX()) + Math.abs(tmpY - targetPoint.getY());
            if (verifiablePoint.isInOpenList()) {
                // стоимость от новой закрытой точки
                let newG = parentPoint.getG() + currG;
                // Если новое значение меньше или равно старому, то родительская точка, f, g, h обновляются в verifiablePoint
                let oldG = verifiablePoint.getG();
                if (newG <= oldG) {
                    verifiablePoint.setParent(parentPoint);
                    verifiablePoint.setHGF(h, currG);
                }
            } 
            //иначе f, g, h устанавливаются в verifiablePoint и точка добавляется в открытый списо
            else {
                verifiablePoint.setParent(parentPoint);

                verifiablePoint.setHGF(h, currG);
                addInOpenList(verifiablePoint);
            }
        }
    }

    // Установка CSS-класса для определенной ячейки таблицы
    function setPointClass(point, clazz)
     {
        let curTD = table.rows[point.getY()].cells[point.getX()];
        if (curTD.className !== Class.START_POINT && curTD.className !== Class.END_POINT) {
            curTD.className = clazz;
        }
    }

    /*Добавление переданной точки в открытый список, установка для нее соответствующего CSS-класса
     и ообновление информации о ее принадлежности к открытому списку*/
    function addInOpenList(point) {
        setPointClass(point, Class.OPEN)
        point.addOpenList();
        openList.push(point);
    }

    /*Добавление переданной точки в закрытый список, установка для нее соответствующего CSS-класса
     и обновление информации о ее принадлежности к закрытому списку*/
    function addInClosedList(point) {
        setPointClass(point, Class.CLOSED)
        point.moveToClosedList();
        closedList.push(point);
    }


}
//Сброс классов всех ячеек таблицы, отвечающих за принадлежность к открытому и закрытому спискам
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