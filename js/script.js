const canvas = document.getElementById("painting-canvas");

let spreadRadius = 10;
let canvasSize = 30; // - 2 * spreadRadius;
let maxSpreadRadius = canvasSize / 2;
let colorRGB = [232, 62, 62];

document.documentElement.style.setProperty(
    "--blockSize",
    `${100 / canvasSize}vw`
);
document.documentElement.style.setProperty(
    "--gridTemplate",
    `repeat(${canvasSize}, 1fr)`
);

for (let i = 0; i < canvasSize * canvasSize; i++) {
    const addBlock = document.createElement("div");
    // addBlock.textContent = i; // toggle numbers
    addBlock.style.background = "rgba(0, 0, 0, 0)";
    canvas.appendChild(addBlock);
}

const blocks = document.querySelectorAll("#painting-canvas div");

for (let i = 0; i < canvasSize * canvasSize; i++) {
    if (i < canvasSize * spreadRadius) {
        blocks[i].style.display = "none";
    } else {
        blocks[i].addEventListener("click", () => {
            spreadColor(i);
        });
    }
}

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

const pushToPriorityArray = (value, i) => {
    if (i === 0) {
        priorityArray.push(value / 2);
    } else {
        priorityArray.push(value);
    }
};

let priorityArray = [];
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

// console.log(priorityArray);
const spreadColor = (target) => {
    let blockCounter = 0;
    let spreadRowSum = 0;
    for (let direction = -1; direction <= 1; direction += 2) {
        for (let i = 0; i <= spreadRadius; i++) {
            let spreadRow = Math.trunc(
                (target + i * canvasSize * direction) / canvasSize
            );
            // console.log(spreadRow);
            for (let j = i; j < spreadRadius * 2 + 1 - i; j++) {
                const blockAdrs =
                    target - spreadRadius + j - i * canvasSize * direction;
                try {
                    const blockBackground = blocks[blockAdrs].style.background;
                    const blockAlphaValue = parseFloat(
                        blockBackground.substring(
                            blockBackground.lastIndexOf(",") + 1,
                            blockBackground.lastIndexOf(")")
                        )
                    );
                    // console.log(blockAdrs, blockAlphaValue);
                    console.log(Math.trunc(blockAdrs / canvasSize), spreadRow);
                    if (!spreadRowSum) {
                        spreadRowSum = spreadRow * 2;
                    }
                    if (
                        Math.trunc(blockAdrs / canvasSize) + spreadRow ===
                        spreadRowSum
                    ) {
                        blocks[blockAdrs].style.background = `rgba(${
                            colorRGB[0]
                        }, ${colorRGB[1]}, ${colorRGB[2]}, ${
                            priorityArray[blockCounter] + blockAlphaValue
                        })`;
                    }

                    // blockCounter++;
                } catch (error) {}
                blockCounter++;
            }
            console.log("NEXT");
        }
    }
};

const blockOpacity = () => {};
