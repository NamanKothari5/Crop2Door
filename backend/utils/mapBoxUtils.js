module.exports.getCoordinates = async (address, pincode) => {
  const baseURl = process.env.MAPBOX_BASE_URL;
  const token = process.env.MAPBOX_TOKEN;
  const response = await fetch(
    `${baseURl}/geocoding/v5/mapbox.places/${
      address + "," + pincode
    }.json?limit=1&access_token=${token}`
  );

  if (response.ok) {
    const jsonData = await response.json();
    return jsonData.features[0].center;
  } else throw Error("Error retrieving coordinates");
};

const generateClusters = (
  required,
  farms,
  idx,
  currClusterQuantity,
  currCluster,
  allClusters
) => {
  if (idx === farms.length) {
    for (const [crop, reqQuantity] of Object.entries(required)) {
      if (
        !(crop in currClusterQuantity) ||
        currClusterQuantity[crop] < reqQuantity
      )
        return;
    }
    allClusters.push([...currCluster]);
    return;
  }

  let possible = false;
  for (const [crop, reqQuantity] of Object.entries(required)) {
    if (
      crop in currClusterQuantity &&
      currClusterQuantity[crop] === reqQuantity
    )
      continue;
    else if (!(crop in farms[idx])) continue;
    else {
      possible = true;
      break;
    }
  }

  generateClusters(
    required,
    farms,
    idx + 1,
    { ...currClusterQuantity },
    [...currCluster],
    allClusters
  );
  if (possible) {
    for (const [crop, quantity] of Object.entries(farms[idx])) {
      if (!(crop in required)) continue;
      else if (
        crop in currClusterQuantity &&
        currClusterQuantity[crop] === required[crop]
      )
        continue;
      else {
        currClusterQuantity[crop] = Math.min(
          currClusterQuantity[crop] + quantity,
          required[crop]
        );
      }
    }
    currCluster.push(idx);
    generateClusters(
      required,
      farms,
      idx + 1,
      { ...currClusterQuantity },
      [...currCluster],
      allClusters
    );
  }
};

module.exports.generateClusters = generateClusters;

class PriorityQueue {
  constructor() {
    this.heap = [];
  }

  push(element) {
    this.heap.push(element);
    this.heap.sort((a, b) => b[0] - a[0]);
  }

  pop() {
    if (this.isEmpty()) {
      return null;
    }
    return this.heap.pop();
  }

  isEmpty() {
    return this.heap.length === 0;
  }
}

function popcount(num) {
  let count = 0;
  while (num !== 0) {
    count += num & 1;
    num >>>= 1;
  }
  return count;
}

module.exports.findCluster = (v, clusters) => {
  // const n = 6;
  // const v = Array.from({ length: n + 1 }, () => Array(n + 1).fill(0));
  // v[0] = [0, 4, 1, 80, 82, 90, 31];
  // v[1] = [3, 0, 5, 83, 85, 87, 32];
  // v[2] = [4, 2, 0, 100, 95, 92, 35];
  // v[3] = [83, 85, 97, 0, 5, 5, 60];
  // v[4] = [87, 79, 97, 4, 0, 11, 57];
  // v[5] = [91, 83, 90, 3, 9, 0, 63];
  // v[6] = [30, 31, 35, 60, 62, 65, 0];

  // const clusters = [
  //     [6, 0, 1, 2],
  //     [6, 3, 4, 5]
  // ];

  let res = Infinity;
  let finalPath = [];

  clusters.forEach((cluster) => {
    const sz = cluster.length;
    // Creating adjacency list from given distance matrix
    const adj = Array.from({ length: sz }, () => []);
    for (let j = 0; j < sz; j++) {
      for (let k = j + 1; k < sz; k++) {
        const wt = v[cluster[j]][cluster[k]];
        const wt2 = v[cluster[k]][cluster[j]];
        adj[j].push([k, wt]);
        adj[k].push([j, wt2]);
      }
    }

    // Defining max heap and cost array
    const pq = new PriorityQueue();
    const cost = Array.from({ length: sz }, () => Array(1 << sz).fill(1e9));

    // dl = Index of delivery location
    const dl = 0;
    // Consider source as all points except for delivery location
    for (let i = 1; i < sz; i++) {
      pq.push([0, i, 1 << i, [i]]);
      cost[i][1 << i] = 0;
    }

    // This will contain ans of current cluster
    let currAns = Infinity;
    let thisPath = [];

    while (!pq.isEmpty()) {
      let [dist, node, mask, path] = pq.pop();
      dist = -1 * dist;
      // If current node is dl then update the ans
      if (node === dl) {
        if (dist < currAns) {
          currAns = dist;
          thisPath = path;
        }
      }

      // Traverse the unvisited neighbours of current node
      for (const [next, wt] of adj[node]) {
        const nextMask = mask | (1 << next);
        if (next === dl && popcount(nextMask) !== sz) continue;

        const currPath = path.concat(next);
        if (cost[node][mask] + wt < cost[next][nextMask]) {
          cost[next][nextMask] = cost[node][mask] + wt;
          pq.push([-cost[next][nextMask], next, nextMask, currPath]);
        }
      }
    }

    if (currAns < res) {
      res = currAns;
      finalPath = thisPath.map((k) => cluster[k]);
    }
  });

  return { min_dist: res, finalPath };
};
