const site = window.location.hostname;

let dragEnabled = false;
let currentElement = null;
let mouseStartX = 0, mouseStartY = 0, mouseEndX = 0, mouseEndY = 0;
let elementStartX = 0, elementStartY = 0;
let highestZIndex = 1000;
let originalBorders = new Map();

document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "z") {
        dragEnabled = !dragEnabled;
        alert(dragEnabled ? "WebFlex: Dragging Mode Enabled ✅" : "WebFlex: Dragging Mode Disabled ❌");

        if (dragEnabled) {
            document.addEventListener("click", blockClicks, true);
            document.addEventListener("mouseover", hoverEffect);
            document.addEventListener("mouseout", resetHoverEffect);
            document.body.style.pointerEvents = "none";
            document.querySelectorAll("*").forEach(element => {
                element.style.pointerEvents = "auto";
            });
        } else {
            document.removeEventListener("click", blockClicks, true);
            document.removeEventListener("mouseover", hoverEffect);
            document.removeEventListener("mouseout", resetHoverEffect);
            document.body.style.pointerEvents = "";
            document.querySelectorAll("*").forEach(element => {
                if (originalBorders.has(element)) {
                    element.style.border = originalBorders.get(element) || "none";
                } else if (element.style.border === "dashed 3px rgb(174, 231, 255)" || 
                           element.style.border === "dashed 3px rgba(0, 179, 255, 0.42)") {
                    element.style.border = "none";
                }
            });

            originalBorders.clear();
        }
    }
});

function hoverEffect(e) {
    if (!dragEnabled || e.target.tagName.toLowerCase() !== "div") return;

    if (!originalBorders.has(e.target)) {
        originalBorders.set(e.target, e.target.style.border);
    }
    
    e.target.style.border = "dashed 3px rgb(174, 231, 255)";
}

function resetHoverEffect(e) {
    if (!dragEnabled || e.target.tagName.toLowerCase() !== "div") return;

    if (originalBorders.has(e.target)) {
        e.target.style.border = originalBorders.get(e.target);
    } else {
        e.target.style.border = "";
    }
}

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
        highestZIndex++;
        currentElement.style.zIndex = highestZIndex; 
        currentElement.style.position = "fixed";
        currentElement.style.boxSizing = "border-box";
        currentElement.style.width = rect.width + "px";
        currentElement.style.height = rect.height + "px";
        currentElement.style.pointerEvents = "auto";
        currentElement.style.border = "dashed 3px #00b2ff";
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
        currentElement.style.border = "dashed 3px rgba(0, 179, 255, 0.42)";
        currentElement.style.transition = "";
        Array.from(currentElement.children).forEach(child => {
            child.style.transition = "";
        });
        currentElement.style.pointerEvents = "";
    }
    currentElement = null;
}
