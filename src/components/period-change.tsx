"use client";
import React, { useContext } from "react";
import { Button } from "./ui/button";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { PeriodContext } from "~/context/period";

const PeriodChange = () => {
  const period = useContext(PeriodContext);

  return (
    <div className="flex ">
      <Button size={"sm"} variant={"ghost"} onClick={period.decreaseMonth}>
        <ChevronLeft />
      </Button>
      <Button size={"sm"} variant={"ghost"} onClick={period.increaseMonth}>
        <ChevronRight />
      </Button>
    </div>
  );
};

export default PeriodChange;
