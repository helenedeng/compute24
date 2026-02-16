(function () {
  const n1 = document.getElementById('n1');
  const n2 = document.getElementById('n2');
  const n3 = document.getElementById('n3');
  const n4 = document.getElementById('n4');
  const computeBtn = document.getElementById('compute');
  const output = document.getElementById('output');

  const inputs = [n1, n2, n3, n4];

  function isValidNum(value) {
    const n = Number(value);
    return Number.isInteger(n) && n >= 1 && n <= 10;
  }

  function updateValidity(input) {
    const v = input.value.trim();
    if (v === '') {
      input.classList.remove('invalid');
      return;
    }
    if (isValidNum(v)) {
      input.classList.remove('invalid');
    } else {
      input.classList.add('invalid');
    }
  }

  function getNumbers() {
    const nums = inputs.map((el) => el.value.trim()).filter((s) => s !== '');
    if (nums.length !== 4) return null;
    const parsed = nums.map(Number);
    if (parsed.some((n) => !isValidNum(n))) return null;
    return parsed;
  }

  function runCompute() {
    inputs.forEach(updateValidity);
    const numbers = getNumbers();
    if (numbers === null) {
      output.value = '';
      output.classList.remove('no-solution');
      output.placeholder = 'Enter four integers from 1 to 10.';
      return;
    }
    const result = compute24(numbers);
    output.placeholder = '';
    const noSolution = result === '-1';
    output.value = noSolution
      ? 'No expression found.'
      : result;
    output.classList.toggle('no-solution', noSolution);
  }

  computeBtn.addEventListener('click', runCompute);
  inputs.forEach((input) => {
    input.addEventListener('input', () => updateValidity(input));
    input.addEventListener('blur', () => updateValidity(input));
  });
})();
