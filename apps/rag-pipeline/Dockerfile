FROM python:3.14.3-slim

WORKDIR /rag-pipeline

RUN pip install uv

COPY requirements.txt .

RUN uv pip install --no-cache--dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]