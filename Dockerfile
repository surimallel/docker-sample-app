FROM python:3.12-slim

LABEL org.opencontainers.image.title="Docker Sample App"
LABEL org.opencontainers.image.description="A student-friendly Dockerfile demo"

WORKDIR /app

ADD styles.css ./styles.css
COPY index.html app.js server.py ./

RUN useradd --create-home --uid 10001 appuser

ENV PORT=8099
EXPOSE 8099

USER appuser

ENTRYPOINT ["python", "server.py"]
CMD ["--host", "0.0.0.0"]
