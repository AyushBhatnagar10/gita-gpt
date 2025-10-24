# GeetaManthan+ Backend

FastAPI backend for the GeetaManthan+ spiritual companion application.

## Setup

1. Create a virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your actual configuration
```

4. Set up Supabase database:
```bash
# Get your connection string from Supabase dashboard
# Add it to your .env file

# Run migrations (after implementing them)
alembic upgrade head
```

5. Run the development server:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Project Structure

```
backend/
├── app/
│   ├── api/          # API endpoints
│   ├── core/         # Configuration and settings
│   ├── db/           # Database models and connection
│   ├── models/       # Pydantic models
│   ├── services/     # Business logic services
│   └── main.py       # FastAPI application
├── tests/            # Test files
├── requirements.txt  # Python dependencies
└── .env.example      # Environment variables template
```

## API Documentation

Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
