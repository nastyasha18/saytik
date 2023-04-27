const canvas = document.getElementById('canvas'); // Получаем элемент холста из DOM
const ctx = canvas.getContext('2d'); // Получаем контекст для рисования на холсте
const clusterButton = document.getElementById('clusterButton'); // Получаем кнопку для кластеризации точек

// Размер кластеров
const clusterSize = 800;

// Массив точек
let points = [];

// Функция для добавления точки на холсте
function addPoint(event) 
{
  const rect = canvas.getBoundingClientRect(); // Получаем координаты холста
  const x = event.clientX - rect.left; // Получаем координаты точки
  const y = event.clientY - rect.top;

  points.push({x, y}); // Добавляем точку в массив
  drawPoints(); // Перерисовываем точки на холсте
}

// Отрисовка точек на холсте
function drawPoints() 
{
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищаем холст перед перерисовкой
  ctx.fillStyle = '#000';  // Задаем стиль для рисования точек

  for (let i = 0; i < points.length; i++)  // Отрисовываем все точки в массиве points
  {  
    ctx.beginPath(); // Начинаем новый путь
    ctx.arc(points[i].x, points[i].y, 5, 0, Math.PI * 2); // Рисуем окружность вокруг точки
    ctx.fill(); // Заливаем окружность цветом
  }
}

// Кластеризация точек
function clusterPoints()
 {
  let clusters = {}; // Создаем объект для хранения кластеров

  // Разбиение точек на кластеры
  for (let i = 0; i < points.length; i++) 
  {
    let closestCluster = null;  // Указываем, что ближайший кластер еще не найден
    let closestDistance = Infinity;   // Указываем большое расстояние до ближайшего кластера

    for (let cluster in clusters) // Ищем ближайший кластер для текущей точки
     {
      let distance = Math.sqrt((points[i].x - clusters[cluster].center.x) ** 2 + (points[i].y - clusters[cluster].center.y) ** 2);
      if (distance < closestDistance)
       {
        closestDistance = distance;
        closestCluster = cluster;
      }
    }
    if (closestDistance < clusterSize) // Если ближайшего кластера нет, создаем новый кластер для текущей точки
     {
      clusters[closestCluster].points.push(points[i]);
      clusters[closestCluster].center.x = (clusters[closestCluster].center.x * (clusters[closestCluster].points.length - 1) + points[i].x) / clusters[closestCluster].points.length;
      clusters[closestCluster].center.y = (clusters[closestCluster].center.y * (clusters[closestCluster].points.length - 1) + points[i].y) / clusters[closestCluster].points.length;
    } 
    else 
    {
      clusters[i] = 
      {
        points: [points[i]],
        center: {
          x: points[i].x,
          y: points[i].y
        }
      };
    }
  }

  // Отрисовка кластеров на холсте
  let colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff', '#ff00ff', '#c0c0c0', '#808080', '#800000', '#808000', '#008000', '#800080'];
  let colorIndex = 0;
  ctx.fillStyle = '#000';
  ctx.font = '12px Arial';

  for (let cluster in clusters) 
  {
    ctx.fillStyle = colors[colorIndex];
    colorIndex++;
    if (colorIndex >= colors.length) 
    
    {
      colorIndex = 0;
    }
    ctx.fillRect(clusters[cluster].center.x - 10, clusters[cluster].center.y - 10, 20, 20);
    ctx.fillText(`Кластер ${cluster}: ${clusters[cluster].points.length} точки`, clusters[cluster].center.x - 10, clusters[cluster].center.y + 25);
  }
}

// Обработчик нажатия на кнопку "Cluster"
clusterButton.onclick = () => 
{
  clusterPoints();
};

// Обработчик клика на холсте для добавления точек
canvas.addEventListener('click', addPoint);

drawPoints();

const resetButton = document.getElementById('resetButton'); // Получаем кнопку для сброса точек

// Обработчик клика на кнопке "Reset"
resetButton.onclick = () => 
{
  points = []; // Очищаем массив точек
  drawPoints(); // Перерисовываем точки на холсте
};