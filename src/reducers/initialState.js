export default {
  runs: {
    list: [],
    count: 0,
    loading: true,
    filters: {
      repository: "",
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
  },
  refs: {
    list: [],
  },
}
