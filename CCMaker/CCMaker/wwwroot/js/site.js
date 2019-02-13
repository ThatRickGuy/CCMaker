var selected;
var selectedParent;
var UID = 0;


var drag = d3.behavior.drag()
    .on("drag", function (d, i) {
        GridClicked(d);
        d.x += d3.event.dx
        d.y += d3.event.dy
        d3.select(this).attr("transform", function (d, i) {
            return "translate(" + [d.x, d.y] + ")"
        })
    });

function CreateSquare(parent, currentxOffset, currentYOffset) {
    var square = parent.append("svg:rect")
        .attr("x", currentxOffset)
        .attr("y", currentYOffset)
        .attr("width", 20)
        .attr("height", 20)
        .attr("rx", 3)
        .attr("ry", 3)
        .attr("stroke", "black")
        .attr("fill", "white");
}

function CreateCircle(parent, currentxOffset, currentYOffset) {
    var square = parent.append("svg:rect")
        .attr("x", currentxOffset)
        .attr("y", currentYOffset)
        .attr("width", 20)
        .attr("height", 20)
        .attr("rx", 10)
        .attr("ry", 10)
        .attr("stroke", "black")
        .attr("fill", "white");
}

function AddLetter(parent, currentxOffset, currentYOffset, Letter) {
    var text = parent.append("svg:text")
        .attr("x", currentxOffset + 5)
        .attr("y", currentYOffset + 14)
        .attr("fill", "black")
        .text(Letter);
}

function GridClicked(d) {
    if (d.model != null) {
        selected = d;
        $('#ModelOptions').collapse("show");
        $('#txtDisplayName').val(d.model.DisplayName);
        $('#cboBoxFormat').empty();
        $.each(d.model.BoxFormats, function (i, item) {
            $('#cboBoxFormat').append($('<option>', {
                value: item.Boxes,
                text: item.Name
            }));
        });
    } else {
        selectedParent = d;
        console.log(selectedParent.models);
    }
}



function SVGModelChanges() {
    $('#ModelOptions').collapse("hide");
    if (selected.MySVGParent != null && selected.MySVGParent != d3.select("#svg")) {
        //this is a model group
        var data = selectedParent.models;
        selected.model.DisplayName = $('#txtDisplayName').val();
        selected.model.SelectedBoxFormat = $('#cboBoxFormat').val();
        if ($('#txtBoxFormat').val() !== '') selected.model.SelectedBoxFormat = $('#txtBoxFormat').val();

        modelGroup_factory(data, 50);

        d3.select('#' + selectedParent.UID).remove();
    } else {
        // this is a single model
        var data = selected.model;
        data.DisplayName = $('#txtDisplayName').val();
        data.SelectedBoxFormat = $('#cboBoxFormat').val();
        if ($('#txtBoxFormat').val() !== '') data.SelectedBoxFormat = $('#txtBoxFormat').val();
        d3.select('#' + selected.UID).remove();

        model_factory(data, data.X, 50, d3.select("#svg"), true, null, true)
    }
}


function SVGModelRemove() {
    $('#ModelOptions').collapse("hide");
    d3.select('#' + selected.UID).remove();
}


function modelGroup_factory(data, xOffset) {
    UID += 1;

    var svg = document.getElementById("svg");
    var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('fill', 'black');
    text.setAttribute("id", "textsize");

    //get the widest title
    var WidestTitle = 0;
    var FirstTitle = 0;
    for (var i = 0; i < data.length; i++) {
        text.textContent = data[i].DisplayName;
        svg.appendChild(text);
        var textwidth = text.getComputedTextLength() + 5;
        d3.select("svg").empty();
        if (textwidth > WidestTitle) {
            WidestTitle = textwidth;
        }
        if (FirstTitle == 0) {
            FirstTitle = textwidth;
        }
    }


    var lines = [];
    var LongestLine = WidestTitle;
    var LinesHeight = .25;
    for (var i = 0; i < data.length; i++) {
        LinesHeight++;
        var Boxes;
        if (data[i].SingleWound) {
            Boxes = "";
        } else {
            if (data[i].SelectedBoxFormat == null) {
                lines = data[i].BoxFormats[0].Boxes.split('\n');
                Boxes = data[i].BoxFormats[0].Boxes;
            } else {
                lines = data[i].SelectedBoxFormat.split('\n');
                Boxes = data[i].SelectedBoxFormat;
            }
        }
        lines.forEach(function (current_value) {
            var linewidth = 0;
            for (var i = 0; i < current_value.length; i++) {
                if (current_value[i] == "-" || current_value[i] == "\n" || current_value[i] == "^") {
                    //do nothing, these do not add to width
                }
                else if (current_value[i] == ">") {
                    linewidth += .55;
                }
                else {
                    linewidth += 1;
                }
            }
            linewidth = linewidth * 23 + 3;
            if (linewidth > LongestLine)
                LongestLine = linewidth;

            if (current_value.indexOf("-") >= 0 && current_value.indexOf("^") == -1) {
                LinesHeight += .55;
            }
            if (current_value != "") LinesHeight++;

        });
    }


    var plate = d3.select("#svg")
        .append("svg:g")
        .data([{ "x": xOffset, "y": 0, "models": data, "UID": "grid" + UID }])
        .attr("transform", "translate(" + xOffset + "," + 0 + ")")
        .attr("class", "Model")
        .attr("id", "grid" + UID)
        .call(drag);

    var border = plate.append("svg:rect")
        .attr("x", 2)
        .attr("y", 9)
        .attr("width", LongestLine )
        .attr("height", (LinesHeight-1) * 23 + 7)
        .attr("rx", 3)
        .attr("ry", 3)
        .attr("stroke", "black")
        .attr("fill", "white");

    var yOffset = 0;
    for (var i = 0; i < data.length; i++) {
        var newplate = model_factory(data[i], 0, yOffset, plate, false, LongestLine, false);
        yOffset += newplate.height +9;
    }
}

function model_factory(data, xOffset, yOffset, d3Parent, includeDrag, width, includeBorder) {
    //data format
    /*
        "Faction": "Khador",
        "CCName": "Butcher 1",
        "DisplayName": "Butcher 14/18",
        "Type": "S",
        "BoxFormats": [
            {
            "Name": "Horizontal",
            "Boxes": "00000>00000>00000>00000"
            },
            {
            "Name": "Horizontal Max 15",
            "Boxes": "00000>00000>00000\n.....>.....>00000"
            },
            {
            "Name": "Horizontal Max 10",
            "Boxes": "00000>00000\n00000>00000"
            }
        ]
     */
    UID += 1;
    var svg = document.getElementById("svg");
    var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('fill', 'black');
    text.setAttribute("id", "textsize");
    text.textContent = data.DisplayName;
    svg.appendChild(text);
    var textwidth = text.getComputedTextLength();
    d3.select("svg").empty();

    var plate;
    if (includeDrag) {
        plate = d3Parent
            .append("svg:g")
            .data([{ "x": xOffset, "y": yOffset, "model": data, "UID": "grid" + UID }])
            .attr("transform", "translate(" + xOffset + "," + yOffset + ")")
            .attr("class", "Model")
            .attr("id", "grid" + UID)
            .call(drag)
            .on("click", function (d) { GridClicked(d); });
    } else {
        plate = d3Parent
            .append("svg:g")
            .data([{ "x": xOffset, "y": yOffset, "model": data, "UID": "grid" + UID, "MySVGParent": d3Parent}])
            .attr("transform", "translate(" + xOffset + "," + yOffset + ")")
            .attr("class", "Model")
            .attr("id", "grid" + UID)
            .on("click", function (d) { GridClicked(d); });
    }

    var lines = [];
    var LongestLine = (textwidth + 10) / 23;
    var LinesHeight = .25;
    if (data.SingleWound != true) {
        var Boxes;
        if (data.SingleWound) {
            Boxes = "";
        } else {
            if (data.SelectedBoxFormat == null) {
                lines = data.BoxFormats[0].Boxes.split('\n');
                Boxes = data.BoxFormats[0].Boxes;
            } else {
                lines = data.SelectedBoxFormat.split('\n');
                Boxes = data.SelectedBoxFormat;
            }
        }

        lines.forEach(function (current_value) {
            var linewidth = 0;
            for (var i = 0; i < current_value.length; i++) {
                if (current_value[i] == "-" || current_value[i] == "\n" || current_value[i] == "^") {
                    //do nothing, these do not add to width
                }
                else if (current_value[i] == ">") {
                    linewidth += .55;
                }
                else {
                    linewidth += 1;
                }
            }
            if (linewidth > LongestLine)
                LongestLine = linewidth;
        });
        for (var i = 0; i < lines.length; i++) {
            if (lines[i].indexOf("-") >= 0 && lines[i].indexOf("^") == -1) {
                LinesHeight += .55;
            }
            if (lines[i] != "") LinesHeight++;
        }
    }

    if (width == null) {
        width = LongestLine * 23 + 3;
    }

    if (includeBorder) {
        console.log("create border");
        var border = plate.append("svg:rect")
            .attr("x", 2)
            .attr("y", 9)
            .attr("width", width)
            .attr("height", LinesHeight * 23 + 7)
            .attr("rx", 3)
            .attr("ry", 3)
            .attr("stroke", "black")
            .attr("fill", "white");
    }

    plate.height = lines.length * 23 + 7 + 9;

    console.log("create border break")
    var boarderbreak = plate.append("svg:rect")
        .attr("x", (width - textwidth) / 2 - 3)
        .attr("y", 8)
        .attr("width", textwidth + 6)
        .attr("height", 3)
        .attr("stroke", "white")
        .attr("fill", "white");

    console.log("Add Title");
    text = plate.append("svg:text")
        .attr("y", 11)
        .attr("x", (width - textwidth) / 2)
        .attr("fill", "black")
        .text(data.DisplayName);


    var InitialxOffset = 5;
    var currentxOffset = 5;
    var currentYOffset = 16;

    if (data.SingleWound != true) {
        for (var i = 0; i < Boxes.length; i++) {
            switch (Boxes.charAt(i)) {
                case '0':
                    if (data.Type == "S")
                        CreateSquare(plate, currentxOffset, currentYOffset);
                    if (data.Type == "C")
                        CreateCircle(plate, currentxOffset, currentYOffset);
                    currentxOffset += 23;
                    break;
                case 'l':
                    if (data.Type == "S")
                        CreateSquare(plate, currentxOffset, currentYOffset);
                    if (data.Type == "C")
                        CreateCircle(plate, currentxOffset, currentYOffset);
                    AddLetter(plate, currentxOffset, currentYOffset, 'L');
                    currentxOffset += 23;
                    break;
                case 'r':
                    if (data.Type == "S")
                        CreateSquare(plate, currentxOffset, currentYOffset);
                    if (data.Type == "C")
                        CreateCircle(plate, currentxOffset, currentYOffset);
                    AddLetter(plate, currentxOffset, currentYOffset, 'R');
                    currentxOffset += 23;
                    break;
                case 'm':
                    if (data.Type == "S")
                        CreateSquare(plate, currentxOffset, currentYOffset);
                    if (data.Type == "C")
                        CreateCircle(plate, currentxOffset, currentYOffset);
                    AddLetter(plate, currentxOffset, currentYOffset, 'M');
                    currentxOffset += 23;
                    break;
                case 'c':
                    if (data.Type == "S")
                        CreateSquare(plate, currentxOffset, currentYOffset);
                    if (data.Type == "C")
                        CreateCircle(plate, currentxOffset, currentYOffset);
                    AddLetter(plate, currentxOffset, currentYOffset, 'C');
                    currentxOffset += 23;
                    break;
                case 'h':
                    if (data.Type == "S")
                        CreateSquare(plate, currentxOffset, currentYOffset);
                    if (data.Type == "C")
                        CreateCircle(plate, currentxOffset, currentYOffset);
                    AddLetter(plate, currentxOffset, currentYOffset, 'H');
                    currentxOffset += 23;
                    break;
                case 'a':
                    if (data.Type == "S")
                        CreateSquare(plate, currentxOffset, currentYOffset);
                    if (data.Type == "C")
                        CreateCircle(plate, currentxOffset, currentYOffset);
                    AddLetter(plate, currentxOffset, currentYOffset, 'A');
                    currentxOffset += 23;
                    break;
                case 'w':
                    if (data.Type == "S")
                        CreateSquare(plate, currentxOffset, currentYOffset);
                    if (data.Type == "C")
                        CreateCircle(plate, currentxOffset, currentYOffset);
                    AddLetter(plate, currentxOffset, currentYOffset, 'W');
                    currentxOffset += 23;
                    break;
                case 's':
                    if (data.Type == "S")
                        CreateSquare(plate, currentxOffset, currentYOffset);
                    if (data.Type == "C")
                        CreateCircle(plate, currentxOffset, currentYOffset);
                    AddLetter(plate, currentxOffset, currentYOffset, 'S');
                    currentxOffset += 23;
                    break;
                case 'g':
                    if (data.Type == "S")
                        CreateSquare(plate, currentxOffset, currentYOffset);
                    if (data.Type == "C")
                        CreateCircle(plate, currentxOffset, currentYOffset);
                    AddLetter(plate, currentxOffset, currentYOffset, 'G');
                    currentxOffset += 23;
                    break;
                case 'b':
                    if (data.Type == "S")
                        CreateSquare(plate, currentxOffset, currentYOffset);
                    if (data.Type == "C")
                        CreateCircle(plate, currentxOffset, currentYOffset);
                    AddLetter(plate, currentxOffset, currentYOffset, 'B');
                    currentxOffset += 23;
                    break;
                case 'i':
                    if (data.Type == "S")
                        CreateSquare(plate, currentxOffset, currentYOffset);
                    if (data.Type == "C")
                        CreateCircle(plate, currentxOffset, currentYOffset);
                    AddLetter(plate, currentxOffset, currentYOffset, 'I');
                    currentxOffset += 23;
                    break;
                case 'L':
                    AddLetter(plate, currentxOffset, currentYOffset, 'L');
                    currentxOffset += 23;
                    break;
                case 'R':
                    AddLetter(plate, currentxOffset, currentYOffset, 'R');
                    currentxOffset += 23;
                    break;
                case 'A':
                    AddLetter(plate, currentxOffset, currentYOffset, 'A');
                    currentxOffset += 23;
                    break;
                case 'B':
                    AddLetter(plate, currentxOffset, currentYOffset, 'B');
                    currentxOffset += 23;
                    break;
                case 'C':
                    AddLetter(plate, currentxOffset, currentYOffset, 'C');
                    currentxOffset += 23;
                    break;
                case 'D':
                    AddLetter(plate, currentxOffset, currentYOffset, 'D');
                    currentxOffset += 23;
                    break;
                case 'E':
                    AddLetter(plate, currentxOffset, currentYOffset, 'E');
                    currentxOffset += 23;
                    break;
                case 'F':
                    AddLetter(plate, currentxOffset, currentYOffset, 'F');
                    currentxOffset += 23;
                    break;
                case 'G':
                    AddLetter(plate, currentxOffset, currentYOffset, 'G');
                    currentxOffset += 23;
                    break;
                case 'H':
                    AddLetter(plate, currentxOffset, currentYOffset, 'H');
                    currentxOffset += 23;
                    break;
                case 'I':
                    AddLetter(plate, currentxOffset, currentYOffset, 'I');
                    currentxOffset += 23;
                    break;
                case '*':
                    AddLetter(plate, currentxOffset, currentYOffset, 'U');
                    currentxOffset += 23;
                    break;
                case 'W':
                    AddLetter(plate, currentxOffset, currentYOffset, 'W');
                    currentxOffset += 23;
                    break;
                case '1':
                    AddLetter(plate, currentxOffset, currentYOffset, '1');
                    currentxOffset += 23;
                    break;
                case '2':
                    AddLetter(plate, currentxOffset, currentYOffset, '2');
                    currentxOffset += 23;
                    break;
                case '3':
                    AddLetter(plate, currentxOffset, currentYOffset, '3');
                    currentxOffset += 23;
                    break;
                case '4':
                    AddLetter(plate, currentxOffset, currentYOffset, '4');
                    currentxOffset += 23;
                    break;
                case '5':
                    AddLetter(plate, currentxOffset, currentYOffset, '5');
                    currentxOffset += 23;
                    break;
                case '6':
                    AddLetter(plate, currentxOffset, currentYOffset, '6');
                    currentxOffset += 23;
                    break;
                case '.':
                    currentxOffset += 23;
                    break;
                case '>':
                    currentxOffset += 12.5;
                    break;
                case '^':
                    currentYOffset -= 12.5;
                    break;
                case '-':
                    currentYOffset += 12.5;
                    break;
                case '\n':
                    currentYOffset += 23;
                    currentxOffset = InitialxOffset;
                    break;
            }
        }
    }

    return plate;
}

var exportSVG = function (svg) {
    document.getElementById('SaveLink').innerHTML = "";
    // first create a clone of our svg node so we don't mess the original one
    var clone = svg.cloneNode(true);
    // parse the styles
    parseStyles(clone);

    // create a doctype
    var svgDocType = document.implementation.createDocumentType('svg', "-//W3C//DTD SVG 1.1//EN", "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd");
    // a fresh svg document
    var svgDoc = document.implementation.createDocument('http://www.w3.org/2000/svg', 'svg', svgDocType);
    // replace the documentElement with our clone 
    svgDoc.replaceChild(clone, svgDoc.documentElement);
    // get the data
    var svgData = (new XMLSerializer()).serializeToString(svgDoc);

    // now you've got your svg data, the following will depend on how you want to download it
    // e.g yo could make a Blob of it for FileSaver.js
    /*
    var blob = new Blob([svgData.replace(/></g, '>\n\r<')]);
    saveAs(blob, 'myAwesomeSVG.svg');
    */
    // here I'll just make a simple a with download attribute

    var a = document.createElement('a');
    a.href = 'data:image/svg+xml; charset=utf8, ' + encodeURIComponent(svgData.replace(/></g, '>\n\r<'));
    a.download = 'myAwesomeSVG.svg';
    a.innerHTML = 'Download SVG';
    document.getElementById('SaveLink').appendChild(a);
    var s = document.createElement('span');
    var d = new Date();
    s.innerHTML = ' Rendered at ' + d.getHours() + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds());
    document.getElementById('SaveLink').appendChild(s);

};

function pad(num) {
    var s = "00" + num;
    return s.substr(s.length - 2);
}

var parseStyles = function (svg) {
    var styleSheets = [];
    var i;
    // get the stylesheets of the document (ownerDocument in case svg is in <iframe> or <object>)
    var docStyles = svg.ownerDocument.styleSheets;

    // transform the live StyleSheetList to an array to avoid endless loop
    for (i = 0; i < docStyles.length; i++) {
        styleSheets.push(docStyles[i]);
    }

    if (!styleSheets.length) {
        return;
    }

    var defs = svg.querySelector('defs') || document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    if (!defs.parentNode) {
        svg.insertBefore(defs, svg.firstElementChild);
    }
    svg.matches = svg.matches || svg.webkitMatchesSelector || svg.mozMatchesSelector || svg.msMatchesSelector || svg.oMatchesSelector;


    // iterate through all document's stylesheets
    for (i = 0; i < styleSheets.length; i++) {
        var currentStyle = styleSheets[i]

        var rules;
        try {
            rules = currentStyle.cssRules;
        } catch (e) {
            continue;
        }
        // create a new style element
        var style = document.createElement('style');
        // some stylesheets can't be accessed and will throw a security error
        var l = rules && rules.length;
        // iterate through each cssRules of this stylesheet
        for (var j = 0; j < l; j++) {
            // get the selector of this cssRules
            var selector = rules[j].selectorText;
            // probably an external stylesheet we can't access
            if (!selector) {
                continue;
            }

            // is it our svg node or one of its children ?
            if ((svg.matches && svg.matches(selector)) || svg.querySelector(selector)) {

                var cssText = rules[j].cssText;
                // append it to our <style> node
                style.innerHTML += cssText + '\n';
            }
        }
        // if we got some rules
        if (style.innerHTML) {
            // append the style node to the clone's defs
            defs.appendChild(style);
        }
    }

};
