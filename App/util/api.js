import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

const BASE_URL = "https://rns-offline-class.glitch.me";
const actionQueueKey = "CACHED_DATA::ACTION_QUEUE";

export const geoFetch = async (path, options = {}, optimisticResponse = {}) => {
  const url = `${BASE_URL}/api${path}`;
  const cacheKey = `CACHED_DATA::${url}`;

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
        let queuedActions = _queueActions ? JSON.parse(_queueActions) : [];

        console.log("initial queuedActions", queuedActions);

        queuedActions.push({
          path,
          options,
        });

        const data = {};
        queuedActions.forEach((action) => {
          data[action.path] = action.options;
        });
        queuedActions = Object.keys(data).map((key) => {
          return {
            path: key,
            options: data[key],
          };
        });

        await AsyncStorage.setItem(
          actionQueueKey,
          JSON.stringify(queuedActions)
        );

        const _queuedActions2 = await AsyncStorage.getItem(actionQueueKey);
        console.log("after queued actions", _queuedActions2);

        return optimisticResponse;
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

const runRequests = async (actions) => {
  const succeeded = [];
  const failed = [];

  for (let index = 0; index < actions.length; index += 1) {
    const req = actions[index];
    try {
      const response = await geoFetch(req.path, req.options);
      succeeded.push(response);
    } catch (error) {
      failed.push(req);
    }
  }

  return {
    succeeded,
    failed,
  };
};

export const reconcileActions = async () => {
  const networkState = await NetInfo.fetch();

  if (!networkState.isConnected) {
    return false;
  }

  try {
    const _queueActions = await AsyncStorage.getItem(actionQueueKey);
    const queuedActions = _queueActions ? JSON.parse(_queueActions) : [];
    const { failed } = await runRequests(queuedActions);

    await AsyncStorage.setItem(actionQueueKey, JSON.stringify(failed));

    const _queueActions2 = await AsyncStorage.getItem(actionQueueKey);
    console.log("que", _queueActions2);
    return true;
  } catch (error) {
    console.log("reconcileActions error", error);
    return false;
  }
};
