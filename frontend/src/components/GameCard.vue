<template>
  <div :class="['cah_card', black? 'cah_black' : 'cah_white',
                selected ? 'cah_selected' : '', 
                clickable ? 'clickable' : '']"
        @click="clicked"
  >
    <div class="card_text" v-html="text_dashes"></div>
    <div class='cah_card_body'>
      <div v-if="pick>1" class="pick">PICK {{ pick }} </div>
      <div>
      </div>
    </div>
    <div class="inner_card">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss">

  $hwr: 1.3939; // height width ratio
  $width: 120px;
  $height: $width*$hwr;
  $padding: 16px;
  $font-size: ($width - 2*$padding)/6.8;

  .pick {
    position: absolute;
    bottom: 5px;
    right: 10px;
  }

  .inner_card {
    margin-left: 20px;
  }

  .cah_card {
    position: relative;
    font-weight: 500;
    font-size: $font-size;
    width: $width;
    user-select: none;


  }

  .card_text {
    width: $width;
    position: relative;
    padding: 6px;
    z-index: 10;
  }
 
  .cah_card_body {
    top: 0px;
    position: absolute;
    padding: $padding;
    border-radius: 5px;
    width: $width;
    height: $height;

    box-shadow: (0 1px 5px rgba(0,0,0,0.2),
                 0 2px 2px rgba(0,0,0,0.14), 
                 0 3px 1px -2px rgba(0,0,0,0.12));
    // vertical-align: top;

  }
  
  .cah_black {
    color: white;
    height: $height;
    .cah_card_body{
      background-color: black !important;
    }
  }

  .cah_white {
    color: black;

    .cah_card_body {
      background-color: white !important;
    }
  }

  .cah_selected {
    transform: scale(0.95);
    transition:  transform 0.1s ease-in;
    .cah_card_body{
      background-color: #d8d8d8 !important;
    }
  }

  .clickable {
    cursor: pointer;
    &:hover{
      .cah_card_body{
        transform: scale(1.05);
        box-shadow: 1px 8px 20px grey;
        transition:  box-shadow .3s ease-in;
      }
    }
  }


</style>

<script>
export default {
  name: 'GameCard',
  props: {
      text: String,
      clickable: {
        type: Boolean,
        default: false
      },
      selected: {
        type: Boolean,
        default: false
      },
      black: {
        type: Boolean,
        default: false
      },
      pick: {
        type: Number,
        default: 1
      }
  },
  computed: {
    text_dashes() {
      return this.text.replace(/_/gi, '___')
    },
  },
  methods: {
    clicked() {
      if(this.clickable){
        this.$emit('clicked')
      }
    }

  }
}
</script>
