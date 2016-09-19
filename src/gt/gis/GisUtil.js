function getHeading(from, to)
{
   if (from.lat == to.lat && to.lat == to.lng) {
       return -0.00000001; // -0 so that we know something is wrong, but can still be used to calculation
   }

   let heading;
   let x1 = to.lng - from.lng;
   let y1 = to.lat - from.lat;
   const x2 = 0;
   const y2 = 1;
   const cos_value = (x1*x2 + y1*y2) / (Math.sqrt(x1*x1 + y1*y1) * (Math.sqrt(x2*x2 + y2*y2)));
   const delta_radian = Math.acos(cos_value);
   if (x1 > 0) {
       heading = delta_radian * 180.0 / Math.PI;
   }
   else {
       heading = 360.0 - delta_radian * 180.0 / Math.PI;
       if (heading >= 360.0) {
           heading -= 360.0;
       }
   }
   return heading;
}









function findRoadEnds(road)
{
    const points = road.path.reduce((results, values) => {
        results = results.concat(values);
        return results;
    }, []);

    const lngs = points.map(point => point.lng);
    const lats = points.map(point => point.lat);

    const variance_lng = lngs.reduce(statistic, { sum: 0, sum2: 0 }).variance;
    const variance_lat = lats.reduce(statistic, { sum: 0, sum2: 0 }).variance;
    console.log(variance_lng > variance_lat ? "--" : "|");
    let firstPoint, lastPoint;
    if (variance_lng > variance_lat)
    {
        firstPoint = findMax(points, "lng");
        lastPoint = findMin(points, "lng");
    }
    else
    {
        firstPoint = findMax(points, "lat");
        lastPoint = findMin(points, "lat");
    }
    return [ firstPoint, lastPoint ];
}

function findMax(points, field)
{
    let max = null;
    let maxValue = 0;
    points.forEach(point => {
        if (point[field] > maxValue || maxValue === null)
        {
            max = point;
            maxValue = point[field];
        }
    });
    return max;
}

function findMin(points, field)
{
    let min = null;
    let minValue = null;
    points.forEach(point => {
        if (point[field] < minValue || minValue === null)
        {
            min = point;
            minValue = point[field];
        }
    });
    return min;
}

function statistic(result, value, index, array)
{
    result.sum += value;
    result.sum2 += value * value;

    if (array.length - 1 === index)
    {
        const len = array.length;
        result.variance = result.sum2 / len - (result.sum / len) * (result.sum / len);
    }
    return result;
}

export default {
    findRoadEnds,
    getHeading
};
