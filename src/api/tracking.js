import axios from "axios";

const searchTracking = () => {
  return new Promise((resolve, reject) => {
    let config = {
      headers: {
        Authorization: "Bearer iXb6TqJXjLMiqrWNdTFAP8NvTu2gbrmb",
      },
    };
    let data = {
      identifier: "CSK6CZZZ9408F",
      start: "2021-03-01T00:00:00",
      end: "2021-03-7T23:00:00",
    };
    axios
      .post(
        `${import.meta.env.VITE_API_BASE_URL}search/tracking`,
        data,
        config
      )
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      })
      .then(function () {});
  });
};

export { searchTracking };
