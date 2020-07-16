import React from 'react';
import SidePanel from '.';
import renderer from 'react-test-renderer';

test('SidePanel snapshot', () => {
  const component = renderer.create(
    <SidePanel />
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();

});

