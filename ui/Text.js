export default (props) => (
  <Text {...props} style={[{ fontFamily: "RobotoMono-Bold" }, props.style]}>
    {props.children}
  </Text>
);
