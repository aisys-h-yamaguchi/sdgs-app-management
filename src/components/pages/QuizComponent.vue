<template>
  <v-container>
    <PageHeadComponent :page-head-title="pageHeadTitle" />
    <v-divider class="mx-4" inset vertical></v-divider>

    <v-spacer></v-spacer>
    <v-data-table :headers="headers" :items="contentsList" class="elevation-1">
      <!-- クイズNo. -->
      <template v-slot:[`item.quizNo`]="{ item }">
        <div>
          {{ item.quizNo }}
        </div>
      </template>
      <!-- アイキャッチ画像 -->
      <template v-slot:[`item.image`]="{ item }">
        <v-img width="120px" height="120px" v-bind:src="item.image"></v-img>
      </template>
      <!-- タイトル -->
      <template v-slot:[`item.title`]="{ item }">
        <div>
          {{ item.title }}
        </div>
      </template>
      <!-- ステータス -->
      <template v-slot:[`item.status`]="{ item }">
        <div v-if="item.status">
          {{ "削除済" }}
        </div>
      </template>

      <!-- 編集・削除アイコン -->
      <template v-slot:[`item.updDel`]="{ item }">
        <v-icon medium class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon medium @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>

      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize"> Reset </v-btn>
      </template>
    </v-data-table>

    <v-row class="pa-4">
      <v-col cols="10">
        <v-btn color="primary" @click="editNewItem">
          <v-icon left> mdi-plus </v-icon>
          新規登録
        </v-btn>
      </v-col>
      <v-col cols="2">
        <v-btn color="primary" @click="csvUpload">
          <v-icon left> mdi-upload </v-icon>
          CSVとして書き込む
        </v-btn>
      </v-col>
    </v-row>

    <v-spacer></v-spacer>

    <v-dialog v-model="dialogEdit" max-width="800px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <!-- クイズNo -->
            <v-row>
              <v-col>
                <v-text-field
                  type="number"
                  v-model="editedItem.quizNo"
                  label="クイズNo."
                  max="999"
                  min="1"
                ></v-text-field>
              </v-col>
            </v-row>
            <!-- アイキャッチ画像 -->
            <v-row>
              <v-col>
                <v-file-input
                  type="file"
                  v-model="editedItem.image"
                  accept="image/png, image/jpeg"
                  show-size
                  counter
                  outlined
                  dense
                  placeholder="ここをクリックしてください"
                ></v-file-input>
              </v-col>
            </v-row>
            <!-- クイズタイトル -->
            <v-row>
              <v-col cols="12">
                <v-textarea
                  v-model="editedItem.title"
                  label="タイトル"
                  auto-grow
                  outlined
                ></v-textarea>
              </v-col>
            </v-row>
            <!-- opt1 opt2 opt3 -->
            <v-row>
              <v-col cols="4">
                <v-textarea
                  v-model="editedItem.opt1"
                  label="選択肢１"
                  auto-grow
                  outlined
                ></v-textarea>
              </v-col>
              <v-col cols="4">
                <v-textarea
                  v-model="editedItem.opt2"
                  label="選択肢２"
                  auto-grow
                  outlined
                ></v-textarea>
              </v-col>
              <v-col cols="4">
                <v-textarea
                  v-model="editedItem.opt3"
                  label="選択肢３"
                  auto-grow
                  outlined
                ></v-textarea>
              </v-col>
            </v-row>
            <!-- クイズ回答No -->
            <v-row>
              <v-col>
                <v-text-field
                  type="number"
                  v-model="editedItem.current"
                  label="回答No"
                  max="3"
                  min="1"
                ></v-text-field>
              </v-col>
            </v-row>
            <!-- クイズ解説 -->
            <v-row>
              <v-col cols="12">
                <v-textarea
                  v-model="editedItem.description"
                  label="解答"
                  auto-grow
                  outlined
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
          <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import PageHeadComponent from "../parts/PageHeadComponent.vue";
export default {
  components: {
    PageHeadComponent,
  },
  data: () => ({
    pageHeadTitle: "クイズ",
    // 検索用メニュー
    searchUserMenu: false,
    valid: true,
    userChoice: 2,

    dialogEdit: false,

    headers: [
      { text: "クイズNo.", value: "quizNo", width: "5%", align: "start" },
      { text: "アイキャッチ画像", value: "image", width: "15%", align: "start" },
      { text: "タイトル", value: "title", width: "60%", align: "start" },
      { text: "編集・削除", value: "updDel", sortable: false, width: "10%", align: "start" },
    ],

    contentsList: [],
    editedIndex: -1,
    editedItem: {
      quizNo: "",
      image: null,
      title: "",
      // クイズ選択肢
      opt1: "",
      opt2: "",
      opt3: "",
      // クイズ解答No
      current: "",
      // クイズ解答
      description: "",
    },
    defaultItem: {
      quizNo: "",
      image: null,
      title: "",
      // クイズ選択肢
      opt1: "",
      opt2: "",
      opt3: "",
    },
    // 表示順変更フラグ
    changeOrderFlag: false,
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "新規" : "編集";
    },
  },

  watch: {
    dialogEdit(val) {
      val || this.close();
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.contentsList = [
        {
          quizNo: 1,
          image:
            "https://amplify-sdgsappmanagement-main-91300-deployment.s3.us-east-2.amazonaws.com/props/learnning/quiz/thumbnails/001_image.jpeg",
          title:
            "今や待ったなしの地球温暖化をくい止めるため、たくさんの国と地域が温室効果ガスの排出を実質的にゼロにするという目標を宣言しました。この宣言を何と呼ぶでしょう？",
          opt1: "アースクールダウン宣言",
          opt2: "カーボンニュートラル宣言",
          opt3: "ヒートチェンジ宣言",
          current: 2,
          description:
            "カーボン（炭素）をニュートラル（中立）にするとは、つまり二酸化炭素をはじめとした温室効果ガスの排出量と、森林などによる吸収量を釣り合いの取れた状態とし、実質的な排出量をゼロにすること。日本では年間で12億トンを超える温室効果ガスを排出していますが、2050年までにこれを実質ゼロにすると宣言し、他にも120以上の国と地域が2050年を目標に掲げて実質ゼロを宣言しています。ですが、実質ゼロを達成することは非常に困難な目標です。国の対策だけでなく、私たち一人ひとりが「カーボンニュートラル」に向けて何ができるのか、考えなくてはならないですね.セブン&アイグループでも、2019年に『GREEN CHALLENGE 2050』を宣言し、皆様とともによりよい未来を作るための一歩を踏み出しています。",
        },
        {
          quizNo: 2,
          image:
            "https://amplify-sdgsappmanagement-main-91300-deployment.s3.us-east-2.amazonaws.com/props/learnning/quiz/thumbnails/002_image.jpeg",
          title:
            "2020年10月、菅総理大臣は「2050年カーボンニュートラル宣言」を行いました。さて、「カーボンニュートラル」とは、具体的には2050年までに何を減らすことを目標にしているのでしょう？",
          opt1: "海洋汚染の原因となっている「油」",
          opt2: "皮膚ガンのリスクを高める「紫外線」",
          opt3: "地球を温めてしまう「温室効果ガス」",
          current: 3,
          description:
            "人間の活動によって増加した主な温室効果ガスには、二酸化炭素、メタン、一酸化二窒素、フロンガスなどがあります。その8割近くは二酸化炭素で、地球温暖化に及ぼす影響がもっとも大きな温室効果ガスです。私たち人間や動物も酸素を吸って二酸化炭素を吐き出していますが、この二酸化炭素が増えると、地球の表面から放射された赤外線を吸収してしまうことで、温室効果をもたらしてしまい、地球の温暖化などを招くことがわかっています。未来を少しでも変えるために、私たちができることはなにか。できることからひとつずつ変えていき、地球の明日にいいことを一緒に取り組んでいきませんか？",
        },
      ];
    },

    editItem(item) {
      this.editedIndex = this.contentsList.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogEdit = true;
    },

    deleteItem(item) {
      this.editedIndex = this.contentsList.indexOf(item);
      this.editedItem = Object.assign({}, item);
      const msg = "このデータを削除してよろしいですか？ \n ユーザー名 : " + item["title"];
      if (confirm(msg)) {
        this.contentsList.splice(this.editedIndex, 1);
      }
      this.closeDelete();
    },

    close() {
      this.dialogEdit = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        // 編集押下されたとき
        Object.assign(this.contentsList[this.editedIndex], this.editedItem);
      } else {
        // 新規登録が押下されたとき
        // TODO: 選択された画像ファイルをS3の指定箇所に格納する→amplifyにいい感じの機能がありそうだから実装前に調べてみること
        // s3に格納したファイルをオブジェクトURL形式で指定のDBへ格納→リストとして取り出し、画面に表示する
        this.contentsList.push(this.editedItem);
      }
      this.close();
    },
    editNewItem() {
      this.dialogEdit = true;
    },
    // TODO: 表示されてるデータをCSV形式でS3の指定箇所に保存する
    csvUpload() {
      console.log("csv形式でs3に保存");
    },
  },
};
</script>
