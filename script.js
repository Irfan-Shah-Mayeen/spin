const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spin-btn");
const finalValue = document.getElementById("final-value");
const maxScore = document.getElementById("max-score");
const scoreBoard = document.getElementById("score-board");

let valueArray = [];

const rotationValues = Array.from({ length: 39 }, (_, index) => ({
  minDegree: index * (360 / 39),
  maxDegree: (index + 1) * (360 / 39),
  value: index + 1,
}));

const data = Array(39).fill(16);
const pieColors = [
  "#0039a6",
  "#13274F",
  "#3457D5",
  "#002D62",
  "#2a52be",
  "#041E42",
  "#13274F",
];

let myChart = new Chart(wheel, {
  plugins: [ChartDataLabels],
  type: "pie",
  data: {
    labels: Array.from({ length: 39 }, (_, i) => i + 1),
    datasets: [
      {
        backgroundColor: pieColors,
        data: data,
      },
    ],
  },
  options: {
    responsive: true,
    animation: { duration: 0 },
    plugins: {
      tooltip: false,
      legend: { display: false },
      datalabels: {
        color: "#ffffff",
        anchor: "center",
        align: "center",
        font: { size: 16 },
        formatter: (_, context) => context.chart.data.labels[context.dataIndex],
      },
    },
  },
});

const valueGenerator = (angleValue) => {
  for (const i of rotationValues) {
    if (angleValue >= i.minDegree && angleValue <= i.maxDegree) {
      const congratsMessage = `Congratulations token number : ${i.value}!`;
      valueArray.push({ value: i.value, congratsMessage });
      spinBtn.disabled = false;
      spinBtn.innerHTML = `<img id="spin-btn" class="try-again" src="./icon/refresh-button.png" alt="try-again"/>`;
    //  maxScore.innerHTML = `${Math.max(...valueArray.map(item => item.value))}`;
      finalValue.innerHTML = `<p>Value: ${i.value}</p><p>${congratsMessage}</p>`;
      break;
    }
  }
};

let count = 0;
let resultValue = 101;

spinBtn.addEventListener("click", () => {
  spinBtn.disabled = true;
  finalValue.innerHTML = `<p>Good Luck!</p>`;
  const randomDegree = Math.floor(Math.random() * (355 - 0 + 1) + 0);
  const rotationInterval = window.setInterval(() => {
    myChart.options.rotation = myChart.options.rotation + resultValue;
    myChart.update();
    if (myChart.options.rotation >= 360) {
      count += 1;
      resultValue -= 5;
      myChart.options.rotation = 0;
    } else if (count > 15 && myChart.options.rotation == randomDegree) {
      valueGenerator(randomDegree);
      clearInterval(rotationInterval);
      count = 0;
      resultValue = 101;
    }
  }, 10);
});

function myFunction() {
  const popup = document.getElementById("myPopup");
  popup.classList.toggle("show");

  scoreBoard.innerHTML = "";

  valueArray.forEach((item, index) => {
    const listItem = document.createElement("li");
    const ordinalNumber = getOrdinalNumber(index + 1);
    listItem.innerHTML = `${ordinalNumber} score: ${item.value} - ${item.congratsMessage}`;
    scoreBoard.appendChild(listItem);
  });
}

function getOrdinalNumber(number) {
  const suffixes = ["th", "st", "nd", "rd"];
  const remainder = number % 100;
  const suffix = suffixes[(remainder - 20) % 10] || suffixes[remainder] || suffixes[0];
  return `${number}${suffix}`;
}
