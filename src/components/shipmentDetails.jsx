// shipmentDetails.jsx

// Define the array of shipment details
const shipmentDetails = [
  {
    order: {
      originLocation: {
        coordinates: [28.50724994116358, 77.40186665927479],
        name: "57, Sector 136, Noida, Bajidpur, Uttar Pradesh 201304, India",
        type: "Point",
      },
      destinationLocation: {
        coordinates: [28.53217007670288, 77.36159349423572],
        name: "Lotus Isle Tower-A1, Lotus Isle, Sector 98, Noida, Uttar Pradesh 201303, India",
        type: "Point",
      },
      currentLocation: {
        coordinates: [26.412698749999997, 80.402235817],
        name: "CC72+2Q6, Ghau Kheda, Jajmau Sub Metro City, Kanpur, Uttar Pradesh 208008, India",
        type: "Point",
      },
    },
  },
  // Add more shipment details objects as needed
];
const liveTrackingData = [
  {
    location: {
      name: "W4MR+HJF, NH 34, Surajpur Daria, Uttar Pradesh 210301, India",
      type: "Point",
      coordinates: [25.9344272, 80.14268154999999],
    },
    createdAt: "2023-12-13T18:30:07.000Z",
  },
  {
    location: {
      name: "W4QX+MJ Majara Kundaura Danda, Uttar Pradesh, India",
      type: "Point",
      coordinates: [25.939163117, 80.14907875],
    },
    createdAt: "2023-12-13T18:31:32.000Z",
  },
  {
    location: {
      name: "W5V3+CQM Betwa Bridge, Jhansi - Mirjapur Hwy, Maudaha Deam Colony, Hamirpur, Rameri Daria, Uttar Pradesh 210301, India",
      type: "Point",
      coordinates: [25.943591317, 80.154225433],
    },
    createdAt: "2023-12-13T18:32:57.000Z",
  },
  {
    location: {
      name: "W5X5+M8R, Meerapur, Bhilawa Danda, Hamirpur, Uttar Pradesh 210301, India",
      type: "Point",
      coordinates: [25.949138833, 80.157865383],
    },
    createdAt: "2023-12-13T18:34:22.000Z",
  },
  {
    location: {
      name: "X545+7CH, NH 34, Syed Wara, Manjhoopur Danda, Hamirpur, Uttar Pradesh 210301, India",
      type: "Point",
      coordinates: [25.9553598, 80.15870465],
    },
    createdAt: "2023-12-13T18:35:58.000Z",
  },
  {
    location: {
      name: "X556+65Q Hamirpur Yamuna Bridge, NH 34, Syed Wara, Manjhoopur Danda, Bagariya, Uttar Pradesh 209206, India",
      type: "Point",
      coordinates: [25.958103082999997, 80.160579017],
    },
    createdAt: "2023-12-13T18:37:23.000Z",
  },
  {
    location: {
      name: "X566+CW Bagariya, Uttar Pradesh, India",
      type: "Point",
      coordinates: [25.961001583, 80.16228158299998],
    },
    createdAt: "2023-12-13T18:38:49.000Z",
  },
  {
    location: {
      name: "X587+5Q Kasimpur, Uttar Pradesh, India",
      type: "Point",
      coordinates: [25.965470867, 80.164496983],
    },
    createdAt: "2023-12-13T18:40:17.000Z",
  },
  {
    location: {
      name: "X5C6+4WH, Hamirpur Rd, Bagariya, Uttar Pradesh 209206, India",
      type: "Point",
      coordinates: [25.971194099999998, 80.161746833],
    },
    createdAt: "2023-12-13T18:41:41.000Z",
  },
  {
    location: {
      name: "X5G5+HJ Rampur, Uttar Pradesh, India",
      type: "Point",
      coordinates: [25.976421516999995, 80.159038617],
    },
    createdAt: "2023-12-13T18:43:05.000Z",
  },
  {
    location: {
      name: "X5M4+52R, Rampur, Uttar Pradesh 209206, India",
      type: "Point",
      coordinates: [25.982639816999995, 80.155392767],
    },
    createdAt: "2023-12-13T18:44:33.000Z",
  },
  {
    location: {
      name: "X5Q3+5FW, NH 34, Syed Wara, Manjhoopur Danda, Hamirpur, Rampur, Uttar Pradesh 209206, India",
      type: "Point",
      coordinates: [25.987861617, 80.153293633],
    },
    createdAt: "2023-12-13T18:46:00.000Z",
  },
  {
    location: {
      name: "X5V3+FJ, Rampur, Uttar Pradesh 209206, India",
      type: "Point",
      coordinates: [25.993938817, 80.153840817],
    },
    createdAt: "2023-12-13T18:47:24.000Z",
  },
  {
    location: {
      name: "X5X3+GJ7, Rampur, Uttar Pradesh 209206, India",
      type: "Point",
      coordinates: [25.99924455, 80.154134983],
    },
    createdAt: "2023-12-13T18:48:51.000Z",
  },
  {
    location: {
      name: "2533+XRC, Anupur, Uttar Pradesh 209206, India",
      type: "Point",
      coordinates: [26.004918633, 80.154572383],
    },
    createdAt: "2023-12-13T18:50:15.000Z",
  },
  {
    location: {
      name: "2563+6M7, Kanpur - Sagar Hwy, Anupur, Uttar Pradesh 209206, India",
      type: "Point",
      coordinates: [26.011006016999996, 80.154315367],
    },
    createdAt: "2023-12-13T18:51:42.000Z",
  },
  {
    location: {
      name: "25C3+5J2, NH 34, Hamira Mau, Uttar Pradesh 208001, India",
      type: "Point",
      coordinates: [26.020882933, 80.153784483],
    },
    createdAt: "2023-12-13T18:53:09.000Z",
  },
  {
    location: {
      name: "25H3+9Q Ajyori, Uttar Pradesh, India",
      type: "Point",
      coordinates: [26.0284506, 80.154412283],
    },
    createdAt: "2023-12-13T18:54:36.000Z",
  },
  {
    location: {
      name: "25P4+23, Ajyori, Uttar Pradesh 209206, India",
      type: "Point",
      coordinates: [26.034764749999997, 80.155147233],
    },
    createdAt: "2023-12-13T18:56:00.000Z",
  },
  {
    location: {
      name: "25Q4+XV4, Tikwapur, Uttar Pradesh 209206, India",
      type: "Point",
      coordinates: [26.039663299999997, 80.156944967],
    },
    createdAt: "2023-12-13T18:57:32.000Z",
  },
  {
    location: {
      name: "25X5+6XF, Sajeti, Uttar Pradesh 209206, India",
      type: "Point",
      coordinates: [26.047007216999997, 80.15928375],
    },
    createdAt: "2023-12-13T18:59:12.000Z",
  },
  {
    location: {
      name: "3526+97W, Sajeti, Uttar Pradesh 209206, India",
      type: "Point",
      coordinates: [26.0512615, 80.16068945],
    },
    createdAt: "2023-12-13T19:00:38.000Z",
  },
  {
    location: {
      name: "3546+FJW, Jalla, Uttar Pradesh 209206, India",
      type: "Point",
      coordinates: [26.0571584, 80.161741333],
    },
    createdAt: "2023-12-13T19:02:07.000Z",
  },
  {
    location: {
      name: "3577+Q3, Jalla, Uttar Pradesh 209206, India",
      type: "Point",
      coordinates: [26.065079583, 80.162675467],
    },
    createdAt: "2023-12-13T19:03:32.000Z",
  },
  {
    location: {
      name: "3597+W67, NH 34, Jalla, Aliyapur, Uttar Pradesh 209206, India",
      type: "Point",
      coordinates: [26.069493467, 80.163173383],
    },
    createdAt: "2023-12-13T19:04:58.000Z",
  },
  {
    location: {
      name: "3597+W67, NH 34, Jalla, Aliyapur, Uttar Pradesh 209206, India",
      type: "Point",
      coordinates: [26.06968645, 80.16294435],
    },
    createdAt: "2023-12-13T19:06:27.000Z",
  },
];

// Export the array of shipment details
export { shipmentDetails, liveTrackingData };
