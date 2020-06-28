import React from 'react';
import "./Button.scss";

import cx from "classnames";

const Button = ({className, color, ...rest}) => {
  return (
    <button
    className={
      cx(
        "button-custom",
        color && `button-${color}` || "button-default",
        className
      )
    }
    >{rest.children}</button>
  );
}

export default Button;