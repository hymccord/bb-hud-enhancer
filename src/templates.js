/* eslint-disable quotes */
export const Templates = {
  'CraftalyzerContainer': `<div class="headsUpDisplayBountifulBeanstalkView__craftalyzerQuantity"></div>`,
  'HistoryButton': `<a href="#" class="bb-hud-enh-remembrall-button"></a>`,
  'NoiseMeterArrow': `<div class="bountifulBeanstalkCastleView__noiseMeterArrow">▲</div>`,
  'HarpMeOut': `
<div class="bountifulBeanstalkPlayHarpDialogView__roomInfoContainer harpMeOutContainer" style="margin-top: 0;">
  <div class="bountifulBeanstalkPlayHarpDialogView__room">
    <div class="bountifulBeanstalkPlayHarpDialogView__roomText" style="color: #85d523;">
      Set Soft
    </div>
    <div class="harpMeIn__buttonContainer mousehuntTooltipParent">
      <button class="bountifulBeanstalkPlayHarpDialogView__maxHarpStringsButton min" style="color: white;">
        Min
      </button>
      <div class="mousehuntTooltip tight top noEvents">
        Set soft value as if you made the minimal amount of noise.
        <br>
        Best when min and max noise per hunt is equal.
        <br>
        <br>
        <b>Warning:</b> Uses a minimal amount of strings.
        <div class="mousehuntTooltip-arrow"></div>
      </div>
    </div>
    <div class="harpMeIn__buttonContainer mousehuntTooltipParent">
      <button class="bountifulBeanstalkPlayHarpDialogView__maxHarpStringsButton avg" style="color: white;">
        Avg
      </button>
      <div class="mousehuntTooltip tight top noEvents">
        Set soft value as if you made the average amount of noise. Based on your estimated catch rate.
        <br>
        <br>
        <b>Warning:</b> No guarantee that you will get to next room.
        <div class="mousehuntTooltip-arrow"></div>
      </div>
    </div>
    <div class="harpMeIn__buttonContainer mousehuntTooltipParent">
      <button class="bountifulBeanstalkPlayHarpDialogView__maxHarpStringsButton max" style="color: white;">
        Max
      </button>
      <div class="mousehuntTooltip tight top noEvents">
        Set soft value as if you made the most amount of noise. (ie 100% CR).
        <br>
        <br>
        <b>Warning:</b> Uses the most amount of strings but you won't get chased out if you make less than the max amount of noise with the amount hunts left.
        <div class="mousehuntTooltip-arrow"></div>
      </div>
    </div>
  </div>
  <div class="bountifulBeanstalkPlayHarpDialogView__lootMultiplier" style="width: 100px;">
    Harp Me Out!
  </div>
  <div class="bountifulBeanstalkPlayHarpDialogView__room">
    <div class="bountifulBeanstalkPlayHarpDialogView__roomText" style="color: #85d523;">
      Set Loud
    </div>
    <div class="harpMeOut__buttonContainer mousehuntTooltipParent">
      <button class="bountifulBeanstalkPlayHarpDialogView__maxHarpStringsButton max" style="color: white;">
        Max
      </button>
      <div class="mousehuntTooltip tight top noEvents">
        Sets loud value as if you made the minimal amount of noise.
        <br>
        <br>
        <b>Warning:</b> Uses the most amount of string to guarantee chase.
        <div class="mousehuntTooltip-arrow"></div>
      </div>
    </div>
    <div class="harpMeOut__buttonContainer mousehuntTooltipParent">
      <button class="bountifulBeanstalkPlayHarpDialogView__maxHarpStringsButton avg" style="color: white;">
        Avg
      </button>
      <div class="mousehuntTooltip tight top noEvents">
        Set loud value as if you made the average amount of noise. Based on your estimated catch rate.
        <br>
        <br>
        <b>Warning:</b> No guarantee to get chased out.
        <div class="mousehuntTooltip-arrow"></div>
      </div>
    </div>
    <div class="harpMeOut__buttonContainer mousehuntTooltipParent">
      <button class="bountifulBeanstalkPlayHarpDialogView__maxHarpStringsButton min" style="color: white;">
        Min
      </button>
      <div class="mousehuntTooltip tight top noEvents">
        Set loud value as if you made the most amount of noise.
        <br>
        Best when min and max noise per hunt is equal.
        <br>
        <br>
        <b>Warning:</b> If noise per hunt is not constant, then you won't get chased out unless you have 100% CR.
        <div class="mousehuntTooltip-arrow"></div>
      </div>
    </div>
  </div>
</div>
  `
};
