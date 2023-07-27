const canvas = document.querySelector(".painting-canvas");

let spreadRadius = 4;
let canvasSizeX = 20; // - 2 * spreadRadius;
let colorRGB = [232, 62, 62];

let showNumbers = false;

let blocks = document.querySelectorAll(".painting-canvas div");

let blockCounter = 0;

let canvasSizeY = Math.ceil(
    window.innerHeight / (window.innerWidth / canvasSizeX)
);
document.documentElement.style.setProperty(
    "--blockSize",
    `${100 / canvasSizeX}vw`
);
document.documentElement.style.setProperty(
    "--gridTemplate",
    `repeat(${canvasSizeX}, 1fr)`
);

const defineBlocks = (startPoint, endPoint) => {
    try {
        blocks = document.querySelectorAll(".painting-canvas div");

        // console.clear();
        // console.log(canvasSizeX * (canvasSizeY + spreadRadius));

        for (let i = startPoint; i < endPoint; i++) {
            if (i < canvasSizeX * spreadRadius) {
                blocks[i].style.display = "none";
            } else {
                if (showNumbers) blocks[i].textContent = ++blockCounter; // toggle numbers
                blocks[i].style.fontSize = `${30 / canvasSizeX}vw`; // toggle numbers
                blocks[i].addEventListener("click", () => spreadColor(i));
            }
        }
    } catch (error) {}
};

const posibleChangeInYBlocks = () => {
    let nowcanvasSizeY = Math.ceil(
        window.innerHeight / (window.innerWidth / canvasSizeX)
    );

    if (nowcanvasSizeY > canvasSizeY) {
        console.log("IN---------------------------------");
        for (let i = canvasSizeY; i < nowcanvasSizeY; i++) {
            for (let j = 0; j < canvasSizeX; j++) {
                const addBlock = document.createElement("div");
                addBlock.style.background = "rgba(0, 0, 0, 0)";
                canvas.appendChild(addBlock);
            }
        }
        defineBlocks(
            canvasSizeX * (canvasSizeY + spreadRadius),
            canvasSizeX * (nowcanvasSizeY + spreadRadius)
        );
        canvasSizeY = nowcanvasSizeY;
    }
};

const checkHightBlocks = () => {
    console.log("Change tab size");

    posibleChangeInYBlocks();
};

window.addEventListener("resize", checkHightBlocks);
checkHightBlocks();

// let rowPriority = [1, 2, 3, 4, 5 ,4, 3, 2, 1,
//                       1, 2, 3, 4, 3, 2, 1,
//                          1, 2, 3, 2, 1,
//                             1, 2, 1,
//                                1,
//                    1, 2, 3, 4, 5 ,4, 3, 2, 1,
//                       1, 2, 3, 4, 3, 2, 1,
//                          1, 2, 3, 2, 1,
//                             1, 2, 1,
//                                1]; // for spreadRadius === 4

let priorityArray = [];

const pushToPriorityArray = (value, i) => {
    if (i === 0) {
        priorityArray.push(value / 2);
    } else {
        priorityArray.push(value);
    }
};

const setPriorityArray = () => {
    priorityArray = [];
    for (let direction = -1; direction <= 1; direction += 2) {
        let MaxPriority = spreadRadius + 1;
        for (let i = 0; i <= spreadRadius + 1; i++) {
            for (let j = 1; j <= MaxPriority; j++) {
                pushToPriorityArray(j / (spreadRadius + 1), i);
                if (j === MaxPriority) {
                    for (let k = MaxPriority - 1; k >= 1; k--) {
                        pushToPriorityArray(k / (spreadRadius + 1), i);
                    }
                }
            }
            MaxPriority--;
        }
    }
};

const createGround = () => {
    canvas.innerHTML = "";

    for (let i = 0; i < canvasSizeX * (canvasSizeY + spreadRadius); i++) {
        const addBlock = document.createElement("div");
        addBlock.style.background = "rgba(0, 0, 0, 0)";
        canvas.appendChild(addBlock);
    }

    defineBlocks(0, canvasSizeX * (canvasSizeY + spreadRadius));

    setPriorityArray();
};

createGround();

const spreadColor = (target) => {
    let blockCounter = 0;
    let spreadRowSum = 0;
    for (let direction = -1; direction <= 1; direction += 2) {
        for (let i = 0; i <= spreadRadius; i++) {
            let spreadRow = Math.trunc(
                (target + i * canvasSizeX * direction) / canvasSizeX
            );
            for (let j = i; j < spreadRadius * 2 + 1 - i; j++) {
                const blockAdrs =
                    target - spreadRadius + j - i * canvasSizeX * direction;
                try {
                    const blockBackground = blocks[blockAdrs].style.background;
                    const blockAlphaValue = parseFloat(
                        blockBackground.substring(
                            blockBackground.lastIndexOf(",") + 1,
                            blockBackground.lastIndexOf(")")
                        )
                    );
                    if (!spreadRowSum) {
                        spreadRowSum = spreadRow * 2;
                    }
                    if (
                        Math.trunc(blockAdrs / canvasSizeX) + spreadRow ===
                        spreadRowSum
                    ) {
                        blocks[blockAdrs].style.background = `rgba(${
                            colorRGB[0]
                        }, ${colorRGB[1]}, ${colorRGB[2]}, ${
                            priorityArray[blockCounter] + blockAlphaValue
                        })`;
                        // console.log(
                        //     "NO:",
                        //     ++numCounter,
                        //     ".",
                        //     priorityArray[blockCounter],
                        //     "+",
                        //     blockAlphaValue,
                        //     "=>",
                        //     priorityArray[blockCounter] + blockAlphaValue
                        // );
                    }
                } catch (error) {}
                blockCounter++;
            }
        }
    }
};

const settingPage = document.getElementById("setting");
const settingMenu = document.getElementById("setting__menu");

let settingClicked = 0;

document.getElementById("setting-btn").addEventListener("click", function () {
    if (settingClicked++ % 2 === 0) {
        settingPage.style.transition = "opacity 0.3s";
        settingPage.style.display = "grid";
        setTimeout(() => {
            settingPage.style.opacity = "1";
        }, 0);
    } else {
        setTimeout(() => {
            settingPage.style.display = "none";
        }, 300);
        settingPage.style.opacity = "0";
    }

    document.getElementById("setting-btn").style.transform = `rotate(${
        settingClicked * 90
    }deg)`;
});

const canvasSizeXInput = document.getElementById("setting__menu__canvas-size");
const canvasColorInput = document.getElementById("setting__menu__canvas-color");
const spreadRadiusInput = document.getElementById(
    "setting__menu__spread-radius"
);
const spreadRadiusValue = document.getElementById(
    "setting__menu__spread-radius__value"
);
const showBordersInput = document.getElementById("setting__menu__show-borders");
const showNumbersInput = document.getElementById("setting__menu__show-numbers");
const applySetting = document.getElementById("setting__menu__apply");

canvasSizeXInput.value = canvasSizeX;
canvasColorInput.value = "#e83e3e";
spreadRadiusInput.max = canvasSizeXInput.value / 2;
spreadRadiusInput.value = spreadRadius;
spreadRadiusValue.value = spreadRadius;
showBordersInput.checked = true;

const hexToRgb = (hex) =>
    hex
        .replace(
            /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
            (m, r, g, b) => "#" + r + r + g + g + b + b
        )
        .substring(1)
        .match(/.{2}/g)
        .map((x) => parseInt(x, 16));

applySetting.addEventListener("click", () => {
    // console.log(canvasSizeXInput.value);
    // console.log(`rgb(${hexToRgb(canvasColorInput.value).join(", ")})`);
    // console.log(hexToRgb(canvasColorInput.value));
    // console.log(spreadRadiusInput.value);
    // console.log(showBordersInput.checked);
    // console.log(showNumbersInput.checked);

    canvasSizeX = canvasSizeXInput.value;
    document.documentElement.style.setProperty(
        "--blockSize",
        `${100 / canvasSizeX}vw`
    );
    document.documentElement.style.setProperty(
        "--gridTemplate",
        `repeat(${canvasSizeX}, 1fr)`
    );
    spreadRadius = Number(spreadRadiusInput.value);
    showNumbers = showNumbersInput.checked;
    blockCounter = 0;
    createGround();
    colorRGB = hexToRgb(canvasColorInput.value);
    posibleChangeInYBlocks();
    if (showBordersInput.checked) {
        canvas.classList.add("show-borders");
    } else {
        canvas.classList.remove("show-borders");
    }
});

spreadRadiusInput.addEventListener("input", () => {
    spreadRadiusValue.value = spreadRadiusInput.value;
});

canvasSizeXInput.addEventListener("change", () => {
    spreadRadiusInput.max = canvasSizeXInput.value / 2;
});
