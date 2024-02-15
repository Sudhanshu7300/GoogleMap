import axios from "axios";
import dayjs from "dayjs";

import { useParams } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectionsRenderer,
  DirectionsService,
  Polyline,
  InfoWindow,
} from "@react-google-maps/api";
import { Grid, Typography } from "@mui/material";
// ** Images Import
import transportPng from "../../assets/img/transport2.png";
import placeholderTrack from "../../assets/img/placeholder-track.png";
import warehouse from "../../assets/img/warehouse.png";
// ** Core Component
import { axiosInstance } from "../axiosInstance";
import { MAP_KEY } from "../../components/Map_Key";
import { liveTrackingData } from "../../components/shipmentDetails";

export default function Map({ shipmentDetails }) {
  const { id } = useParams();
  const containerStyle = {
    width: "100%",
    height: "400px",
  };

  const mapRef = useRef(null);
  const apiUrl = `/api/sensor/fetchSensorData`;
  const params = {
    search: {},
    filter: {
      order_ref: id,
      "location.coordinates.0": { $gt: 0 },
      "location.coordinates.1": { $gt: 0 },
      gps_signal: "good",
    },
    page: "",
    limit: "",
    select: { location: 1, _id: 0, createdAt: 1 },
    startDate: "",
    endDate: "",
    sensorName: "gps",
    sort: { createdAt: -1 },
  };

  const [error, setError] = useState(null);
  const [directions, setDirections] = useState();
  const [snapToRoads, setSnapToRoads] = useState([]);
  const [nearestRoads, setNearestRoads] = useState([]);
  const [originCoord, setOriginCoord] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationDetails, setLocationDetails] = useState(null);
  const [destinationCoordinates, setDestinationCoordinates] = useState(null);
  const [liveTrackingCoordinates, setLiveTrackingCoordinates] = useState(null);

  const [placeIds, setPlaceIds] = useState([]);

  const flatArrayLimit = liveTrackingCoordinates
    ?.map((coord) => `${coord.lat},${coord.lng}`)
    ?.join("|");

  // Api's  Function  And Use Effect Calling
  async function GetSensorDetails() {
    try {
      const response = await axiosInstance.get(apiUrl, { params });
      setLocationDetails(response.data);
    } catch (error) {
      console.error("API Error:", error);
    }
  }
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
      setCurrentLocation({
        lat: shipmentDetails?.order?.currentLocation?.coordinates[0],
        lng: shipmentDetails?.order?.currentLocation?.coordinates[1],
      });
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
  }, []);

  useEffect(() => {
    const fetchDataSnapToRoads = async () => {
      try {
        const response = await axios.get(
          `https://roads.googleapis.com/v1/snapToRoads?interpolate=true`,
          {
            params: {
              path: flatArrayLimit,
              key: MAP_KEY,
            },
          }
        );
        const snappedPoints = response.data.snappedPoints;
        console.log("Check filteredSnapToRoads", filteredSnapToRoads);

        const filteredSnapToRoads = snappedPoints.filter(
          (point) => point.placeId !== null
        );
        setSnapToRoads(filteredSnapToRoads);
      } catch (error) {
        setError(error);
      }
    };
    if (flatArrayLimit) {
      fetchDataSnapToRoads();
    }
  }, []);

  useEffect(() => {
    const mapBody = {
      url: `https://maps.googleapis.com/maps/api/directions/json?origin=${originCoord}&destination=${destinationCoordinates}&mode=driving&key=${MAP_KEY}&region=india`,
    };
    const apiUrlMap = "/api/location/getLocationDetails";
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
  }, []);
  return (
    <>
      <Grid container mt={2}>
        <Typography variant="h6">Snap To Road d </Typography>
        <LoadScript googleMapsApiKey={MAP_KEY} ref={mapRef}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={currentLocation ? currentLocation : { lat: 0, lng: 0 }}
            zoom={9}
          >
            {/* {liveTrackingData?.map((point, index) => (
              <d
                key={index}
                position={{
                  lat: point.location?.coordinates[0],
                  lng: point.location?.coordinates[1],
                }}
                onClick={() => setHoveredd(index)}
              >
                {hoveredd === index && (
                  <InfoWindow onCloseClick={() => setHoveredd(null)}>
                    <div>
                      <p>
                        Date:
                        {point.createdAt
                          ? `
                  ${dayjs(point.createdAt).format("h:mm A")},
                  ${dayjs(point.createdAt).format("DD-MM-YYYY")}`
                          : ""}
                      </p>
                      <p>Timestamp: {point.location.name}</p>
                    </div>
                  </InfoWindow>
                )}
              </d>
            ))} */}
            {/*===================================================================> Origin d  */}
            <d
              icon={{
                url: placeholderTrack,
                scaledSize:
                  window.google && new window.google.maps.Size(50, 50),
              }}
              position={{
                lat:
                  directions &&
                  directions?.legs &&
                  directions?.legs[0]?.start_location?.lat,
                lng:
                  directions &&
                  directions?.legs &&
                  directions?.legs[0]?.start_location?.lng,
              }}
              title="Origin"
            />
            {/*===================================================================> Destination d  */}
            <d
              icon={{
                url: warehouse,
                scaledSize:
                  window.google && new window.google.maps.Size(40, 40),
              }}
              position={{
                lat:
                  directions &&
                  directions?.legs &&
                  directions?.legs[0]?.end_location?.lat,
                lng:
                  directions &&
                  directions?.legs &&
                  directions?.legs[0]?.end_location?.lng,
              }}
              title="Destination"
            />
            {/*===================================================================> snapToRoadsLatLng d  */}
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
                }}
              />
            )}
            {directions && (
              <>
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
                  callback={(result) => {
                    if (result !== null) {
                      setDirections(result);
                    }
                  }}
                />
              </>
            )}
            {/*===================================================================> Current Location d  */}
            {currentLocation && (
              <Marker
                position={currentLocation}
                icon={{
                  url: transportPng,
                  scaledSize:
                    window.google && new window.google.maps.Size(70, 40),
                }}
                title="Current Location"
              />
            )}

            {/*===================================================================> snapToRoadsLatLng Marker  */}

            {snapToRoads.map((point, index) => (
              <Marker
                key={index}
                position={{
                  lat: point.location.latitude,
                  lng: point.location.longitude,
                }}
              />
            ))}
            {/*===================================================================> Polyline Show Grern Color   */}

            <Polyline
              path={snapToRoads.map((point) => ({
                lat: point.location.latitude,
                lng: point.location.longitude,
              }))}
              options={{
                strokeColor: "blue",
                strokeWeight: 4,
                strokeOpacity: 0.9,
              }}
            />
          </GoogleMap>
        </LoadScript>
      </Grid>
    </>
  );
}
