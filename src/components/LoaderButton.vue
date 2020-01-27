<template>
  <v-btn color="primary" :text="isFlat" v-bind="$attrs" @click.stop="click" :loading="isLoading" :disabled="isLoading || disabled">
    <slot name="icon"></slot>
    <template v-if="!!buttonText">{{buttonText}}</template>
    <template v-else><v-icon>{{buttonIcon}}</v-icon></template>
  </v-btn>
</template>

<script>
export default {
  name: 'LoaderButton',
  data () {
    return {
      isLoading: false,
      flatToggle: true
    }
  },
  computed: {
    isFlat () {
      return this.flat && this.flatToggle
    }
  },
  watch: {
    loading (value) {
      this.isLoading = value
    }
  },
  methods: {
    setLoading (value) {
      this.isLoading = value
      this.$emit('input', value)
      if (this.flat) {
        this.flatToggle = !value
      }
    },
    click () {
      if (this.isLoading) return
      this.setLoading(true)
      try {
        return Promise.resolve(this.promiseAwait(this.promiseItem))
          .catch((error) => {
            console.log(error.message)
            if (error.message.split('failed to call function. ').length > 1) {
              this.$emit('loaderButtonError', error.message.split('failed to call function. ')[1])
            } else {
              this.$emit('loaderButtonError', error.message)
            }
          })
          .finally(() => {
            this.setLoading(false)
          })
      } catch (error) {
        console.error(error.message)
        if (error.message.split('failed to call function. ').length > 1) {
          this.$emit('loaderButtonError', error.message.split('failed to call function. ')[1])
        } else {
          this.$emit('loaderButtonError', error.message)
        }
        this.setLoading(false)
      }
    }
  },
  props: {
    value: Boolean,
    buttonText: String,
    buttonIcon: String,
    promiseAwait: Function,
    promiseItem: Object,
    disabled: Boolean,
    loading: {
      type: Boolean,
      default: false
    },
    flat: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: 'primary'
    }
  }
}
</script>
