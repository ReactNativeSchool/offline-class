import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

const BASE_URL = "https://rns-offline-class.glitch.me";

export const geoFetch = async (path, options = {}) => {
  const url = `${BASE_URL}/api${path}`;
  const cacheKey = `CACHED_DATA::${url}`;
  const actionQueueKey = "CACHED_DATA::ACTION_QUEUE";

  try {
    const networkState = await NetInfo.fetch();

    if (!networkState.isConnected) {
      if (!options.method || options.method.toLowerCase() === "get") {
        const _cachedData = await AsyncStorage.getItem(cacheKey);
        if (!_cachedData) {
          throw new Error(
            "You're currently offline and no local data was found."
          );
        }

        // console.log("cachedData", _cachedData);
        const cachedData = JSON.parse(_cachedData);
        return cachedData.data;
      }

      if (
        options.method.toLowerCase() === "put" ||
        options.method.toLowerCase() === "post"
      ) {
        const _queueActions = await AsyncStorage.getItem(actionQueueKey);
        const queuedActions = _queueActions ? JSON.parse(_queueActions) : [];

        console.log("initial queuedActions", queuedActions);

        queuedActions.push({
          path,
          options,
        });

        await AsyncStorage.setItem(
          actionQueueKey,
          JSON.stringify(queuedActions)
        );

        const _queuedActions2 = await AsyncStorage.getItem(actionQueueKey);
        console.log("after queued actions", _queuedActions2);
      }
    }

    const res = await fetch(url, options);

    if (!res.ok) {
      throw new Error("Something went wrong... please try again.");
    }

    const data = await res.json();

    await AsyncStorage.setItem(
      cacheKey,
      JSON.stringify({
        data,
      })
    );
    const keys = await AsyncStorage.getAllKeys();
    console.log("keys", keys);

    return data;
  } catch (error) {
    console.log("geoFetch error", error);
    return Promise.reject(error);
  }
};
