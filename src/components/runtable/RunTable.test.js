import React from "react"
import sinon from "sinon"
import renderer from "react-test-renderer"
import { shallow } from "enzyme"

import { duration, branchName } from "./RunTable"

test.each([
  ["2000-01-01T00:00:00", "2000-01-01T00:05:00", "5.00m"],
  ["2000-01-01T00:00:00", "2000-01-01T01:00:00", "60.00m"],
  ["2000-01-01T00:00:00", "2000-01-01T01:05:00", "1.08h"],
  ["2000-01-01T00:00:00", "2000-01-02T00:05:00", "24.08h"],
  ["2000-01-01T00:00:00", "2000-01-03T00:05:00", "48.08h"],
])("duration(%s, %s)", (start, end, expected) => {
  expect(duration(start, end)).toBe(expected)
})

test.each([
  ["foo/bubbles", "bubbles"],
  ["origin/master", "master"],
  ["abc", "abc"],
])("branchName(%s)", (ref_name, expected) => {
  expect(branchName(ref_name)).toBe(expected)
})
