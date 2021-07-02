import React from "react";
import { InlineFormLabel } from "@grafana/ui";

type HelloProps = {
  name: string;
};

export const Hello = (props: HelloProps) => {
  const { name } = props;
  return (
    <div>
      <div className="gf-form">
        <InlineFormLabel className="query-keyword">Hello</InlineFormLabel>
        <InlineFormLabel>{name}</InlineFormLabel>
      </div>
    </div>
  );
};
