console.log("Email Writer Extension - Content Script Loaded.");

function  createAIButton(){
    const button = document.createElement('div');
    button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3';
    button.style.marginRight = '8px';
    button.innerHTML ='AI Reply';
    button.setAttribute('role','button');
    button.setAttribute('data-tooltip','Generate AI Reply');
    return button;
}
// Function to create a tone selection dropdown
function createToneSelector() {
    const toneSelect = document.createElement("select");
    toneSelect.className = "ai-tone-selector";
    toneSelect.style.marginRight = "8px";
    toneSelect.style.padding = "6px";
    toneSelect.style.border = "1px solid #ccc";
    toneSelect.style.borderRadius = "4px";
    toneSelect.style.fontSize = "14px";
    toneSelect.style.backgroundColor = "white";
    toneSelect.style.cursor = "pointer";

    const tones = ["None","Professional", "Casual", "Friendly", "Formal"];
    tones.forEach(tone => {
        const option = document.createElement("option");
        option.value = tone.toLowerCase();
        option.innerText = tone;
        toneSelect.appendChild(option);
        toneSelect.setAttribute('title','Select tone before generating reply');
    });

    return toneSelect;
}

function getEmailContent(){
    const selectors = [
        '.h7',
        '.a3s.aiL',
        '.gmail_quote',
        '[role="presentation"]'
    ];
    for (const selector of selectors){
        const content = document.querySelector(selector);
        if(content){
            return content.innerText.trim();
        }
        return '';
    }
}

function findComposeToolbar(){
    const selectors = [
        '.btC',
        '.aDh',
        '[role="toolbar"]',
        '.gU.Up'
    ];
    for (const selector of selectors){
        const toolbar = document.querySelector(selector);
        if(toolbar){
            return toolbar;
        }
        return null;
    }
}

function injectButton(){
    const existingButton = document.querySelector('.ai-reply-button');
    if(existingButton) existingButton.remove();

    const toolbar = findComposeToolbar();
    if(!toolbar){
        console.log("Toolbar not found");
        return;
    }

    console.log("Toolbar found, create AI button");

    // Creating and injecting tone selector dropdown
    const toneSelect = createToneSelector();
    toolbar.insertBefore(toneSelect, toolbar.firstChild);

    // injecting AI Reply button
    const button = createAIButton();
    button.classList.add('ai-reply-button');
    toolbar.insertBefore(button, toolbar.firstChild);

    button.addEventListener('click', async () => {
        try {
            button.innerHTML = 'Generating....';
            button.disabled = true;

            const emailContent = getEmailContent();
            const selectedTone = toneSelect.value; // Get selected tone

            console.log(`Generating reply with tone: ${selectedTone}`); 

            const response = await fetch('http://localhost:8080/api/email/generate',{
                method: 'POST',
                headers: {
                    'Content-Type':'application/json',
                },
                body: JSON.stringify({
                    emailContent: emailContent,
                    tone:selectedTone
                }),
                credentials: 'omit' // Ensure no cookies are sent
            });

            if(!response.ok){
                throw new Error('API Request Failed: ${response.status} ${response.statusText}');
            }

            const generatedReply = await response.text();
            console.log("Generated Reply:", generatedReply);

            const composeBox = document.querySelector('[role="textbox"][g_editable="true"]');

            if (composeBox){
                composeBox.focus();
                document.execCommand('insertText', false, generatedReply);
            }else {
                console.error("Compose box was not found.");
            }
        } catch (error) {
            console.error(error);
            alert('Failed to generate reply: ${error.message}');
        } finally {
            button.innerHTML = 'AI Reply';
            button.disabled= false;
        }
    });

    toolbar.insertBefore(button, toolbar.firstChild);
}
const observer = new MutationObserver((mutations) => {
    for(const mutation of mutations){
        const addedNodes = Array.from(mutation.addedNodes);
        const hasComposedElements = addedNodes.some(node =>
            node.nodeType === Node.ELEMENT_NODE && 
            (node.matches('.aDh, .btC, [role="dialog"]') ||  node.querySelector('.aDh, .btC, [role="dialog"]'))
        );

        if( hasComposedElements){
            console.log("Compose Window Detected");
            setTimeout(injectButton, 500);
        }
    }
})

observer.observe(document.body, {
    childList: true,
    subtree: true
})