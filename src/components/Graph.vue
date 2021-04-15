<template>
<div class="graph">
  <svg
    :viewBox="`0 0 ${vWidth} ${vHeight}`"
    preserveAspectRatio="none"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <line
      v-for="i in yLines"
      :key="i"
      class="y-grid"
      x1="0"
      :y1="yLineLoc(i - 1)"
      :x2="vWidth"
      :y2="yLineLoc(i - 1)"
    />
    <path class="graph-fill" :d="fillPath" />
    <line
      v-for="i in graphPoints.length - 1"
      :key="i"
      class="graph-line"
      :x1="graphPoints[i - 1].x"
      :y1="graphPoints[i - 1].y"
      :x2="graphPoints[i].x"
      :y2="graphPoints[i].y"
    />
    <circle
      v-for="(point, idx) in graphPoints"
      :key="idx"
      :cx="point.x"
      :cy="point.y"
      r="1.7"
      class="graph-point"
    />
  </svg>
</div>
</template>

<script>
import { toRefs, computed } from 'vue';

const minMax = (points) => {
  let min = Number.MAX_SAFE_INTEGER;
  let max = 0;
  for(let i = 0; i < points.length; i += 1) {
    const val = points[i].staked;
    if(val < min) {
      min = val;
    }
    if(val > max) {
      max = val;
    }
  }
  return { min, max };
};

const round = n => Math.round(n * 10000) / 10000;

export default {
  name: 'graph',
  props: {
    points: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const { points } = toRefs(props);
    const vWidth = 400;
    const vHeight = 100;
    const xGutter = 5;
    const yGutter = 5;
    const yLines = 5;
    const yLineLoc = i => (
      Math.min(vHeight - 1, (vHeight / (yLines - 1)) * i)
    );
    const xWindow = vWidth - (2 * xGutter);
    const graphPoints = computed(() => {
      const { min, max } = minMax(points.value);
      const vWindow = vHeight - (2 * yGutter);
      return points.value.map((p, i) => ({
        x: round(xGutter + (i * (xWindow / (points.value.length - 1)))),
        y: round((vWindow - vWindow * ((p.staked - min) / (max - min)))) + yGutter,
      }));
    });
    const fillPath = computed(() => (
      `M ${vWidth - xGutter},${vHeight - 1} L ${xGutter},${vHeight - 1}` +
      graphPoints.value.reduce((prev, cur) => (
        prev + `L ${cur.x},${cur.y} `
      ), '')
      + 'Z'
    ));
    return {
      vWidth,
      vHeight,
      yLines,
      yLineLoc,
      graphPoints,
      fillPath,
    };
  },
};
</script>

<style lang="postcss">
@import '/src/assets/css/global.css';

.graph {
  margin-top: 24px;
  .y-grid {
    stroke: $grey3;
    opacity: 0.5;
    stroke-width: 0.4;
  }
  .graph-line {
    stroke: $blue;
    stroke-width: 1;
  }
  .graph-point {
    fill: $blue;
  }
  .graph-fill {
    fill: rgba(162, 162, 162, 0.25);
  }
}
</style>
