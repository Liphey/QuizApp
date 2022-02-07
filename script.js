const RegExForMail =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const cards = document.querySelectorAll(".card");
const progressSegments = document.querySelectorAll(".progress");

const stepActive = (number) => {
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

  if (
    [...document.querySelectorAll(".card[data-step='2'] input")].some(
      (variant) => variant.checked
    )
  ) {
    progressValue += 1;
  }

  if (
    [...document.querySelectorAll(".card[data-step='3'] input")].some(
      (variant) => variant.checked
    )
  ) {
    progressValue += 1;
  }

  if (
    [
      ...document.querySelectorAll(
        ".card[data-step='4'] .variant-square--active"
      ),
    ].length
  ) {
    progressValue += 1;
  }

  if (
    document.querySelector(".card[data-step='5'] input[data-field='name']")
      .value
  ) {
    progressValue += 1;
  }

  if (
    document.querySelector(".card[data-step='5'] input[data-field='surname']")
      .value
  ) {
    progressValue += 1;
  }

  if (
    RegExForMail.test(
      document.querySelector(".card[data-step='5'] input[data-field='email']")
        .value
    )
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

const initStep_1 = () => {
  const card = document.querySelector(".card[data-step='1']");
  const startButton = card.querySelector("button[data-action='start']");

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
    const variant = this.querySelector(
      '.variant-header > input[type="checkbox"]'
    );

    variant.checked = !variant.checked;
    toNextButton.disabled = ![
      ...card.querySelectorAll("input[type='checkbox']"),
    ].some((input) => input.checked);

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
    this.classList.toggle("variant-square--active");
    toNextButton.disabled = ![
      ...card.querySelectorAll(".variant-square--active"),
    ].length;
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

  nameInput.addEventListener("keyup", checkFields);
  surnameInput.addEventListener("keyup", checkFields);
  emailInput.addEventListener("keyup", checkFields);

  function checkFields() {
    let activeNextButton = false;

    if (
      nameInput.value &&
      surnameInput.value &&
      RegExForMail.test(emailInput.value)
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

  emailSpan.textContent = document.querySelector(
    "input[data-field='email']"
  ).value;
};

const main = () => {
  stepActive(1);
  progressSegmentsUpdate();
};

main();
