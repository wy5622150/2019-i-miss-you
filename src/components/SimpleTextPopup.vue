<template>
  <v-dialog 
    v-model="value" 
    scrollable 
    :max-width="maxWidth" 
    persistent 
    no-click-animation
    v-scroll:#scrollContainer="onScroll"
  >
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn v-if="showNavigator" flat @click="getPreviousItem" :disabled="getPreviousItemDisabled"><v-icon large>arrow_left</v-icon>Previous</v-btn>
        <v-toolbar-title class="mx-auto">
          {{title}}
        </v-toolbar-title>
        <v-btn v-if="showNavigator" flat @click="getNextItem" :disabled="getNextItemDisabled">Next<v-icon large>arrow_right</v-icon></v-btn>
      </v-toolbar>
      <v-card-text v-if="!$slots.input">
        <v-textarea v-if="showMultilineTextbox"
          name="input-3"
          :label="label"
          v-model="text"
          outline
          ref="thepopup"></v-textarea>
        <v-text-field v-else
          name="input-3"
          :label="label"
          v-model="text"
          @keyup.enter="secondMethod(text)"
          ref="thepopup"
        ></v-text-field>
      </v-card-text>
      <v-card-text v-else ref="simplePopupContainer" id="scrollContainer">
        <div ref="details"><slot name="input"></slot></div>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <slot name="popupAction">
          <v-layout row justify-space-between>
            <v-flex class="text-xs-left" v-if="!hideLftBtn">
              <slot name="left_button">
                <v-btn color="primary" flat @click.stop="firstMethod">{{leftButtonText}}</v-btn>
              </slot>
            </v-flex>
            <v-flex class="text-xs-right" v-if="!hideRgtBtn">
              <slot name="right_button">
                <v-btn color="primary" flat @click.stop="secondMethod" :disabled="rightButtonDisabled" :id="rightButtonText">{{rightButtonText}}</v-btn>
              </slot>
            </v-flex>
          </v-layout>
        </slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'simplePopup',
  data () {
    return {
      text: ''
    }
  },
  watch: {
    value (value) {
      if (value) {
        this.text = this.theText
      }
    }
  },
  mounted () {
    this.scrollToBottom && this.scrollBottom()
    this.addEscListener()
  },
  updated () {
    if (this.value && this.showTextbox) {
      this.$nextTick(() => { if (this.$refs.thepopup) this.$refs.thepopup.focus() })
    }
  },
  computed: {
    maxWidth () {
      return this.large ? '80%' : (this.medium ? '60%' : (this.small ? '30%' : '550px'))
    }
  },
  methods: {
    onScroll (e) {
      if (this.outsideScrollToBottom) {
        let eHeight = e.target.clientHeight
        let eScrollTop = document.getElementById('scrollContainer') && document.getElementById('scrollContainer').scrollTop
        let eScrollHeight = document.getElementById('scrollContainer') && document.getElementById('scrollContainer').scrollHeight

        if (Math.abs(eHeight + eScrollTop - eScrollHeight) <= 2) {
          this.outsideScrollToBottom(true)
        } else {
          this.outsideScrollToBottom(false)
        }
      }
    },
    scrollBottom () {
      setTimeout(() => { 
        this.$nextTick(() => { 
          this.$refs.simplePopupContainer && (this.$refs.simplePopupContainer.scrollTop = this.$refs.details.offsetHeight)
        })
      }, 300)
    },
    firstMethod () {
      if (this.leftMethod) {
        this.leftMethod(this.text, this.extraData)
      }
      this.hideMethod()
    },
    secondMethod () {
      if (this.rightMethod) {
        if (!this.$slots.input) {
          return Promise.resolve(this.rightMethod(this.text, this.extraData))
            .then(() => this.hideMethod())
        } else {
          return Promise.resolve(this.rightMethod(this.extraData))
            .then(() => this.hideMethod())
        }
      }
    },
    hideMethod () {
      this.$emit('popupClose')
    },
    addEscListener () {
      document.addEventListener('keyup', (e) => {
        if (this.value && e.keyCode === 27) {
          this.hideMethod()
        }
      })
    },
    getPreviousItem () {
      this.$emit('getPreviousItem')
    },
    getNextItem () {
      this.$emit('getNextItem')
    }
  },
  props: {
    value: Boolean,
    showMultilineTextbox: {
      type: Boolean,
      default: false
    },
    theText: {
      type: String,
      default: ''
    },
    extraData: {
      type: Object,
      default: function () {
        return {}
      }
    },
    hideLftBtn: {
      type: Boolean,
      default: false
    },
    hideRgtBtn: {
      type: Boolean,
      default: false
    },
    large: {
      type: Boolean,
      default: false
    },
    medium: {
      type: Boolean,
      default: false
    },
    small: {
      type: Boolean,
      default: true
    },
    title: String,
    label: String,
    leftButtonText: {
      type: String,
      default: 'Close'
    },
    rightButtonText: {
      type: String,
      default: 'Save'
    },
    rightMethod: Function,
    leftMethod: Function,
    rightButtonDisabled: Boolean,
    flag: [String, Array],
    scrollToBottom: Boolean,
    outsideScrollToBottom: Function,
    showNavigator: {
      type: Boolean,
      default: false
    },
    getNextItemDisabled: Boolean,
    getPreviousItemDisabled: Boolean
  }
}
</script>
