// JavaScript source code
document.onkeydown = checkKey;

function checkKey(e) {
    var target;
    if (selected.MySVGParentID != "svg") {
        target = d3.select("#" + selected.MySVGParentID)[0][0];
    } else {
        target = d3.select("#" + selected.UID)[0][0];
    }
    e = e || window.event;

    if (e.keyCode == '38') {
        // up arrow
        e.preventDefault();

        // Getting
        var xforms = target.transform.baseVal; // An SVGTransformList
        var firstXForm = xforms.getItem(0);       // An SVGTransform
        if (firstXForm.type == SVGTransform.SVG_TRANSFORM_TRANSLATE) {
            var firstX = firstXForm.matrix.e,
                firstY = firstXForm.matrix.f;

            // Setting
            target.transform.baseVal.getItem(0).setTranslate(firstX, firstY - 1);
        }
    }
    else if (e.keyCode == '40') {
        // down arrow
        e.preventDefault();

        // Getting
        var xforms = target.transform.baseVal; // An SVGTransformList
        var firstXForm = xforms.getItem(0);       // An SVGTransform
        if (firstXForm.type == SVGTransform.SVG_TRANSFORM_TRANSLATE) {
            var firstX = firstXForm.matrix.e,
                firstY = firstXForm.matrix.f;

            // Setting
            target.transform.baseVal.getItem(0).setTranslate(firstX, firstY + 1);
        }
    }
    else if (e.keyCode == '37') {
        // left arrow
        e.preventDefault();

        // Getting
        var xforms = target.transform.baseVal; // An SVGTransformList
        var firstXForm = xforms.getItem(0);       // An SVGTransform
        if (firstXForm.type == SVGTransform.SVG_TRANSFORM_TRANSLATE) {
            var firstX = firstXForm.matrix.e,
                firstY = firstXForm.matrix.f;

            // Setting
            target.transform.baseVal.getItem(0).setTranslate(firstX - 1, firstY);
        }
    }
    else if (e.keyCode == '39') {
        // right arrow
        e.preventDefault();

        // Getting
        var xforms = target.transform.baseVal; // An SVGTransformList
        var firstXForm = xforms.getItem(0);       // An SVGTransform
        if (firstXForm.type == SVGTransform.SVG_TRANSFORM_TRANSLATE) {
            var firstX = firstXForm.matrix.e,
                firstY = firstXForm.matrix.f;

            // Setting
            target.transform.baseVal.getItem(0).setTranslate(firstX + 1, firstY);
        }
    }
}




var drag = d3.behavior.drag()
    .on("drag", function (d, i) {
        GridClicked(d);
        d.x += d3.event.dx
        d.y += d3.event.dy
        d3.select(this).attr("transform", function (d, i) {
            return "translate(" + [d.x, d.y] + ")"
        })
    });