const encodeInput: HTMLElement | any = document.getElementById("encode-input")
const decodeInput: HTMLElement | any = document.getElementById("decode-input")

const encodeOutput: HTMLElement | any = document.getElementById("encode-output")
const decodeOutput: HTMLElement | any = document.getElementById("decode-output")

const encodeCopyButton: HTMLElement | any = document.getElementById("encode-copy-button")
const decodeCopyButton: HTMLElement | any = document.getElementById("decode-copy-button")

const encodeRegxExpression: RegExp = /(?<!img aria-label=")(\:extraZoey(?:Up|Left|Right|)\:)/g;

const upRegxExpression: RegExp = /(extraZoeyUp)/;
const leftRegxExpression: RegExp = /(extraZoeyLeft)/;
const rightRegxExpression: RegExp = /(extraZoeyRight)/;
const normalRegxExpression: RegExp = /(extraZoey)/;

function encode() {
    let outputArray: string[] = [];
    let binaryString: string = "";

    for (let i = 0; i < encodeInput.innerHTML.length; i++) {
        binaryString += encodeInput.innerHTML[i].charCodeAt(0).toString(2).padStart(8, '0');;
    }

    let binaryArray = binaryString.match(/.{2}/g);

    if (binaryArray === null) {
        return;
    }
    let chunkIndex = 0;
    outputArray[chunkIndex] = "";

    for (let i = 0; i < binaryArray.length; i++) {
        if (outputArray[chunkIndex].length + 16 > 2000) {
            chunkIndex += 1;
            outputArray[chunkIndex] = "";
        }

        if (binaryArray[i] == "00") {
            outputArray[chunkIndex] += createEmojiImages(":extraZoeyUp:");
        }
        else if (binaryArray[i] == "01") {
            outputArray[chunkIndex] += createEmojiImages(":extraZoeyLeft:");
        }
        else if (binaryArray[i] == "10") {
            outputArray[chunkIndex] += createEmojiImages(":extraZoeyRight:");
        }
        else if (binaryArray[i] == "11") {
            outputArray[chunkIndex] += createEmojiImages(":extraZoey:");
        }
    }

    console.log(outputArray);
    let output: string = "";
    outputArray.forEach(element => {
        output += '<div class="text-output-segment">' + element + '</div>'
    });
    encodeOutput.innerHTML = output;
}
function findTextEmojis(input:string) {
    let output: Array<string> = new Array<string>;
    let tempArray;
    while ((tempArray = encodeRegxExpression.exec(input)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (tempArray.index === encodeRegxExpression.lastIndex) {
            encodeRegxExpression.lastIndex++;
        }
        
        tempArray.forEach((match, groupIndex) => {
            // Cull the second group... not sure why it exists but whatever
            if (groupIndex === 1) {
                return;
            }
            output.push(match);
        });
    }
    return output;
}
function decode() {
    let output: string = "";
    let binaryString: string = "";
    let emojiArray: Array<string> = new Array<string>;

    emojiArray = findTextEmojis(decodeInput.innerHTML);

    // Old encoding is being deprecated, so this is the new encoding style.
    emojiArray.forEach(emoji => {
        if (emoji == ":extraZoeyUp:") {
            binaryString += "00"
        }
        else if (emoji == ":extraZoeyLeft:") {
            binaryString += "01"
        }
        else if (emoji == ":extraZoeyRight:") {
            binaryString += "10"
        }
        else if (emoji == ":extraZoey:") {
            binaryString += "11"
        }
    });
    // Split the binary into segments of 8 bits
    let binaryArray = binaryString.match(/.{8}/g);

    if (binaryArray !== null) {
        // Thanks https://javascript.plainenglish.io/how-to-convert-from-binary-to-text-in-javascript-3e881c7fd8c7
        output = binaryArray.map(e => String.fromCharCode(parseInt(e, 2))).join("");
    }
    
    console.log(output);

    decodeOutput.innerHTML = output;
}
function createEmojiImages(text:string) {
    let output: Array<string> = new Array<string>;

    findTextEmojis(text).forEach((emoji) => {
        if (emoji == ":extraZoeyUp:") {
            output.push('<img alt=":extraZoeyUp:" src="ZoeyUp.webp" class="emoji">');
        }
        else if (emoji == ":extraZoeyLeft:") {
            output.push('<img alt=":extraZoeyLeft:" src="ZoeyLeft.webp" class="emoji">');
        }
        else if (emoji == ":extraZoeyRight:") {
            output.push('<img alt=":extraZoeyRight:" src="ZoeyRight.webp" class="emoji">');
        }
        else if (emoji == ":extraZoey:") {
            output.push('<img alt=":extraZoey:" src="Zoey.webp" class="emoji">');
        }
    });

    return output.join("");
}

// Whenever text is put into decodeInput, change them into emojis. Only run once to avoid infinite loop
decodeInput.addEventListener("DOMSubtreeModified", fixDecodeEmojis, {once:true});  

function fixDecodeEmojis() {
    decodeInput.innerHTML = createEmojiImages(decodeInput.innerHTML);
    // Add the listener back now that were done modifying decodeInput
    decodeInput.addEventListener("DOMSubtreeModified", fixDecodeEmojis, {once:true});  
}

function copyEncodedOutput() {    
    let text = findTextEmojis(encodeOutput.innerHTML).join("");
    console.log("test")

    // Copy the text inside the text field
    navigator.clipboard.writeText(text);

    encodeCopyButton.innerHTML = "Copied!";

    setTimeout(function(){
        encodeCopyButton.innerHTML = "Copy";
    }, 1500);
}

function copyDecodedOutput() {
    let text = decodeOutput.innerHTML;

    // Copy the text inside the text field
    navigator.clipboard.writeText(text);

    decodeCopyButton.innerHTML = "Copied!";

    setTimeout(function(){
        decodeCopyButton.innerHTML = "Copy";
    }, 1500);
}