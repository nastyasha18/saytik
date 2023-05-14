const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const clusterButton = document.getElementById('clusterButton');
const resetButton = document.getElementById('resetButton');

let points = [];
let clusters = [];

// Количество кластеров
const k = 3;

function addPoint(event)
{
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  points.push({ x, y });
  drawPoints();
}

function drawPoints() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#000';

  for (let i = 0; i < points.length; i++) {
    ctx.beginPath();
    ctx.arc(points[i].x, points[i].y, 5, 0, Math.PI * 2);
    ctx.fill();
  }
}

function clusterPoints() {
  // Случайным образом выбираем начальные центры кластеров
  for (let i = 0; i < k; i++) {
    const randomIndex = Math.floor(Math.random() * points.length);
    clusters.push({
      center: points[randomIndex],
      points: []
    });
  }

  // Кластеризация точек
  let isChanged = true;
  while (isChanged) {
    // Очищаем точки у всех кластеров
    for (let i = 0; i < clusters.length; i++) {
      clusters[i].points = [];
    }

    isChanged = false;
    // Кластеризуем точки
    for (let i = 0; i < points.length; i++) {
      let closestCluster = null;
      let closestDistance = Infinity;
      for (let j = 0; j < clusters.length; j++) {
        const distance = Math.sqrt((points[i].x - clusters[j].center.x) ** 2 + (points[i].y - clusters[j].center.y) ** 2);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestCluster = j;
        }
      }
      clusters[closestCluster].points.push(points[i]);
    }

    // Обновляем центры кластеров
    for (let i = 0; i < clusters.length; i++) {
      const color = '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
      ctx.fillStyle = color;
      for (let j = 0; j < clusters[i].points.length; j++) {
        ctx.beginPath();
        ctx.arc(clusters[i].points[j].x, clusters[i].points[j].y, 5, 0, Math.PI * 2);
        ctx.fill();
      }
      clusters[i].center.x = clusters[i].points.reduce((sum, p) => sum + p.x, 0) / clusters[i].points.length;
      clusters[i].center.y = clusters[i].points.reduce((sum, p) => sum + p.y, 0) / clusters[i].points.length;
    }

    // Отображение кластеров на холсте
    for (let i = 0; i < clusters.length; i++) {
      const color = '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(clusters[i].center0).toString(16).padStart(6, '0');
      ctx.fillStyle = color;
      for (let i = 0; i < clusters.length; i++) {
        const center = clusters[i].center;
        const points = clusters[i].points;
        let totalX = 0;
        let totalY = 0;
        for (let j = 0; j < points.length; j++) {
          totalX += points[j].x;
          totalY += points[j].y;
        }
        const newCenter = {
          x: totalX / points.length,
          y: totalY / points.length
        };
        if (newCenter.x !== center.x || newCenter.y !== center.y) {
          isChanged = true;
        }
        clusters[i].center = newCenter;
        ctx.beginPath();
        ctx.arc(newCenter.x, newCenter.y, 10, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // Отображение кластеров на холсте
  for (let i = 0; i < clusters.length; i++) {
    const color = '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
    ctx.fillStyle = color;
    for (let j = 0; j < clusters[i].points.length; j++) {
      ctx.beginPath();
      ctx.arc(clusters[i].points[j].x, clusters[i].points[j].y, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Отображение центров кластеров на холсте
  for (let i = 0; i < clusters.length; i++) {
    const color = '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(clusters[i].center.x, clusters[i].center.y, 10, 0, Math.PI * 2);
    ctx.fill();
  }
}
function resetPoints() {
  points = [];
  clusters = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

canvas.addEventListener('click', addPoint);
clusterButton.addEventListener('click', clusterPoints);
resetButton.addEventListener('click', resetPoints);