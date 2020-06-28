import React from 'react';
import "./Input.scss";

import cx from "classnames";

const Input = ({ className, color, ...rest }) => {
  return (
    <input
      className={
        cx("input-custom",
          color && `input-${color}` || "input-default",
          className
        )
      } {...rest} />
  );
}

export default Input;
