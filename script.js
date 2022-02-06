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
  localStorageObject.set("step", number);
  const card = document.querySelector(`.card[data-step="${number}"]`);

  if (!card) return;

  for (const card of cards) {
    card.classList.remove("card_active");
  }

  card.classList.add("card_active");

  if (card.dataset.inited) return;

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

  if (localStorageObject.get("question_1") || data.question_1) {
    progressValue += 1;
  }

  if (localStorageObject.get("question_2")?.length || data.question_2.length) {
    progressValue += 1;
  }

  if (localStorageObject.get("question_3")?.length || data.question_3.length) {
    progressValue += 1;
  }

  if (localStorageObject.get("name") || data.question_4.name) {
    progressValue += 1;
  }

  if (localStorageObject.get("surname") || data.question_4.surname) {
    progressValue += 1;
  }

  if (
    RegExForMail.test(localStorageObject.get("email") || data.question_4.email)
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

const localStorageObject = {
  set: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  get: (key) => {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (error) {
      return null;
    }
  },
};

const initStep_1 = () => {
  const card = document.querySelector(".card[data-step='1']");
  const startButton = card.querySelector("button[data-action='start']");

  startButton.addEventListener("click", () => stepActive(2));
};

const initStep_2 = () => {
  const card = document.querySelector(".card[data-step='2']");
  const variants = card.querySelectorAll("[data-value]");

  for (const variant of variants) {
    variant.addEventListener("click", variantClickHandler);
  }

  const toPrevButton = card.querySelector("button[data-action='toPrevPage']");
  const toNextButton = card.querySelector("button[data-action='toNextPage']");

  toPrevButton.addEventListener("click", () => stepActive(1));
  toNextButton.addEventListener("click", () => stepActive(3));

  const q1ValueFromLS = localStorageObject.get("question_1");

  if (q1ValueFromLS) {
    card.querySelector(`input[value='${q1ValueFromLS}']`).checked = true;
  }

  toNextButton.disabled = !q1ValueFromLS || false;

  function variantClickHandler() {
    data.question_1 = this.dataset.value;
    localStorageObject.set("question_1", data.question_1);

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

  toPrevButton.addEventListener("click", () => stepActive(2));
  toNextButton.addEventListener("click", () => stepActive(4));

  for (const variant of variants) {
    variant.addEventListener("click", variantClickHandler);
  }

  const q2ValueFromLS = localStorageObject.get("question_2");

  if (q2ValueFromLS?.length) {
    for (const variant of q2ValueFromLS) {
      card.querySelector(`input[value='${variant}']`).checked = true;
    }

    data.question_2 = q2ValueFromLS;
  }

  toNextButton.disabled = !q2ValueFromLS?.length || false;

  function variantClickHandler() {
    toggleItem(data.question_2, this.dataset.value);
    localStorageObject.set("question_2", data.question_2);

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

  toPrevButton.addEventListener("click", () => stepActive(3));
  toNextButton.addEventListener("click", () => stepActive(5));

  const q3ValueFromLS = localStorageObject.get("question_3");

  if (q3ValueFromLS?.length) {
    for (const variant of q3ValueFromLS) {
      card
        .querySelector(`div[data-value='${variant}']`)
        .classList.add("variant-square--active");
    }

    data.question_3 = q3ValueFromLS;
  }

  toNextButton.disabled = !q3ValueFromLS?.length || false;

  for (const variant of variants) {
    variant.addEventListener("click", variantClickHandler);
  }

  function variantClickHandler() {
    toggleItem(data.question_3, this.dataset.value);
    localStorageObject.set("question_3", data.question_3);

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

  if (localStorageObject.get("name")) {
    nameInput.value = localStorageObject.get("name");
  }

  if (localStorageObject.get("surname")) {
    surnameInput.value = localStorageObject.get("surname");
  }

  if (localStorageObject.get("email")) {
    emailInput.value = localStorageObject.get("email");
  }

  function nameInputHandler() {
    data.question_4.name = this.value;
    localStorageObject.set("name", data.question_4.name);
    checkFields();
  }

  function surnameInputHandler() {
    data.question_4.surname = this.value;
    localStorageObject.set("surname", data.question_4.surname);
    checkFields();
  }

  function emailInputHandler() {
    data.question_4.email = this.value;
    localStorageObject.set("email", data.question_4.email);
    checkFields();
  }

  function checkFields() {
    let activeNextButton = false;

    if (
      data.question_4.name &&
      data.question_4.surname &&
      RegExForMail.test(data.question_4.email)
    ) {
      activeNextButton = true;
    }

    toNextButton.disabled = !activeNextButton;
    progressSegmentsUpdate();
  }
};

const initStep_6 = () => {
  const card = document.querySelector(".card[data-step='6']");
  const emailSpan = card.querySelector("span[data-field='email']");

  emailSpan.textContent =
    localStorageObject.get("email") || data.question_4.email;
};

const main = () => {
  stepActive(parseInt(localStorageObject.get("step")) || 1);
  progressSegmentsUpdate();
};

main();
