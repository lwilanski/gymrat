# Użyj oficjalnego obrazu Pythona 3.11 jako obrazu bazowego
FROM python:3.11-slim as base

# Ustaw katalog roboczy w kontenerze
WORKDIR /app

# Zainstaluj Poetry
RUN pip install "poetry==1.8.2"

# Skopiuj pliki konfiguracyjne Poetry do katalogu roboczego
COPY pyproject.toml poetry.lock* ./

# Skonfiguruj Poetry do nie tworzenia wirtualnego środowiska i zainstaluj zależności
RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi --no-dev

# Skopiuj pozostałe pliki projektu do katalogu roboczego
COPY . .

# Zadeklaruj port, na którym będzie nasłuchiwała aplikacja
EXPOSE 8000

# Uruchom aplikację przy użyciu Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
