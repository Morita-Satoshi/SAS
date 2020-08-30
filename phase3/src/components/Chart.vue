<script>
import { Bar } from "vue-chartjs";

export default {
  extends: Bar,
  name: "chart",
  props: ["date", "score"],
  data() {
    return {
      data: {
        labels: this.date,
        datasets: [
          {
            label: "点数",
            data: this.score,
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",

            borderWidth: 1,
          },
          {
            label: "子どもの成長曲線",
            data: this.score,
            borderColor: "#5A7987",
            fill: false,
            type: "line",
            lineTension: 0.3,
          },
        ],
      },
      options: {
        scales: {
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "Date",
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                stepSize: 10,
              },
            },
          ],
        },
      },
    };
  },
  mounted() {
    this.renderChart(this.data, this.options);
  },
};
</script>
