const BASE_URL = "https://rns-offline-class.glitch.me";

export const geoFetch = (path, options = {}) =>
  fetch(`${BASE_URL}/api${path}`, options)
    .then(res => {
      if (res.ok) {
        return res.json();
      }

      throw new Error("Something went wrong... please try again.");
    })
    .catch(error => {
      console.warn("ERROR: ", `${BASE_URL}/api${path}`, error);

      throw new Error(error);
    });
