module.exports.getCoordinates = async (address, pincode) => {
  const baseURl = process.env.MAPBOX_BASE_URL || 'https://api.mapbox.com';
  const token = process.env.MAPBOX_TOKEN || 'pk.eyJ1IjoibmlzaHRhbiIsImEiOiJja3ZkcGNmZWg0d25wMm5xd2RkcDBzeHVsIn0.irJll1qHLs4XBFONtsVYFA';

  const response = await fetch(
    `${baseURl}/geocoding/v5/mapbox.places/${address + "," + pincode
    }.json?limit=1&access_token=${token}`
  );

  if (response.ok) {
    const jsonData = await response.json();
    return jsonData.features[0].center;
  } else throw Error("Error retrieving coordinates");
};

const generateClusters = (required, farms, idx, currClusterQuantity, currCluster, allClusters, totalProduce) => {
  if (idx === farms.length) {
    for (const [crop, reqQuantity] of Object.entries(required)) {
      if (!(crop in currClusterQuantity) || currClusterQuantity[crop] < reqQuantity)
        return;
    }
    allClusters.push([...currCluster]);
    return;
  }

  let possible = false;
  for (const [crop, reqQuantity] of Object.entries(required)) {
    if (crop in currClusterQuantity && currClusterQuantity[crop] == reqQuantity)
      continue;
    else if (!(crop in farms[idx]))
      continue;
    else {
      possible = true;
      break;
    }
  }

  generateClusters(required, farms, idx + 1, { ...currClusterQuantity }, [...currCluster], allClusters, totalProduce);
  if (possible) {
    let quantityPurchased = 0;
    for (const [crop, quantity] of Object.entries(farms[idx])) {
      if (!(crop in required))
        continue;
      else if (crop in currClusterQuantity && currClusterQuantity[crop] === required[crop])
        continue;
      else if (currClusterQuantity[crop] + quantity <= required[crop])
        quantityPurchased += quantity, currClusterQuantity[crop] += quantity;
      else {
        quantityPurchased += (required[crop] - currClusterQuantity[crop]), currClusterQuantity[crop] += (required[crop] - currClusterQuantity[crop]);
      }
    }
    
    
    currCluster.push([idx, quantityPurchased / totalProduce[idx]]);
    generateClusters(required, farms, idx + 1, { ...currClusterQuantity }, [...currCluster], allClusters, totalProduce);
  }
}
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

  let res = Infinity;
  let finalPath = [];

  clusters.forEach((cluster) => {
    const sz = cluster.length;
    const adj = Array.from({ length: sz }, () => []);
    for (let j = 0; j < sz; j++) {
      for (let k = j + 1; k < sz; k++) {
        const wt = v[cluster[j][0]][cluster[k][0]];
        const wt2 = v[cluster[k][0]][cluster[j][0]];
        adj[j].push([k, wt]);
        adj[k].push([j, wt2]);
      }
    }

    const pq = new PriorityQueue();
    const cost = Array.from({ length: sz }, () => Array(1 << sz).fill(1e9));

    const dl = 0;
    for (let i = 1; i < sz; i++) {
      pq.push([0, i, 1 << i, [i]]);
      cost[i][1 << i] = 1.0/cluster[i][1];
    }

    let currAns = Infinity;
    let thisPath = [];

    while (!pq.isEmpty()) {
      let [dist, node, mask, path] = pq.pop();
      dist = -1 * dist;
      if (node === dl) {
        if (dist < currAns) {
          currAns = dist;
          thisPath = path;
        }
      }

      for (const [next, wt] of adj[node]) {
        const nextMask = mask | (1 << next);
        if (next === dl && popcount(nextMask) !== sz) continue;

        const currPath = path.concat(next);
        if (cost[node][mask] + wt*(1 + 1.0/cluster[next][1]) < cost[next][nextMask]) {
          cost[next][nextMask] = cost[node][mask] + wt*(1+1.0/cluster[next][1]);
          pq.push([-cost[next][nextMask], next, nextMask, currPath]);
        }
      }
    }
    
    if (currAns < res) {
      res = currAns;
      finalPath = thisPath.map(k => cluster[k][0]);
    }
  });
  
  res=0;

  for(let i=1;i<finalPath.length;i++)
  res+=v[finalPath[i-1]][finalPath[i]];

  return { min_dist: res, finalPath };
};
