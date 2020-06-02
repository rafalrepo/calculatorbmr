class CalculatorBMR {
  constructor() {
    this.result = {
      result: "",
      fullResult: "",
      proteins: "",
      carbohydrates: "",
      fats: "",
    };

    this.UISelectors = {
      method: document.getElementById("calculationMethod"),
      gender: "gender",
      age: document.getElementById("age"),
      errorAge: document.querySelector(".error--age"),
      weight: document.getElementById("weight"),
      errorWeight: document.querySelector(".error--weight"),
      growth: document.getElementById("growth"),
      errorGrowth: document.querySelector(".error--growth"),
      activity: document.getElementById("activity"),
      errorActivity: document.querySelector(".error--activity"),
      btnCalculateBMR: document.querySelector("[data-calculate-bmr]"),
      outputBMR: document.querySelector("[data-output-bmr]"),
      chart: document.querySelector("[data-output-chart]"),
      legend: document.querySelector("[data-legend-chart]"),
      outputDownBMR: document.querySelector("[data-output-bmr-down]"),
      chartDown: document.querySelector("[data-output-chart-down]"),
      legendDown: document.querySelector("[data-legend-chart-down]"),
      outputUpBMR: document.querySelector("[data-output-bmr-up]"),
      chartUp: document.querySelector("[data-output-chart-up]"),
      legendUp: document.querySelector("[data-legend-chart-up]"),
    };
  }

  initialize() {
    this.UISelectors.btnCalculateBMR.addEventListener("click", (e) => {
      e.preventDefault();
      const method = this.UISelectors.method.value;
      const gender = document.querySelector(
        `input[name=${this.UISelectors.gender}]:checked`
      ).value;
      const activity = this.UISelectors.activity.value;
      const age = this.UISelectors.age.value;
      const weight = this.UISelectors.weight.value;
      const growth = this.UISelectors.growth.value;
      const output = this.UISelectors.outputBMR;
      const outputDown = this.UISelectors.outputDownBMR;
      const outputUp = this.UISelectors.outputUpBMR;

      const mActivity = this.setActivityLevel(activity);

      if (this.validate(age, weight, growth, mActivity)) {
        if (method === "0") {
          this.result.result = this.mHarrisonBenedicta(
            weight,
            growth,
            age,
            gender
          );
        } else if (method === "1") {
          this.result.result = this.mMiffinStJeor(weight, growth, age, gender);
        }
      }

      if (mActivity > 0)
        this.result.fullResult = Math.round(this.result.result * mActivity);

      if (this.result.result && this.result.fullResult) {
        this.result.proteins = this.calDemand(this.result.fullResult, 15);
        this.result.carbohydrates = this.calDemand(this.result.fullResult, 55);
        this.result.fats = this.calDemand(this.result.fullResult, 30);

        output.innerHTML = this.outputResult(this.result);

        const chart = new ChartJS(
          [
            this.setGProCarb(this.result.proteins),
            this.setGProCarb(this.result.carbohydrates),
            this.setGFats(this.result.fats),
          ],
          ["Białka", "Węglowodany", "Tłuszcze"],
          ["#69bdd2", "#1979a9", "#44bcd8"],
          this.UISelectors.chart,
          this.UISelectors.legend
        );
        chart.setPieCharts();

        let fullResult = this.result.fullResult;

        this.result.fullResult = this.setDownCalories(fullResult);
        this.result.proteins = this.calDemand(this.result.fullResult, 15);
        this.result.carbohydrates = this.calDemand(this.result.fullResult, 55);
        this.result.fats = this.calDemand(this.result.fullResult, 30);

        outputDown.innerHTML = this.oResultDU(
          this.result,
          "Jeśli chcesz schudnąć, towje zapotrzebowanie kaloryczne wynosi:"
        );

        const chartDown = new ChartJS(
          [
            this.setGProCarb(this.result.proteins),
            this.setGProCarb(this.result.carbohydrates),
            this.setGFats(this.result.fats),
          ],
          ["Białka", "Węglowodany", "Tłuszcze"],
          ["#69bdd2", "#1979a9", "#44bcd8"],
          this.UISelectors.chartDown,
          this.UISelectors.legendDown
        );
        chartDown.setPieCharts();

        this.result.fullResult = this.setUpCalories(fullResult);
        this.result.proteins = this.calDemand(this.result.fullResult, 15);
        this.result.carbohydrates = this.calDemand(this.result.fullResult, 55);
        this.result.fats = this.calDemand(this.result.fullResult, 30);

        outputUp.innerHTML = this.oResultDU(
          this.result,
          "Jeśli chcesz przytyć, towje zapotrzebowanie kaloryczne wynosi:"
        );

        const chartUp = new ChartJS(
          [
            this.setGProCarb(this.result.proteins),
            this.setGProCarb(this.result.carbohydrates),
            this.setGFats(this.result.fats),
          ],
          ["Białka", "Węglowodany", "Tłuszcze"],
          ["#69bdd2", "#1979a9", "#44bcd8"],
          this.UISelectors.chartUp,
          this.UISelectors.legendUp
        );
        chartUp.setPieCharts();
      }
    });

    this.ValidateBlur();
  }

  setActivityLevel(level) {
    switch (parseInt(level)) {
      case 1:
        level = 1;
        break;
      case 2:
        level = 1.2;
        break;
      case 3:
        level = 1.4;
        break;
      case 4:
        level = 1.6;
        break;
      case 5:
        level = 1.8;
        break;
      case 6:
        level = 2;
        break;
      case 7:
        level = 2.2;
        break;
    }
    return level;
  }

  validate(a, w, g, ma) {
    let flag = true;

    if (a < 0 || a === "") {
      this.setError(this.UISelectors.age, this.UISelectors.errorAge);
      flag = false;
    }
    if (w < 0 || w === "") {
      this.setError(this.UISelectors.weight, this.UISelectors.errorWeight);
      flag = false;
    }
    if (g < 0 || g === "") {
      this.setError(this.UISelectors.growth, this.UISelectors.errorGrowth);
      flag = false;
    }
    if (ma === "0") {
      this.setError(this.UISelectors.activity, this.UISelectors.errorActivity);
      flag = false;
    }

    return flag;
  }

  ValidateBlur() {
    this.UISelectors.age.addEventListener("keyup", () => {
      this.UISelectors.age.value !== ""
        ? this.unsetError(this.UISelectors.age, this.UISelectors.errorAge)
        : this.setError(this.UISelectors.age, this.UISelectors.errorAge);
    });

    this.UISelectors.weight.addEventListener("keyup", () => {
      this.UISelectors.weight.value !== ""
        ? this.unsetError(this.UISelectors.weight, this.UISelectors.errorWeight)
        : this.setError(this.UISelectors.weight, this.UISelectors.errorWeight);
    });

    this.UISelectors.growth.addEventListener("keyup", () => {
      this.UISelectors.growth.value !== ""
        ? this.unsetError(this.UISelectors.growth, this.UISelectors.errorGrowth)
        : this.setError(this.UISelectors.growth, this.UISelectors.errorGrowth);
    });

    this.UISelectors.activity.addEventListener("change", () => {
      this.UISelectors.activity.value === "0"
        ? this.setError(
            this.UISelectors.activity,
            this.UISelectors.errorActivity
          )
        : this.unsetError(
            this.UISelectors.activity,
            this.UISelectors.errorActivity
          );
    });
  }

  setError(el, err) {
    err.style.display = "block";
    el.style.borderColor = "#FF9494";
  }

  unsetError(el, err) {
    err.style.display = "none";
    el.style.borderColor = "#0079a1";
  }

  outputResult({ result, fullResult, proteins, carbohydrates, fats }) {
    return `<div class="result">
        <h4 class="result__heading">Twoja podstawowa przemiana materii wynosi:</h4>
        <span class="result__reultText">${result} kcal</span>
        <h4 class="result__heading">Twoje zapotrzebowanie kaloryczne wynosi:</h4>
        <span class="result__reultText">${fullResult} kcal</span>  

        <h5 class="result__subheading">Przykladowe wyliczenie zapotrzebowania na makroskładniki:</h5>
        <p class="result__macronutrients">
          <ul class="macronutrients__list">
            <li class="macronutrients__item">15% białka: <span class="primary-color">${proteins}</span> kcal 
              = <span class="primary-color">${this.setGProCarb(
                proteins
              )}</span>g</li>
            <li class="macronutrients__item">55% węglowodanów: <span class="primary-color">${carbohydrates}</span> kcal 
              = <span class="primary-color">${this.setGProCarb(
                carbohydrates
              )}</span>g</li>
            <li class="macronutrients__item">30% tłuszczu: <span class="primary-color">${fats}</span> kcal 
              = <span class="primary-color">${this.setGFats(fats)}</span>g</li>
          </ul>
        </p>
      </div>`;
  }

  oResultDU({ fullResult, proteins, carbohydrates, fats }, text) {
    return `<div class="result">
            <h4 class="result__heading">${text}</h4>
            <span class="result__reultText">${fullResult} kcal</span>  

            <h5 class="result__subheading">Przykladowe wyliczenie zapotrzebowania na makroskładniki:</h5>
            <p class="result__macronutrients">
              <ul class="macronutrients__list">
                <li class="macronutrients__item">15% białka: <span class="primary-color">${proteins}</span> kcal 
                  = <span class="primary-color">${this.setGProCarb(
                    proteins
                  )}</span>g</li>
                <li class="macronutrients__item">55% węglowodanów: <span class="primary-color">${carbohydrates}</span> kcal 
                  = <span class="primary-color">${this.setGProCarb(
                    carbohydrates
                  )}</span>g</li>
                <li class="macronutrients__item">30% tłuszczu: <span class="primary-color">${fats}</span> kcal 
                  = <span class="primary-color">${this.setGFats(
                    fats
                  )}</span>g</li>
              </ul>
            </p>
          </div>`;
  }

  setGProCarb(val) {
    return Math.round(val / 4);
  }

  setGFats(val) {
    return Math.round(val / 9);
  }

  calDemand(fullResult, procent) {
    return Math.round((procent / 100) * fullResult);
  }

  mHarrisonBenedicta(w, g, a, gender) {
    if (gender === "male") {
      return Math.round(66 + 13.7 * w + 5 * g - 6.76 * a);
    } else if (gender === "female") {
      return Math.round(655 + 9.6 * w + 1.8 * g - 4.7 * a);
    }
  }

  mMiffinStJeor(w, g, a, gender) {
    if (gender === "male") {
      return Math.round(9.99 * w + 6.25 * g - 4.92 * a + 5);
    } else if (gender === "female") {
      return Math.round(9.99 * w + 6.25 * g - 4.92 * a + 161);
    }
  }

  setUpCalories(val) {
    return Math.round((15 / 100) * val) + Math.round(val);
  }

  setDownCalories(val) {
    return Math.round(val) - Math.round((15 / 100) * val);
  }
}

class ChartJS {
  constructor(data, labels, color, chartS, legendS) {
    this.chart = null;
    this.width = "auto";
    this.height = "200px";

    this.data = {
      datasets: [
        {
          fill: true,
          data: data,
          backgroundColor: color,
          borderColor: color,
          hoverBorderColor: color,
        },
      ],

      labels: labels,
    };

    this.options = {
      legend: {
        position: "bottom",
        display: false,
      },
      legendCallback: function (chart) {
        var text = [];
        text.push('<ul class="' + chart.id + '-legend">');
        for (var i = 0; i < chart.data.datasets[0].data.length; i++) {
          text.push("<li>");
          text.push(
            '<span style="background-color:' +
              color[i] +
              '">' +
              labels[i] +
              "</span>"
          );
          text.push("</li>");
        }
        text.push("</ul>");
        return text.join("");
      },
      tooltips: {
        enabled: false,

        custom: function (tooltipModel) {
          var tooltipEl = document.getElementById("chartjs-tooltip");

          if (!tooltipEl) {
            tooltipEl = document.createElement("div");
            tooltipEl.id = "chartjs-tooltip";
            tooltipEl.innerHTML = "<table></table>";
            document.body.appendChild(tooltipEl);
          }

          if (tooltipModel.opacity === 0) {
            tooltipEl.style.opacity = 0;
            return;
          }

          tooltipEl.classList.remove("above", "below", "no-transform");
          if (tooltipModel.yAlign) {
            tooltipEl.classList.add(tooltipModel.yAlign);
          } else {
            tooltipEl.classList.add("no-transform");
          }

          function getBody(bodyItem) {
            return bodyItem.lines;
          }

          if (tooltipModel.body) {
            var bodyLines = tooltipModel.body.map(getBody);
            var innerHtml = "<tbody>";

            bodyLines.forEach(function (body, i) {
              var style =
                "background: #0079a1; padding: 5px 10px; border: 1px solid #fff; border-radius: 5px; color: #fff";
              var span =
                '<tr><td><span style="' +
                style +
                '">' +
                body +
                "g</span></td></tr>";
              innerHtml += span;
            });
            innerHtml += "</tbody>";

            var tableRoot = tooltipEl.querySelector("table");
            tableRoot.innerHTML = innerHtml;
          }

          var position = this._chart.canvas.getBoundingClientRect();

          tooltipEl.style.opacity = 1;
          tooltipEl.style.position = "absolute";
          tooltipEl.style.left =
            position.left +
            window.pageXOffset +
            tooltipModel.caretX +
            -30 +
            "px";
          tooltipEl.style.top =
            position.top +
            window.pageYOffset +
            tooltipModel.caretY +
            -30 +
            "px";
          tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
          tooltipEl.style.fontSize = tooltipModel.bodyFontSize + "px";
          tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
          tooltipEl.style.padding =
            tooltipModel.yPadding + "px " + tooltipModel.xPadding + "px";
          tooltipEl.style.pointerEvents = "none";
        },
      },
    };

    this.UISelectors = {
      chart: chartS,
      legend: legendS,
    };
  }

  setPieCharts() {
    this.chart = new Chart(this.UISelectors.chart.getContext("2d"), {
      type: "doughnut",
      data: this.data,
      options: this.options,
    });

    this.UISelectors.legend.innerHTML = this.chart.generateLegend();

    this.UISelectors.chart.style.width = this.width;
    this.UISelectors.chart.style.height = this.height;
  }
}
