import Constants from "./Constants";

const fetchMe = (payload) => {
  const url = `${Constants.SERVER_ADDR}/me?token=${payload.loginToken}`;

  return fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then(async (me) => {
      return me;
    })
    .catch((error) => {
      console.log(error, url);
    });
};

const fetchTribe = (payload) => {
  const url = `${Constants.SERVER_ADDR}/meTribe?loginToken=${payload.loginToken}&slug=${payload.slug}`;

  return fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then(async (tribe) => {
      return tribe;
    })
    .catch((error) => {
      console.log(error, url);
    });
};

const fetchFranchise = (payload) => {
  const url = `${Constants.SERVER_ADDR}/franchise?slug=${payload.slug}`;

  return fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then(async (franchise) => {
      return franchise;
    })
    .catch((error) => {
      console.log(error, url);
    });
};

const Api = { fetchMe, fetchFranchise, fetchTribe };
export default Api;
