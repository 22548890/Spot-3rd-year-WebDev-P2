import React, { useState } from "react";
import "./CSS/Table.css";

const handleCreateGroup = () => {
  window.location.pathname = "/CreateGroup";
};

const handleHome = (e) => {
  e.preventDefault();
  window.location.pathname = "/";
};

function Groups() {
  return (
    <>
      <nav id="navbar" class="">
        <div className="nav-wrapper">
          <div className="logo">
            <label>Spot</label>
          </div>

          {/* <div>
            <h1>Groups</h1>
          </div> */}

          <ul id="menu">
            <li>
              <a onClick={handleCreateGroup}> Create Group </a>
            </li>
            <li>
              <a> Edit My Groups</a>
            </li>
          </ul>
        </div>
      </nav>

      <div className="card_groups">
        <thead>
          <input type="text" placeholder="Search Groups..." />
        </thead>
      </div>
      {/* <div className="card">
        <tbody>
          <ul>
            <li>Group 1</li>
            <li>Group 2</li>
            <li>Group 3</li>
          </ul>
        </tbody>
      </div> */}
      <div className="card_groups">Group 1</div>
      <div className="card_groups">Group 2</div>
      <div className="card_groups">Group 3</div>
      <div>
        <button className="btn home" onClick={handleHome}>
          Back Home
        </button>
      </div>
    </>
  );
}

export default Groups;
