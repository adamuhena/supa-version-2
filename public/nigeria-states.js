
import fs from 'fs';

const nigeriaStates = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Abia", id: "NG-AB" },
      geometry: { type: "Point", coordinates: [7.5248, 5.4527] }
    },
    {
      type: "Feature",
      properties: { name: "Adamawa", id: "NG-AD" },
      geometry: { type: "Point", coordinates: [12.4853, 9.3265] }
    },
    {
      type: "Feature",
      properties: { name: "Akwa Ibom", id: "NG-AK" },
      geometry: { type: "Point", coordinates: [7.8624, 4.9057] }
    },
    {
      type: "Feature",
      properties: { name: "Anambra", id: "NG-AN" },
      geometry: { type: "Point", coordinates: [7.0068, 6.2209] }
    },
    {
      type: "Feature",
      properties: { name: "Bauchi", id: "NG-BA" },
      geometry: { type: "Point", coordinates: [9.8442, 10.3164] }
    },
    {
      type: "Feature",
      properties: { name: "Benue", id: "NG-BE" },
      geometry: { type: "Point", coordinates: [8.8003, 7.3369] }
    },
    {
      type: "Feature",
      properties: { name: "Borno", id: "NG-BO" },
      geometry: { type: "Point", coordinates: [12.1871, 11.8846] }
    },
    {
      type: "Feature",
      properties: { name: "Cross River", id: "NG-CR" },
      geometry: { type: "Point", coordinates: [8.3417, 5.8702] }
    },
    {
      type: "Feature",
      properties: { name: "Delta", id: "NG-DE" },
      geometry: { type: "Point", coordinates: [5.6845, 5.8980] }
    },
    {
      type: "Feature",
      properties: { name: "Ebonyi", id: "NG-EB" },
      geometry: { type: "Point", coordinates: [8.0842, 6.2649] }
    },
    {
      type: "Feature",
      properties: { name: "Edo", id: "NG-ED" },
      geometry: { type: "Point", coordinates: [5.6145, 6.3350] }
    },
    {
      type: "Feature",
      properties: { name: "Ekiti", id: "NG-EK" },
      geometry: { type: "Point", coordinates: [5.2194, 7.6306] }
    },
    {
      type: "Feature",
      properties: { name: "Enugu", id: "NG-EN" },
      geometry: { type: "Point", coordinates: [7.4898, 6.4584] }
    },
    {
      type: "Feature",
      properties: { name: "Federal Capital Territory", id: "NG-FC" },
      geometry: { type: "Point", coordinates: [7.1951, 8.8741] }
    },
    {
      type: "Feature",
      properties: { name: "Gombe", id: "NG-GO" },
      geometry: { type: "Point", coordinates: [11.1693, 10.2841] }
    },
    {
      type: "Feature",
      properties: { name: "Imo", id: "NG-IM" },
      geometry: { type: "Point", coordinates: [7.0264, 5.4921] }
    },
    {
      type: "Feature",
      properties: { name: "Jigawa", id: "NG-JI" },
      geometry: { type: "Point", coordinates: [9.3602, 12.2280] }
    },
    {
      type: "Feature",
      properties: { name: "Kaduna", id: "NG-KD" },
      geometry: { type: "Point", coordinates: [7.4398, 10.5222] }
    },
    {
      type: "Feature",
      properties: { name: "Kano", id: "NG-KN" },
      geometry: { type: "Point", coordinates: [8.5874, 11.7574] }
    },
    {
      type: "Feature",
      properties: { name: "Katsina", id: "NG-KT" },
      geometry: { type: "Point", coordinates: [7.6223, 12.9857] }
    },
    {
      type: "Feature",
      properties: { name: "Kebbi", id: "NG-KE" },
      geometry: { type: "Point", coordinates: [4.1996, 11.4942] }
    },
    {
      type: "Feature",
      properties: { name: "Kogi", id: "NG-KO" },
      geometry: { type: "Point", coordinates: [6.7394, 7.7338] }
    },
    {
      type: "Feature",
      properties: { name: "Kwara", id: "NG-KW" },
      geometry: { type: "Point", coordinates: [4.5624, 8.4799] }
    },
    {
      type: "Feature",
      properties: { name: "Lagos", id: "NG-LA" },
      geometry: { type: "Point", coordinates: [3.3792, 6.5244] }
    },
    {
      type: "Feature",
      properties: { name: "Nasarawa", id: "NG-NA" },
      geometry: { type: "Point", coordinates: [8.4998, 8.4998] }
    },
    {
      type: "Feature",
      properties: { name: "Niger", id: "NG-NI" },
      geometry: { type: "Point", coordinates: [6.2222, 9.9309] }
    },
    {
      type: "Feature",
      properties: { name: "Ogun", id: "NG-OG" },
      geometry: { type: "Point", coordinates: [3.3515, 7.1604] }
    },
    {
      type: "Feature",
      properties: { name: "Ondo", id: "NG-ON" },
      geometry: { type: "Point", coordinates: [5.1979, 7.2754] }
    },
    {
      type: "Feature",
      properties: { name: "Osun", id: "NG-OS" },
      geometry: { type: "Point", coordinates: [4.5624, 7.5629] }
    },
    {
      type: "Feature",
      properties: { name: "Oyo", id: "NG-OY" },
      geometry: { type: "Point", coordinates: [3.9470, 8.1574] }
    },
    {
      type: "Feature",
      properties: { name: "Plateau", id: "NG-PL" },
      geometry: { type: "Point", coordinates: [9.2182, 9.2182] }
    },
    {
      type: "Feature",
      properties: { name: "Rivers", id: "NG-RI" },
      geometry: { type: "Point", coordinates: [6.8333, 4.8333] }
    },
    {
      type: "Feature",
      properties: { name: "Sokoto", id: "NG-SO" },
      geometry: { type: "Point", coordinates: [5.2322, 13.0622] }
    },
    {
      type: "Feature",
      properties: { name: "Taraba", id: "NG-TA" },
      geometry: { type: "Point", coordinates: [11.3642, 7.9994] }
    },
    {
      type: "Feature",
      properties: { name: "Yobe", id: "NG-YO" },
      geometry: { type: "Point", coordinates: [11.7659, 12.2939] }
    },
    {
      type: "Feature",
      properties: { name: "Zamfara", id: "NG-ZA" },
      geometry: { type: "Point", coordinates: [6.2378, 12.1857] }
    }
  ]
};

const jsonContent = JSON.stringify(nigeriaStates, null, 2);

fs.writeFileSync('nigeria-states.json', jsonContent);

console.log('nigeria-states.json has been created successfully.');
console.log('File contents:');
console.log(jsonContent);