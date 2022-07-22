class Chatbox {
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button'),
            speakButton: document.querySelector('.speak__button'),
        }

        this.state = false;
        this.messages = [];
        this.updateConfiguration();
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recorder = new SpeechRecognition();
        this.initVoiceBot(this.args.speakButton);
    }

    async updateConfiguration() {
        const data = await fetch('./config.json');
        const json = await data.json();
        const {
            endpoint
        } = json;
        this.endpoint = endpoint;
    }

    display() {
        const {
            openButton,
            chatBox,
            sendButton
        } = this.args;

        openButton.addEventListener('click', () => this.toggleState(chatBox))

        sendButton.addEventListener('click', () => this.onSendButton(chatBox))

        const node = chatBox.querySelector('input');
        node.addEventListener("keyup", ({
            key
        }) => {
            if (key === "Enter") {
                this.onSendButton(chatBox)
            }
        })
    }

    toggleState(chatbox) {
        this.state = !this.state;

        // show or hides the box
        if (this.state) {
            chatbox.classList.add('chatbox--active')
        } else {
            chatbox.classList.remove('chatbox--active')
        }
    }

    onSendButton(chatbox) {
        var textField = chatbox.querySelector('input');
        let text1 = textField.value
        if (text1 === "") {
            return;
        }

        let msg1 = {
            name: "User",
            message: text1
        }
        this.messages.push(msg1);

        fetch(this.endpoint, {
                method: 'POST',
                body: JSON.stringify({
                    message: text1
                }),
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            .then(r => r.json())
            .then(r => {
                let msg2 = {
                    name: "Sam",
                    message: r.answer
                };
                this.messages.push(msg2);
                this.updateChatText(chatbox)
                textField.value = ''

            }).catch((error) => {
                console.error('Error:', error);
                this.updateChatText(chatbox)
                textField.value = ''
            });
    }

    async onSpeakButton(message) {
        const {
            chatBox
        } = this.args;
        let response = "Sorry, I did not understand that.";;
        try {
            const res = await fetch(this.endpoint, {
                method: 'POST',
                body: JSON.stringify({
                    message
                }),
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            const json = await res.json();
            ({
                response: message
            } = json)
        } catch (e) {
            console.log(e)
        }
        const speech = new SpeechSynthesisUtterance();
        speech.text = response;
        let msg2 = {
            name: "Sam",
            message: speech.text
        };
        this.messages.push(msg2);
        this.updateChatText(chatBox)
        speech.volume = 1;
        speech.rate = 1;
        speech.pitch = 1;
        window.speechSynthesis.speak(speech);
    }


    initVoiceBot(speakButton) {
        this.recorder.onstart = () => {
            console.log('Voice activated');
        };
        this.recorder.onresult = (event) => {
            const resultIndex = event.resultIndex;
            const transcript = event.results[resultIndex][0].transcript;
            this.messages.push({
                name: "User",
                message: transcript
            });
            const {
                chatBox
            } = this.args;
            this.updateChatText(chatBox);
            this.onSpeakButton(transcript);
        };
        speakButton.addEventListener('click', () => {
            this.recorder.start();
        });
    }
    updateChatText(chatbox) {
        var html = '';
        this.messages.slice().reverse().forEach(function (item, index) {
            if (item.name === "Sam") {
                html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>'
            } else {
                html += '<div class="messages__item messages__item--operator">' + item.message + '</div>'
            }
        });

        const chatmessage = chatbox.querySelector('.chatbox__messages');
        chatmessage.innerHTML = html;
    }
}


const chatbox = new Chatbox();
chatbox.display();