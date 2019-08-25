const reader = new FileReader();
var Data = [];

function NewMatrixFromJSON(JsonString) {

    let JsonObject = JSON.parse(JsonString);
    let array = [];

    array = CreateEmptyMatrixFromJson(JSON.stringify(JsonObject));

    for (let i = 0; i < JsonObject.length; i++) {
        let currentRow;
        let currentColumn;

        currentRow = JsonObject[i]["Row"];
        currentColumn = JsonObject[i]["Column"];
        array[parseInt(currentRow) - 1][parseInt(currentColumn) - 1] = JsonObject[i]["Value"];
    }
    return array
}

function CreateEmptyMatrixFromJson(JsonString) {
    let JsonObject = JSON.parse(JsonString);
    let array = [];
    let maxRows = 0;
    let maxColumns = 0;
    //Get Maximum Rows and Columns

    for (let i = 0; i < JsonObject.length; i++) {

        currentRow = parseInt(JsonObject[i]["Row"]);
        currentColumn = parseInt(JsonObject[i]["Column"]);

        if (currentColumn > maxColumns) {
            maxColumns = currentColumn;
        }
        if (currentRow > maxRows) {
            maxRows = currentRow;
        }
    }
    array = NewMatrix(maxRows, maxColumns);
    return array;
}

function NewMatrix(Rows, Columns) {
    let array = new Array(Columns);
    for (let i = 0; i < Rows; i++) {
        array[i] = new Array(Rows);
    }
    return array;
}

function read(input) {
    const csv = input.files[0];
    reader.readAsText(csv);
}

reader.onload = function (e) {
    //	document.querySelector('.output').innerText = e.target.result;
}
reader.onloadend = function (e) {
    Data = StringToArray(reader.result, 1, "\n");
}

function StringToArray(result, StartingRow, Delimiter) {
    let input = result;
    let RowCounter = 0;
    let DataArray = [];
    let Delimiterindex = 0;
    let TempString = "";
    let StartRow = StartingRow;
    while (input != "") {
        Delimiterindex = input.indexOf(Delimiter);
        if (Delimiterindex >= 0) {
            if (RowCounter >= StartRow) {
                TempString = input.slice(0, Delimiterindex);
                DataArray[RowCounter] = new Array(2);
                DataArray[RowCounter][0] = TempString.slice(0, TempString.indexOf(";"));
                DataArray[RowCounter][1] = TempString.slice(TempString.indexOf(";") + 1);
                DataArray[RowCounter][1] = DataArray[RowCounter][1].replace(",", ".");
                RowCounter += 1;
            } else {
                StartRow -= 1;
            }
            input = input.slice(Delimiterindex + 1);
        } else {
            TempString = input;
            DataArray[RowCounter] = new Array(2);
            DataArray[RowCounter][0] = TempString.slice(0, TempString.indexOf(";"));
            DataArray[RowCounter][1] = TempString.slice(TempString.indexOf(";") + 1);
            DataArray[RowCounter][1] = DataArray[RowCounter][1].replace(",", ".");

            input = "";
        }
    }
    return DataArray;
}

function printChart() {
    let xValues = [];
    let yValues = [];
    let tempxValue = [];
    let MSEParameters = [];
    let MSExValues = [];
    let MSEyValues = [];
    let ExponentialSmoothing1 = [];
    let ExponentialSmoothing2 = [];
    for (let i = 0; i < Data.length; i++) {

        xValues[i] = Data[i][0];
        yValues[i] = parseFloat(Data[i][1]);
        tempxValue[i] = i;
    }

    MSEParameters = CalcMESCoefficients(tempxValue, yValues);

    for (let i = 0; i < yValues.length; i++) {
        if (i == 0) {
            MSEyValues[i] = MSEParameters[0];
        } else {
            MSEyValues[i] = MSEParameters[0] + MSEParameters[1] * tempxValue[i];
        }
    }
    ExponentialSmoothing1 = CalcDoubleExponentialSmoothing(tempxValue, yValues, 0.1);

    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: xValues,
            datasets: [{
                    data: yValues,
                    label: "Gewicht",
                    borderColor: "#3e95cd",
                    fill: false,
                    pointRadius: "3",
                    pointBackgroundColor: "#3e95cd"

                },
                {
                    data: MSEyValues,
                    label: "MSE",
                    borderColor: "#ff0000",
                    fill: false
                },
                {
                    data: ExponentialSmoothing1,
                    label: "Exponential Smoothing 1",
                    borderColor: "#00ff3c",
                    fill: false
                }
            ]
        },
        options: {
            elements: {
                line: {
                    tension: 0 // disables bezier curves
                }
            }
        }
    });

}