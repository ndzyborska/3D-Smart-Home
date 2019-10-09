<template>
  <div id="ancestor">
    <div class="container-fluid" id="app">
      <div class="row">
        <div id="sidebar" class="col-md-3 col-sm-4 col-xs-12 sidebar">
          <svg viewBox="0 0 100 100" id="clock">
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
              r="45"
              fill="transparent"
              stroke="black"
              stroke-width="1"
            />
            <defs>
              <g id="gague" style="stroke: red;">
                <line x1=" 40" x2=" 55" />
              </g>
            </defs>
            <g transform="translate(50 50)">
              <use xlink:href="#gague" transform="rotate( 0)" />
            </g>
            <circle id="circle" cx="50%" cy="50%" r="40" fill="#FDB900" />
            <!-- This circle on the left was planned to be developed to show the peak-time of the day-->
          </svg>
          <div id="bar">
            <svg id="svgBar" viewBox="0 0 100 40" v-for="dev in orderedDevices" :key="dev.no">
              <circle r="10" cx="15" cy="20" fill="#FDB900" border="solid" />
              <image width="15" height="15" y="12.5" x="8" :xlink:href="getLink(dev.name)" />
              <rect :width="dev.data[0].energy*20" x="35" y="10" height="20" id="device" rx="3" />
            </svg>
          </div>
        </div>
        <div class="container">
          <div>
            <b-navbar toggleable="lg" type="dark" variant="info">
              <b-navbar-brand href="#">The 3D Home: Visualse and Control Your Energy Consumption</b-navbar-brand>

              <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

              <b-collapse is-nav id="pea">
                <b-navbar-nav class="ml-auto">
                  <b-nav-item v-on:click="model=false">Day View</b-nav-item>
                  <b-nav-item v-on:click="model=true">3D View</b-nav-item>
                </b-navbar-nav>
              </b-collapse>
            </b-navbar>
          </div>
          <div class="content">
            <div v-show="model">
              <canvas id="threeCanvas"></canvas>
            </div>
            <div v-show="!model">
              <div class="comps" v-for="dev in orderedRoom" v-bind:key="dev.id">
                <div v-if="checkRoom(dev.room)">
                  <div class="d">{{dev.roomName}}</div>
                  <Device class="devices" :device="dev" :circ="circumference"></Device>
                </div>
                <Device v-else class="devices" :device="dev" :circ="circumference"></Device>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <br />
  </div>
</template>

<script>
// This is the Main file. It contains all the calculations reqruired to make each SVG componenet
// Please note that there will be bugs with the SVGs depending on what time you are using the application.
// It is not designed to have objects pushed into the test data that go up and down in time
import Device from "./components/Device.vue";

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as io from "socket.io-client";

// THREE.js set up
var camera;
var renderer;
var raycaster = new THREE.Raycaster();
var scene;

// Three js lights set up for real time model, and boolean rotate to enable fan rotation
var rotate;
var lightsmodel = [];

// Drawing Lines
var lines = [];
var point1;

// To check for hover (so it doesn't repeatedly call the function)
var over = false;

// Materials for real time 3D model
var customMaterial, onMaterial, wasteMaterial;
var saveMat;

// Positioning
var room = 0;

var group;
export default {
  name: "App",
  components: {
    Device: Device
  },
  data() {
    var devices = [];
    const normalizedRadius = 45;
    const circumferenceMain = normalizedRadius * 2 * Math.PI;
    const circumference = circumferenceMain * 0.7;

    var time = 11 / 12; //sets to 11 for testing as all the visualisations look strange if there is data past the current time

    return {
      socket: io("localhost:3001"),
      devices,
      model: false,
      circumference,
      normalizedRadius,
      time,
      lights: [],
      temps: [],
      tv: [],
      washers: [],
      toast: [],
      fridges: [],
      dishes: [],
      blenders: [],
      showers: [],
      kettles: []
    };
  },
  computed: {
    orderedDevices: function() {
      // To order the devies in terms of energy usage so they render from high consuming to low
      return this.devices.slice().sort(function(a, b) {
        return b.data[0].energy - a.data[0].energy;
      });
    },
    orderedRoom: function() {
      // To ensure the device data visualisations are grouped by room
      return this.devices.slice().sort(function(a, b) {
        return a.room - b.room;
      });
    }
  },
  // Watcher to continuously update the model
  watch: {
    lights: {
      handler: function() {}
    },
    lights: {
      handler: function() {
        for (var i = 0; i < lightsmodel.length - 1; i++) {
          lightsmodel[i].visible = this.lights[i].data[0].timeSeries[
            this.lights[i].data[0].timeSeries.length - 1
          ].on;
        }
        this.lights.forEach(device => {
          if (
            device.data[0].timeSeries[device.data[0].timeSeries.length - 1]
              .on &&
            device.data[0].timeSeries[device.data[0].timeSeries.length - 1].bad
          ) {
            this.changeColor(device.id, "waste");
          } else if (
            device.data[0].timeSeries[device.data[0].timeSeries.length - 1].on
          ) {
            this.changeColor(device.id, "on");
          }
        });
      }
    },

    temps: {
      handler: function() {
        this.temps.forEach(device => {
          if (device.name == "fan") {
            rotate =
              device.data[0].timeSeries[device.data[0].timeSeries.length - 1]
                .on;
          }
          if (
            device.data[0].timeSeries[device.data[0].timeSeries.length - 1]
              .on &&
            device.data[0].timeSeries[device.data[0].timeSeries.length - 1].bad
          ) {
            this.changeColor(device.id, "waste");
          } else if (
            device.data[0].timeSeries[device.data[0].timeSeries.length - 1].on
          ) {
            this.changeColor(device.id, "on");
          }
        });
      }
    },
    tv: {
      handler: function() {
        this.tv.forEach(device => {
          if (device.name == "fan") {
            rotate =
              device.data[0].timeSeries[device.data[0].timeSeries.length - 1]
                .on;
          }
          if (
            device.data[0].timeSeries[device.data[0].timeSeries.length - 1]
              .on &&
            device.data[0].timeSeries[device.data[0].timeSeries.length - 1].bad
          ) {
            this.changeColor(device.id, "waste");
          } else if (
            device.data[0].timeSeries[device.data[0].timeSeries.length - 1].on
          ) {
            this.changeColor(device.id, "on");
          }
        });
      }
    }
  },

  methods: {
    // For new line of each "room" for the devices
    checkRoom: function(no) {
      if (no > room) {
        room = no;
        return true;
      }
      return false;
    },
    getLink: function(name) {
      return "/static/assets/" + name + ".png";
    },

    ////////////////////////////////////////////////////////////////////
    // PREVIOUSLY FOR GLOWING OBJECT WHEN THE CURSOR HOVERED OVER THE POLAR GRAPHS:
    ////////////////////////////////////////////////////////////////////

    // highlight(id) {
    //   if (!over) {
    //     over = true;
    //     this.changeColor(id, "hover");
    //   }
    // },
    // unlight(id) {
    //   over = false;

    //   var obj = this.getObject(id);
    //   if (obj) {
    //     if (obj.type == "Group") {
    //       for (j = 0; j < obj.children.length; j++) {
    //         if (obj.children[j].saveMat) {
    //           obj.children[j].material = obj.children[j].saveMat;
    //         }
    //       }
    //       return;
    //     }
    //     if (obj.saveMat) {
    //       obj.material = obj.saveMat;
    //     }
    //   }
    // },

    ////////////////////////////////////////////////////////////////////
    //                Update 3D objects color based on their state
    ////////////////////////////////////////////////////////////////////

    changeColor: function(id, string) {
      var obj = this.getObject(id);
      if (obj) {
        // if (string == "hover") {
        //   if (obj.type == "Group") {
        //     for (j = 0; j < obj.children.length; j++) {
        //       if (obj.children[j].material.type == "MeshStandardMaterial") {
        //         obj.children[j].saveMat = obj.children[j].material;
        //       }
        //       obj.children[j].material = customMaterial;
        //     }
        //     return;
        //   }
        //   if (obj.children[j].material.type == "MeshStandardMaterial") {
        //     obj.saveMat = obj.material;
        //   }
        //   obj.material = customMaterial;
        // }
        if (string == "on") {
          if (obj.type == "Group") {
            for (var j = 0; j < obj.children.length; j++) {
              if (obj.children[j].material.type == "MeshStandardMaterial") {
                obj.children[j].saveMat = obj.children[j].material;
              }
              obj.children[j].material = wasteMaterial;
            }
            return;
          }
          if (obj.material.type == "MeshStandardMaterial") {
            obj.saveMat = obj.material;
          }
          obj.material = wasteMaterial;
        }
        if (string == "waste") {
          if (obj.type == "Group") {
            for (var j = 0; j < obj.children.length; j++) {
              if (obj.children[j].material.type == "MeshStandardMaterial") {
                obj.children[j].saveMat = obj.children[j].material;
              }
              obj.children[j].material = onMaterial;
            }
            return;
          }
          if (obj.material.type == "MeshStandardMaterial") {
            obj.saveMat = obj.material;
          }
          obj.material = onMaterial;
        }
      }
    },
    ////////////////////////////////////////////////////////////////////
    //            Loads the glTF model that was created in Blender
    ////////////////////////////////////////////////////////////////////
    loader: function() {
      var light = new THREE.HemisphereLight(0xffffff, 5);
      light.position.set(0, 40, 0);

      var loader = new GLTFLoader();

      loader.load(
        "/static/assets/blender-model.glb",
        gltf => {
          scene = gltf.scene;
          this.init();
          scene.add(light);
          light.position.set(0, 400, 0);
          this.setUpLines();
          this.setupLights();
          this.animate();
        },
        undefined,
        function(error) {
          console.error(error);
        }
      );
    },

    init: function() {
      var width = 1000;
      var height = 700;

      camera = new THREE.PerspectiveCamera(
        15,
        this.$el.clientWidth / this.$el.clientHeight,
        1,
        3000
      );
      camera.position.set(0, 100, 500);

      var myCanvas = document.getElementById("threeCanvas");

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: myCanvas
      });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.autoClear = false;
      renderer.setSize(this.$el.clientWidth, this.$el.clientHeight);
      renderer.setClearColor(0xffffff);

      var controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.campingFactor = 0.25;
      controls.enableZoom = true;
      this.setUpcubes();
    },
    setupLights: function() {
      this.lights.forEach((light, index) => {
        var obj = this.getObject(light.id);
        var ml = new THREE.PointLight(0xfff6d1, 1, 50);
        obj.children[0].geometry.computeBoundingBox();
        var center = new THREE.Vector3();

        obj.children[0].geometry.boundingBox.getCenter(center);

        ml.position.set(center.x, center.y - 2, center.z);
        ml.visible =
          light.data[0].timeSeries[light.data[0].timeSeries.length - 1].on;
        ml.target = scene.children[0];
        ml.name = light.id;
        scene.add(ml);
        lightsmodel.push(ml);
      });
    },
    setUpcubes: function() {
      customMaterial = new THREE.ShaderMaterial({
        uniforms: {
          c: { type: "f", value: 1 },
          p: { type: "f", value: 0 },
          glowColor: { type: "c", value: new THREE.Color(0xffff00) },
          viewVector: { type: "v3", value: camera.position }
        },
        vertexShader: document.getElementById("vertexShader").textContent,
        fragmentShader: document.getElementById("fragmentShader").textContent,
        side: THREE.BackSide,
        blending: THREE.NormalBlending,
        transparent: true
      });

      wasteMaterial = new THREE.ShaderMaterial({
        uniforms: {
          c: { type: "f", value: 0.9 },
          p: { type: "f", value: 0 },
          glowColor: { type: "c", value: new THREE.Color(0x00ff00) },
          viewVector: { type: "v3", value: camera.position }
        },
        vertexShader: document.getElementById("vertexShader").textContent,
        fragmentShader: document.getElementById("fragmentShader").textContent,
        side: THREE.FrontSide,
        blending: THREE.AdditiveBlending,
        transparent: true
      });
      onMaterial = new THREE.ShaderMaterial({
        uniforms: {
          c: { type: "f", value: 1 },
          p: { type: "f", value: 0 },
          glowColor: { type: "c", value: new THREE.Color(0xff0000) },
          viewVector: { type: "v3", value: camera.position }
        },
        vertexShader: document.getElementById("vertexShader").textContent,
        fragmentShader: document.getElementById("fragmentShader").textContent,
        side: THREE.FrontSide,
        blending: THREE.NormalBlending,
        transparent: true
      });
    },

    getObject: function(name) {
      if (scene && scene.children) {
        for (let child of scene.children) {
          if (child.name == name) {
            return child;
          }
        }
      }
      return null;
    },
    animate: function() {
      requestAnimationFrame(this.animate);
      point1 = new THREE.Vector3();

      lines.forEach(line => {
        raycaster.setFromCamera(line.position, camera);
        raycaster.ray.at(4, point1);
        line.line.geometry.attributes.position.setXYZ(
          0,
          point1.x,
          point1.y,
          point1.z
        );
        line.line.geometry.attributes.position.needsUpdate = true;
      });
      if (rotate) {
        this.getObject("t02").rotateZ(Math.PI * 0.05);
      }
      renderer.setSize(this.$el.clientWidth, this.$el.clientHeight);
      renderer.clear();
      renderer.render(scene, camera);
      renderer.clearDepth();
    },

    pushToArray: function(objs) {
      objs.forEach(obj => {
        this.checkState(obj);
        const index = this.devices.findIndex(e => e.id === obj.id);

        if (index === -1) {
          this.devices.push(obj);
        } else {
          this.devices[index] = obj;
        }
      });
    },
    checkState: function(obj) {
      if (
        obj.data[0].timeSeries[obj.data[0].timeSeries.length - 1].on &&
        obj.data[0].timeSeries[obj.data[0].timeSeries.length - 1].bad
      ) {
        this.changeColor(obj.id, "waste");
      } else if (obj.data[0].timeSeries[obj.data[0].timeSeries.length - 1].on) {
        this.changeColor(obj.id, "on");
      }
    },

    normalize: function(time) {
      return (
        (parseInt(time.substring(0, 2)) * 60 + parseInt(time.substring(3, 5))) /
        720
      );
    },
    getTime: function() {
      const today = new Date();
      var hours = today.getHours();
      var mins = today.getMinutes();
      if (hours.length == 1) {
        hours = "0" + hours;
      }
      if (mins.length == 1) {
        mins = "0" + mins;
      }

      return hours + ":" + mins;
    },
    sortData: function(objs) {
      objs.forEach(obj => {
        obj.radius = this.normalizedRadius;
        var timeOn = this.dashArray(obj.data[0].timeSeries, this.circumference);

        var energy = (timeOn.time * 24 * obj.grade) / 1000;

        obj.data[0].energy = energy;
        obj.data[0].stroke.push(this.circumference + " " + this.circumference);
        obj.data[0].stroke.push(timeOn.dash);
        obj.data[0].offset.push(this.strokeDashoffset(this.circumference));
        obj.data[0].stroke.push(
          this.redDasharray(obj.data[0].timeSeries, this.circumference, obj.id)
        );
      });
    },
    dashArray: function(data, circ) {
      var dash = "";
      var save = true;
      var last = 0;
      var mins = 0;
      for (var i = 0; i < data.length; i++) {
        if (i == 0 && !data[i].on) {
          dash = "0 ";
        } else if (save != data[i].on) {
          dash =
            dash +
            ((this.normalize(data[i].hour) - last) * circ).toString() +
            " ";
          if (!data[i].on) {
            mins = mins + (this.normalize(data[i].hour) - last);
          }

          last = this.normalize(data[i].hour);
        }

        save = data[i].on;
        var hour = this.normalize(data[i].hour);
      }

      if (save) {
        mins = mins + (hour - last);

        dash =
          dash +
          ((this.time - last) * circ).toString() +
          " " +
          ((1 - this.time) * circ).toString();
      } else {
        dash =
          dash +
          ((this.time - last) * circ + (1 - this.time) * circ).toString();
      }

      return { dash: dash, time: mins };
    },

    strokeDashoffset: function(circ) {
      return circ - this.time * circ;
    },
    redDasharray: function(data, circ, id) {
      var dash;
      var red;
      var saveTime = 0;

      for (var i = 0; i < data.length; i++) {
        if (i == 0) {
          if (data[i].bad && data[i].on) {
            dash = "";
            red = true;
          } else {
            dash = "0 ";
            red = false;
          }
        } else {
          if (data[i].bad && data[i].on) {
            if (red == false) {
              dash =
                dash +
                ((this.normalize(data[i].hour) - saveTime) * circ).toString() +
                " ";
              saveTime = this.normalize(data[i].hour);
              red = true;
            }
          } else {
            if (red == true) {
              dash =
                dash +
                ((this.normalize(data[i].hour) - saveTime) * circ).toString() +
                " ";
              saveTime = this.normalize(data[i].hour);
              red = false;
            }
          }
        }
      }
      if (red) {
        dash =
          dash +
          ((this.time - saveTime) * circ).toString() +
          " " +
          ((1 - this.time) * circ).toString();
      } else {
        dash =
          dash +
          ((this.time - saveTime) * circ + (1 - this.time) * circ).toString();
      }

      return dash;
    }
  },

  mounted: function() {
    this.socket.on("ket", stuff => {
      this.kettles = stuff;
      this.sortData(this.kettles);
      this.pushToArray(this.kettles);
    });
    this.socket.on("toast", stuff => {
      this.toast = stuff;
      this.sortData(this.toast);
      this.pushToArray(this.toast);
    });
    this.socket.on("leds", stuff => {
      this.lights = stuff;
      this.sortData(this.lights);
      this.pushToArray(this.lights);
    });
    this.socket.on("dish", stuff => {
      this.dishes = stuff;
      this.sortData(this.dishes);
      this.pushToArray(this.dishes);
    });
    this.socket.on("tv", stuff => {
      this.tv = stuff;
      this.sortData(this.tv);
      this.pushToArray(this.tv);
    });
    this.socket.on("wash", stuff => {
      this.washers = stuff;
      this.sortData(this.washers);
      this.pushToArray(this.washers);
    });
    this.socket.on("fridge", stuff => {
      this.fridges = stuff;
      this.sortData(this.fridges);
      this.pushToArray(this.fridges);
    });
    this.socket.on("temp", stuff => {
      this.temps = stuff;
      this.sortData(this.temps);
      this.pushToArray(this.temps);
    });

    this.socket.on("shower", stuff => {
      this.showers = stuff;
      this.sortData(this.showers);
      this.pushToArray(this.showers);
    });
    this.socket.on("blend", stuff => {
      this.blenders = stuff;
      this.sortData(this.blenders);
      this.pushToArray(this.blenders);
    });
    this.$nextTick(function() {
      this.loader();
    });
  }
};
</script>

<style scoped>
@import "./css/style.css";
@import "./css/bootstrap.min.css";

.container {
  position: relative;
  margin: 0%;
  padding: 0%;
  width: 100%;
}
.devices {
  width: 10%;
  margin-left: 3%;
  float: left;
}
.d {
  clear: left;
  float: left;
  position: relative;
  top: 40px;
  font-weight: bold;
  width: 10%;
}

#threeCanvas {
  position: absolute;
  padding-right: 30%;

  left: 0%;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  position: relative;
  color: #2c3e50;
}
#sidebar {
  position: relative;
  background-color: midnightblue;
}
#clock {
  left: 5%;
  top: -28%;
  width: 80%;
  font-size: 6px;
  font-weight: bold;
  color: white;
}

#device {
  fill: rgb(255, 187, 0);
  border-radius: 20%;
  stroke-width: 1;
  stroke: rgb(0, 0, 0);
}
.comps {
  padding-left: 0%;
}

#svgBar {
  width: 100%;
  height: 30%;
  overflow: auto;
  border-left: solid;
  border-right: solid;
  border-top: solid;
}

.content {
  margin-top: 3%;
}

#bar {
  position: absolute;
  background-color: white;
  top: 45%;
  height: 52%;
  overflow: scroll;
  width: 88%;
}
</style>

