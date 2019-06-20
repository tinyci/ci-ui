import queryString from 'query-string';

export const loadPaginationState = stateObj => {
  var params = new queryString.parse(window.location.search);
  // all this business is about making the url line up with the pagination buttons.
  var page = (Number(params.page) || stateObj.state.currentPage || 1) - 1;
  var perPage = Number(params.perPage) || stateObj.state.perPage || 20;
  stateObj.state.currentPage = page;
  stateObj.state.perPage = perPage;
};

export const changePage = stateObj => {
  return pg => {
    window.history.pushState(
      null,
      null,
      '?' +
        queryString.stringify({
          page: pg + 1,
          perPage: Number(stateObj.state.perPage || 20),
        }),
    );

    stateObj.setState({currentPage: pg});
  };
};

export const changePerPage = stateObj => {
  return pz => {
    window.history.pushState(
      null,
      null,
      '?' +
        queryString.stringify({
          page: Number(stateObj.state.currentPage || 0) + 1,
          perPage: pz,
        }),
    );
    stateObj.setState({perPage: pz});
  };
};
