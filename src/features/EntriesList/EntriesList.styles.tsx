import { createStyles } from "@material-ui/core/styles";

export const styles = () =>
  createStyles({
    colorIcon: {
      marginRight: "1rem",
    },
    infoIcon: {
      marginRight: "0.2rem",
    },
    itemContainer: {
      height: "6rem",
      width: "14rem",
      padding: "0 0 0 1rem",
      margin: "0.5rem 0",
      backgroundColor: "#4CAF50",
      borderRadius: "0 0.4rem 0.4rem 0",
    },
    page: {
      width: "14rem",
      height: "100%",
      overflowY: "auto",
      overflowX: "hidden",
      backgroundColor: "white",
    },
    progress: {
      width: "7rem",
    },
    rightContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      marginRight: "1rem",
    },
    text: {
      width: "7.5rem",
    },
  });
