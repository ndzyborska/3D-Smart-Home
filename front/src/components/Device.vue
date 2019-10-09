<template>
  <div id="container">
    <div></div>
    <svg viewBox="0 0 100 100">
      <defs>
        <g id="lines" style="stroke: black;">
          <line x1=" 45" x2=" 49" />
          <line x1="-45" x2="-49" />
          <line y1=" 45" y2=" 49" />
          <line y1="-45" y2="-49" />
        </g>
      </defs>
      <g transform="translate(50 50)">
        <use xlink:href="#lines" transform="rotate( 0)" />
        <use xlink:href="#lines" transform="rotate( 30)" />
        <use xlink:href="#lines" transform="rotate( 60)" />
      </g>
      <circle
        id="circle"
        cx="50%"
        cy="50%"
        :r="device.radius"
        fill="transparent"
        stroke="black"
        stroke-width="1"
      />
      <circle id="circle" cx="50%" cy="50%" :r="device.radius*0.9" fill="#FDB900" />
      <circle
        id="outer_white"
        stroke="black"
        :stroke-dasharray="device.data[0].stroke[0]"
        :style="{ strokeDashoffset: device.data[0].offset[0] }"
        :stroke-width="3"
        fill="transparent"
        :r="device.radius*0.7"
        cx="50%"
        cy="50%"
      />
      <circle
        id="outer"
        stroke="white"
        :stroke-dasharray="device.data[0].stroke[1]"
        :stroke-width="getWidth"
        fill="transparent"
        :r="device.radius*0.7"
        cx="50%"
        cy="50%"
      />
      <circle
        id="red"
        :stroke="strokeColor"
        :stroke-dasharray="device.data[0].stroke[2]"
        :stroke-width="getWidth"
        fill="transparent"
        :r="device.radius*0.7"
        cx="50%"
        cy="50%"
      />
    </svg>

    <button @click="modalShow = !modalShow" class="button" :style="color">
      <img id="img" :src="icon" />
    </button>
    <b-modal size="xl" v-model="modalShow" :title="name">
      <p style="text-align: center"></p>
      <v-row align="center">
        <v-col class="text-center" sm="4">
          <switches
            v-model="enabled"
            type-bold="true"
            text-enabled="Switched On"
            text-disabled="Switched Off"
            color="green"
          ></switches>
        </v-col>
        <v-col class="text-center" sm="4">
          <b-button
            @click="scheduleShow = !scheduleShow"
            color="green"
            text
            large
          >Schedule your device</b-button>
        </v-col>

        <v-col style="border: solid" top="true" class="text-center" sm="4">
          <b class="my-2">Personalized tip:</b>
          <p class="my-2">{{tip}}</p>
        </v-col>
      </v-row>
    </b-modal>
    <b-modal v-model="scheduleShow" title="Schedule Your Device" @ok="handleOk">
      You want your device to turn
      <switches
        v-model="scheden"
        type-bold="true"
        text-enabled="   ON"
        text-disabled="   OFF"
        color="green"
      ></switches>at this date and time:
      <date-pick
        v-model="date"
        :pickTime="true"
        :hasInputElement="false"
        :format="'YYYY-MM-DD HH:mm'"
      ></date-pick>
    </b-modal>
  </div>
</template>
 <style>
.button {
  position: relative;
  width: 45px;
  height: 45px;
  border: solid;
  bottom: 78px;
  border-radius: 50%;
}

#img {
  width: 70%;
  height: 70%;
}
#outer {
  transition: stroke-dashoffset 0.35s;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
}
#red {
  transition: stroke-dashoffset 0.35s;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
}
#outer_white {
  transition: stroke-dashoffset 0.35s;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
}
#inner {
  transition: stroke-dashoffset 0.35s;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
}
#svg {
  width: 100%;
  height: 100%;
}
</style>

<script>
import Switches from "vue-switches";
import DatePick from "vue-date-pick";
import "vue-date-pick/dist/vueDatePick.css";

export default {
  components: {
    Switches,
    DatePick
  },
  props: ["device", "circ"],
  data() {
    var name =
      "Your" + " " + this.device.name + " in the " + this.device.roomName;
    var average = 0;
    var beautifulWeather = true;

    return {
      date: "2019-08-28 14:30",
      scheden: false,
      enabled: false,
      name,
      beautifulWeather,
      background: true,

      scheduleShow: false,
      modalShow: false
    };
  },

  watch: {
    enabled: function() {
      this.$socket.emit(this.device.id, this.enabled);
    }
  },
  methods: {
    handleOk(bvModalEvt) {
      this.handleSubmit();
    },
    handleSubmit() {
      setInterval(() => {
        var timeNow = new Date();
        var datetime = new Date(this.date);

        if (
          timeNow.getHours() === datetime.getHours() &&
          timeNow.getMinutes() === datetime.getMinutes()
        ) {
          this.enabled = this.scheden;
          clearInterval();
        }
      }, 60000);
    },

    changeGreen: function() {
      this.$socket.emit(this.device.id, this.greenState);
      this.greenState = !this.greenState;
    },
    getWaste: function() {
      var amount = 0;
      var accum = 0;
      var startTime = 0;
      var endTime = 0;
      var time = 0;
      var array = this.device.data[0].stroke[2].split(" ");

      for (var i = 0; i < array.length; i++) {
        var num = parseInt(array[i]);

        if (i % 2 == 0) {
          if (amount < num) {
            amount = num;
            startTime = time;
            endTime = startTime + amount;
          }
          accum = accum + num;
        }
        time += num;
      }
      return { waste: accum, start: startTime, end: endTime };
    }
  },
  mounted: function() {
    this.enabled = this.device.data[0].timeSeries[
      this.device.data[0].timeSeries.length - 1
    ].on;
  },
  computed: {
    strokeColor: function() {
      if (this.device.name == "dish" || this.device.name == "washer") {
        return "blue";
      }
      return "red";
    },
    tip: function() {
      var rate = 2.83;
      var waste = this.getWaste();
      switch (this.device.name) {
        case "oven": {
          var trees = ((300 / 365) * 0.28307) / 0.06027;

          return (
            "Putting lids on saucepans: could be eqilvent of planting" +
            Math.roudn(trees) +
            " trees!"
          );
          trees = (0.167 * 0.28307) / 0.06027;

          return (
            "Filling the oven when on could be eqilvent of planting " +
            Math.roudn(trees) +
            " trees per year!"
          );
        }
        case "dish": {
          if (
            ((waste.waste / parseInt(this.circ)) * 24 * this.device.grade) /
              1000 >
            2.1
          ) {
            return (
              "You would have saved more trees if you used your Dish Washer at off-peak hours.\n" +
              "Today you used it at around " +
              Math.round((waste.start / this.circ) * 24) +
              ":00 o'clock.\n" +
              "Consider schduling your Dish washer instead."
            );
          }
          if (this.device.data[0].energy > this.device.grade / 1000) {
            var trees = (this.device.data[0].energy * 0.3 * 0.28307) / 0.06027;

            return (
              "Did you know that using the eco-setting instead you could plant you " +
              Math.round(trees) +
              " trees a week or " +
              Math.round(trees) +
              " a year!"
            );
          }
          if (this.device.weekfreq > 7) {
            var trees =
              ((((this.device.weekfreq - 7) * this.device.grade) / 1000) *
                0.28307) /
              0.06027;

            return (
              "Filling up your dishwasher to it's fullest would be equivilent to planting " +
              Math.round(trees) +
              " every !"
            );
          }
          break;
        }

        case "kettle": {
          if (this.device.data[0].energy > 0.5) {
            var trees = (200 * 0.28307) / 0.06027;

            return (
              "Filling up your kettle to only level required can be equivilent to planting " +
              Math.round(trees / 365) +
              " trees!" //estimate as it is not possible to test how full kettles are
            );
          }
          break;
        }
        case "temp": {
          if (
            ((waste.waste / parseInt(this.circ)) * 24 * this.device.grade) /
              1000 >
            2.1
          ) {
            var trees =
              ((((waste.waste / parseInt(this.circ)) * 24 * this.device.grade) /
                1000) *
                0.28307) /
              0.06027;
            console.log(
              ((waste.waste / parseInt(this.circ)) * 24 * this.device.grade) /
                1000
            );

            return (
              "You have used your heating for around " +
              Math.round((waste.waste / parseInt(this.circ)) * 24) +
              " hours today whilst you wern't in at around " +
              Math.round((waste.start / this.circ) * 24) +
              ":00 o'clock.\n" +
              "You could have saved " +
              Math.round(trees) +
              " an equivilent of trees today by turning it off in this room at that time."
            );
          }
          var trees = (this.device.data[0].energy * 0.28307) / 0.06027;

          if (this.average == 0 && this.device.data[0].energy > 0) {
            return (
              "It seems like you are using your heating in the " +
              this.device.room +
              "! Turning it off will be equivilent to planting " +
              trees +
              " trees per day!"
            );
          }

          if (this.device.data[0].energy > this.average && this.average > 5) {
            var trees = (4.1 * 0.28307) / 0.06027;

            return (
              "By turning your thermostat down by 1 degree would be equivilent to planting " +
              trees +
              " trees per day! Wear a wooly jumper :)"
            );
          }
        }
        case "fridge": {
          var trees = (70 * 0.28307) / 0.06027;

          return (
            "Lowering your fridge thermostat could plant the equivilent of " +
            Math.round((trees / 365) * 7) +
            " per week or " +
            Math.round(trees / 365) +
            " trees per year!"
          );
          break;
        }
        case "tv": {
          if ((waste.waste / parseInt(this.circ)) * 24 > 0.5) {
            var trees =
              ((((waste.waste / parseInt(this.circ)) * 24 * this.device.grade) /
                1000) *
                0.28307) /
              0.06027;
            return (
              "Looks like the TV has been on when you wernt around at about " +
              Math.round((waste.start / this.circ) * 24) +
              +" o'clock. Turning your TV off would have saved you " +
              trees +
              " trees today!"
            );
          }
          if (
            this.device.data[0].energy > (this.device.grade * 4) / 1000 &&
            background
          ) {
            return (
              "Swicthing your tv off instead of having it on in the background could be equivillent to saving " +
              trees +
              " per year!"
            );
          }
          if (
            this.device.data[0].energy > (this.device.grade * 4) / 1000 &&
            beautifulWeather
          ) {
            return "The weather is beautiful! Go outside for some adventure!";
          }
          break;
        }
        case "wash": {
          if (
            ((waste.waste / parseInt(this.circ)) * 24 * this.device.grade) /
              1000 >
            0.19
          ) {
            return (
              "You would have saved more energy if you used your washing machine at off-peak hours.\n" +
              "Today you used it at around " +
              Math.round((waste.start / this.circ) * 24) +
              ":00 o'clock.\n" +
              "Consider schduling your Dishwasher instead."
            );
          }
          var trees = (70 * 0.28307) / 0.06027;

          return (
            "Washing clothes at 40 degrees could save up to " +
            trees +
            " trees!"
          );
          break;
        }
        case "fan": {
          if ((waste.waste / parseInt(this.circ)) * 24 > 0.1) {
            var trees =
              ((((waste.waste / parseInt(this.circ)) * 24 * this.device.grade) /
                1000) *
                0.28307) /
              0.06027;
            return (
              "Looks like the TV has been on when you wernt around at about " +
              Math.round((waste.start / this.circ) * 24) +
              +" o'clock. Turning your TV off would have saved you " +
              trees +
              " trees today!"
            );
          }

          if ((this.device.data[0].energy * 1000) / this.device.grade > 5) {
            var trees = (3 * 0.28307) / 0.06027;
            return (
              "Putting your fan on a lower setting would have saved you " +
              +" trees today!"
            );
          }
          break;
        }
        case "light": {
          return "If you changed this light bulb from 60 watts to 11 watts, at average usage you would save £17 in one year";
        }
      }
    },
    icon: function() {
      return "/static/assets/" + this.device.name + ".png";
    },
    color: function() {
      if (this.device.room == 1) {
        return "background-color: #d81159;";
      }
      if (this.device.room == 2) {
        return "background-color: #006ba6;";
      }
      if (this.device.room == 3) {
        return "background-color: #8f2d56;";
      }
      if (this.device.room == 4) {
        return "background-color: #0496FF;";
      }
    },
    getWidth: function() {
      return this.device.grade / 160 + 3;
    }
  }
};
</script>
