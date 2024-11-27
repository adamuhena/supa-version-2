import React, { Component } from 'react';

export default class Spinner extends Component {
  render() {
    return (
      <div>
        <div className="relative inline-flex">
          <div className="w-8 h-8 bg-emerald-500 rounded-full"></div>
          <div className="w-8 h-8 bg-emerald-500 rounded-full absolute top-0 left-0 animate-ping"></div>
          <div className="w-8 h-8 bg-emerald-500 rounded-full absolute top-0 left-0 animate-pulse"></div>
        </div>
      </div>
    );
  }
}
