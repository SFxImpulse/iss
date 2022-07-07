const request = require("request");

const fetchMyIP = (callback) => {
  request("https://api.ipify.org?format=json", (error, response, body) => {
    if (error) {
      return callback(error, null);
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      return callback(error(msg), null);
    }
    callback(null, JSON.parse(body).ip);
  });
};

const fetchCoordsByIP = (ip, callback) => {
  request("https://ipwho.is/", (error, response, body) => {
    if (error) {
      return callback(error, null);
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      return callback(error(msg), null);
    }
    const parsedError = JSON.parse(body);
    if (!parsedError.success) {
      const msg = `Success status was ${parsedError.success}. Server message says: ${parsedError.message} when fetching for IP ${parsedError.ip}`;
      callback(Error(msg), null);
      return;
    }
    const latitude = JSON.parse(body).latitude;
    const longitude = JSON.parse(body).longitude;
    callback(null, { latitude, longitude });
  });
};

const fetchISSFlyOverTimes = (coords, callback) => {
  request("https://iss-pass.herokuapp.com/json/?lat=45.5016889&lon=-73.567256", (error, response, body) => {
    if (error) {
      return callback(error, null);
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      return callback(error(msg), null);
    }
    const flyOverTimes = JSON.parse(body).response;
    callback(null, flyOverTimes);
  });
};

const nextISSTimesForMyLocation = callback => {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }
    fetchCoordsByIP(ip, (error, location) => {
      if (error) {
        return callback(error, null);
      }
      fetchISSFlyOverTimes(location, (error, coords) => {
        if (error) {
          return callback(error, null);
        }
        callback(null, coords);
      });
    });
  });
}

module.exports = { nextISSTimesForMyLocation };