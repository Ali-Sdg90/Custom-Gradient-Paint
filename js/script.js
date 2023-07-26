const canvas = document.getElementById("painting-canvas");

let canvasSize = 20; // => 20 - 2 * spreadRadius
let spreadRadius = 4;
let colorRGB = [232, 62, 62];

for (let i = 0; i < canvasSize * canvasSize; i++) {
    const addBlock = document.createElement("div");
    addBlock.textContent = i;
    canvas.appendChild(addBlock);
}

const blocks = document.querySelectorAll("#painting-canvas div");

for (let i = 0; i < canvasSize * canvasSize; i++) {
    blocks[i].addEventListener("click", () => {
        console.log(blocks[i].textContent);

        spreadColor(i);
    });
}

// let rowPriority = [1, 2, 3, 4, 5 ,4, 3, 2, 1,
//                       1, 2, 3, 4, 3, 2, 1,
//                          1, 2, 3, 2, 1,
//                             1, 2, 1,
//                                1];

let priorityArray = [];
for (let direction = -1; direction <= 1; direction += 2) {
    let MaxPriority = spreadRadius + 1;
    for (let i = 0; i <= spreadRadius + 1; i++) {
        for (let j = 1; j <= MaxPriority; j++) {
            priorityArray.push(j / (spreadRadius + 1));
            if (j === MaxPriority) {
                for (let k = MaxPriority - 1; k >= 1; k--) {
                    priorityArray.push(k / (spreadRadius + 1));
                }
            }
        }
        MaxPriority--;
    }
}

console.log(priorityArray);
const spreadColor = (target) => {
    let blockCounter = 0;
    for (let direction = -1; direction <= 1; direction += 2) {
        for (let i = 0; i <= spreadRadius; i++) {
            for (let j = i; j < spreadRadius * 2 + 1 - i; j++) {
                const blockAdrs =
                    target - spreadRadius + j - i * canvasSize * direction;
                // console.log("->", blockAdrs);
                try {
                    const currentBackground = blocks[
                        blockAdrs
                    ].style.background
                    const currentAlpha = currentBackground.split(",")
                    console.log(blockAdrs,currentAlpha);

                    blocks[blockAdrs].style.background = `rgba(${
                        colorRGB[0]
                    }, ${colorRGB[1]}, ${colorRGB[2]}, ${
                        priorityArray[blockCounter++] + currentAlpha
                    })`;
                } catch (error) {}
            }
        }
    }

    // blocks[target].style.background = "blue";
};

const blockOpacity = () => {};
