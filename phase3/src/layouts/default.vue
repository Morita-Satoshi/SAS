<template>
  <v-app v-if="ready">
    <v-navigation-drawer v-model="drawer" :mini-variant="miniVariant" :clipped="clipped" fixed app>
      <v-list>
        <v-list-item v-for="(item, i) in items" :key="i" :to="item.to" router exact>
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <!-- <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? "right" : "left"}` }}</v-icon>
      </v-btn>-->
      <v-toolbar-title v-text="title" />
      <v-spacer />
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light>mdi-repeat</v-icon>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      ready: false,
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: "mdi-apps",
          title: "TOP",
          to: "/"
        },
        {
          icon: "mdi-baseball",
          title: "比べてみよう",
          to: "/compare"
        },
        {
          icon: "mdi-cloud-upload",
          title: "記録しよう",
          to: "/upload"
        },
        {
          icon: "mdi-notebook",
          title: "勉強しよう",
          to: "/study"
        },
        {
          icon: "mdi-apps",
          title: "振り返り",
          to: "/dashboard"
        },
        {
          icon: "mdi-apps",
          title: "自分を知ろう",
          to: "/knowyourself"
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "子どものぼ～る"
    };
  },
  created() {
    if (this.$store.getters["user/authenticated"]) {
      this.$store
        .dispatch("user/verify")
        .then(() => {
          this.ready = true;
        })
        .catch(() => {
          this.$router.push("/login");
        });
    } else {
      this.$router.push("/login");
    }
  },
  methods: {
    onOpenlogoutDialog: async function(item) {
      if (await this.$refs.logoutDialog.open(item)) {
        this.$router.push("/login");
      }
    },
    refresh: function() {
      location.reload();
    }
  }
};
</script>
