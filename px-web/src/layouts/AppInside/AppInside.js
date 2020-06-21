import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';

import "./AppInside.scss";
import { FiActivity } from "react-icons/fi";

const AppInside = (props) => {
  return (
    <div className="app-inside">
      <div className="app-inside_sidebar md-hidden">
        <Sidebar
          logo={FiActivity}
          routes={{}}
        />
      </div>
      <div className="app-inside_container_wrapper ">

        <div className="app-inside_container center">
          {props.children}
        </div>
      </div>
    </div>
  );
}

export default AppInside;