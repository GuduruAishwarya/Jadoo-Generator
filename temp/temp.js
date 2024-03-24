function convertTextAreaStringToJsExpression(textAreaStringValue) {
  // Identify the variable names in the string.
  const variableNames = textAreaStringValue.match(/([a-zA-Z_$][a-zA-Z0-9_$]*)/g);
  console.log("variableNames", variableNames)
  // Replace the variable names with their values.
  const replacedString = variableNames.reduce((string, variableName) => {
    // Get the value of the variable.
    const variableValue = 0
    if (typeof window !== "undefined")
     variableValue = window[variableName];
    console.log("string, variableName, variableValue",string, variableName, variableValue,  )
    // Replace the variable name with its value.
    return string.replace(new RegExp(`\\b${variableName}\\b`, 'g'), variableValue);
  }, textAreaStringValue);

  // Evaluate the resulting expression.
  return eval(replacedString);
}

const textAreaStringValue = '1 + "aeSEA" + a * b';
const a = 2;
const b = 3;

const jsExpression = convertTextAreaStringToJsExpression(textAreaStringValue);
console.log("jsExpression", jsExpression)
// Evaluate the JS expression.
const result = eval(jsExpression);

console.log(result);