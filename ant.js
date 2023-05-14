var cities = [];
var totalCities = 0;
var recordDistance;
var bestEver;
var drawPath = false;

function setup() {
  var canvas = createCanvas(400, 300);
  canvas.parent('canvas-container');
  canvas.mouseClicked(addCity);

  var findButton = createButton('Find Path');
  findButton.parent('canvas-container');
  findButton.mousePressed(findPath);
  findButton.position(canvas.x + (canvas.width / 2) - (findButton.width / 2), canvas.y + canvas.height + 20);
}

function draw() {
  background(0);
  fill(255);

  for (var i = 0; i < cities.length; i++) {
    ellipse(cities[i].x, cities[i].y, 8, 8);
  }

  if (drawPath) {
    stroke(255);
    strokeWeight(1);
    noFill();
    beginShape();
    for (var i = 0; i < cities.length; i++) {
      vertex(cities[i].x, cities[i].y);
    }
    endShape(CLOSE);
    stroke(255, 0, 255);
    strokeWeight(4);
    noFill();
    beginShape();
    for (var i = 0; i < cities.length; i++) {
      vertex(bestEver[i].x, bestEver[i].y);
    }
    endShape(CLOSE);
  }

  if (totalCities > 1) {
    var i = floor(random(cities.length));
    var j = floor(random(cities.length));
    swap(cities, i, j);
    var d = calcDistance(cities);
    if (d < recordDistance) {
      recordDistance = d;
      bestEver = cities.slice();
    }
  }
}

function addCity() {
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    var v = createVector(mouseX, mouseY);
    cities.push(v);
    totalCities++;
    if (totalCities == 1) {
      recordDistance = 0;
      bestEver = cities.slice();
    }

    if (totalCities > 1) {
      var d = calcDistance(cities);
      if (d < recordDistance) {
        recordDistance = d;
        bestEver = cities.slice();
      }
    }
  }
}

function findPath() {
  drawPath = true;
}

function swap(a, i, j) {
  var temp = a[i];
  a[i] = a[j];
  a[j] = temp;
}

function calcDistance(points) {
  var sum = 0;
  for (var i = 0; i < points.length - 1; i++) {
    var d = dist(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
    sum += d;
  }

  // Добавляем расстояние между последней и первой точками
  sum += dist(points[points.length - 1].x, points[points.length - 1].y, points[0].x, points[0].y);

  return sum;
}
