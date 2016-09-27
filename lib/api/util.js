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

function decodePolyline(str, precision) {
    var index = 0,
        lat = 0,
        lng = 0,
        coordinates = [],
        shift = 0,
        result = 0,
        byte = null,
        latitude_change,
        longitude_change,
        factor = Math.pow(10, precision || 6);

    // Coordinates have variable length when encoded, so just keep
    // track of whether we've hit the end of the string. In each
    // loop iteration, a single coordinate is decoded.
    while (index < str.length) {

        // Reset shift, result, and byte
        byte = null;
        shift = 0;
        result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

        shift = result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

        lat += latitude_change;
        lng += longitude_change;

        coordinates.push([lat / factor, lng / factor]);
    }

    return coordinates;
};

export default {
    getHeading,
    decodePolyline
};
