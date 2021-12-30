const { promiseAccess, promiseReadFile, promiseWrite } = require("./promiseFs");

function parsed(names, numbers) {
  let person = {};
  let personData = names.split("\n");
  for (const element of personData) {
    [key, value] = element.split(" - ");
    person[key] = value;
  }
  let numbersObject = {};
  let numbersData = numbers.split("\n");
  for (const element of numbersData) {
    [key, value] = element.split(" - ");
    if (!!numbersObject[key]) {
      numbersObject[key] = [...numbersObject[key], value];
    } else {
      numbersObject[key] = [value];
    }
  }
  let res = "";
  for (const key in person) {
    switch (numbersObject[key]?.length) {
      case undefined:
        res += `${person[key]} does not have a number. \n`;
        break;
      case 1:
        res += `${person[key]}'s phone number is ${numbersObject[key][0]}. \n`;
        break;
      default:
        res += `${person[key]}'s phone numbers are ${numbersObject[key].join(
          " ,"
        )}. \n`;
        break;
    }
  }

  return res;
}

async function promise() {
  try {
    await Promise.all([promiseAccess("numbers.txt"), promiseAccess("names.txt")]);
    const [names, numbers] = await Promise.all([
      promiseReadFile("names.txt"),
      promiseReadFile("numbers.txt"),
    ]);

    const result = parsed(names, numbers);
    await promiseWrite("result.txt", result);

    console.log(result);
  } catch (err) {
    console.log(err);
  }
}

promise();
