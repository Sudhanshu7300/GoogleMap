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
    const fetchDataNearestRoads = async () => {
      try {
        const response = await axios.get(
          `https://roads.googleapis.com/v1/nearestRoads`,
          {
            params: {
              points: flatArrayLimit,
              key: MAP_KEY,
            },
          }
        );
        const NearestPoints = response.data.snappedPoints;
        for (const point of NearestPoints) {
          const newPlaceId = point.placeId;
          console.log(`Place ID: ${newPlaceId}`);
          // Add the new Place ID to the state
          setPlaceIds((prevPlaceIds) => [...prevPlaceIds, newPlaceId]);
          // You can use the placeId to fetch the address using the Google Geocoding API.
        }
        setNearestRoads(NearestPoints);
      } catch (error) {
        setError(error);
      }
    };
    if (flatArrayLimit) {
      fetchDataNearestRoads();
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

  const [hoveredMarker, setHoveredMarker] = useState(null);
  const initialZoom = 9; // Set the initial zoom level

  return (
    <>
      <Grid container mt={2}>
        <Typography variant="h6">Nearest Roads Marker With Polyline</Typography>
        <LoadScript googleMapsApiKey={MAP_KEY} ref={mapRef}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={currentLocation ? currentLocation : { lat: 0, lng: 0 }}
            zoom={9}
          >
            {/* {liveTrackingData?.map((point, index) => (
              <Marker
                key={index}
                position={{
                  lat: point.location?.coordinates[0],
                  lng: point.location?.coordinates[1],
                }}
                onClick={() => setHoveredMarker(index)}
              >
                {hoveredMarker === index && (
                  <InfoWindow onCloseClick={() => setHoveredMarker(null)}>
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
              </Marker>
            ))} */}
            {/*===================================================================> Origin Marker  */}
            <Marker
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
            {/*===================================================================> Destination Marker  */}
            <Marker
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
            {/*===================================================================> Nearest Roads Marker  */}
            {nearestRoads.map((point, index) => (
              <Marker
                position={{
                  lat: point.location.latitude,
                  lng: point.location.longitude,
                }}
              />
            ))}
            <Polyline
              path={nearestRoads?.map((point) => ({
                lat: point.location.latitude,
                lng: point.location.longitude,
              }))}
              options={{
                strokeColor: "orange",
                strokeWeight: 4,
                strokeOpacity: 0.9,
              }}
            />
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
          </GoogleMap>
        </LoadScript>
      </Grid>
    </>
  );
}
