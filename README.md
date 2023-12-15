# The School Of AI - Chat


The backend model is OpenAI Compatible Model, It's a Mistral 7B V0.1 Finetuned on Alpaca GPT4 Dataset

```
pip install vllm transformers
```

Start the LLM Server

```
python -m vllm.entrypoints.openai.api_server \
    --model "satyajitghana/mistral-7b-v0.1-alpaca-chat" \
    --chat-template ./chat_templates/template_alpaca.jinja
```

Start the Frontend

```
npm run dev
```

## UI

![tsai-chat](assets/tsai-chat.png)