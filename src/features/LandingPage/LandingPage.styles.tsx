import { createStyles } from "@material-ui/core/styles";

export const styles = () =>
  createStyles({
    icon: {
      fontSize: "3rem",
    },
    iconMargins: {
      margin: "0 0.5rem",
    },
    iconTwoMargins: {
      margin: "0 1.5rem",
    },
    infoArea: {
      //position: 'absolute',
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
    },
    inputRoot: {
      color: "black",
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "rgba(255,193,7, 0.7)",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#FFC107",
      },
    },
    mediumIcon: {
      fontSize: "3rem",
    },
    nameSelectNew: {
      //width: '20rem'
    },
    options: {
      fontSize: "0.8125rem",
      lineHeight: "1.2",
      color: "#252525",
      '&[aria-selected="true"]': {
        color: "#252525",
        //fontWeight: 1000,
        backgroundColor: "#ffffff",
      },
      '&[data-focus="true"]': {
        color: "#252525",
        backgroundColor: "rgba(255,193,7, 0.7)",
      },
    },
    page: {
      overflow: "hidden",
      backgroundColor: "#FFFFFF",
      width: "100%",
      height: "100%",
    },
    profSelect: {
      width: "10rem",
      marginRight: "0.5rem",
    },
    rating: {
      display: "flex",
      justifyContent: "flex-end",
    },
    root: {
      display: "flex",
      backgroundColor: "#66BB6A",
      justifyContent: "space-between",
      flexDirection: "row",
      flexWrap: "nowrap",
      minHeight: "6.25rem",
      width: "100%",
      zIndex: 9,
      boxShadow: "0 0.125rem 0.3125rem 0 rgba(255,193,7, 0.9)",
    },
    rootAutoComplete: {
      "& label.Mui-focused": {
        color: "#FFC107",
        //fontWeight: 1000
      },
    },
    rootLeft: {
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
      marginLeft: "1rem",
    },
    rootRight: {
      position: "absolute",
      top: 0,
      right: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
    },
  });
