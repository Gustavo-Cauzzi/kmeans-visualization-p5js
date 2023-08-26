const generateRandomPosition = (xConfig, yConfig) => {
    return {
        x: (xConfig ? xConfig.min : 0) + Math.random() * (xConfig ? xConfig.max - xConfig.min : innerWidth),
        y: (yConfig ? yConfig.min : 0) + Math.random() * (yConfig ? yConfig.max - yConfig.min : innerHeight),
    };
};
const variation = 275;
const maxPointsPerCluster = { min: 20, max: 35 };
const centroidsQtd = 5;

const fakeCentroids = [...Array(centroidsQtd).keys()].map(() => generateRandomPosition());
const points = fakeCentroids
    .map((fakeCentroid) =>
        [
            ...Array(
                Math.floor(
                    maxPointsPerCluster.min + Math.random() * (maxPointsPerCluster.max - maxPointsPerCluster.min)
                )
            ).keys(),
        ].map(() =>
            generateRandomPosition(
                {
                    min: Math.max(fakeCentroid.x - variation / 2, 0),
                    max: Math.min(fakeCentroid.x + variation / 2, innerWidth),
                },
                {
                    min: Math.max(fakeCentroid.y - variation / 2, 0),
                    max: Math.min(fakeCentroid.y + variation / 2, innerHeight),
                }
            )
        )
    )
    .flat();

let centroids = [...Array(centroidsQtd).keys()].map(() => generateRandomPosition());
const colors = ["#f00", "#0f0", "#00f", "#f0f", "#0ff", "#ff0"];
let clusters = [...Array(centroidsQtd).keys()].map(() => []);
let pointsCentroid = [];

function setup() {
    createCanvas(innerWidth, innerHeight);
}

function draw() {
    frameRate(60);
    background(240);
    strokeWeight(1);
    fill("#ccc");

    getClosestCentroidsOfEachPoint();

    points.forEach((point, i) => {
        stroke(colors[closestCentroids[i]]);
        circle(point.x, point.y, 10);
    });

    strokeWeight(2);
    centroids.forEach((centroid, i) => {
        fill(colors[i]);
        stroke(colors[i]);
        circle(centroid.x, centroid.y, 15);
    });
}

const zardoLixoDistance = (x1, y1, x2, y2) => (x2 - x1) ** 2 + (y2 - y1) ** 2;

function getClosestCentroidsOfEachPoint() {
    closestCentroids = points.map((point) => {
        const index = centroids.reduce(
            (closest, currCentroid, centroidIndex) => {
                const d = zardoLixoDistance(point.x, point.y, currCentroid.x, currCentroid.y);
                return closest.dist > d ? { index: centroidIndex, dist: d } : closest;
            },
            { index: 0, dist: Infinity }
        ).index;
        clusters[index].push(point);
        return index;
    });
}

function recalculateCentroids() {
    centroids = centroids.map((centroid, centroidIndex) => {
        if (clusters[centroidIndex].length === 0) return centroid;
        const sum = clusters[centroidIndex].reduce((acc, curr) => ({ x: acc.x + curr.x, y: acc.y + curr.y }), {
            x: 0,
            y: 0,
        });
        return { x: sum.x / clusters[centroidIndex].length, y: sum.y / clusters[centroidIndex].length };
    });
    getClosestCentroidsOfEachPoint();
}
