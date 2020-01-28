<template>
  <v-container>
    <v-stepper v-model="e6" vertical>
      <v-stepper-step :complete="e6 > 1" step="1">
        -- 海外物资申请表 --
      </v-stepper-step>

      <v-stepper-content step="1">
        <v-card class="mb-12">
          <v-form ref="form1" v-model="valid" lazy-validation>
            <v-layout>
              <v-flex sm6>
                <v-text-field
                  v-model="hospital"
                  label="所属医院名称(必填)"
                  required
                  :rules="[fieldIsRequired('医院')]"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout>
              <v-flex xs5>
                <v-text-field
                  v-model.number="mouthMask"
                  label="口罩需求数量"
                  required
                  :rules="[fieldIsRequired('口罩数量'), fieldIsNumber('口罩数量'), fieldIsInteger('口罩数量'), fieldIsNoLessThanZero('口罩数量')]"
                ></v-text-field>
              </v-flex>
              <v-flex xs1></v-flex>
              <v-flex xs5>
                <v-text-field
                  v-if="mouthMask >= 1" 
                  v-model.number="mouthMaskInfo"
                  label="口罩备注"
                  required
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout>
              <v-flex xs5>
                <v-text-field
                  v-model.number="guggles"
                  label="护目镜需求数量"
                  required
                  :rules="[fieldIsRequired('护目镜需求数量'), fieldIsNumber('护目镜需求数量'), fieldIsInteger('护目镜需求数量'), fieldIsNoLessThanZero('护目镜需求数量')]"
                ></v-text-field>
              </v-flex>
              <v-flex xs1></v-flex>
              <v-flex xs5>
                <v-text-field
                  v-if="guggles >= 1" 
                  v-model.number="gugglesInfo"
                  label="护目镜备注"
                  required
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout>
              <v-flex xs5>
                <v-text-field
                  v-model.number="coat"
                  label="防护服需求数量"
                  required
                  :rules="[fieldIsRequired('防护服需求数量'), fieldIsNumber('防护服需求数量'), fieldIsInteger('防护服需求数量'), fieldIsNoLessThanZero('防护服需求数量')]"
                ></v-text-field>
              </v-flex>
              <v-flex xs1></v-flex>
              <v-flex xs5>
                <v-text-field
                  v-if="coat >= 1" 
                  v-model.number="coatInfo"
                  label="防护服备注"
                  required
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-textarea
              outlined
              name="input-7-4"
              label="备注"
              v-model="note"
            ></v-textarea>
          </v-form>
        </v-card>
        <v-layout>
          <v-flex xs3>
            <v-btn color="primary" @click="toStep2">继续</v-btn>
          </v-flex>
          <v-flex xs1></v-flex>
          <v-flex xs3>
            <v-btn color="secondary" @click.stop="reset">清空</v-btn>
          </v-flex>
        </v-layout>
      </v-stepper-content>

      <v-stepper-step :complete="e6 > 2" step="2">个人身份验证信息</v-stepper-step>

      <v-stepper-content step="2">
        <v-card class="mb-12">
          <v-alert
            border="top"
            colored-border
            type="info"
            dense
            elevation="2">
            注意，为使物资可以更好地定点投放，信息越详细，获得资助的可能性越高。
          </v-alert>
          <v-form ref="form2" v-model="valid" lazy-validation>
            <v-layout>
              <v-flex xs10>
                <v-text-field
                  v-model="weixinCode"
                  label="微信号（非必填）"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout>
              <v-flex xs10>
                <v-text-field
                  v-model="name"
                  label="姓名（非必填）"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout>
              <v-flex xs10>
                <v-text-field
                  v-model="docCode"
                  label="医师证号（非必填）"></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout>
              <v-flex xs10>
                <v-text-field
                  v-model="idCode"
                  label="身份证号（非必填）"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-textarea
              outlined
              name="input-7-4"
              label="备注"
              v-model="idNote"
            ></v-textarea>
          </v-form>
        </v-card>
        <v-btn color="primary" @click="e6 = 3">下一步</v-btn>
      </v-stepper-content>

      <v-stepper-step :complete="e6 > 3" step="3">地址信息</v-stepper-step>

      <v-stepper-content step="3">
        <v-card class="mb-12">
          <v-textarea
            outlined
            name="input-7-4"
            label="详细邮递地址"
            v-model="address"
          ></v-textarea>
        </v-card>
        <LoaderButton
          :buttonText="`提交`"
          :promiseAwait="submit"/>
      </v-stepper-content>
    </v-stepper>
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
  name: 'Clients',

  data: () => ({
    e6: 1,
    valid: true,
    valid2: true,
    hospital: '',
    guggles: 0,
    mouthMask: 0,
    coat: 0,
    gugglesInfo: '',
    mouthMaskInfo: '',
    coatInfo: '',
    note: '',
    isFormSubmitted: false,
    weixinCode: '',
    idCode: '',
    docCode: '',
    name: '',
    address: ''
  }),
  components: {
    LoaderButton,
    SimpleTextPopup
  },
  mixins: [checkRules],
  methods: {
    submit () {
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
    },
    toStep2 () {
      if (this.$refs.form1.validate()) {
        this.e6 = 2
      }
    },
    toStep3 () {
      if (this.$refs.form2.validate()) {
        this.e6 = 3
      }
    }
  }
}
</script>
