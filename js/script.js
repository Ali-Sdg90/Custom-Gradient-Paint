const canvas = document.getElementById("painting-canvas");

let spreadRadius = 4;
let canvasSizeX = 20; // - 2 * spreadRadius;
let colorRGB = [232, 62, 62];

let blocks = document.querySelectorAll("#painting-canvas div");

let canvasSizeY = Math.ceil(
    window.innerHeight / (window.innerWidth / canvasSizeX)
);
let numberYblocks = canvasSizeY;
console.log("Y:", numberYblocks);

document.documentElement.style.setProperty(
    "--blockSize",
    `${100 / canvasSizeX}vw`
);
document.documentElement.style.setProperty(
    "--gridTemplate",
    `repeat(${canvasSizeX}, 1fr)`
);

const blockClickHandler = (target) => {
    spreadColor(target);
    console.log("CLICKKK");
};

let errorCounter = 0;

const defineBlocks = (startPoint, endPoint) => {
    try {
        blocks = document.querySelectorAll("#painting-canvas div");

        console.clear();
        console.log(canvasSizeX * (canvasSizeY + spreadRadius));

        for (let i = startPoint; i < endPoint; i++) {
            if (i < canvasSizeX * spreadRadius) {
                blocks[i].style.display = "none";
            } else {
                if (!blocks[i].hasEventListener) {
                    console.log("IN");
                    // blocks[i].removeEventListener("click", blockClickHandler);
                    blocks[i].addEventListener("click", () =>
                        blockClickHandler(i)
                    );
                }
            }
        }
        console.log("ERROR", errorCounter++);
    } catch (error) {
        console.clear();
    }
};

const checkHightBlocks = () => {
    console.log("Change tab size");

    let nowNumberYblocks = Math.ceil(
        window.innerHeight / (window.innerWidth / canvasSizeX)
    );

    if (nowNumberYblocks > numberYblocks) {
        console.log("IN---------------------------------");
        for (let i = numberYblocks; i < nowNumberYblocks; i++) {
            for (let j = 0; j < canvasSizeX; j++) {
                const addBlock = document.createElement("div");
                // addBlock.textContent = i; // toggle numbers
                addBlock.style.background = "rgba(0, 0, 0, 0)";
                canvas.appendChild(addBlock);
            }
        }
        // Temp
        // try {
        //     blocks = document.querySelectorAll("#painting-canvas div");

        //     console.clear();
        //     console.log(canvasSizeX * (canvasSizeY + spreadRadius));

        //     for (
        //         let i = canvasSizeX * (numberYblocks + spreadRadius);
        //         i < canvasSizeX * (nowNumberYblocks + spreadRadius);
        //         i++
        //     ) {
        //         if (i < canvasSizeX * spreadRadius) {
        //             blocks[i].style.display = "none";
        //         } else {
        //             if (!blocks[i].hasEventListener) {
        //                 console.log("IN");
        //                 // blocks[i].removeEventListener("click", blockClickHandler);
        //                 blocks[i].addEventListener("click", () =>
        //                     blockClickHandler(i)
        //                 );
        //             }
        //         }
        //     }
        //     console.log("ERROR", errorCounter++);
        // } catch (error) {
        //     console.clear();
        // }
        // Temp
        defineBlocks(
            canvasSizeX * (numberYblocks + spreadRadius),
            canvasSizeX * (nowNumberYblocks + spreadRadius)
        );
        numberYblocks = nowNumberYblocks;
    }
    console.log("NewY", canvasSizeY);
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
    console.log("EMPTY:", priorityArray.length);
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
    console.log("Full:", priorityArray.length);

    // console.log(priorityArray);
};

const createGround = () => {
    canvas.innerHTML = "";

    console.log("IMP:", canvasSizeX, canvasSizeY, spreadRadius);
    for (let i = 0; i < canvasSizeX * (canvasSizeY + spreadRadius); i++) {
        const addBlock = document.createElement("div");
        // addBlock.textContent = i; // toggle numbers
        addBlock.style.background = "rgba(0, 0, 0, 0)";
        canvas.appendChild(addBlock);
    }

    defineBlocks(0, canvasSizeX * (numberYblocks + spreadRadius));

    setPriorityArray();
};

createGround();

// console.log(priorityArray);
const spreadColor = (target) => {
    let numCounter = 0;
    let blockCounter = 0;
    let spreadRowSum = 0;
    for (let direction = -1; direction <= 1; direction += 2) {
        for (let i = 0; i <= spreadRadius; i++) {
            let spreadRow = Math.trunc(
                (target + i * canvasSizeX * direction) / canvasSizeX
            );
            // console.log(spreadRow);
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
                    // console.log(blockAdrs, blockAlphaValue);
                    // console.log(Math.trunc(blockAdrs / canvasSizeX), spreadRow);
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

                    // blockCounter++;
                } catch (error) {}
                blockCounter++;
            }
            // console.log("NEXT");
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
    createGround();
    colorRGB = hexToRgb(canvasColorInput.value);
});

spreadRadiusInput.addEventListener("input", () => {
    spreadRadiusValue.value = spreadRadiusInput.value;
});

canvasSizeXInput.addEventListener("change", () => {
    spreadRadiusInput.max = canvasSizeXInput.value / 2;
});
