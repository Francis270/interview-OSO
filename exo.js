// Ne pas utiliser ces données directement, mais les récupérer avec la méthode fetch
const database = {
  devices: {
    device1: {
      location: "Londres",
      name: "first",
    },
    device2: {
      location: "Paris",
      name: "second",
    },
    device3: {
      location: "Madrid",
      name: "tercero",
    },
    device4: {
      location: "Paris",
      name: "quatrième",
    },
    device5: {
      location: "Londres",
      name: "fith",
    },
  },

  events: {
    device3: "Evenemento tres",
    device1: "Event one",
    device5: "Event five",
    device2: "Evénement 2",
  },
};

// Utiliser cette méthode pour récupérer les données de la "base de données"
async function fetch(path) {
  function fetchRec(path, object) {
    if (path.startsWith("/")) path = path.slice(1);
    if (path.length === 0) return object;
    const i = path.indexOf("/");
    if (i > 0) {
      const key = path.substring(0, i);
      return fetchRec(path.slice(i), object[key]);
    }
    return object[path];
  }

  return fetchRec(path, database);
}

async function testFetch() {
  function checkKeys(object, keys) {
    assert(Object.keys(object).length === keys.length);
    for (const key in object) assert(keys.includes(key));
  }

  async function checkFetch(path, keys) {
    const result = await fetch(path);
    checkKeys(result, keys);
    console.log(`✅ ${path}`);
  }

  checkFetch("", ["devices", "events"]);
  checkFetch("devices", [
    "device1",
    "device2",
    "device3",
    "device4",
    "device5",
  ]);
  checkFetch("devices/device1", ["name", "location"]);
}

// testFetch()

async function report() {
  const eventByCity = {};
  const events = await fetch("events");

  for (const device of Object.keys(events)) {
    const deviceData = await fetch(`devices/${device}`);
    const location = deviceData["location"];

    if (!Object.keys(eventByCity).includes(location)) {
      eventByCity[location] = [];
    }
    eventByCity[location].push(events[device]);
  }
  return eventByCity;
}

async function testReport() {
  const result = await report();
  console.log(result);
}

testReport();