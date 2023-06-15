/* eslint-disable quotes */
export const Templates = {
  'HistoryButton': `<a href="#" class="bb-hud-enh-remembrall-button"></a>`,
  'NoiseMeterArrow': `<div class="bountifulBeanstalkCastleView__noiseMeterArrow">▲</div>`,
  'HarpMeOut': `
    <div class="bountifulBeanstalkPlayHarpDialogView__roomInfoContainer harpMeOutContainer" style="margin-top: 0;">
      <div class="bountifulBeanstalkPlayHarpDialogView__room">
        <div class="bountifulBeanstalkPlayHarpDialogView__roomText" style="color: #85d523;">
          Harp Me Out!
        </div>
        <div class="harpMeOut__buttonContainer mousehuntTooltipParent">
          <button class="bountifulBeanstalkPlayHarpDialogView__maxHarpStringsButton max" style="color: white;">
            Max
          </button>
          <div class="mousehuntTooltip tight top noEvents">
            Set value as if you missed/fta every hunt.
            <br>
            <br>
            <b>Warning:</b> Uses the most amount of string to guarantee chase.
            <div class="mousehuntTooltip-arrow"></div>
          </div>
        </div>
        <div class="harpMeOut__buttonContainer mousehuntTooltipParent">
          <button class="bountifulBeanstalkPlayHarpDialogView__maxHarpStringsButton avg"
            style="color: white;">
            Avg
          </button>
          <div class="mousehuntTooltip tight top noEvents">
            Set value based on your estimated catch rate.
            <br>
            <br>
            <b>Warning:</b> No guarantee to get chased out.
            <div class="mousehuntTooltip-arrow"></div>
          </div>
        </div>
        <div class="harpMeOut__buttonContainer mousehuntTooltipParent">
          <button class="bountifulBeanstalkPlayHarpDialogView__maxHarpStringsButton min"
            style="color: white;">
            Min
          </button>
          <div class="mousehuntTooltip tight top noEvents">
            Set loud value to minimum amount of strings.
            <br>
            Most useful when noise per catch is equal to noise per miss.
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
