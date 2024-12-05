import React from "react";
import "./register.css";
import { Link } from "react-router-dom";
import ThreeBoxes from "../../components/ThreeBoxes/ThreeBoxes";
import PageLayout from "../../components/layout/pageLayout";

function register() {
  return (
    <div>
      <PageLayout>
        <ThreeBoxes />
      </PageLayout>
    </div>
  );
}

export default register;
