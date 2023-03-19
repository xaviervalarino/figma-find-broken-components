const socket = new WebSocket("ws://localhost:8081");
socket.addEventListener("message", ({ data }) => {
  const { event, file } = JSON.parse(data);
  console.log("reload event", event, file);
  if (event == "reload") {
    if (file === "iframe.html" || file === "ui.html") {
      window.location.reload();
    }
  }
  if (file === "code.js") {
    parent.postMessage({ pluginMessage: "code.js reloaded" }, "*");
  }
});
