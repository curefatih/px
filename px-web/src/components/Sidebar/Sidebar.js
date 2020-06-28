import React from 'react';

import "./Sidebar.scss";
import { Link } from 'react-router-dom';

const Sidebar = (props) => {

  return (
    <div className="sidebar xl-center">

      <Link to="/">
        <div className="logo icon">
          <props.logo />
        </div>
      </Link>

    </div>
  );
}

export default Sidebar;