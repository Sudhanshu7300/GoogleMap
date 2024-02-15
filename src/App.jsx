import { useParams } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";

import { Grid, Tabs, Tab, Container } from "@mui/material";

// ** Core Component
import { axiosInstance } from "./components/axiosInstance";
import SnapRoadUseNearstCoord from "./components/MapTab's/SnapToRoadUseNearestCood";
import SnapToRoad from "./components/MapTab's/SnapToRoad";
import NearstRoad from "./components/MapTab's/NearestRoad";
import SpeedLimit from "./components/MapTab's/SpeedLimitsRoad";
import OverviewTab from "./components/MapTab's/overviewTab";
import { MAP_KEY } from "./components/Map_Key";
import { shipmentDetails } from "./components/shipmentDetails";
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <div>{children} </div>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};
export default function Map() {
  const { id } = useParams();

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [currentCoordinates, setCurrentCoordinates] = useState(null);
  const [originCoord, setOriginCoord] = useState(null);
  const [destinationCoordinates, setDestinationCoordinates] = useState(null);

  useEffect(() => {
    if (id) {
      GetSensorDetails();
    }
  }, [id]);
  useEffect(() => {
    if (shipmentDetails) {
      setOriginCoord(
        shipmentDetails?.order?.originLocation?.coordinates[0] +
          "," +
          shipmentDetails?.order?.originLocation?.coordinates[1]
      );
      setDestinationCoordinates(
        shipmentDetails?.order?.destinationLocation?.coordinates[0] +
          "," +
          shipmentDetails?.order?.destinationLocation?.coordinates[1]
      );
      setCurrentCoordinates(
        shipmentDetails?.order?.currentLocation?.coordinates[0] +
          "," +
          shipmentDetails?.order?.currentLocation?.coordinates[1]
      );
    }
  }, []);

  useEffect(() => {
    const apiUrlMap = "/api/location/getLocationDetails";
    const mapBody = {
      url: `https://maps.googleapis.com/maps/api/directions/json?origin=${currentCoordinates}&destination=${destinationCoordinates}&mode=driving&key=${MAP_KEY}&region=india`,
    };
    async function GetGoogleMapData() {
      try {
        const response = await axiosInstance.post(apiUrlMap, mapBody);
        const directionsData = response.data?.routes[0];
        setDirections(directionsData);
      } catch (error) {
        console.error("API Error:", error);
      }
    }
    if (originCoord && destinationCoordinates) {
      GetGoogleMapData();
    }
  }, [shipmentDetails]);
  return (
    <>
      <Container maxWidth="xl">
        <Grid container mt={2} className="width100" sx={{ width: "100%" }}>
          <Tabs
            className="width100"
            centered
            value={value}
            onChange={handleChange}
          >
            <Tab label="Overview" className="TabChangesDevice" />
            <Tab label="SnapToRoad" className="TabChangesDevice" />
            <Tab label="NearstRoad" className="TabChangesDevice" />
            <Tab label="SnapRoadUseNearstCoord" className="TabChangesDevice" />
            <Tab label="SpeedLimit" className="TabChangesDevice" />
          </Tabs>
          <TabPanel value={value} index={0} className="width100">
            <OverviewTab shipmentDetails={shipmentDetails} />
          </TabPanel>
          <TabPanel value={value} index={1} className="width100">
            <SnapToRoad shipmentDetails={shipmentDetails} />
          </TabPanel>
          <TabPanel value={value} index={2} className="width100">
            <NearstRoad shipmentDetails={shipmentDetails} />
          </TabPanel>
          <TabPanel value={value} index={3} className="width100">
            <SnapRoadUseNearstCoord shipmentDetails={shipmentDetails} />
          </TabPanel>
          <TabPanel value={value} index={4} className="width100">
            <SpeedLimit shipmentDetails={shipmentDetails} />
          </TabPanel>{" "}
        </Grid>
      </Container>
    </>
  );
}
