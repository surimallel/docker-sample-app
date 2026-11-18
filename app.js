const copyButton = document.querySelector("#copy-command");
const copyLabel = document.querySelector("#copy-label");
const commands = "docker build -t docker-sample-app .\ndocker run --rm -p 8099:8099 docker-sample-app";

copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(commands);
    copyLabel.textContent = "COPIED!";
    window.setTimeout(() => {
      copyLabel.textContent = "COPY COMMANDS";
    }, 1800);
  } catch (error) {
    copyLabel.textContent = "COPY UNAVAILABLE";
    window.setTimeout(() => {
      copyLabel.textContent = "COPY COMMANDS";
    }, 1800);
  }
});
