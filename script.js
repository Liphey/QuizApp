const RegExForMail =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const cards = document.querySelectorAll(".card");
const progressSegments = document.querySelectorAll(".progress");

const data = {
  question_1: null,
  question_2: [],
  question_3: [],
  question_4: {
    name: "",
    surname: "",
    email: "",
  },
};

const stepActive = (number) => {
  localStorage.setItem("step", number);
  const card = document.querySelector(`.card[data-step="${number}"]`);

  if (!card || card.dataset.inited) return;

  for (const card of cards) {
    card.classList.remove("card_active");
  }

  card.classList.add("card_active");
  card.dataset.inited = true;

  switch (number) {
    case 1:
      initStep_1();
      break;
    case 2:
      initStep_2();
      break;
    case 3:
      initStep_3();
      break;
    case 4:
      initStep_4();
      break;
    case 5:
      initStep_5();
      break;
    case 6:
      initStep_6();
      break;
  }
};

const progressSegmentsUpdate = () => {
  let progressValue = 0;
  const dataFromLS = JSON.parse(localStorage.getItem("data"));

  if (dataFromLS?.question_1 || data.question_1) {
    progressValue += 1;
  }

  if (dataFromLS?.question_2.length || data.question_2.length) {
    progressValue += 1;
  }

  if (dataFromLS?.question_3.length || data.question_3.length) {
    progressValue += 1;
  }

  if (dataFromLS?.question_4.name || data.question_4.name) {
    progressValue += 1;
  }

  if (dataFromLS?.question_4.surname || data.question_4.surname) {
    progressValue += 1;
  }

  if (
    RegExForMail.test(dataFromLS?.question_4.email || data.question_4.email)
  ) {
    progressValue += 1;
  }

  const progressPercent = (progressValue / 6) * 100;

  for (const progressSegment of progressSegments) {
    const progressElement = progressSegment.querySelector("progress");
    const progressText = progressSegment.querySelector(".progress-title");

    progressElement.value = progressPercent;
    progressText.textContent = `${Math.ceil(progressPercent)}%`;
    progressText.style.width = `${Math.ceil(progressPercent)}%`;

    progressText.style.dispay = progressPercent ? "" : "none";
  }
};

const toggleItem = (array, item) => {
  const index = array.indexOf(item);
  index === -1 ? array.push(item) : array.splice(index, 1);
};

const initStep_1 = () => {
  const card = document.querySelector(".card[data-step='1']");
  const startButton = document.querySelector("button[data-action='start']");

  startButton.addEventListener("click", () => stepActive(2));
};

const initStep_2 = () => {
  const card = document.querySelector(".card[data-step='2']");
  const variants = card.querySelectorAll("[data-value]");

  const toPrevButton = card.querySelector("button[data-action='toPrevPage']");
  const toNextButton = card.querySelector("button[data-action='toNextPage']");

  toNextButton.disabled = true;

  toPrevButton.addEventListener("click", () => stepActive(1));
  toNextButton.addEventListener("click", () => stepActive(3));

  for (const variant of variants) {
    variant.addEventListener("click", variantClickHandler);
  }

  function variantClickHandler() {
    data.question_1 = this.dataset.value;
    localStorage.setItem("data", JSON.stringify(data));

    for (const variant of variants) {
      const radioButton = variant.querySelector('input[type="radio"]');
      radioButton.checked = false;
    }

    const radioButton = this.querySelector('input[type="radio"]');
    radioButton.checked = true;

    toNextButton.disabled = false;
    progressSegmentsUpdate();
  }
};

const initStep_3 = () => {
  const card = document.querySelector(".card[data-step='3']");
  const variants = card.querySelectorAll("[data-value]");

  const toPrevButton = card.querySelector("button[data-action='toPrevPage']");
  const toNextButton = card.querySelector("button[data-action='toNextPage']");

  toNextButton.disabled = true;

  toPrevButton.addEventListener("click", () => stepActive(2));
  toNextButton.addEventListener("click", () => stepActive(4));

  for (const variant of variants) {
    variant.addEventListener("click", variantClickHandler);
  }

  function variantClickHandler() {
    toggleItem(data.question_2, this.dataset.value);
    localStorage.setItem("data", JSON.stringify(data));

    for (const variant of variants) {
      const checkbox = variant.querySelector('input[type="checkbox"]');
      checkbox.checked = data.question_2.includes(variant.dataset.value);
    }

    toNextButton.disabled = !data.question_2.length;
    progressSegmentsUpdate();
  }
};

const initStep_4 = () => {
  const card = document.querySelector(".card[data-step='4']");
  const variants = card.querySelectorAll("[data-value]");

  const toPrevButton = card.querySelector("button[data-action='toPrevPage']");
  const toNextButton = card.querySelector("button[data-action='toNextPage']");

  toNextButton.disabled = true;

  toPrevButton.addEventListener("click", () => stepActive(3));
  toNextButton.addEventListener("click", () => stepActive(5));

  for (const variant of variants) {
    variant.addEventListener("click", variantClickHandler);
  }

  function variantClickHandler() {
    toggleItem(data.question_3, this.dataset.value);
    localStorage.setItem("data", JSON.stringify(data));

    for (const variant of variants) {
      data.question_3.includes(variant.dataset.value)
        ? variant.classList.add("variant-square--active")
        : variant.classList.remove("variant-square--active");
    }

    toNextButton.disabled = !data.question_3.length;
    progressSegmentsUpdate();
  }
};

const initStep_5 = () => {
  const card = document.querySelector(".card[data-step='5']");

  const nameInput = card.querySelector("input[data-field='name']");
  const surnameInput = card.querySelector("input[data-field='surname']");
  const emailInput = card.querySelector("input[data-field='email']");

  const toPrevButton = card.querySelector("button[data-action='toPrevPage']");
  const toNextButton = card.querySelector("button[data-action='toNextPage']");

  toNextButton.disabled = true;

  toPrevButton.addEventListener("click", () => stepActive(4));
  toNextButton.addEventListener("click", () => stepActive(6));

  nameInput.addEventListener("keyup", nameInputHandler);
  surnameInput.addEventListener("keyup", surnameInputHandler);
  emailInput.addEventListener("keyup", emailInputHandler);

  function nameInputHandler() {
    data.question_4.name = this.value;
    checkFields();
  }

  function surnameInputHandler() {
    data.question_4.surname = this.value;
    localStorage.setItem("data", JSON.stringify(data));

    checkFields();
  }

  function emailInputHandler() {
    data.question_4.email = this.value;
    localStorage.setItem("data", JSON.stringify(data));

    checkFields();
  }

  function checkFields() {
    let activeButton = true;

    if (
      !data.question_4.name ||
      !data.question_4.surname ||
      !RegExForMail.test(data.question_4.email)
    ) {
      activeButton = false;
    }

    toNextButton.disabled = !activeButton;
    progressSegmentsUpdate();
  }
};

const initStep_6 = () => {
  const card = document.querySelector(".card[data-step='6']");
  const emailSpan = card.querySelector("span[data-field='email']");

  emailSpan.textContent =
    JSON.parse(localStorage.getItem("data")).question_4.email ||
    data.question_4.email;
};

const main = () => {
  stepActive(localStorage.getItem("step") || 1);
  progressSegmentsUpdate();
};

main();
