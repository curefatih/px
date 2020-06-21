import React from 'react';

import "./Sidebar.scss";

const Sidebar = (props) => {

  return (
    <div className="sidebar xl-center">

        <div className="logo icon">
          <props.logo />
        </div>

    </div>
  );
}

export default Sidebar;