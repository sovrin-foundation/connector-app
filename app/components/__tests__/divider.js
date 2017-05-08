import { Text } from "react-native";
import React from "react";
import Divider from "../divider";

// Note: test renderer must be required after react-native.
import renderer from "react-test-renderer";

it("should render divider with left and right", () => {
  const divider = renderer
    .create(<Divider left={<Text>Test Text</Text>} />)
    .toJSON();
  expect(divider).toMatchSnapshot();
});
