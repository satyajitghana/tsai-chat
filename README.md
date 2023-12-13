# The School Of AI - Chat

**The repo is still a WIP**

```
npm run dev
```

The backend model is OpenAI Compatible Model, It's a Mistral 7B V0.1 Finetuned on Alpaca GPT4 Dataset

Start the LLM Server

```
python -m vllm.entrypoints.openai.api_server \
    --model "mistral-7b-v0.1-alpaca-chat" \
    --chat-template ./template_alpaca.jinja
```

## UI

![tsai-chat](assets/tsai-chat.png)