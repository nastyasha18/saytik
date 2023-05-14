// A* algorithm (CODINGAN SENDIRI)

function astar(board, start, destination) // Функция A* для поиска кратчайшего пути на доске board от точки start до точки destination
{
    console.log('A* board', board);
    function reconstructPath(cameFrom, current, board) {
       let path = [current];
       while (cameFrom.get(nodeToKey(current)) !== undefined) {
          current = cameFrom.get(nodeToKey(current));
          path.unshift(current)
       }
       return { path };
 
    }

    // функция расстояния Manhattan  
    function h(n) {
       const x1 = n[0];
       const x2 = destination[0];
       const y1 = n[1];
       const y2 = destination[1];
       return Math.abs(x1 - x2) + Math.abs(y1 - y2);
       /* функция вычисляет эвристическое значение (оценку стоимости пути от текущей вершины "n" 
       до пункта назначения). В качестве входных параметров она принимает координаты текущей вершины (x, y)
        и координаты пункта назначения (destination). Затем она возвращает сумму абсолютных разностей между 
        x-координатами и y-координатами, которая представляет Манхэттенское расстояние между ними*/
    }
 
    function nodeToKey(n) 
    {
       return `${n[0]},${n[1]}`;
       /* функция преобразует координаты вершины (x, y) в строковый ключ в формате "x,y", который будет 
       использоваться для доступа к вершине в hashmap, используемой алгоритмом для отслеживания посещенных вершин.*/
    }
 
    let openSet = [start]; //это список, содержащий только начальную вершину start
    let cameFrom = new Map(); /* пустой словарь Map(), который будет использоваться для
     отслеживания того, какая вершина вела к какой вершине во время алгоритма поиска пути*/
 
   //словарь - который будет хранить текущие значения стоимости пути от стартовой точки до каждой точки на доске
    let gScore = {};
    for (let y = 0; y < board.length; y++) {
       for (let x = 0; x < board[y].length; x++) {
          gScore[`${x},${y}`] = Infinity; // Изначально стоимость пути до каждой точки на доске равна бесконечности
       }
    }

    /* словарь - который будет хранить текущие значения оценки стоимости пути от стартовой точки
     до конечной точки через каждую точку на доске*/
    let fScore = Object.assign({}, gScore);
 
    gScore[nodeToKey(start)] = 0; // Устанавливаем стоимость пути от стартовой точки до самой себя равной 0
    fScore[nodeToKey(start)] = h(start); // Устанавливаем оценку стоимости пути от стартовой точки до конечной точки через стартовую точку
 
    while (openSet.length > 0) // Итерируемся по openSet, пока он не станет пустым
    {
       const current = openSet.pop(); // Извлекаем из openSet точку с наименьшей оценкой
      // Если текущая точка является конечной точкой, то возвращаем найденный путь
       if (current[0] == destination[0] && current[1] == destination[1]) 
      {
          return reconstructPath(cameFrom, current, board);
       }
 
       let neighbors = []; // Получаем соседей текущей точки
       if (board[current[1]] !== undefined) {
          const left = board[current[1]][current[0] - 1];
          if (left !== undefined && left !== 0) {
             neighbors.push([current[0] - 1, current[1]]);
          }
       }
       if (board[current[1] - 1]) {
          const top = board[current[1] - 1][current[0]];
          if (top !== undefined && top !== 0) {
             neighbors.push([current[0], current[1] - 1]);
          }
       }
       if (board[current[1]]) {
          const right = board[current[1]][current[0] + 1];
          if (right !== undefined && right !== 0) {
             neighbors.push([current[0] + 1, current[1]]);
          }
       }
       if (board[current[1] + 1]) {
          const bottom = board[current[1] + 1][current[0]];
          if (bottom !== undefined && bottom !== 0) {
             neighbors.push([current[0], current[1] + 1]);
          }
       }

       // Обновляем значения стоимости пути и оценки стоимости пути для каждого соседа текущей точки
       for (let neighbor of neighbors) {
 
          const tentative_gScore = gScore[nodeToKey(current)] + 1; 
         
          // Если стоимость пути до соседа еще не была вычислена, то устанавливаем ее равной бесконечности
          gScore[nodeToKey(neighbor)] = gScore[nodeToKey(neighbor)] === undefined ? Infinity : gScore[nodeToKey(neighbor)];
         
          // Если новая стоимость пути до соседа меньше текущей, то обновляем значения стоимости пути и оценки стоимости пути для соседа

          if (tentative_gScore < gScore[nodeToKey(neighbor)])
           {
             cameFrom.set(nodeToKey(neighbor), current);
             gScore[nodeToKey(neighbor)] = tentative_gScore;
             fScore[nodeToKey(neighbor)] = tentative_gScore + h(neighbor);

             // Если сосед еще не находится в openSet, то добавляем его туда и сортируем openSet по убыванию оценки fScore
             if (!openSet.find(x => x[0] === neighbor[0] && x[1] === neighbor[1])) 
             {
                openSet.push(neighbor);
                openSet.sort((a, b) => fScore[nodeToKey(b)] - fScore[nodeToKey(a)]);
             }
          }
       }
    }
    // Если openSet стал пустым, то возвращаем null в качестве пути и исходную доску board
    console.log('SAMPE SINI!', board);
    return { path: null, board };
 }
 
 // 0 = нетрудоспособный, 1 = Доступный путь, 2 = Путь к концу
 
 const board = [
    [1, 0, 1, 0, 0, 0, 0, 1, 1, 1],
    [1, 0, 1, 0, 0, 0, 0, 1, 1, 1],
    [1, 0, 1, 0, 0, 0, 0, 1, 1, 1],
    [1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
    [1, 0, 1, 0, 0, 0, 0, 1, 1, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 1, 0, 1, 1, 1],
    [1, 0, 1, 0, 0, 1, 0, 1, 1, 1],
    [1, 0, 1, 0, 0, 1, 0, 1, 1, 1],
    [1, 0, 1, 0, 0, 1, 1, 1, 1, 1],
 ];
 
 
 // Ожидаемый результат: [ [0, 0], [0, 1], [0, 2], [0, 3], [1, 3], [2, 3], [2, 4], [2, 5], [3, 5], [4, 5], [5, 5], [5, 6], [5, 7], [5, 8], [5, 9], [6, 9], [7, 9], [8, 9], [9, 9] ]
 
 
 // ========= html =============
 
 //объявление переменных и получение элементов HTML-кода страницы:
 const $xInput = document.getElementById('x-length');
 const $yInput = document.getElementById('y-length');
 const $btnGenerate = document.getElementById('btn-generate');
 let x = 1; //ширина
 let y = 1;// длина
 let generatedBoard = []; //генерация
 let start = { node: null }; //начало
 let end = { node: null }; //конец
 
 //функция генерации доски
 function generateBoard() 
 {
    generatedBoard = []; // Очищаем сгенерированную доску и информацию о стартовой и конечной точках
    start = { node: null };
    end = { node: null };

    // Итерируемся по высоте и ширине доски, генерируя случайные значения для каждой ячейки
    for (let i = 0; i < y; i++) {
       generatedBoard[i] = [];

       /* Если случайное значение больше 2, то устанавливаем значение ячейки равным 1 (проходимой), 
       иначе - равным 0 (непроходимой)*/

       for (let j = 0; j < x; j++) {
          const rand = Math.round(Math.random() * 10);
          generatedBoard[i][j] = rand > 2 ? 1 : 0;
       }
    }
 }
 
 // Начальная генерация доски
 generateBoard();
 // инициализация доски 
 renderBoard(generatedBoard, start, end);
 
 
 function maxCap(e) // Функция для ограничения максимального значения input
 {
    e.stopPropagation();
    if (e.target.value > 30) {
       e.target.value = 30;
    }
 }
 function minCap(e) // Функция для ограничения минимального значения input
 {
    e.stopPropagation();
    if (e.target.value < 2) {
       e.target.value = 2;
    }
 }
 
 $xInput.addEventListener('input', maxCap);
 $xInput.addEventListener('change', minCap);
 $yInput.addEventListener('input', maxCap);

 $yInput.addEventListener('change', minCap);
 //получает значения ширины и высоты доски из элементов input с id "x-length" и "y-length"
 $btnGenerate.addEventListener('click', () => 
 {
    x = Number($xInput.value);
    y = Number($yInput.value);
    generateBoard(); //генерирует  и отображает новую доску
    renderBoard(generatedBoard, start, end);
    path = null;
 });


 // Определим функцию, которая отображает на доске лабиринт и маршрут

 function renderBoard(b, start, end) {
    const $board = document.getElementById('board');
    $board.innerHTML = '';
    const yLength = b.length;
    const xLength = b[0].length;
    // Определим ширину и высоту доски в соответствии с размером лабиринта
    const boardWidth = 20 * xLength;
    const boardHeight = 20 * yLength;
   // Определим сетку доски (ряды и колонки)
    $board.style.gridTemplateRows = `repeat(${yLength}, 20px)`;
    $board.style.gridTemplateColumns = `repeat(${xLength}, 20px)`;
    $board.style.width = `${boardWidth}px`;
    $board.style.height = `${boardHeight}px`;

    for (let y = 0; y < b.length; y++) // Пробежимся по всему лабиринту
    {
       for (let x = 0; x < b[y].length; x++) 
       {
          // Создаем div для каждого блока (клетки) и добавляем класс
          const $box = document.createElement('div');
          $box.classList.add('box');

          // Определяем, является ли блок стеной или нет
          if (b[y][x] === 0) $box.classList.add('disabled');
 
          // Определяем маршрут
          if (start.node !== null && end.node !== null) {
             const isStart = x === start.node[0] && y === start.node[1];
             const isEnd = x === end.node[0] && y === end.node[1];
             if (b[y][x] === 2 && !isStart && !isEnd) $box.classList.add('path');
          }
      
           // Определяем начальную точку
          if (start.node !== null) {
             const isStart = x === start.node[0] && y === start.node[1];
             if (isStart) { $box.classList.add('start'); }
          }
    
          // Определяем конечную точку
          if (end.node !== null) {
             const isEnd = x === end.node[0] && y === end.node[1];
             if (isEnd) { $box.classList.add('end'); }
          }


          $box.dataset.x = x; $box.dataset.y = y; // Добавляем координаты блока
 
          // Добавляем обработчик событий на клик по блоку
          $box.addEventListener('click', (e) => {
             const $boxes = document.querySelectorAll('.box');
             if (isSelectingStart)
            {
               // Определяем начальную точку
                if (start.node !== null) {
                   $boxes[start.node[1] * xLength + start.node[0]].classList.remove('start')
                }
                start.node = [x, y];
                $box.classList.add('start');
                b[y][x] = 1;
                $box.classList.remove('end', 'disabled');
 
             }
             if (isSelectingEnd) 
             {
               // Определяем конечную точку
                if (end.node !== null) {
                   $boxes[end.node[1] * xLength + end.node[0]].classList.remove('end')
                }
                end.node = [x, y];
                $box.classList.add('end');
                b[y][x] = 1;
                $box.classList.remove('start', 'disabled');

             }
 
             // Определяем запретную зону
             if (isSelectingWall) {
                const { x, y } = $box.dataset;
                if ($box.classList.contains('start')) {
                   start.node = null;
                }
                if ($box.classList.contains('end')) {
                   end.node = null;
                }
                $box.classList.remove('start', 'end', 'path');
                $box.classList.toggle('disabled');
            
                if (b[y][x] === 1) {
                   b[y][x] = 0;
                } else if (b[y][x] === 0 || b[y][x] === 2) {
                   b[y][x] = 1;
                }
             }
 
          });
          // Добавляем созданный блок на доску
          $board.append($box);
       }
    }
 
 }
 
 
 let path = null; // Путь от начала до конца после выполнения кнопки «Пуск»
 
 // Получение элементов DOM
 const $start = document.getElementById('start');
 const $clear = document.getElementById('clear');
 const $startInfo = document.getElementById('start-info');
 const $endInfo = document.getElementById('end-info');
 const $wallInfo = document.getElementById('draw-wall');
 let isSelectingStart = false;
 let isSelectingEnd = false;
 let isSelectingWall = false;
 
 // Флаги выбора стартовой, конечной и стенной точек
 $wallInfo.addEventListener('click', (e) => {
    isSelectingWall = !isSelectingWall;
 
    isSelectingEnd = false;
    isSelectingStart = false;
    $endInfo.querySelector('.wrapper').classList.remove('active');
    $startInfo.querySelector('.wrapper').classList.remove('active');
 
    // Обработчики событий клика
    $wallInfo.querySelector('.wrapper').classList.toggle('active');
 });
 $startInfo.addEventListener('click', (e) => {
    isSelectingStart = !isSelectingStart;
 
    isSelectingEnd = false;
    isSelectingWall = false
    $endInfo.querySelector('.wrapper').classList.remove('active');
    $wallInfo.querySelector('.wrapper').classList.remove('active');
 
 
    $startInfo.querySelector('.wrapper').classList.toggle('active');
 });
 $endInfo.addEventListener('click', (e) => {
    isSelectingEnd = !isSelectingEnd;
 
    isSelectingStart = false;
    isSelectingWall = false;
    $startInfo.querySelector('.wrapper').classList.remove('active');
    $wallInfo.querySelector('.wrapper').classList.remove('active');
 
    $endInfo.querySelector('.wrapper').classList.toggle('active');
 });
 
 // Функция очистки найденного пути
 function clearPaths() {
    if (path !== null) {
       let $boxes = document.querySelectorAll('.box');
       // Удаление класса 'path' у ячеек, входящих в путь
       for (let i = 0; i < path.length; i++) {
 
          const node = path[i];
          let boardNode = generatedBoard[node[1]][node[0]];
          if (boardNode === 0) continue;
          const boxIndex = node[1] * x + node[0];
          const $box = $boxes[boxIndex];
          boardNode = 1;
          $box.classList.remove('path')
       }
    }
    path = null;
 }
 
// Обработчик события клика на кнопку 'start'
 $start.addEventListener('click', () => {
    clearPaths();
 
    if (start.node === null) {
       return alert('Добавьте стартовую точку.');
    } else if (end.node === null) {
       return alert('Добавьте конечную точку');
    } else if (start.node === null && end.node === null) {
       return alert('Добавьте стартовую и конечную точки');
    }
 
     // Запуск алгоритма поиска пути
    const { board: newBoard, path: p } = astar(generatedBoard, start.node, end.node);
    path = p;
    // Генерация новой доски и прокладка найденного пути 
    if (path !== null) {
       let $boxes = document.querySelectorAll('.box');
         // Визуализация найденного пути с задержкой на каждую ячейку 
       for (let i = 0; i < path.length; i++) {
          setTimeout(() => {
             const node = path[i];
             generatedBoard[node[1]][node[0]] = 1;
             const boxIndex = node[1] * x + node[0];
             if (!$boxes[boxIndex].classList.contains('start') && !$boxes[boxIndex].classList.contains('end')) {
                $boxes[boxIndex].classList.add('path');
             }
          }, i * 50);
       }
    } else {
       alert('Путь не найден');
    }
 
 });
 // Обработчик события клика на кнопку 'clear'
 $clear.addEventListener('click', () => {
    clearPaths();
 });
 
 document.body.addEventListener('keypress', (e) => {
    e.stopPropagation();
    console.log(e.key);
    switch (e.key) {
       case 's':
       case 'S':
          $startInfo.click();
          break;
       case 'e':
       case 'E':
          $endInfo.click();
          break;
       case 'w':
       case 'W':
          $wallInfo.click();
          break;
       case 'Enter':
          $start.click();
          break;
       case 'c':
       case 'C': 
          $clear.click();
          break;
    }
 });
 