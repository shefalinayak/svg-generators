function applyRule(c,lastPass) {
    if (c === 'X') {
        if (lastPass) {
            return 'FF+';
        } else {
            return 'F+[[X]-X]-F[-FX]+X';
        }
    } else if (c === 'F') {
        return 'FF';
    } else {
        return c;
    }
}

function processString(str,lastPass) {
    var currStr = str;
    var newStr = '';
    for (var i = 0; i < currStr.length; i++) {
        var c = currStr.charAt(i);
        newStr = newStr + applyRule(c,lastPass);
    }
    return newStr;
}

function createInstructions(order) {
    var start = 'X';
    var final = '';
    for (var i = 0; i < order; i++) {
        //final = processString(start,i===order-1);
        final = processString(start,false);
        start = final;
    }
    return final;
}


function paperSketch(parent) {

  var ps = parent.paperscope;

  var tree;

  var rect = new ps.Path.Rectangle(ps.project.view.bounds);
  rect.strokeColor = 'pink';
  rect.fillColor = 'whitesmoke';

  function drawLindenmayerSystem(order,length,color) {
      var system = new ps.Group();
      var instructions = createInstructions(order);

      var rng = new Math.seedrandom(parent.data.seed);

      var position = new ps.Point(parent.w / 2,parent.h - 50);
      var direction = new ps.Point(0,-1);
      var savedPositions = [];
      var savedDirections = [];
      var currPath = new ps.Path(position);
      system.addChild(currPath);
      for (var i = 0; i < instructions.length; i++) {
          var c = instructions.charAt(i);
          if (c === 'F') {
              var newPosition = position.add(direction.multiply(length));
              currPath.add(newPosition);
              position = newPosition;
          } else if (c === '-') {
              direction = direction.rotate(25);
          } else if (c === '+') {
              direction = direction.rotate(-25);
          } else if (c === '[') {
              savedPositions.push(position.clone());
              savedDirections.push(direction.clone());
          } else if (c === ']') {
              position = savedPositions.pop();
              direction = savedDirections.pop();
              currPath = new ps.Path(position);
              system.addChild(currPath);
          }
          var wiggle = parent.data.r;
          var theta = -wiggle + rng() * wiggle * 2;
          direction = direction.rotate(theta);
      }
      system.strokeColor = color;
      simplifyTree(system);
      return system;
  }

  function simplifyTree(system) {
      var numPathsOld = system.children.length;
      var totalSegmentsOld = 0;
      var numPathsNew = 0;
      var totalSegmentsNew = 0;
      var toRemove = [];
      for (var i = 0; i < numPathsOld; i++) {
          var path = system.children[i];
          var numSegs = path.segments.length;
          totalSegmentsOld += numSegs;
          if (numSegs === 1) {
              toRemove.push(path);
          } else {
              numPathsNew += 1;
              totalSegmentsNew += path.segments.length;
          }
      }
      for (var i = 0; i < toRemove.length; i++) {
          toRemove[i].remove();
      }
      // console.log("original:",numPathsOld,"paths",totalSegmentsOld,"segments");
      // console.log("simplified:",numPathsNew,"paths",totalSegmentsNew,"segments");
  }

  function update() {
    if (tree) {
      tree.remove();
    }
    var order = parent.data.n;
    var length = parent.data.l;
    tree = drawLindenmayerSystem(order,length,'palevioletred');
  }

  update();

  return update;

}
