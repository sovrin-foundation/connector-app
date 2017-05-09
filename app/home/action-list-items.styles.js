import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    backgroundColor: "#EBEBEA",
    flex: 1
  },
  horizontalSpace: {
    paddingHorizontal: 10
  },
  dividerLabel: {
    color: "#242B2D"
  },
  listItemContainer: {
    backgroundColor: "#FFFFFF",
    paddingLeft: 10
  },
  badge: {
    backgroundColor: "rgba(52, 52, 52, 0.0)",
    left: 0,
    position: "absolute"
  },
  avatar: {
    top: 5,
    left: 2,
    position: "absolute"
  },
  avatarsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingVertical: 5,
    height: 60
  },
  listItem: {
    paddingVertical: 10,
    flexDirection: "row",
    marginBottom: 3,
    alignItems: "center"
  },
  textLabel: {
    color: "#535353",
    fontSize: 12,
    marginBottom: 5
  },
  listItemValue: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#424342"
  },
  swipeActionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#85BF43",
    marginBottom: 3
  },
  swipeActionLeft: {
    justifyContent: "center",
    alignItems: "center",
    width: 150
  },
  swipeActionLeftText: {
    color: "#FFFFFF",
    fontWeight: "bold"
  },
  rightSwipeItem: {
    flex: 1,
    justifyContent: "center",
    paddingLeft: 20
  },
  creditCardContainer: {
    flex: 1,
    flexDirection: "row",
    paddingLeft: 0,
    paddingVertical: 5,
    justifyContent: "space-around"
  },
  creditCard: {
    width: 145,
    height: 100
  }
});
