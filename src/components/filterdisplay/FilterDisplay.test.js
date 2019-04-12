import React from "react"
import sinon from "sinon"
import renderer from "react-test-renderer"
import { shallow } from "enzyme"
import IconButton from "@material-ui/core/IconButton"
import { FilterDisplayView, isFiltering } from "./FilterDisplay"

it("renders without properties", () => {
  const v = shallow(<FilterDisplayView />)
  expect(v).toMatchSnapshot()
})

it("renders the repository name when set", () => {
  const v = shallow(<FilterDisplayView repository="therepo" />)
  expect(v.find(".filter-text").text()).toEqual("Filtering: therepo ")
})

it("renders the repository and sha when set", () => {
  const v = shallow(<FilterDisplayView repository="therepo" sha="abc123" />)
  expect(v.find(".filter-text").text()).toEqual(
    "Filtering: therepo (sha: abc123)",
  )
})

it("clears the filter when clicked", () => {
  const onClear = sinon.spy()
  const v = shallow(
    <FilterDisplayView repository="therepo" sha="abc123" onClear={onClear} />,
  )
  v.find(IconButton).simulate("click")
  expect(onClear.callCount).toBe(1)
})

test.each([
  ["", "", false],
  ["repo", "", true],
  ["repo", "sha", true],
  ["", "sha", true],
])("isFiltering(%s, %s)", (repo, sha, expected) => {
  expect(isFiltering(repo, sha)).toBe(expected)
})
