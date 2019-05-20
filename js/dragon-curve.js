function paperSketch(parent) {

  var ps = parent.paperscope;

  var dragon;
  var position, direction;

  function makeDragon(order, length, squiggleStyle, color) {
    position = new ps.Point(200,300);
    direction = new ps.Point(1,0);
    if (dragon) dragon.remove();
    dragon = new ps.Path(position);
    dragon.strokeColor = color;
    direction = direction.rotate(order * 45);
    dragonCurveHelper(order, length, 1);
    if (squiggleStyle > 0) simplifyDragon();
    if (squiggleStyle > 1) dragon.smooth();
  }

  function dragonCurveHelper(order, length, sign) {
    if (order == 0) {
        position = position.add(direction.multiply(length));
        dragon.add(position);
    } else {
        var newLength = length / Math.sqrt(2);
        dragonCurveHelper(order-1,newLength,1);
        direction = direction.rotate(sign * -90);
        dragonCurveHelper(order-1,newLength,-1);
    }
  }

  function simplifyDragon() {
    var draggo = new ps.Path();
    draggo.strokeColor = dragon.strokeColor;
    draggo.strokeWidth = dragon.strokeWidth;

    draggo.add(dragon.firstSegment.point);

    for (var i = 1; i < dragon.segments.length; i++) {
      var prevPt = dragon.segments[i-1].point;
      var nextPt = dragon.segments[i].point;

      var midPt = prevPt.add(nextPt).divide(2);
      var handleIn = prevPt.add(midPt).divide(2).subtract(midPt);
      var handleOut = nextPt.add(midPt).divide(2).subtract(midPt);
      var seg = new ps.Segment(midPt,handleIn,handleOut);
      draggo.add(seg);
    }

    draggo.add(dragon.lastSegment.point);

    dragon.remove();
    dragon = draggo;
  }

  function update() {
    var order = parent.data.n;
    var length = parent.data.l;
    var squiggleStyle = parent.data.curvy;
    makeDragon(order,length,squiggleStyle,'mediumpurple');
  }

  update();

  return update;

}
