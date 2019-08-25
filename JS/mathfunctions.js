function GetVariance(x) {
    let x_2 = [];
    for (let i = 0; i < x.length; i++) {
        x_2[i] = math.pow(x[i], 2);
    }
    return (math.mean(x_2) - math.pow(math.mean(x), 2));
}

function GetCoVariance(x, y) {
    let x_mean = 0;
    let y_mean = 0;
    let xy = [];

    for (let i = 0; i < x.length; i++) {
        xy[i] = x[i] * y[i];
    }
    return (math.mean(xy) - math.mean(x) * math.mean(y));
}

function CalcMESCoefficients(x, y) {
    let values = [];
    //y = a +bx
    values[1] = GetCoVariance(x, y) / GetVariance(x); //b
    values[0] = math.mean(y) - values[1] * math.mean(x); //a

    return values;
}

function CalcDoubleExponentialSmoothing(x, y, alpha) {
    let values_once = [];
    let values_twice = [];
    let values_forecast = [];
    let MSEValues = [];

    MSEValues = CalcMESCoefficients(x, y);

    for (let i = 0; i <= y.length; i++) {
        if (i == 0) {
            values_once[i] = MSEValues[0] - MSEValues[1] * ((1 - alpha) / alpha);
            values_twice[i] = MSEValues[0] - 2 * MSEValues[1] * ((1 - alpha) / alpha);
            values_forecast[i] = CalcExpSmoothingValue(MSEValues[0], MSEValues[1], 0);
        } else {
            values_once[i] = CalcExponentialSmoothingValue(y[i - 1], values_once[i - 1], alpha);
            values_twice[i] = CalcExponentialSmoothingValue(values_once[i], values_twice[i - 1], alpha);
            values_forecast[i] = 2 * values_once[i] - values_twice[i] + (alpha / (1 - alpha)) * (values_once[i] - values_twice[i]);
        }
    }
    return values_forecast;
}

function CalcExponentialSmoothingValue(currentvalue, lastforecastvalue, alpha) {
    return (parseFloat(lastforecastvalue) + parseFloat(alpha) * (parseFloat(currentvalue) - parseFloat(lastforecastvalue)));
}

function CalcExpSmoothingValue(a, b, x) {
    return (parseFloat(b) * parseFloat(x) + parseFloat(a));
}