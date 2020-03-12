<template>
<div v-if="isPrepare">
  <html>
    <div class="column">
      <chart :score="score" :date="date"></chart>
    </div>
    <body>
      <div id="app"></div>
      <!-- built files willu be auto injected -->
    </body>
    <div>
      <table border="2">
        <thead>
          <tr>
            <th>日付</th>
            <th>コメント</th>
            <th>点数</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="row in this.Items">
            <td>{{row.date}}</td>
            <td>{{row.comment}}</td>
            <td>{{row.score}}</td>
          </tr>
        </tbody>
      </table>
    </div>
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
      items: [],
      isPrepare: false
    };
  },
  methods: {
    getSelfEvaluate: function() {
      api.get("/user/self-evaluate").then(resp => {
        var tmpScoreArray = [];
        var tmpDateArray = [];
        var tmpCommentArray = [];
        var tmpItemsArray = [];
        for (var i = 0; i < resp.data.length; i++) {
          tmpScoreArray.push(resp.data[i].score);
          var convertDate = this.convertUnixTimetoDate(resp.data[i].datetime);
          tmpDateArray.push(convertDate);
          tmpCommentArray.push(resp.data[i].comment);
          tmpItemsArray.push({
            date: convertDate,
            comment: resp.data[i].comment,
            score: resp.data[i].score
          });
        }
        this.score = tmpScoreArray;
        this.date = tmpDateArray;
        this.comment = tmpCommentArray;
        this.Items = tmpItemsArray;
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
