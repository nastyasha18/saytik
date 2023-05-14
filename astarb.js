// A* algorithm (CODINGAN SENDIRI)

function astar(board, start, destination) {
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
    }
 
    function nodeToKey(n) {
       return `${n[0]},${n[1]}`;
    }
 
    // очередб приоритетов
    let openSet = [start];
    let cameFrom = new Map();
 
    // O(n^2)
    let gScore = {};
    for (let y = 0; y < board.length; y++) {
       for (let x = 0; x < board[y].length; x++) {
          gScore[`${x},${y}`] = Infinity;
       }
    }
    // для узла n, fScore[n] := gScore[n] + h(n). fScore[n] представляет собой наше нынешнее лучшее относительное положение 
    // Насколько маленьким может быть путь от начала до конца, если он проходит через N.
    let fScore = Object.assign({}, gScore);
 
    gScore[nodeToKey(start)] = 0;
    fScore[nodeToKey(start)] = h(start);
 
    while (openSet.length > 0) {
       const current = openSet.pop();
       if (current[0] == destination[0] && current[1] == destination[1]) {
          return reconstructPath(cameFrom, current, board);
       }
 
       let neighbors = [];
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
       for (let neighbor of neighbors) {
 
          // tentative_gScore - расстояние от старта до соседа через ток
          const tentative_gScore = gScore[nodeToKey(current)] + 1; // gScore[current] + d(current, neighbor), d(current,neighbor) is the weight of the edge from current to neighbor
 
          gScore[nodeToKey(neighbor)] = gScore[nodeToKey(neighbor)] === undefined ? Infinity : gScore[nodeToKey(neighbor)];
 
          if (tentative_gScore < gScore[nodeToKey(neighbor)]) {
             // Этот путь к соседу лучше любого предыдущего.
             cameFrom.set(nodeToKey(neighbor), current);
             gScore[nodeToKey(neighbor)] = tentative_gScore;
             fScore[nodeToKey(neighbor)] = tentative_gScore + h(neighbor);
 
             if (!openSet.find(x => x[0] === neighbor[0] && x[1] === neighbor[1])) {
                // Добавить в приоритетную очередь 
                // arr.sort( (a, b) => b - a );
                openSet.push(neighbor);
                openSet.sort((a, b) => fScore[nodeToKey(b)] - fScore[nodeToKey(a)]);
             }
          }
       }
    }
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
 
 const $xInput = document.getElementById('x-length');
 const $yInput = document.getElementById('y-length');
 const $btnGenerate = document.getElementById('btn-generate');
 let x = 1;
 let y = 1;
 let generatedBoard = [];
 let start = { node: null };
 let end = { node: null };
 
 function generateBoard() {
    generatedBoard = [];
    start = { node: null };
    end = { node: null };
    for (let i = 0; i < y; i++) {
       generatedBoard[i] = [];
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
 
 
 function maxCap(e) {
    e.stopPropagation();
    if (e.target.value > 30) {
       e.target.value = 30;
    }
 }
 function minCap(e) {
    e.stopPropagation();
    if (e.target.value < 2) {
       e.target.value = 2;
    }
 }
 
 $xInput.addEventListener('input', maxCap);
 $xInput.addEventListener('change', minCap);
 $yInput.addEventListener('input', maxCap);
 $yInput.addEventListener('change', minCap);
 $btnGenerate.addEventListener('click', () => {
    x = Number($xInput.value);
    y = Number($yInput.value);
    generateBoard();
    renderBoard(generatedBoard, start, end);
    path = null;
 });
 
 
 
 function renderBoard(b, start, end) {
    const $board = document.getElementById('board');
    $board.innerHTML = '';
    const yLength = b.length;
    const xLength = b[0].length;
    const boardWidth = 20 * xLength;
    const boardHeight = 20 * yLength;
 
    $board.style.gridTemplateRows = `repeat(${yLength}, 20px)`;
    $board.style.gridTemplateColumns = `repeat(${xLength}, 20px)`;
    $board.style.width = `${boardWidth}px`;
    $board.style.height = `${boardHeight}px`;
 
    for (let y = 0; y < b.length; y++) {
       for (let x = 0; x < b[y].length; x++) {
          const $box = document.createElement('div');
          $box.classList.add('box');
 
          if (b[y][x] === 0) $box.classList.add('disabled');
 
 
          // цвет выводв для узла пути
          if (start.node !== null && end.node !== null) {
             const isStart = x === start.node[0] && y === start.node[1];
             const isEnd = x === end.node[0] && y === end.node[1];
             if (b[y][x] === 2 && !isStart && !isEnd) $box.classList.add('path');
          }
          // начальный узел вывода
          if (start.node !== null) {
             const isStart = x === start.node[0] && y === start.node[1];
             if (isStart) { $box.classList.add('start'); }
          }
          // конечный узел вывода
          if (end.node !== null) {
             const isEnd = x === end.node[0] && y === end.node[1];
             if (isEnd) { $box.classList.add('end'); }
          }
 
 
 
          $box.dataset.x = x; $box.dataset.y = y;
 
          // event listener для начального/конечного узла настройки
          $box.addEventListener('click', (e) => {
             const $boxes = document.querySelectorAll('.box');
             if (isSelectingStart) {
                if (start.node !== null) {
                   $boxes[start.node[1] * xLength + start.node[0]].classList.remove('start')
                }
                start.node = [x, y];
                $box.classList.add('start');
                b[y][x] = 1;
                $box.classList.remove('end', 'disabled');
 
             }
             if (isSelectingEnd) {
                if (end.node !== null) {
                   $boxes[end.node[1] * xLength + end.node[0]].classList.remove('end')
                }
                end.node = [x, y];
                $box.classList.add('end');
                b[y][x] = 1;
                $box.classList.remove('start', 'disabled');

             }
 
             // рисующая стена/отключенный узел 
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
                // переключение стены/пути в двухмерном массиве board
                if (b[y][x] === 1) {
                   b[y][x] = 0;
                } else if (b[y][x] === 0 || b[y][x] === 2) {
                   b[y][x] = 1;
                }
             }
 
          });
          $board.append($box);
       }
    }
 
 }
 
 // пусть начнется = {node: [0, 0]};
 // пусть закончится= {node: [9, 9]};
 let path = null; // the path of start to end after executing start button
 
 
 const $start = document.getElementById('start');
 const $clear = document.getElementById('clear');
 const $startInfo = document.getElementById('start-info');
 const $endInfo = document.getElementById('end-info');
 const $wallInfo = document.getElementById('draw-wall');
 let isSelectingStart = false;
 let isSelectingEnd = false;
 let isSelectingWall = false;
 
 
 $wallInfo.addEventListener('click', (e) => {
    isSelectingWall = !isSelectingWall;
 
    isSelectingEnd = false;
    isSelectingStart = false;
    $endInfo.querySelector('.wrapper').classList.remove('active');
    $startInfo.querySelector('.wrapper').classList.remove('active');
 
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
 
 
 
 function clearPaths() {
    if (path !== null) {
       let $boxes = document.querySelectorAll('.box');
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
 
 
 $start.addEventListener('click', () => {
    clearPaths();
 
    if (start.node === null) {
       return alert('Добавьте стартовую точку.');
    } else if (end.node === null) {
       return alert('Добавьте конечную точку');
    } else if (start.node === null && end.node === null) {
       return alert('Добавьте стартовую и конечную точки');
    }
 
    // после выполнения алгоритма*
    const { board: newBoard, path: p } = astar(generatedBoard, start.node, end.node);
    path = p;
    // генерация новой доски 
    if (path !== null) {
       let $boxes = document.querySelectorAll('.box');
       // проложить путь 
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
 