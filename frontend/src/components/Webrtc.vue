<template>
  <div>
    <div class="videos">
      <v-row>
        <v-col>
          <div class="relative">
            <video
              class="media_v"
              id="webcamVideo"
              autoplay
              playsinline
            ></video>
            <canvas class="media_c" id="output"></canvas>
            <h2 class="text-center">Your squats count：{{ counter }}</h2>
          </div>
        </v-col>
        <v-col>
          <div class="relative">
            <video
              id="remoteVideo"
              autoplay
              playsinline
              class="media_va"
            ></video>
            <h2 class="text-center">
              opponent's squats count：{{ enemyCounter }}
            </h2>
          </div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import * as posenet from "@tensorflow-models/posenet";
import * as tf from "@tensorflow/tfjs";
import { db } from "../firebase";

export default {
  name: "Webrtc",

  data: () => ({
    callInp: "",
    servers: {
      iceServers: [
        {
          urls: [
            "stun:stun1.l.google.com:19302",
            "stun:stun2.l.google.com:19302",
          ],
        },
      ],
      iceCandidatePoolSize: 10,
    },
    localStream: null,
    remoteStream: null,
    pc: null,
    webcamVideo: null,
    remoteVideo: null,
    canvas: null,
    color: "aqua",
    lineWidth: 2,
    counter: 0,
    enemyCounter: 0,
    stage: "up",
    next_stage: "down",
  }),
  async created() {
    await this.startWebcam();
    const docExist = await db
      .collection("calls")
      .doc(this.$route.params.roomId)
      .get();
    if (!docExist.exists) {
      await this.createCall(this.$route.params.roomId);
    } else {
      this.callInp = this.$route.params.roomId;
      await this.answerBtn();
    }
    db.collection("rooms")
      .doc(this.$route.params.roomId)
      .onSnapshot((querySnapshot) => {
        const players = querySnapshot.data().players;
        console.log("aaaaaa");
        players.forEach((player) => {
          if (player.id == this.$store.state.user.id) {
            this.counter = player.count;
          } else {
            this.enemyCounter = player.count;
          }
        });
      });
  },
  methods: {
    async startWebcam() {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      this.remoteStream = new MediaStream();

      // Push tracks from local stream to peer connection
      this.localStream.getTracks().forEach((track) => {
        this.pc.addTrack(track, this.localStream);
      });

      // Pull tracks from remote stream, add to video stream
      this.pc.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
          this.remoteStream.addTrack(track);
        });
      };

      this.webcamVideo.srcObject = this.localStream;
      this.remoteVideo.srcObject = this.remoteStream;
      // ################################onloadmetadata がmedia pipe ################################
      this.webcamVideo.onloadedmetadata = async () => {
        await this.webcamVideo.play();
        //Load a model
        this.runPosenet();
      };
      // ############################################################################################
    },
    async createCall(val) {
      // Reference Firestore collections for signaling
      const callDoc = db.collection("calls").doc(val);
      const offerCandidates = callDoc.collection("offerCandidates");
      const answerCandidates = callDoc.collection("answerCandidates");

      this.callInp = callDoc.id;

      // Get candidates for caller, save to db
      this.pc.onicecandidate = (event) => {
        event.candidate && offerCandidates.add(event.candidate.toJSON());
      };

      // Create offer
      const offerDescription = await this.pc.createOffer();
      await this.pc.setLocalDescription(offerDescription);

      const offer = {
        sdp: offerDescription.sdp,
        type: offerDescription.type,
      };

      await callDoc.set({ offer });

      // Listen for remote answer
      callDoc.onSnapshot((snapshot) => {
        const data = snapshot.data();
        if (!this.pc.currentRemoteDescription && data?.answer) {
          const answerDescription = new RTCSessionDescription(data.answer);
          this.pc.setRemoteDescription(answerDescription);
        }
      });

      // When answered, add candidate to peer connection
      answerCandidates.onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const candidate = new RTCIceCandidate(change.doc.data());
            this.pc.addIceCandidate(candidate);
          }
        });
      });
    },
    async answerBtn() {
      const callId = this.callInp;
      const callDoc = db.collection("calls").doc(callId);
      const answerCandidates = callDoc.collection("answerCandidates");
      const offerCandidates = callDoc.collection("offerCandidates");

      this.pc.onicecandidate = (event) => {
        event.candidate && answerCandidates.add(event.candidate.toJSON());
      };

      const callData = (await callDoc.get()).data();

      const offerDescription = callData.offer;
      await this.pc.setRemoteDescription(
        new RTCSessionDescription(offerDescription)
      );

      const answerDescription = await this.pc.createAnswer();
      await this.pc.setLocalDescription(answerDescription);

      const answer = {
        type: answerDescription.type,
        sdp: answerDescription.sdp,
      };

      await callDoc.update({ answer });

      offerCandidates.onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          console.log(change);
          if (change.type === "added") {
            let data = change.doc.data();
            this.pc.addIceCandidate(new RTCIceCandidate(data));
          }
        });
      });
    },
    async runPosenet() {
      console.log("Using TensorFlow backend: ", tf.getBackend()); //tensorflownbackendの読み込み
      const net = await posenet.load({
        inputResolution: { width: 640, height: 480 },
        scale: 0.5, //0~1, 低いと精度が下がるが早くなる
      });
      console.log("model is loaded");

      setInterval(() => {
        this.detect(net);
      }, 500);
    },
    async detect(net) {
      // Make detection
      const pose = await net.estimateSinglePose(this.webcamVideo);
      let videoWidth = 640;
      let videoHeight = 480;
      this.webcamVideo.width = videoWidth;
      this.webcamVideo.height = videoHeight;

      this.canvas.width = videoWidth;
      this.canvas.height = videoHeight;
      const ctx = this.canvas.getContext("2d");

      this.drawCanvas(pose, ctx);
    },
    async drawCanvas(pose, ctx) {
      this.drawKeypoints(pose["keypoints"], 0.5, ctx);
      this.drawSkeleton(pose["keypoints"], 0.5, ctx);
      // joint number of the model
      const lsholder_num = 5;
      const lhip_num = 11;
      const lknee_num = 13;
      const rsholder_num = 6;
      const rhip_num = 12;
      const rknee_num = 13;

      // Threshold for checking a squat
      const upAngle = 153;
      const downAngle = 150;
      const minConfidence = 0.4;
      // calculate angle
      const lAngle = this.calculate_angle(
        pose["keypoints"][lsholder_num],
        pose["keypoints"][lhip_num],
        pose["keypoints"][lknee_num]
      );
      const rAngle = this.calculate_angle(
        pose["keypoints"][rsholder_num],
        pose["keypoints"][rhip_num],
        pose["keypoints"][rknee_num]
      );
      // checking the accuracy of the predictions
      if (
        pose["keypoints"][lsholder_num].score > minConfidence &&
        pose["keypoints"][lhip_num].score > minConfidence &&
        pose["keypoints"][lknee_num].score > minConfidence &&
        pose["keypoints"][rsholder_num].score > minConfidence &&
        pose["keypoints"][rhip_num].score > minConfidence &&
        pose["keypoints"][rknee_num].score > minConfidence
      ) {
        // checking the state of squat from the angle at hips
        if (lAngle > upAngle && rAngle > upAngle) {
          this.stage = "up";
          this.next_stage = "down";
        }
        if (lAngle < downAngle && rAngle < downAngle && this.stage === "up") {
          this.stage = "down";
          this.next_stage = "up";
          this.counter = this.counter + 1;
          const playerIndex = this.$store.state.room.players.findIndex(
            (player) => player.id === this.$store.state.user.id
          );
          const newPlayers = [...this.$store.state.room.players];
          newPlayers[playerIndex].count = this.counter;
          await db
            .collection("rooms")
            .doc(this.$route.params.roomId)
            .update({
              players: newPlayers,
            });
          console.log("bbbbbb");
        }
      } else {
        this.drawtext(ctx, "画面から離れて全身を映して！", 50, 400, 40);
      }
      this.drawState(ctx, this.counter, this.next_stage);
    },
    drawtext(ctx, text, x, y, font_size) {
      ctx.font = font_size + "px serif";
      ctx.fillStyle = "#000000";
      ctx.fillText(text, x, y);
    },
    drawState(ctx, count, stage) {
      stage = "next: " + stage;
      this.drawtext(ctx, stage, 10, 50, 48);
      this.drawtext(ctx, count, 300, 50, 48);
    },
    drawKeypoints(keypoints, minConfidence, ctx, scale = 1) {
      for (let i = 0; i < keypoints.length; i++) {
        const keypoint = keypoints[i];

        if (keypoint.score < minConfidence) {
          continue;
        }

        const { y, x } = keypoint.position;
        this.drawPoint(ctx, y * scale, x * scale, 3, this.color);
      }
    },

    drawPoint(ctx, y, x, r, color) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
    },
    drawSkeleton(keypoints, minConfidence, ctx, scale = 1) {
      const adjacentKeyPoints = posenet.getAdjacentKeyPoints(
        keypoints,
        minConfidence
      );

      adjacentKeyPoints.forEach((keypoints) => {
        this.drawSegment(
          this.toTuple(keypoints[0].position),
          this.toTuple(keypoints[1].position),
          this.color,
          scale,
          ctx
        );
      });
    },
    toTuple({ y, x }) {
      return [y, x];
    },

    drawSegment([ay, ax], [by, bx], color, scale, ctx) {
      ctx.beginPath();
      ctx.moveTo(ax * scale, ay * scale);
      ctx.lineTo(bx * scale, by * scale);
      ctx.lineWidth = this.lineWidth;
      ctx.strokeStyle = color;
      ctx.stroke();
    },

    find_angle(A, B, C) {
      var AB = Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2));
      var BC = Math.sqrt(Math.pow(B.x - C.x, 2) + Math.pow(B.y - C.y, 2));
      var AC = Math.sqrt(Math.pow(C.x - A.x, 2) + Math.pow(C.y - A.y, 2));
      var radiance = Math.acos((BC * BC + AB * AB - AC * AC) / (2 * BC * AB));
      var angle = (radiance * 180.0) / Math.PI;
      if (angle > 180.0) {
        angle = 360 - angle;
      }
      return angle;
    },

    calculate_angle(keypoint1, keypoint2, keypoint3) {
      return this.find_angle(
        keypoint1.position,
        keypoint2.position,
        keypoint3.position
      );
    },
  },
  mounted() {
    this.pc = new RTCPeerConnection(this.servers);
    this.localStream = null;
    this.remoteStream = null;
    // HTML elements
    this.webcamVideo = document.getElementById("webcamVideo");
    this.canvas = document.getElementById("output");
    this.remoteVideo = document.getElementById("remoteVideo");

    // HTML elements
    this.webcamVideo = document.getElementById("webcamVideo");
    this.canvas = document.getElementById("output");
    this.remoteVideo = document.getElementById("remoteVideo");
  },
};
</script>

<style scoped>
.media_v {
  position: absolute;
  top: 80px;
  left: -80px;
  z-index: 1;
}
.media_va {
  position: absolute;
  right: -80px;
  top: 80px;
  z-index: 1;
}
.media_c {
  position: absolute;
  top: 80px;
  left: -80px;
  z-index: 10;
}
video {
  width: 640;
  height: 480;
  background: #2c3e50;
}
canvas {
  width: 640;
  height: 480;
}
.videos {
  display: flex;
  align-items: center;
  justify-content: center;
}
.counter {
  position: absolute;
  top: 800px;
}
.relative {
  position: relative;
}
</style>
