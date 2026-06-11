let currentStory = "";

async function generateStory() {

    const btn = document.getElementById("generateBtn");

    btn.disabled = true;
    btn.innerText = "Generating...";

    try {
        const prompt = document.getElementById("prompt").value;
        const genre = document.getElementById("genre").value;

        const response = await fetch(
            "http://localhost:5000/generate",
            {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    prompt,
                    genre
                })
            }
        );

        const data = await response.json();

        currentStory = data.story;

        document.getElementById("storyBox").innerText =
            currentStory;

    } catch(error) {
        alert("Failed to generate story");
        console.error(error);
    } finally {
        btn.disabled = false;
        btn.innerText = "Generate Story";
    }
}


function downloadPDF() {

    const btn = document.getElementById("pdfBtn");

    btn.disabled = true;
    btn.innerText = "Preparing PDF...";

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    const story =
        document.getElementById("storyBox").innerText;

    const lines =
        doc.splitTextToSize(story, 180);

    doc.text(lines, 10, 10);

    doc.save("MyStory.pdf");

    btn.innerText = "Downloaded ✓";

    setTimeout(() => {
        btn.innerText = "Download PDF";
        btn.disabled = false;
    }, 2000);
}

async function modifyStory(){

    const feedback =
        document.getElementById("feedback").value;

    const response = await fetch(
        "http://localhost:5000/modify",
        {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                story: currentStory,
                feedback: feedback
            })
        }
    );

    const data = await response.json();

    currentStory = data.story;

    document.getElementById("storyBox").innerText =
        currentStory;
}

let isSpeaking = false;

function toggleVoice() {

    const btn = document.getElementById("voiceBtn");

    if (isSpeaking) {
        speechSynthesis.cancel();
        isSpeaking = false;
        btn.innerText = "🔊 Read Story";
        return;
    }

    const story =
        document.getElementById("storyBox").innerText;

    if (!story) {
        alert("Generate a story first!");
        return;
    }

    const utterance =
        new SpeechSynthesisUtterance(story);

    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onend = () => {
        isSpeaking = false;
        btn.innerText = "🔊 Read Story";
    };

    speechSynthesis.speak(utterance);

    isSpeaking = true;
    btn.innerText = "⏹ Stop Reading";
}