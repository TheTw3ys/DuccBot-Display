import React, { useEffect, useState } from "react";
import moment from "moment";
import ReactDOM from "react-dom";
import { apiClient } from "./apiClient";
import { BrowserRouter } from "react-router-dom";
import { VPNStatusTable } from "./components/VPNStatusTable";
import { Container, Tabs, Tab } from "react-bootstrap";

import "moment/locale/de";

moment.locale("de");

var App = () => {
  var [VPNNames, setVPNNames] = useState<Array<string>>([]);

  var pollVPNNames = async () => {
    var names = await apiClient.getVPNNames(); // old names dont get removed.
    setVPNNames(names);
  };

  useEffect(() => {
    pollVPNNames();
  }, []);

  return (
    <div>
      <p></p>
      <Container>
        <h1>DuccBot-Display</h1>
        <h5>These tables show the current ranking of the Users in DuccBot</h5>
        <p></p>
      </Container>
      <Container>
        <Tabs defaultActiveKey={VPNNames[0]} id="VPNLog" className="mb-3">
          {VPNNames.map((name) => {
            if (name !== "mfst" && name !== "faintmau5 server for tests") {
              return (
                <Tab key={name} eventKey={name} title={name}>
                  <VPNStatusTable logName={name} />
                </Tab>
              );
            }
          })}
        </Tabs>
      </Container>
    </div>
  );
};

const OuterApp = () => {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
};

ReactDOM.render(<OuterApp />, document.getElementById("app-content"));
