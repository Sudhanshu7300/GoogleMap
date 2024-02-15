import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import React, { useRef, useEffect, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectionsRenderer,
  DirectionsService,
  InfoWindow,
  Polyline,
} from "@react-google-maps/api";
import { Grid, Typography } from "@mui/material";

// ** Images Import
import transportPng from "../../assets/img/transport2.png";
import warehouse from "../../assets/img/warehouse.png";
import placeholderTrack from "../../assets/img/placeholder-track.png";
// ** Map key Import
// ** Core Component Import
import { MAP_KEY } from "../Map_Key";
import { axiosInstance } from "../axiosInstance";
import { liveTrackingData } from "../shipmentDetails";

export default function Tab({ shipmentDetails }) {
  const { id } = useParams();
  const containerStyle = {
    width: "100%",
    height: "400px",
  };

  const [directions, setDirections] = useState(null);
  const [originCoord, setOriginCoord] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [destinationCoordinates, setDestinationCoordinates] = useState(null);
  // Api's  Function  And Use Effect Calling
  const [currentCoordinates, setCurrentCoordinates] = useState(null);
  const [currentAddress, setCurrentAddress] = useState(null);
  const [originAddress, setOriginAddress] = useState(null);
  const [destinationAddress, setDestinationAddress] = useState(null);

  const [selectedMarker, setSelectedMarker] = useState(null);

  const [liveTrackingCoordinates, setLiveTrackingCoordinates] = useState(null);

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
  };
  const [hoveredMarker, setHoveredMarker] = useState(null);

  const handleDirectionsResponse = (response) => {
    if (response !== null) {
      setDirections(response);
    }
  };

  const mapRef = useRef(null);

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
      setCurrentLocation({
        lat: shipmentDetails?.order?.currentLocation?.coordinates[0],
        lng: shipmentDetails?.order?.currentLocation?.coordinates[1],
      });
      setCurrentCoordinates(
        shipmentDetails?.order?.currentLocation?.coordinates[0] +
          "," +
          shipmentDetails?.order?.currentLocation?.coordinates[1]
      );

      setCurrentAddress(shipmentDetails?.order?.currentLocation);
      setOriginAddress(shipmentDetails?.order?.originLocation);
      setDestinationAddress(shipmentDetails?.order?.destinationLocation);
    }
    if (liveTrackingData) {
      setLiveTrackingCoordinates(
        Array.isArray(liveTrackingData)
          ? liveTrackingData?.map((point) => ({
              lat: point.location.coordinates[0],
              lng: point.location.coordinates[1],
            }))
          : []
      );
    }
  }, [shipmentDetails]);

  useEffect(() => {
    const apiUrlMap = "/api/location/getLocationDetails";
    const origin =
      currentCoordinates !== "undefined,undefined"
        ? currentCoordinates
        : originCoord;

    const mapBody = {
      url: `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(
        origin
      )}&destination=${destinationCoordinates}&mode=driving&key=${MAP_KEY}&region=india`,
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
    if (currentCoordinates && destinationCoordinates && originCoord) {
      GetGoogleMapData();
    }
  }, [shipmentDetails]);

  return (
    <>
      <Typography sx={{ mt: 3, color: "#000000" }}>
        To set up a structured Axios configuration for Google Maps API calls,
        first, organize your code by creating a folder named 'axios' within the
        'Component' directory. Within this folder, define is 'index.js' file to
        configure the Axios instance with a base URL and any necessary settings
        for making API requests. Additionally, establish a 'Map_key' folder
        within the 'Component' directory to securely store your Google Maps API
        key. Inside the 'Map_key' folder, define Map Key . This structured
        approach ensures a clear organization of your Axios setup while
        prioritizing security and accessibility for Google Maps API key.
      </Typography>
      <Grid container mt={3} justifyContent={"space-between"}>
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          key={"map"}
          lg={12}
          className="overview-item"
        >
          <LoadScript googleMapsApiKey={MAP_KEY} ref={mapRef}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={currentLocation ? currentLocation : { lat: 0, lng: 0 }}
            >
              {/*===================================================================> Origin Marker  */}
              <Marker
                position={{
                  lat: shipmentDetails?.order?.originLocation?.coordinates[0],
                  lng: shipmentDetails?.order?.originLocation?.coordinates[1],
                }}
                icon={{
                  url: placeholderTrack,
                  scaledSize:
                    window.google && new window.google.maps.Size(50, 50),
                }}
                title="Origin"
                onClick={() => handleMarkerClick("origin")}
              >
                {selectedMarker === "origin" && (
                  <InfoWindow
                    position={{
                      lat: shipmentDetails?.order?.originLocation
                        ?.coordinates[0],
                      lng: shipmentDetails?.order?.originLocation
                        ?.coordinates[1],
                    }}
                    onCloseClick={(e) => {
                      e.preventDefault();
                      setSelectedMarker(null);
                    }}
                  >
                    <div>
                      <h4>Origin Location</h4>
                      <h4>
                        {`${originAddress?.coordinates[0]},  ${originAddress?.coordinates[1]}  `}
                      </h4>
                      <h4> {originAddress?.name}</h4>
                    </div>
                  </InfoWindow>
                )}
              </Marker>
              {/*===================================================================> Polyline Show Grern Color   */}
              {directions && (
                <DirectionsRenderer
                  options={{
                    directions: directions,
                    polylineOptions: {
                      strokeColor: "green",
                      strokeOpacity: 0.8,
                      strokeWeight: 5,
                    },
                    suppressMarkers: true, // Hide the default "A" and "B" markers
                  }}
                />
              )}

              {directions && (
                <>
                  {/* Custom marker for origin */}
                  <Marker
                    position={{
                      lat:
                        directions &&
                        directions?.legs &&
                        directions?.legs[0]?.start_location.lat,
                      lng:
                        directions &&
                        directions?.legs &&
                        directions?.legs[0]?.start_location.lng,
                    }}
                    icon={{
                      url: transportPng,
                      scaledSize:
                        window.google && new window.google.maps.Size(70, 40),
                    }}
                    onClick={() => handleMarkerClick("current")}
                  >
                    {selectedMarker === "current" && (
                      <InfoWindow
                        position={{
                          lat:
                            directions &&
                            directions?.legs &&
                            directions.legs[0]?.start_location.lat,
                          lng:
                            directions &&
                            directions?.legs &&
                            directions.legs[0]?.start_location.lng,
                        }}
                        onCloseClick={() => setSelectedMarker(null)}
                      >
                        <div>
                          <h4>Current Location</h4>
                          <h4>
                            {`${currentAddress?.coordinates[0]},  ${currentAddress?.coordinates[1]}  `}
                          </h4>
                          <h4> {currentAddress?.name}</h4>
                        </div>
                      </InfoWindow>
                    )}
                  </Marker>

                  <Marker
                    position={{
                      lat:
                        directions &&
                        directions?.legs &&
                        directions.legs[0]?.end_location.lat,
                      lng:
                        directions &&
                        directions?.legs &&
                        directions.legs[0]?.end_location.lng,
                    }}
                    icon={{
                      url: warehouse,
                      scaledSize:
                        window.google && new window.google.maps.Size(40, 40),
                    }}
                    onClick={() => handleMarkerClick("destination")}
                  >
                    {selectedMarker === "destination" && (
                      <InfoWindow
                        position={{
                          lat:
                            directions &&
                            directions?.legs &&
                            directions.legs[0]?.end_location.lat,
                          lng:
                            directions &&
                            directions?.legs &&
                            directions.legs[0]?.end_location.lng,
                        }}
                        onCloseClick={() => setSelectedMarker(null)}
                      >
                        <div>
                          <h4>Destination</h4>
                          <h4>
                            {`${destinationAddress?.coordinates[0]},  ${destinationAddress?.coordinates[1]}  `}
                          </h4>
                          <h4>{destinationAddress?.name} </h4>
                        </div>
                      </InfoWindow>
                    )}{" "}
                  </Marker>
                </>
              )}

              <Polyline
                path={liveTrackingCoordinates?.map((point) => ({
                  lat: point.lat,
                  lng: point.lng,
                }))}
                options={{
                  strokeColor: "blue",
                  strokeWeight: 4,
                  strokeOpacity: 0.9,
                }}
              />
              {/* DirectionsService */}
              <DirectionsService
                options={{
                  origin: {
                    lat:
                      directions &&
                      directions?.legs &&
                      directions?.legs[0]?.start_location?.lat,
                    lng:
                      directions &&
                      directions.legs &&
                      directions?.legs[0]?.start_location?.lng,
                  },
                  destination: {
                    lat:
                      directions &&
                      directions?.legs &&
                      directions?.legs[0]?.end_location?.lat,
                    lng:
                      directions &&
                      directions.legs &&
                      directions?.legs[0]?.end_location?.lng,
                  },
                  travelMode: "DRIVING",
                }}
                position={currentLocation}
                callback={handleDirectionsResponse}
              />
            </GoogleMap>
          </LoadScript>{" "}
        </Grid>
      </Grid>
    </>
  );
}
