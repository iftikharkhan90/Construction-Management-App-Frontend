import React from "react";
import Aluminium from "./Aluminium/aluninium";
import Building from "./building/building";
import Ceiling from "./ceiling/ceiling";
import Electricity from "./electricity/electricity";
import LabourersWages from "./labourer's wages/labourer'swages";
import Sanitary from "./sanitary/sanitary";
import Tiles from "./tiles/tiles";
import Wood from "./wood/wood";

export default function Pages() {
  return (
    <>
      <Aluminium />
      <Building />
      <Ceiling />
      <Electricity />
      <LabourersWages />
      <Sanitary />
      <Tiles />
      <Wood />
    </>
  );
}
