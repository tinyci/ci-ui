import queryString from 'query-string';

export const getPaginationState = stateObj => {
  var params = new queryString.parse(window.location.search);
  var page = Number(params.page || 0);
  var perPage = Number(params.perPage || 20);
  return {currentPage: page, perPage: perPage};
};

export const updateState = stateObj => {
  window.history.pushState(
    null,
    null,
    '?' +
      queryString.stringify({
        page: Number(stateObj.state.currentPage || 0),
        perPage: Number(stateObj.state.perPage || 20),
      }),
  );
};

export const changePage = (stateObj, promise) => {
  return pg => {
    promise({currentPage: pg});
    updateState(stateObj);
  };
};

export const changePerPage = (stateObj, promise) => {
  return pz => {
    promise({perPage: pz});
    updateState(stateObj);
  };
};
