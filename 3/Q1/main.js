const { promiseAccess, promiseReadFile, promiseWrite } = require("./promiseFs");

Promise.all([promiseAccess("numbers.txt"), promiseAccess("names.txt")])
  .then(function () {
    return Promise.all([
      promiseReadFile("numbers.txt"),
      promiseReadFile("names.txt"),
    ]);
  })
  .then(parsed)
  .then((data) => promiseWrite("result.txt", data))
  .catch((err) => console.log(err));

function parsed([numbers, names]) {

  let person = {};
  let personData = names.split("\n");
  for (const element of personData) {
    [key, value] = element.split(" - ");
    person[key] = value;
  }
  console.log(person)
  let numbersObject = {};
  let numbersData = numbers.split("\n");
  for (const element of numbersData) {
    [key, value] = element.split(" - ");
    if (numbersObject[key]) {
      numbersObject[key] = [...numbersObject[key], value];
    } else {
      numbersObject[key] = [value];
    }
  }
  console.log(numbersObject)

  let res = "";
  for (let key in person) {
    switch (numbersObject[key]?.length) {
      case undefined:
        res += `${person[key]} hasn’t any phone number.\n`;
        break;
      case 1:
        res += `${person[key]}’s phone number is ${numbersObject[key][0]}.\n`;
        break;
      default:
        res += `${person[key]}’s phone numbers are ${numbersObject[key].join(
          ", "
        )}.\n`;
        break;
    }
  }
  console.log(res);
  return res;
}
