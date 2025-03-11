const site = window.location.hostname;

let dragEnabled = false;
let currentElement = null;
let mouseStartX = 0, mouseStartY = 0, mouseEndX = 0, mouseEndY = 0;
let elementStartX = 0, elementStartY = 0;

document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "z") {
        dragEnabled = !dragEnabled;
        alert(dragEnabled ? "WebFlex: Dragging Mode Enabled ✅" : "WebFlex: Dragging Mode Disabled ❌");
        if (dragEnabled) {
            document.addEventListener("click", blockClicks, true);
            document.body.style.pointerEvents = "none";
            document.querySelectorAll("* ").forEach(element => {
                element.style.pointerEvents = "auto";
            });
        } else {
            document.removeEventListener("click", blockClicks, true);
            document.body.style.pointerEvents = "";
            document.querySelectorAll("*").forEach(element => {
                element.style.pointerEvents = "";
            });
        }
    }
});

document.addEventListener("mousedown", mouseDown);

function blockClicks(e) {
    e.stopPropagation();
    e.preventDefault();
}

function mouseDown(e) {
    if (!dragEnabled || e.target.tagName.toLowerCase() !== "div") return;
    e.preventDefault();
    currentElement = e.target;
    if (currentElement === document.body || !currentElement) return;
    if (currentElement) {
        mouseStartX = e.clientX;
        mouseStartY = e.clientY;
        const rect = currentElement.getBoundingClientRect();
        elementStartX = rect.left;
        elementStartY = rect.top;
        currentElement.style.transition = "none";
        Array.from(currentElement.children).forEach(child => {
            child.style.transition = "none";
        });
        currentElement.style.position = "fixed";
        currentElement.style.zIndex = 9999;
        currentElement.style.boxSizing = "border-box";
        currentElement.style.width = rect.width + "px";
        currentElement.style.height = rect.height + "px";
        currentElement.style.pointerEvents = "auto";
        document.addEventListener("mousemove", mouseMove);
        document.addEventListener("mouseup", mouseUp);
    }
}

function mouseMove(e) {
    if (!currentElement) return;
    e.preventDefault();
    mouseEndX = e.clientX;
    mouseEndY = e.clientY;
    currentElement.style.left = (elementStartX + (mouseEndX - mouseStartX)) + "px";
    currentElement.style.top = (elementStartY + (mouseEndY - mouseStartY)) + "px";
}

function mouseUp() {
    document.removeEventListener("mousemove", mouseMove);
    if (currentElement) {
        currentElement.style.transition = "";
        Array.from(currentElement.children).forEach(child => {
            child.style.transition = "";
        });
        currentElement.style.pointerEvents = "";
    }
    currentElement = null;
}
