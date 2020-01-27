<template>
  <v-container>

    <v-card>
      <v-toolbar dark color="primary">
        <v-toolbar-title class="mx-auto">
          -- 今日本院缺乏物资 --
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-container>
            <v-layout>
              <v-flex sm6>
                <v-text-field
                  v-model="hospital"
                  label="医院名称"
                  required
                  :rules="[fieldIsRequired('医院')]"
                ></v-text-field>
              </v-flex>
            </v-layout>
              <v-text-field
                v-model.number="mouthMask"
                label="口罩需求数量"
                required
                :rules="[fieldIsRequired('口罩数量'), fieldIsNumber('口罩数量'), fieldIsInteger('口罩数量'), fieldIsNoLessThanZero('口罩数量')]"
              ></v-text-field>
              <v-text-field
                v-model.number="guggles"
                label="护目镜需求数量"
                required
                :rules="[fieldIsRequired('护目镜需求数量'), fieldIsNumber('护目镜需求数量'), fieldIsInteger('护目镜需求数量'), fieldIsNoLessThanZero('护目镜需求数量')]"
              ></v-text-field>
              <v-text-field
                v-model.number="coat"
                label="防护服需求数量"
                required
                :rules="[fieldIsRequired('防护服需求数量'), fieldIsNumber('防护服需求数量'), fieldIsInteger('防护服需求数量'), fieldIsNoLessThanZero('防护服需求数量')]"
              ></v-text-field>
              <v-textarea
                outlined
                name="input-7-4"
                label="其他需求"
                v-model="note"
              ></v-textarea>
          </v-container>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-layout justify-space-between>
          <v-btn color="primary" @click.stop="reset">清空</v-btn>
          <LoaderButton                   
            buttonText="提交"
            :promiseAwait="submit"
            :disabled="!valid"></LoaderButton>
        </v-layout>
      </v-card-actions>
    </v-card>
    <SimpleTextPopup
      v-model="isFormSubmitted"
      hideLftBtn
      hideRgtBtn
    >
      <template v-slot:input>
        <v-container>
          <v-flex style="white-space: pre-wrap; ">提交成功！感谢您今日提供的信息！请关闭当前页面。</v-flex>
        </v-container>
      </template>
    </SimpleTextPopup>
  </v-container>
</template>

<script>
import {db, checkRules, client} from '../db'
import moment from 'moment'
import LoaderButton from './LoaderButton'
import SimpleTextPopup from './SimpleTextPopup'

export default {
  name: 'HelloWorld',

  data: () => ({
    valid: true,
    hospital: '',
    guggles: 0,
    mouthMask: 0,
    coat: 0,
    note: '',
    isFormSubmitted: false
  }),
  components: {
    LoaderButton,
    SimpleTextPopup
  },
  mixins: [checkRules],
  methods: {
    submit () {
      // let params = {
      //   TableName :"requests",
      //   Item:{
      //     "createTime": Date.now(),
      //     "createDate": moment().format("YYYY-MM-DD"),
      //     "info":{
      //       "hospital": this.hospital,
      //       "guggles": this.guggles,
      //       "mouthMask": this.mouthMask,
      //       "coat": this.coat,
      //       "note": this.note
      //     }
      //   }
      // }
      const params = {
        TableName :"Movies",
        Item:{
            "year": Date.now(),
            "title": moment().format("YYYY-MM-DD"),
            "info":{
              "hospital": this.hospital,
              "guggles": this.guggles,
              "mouthMask": this.mouthMask,
              "coat": this.coat,
              "note": this.note
            }
        }
      }
      console.log(params)
      if (!this.$refs.form.validate()) return Promise.resolve()
      return client.put(params, (err, data) => {
        if (err) {
          console.log("Unable to add item: " + "\n" + JSON.stringify(err, undefined, 2))
        } else {
          console.log("PutItem succeeded: " + "\n" + JSON.stringify(data, undefined, 2))
          this.isFormSubmitted = true
        }
      })
    },
    read () {
      var params = {
        TableName : "Movies"
      }

      db.get(params, (err, data) => {
        if (err) {
          console.log("Unable to query. Error: " + "\n" + JSON.stringify(err, undefined, 2))
        } else {
          this.a = data
          console.log(data)
        }
      })
    },
    reset () {
      this.$refs.form.reset()
    },
    resetValidation () {
      this.$refs.form.resetValidation()
    },
    createTable () {
      var params = {
          TableName : "Requests",
          KeySchema: [
              { AttributeName: "createTime", KeyType: "HASH"},
              { AttributeName: "createDate", KeyType: "RANGE" }
          ],
          AttributeDefinitions: [
              { AttributeName: "createTime", AttributeType: "N" },
              { AttributeName: "createDate", AttributeType: "S" }
          ],
          ProvisionedThroughput: {
              ReadCapacityUnits: 5,
              WriteCapacityUnits: 5
          }
      }

      db.createTable(params, function(err, data) {
          if (err) {
              console.log("Unable to create table: " + "\n" + JSON.stringify(err, undefined, 2))
          } else {
              console.log("Created table: " + "\n" + JSON.stringify(data, undefined, 2))
          }
      })
    }
  }
}
</script>
