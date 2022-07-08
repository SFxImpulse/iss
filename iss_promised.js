const request = require('request-promise-native');

const fetchMyIP = () => {
  return request("https://api.ipify.org?format=json");
};

const fetchCoordsByIP = (body) => {
  return request(`https://ipwho.is/`);
};

const fetchISSFlyOverTimes = (body) => {
  const url = `http://api.open-notify.org/iss-pass.json?lat=45.5016889&lon=-73.567256`;
  return request(url);
};

const nextISSTimesForMyLocation = () => {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then((data) => {
      const { response } = JSON.parse(data);
      return response;
    });
};

module.exports = { nextISSTimesForMyLocation };