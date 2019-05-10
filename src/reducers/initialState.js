export default {
  runs: {
    list: [],
    count: 0,
    loading: true,
    filters: {
      repository: "",
      refName: "",
      sha: "",
      pageSize: 20,
      currentPage: 0,
    },
  },
  repositories: {
    subscribedList: [],
    ownedList: [],
    visibleList: [],
  },
  users: {
    username: "",
  },
  ui: {
    errorMessage: "",
    successMessage: "",
    activeRepositoriesRequests: 0,
  },
  tasks: {
    list: [],
    count: 0,
    filters: {
      refName: "",
      repository: "",
      pageSize: 20,
      currentPage: 0,
    },
  },
  refs: {
    list: [],
  },
}
