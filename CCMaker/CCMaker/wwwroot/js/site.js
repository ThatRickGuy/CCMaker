var drag = d3.behavior.drag()
    .on("drag", function (d, i) {
        d.x += d3.event.dx
        d.y += d3.event.dy
        d3.select(this).attr("transform", function (d, i) {
            return "translate(" + [d.x, d.y] + ")"
        })
    });

function CreateSquare(parent, currentXOffset, currentYOffset) {
    var square = parent.append("svg:rect")
        .attr("x", currentXOffset)
        .attr("y", currentYOffset)
        .attr("width", 20)
        .attr("height", 20)
        .attr("rx", 3)
        .attr("ry", 3)
        .attr("stroke", "black")
        .attr("fill", "white");
}

function CreateCircle(parent, currentXOffset, currentYOffset) {
    var square = parent.append("svg:rect")
        .attr("x", currentXOffset)
        .attr("y", currentYOffset)
        .attr("width", 20)
        .attr("height", 20)
        .attr("rx", 10)
        .attr("ry", 10)
        .attr("stroke", "black")
        .attr("fill", "white");
}

function AddLetter(parent, currentXOffset, currentYOffset, Letter) {
    var text = parent.append("svg:text")
        .attr("x", currentXOffset + 5)
        .attr("y", currentYOffset + 14)
        .attr("fill", "black")
        .text(Letter);
}

function model_factory(data) {
    //data format
    //{ Name: "Kodiak 10/20", Type: "S", Boxes: "000000\n000000\n000000\n0L00R0\nLLMCRR\n.MMCC."}
    console.log(data.Name);
    console.log("get text size");
    var svg = document.getElementById("svg");
    var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('fill', 'black');
    text.setAttribute("id", "textsize");
    text.textContent = data.Name;
    svg.appendChild(text);
    var textwidth = text.getComputedTextLength();
    d3.select("svg").empty();


    var plate = d3.select("#svg")
        .append("svg:g")
        .data([{ "x": 0, "y": 0 }])
        .attr("transform", "translate(" + 0 + "," + 0 + ")")
        .attr("class", data.Name)
        .call(drag);
    //


    console.log("parse data");
    var lines = data.Boxes.split('\n');
    var LongestLine = 0
    lines.forEach(function (current_value) {
        if (current_value.length > LongestLine)
            LongestLine = current_value.length;
    });


    console.log("create border");
    var border = plate.append("svg:rect")
        .attr("x", 2)
        .attr("y", 9)
        .attr("width", LongestLine * 23 + 3)
        .attr("height", lines.length * 23 + 7)
        .attr("rx", 3)
        .attr("ry", 3)
        .attr("stroke", "black")
        .attr("fill", "white");

    console.log("create border break")
    var boarderbreak = plate.append("svg:rect")
        .attr("x", (5 + LongestLine * 23 + 5 - textwidth) / 2 - 3)
        .attr("y", 8)
        .attr("width", textwidth + 6)
        .attr("height", 3)
        .attr("stroke", "white")
        .attr("fill", "white");

    console.log("Add Title");
    var text = plate.append("svg:text")
        .attr("y", 11)
        .attr("x", (5 + LongestLine * 23 + 5 - textwidth) / 2)
        .attr("fill", "black")
        .text(data.Name);


    var InitialXOffset = 5;
    var currentXOffset = 5;
    var currentYOffset = 16;

    for (var i = 0; i < data.Boxes.length; i++) {
        switch (data.Boxes.charAt(i)) {
            case '0':
                if (data.Type == "S")
                    CreateSquare(plate, currentXOffset, currentYOffset);
                if (data.Type == "C")
                    CreateCircle(plate, currentXOffset, currentYOffset);
                currentXOffset += 23;
                break;
            case 'L':
                if (data.Type == "S")
                    CreateSquare(plate, currentXOffset, currentYOffset);
                if (data.Type == "C")
                    CreateCircle(plate, currentXOffset, currentYOffset);
                AddLetter(plate, currentXOffset, currentYOffset, 'L');
                currentXOffset += 23;
                break;
            case 'R':
                if (data.Type == "S")
                    CreateSquare(plate, currentXOffset, currentYOffset);
                if (data.Type == "C")
                    CreateCircle(plate, currentXOffset, currentYOffset);
                AddLetter(plate, currentXOffset, currentYOffset, 'R');
                currentXOffset += 23;
                break;
            case 'M':
                if (data.Type == "S")
                    CreateSquare(plate, currentXOffset, currentYOffset);
                if (data.Type == "C")
                    CreateCircle(plate, currentXOffset, currentYOffset);
                AddLetter(plate, currentXOffset, currentYOffset, 'M');
                currentXOffset += 23;
                break;
            case 'C':
                if (data.Type == "S")
                    CreateSquare(plate, currentXOffset, currentYOffset);
                if (data.Type == "C")
                    CreateCircle(plate, currentXOffset, currentYOffset);
                AddLetter(plate, currentXOffset, currentYOffset, 'C');
                currentXOffset += 23;
                break;
            case 'H':
                if (data.Type == "S")
                    CreateSquare(plate, currentXOffset, currentYOffset);
                if (data.Type == "C")
                    CreateCircle(plate, currentXOffset, currentYOffset);
                AddLetter(plate, currentXOffset, currentYOffset, 'H');
                currentXOffset += 23;
                break;
            case 'A':
                if (data.Type == "S")
                    CreateSquare(plate, currentXOffset, currentYOffset);
                if (data.Type == "C")
                    CreateCircle(plate, currentXOffset, currentYOffset);
                AddLetter(plate, currentXOffset, currentYOffset, 'A');
                currentXOffset += 23;
                break;
            case 'W':
                if (data.Type == "S")
                    CreateSquare(plate, currentXOffset, currentYOffset);
                if (data.Type == "C")
                    CreateCircle(plate, currentXOffset, currentYOffset);
                AddLetter(plate, currentXOffset, currentYOffset, 'W');
                currentXOffset += 23;
                break;
            case 'S':
                if (data.Type == "S")
                    CreateSquare(plate, currentXOffset, currentYOffset);
                if (data.Type == "C")
                    CreateCircle(plate, currentXOffset, currentYOffset);
                AddLetter(plate, currentXOffset, currentYOffset, 'S');
                currentXOffset += 23;
                break;
            case '1':
                AddLetter(plate, currentXOffset, currentYOffset, 'A');
                currentXOffset += 23;
                break;
            case '2':
                AddLetter(plate, currentXOffset, currentYOffset, 'B');
                currentXOffset += 23;
                break;
            case '3':
                AddLetter(plate, currentXOffset, currentYOffset, 'C');
                currentXOffset += 23;
                break;
            case '4':
                AddLetter(plate, currentXOffset, currentYOffset, 'D');
                currentXOffset += 23;
                break;
            case '5':
                AddLetter(plate, currentXOffset, currentYOffset, 'E');
                currentXOffset += 23;
                break;
            case '6':
                AddLetter(plate, currentXOffset, currentYOffset, 'F');
                currentXOffset += 23;
                break;
            case '7':
                AddLetter(plate, currentXOffset, currentYOffset, 'G');
                currentXOffset += 23;
                break;
            case '8':
                AddLetter(plate, currentXOffset, currentYOffset, 'H');
                currentXOffset += 23;
                break;
            case '9':
                AddLetter(plate, currentXOffset, currentYOffset, 'I');
                currentXOffset += 23;
                break;
            case '*':
                AddLetter(plate, currentXOffset, currentYOffset, 'U');
                currentXOffset += 23;
                break;
            case 'W':
                AddLetter(plate, currentXOffset, currentYOffset, 'W');
                currentXOffset += 23;
                break;
            case '.':
                currentXOffset += 23;
                break;
            case '>':
                currentXOffset += 12.5;
                break;
            case '^':
                currentYOffset -= 12.5;
                break;
            case '-':
                currentYOffset += 12.5;
                break;
            case '\n':
                currentYOffset += 23;
                currentXOffset = InitialXOffset;
                break;

        }
    }


}