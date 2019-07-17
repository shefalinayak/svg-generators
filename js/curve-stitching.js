function paperSketch(parent) {

  var ps = parent.paperscope;

  var drawing = new ps.Group();
  var x = 370;
  var y = 230;

  var drawFunctions = {
    parabolasInPolygon: function([numSides,numStepsPerSide]) {
      var v = numSides;
      var n = numStepsPerSide;
      var p = 2 * Math.PI / v;

      for (var b = 0; b <= 2 * Math.PI; b += p) {
        var g = b + p;
        var k = b + 2 * p;
        for (var h = y/n; h <= y+1; h += y/n) {
          var t = y - h;
          var a = t * Math.sin(b) + h * Math.sin(g);
          var d = t * Math.cos(b) + h * Math.cos(g);
          var c = t * Math.sin(g) + h * Math.sin(k);
          var f = t * Math.cos(g) + h * Math.cos(k);

          var ptFrom = new ps.Point(x+a,y-d);
          var ptTo = new ps.Point(x+c,y-f);
          var line = ps.Path.Line(ptFrom,ptTo);
          drawing.addChild(line);
        }
      }
    },

    parabolicStar: function([numPoints,numStepsPerLine]) {
      var v = numPoints;
      var n = numStepsPerLine;
      var p = 2 * Math.PI / v;

      for (var b = 0; b < 2 * Math.PI; b += p) {
        var g = b + p;
        for (var h = y/n; h <= y+1; h += y/n) {
          var t = y-h;
          var ptFrom = new ps.Point(x + t * Math.sin(b), y - t * Math.cos(b));
          var ptTo = new ps.Point(x + h * Math.sin(g), y - h * Math.cos(g));

          var line = ps.Path.Line(ptFrom,ptTo);
          drawing.addChild(line);
        }
      }
    },

    curvesInCircle: function([numSectors,numPointsPerSector]) {
      var v = numSectors;
      var n = numSectors * numPointsPerSector;
      var p = 2 * Math.PI / v;

      var circle = new ps.Path.Circle(new ps.Point(x,y),y);
      drawing.addChild(circle);

      for (var b = 0; b <= 2 * Math.PI; b += p) {
        for (var h = b; h <= p + b; h += 2 * Math.PI / n) {
          var t = y * (h - b) / p;

          var ptFrom = new ps.Point(x + t * Math.sin(b), y - t * Math.cos(b));
          var ptTo = new ps.Point(x + y * Math.sin(h), y - y * Math.cos(h));

          var line = new ps.Path.Line(ptFrom,ptTo);
          drawing.addChild(line);
        }
      }
    },

    eightParabolasInSquare: function([numSteps]) {
      var v = numSteps;

      for (var h = 0; h <= y+1; h += y/v) {
        for (var t = -1; t <= 1; t += 2) {
          for (var g = -1; g <= 1; g += 2) {
            for (var r = 0; r <= 1; r += 1) {
              var ptFrom = new ps.Point(x + h*t, y * (1 + g*r));
              var ptTo = new ps.Point(x + y*t*r, y * (1+g) - h*g);

              var line = new ps.Path.Line(ptFrom,ptTo);
              drawing.addChild(line);
            }
          }
        }
      }
    },

    ellipseFromInverse: function([width,height]) {
      var v = width;
      var n = height;

      for (var t = -v/2; t <= v/2; t += v) {
        var ptFrom = new ps.Point(x+t,0);
        var ptTo = new ps.Point(x+t,2*y);
        var line = new ps.Path.Line(ptFrom,ptTo);
        drawing.addChild(line);

        for (var h = -10; h <= 10; h += 1) {
          ptFrom = new ps.Point(x+t,y + n*h/20);
          if (h != 0) {
            ptTo = new ps.Point(x-t,y + 5*n/h);
            line = new ps.Path.Line(ptFrom,ptTo);
            drawing.addChild(line);
          }
        }
      }
    },
  }

  function update() {
    var designData = parent.data;

    drawing.remove();
    drawing = new ps.Group();

    if (parent.data.name) {
      drawFunctions[designData.name](designData.params);
    }

    drawing.style = {
      strokeColor: 'palevioletred',
      strokeWidth: 0.5
    };
  }

  update();

  return update;

}
