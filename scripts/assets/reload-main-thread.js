console.clear();

function onMessageWrapper(onmessageFn) {
  return (msg) => {
    if (onmessageFn) {
      onmessageFn(msg);
    }
    if (msg === "reload sandbox") {
      console.log('reloading')
      getCode();
    }
  };
}

async function getCode() {
  const got = await fetch("http://localhost:8000/code.remote.js");
  const file = await got.text();
  console.clear();
  new Function("__html__", file)(__html__);
  figma.ui.onmessage = onMessageWrapper(figma.ui.onmessage);
}

getCode();
