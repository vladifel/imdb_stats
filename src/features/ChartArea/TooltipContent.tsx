import React, { FC } from "react";
import { Grid, Typography } from "@material-ui/core";

import { getVotesString } from "../../helpers/getVotesString";

interface ITooltipContentProps {
  title: string;
  year: number;
  rating: number;
  imdbVotes: number;
}

const TooltipContent: FC<ITooltipContentProps> = ({
  title,
  year,
  rating,
  imdbVotes,
}: ITooltipContentProps) => {
  const votesString = imdbVotes ? getVotesString(imdbVotes) : "";
  return (
    <Grid
      style={{
        backgroundColor: "rgba(255,193,7,0.5)",
        borderRadius: "0.6rem",
      }}
    >
      <Typography
        style={{
          margin: "0 0.5rem",
          fontSize: "1.2rem",
        }}
      >
        {title}
      </Typography>
      <Typography
        style={{
          margin: "0 0.5rem",
        }}
      >
        {`year: ${year}`}
      </Typography>
      <Typography
        style={{
          margin: "0 0.5rem",
        }}
      >
        {`Imdb score: ${rating}`}
      </Typography>
      <Typography
        style={{
          margin: "0 0.5rem",
          color: imdbVotes > 1000 ? "black" : "red",
        }}
      >
        {`Voters: ${votesString}`}
      </Typography>
    </Grid>
  );
};

export default TooltipContent;
