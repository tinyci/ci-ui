import queryString from 'query-string';

export const getPaginationState = stateObj => {
  var params = new queryString.parse(window.location.search);
  // all this business is about making the url line up with the pagination buttons.
  var page = Number(params.page || 0);
  var perPage = Number(params.perPage || 20);
  return {currentPage: page, perPage: perPage};
};

export const changePage = (stateObj, promise) => {
  return pg => {
    window.history.pushState(
      null,
      null,
      '?' +
        queryString.stringify({
          page: pg,
          perPage: Number(stateObj.state.perPage || 20),
        }),
    );

    promise({currentPage: pg});
  };
};

export const changePerPage = (stateObj, promise) => {
  return pz => {
    window.history.pushState(
      null,
      null,
      '?' +
        queryString.stringify({
          page: Number(stateObj.state.currentPage || 0),
          perPage: pz,
        }),
    );
    stateObj.setState({perPage: pz});
    promise({perPage: pz});
  };
};
