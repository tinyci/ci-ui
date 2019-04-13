import React from "react"
import sinon from "sinon"
import renderer from "react-test-renderer"
import { shallow } from "enzyme"
import { removeSubscribedFromList } from "./RepoList.js"

// removeSubscribedFromList
it("removes subscribed repos", () => {
  const result = removeSubscribedFromList(
    [{ name: "a" }],
    [{ name: "a" }, { name: "b" }],
  )
  expect(result).toHaveLength(1)
  expect(result[0].name).toBe("b")
})
