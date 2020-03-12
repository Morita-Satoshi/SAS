<template>
  <div v-if="isPrepare">
    <html>
      <div class="column">
        <h3>振り返ろう！！</h3>
        <chart :score="score" :date="date"></chart>
      </div>
      <body>
        <div id="app"></div>
        <!-- built files will be auto injected -->
      </body>
      <h3>昔のコメント</h3>
      <li v-for="item in this.comment">{{ item }}</li>
    </html>
  </div>
</template>

<script>
import api from "../store/api.js";
import Chart from "../components/Chart";
export default {
  components: {
    Chart
  },
  mounted() {},
  created() {
    console.log("create");
    var self = this;
    self.getSelfEvaluate();
  },
  data() {
    return {
      comment: [],
      score: [],
      date: [],
      isPrepare: false
    };
  },
  methods: {
    getSelfEvaluate: function() {
      api.get("/user/self-evaluate").then(resp => {
        var tmpScoreArray = [];
        var tmpDateArray = [];
        var tmpCommentArray = [];
        for (var i = 0; i < resp.data.length; i++) {
          tmpScoreArray.push(resp.data[i].score);
          var convertDate = this.convertUnixTimetoDate(resp.data[i].datetime);
          tmpDateArray.push(convertDate);
          tmpCommentArray.push(resp.data[i].comment);
        }
        this.score = tmpScoreArray;
        this.date = tmpDateArray;
        this.comment = tmpCommentArray;
        this.isPrepare = true;
      });
    },
    //return to m/d
    convertUnixTimetoDate(unixTime) {
      let dateTime = new Date(unixTime * 1000);
      var month = dateTime.getMonth() + 1;
      var date = dateTime.getDate();
      return month + "/" + date;
    }
  }
};
</script>
