<template lang="pug">
  .container
    .chatBoxWrapper
      b-card.col-4(v-if='!showChat')
        b-form-group#input-group-2(label='Your Name' label-for='input-2')
          b-form-input#input-2(v-model='user' placeholder='Enter name' @keypress.enter='submitUser' required)
        .text-center
          b-button(variant='dark' @click='submitUser' :disabled='!user') Submit
      b-card.col-md-8.px-0(no-body v-else)
        .d-flex
          .chatList.border-right.col-3
            h5.border-bottom.py-2.font-weight-bold Users in chat
            p.font-weight-bold(v-for='(user, idx) in  getUsers' :key='idx')  {{ user }}
          .chatBox.p-4.w-100
            b-card.messages.mb-3
              p.text-center(v-if='!messages.length') No conversation yet! be the first to start!
              div(:class="[ user === msg.user ? 'message-right' : 'message-left', 'col-5 mb-4']" v-for='(msg, idx) in messages' :key='idx')
                b-card.text-white.p-2(no-body)
                  h6.mb-0 {{ msg.message }}
                small.text-muted {{ msg.user }}
            .message-input
              div
                b-input-group.w-100(size='lg')
                  b-form-input(v-model='message' @keypress.enter='sendMessage')
                  b-input-group-append
                    b-button(size='sm' text='Button' variant='dark' @click='sendMessage' :disabled='!message') Send
  </template>

<script>
// import { mapMutations, mapState } from 'vuex'
export default {
  data () {
    return {
      user: '',
      message: '',
      messages: [],
      showChat: false
    }
  },

  computed: {
    // ...mapState('user', ['userName']),
    getUsers () {
      const filteredUser = this.messages.map((data) => {
        return data.user
      })
      return [...new Set(filteredUser)]
    }
  },

  mounted () {
    this.showChat = false

    const eventSource = new EventSource('/sse')
    eventSource.addEventListener('message', (e) => {
      try {
        const messages = JSON.parse(e.data)
        this.messages = messages
      } catch (e) {
        console.log('error', e)
      }
    })
  },

  methods: {
    async sendMessage () {
      const payload = {
        user: this.user,
        message: this.message
      }
      const connection = await fetch('/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      const response = await connection.json()
      console.log('response', response)
      this.message = ''
    },

    submitUser () {
      // this.setUser(this.user)
      this.showChat = true
    }
    // ...mapMutations('user', ['setUser'])
  }
}
</script>

<style lang="css">
  .chatBoxWrapper {
    display: grid;
    place-items: center;
    min-height: 100vh;
  }
  .message-right {
    margin-left: auto;
  }
  .message-right .card {
    background: #343a40;
  }
  .message-right small{
    display:block;
    text-align: right;
  }

  .message-left {
    margin-right: auto;
  }

  .message-left small{
    display:block;
    text-align: left;
  }

   .message-left .card {
    background: #f9f9f9;
    color: #343a40 !important;
  }

  .chatBox .messages  {
    height: 60vh;
    overflow-y: auto;
  }
  input:focus, input:active, button {
    border-color:#ced4da !important;
    box-shadow: none !important;
  }
</style>
