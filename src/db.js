const AWS = require("aws-sdk")

AWS.config.update({
  region: "us-east-1",
  endpoint: "https://dynamodb.us-east-1.amazonaws.com ",
  accessKeyId: "AKIA5MYDEVY2ZAHTENWY",
  secretAccessKey: "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"
})

function capitalize (str) {
  return str ? str.slice(0, 1).toUpperCase() + str.slice(1) : ''
}

const checkRules = {
  methods: {
    fieldIsRequired (fieldName) {
      return v => {
        if (v !== undefined && v !== null && typeof v === 'string') v = v.trim()
        return (!!v && JSON.stringify(v) !== '{}') || v === 0 || `请完善${capitalize(fieldName) || '此处'}信息。`
      }
    },
    fieldIsInteger (fieldName) {
      return v => v % 1 === 0 || v === null || `${capitalize(fieldName) || '此处'}只能为整数。`
    },
    fieldIsNumber (fieldName) {
      return v => typeof v === 'number' || `${capitalize(fieldName) || '此处'}只能为数字。`
    },
    fieldIsOverZero (fieldName) {
      return v => v > 0 || v === null || `${capitalize(fieldName) || 'This field'}'s value must be over 0.`
    },
    fieldIsNoLessThanZero (fieldName) {
      return v => v >= 0 || v === null || `${capitalize(fieldName) || '此处'}至少为0。`
    },
    fieldIsZip () {
      return v => /^\d{5}$/.test(v) || ((/^\d{5}$/.test(v.split('-')[0]) && /^\d{5}$/.test(v.split('-')[1]))) ? true : "Zip code must be 'xxxxx' or 'xxxxx-xxxxx'"
    },
    fieldIsPhone () {
      return v => /^\d{10}$/.test(v) ? true : 'Phone number must be 10 digit'
    },
    fieldIsEmail () {
      return v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
    }
  }
}

const db = new AWS.DynamoDB()
const client = new AWS.DynamoDB.DocumentClient()

export {db, checkRules, client}
