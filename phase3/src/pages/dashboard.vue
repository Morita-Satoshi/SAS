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
            <th>フォーム</th>
            <th>コメント</th>
            <th>点数</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="row in this.Items">
            <td>{{row.date}}</td>
            <td>
              <div v-if="row.motion==1">
                <img :src="displayImages[0].tab" class="resize-for-mobile" />
              </div>
              <div v-else-if="row.motion==2">
                <img :src="displayImages[1].tab" class="resize-for-mobile" />
              </div>
              <div v-else-if="row.motion==3">
                <img :src="displayImages[2].tab" class="resize-for-mobile" />
              </div>
              <div v-else-if="row.motion==4">
                <img :src="displayImages[3].tab" class="resize-for-mobile" />
              </div>
              <div v-else-if="row.motion==5">
                <img :src="displayImages[4].tab" class="resize-for-mobile" />
              </div>
              <div v-else></div>
            </td>
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
      motion: [],
      items: [],
      isPrepare: false,
      displayImages: [
        { tab: "/study_tab_1.jpg", contents: "/study_contents_1.jpg" },
        { tab: "/study_tab_2.jpg", contents: "/study_contents_2.jpg" },
        { tab: "/study_tab_3.jpg", contents: "/study_contents_3.jpg" },
        { tab: "/study_tab_4.jpg", contents: "/study_contents_4.jpg" },
        { tab: "/study_tab_5.jpg", contents: "/study_contents_5.jpg" }
      ]
    };
  },
  methods: {
    getSelfEvaluate: function() {
      api.get("/user/self-evaluate").then(resp => {
        var tmpScoreArray = [];
        var tmpDateArray = [];
        var tmpCommentArray = [];
        var tmpItemsArray = [];
        var tmpMotionArray = [];
        for (var i = 0; i < resp.data.length; i++) {
          tmpScoreArray.push(resp.data[i].score);
          var convertDate = this.convertUnixTimetoDate(resp.data[i].datetime);
          tmpDateArray.push(convertDate);
          tmpCommentArray.push(resp.data[i].comment);
          tmpMotionArray.push(resp.data[i].motion);
          tmpItemsArray.push({
            date: convertDate,
            comment: resp.data[i].comment,
            score: resp.data[i].score,
            motion: resp.data[i].motion
          });
        }
        this.motion = tmpMotionArray;
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
